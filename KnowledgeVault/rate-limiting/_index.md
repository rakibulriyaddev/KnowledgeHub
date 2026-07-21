---
id: rate-limiting
title: "Rate Limiting"
created: 2026-07-11
modified: 2026-07-22
tags: [api-design, resilience, distributed-systems, traffic-management]
parent: reliability-security
children: []
status: draft
---

## Overview

Rate limiting caps "how many requests per unit of time" a client can make, protecting a system from abuse, overload, and one user hogging resources. The Twitter API allows 300 requests every 15 minutes and GitHub allows 5,000 per hour, exactly so one user or bot can't break the whole service.

## Key Concepts

- Token bucket — allows bursts, smooths the average rate, the most common default.
- Leaky bucket — steady outflow, works like a queue, smooths bursts away.
- Fixed window counter — simple, but has a boundary double-burst problem.
- Sliding window log/counter — exact (log) or fast-but-approximate (counter, used by Cloudflare).
- Distributed rate limiting — needs a shared counter (usually Redis) across servers.
- HTTP 429 response — with `Retry-After` and `X-RateLimit-*` headers.

## Core Knowledge

Rate limiting exists to stop abuse, defend against DDoS, keep usage fair, control cost, keep the service stable, and enforce plan tiers. Five methods are common: **token bucket** (tokens refill at a fixed rate, each request uses one, the bucket can start full so bursts are allowed while the average stays smooth — the most flexible, uses very little memory per user); **leaky bucket** (requests wait in line and leak out at a steady rate — no bursts, purely smooth output); **fixed window counter** (simplest, but a request right before and right after a window boundary can double the real limit); **sliding window log** (logs every request's time for perfect accuracy, at a high memory cost); and **sliding window counter** (a fixed window weighted by part of the previous window — approximate but cheap on memory, Cloudflare's choice).

Limits can be scoped by IP (DDoS defense), user ID, API key (SaaS plan tiers), endpoint (stricter on costly actions), or a mix of these. **Caution:** an in-memory counter works fine for a single server, but with N servers each keeping its own count, the real limit becomes N times the intended one — spread-out setups need coordination, usually a shared Redis counter (atomic `INCR`, adds a network hop), sticky sessions (loses state if a server fails), or consistent hashing (sends a user to one specific limiter node).

When a limit is passed, the standard reply is **HTTP 429 Too Many Requests** with a `Retry-After` header and `X-RateLimit-Limit/Remaining/Reset` headers, so clients can slow down on their own instead of failing blindly. Beyond blocking outright, systems can throttle (slow down), queue (delay), or shape (deprioritize) extra traffic. Rate limiting is built into API gateways (Kong, AWS API Gateway), reverse proxies (NGINX `limit_req`), service meshes (Istio), app code libraries, or the CDN edge (Cloudflare).

## Interview Questions

**Q: How does token bucket differ from leaky bucket?**
A: Token bucket allows bursts because tokens can build up to a cap and be spent quickly; leaky bucket forces a steady outflow rate no matter how bursty the input is, acting like a processing queue.

**Q: What's the flaw in a fixed window counter, and how does sliding window fix it?**
A: A fixed window resets sharply at its boundary, so a client can send the full limit right before the boundary and again right after, doubling the real burst. A sliding window (log or weighted counter) looks at an always-moving time range instead of a hard reset point.

**Q: Why doesn't an in-memory counter work for rate limiting across many servers?**
A: Each server tracks its own count on its own, so a limit of 100/min becomes 100×N/min across N servers. A shared, atomic counter (like Redis `INCR`) or consistent-hash routing to one limiter node is needed to enforce one true global limit.

## Scenario

A SaaS platform offers free and paid API plans. Requests are rate-limited by API key: free-plan keys get 60 requests/min, paid keys get 1,000/min, both enforced through one shared Redis counter used by all app servers. When a free-plan client goes over its limit, it gets a 429 response with `Retry-After: 30`, letting it back off gently instead of retrying right away and making things worse.

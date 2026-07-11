---
id: rate-limiting
title: "Rate Limiting"
created: 2026-07-11
modified: 2026-07-11
tags: [api-design, resilience, distributed-systems, traffic-management]
parent: reliability-security
children: []
status: draft
---

## Overview

Rate limiting caps "how many requests per unit time" a client can make, protecting a system from abuse, overload, and unfair resource hogging. The Twitter API allows 300 requests/15min and GitHub allows 5,000/hour precisely so one user or bot can't break the whole service.

## Key Concepts

- Token bucket — allows bursts, smooths average rate, most common default.
- Leaky bucket — constant outflow, queue-like, smooths bursts away.
- Fixed window counter — simple but has a boundary double-burst problem.
- Sliding window log/counter — accurate (log) or efficient-and-approximate (counter, used by Cloudflare).
- Distributed rate limiting — needs a shared counter (typically Redis) across servers.
- HTTP 429 response — with `Retry-After` and `X-RateLimit-*` headers.

## Core Knowledge

Rate limiting exists for abuse prevention, DDoS protection, fair usage, cost control, service stability, and SLA/tier enforcement. Five algorithms dominate: **token bucket** (tokens refill at a fixed rate, each request consumes one, bucket can start full so bursts are allowed while the average smooths out — the most flexible, O(1) memory per user); **leaky bucket** (requests queue and leak out at a constant rate — no bursts, purely smooth output); **fixed window counter** (simplest, but a request just before and after a window boundary can double the effective limit); **sliding window log** (logs every request timestamp for perfect accuracy, at high memory cost); and **sliding window counter** (a fixed window weighted by a fraction of the previous window — approximate but memory-efficient, Cloudflare's choice).

Limits can be scoped by IP (DDoS defense), user ID, API key (SaaS tiering), endpoint (stricter on expensive operations), or a combination of these. **Caution:** an in-memory counter works for a single server, but with N servers each keeping its own count, the effective limit becomes N times the intended one — distributed setups need coordination, typically a centralized Redis counter (atomic `INCR`, adds a network hop), sticky sessions (loses state on server failure), or consistent hashing (routes a user to a specific limiter node).

When a limit is exceeded, the standard response is **HTTP 429 Too Many Requests** with a `Retry-After` header and `X-RateLimit-Limit/Remaining/Reset` headers so clients can self-throttle rather than fail blindly. Beyond outright blocking, systems can throttle (delay), queue (defer), or shape (deprioritize) excess traffic. Rate limiting is implemented at API gateways (Kong, AWS API Gateway), reverse proxies (NGINX `limit_req`), service meshes (Istio), application libraries, or CDN edge (Cloudflare).

## Interview Questions

**Q: How does token bucket differ from leaky bucket?**
A: Token bucket allows bursts because tokens can accumulate up to capacity and be spent quickly; leaky bucket enforces a strictly constant outflow rate regardless of burstiness, behaving like a processing queue.

**Q: What's the flaw in a fixed window counter, and how does sliding window fix it?**
A: A fixed window resets sharply at boundaries, so a client can send the full limit right before the boundary and again right after, effectively doubling the burst. A sliding window (log or weighted counter) considers a continuously moving time range instead of a hard reset point.

**Q: Why doesn't an in-memory counter work for rate limiting across multiple servers?**
A: Each server tracks its own count independently, so a limit of 100/min becomes 100×N/min across N servers. A shared, atomic counter (e.g., Redis `INCR`) or consistent-hash routing to a single limiter node is needed to enforce a true global limit.

## Scenario

A SaaS platform offers free and premium API tiers. Requests are rate-limited by API key: free-tier keys get 60 req/min, premium keys get 1,000 req/min, both enforced through a centralized Redis counter shared across all application servers. When a free-tier client exceeds its limit, it receives a 429 response with `Retry-After: 30`, letting it back off gracefully instead of retrying immediately and making things worse.

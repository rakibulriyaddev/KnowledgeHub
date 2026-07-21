---
id: reverse-proxy
title: "Reverse Proxy"
created: 2026-07-15
modified: 2026-07-22
tags: [infrastructure, traffic-distribution, ssl-termination]
parent: proxy
children: []
status: draft
---

## Overview

A reverse proxy sits in front of one or more backend servers and handles every incoming request on the server's behalf, so clients never talk to the backend directly. It's the point where most shared infra needs — TLS, caching, routing, security — get handled in one place instead of being repeated in every service.

## Key Concepts

- Single entry point — clients see one address; the backend layout stays hidden
- SSL/TLS termination — decrypt once at the edge, backends run plain HTTP inside
- Request routing — sending traffic to the right backend by path, header, or host
- Response caching and compression at the edge, before it reaches the origin
- Security shield — hides origin IPs, absorbs bad traffic, can sit in front of a WAF

## Core Knowledge

A reverse proxy is useful even with just one backend — SSL termination, caching, and IP-hiding all still apply no matter how many backends there are, which is the key difference from a load balancer (whose main job needs more than one backend).
Putting TLS in one place at the proxy means certificates are managed in one spot instead of on every service instance — a big operational win at scale.
Because the origin's real address is never shown to clients, a reverse proxy is a natural first defense against attacks aimed straight at the origin (DDoS, port scanning).
Routing by path or header (`/api/*` → service A, `/static/*` → service B) lets one public address front many separate backends — the same idea an API gateway and a service router are both built on.
Caching static or semi-static responses at the proxy cuts backend load without touching app code.
**Caution:** a reverse proxy is itself a single point of failure unless run as an HA pair or cluster — a common mistake in production.
**Caution:** it's easy to mix up "reverse proxy," "load balancer," and "API gateway" — they overlap in how they work (all route traffic) but differ in purpose: a reverse proxy's job is hiding/fronting an origin, a load balancer's job is spreading traffic across many origins, an API gateway's job is API-aware management (auth, rate limits, combining calls) on top of routing.
Common tools: NGINX, HAProxy, Envoy, Traefik, and managed edges like Cloudflare or AWS ALB/CloudFront.

## Interview Questions

**Q: Why put a reverse proxy in front of just one backend server?**
A: For SSL termination, caching, compression, and hiding the origin's IP — all useful no matter how many backend copies exist.

**Q: How does a reverse proxy differ from a load balancer?**
A: A reverse proxy's main job is fronting/hiding an origin on the server's behalf; a load balancer's main job is spreading traffic across many origins. In practice most tools (NGINX, HAProxy) do both.

**Q: How does a reverse proxy differ from an API gateway?**
A: A reverse proxy just routes and fronts traffic; an API gateway adds API-aware features on top — auth, rate limiting, changing requests/responses, combining calls.

**Q: What's the risk of running a single reverse proxy in production?**
A: It becomes a single point of failure for all traffic — production setups run it as an active-passive or active-active HA cluster.

## Scenario

A company runs five internal microservices, each wanting its own SSL cert and public exposure — a messy setup. Putting one reverse proxy in front, ending TLS once and routing by path to each service inside over plain HTTP, cuts certificate management down to one place and hides the internal layout fully from clients.

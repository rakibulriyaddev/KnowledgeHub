---
id: reverse-proxy
title: "Reverse Proxy"
created: 2026-07-15
modified: 2026-07-15
tags: [infrastructure, traffic-distribution, ssl-termination]
parent: proxy
children: []
status: draft
---

## Overview

A reverse proxy sits in front of one or more backend servers and mediates every inbound request on the server's behalf, so clients never talk to the backend directly. It's the architectural chokepoint where most cross-cutting infrastructure concerns — TLS, caching, routing, security — get centralized instead of duplicated per service.

## Key Concepts

- Single entry point — clients see one address; backend topology stays hidden
- SSL/TLS termination — decrypt once at the edge, backends run plain HTTP internally
- Request routing — path/header/host-based dispatch to the correct backend
- Response caching and compression at the edge, before hitting the origin
- Security shield — hides origin IPs, absorbs malicious traffic, can front a WAF

## Core Knowledge

A reverse proxy is valuable even with a single backend — SSL termination, caching, and IP-hiding all apply regardless of backend count, which is the key distinction from a load balancer (whose defining job requires multiple backends).
Centralizing TLS at the proxy means certificates are managed in one place instead of on every service instance — a major operational simplification at scale.
Because the origin's real address is never exposed to clients, a reverse proxy is a natural first line of defense against direct-to-origin attacks (DDoS, port scanning).
Path/header-based routing (`/api/*` → service A, `/static/*` → service B) lets one public endpoint front many logically separate backends — the same mechanism an API gateway and a service router both build on.
Edge caching static or semi-static responses at the proxy cuts backend load without touching application code.
**Caution:** a reverse proxy is itself a single point of failure unless deployed in an HA pair/cluster — a common production oversight.
**Caution:** it's easy to conflate "reverse proxy," "load balancer," and "API gateway" — they overlap in mechanism (all route traffic) but differ in intent: a reverse proxy's core job is hiding/fronting an origin, a load balancer's is distributing across many origins, an API gateway's is API-aware management (auth, rate limits, aggregation) on top of routing.
Common implementations: NGINX, HAProxy, Envoy, Traefik, and managed edges like Cloudflare or AWS ALB/CloudFront.

## Interview Questions

**Q: Why deploy a reverse proxy in front of just one backend server?**
A: For SSL termination, caching, compression, and hiding the origin's IP — all useful regardless of how many backend instances exist.

**Q: How does a reverse proxy differ from a load balancer?**
A: A reverse proxy's defining purpose is fronting/hiding an origin on the server's behalf; a load balancer's defining purpose is distributing traffic across multiple origins. In practice most tools (NGINX, HAProxy) do both.

**Q: How does a reverse proxy differ from an API gateway?**
A: A reverse proxy just routes and fronts traffic; an API gateway adds API-aware concerns on top — auth, rate limiting, request/response transformation, aggregation.

**Q: What's the risk of running a single reverse proxy instance in production?**
A: It becomes a single point of failure for all traffic — production deployments run it in an active-passive or active-active HA cluster.

## Scenario

A company runs five internal microservices, each wanting its own SSL cert and public exposure — an operational mess. Putting a single reverse proxy in front, terminating TLS once and routing by path to each service internally over plain HTTP, collapses certificate management to one place and hides the internal topology entirely from clients.

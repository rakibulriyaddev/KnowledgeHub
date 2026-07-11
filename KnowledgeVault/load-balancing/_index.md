---
id: load-balancing
title: "Load Balancing"
created: 2026-07-11
modified: 2026-07-11
tags: [traffic-distribution, scalability, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Load balancing distributes incoming traffic evenly across multiple servers so no single machine gets overwhelmed. It's foundational to scalable, highly available systems — without it, horizontal scaling has no way to actually spread requests.

## Key Concepts

- Algorithms: Round Robin, Weighted Round Robin, Least Connections, Least Response Time, IP Hash, Random
- Layer 4 (transport, IP/port-based, fast) vs Layer 7 (application, HTTP-aware, smart routing)
- Types: hardware (F5), software (NGINX, HAProxy), cloud (AWS ALB/NLB), DNS-based
- Health checks (active and passive) route around unhealthy servers
- Sticky sessions (session persistence) vs stateless design with shared session storage (Redis)
- The load balancer itself needs redundancy (HA pair) to avoid becoming a single point of failure

## Core Knowledge

Load balancing algorithms trade off simplicity against awareness of real server state. Round Robin cycles requests server-to-server without regard for capacity; Weighted Round Robin fixes that by giving more powerful servers a proportionally larger share. Least Connections sends traffic to whichever server currently has the fewest active connections, which suits long-running connections like databases. IP Hash routes a given client consistently to the same server based on their IP, providing simple session persistence without external session storage.

Layer 4 load balancers operate at the TCP/UDP level, routing purely by IP and port — they can't see HTTP headers, but that makes them very fast (e.g. HAProxy in TCP mode, AWS NLB). Layer 7 load balancers understand HTTP itself, so they can route by URL path, header, or cookie, and can perform SSL termination — at some processing cost (NGINX, AWS ALB, Cloudflare).

Health checks are what make failover automatic: active checks periodically hit an endpoint like `/health`, while passive checks infer server health from observed failed requests; either way, unhealthy servers stop receiving new traffic. Sticky sessions keep a client pinned to the same server so in-memory session state (like a shopping cart) isn't lost — the more modern alternative is to keep servers stateless and store session data in a shared store like Redis, removing the need for stickiness entirely.

**Caution:** the load balancer itself is a potential single point of failure — a production deployment needs the LB duplicated in an active-passive or active-active pair, not just the backend servers behind it.

## Interview Questions

**Q: When would you choose Least Connections over Round Robin?**
A: When connections are long-running (e.g., database connections) and server load varies — Least Connections accounts for current load, while Round Robin blindly cycles regardless of how busy each server actually is.

**Q: What's the practical difference between a Layer 4 and a Layer 7 load balancer?**
A: Layer 4 routes based only on IP/port and is very fast since it doesn't inspect payload; Layer 7 understands HTTP (URL, headers, cookies) enabling smarter routing and SSL termination, at the cost of more processing overhead.

**Q: Why move away from sticky sessions toward stateless backends?**
A: Sticky sessions tie a client to one server, complicating scaling and failover; storing session state in a shared store like Redis lets any server handle any request, which is more resilient and scale-friendly.

## Scenario

An e-commerce site's servers have wildly different capacities — one has 16GB RAM, another only 4GB. Using plain Round Robin would overload the weaker server; switching to Weighted Round Robin lets the team assign a proportionally higher share of traffic to the more capable machine.

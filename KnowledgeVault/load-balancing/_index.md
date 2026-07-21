---
id: load-balancing
title: "Load Balancing"
created: 2026-07-11
modified: 2026-07-22
tags: [traffic-distribution, scalability, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Load balancing spreads incoming traffic evenly across many servers so no single machine gets too much work. It is a base part of scalable, highly available systems — without it, horizontal scaling has no way to actually spread requests.

## Key Concepts

- Algorithms: Round Robin, Weighted Round Robin, Least Connections, Least Response Time, IP Hash, Random
- Layer 4 (transport, IP/port-based, fast) vs Layer 7 (application, HTTP-aware, smart routing)
- Types: hardware (F5), software (NGINX, HAProxy), cloud (AWS ALB/NLB), DNS-based
- Health checks (active and passive) send traffic around servers that are down
- Sticky sessions (session persistence) vs stateless design with shared session storage (Redis)
- The load balancer itself needs a backup (HA pair) so it does not become a single point of failure

## Core Knowledge

Load balancing methods trade off being simple against knowing the real state of each server. Round Robin sends requests to each server in turn, without caring about its capacity. Weighted Round Robin fixes this by giving stronger servers a bigger share of traffic. Least Connections sends traffic to whichever server has the fewest active connections right now — good for long-running connections like databases. IP Hash always sends a given client to the same server, based on their IP address, giving simple session persistence without needing separate session storage.

Layer 4 load balancers work at the TCP/UDP level, routing only by IP and port. They cannot see HTTP headers, but this makes them very fast (for example, HAProxy in TCP mode, AWS NLB). Layer 7 load balancers understand HTTP itself, so they can route by URL path, header, or cookie, and can handle SSL termination — at some extra processing cost (NGINX, AWS ALB, Cloudflare).

Health checks are what make failover automatic. Active checks call an endpoint like `/health` on a timer, while passive checks judge server health from failed requests they already see. Either way, servers that are down stop getting new traffic. Sticky sessions keep a client pinned to the same server, so in-memory session data (like a shopping cart) is not lost. The more modern fix is to make servers stateless and store session data in a shared store like Redis, so stickiness is not needed at all.

**Caution:** the load balancer itself can become a single point of failure. A production setup needs the load balancer itself duplicated in an active-passive or active-active pair, not just the servers behind it.

## Interview Questions

**Q: When would you choose Least Connections over Round Robin?**
A: When connections last a long time (like database connections) and server load is uneven. Least Connections looks at current load, while Round Robin just cycles through servers no matter how busy each one really is.

**Q: What's the practical difference between a Layer 4 and a Layer 7 load balancer?**
A: Layer 4 routes using only IP and port, and is very fast since it does not look at the payload. Layer 7 understands HTTP (URL, headers, cookies), which allows smarter routing and SSL termination, at the cost of more processing work.

**Q: Why move away from sticky sessions toward stateless backends?**
A: Sticky sessions tie a client to one server, which makes scaling and failover harder. Storing session data in a shared store like Redis lets any server handle any request, which is tougher and easier to scale.

## Scenario

An online shop's servers have very different capacity — one has 16GB RAM, another only 4GB. Plain Round Robin would overload the weaker server. Switching to Weighted Round Robin lets the team give a bigger share of traffic to the stronger machine.

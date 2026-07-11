---
id: proxy
title: "Proxy - The Intermediary Server"
created: 2026-07-11
modified: 2026-07-11
tags: [infrastructure, security, traffic-distribution]
parent: networking
children: []
status: draft
---

## Overview

A proxy is an intermediary server that sits between a client and a destination server, forwarding requests and responses on someone's behalf. The key distinction is direction: a forward proxy acts for the client and hides it, while a reverse proxy acts for the server and hides it.

## Key Concepts

- Forward Proxy — works for the client, hides client identity, controls outbound traffic (VPN, content filters)
- Reverse Proxy — works for the server, hides backend identity, controls inbound traffic (load balancing, SSL termination, security)
- Forward proxy uses: privacy/anonymity, content filtering, geo-bypass, caching, logging
- Reverse proxy uses: load balancing, SSL termination, caching, compression, security/WAF, API gateway routing, A/B testing
- A VPN is a forward proxy plus encryption and tunneling
- Reverse proxy and load balancer overlap heavily — LB is essentially a subset of reverse proxy features

## Core Knowledge

A Forward Proxy sits in front of clients and reaches out to servers on their behalf, which means the destination server never sees the real client — useful for anonymity, bypassing geo-restrictions, filtering content (a school or office blocking certain sites), caching frequently requested resources for a whole network, and logging outbound activity. VPNs and tools like Squid are classic forward proxies.

A Reverse Proxy sits in front of servers and mediates on their behalf, so the client never directly sees or reaches the backend. This is where most modern infrastructure concentrates value: distributing traffic across backends (load balancing), terminating SSL/TLS so backend servers can run plain HTTP, caching static content, compressing responses, absorbing DDoS traffic and hiding backend IPs, routing in a microservices API gateway, and splitting traffic for A/B tests. NGINX, HAProxy, Cloudflare, and AWS ALB/CloudFront are common reverse proxy implementations.

**Caution:** "reverse proxy" and "load balancer" are often used interchangeably, but a reverse proxy is valuable even with a single backend (for SSL termination, caching, and hiding the origin), whereas a load balancer's defining job is distributing traffic across multiple backends — most modern tools like NGINX just do both.

Contrary to a common misconception, adding a proxy doesn't necessarily slow a system down — with caching and SSL termination offloaded to the proxy layer, overall system performance often improves.

## Interview Questions

**Q: What's the fundamental difference between a forward proxy and a reverse proxy?**
A: A forward proxy acts on behalf of the client and hides the client's identity from the server (e.g., a VPN); a reverse proxy acts on behalf of the server and hides the backend's identity from the client (e.g., NGINX, Cloudflare).

**Q: Is a VPN the same thing as a proxy?**
A: A VPN is a forward proxy plus encryption and tunneling — a plain proxy just forwards traffic without necessarily encrypting it.

**Q: Why would you use a reverse proxy even with just one backend server?**
A: For SSL termination, caching, compression, and hiding the backend's real IP — these benefits apply regardless of how many backend servers exist behind it.

## Scenario

A company's Node.js application handles dynamic logic fine but struggles to serve static files and manage SSL efficiently. Placing NGINX as a reverse proxy in front of it offloads SSL termination and static file serving to NGINX, letting Node focus purely on application logic — a common, effective split of responsibilities.

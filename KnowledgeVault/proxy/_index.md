---
id: proxy
title: "Proxy - The Intermediary Server"
created: 2026-07-11
modified: 2026-07-22
tags: [infrastructure, security, traffic-distribution]
parent: networking
children: [nginx, reverse-proxy]
status: draft
---

## Overview

A proxy is a go-between server that sits between a client and a destination server, passing requests and responses on someone's behalf. The key difference is direction: a forward proxy works for the client and hides it, while a reverse proxy works for the server and hides it.

## Key Concepts

- Forward Proxy — works for the client, hides the client's identity, controls outgoing traffic (VPN, content filters)
- Reverse Proxy — works for the server, hides the backend's identity, controls incoming traffic (load balancing, SSL termination, security)
- Forward proxy uses: privacy/anonymity, content filtering, getting around region locks, caching, logging
- Reverse proxy uses: load balancing, SSL termination, caching, compression, security/WAF, API gateway routing, A/B testing
- A VPN is a forward proxy plus encryption and tunneling
- Reverse proxy and load balancer overlap a lot — a load balancer is basically a subset of reverse proxy features

## Core Knowledge

A Forward Proxy sits in front of clients and reaches out to servers for them, which means the destination server never sees the real client — useful for staying anonymous, getting around region locks, filtering content (a school or office blocking certain sites), caching often-requested resources for a whole network, and logging outgoing activity. VPNs and tools like Squid are classic forward proxies.

A Reverse Proxy sits in front of servers and handles requests on their behalf, so the client never sees or reaches the backend directly. This is where most modern infrastructure puts its value: spreading traffic across backends (load balancing), handling SSL/TLS so backend servers can run plain HTTP, caching static content, compressing responses, soaking up DDoS traffic and hiding backend IPs, routing in a microservices API gateway, and splitting traffic for A/B tests. NGINX, HAProxy, Cloudflare, and AWS ALB/CloudFront are common reverse proxy tools.

**Caution:** "reverse proxy" and "load balancer" are often used to mean the same thing, but a reverse proxy is worth having even with just one backend (for SSL handling, caching, and hiding the origin), while a load balancer's main job is spreading traffic across many backends — most modern tools like NGINX just do both.

Against a common belief, adding a proxy doesn't have to slow a system down — with caching and SSL handling moved to the proxy layer, overall system speed often gets better.

## Interview Questions

**Q: What's the core difference between a forward proxy and a reverse proxy?**
A: A forward proxy works for the client and hides the client's identity from the server (e.g., a VPN); a reverse proxy works for the server and hides the backend's identity from the client (e.g., NGINX, Cloudflare).

**Q: Is a VPN the same thing as a proxy?**
A: A VPN is a forward proxy plus encryption and tunneling — a plain proxy just passes traffic along with no guarantee of encrypting it.

**Q: Why would you use a reverse proxy even with just one backend server?**
A: For SSL handling, caching, compression, and hiding the backend's real IP — these benefits apply no matter how many backend servers sit behind it.

## Scenario

A company's Node.js app handles its own logic fine but struggles to serve static files and manage SSL well. Placing NGINX as a reverse proxy in front of it moves SSL handling and static file serving to NGINX, letting Node focus purely on app logic — a common, effective split of jobs.

---
id: networking
title: "Networking Fundamentals"
created: 2026-07-11
modified: 2026-07-15
tags: [system-design, distributed-systems, infrastructure]
parent: system-design
children: [availability, caching, cdn, clustering, dns, firewall, ftp, http, https, ip, load-balancing, osi, port, port-forwarding, proxy, scalability, smtp, ssh, storage, tcp, udp, websocket]
status: draft
---

## Overview

Networking fundamentals are the layer every distributed system stands on: how a request finds a server, how data moves between machines, and how systems absorb growing traffic without falling over. Without these building blocks — addressing, transport, caching, load distribution — no system can scale past a single machine.

## Key Concepts

- Addressing and transport — IP, TCP/UDP, the OSI model.
- Application protocols — HTTP/HTTPS, FTP, SMTP, WebSocket.
- Traffic distribution — load balancing, proxies, CDNs.
- Growth handling — scalability, clustering, caching, storage.
- Name resolution — DNS.

## Core Knowledge

Every request a user makes crosses several of these layers before it's served: DNS resolves a name to an address, a load balancer or proxy routes the request to a healthy server, TCP or UDP carries the bytes, and caching or a CDN may serve the response before it ever reaches an origin server. Scalability and clustering describe how capacity grows as traffic grows — vertically (bigger machines) or horizontally (more machines). Storage determines where and how the underlying data physically lives. Getting these fundamentals wrong shows up as latency, downtime, or an architecture that can't grow.

## Interview Questions

**Q: What's the difference between horizontal and vertical scaling?**
A: Vertical scaling adds resources (CPU/RAM) to one machine; horizontal scaling adds more machines and distributes load across them.

**Q: Why put a CDN in front of an origin server?**
A: It serves cached content from a location physically closer to the user, cutting latency and offloading traffic from the origin.

**Q: When would you choose UDP over TCP?**
A: When speed matters more than guaranteed delivery — e.g. video streaming or real-time gaming — since UDP skips TCP's handshake and retransmission overhead.

## Scenario

A viral post sends traffic to a single web server up 100x in minutes. A load balancer distributes requests across a fleet of servers, a CDN absorbs static asset requests, and a cache layer serves repeated reads — the origin database never sees the full spike.

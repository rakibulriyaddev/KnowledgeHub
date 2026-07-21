---
id: networking
title: "Networking Fundamentals"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, distributed-systems, infrastructure]
parent: system-design
children: [availability, caching, cdn, clustering, dns, firewall, ftp, http, https, ip, load-balancing, osi, port, port-forwarding, proxy, scalability, smtp, ssh, storage, tcp, udp, websocket]
status: draft
---

## Overview

Networking basics are the layer every distributed system stands on: how a request finds a server, how data moves between machines, and how systems handle growing traffic without falling over. Without these building blocks — addressing, transport, caching, spreading out load — no system can grow past a single machine.

## Key Concepts

- Addressing and transport — IP, TCP/UDP, the OSI model.
- Application protocols — HTTP/HTTPS, FTP, SMTP, WebSocket.
- Spreading out traffic — load balancing, proxies, CDNs.
- Handling growth — scalability, clustering, caching, storage.
- Name resolution — DNS.

## Core Knowledge

Every request a user makes crosses several of these layers before it gets served: DNS turns a name into an address, a load balancer or proxy sends the request to a healthy server, TCP or UDP carries the bytes, and caching or a CDN may answer before the request ever reaches an origin server. Scalability and clustering describe how capacity grows as traffic grows — vertically (bigger machines) or horizontally (more machines). Storage decides where and how the underlying data actually lives. Getting these basics wrong shows up as slowness, downtime, or an architecture that cannot grow.

## Interview Questions

**Q: What's the difference between horizontal and vertical scaling?**
A: Vertical scaling adds resources (CPU/RAM) to one machine; horizontal scaling adds more machines and distributes load across them.

**Q: Why put a CDN in front of an origin server?**
A: It serves cached content from a place physically closer to the user, cutting delay and taking traffic off the origin server.

**Q: When would you choose UDP over TCP?**
A: When speed matters more than guaranteed delivery — for example, video streaming or real-time gaming — since UDP skips TCP's handshake and the cost of resending lost data.

## Scenario

A viral post sends traffic to a single web server up 100x within minutes. A load balancer spreads requests across a group of servers, a CDN absorbs static asset requests, and a cache layer serves repeated reads — the origin database never sees the full spike.

---
id: dns
title: "Domain Name System (DNS)"
created: 2026-07-11
modified: 2026-07-11
tags: [naming, resolution, infrastructure, internet]
parent: networking
children: []
status: draft
---

## Overview

DNS translates human-readable domain names like `google.com` into the IP addresses that computers actually use to route traffic. It exists because the internet only understands numeric addresses, and no one wants to memorize them — DNS is the decentralized phone book that bridges the two.

## Key Concepts

- Resolution chain: browser cache -> OS cache -> recursive resolver -> root server -> TLD server -> authoritative server
- Server types: recursive resolver, root name server, TLD server, authoritative name server
- Record types: A, AAAA, CNAME, MX, NS, TXT, PTR, SOA
- TTL controls caching duration at every layer; changes take time to propagate
- Security: DNS spoofing/cache poisoning, DNSSEC, DoH, DoT
- DNS underpins geo-routing, load balancing, and CDN edge selection

## Core Knowledge

Resolving a domain name walks through a hierarchy of caches and servers: the browser and OS caches are checked first, then a recursive resolver (often the ISP's, or a public one like Google 8.8.8.8 or Cloudflare 1.1.1.1) queries a root server for the relevant top-level domain (TLD) server, the TLD server points to the domain's authoritative name server, and that server returns the actual IP. The result is cached at every layer along the way according to its TTL (Time To Live), which is why changing a domain's IP doesn't take effect everywhere instantly — this delay is called DNS propagation and can take anywhere from minutes to 24-48 hours.

The main record types each serve a distinct purpose: A records map to IPv4 addresses, AAAA to IPv6, CNAME creates an alias from one domain to another, MX points to mail servers, NS points to authoritative name servers, TXT holds arbitrary text (often used for SPF/DKIM verification), and PTR supports reverse lookups (IP to domain).

**Caution:** DNS is a target for attacks — DNS spoofing (cache poisoning) tricks a resolver into returning a fake IP, redirecting users to malicious sites. DNSSEC counters this by adding digital signatures to DNS responses, while DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt the query itself to protect privacy in transit.

In system design, DNS is far more than name lookup: geo-routing lets the same domain resolve to different IPs by region, round-robin DNS can spread load across multiple IPs, and CDNs rely on DNS to direct users to their nearest edge server.

## Interview Questions

**Q: Walk through what happens when you type a URL into the browser, from a DNS perspective.**
A: The browser checks its own cache, then the OS cache; on a miss it asks a recursive resolver, which queries a root server for the TLD, the TLD server for the authoritative server, and the authoritative server for the actual IP — the answer is then cached at every layer based on its TTL.

**Q: Why doesn't a DNS record change take effect immediately everywhere?**
A: Because resolvers, operating systems, and browsers all cache the previous answer until its TTL expires — this delay is called DNS propagation.

**Q: How does a CDN use DNS?**
A: Its authoritative DNS looks at the requester's location and returns the IP of the nearest edge server, so users are automatically routed to low-latency infrastructure.

## Scenario

A company updates its website's IP address after migrating servers, but some users still land on the old server for a day. The old IP is still cached in various resolvers and browsers because it hadn't hit its TTL expiration yet — a lower TTL set in advance of planned migrations would have sped up the cutover.

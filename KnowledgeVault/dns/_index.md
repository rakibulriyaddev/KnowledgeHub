---
id: dns
title: "Domain Name System (DNS)"
created: 2026-07-11
modified: 2026-07-22
tags: [naming, resolution, infrastructure, internet]
parent: networking
children: []
status: draft
---

## Overview

DNS turns easy-to-read domain names, like `google.com`, into the IP addresses computers use to send traffic. It exists because the internet only understands number addresses, and no one wants to remember them. DNS is like a phone book, spread across many servers, that connects the two.

## Key Concepts

- Resolution chain: browser cache -> OS cache -> recursive resolver -> root server -> TLD server -> authoritative server
- Server types: recursive resolver, root name server, TLD server, authoritative name server
- Record types: A, AAAA, CNAME, MX, NS, TXT, PTR, SOA
- TTL controls how long each layer caches an answer; changes take time to spread everywhere
- Security: DNS spoofing/cache poisoning, DNSSEC, DoH, DoT
- DNS is behind geo-routing, load balancing, and picking the nearest CDN server

## Core Knowledge

Looking up a domain name goes through a chain of caches and servers: the browser cache and OS cache are checked first, then a recursive resolver (often the ISP's own, or a public one like Google 8.8.8.8 or Cloudflare 1.1.1.1) asks a root server for the right top-level domain (TLD) server. The TLD server points to the domain's authoritative name server, and that server sends back the real IP address. The answer gets cached at every layer along the way, based on its TTL (Time To Live). This is why changing a domain's IP does not take effect everywhere right away — this delay is called DNS propagation and can take from minutes up to 24-48 hours.

Each main record type has its own job: A records map to IPv4 addresses, AAAA to IPv6, CNAME makes one domain an alias of another, MX points to mail servers, NS points to authoritative name servers, TXT holds free-form text (often used for SPF/DKIM checks), and PTR supports reverse lookups (going from IP back to domain).

**Caution:** DNS is often attacked. DNS spoofing (cache poisoning) tricks a resolver into giving back a fake IP, sending users to harmful sites instead. DNSSEC fights this by adding digital signatures to DNS answers, while DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt the query itself, to keep it private while it travels.

In system design, DNS does much more than look up names: geo-routing lets the same domain point to different IPs depending on region, round-robin DNS can spread load across several IPs, and CDNs use DNS to send users to their nearest edge server.

## Interview Questions

**Q: Walk through what happens when you type a URL into the browser, from a DNS perspective.**
A: The browser checks its own cache, then the OS cache. If both miss, it asks a recursive resolver, which asks a root server for the TLD, the TLD server for the authoritative server, and the authoritative server for the real IP. The answer is then cached at every layer, based on its TTL.

**Q: Why doesn't a DNS record change take effect immediately everywhere?**
A: Because resolvers, operating systems, and browsers all keep using the old cached answer until its TTL runs out — this delay is called DNS propagation.

**Q: How does a CDN use DNS?**
A: Its authoritative DNS looks at where the request is coming from and returns the IP of the nearest edge server, so users are sent to low-latency infrastructure automatically.

## Scenario

A company updates its website's IP address after moving servers, but some users still land on the old server for a whole day. The old IP is still cached in different resolvers and browsers because its TTL had not run out yet. Setting a lower TTL ahead of a planned move would have made the cutover faster.

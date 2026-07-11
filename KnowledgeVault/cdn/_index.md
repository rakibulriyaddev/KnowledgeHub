---
id: cdn
title: "CDN - Content Delivery Network"
created: 2026-07-11
modified: 2026-07-11
tags: [performance, edge-computing, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

A CDN is a globally distributed network of servers that serves content from the location geographically nearest to a user rather than from a single origin server. It exists to cut latency, offload origin servers, and keep large-scale content delivery fast and resilient no matter where users are.

## Key Concepts

- Edge servers cache static content (HTML, CSS, JS, images, video) close to users
- DNS/anycast routes each user to their nearest edge (GeoDNS)
- Push CDN (pre-populated) vs Pull CDN (fetched on first request, the common default)
- Cache invalidation: TTL expiry, manual purge, versioned URLs (cache busting), stale-while-revalidate
- Edge compute (Cloudflare Workers, Lambda@Edge) lets dynamic logic run at the edge too
- Benefits: lower latency, origin offload, DDoS protection, bandwidth savings, high availability

## Core Knowledge

A CDN request flow works like this: the user requests a resource, DNS resolves to the nearest edge server's IP, and the edge either serves from cache (hit) or fetches from origin, caches it, and serves it (miss) — subsequent users in that region then get a cache hit. This geographic proximity is what turns a multi-continent network trip into a local one.

Push CDNs require content to be uploaded to edges in advance, which makes even the first request fast but adds storage cost and sync complexity — suited to content that rarely changes. Pull CDNs, the more common approach, fetch and cache from origin on demand, which is simpler and self-updating but leaves the first request slow.

Cache invalidation is the recurring hard problem: TTL expiry is simplest, manual purge targets a specific URL, versioned/hashed URLs (`app.v2.css` or `app.[hash].js`) force a fresh fetch by changing the URL itself, and stale-while-revalidate serves the cached (possibly stale) version immediately while refreshing in the background. **Note:** CDNs aren't limited to static assets — modern CDNs run edge compute to generate dynamic, even personalized, content without a round trip to origin.

**Caution:** a CDN alone doesn't guarantee speed — cache hit ratio depends on correct `Cache-Control` headers, and a low hit ratio undermines the whole point. Best practice is long TTLs plus `immutable` for versioned static assets, and short TTL or `no-cache` for HTML pages that change.

## Interview Questions

**Q: What's the difference between a Push CDN and a Pull CDN?**
A: Push CDNs have content uploaded to edges in advance, so even the first request is fast, but they add storage and sync overhead — best for rarely-changing content. Pull CDNs fetch from origin on first request and cache it, which is simpler and self-updating but slower on that first request; this is the more common approach.

**Q: How does a CDN keep serving content when the origin server is down?**
A: Because content is already cached at the edge, the CDN can continue serving those cached responses even if the origin is unreachable — a form of graceful degradation.

**Q: What's the most common technique for CDN cache invalidation?**
A: Versioned URLs (cache busting) — appending a hash or version to the filename so any change produces a new URL the CDN has never cached, avoiding stale-content issues entirely.

## Scenario

An e-commerce site updates product images daily but wants long cache lifetimes for performance. Using versioned URLs (`product-image-v123.jpg` or a content hash suffix) lets the team set aggressive, long TTLs — because any actual content change produces a brand-new URL, the CDN never serves a stale image without needing a manual purge.

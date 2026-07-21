---
id: cdn
title: "CDN - Content Delivery Network"
created: 2026-07-11
modified: 2026-07-22
tags: [performance, edge-computing, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

A CDN is a network of servers spread around the world that sends content from the location closest to a user, instead of from one single origin server. It exists to cut delay, take load off origin servers, and keep large-scale content delivery fast and strong no matter where users are.

## Key Concepts

- Edge servers cache static content (HTML, CSS, JS, images, video) close to users
- DNS/anycast sends each user to their nearest edge server (GeoDNS)
- Push CDN (content loaded ahead of time) vs Pull CDN (content fetched on first request, the common default)
- Cache invalidation: TTL expiry, manual purge, versioned URLs (cache busting), stale-while-revalidate
- Edge compute (Cloudflare Workers, Lambda@Edge) lets code that changes per request run at the edge too
- Benefits: lower latency, origin offload, DDoS protection, bandwidth savings, high availability

## Core Knowledge

Here is how a CDN request works: the user asks for a resource, DNS points to the nearest edge server's IP, and the edge server either sends it from cache (a "hit") or gets it from origin, saves it, and then sends it (a "miss"). After that, other users in that region get a cache hit. Being close by is what turns a long trip across continents into a short local one.

Push CDNs need content uploaded to the edge ahead of time. This makes even the first request fast, but it costs more storage and adds sync work — good for content that rarely changes. Pull CDNs, the more common choice, fetch and cache from origin only when asked. This is simpler and updates itself, but the first request is slow.

Cache invalidation is the hard problem that keeps coming up: TTL expiry is the simplest way, manual purge clears one specific URL, versioned or hashed URLs (`app.v2.css` or `app.[hash].js`) force a fresh fetch by changing the URL itself, and stale-while-revalidate sends the cached (maybe old) version right away while getting a fresh copy in the background. **Note:** CDNs are not just for static files — modern CDNs run edge compute to make dynamic, even personal, content without a trip back to origin.

**Caution:** a CDN alone does not guarantee speed — the cache hit rate depends on correct `Cache-Control` headers, and a low hit rate defeats the whole point. Good practice is long TTLs plus `immutable` for versioned static files, and a short TTL or `no-cache` for HTML pages that change often.

## Interview Questions

**Q: What's the difference between a Push CDN and a Pull CDN?**
A: Push CDNs have content uploaded to the edge ahead of time, so even the first request is fast, but they add storage and sync work — best for content that rarely changes. Pull CDNs fetch from origin on the first request and cache it, which is simpler and updates itself but is slower on that first request; this is the more common choice.

**Q: How does a CDN keep serving content when the origin server is down?**
A: Because content is already cached at the edge, the CDN can keep serving those cached responses even if the origin cannot be reached — a form of graceful degradation.

**Q: What's the most common technique for CDN cache invalidation?**
A: Versioned URLs (cache busting) — adding a hash or version number to the file name, so any change makes a new URL the CDN has never cached, avoiding stale-content problems entirely.

## Scenario

An online store updates product images every day but wants long cache times for speed. Using versioned URLs (`product-image-v123.jpg` or a hash added to the file name) lets the team set very long TTLs — because any real change makes a brand-new URL, the CDN never serves an old image, and no manual purge is needed.

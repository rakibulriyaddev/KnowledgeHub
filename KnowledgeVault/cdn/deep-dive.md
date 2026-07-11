---
title: "CDN - Content Delivery Network — Deep Dive"
---

Imagine if all of Netflix's videos lived in only one data center in America - watching from Bangladesh, every packet would travel 15,000 km each way. Buffering headaches, slow loading. But in reality, Netflix streams from a server sitting right inside Bangladesh's ISP. That's the magic of a **CDN**.

## What is a CDN?

A **CDN (Content Delivery Network)** is a network of servers distributed across the world that serves static content (HTML, CSS, JS, images, video) from the server geographically nearest to the user.

**Note:** If Domino's Pizza had only one shop, orders from the whole city would go to that one place. But because they have a branch in every neighborhood, delivery happens in 30 minutes. A CDN works the same way - it keeps content at *edge* branches.

## How does a CDN work?

1. The user requests `image.jpg`.
2. DNS gives the IP of the nearest edge server based on the user's geographic location.
3. If the image is on the edge server (cache hit) - it's served directly.
4. If not (cache miss) - it's fetched from the origin server, cached, and given to the user.
5. For the next user, it's already at the edge - fast.

## Why use a CDN?

- **Lower latency:** Closer to the user = faster response.
- **Origin offload:** Less traffic on the origin server, lower cost.
- **High availability:** Edge cache still serves content even if the origin goes down.
- **DDoS protection:** The edge layer absorbs attacks.
- **Bandwidth saving:** Less data needs to be sent from the origin.
- **Global reach:** Asia, Europe, Africa - same speed everywhere.

## Push vs Pull CDN

**Push CDN**
- You upload content to the CDN in advance
- Pre-populated at all edges
- Advantage: even the first request is fast
- Disadvantage: storage cost, sync complexity
- Use case: content that rarely changes

**Pull CDN**
- Fetched and cached from the origin on the first request
- Advantage: simple, auto-updates
- Disadvantage: the first request is slow
- Use case: dynamic sites, the normal use case
- The most common

## What gets cached?

### Static content (easy)
HTML, CSS, JS, images, video, PDF - rarely change. Cached directly.

### Dynamic content (hard)
User-specific data (like a logged-in dashboard). But modern CDNs can generate dynamic content at the edge too, using edge compute (Cloudflare Workers, AWS Lambda@Edge).

## Cache Invalidation

When a file is updated at the origin, the old version at the CDN edge needs to be removed.

- **TTL expiry:** The simplest - set a TTL, auto-expire.
- **Manual purge:** Purge a specific URL from the CDN dashboard.
- **Cache busting:** Version in the URL (`app.v2.css`, `app.css?v=123`).
- **Stale-while-revalidate:** Serve stale, refresh in the background.

## Popular CDN providers

- **Cloudflare:** Has a free tier, DDoS protection, 300+ city POPs.
- **AWS CloudFront:** Integrated with the AWS ecosystem.
- **Akamai:** Enterprise leader, biggest network.
- **Fastly:** Real-time configuration, developer-friendly.
- **Bunny CDN:** Affordable, performance-focused.

## Real-world examples

- **Netflix:** Open Connect - installing servers inside ISPs.
- **YouTube:** Google Global Cache (GGC) inside ISPs.
- **Wikipedia:** Multiple data centers + Varnish.
- **Facebook:** Edge POP network.

## Common misconceptions

1. **"CDN is only for images":** No, video, JS, HTML, even API responses can be cached too.
2. **"Setting up a CDN makes everything fast":** No, cache hit ratio matters. Wrong cache headers lead to a low hit ratio.
3. **"A modern site can't run without a CDN":** It can - but it won't hold up in the competition.

## Best Practices

- Versioned URLs - `app.[hash].js` - allow a long TTL.
- `Cache-Control: public, max-age=31536000, immutable` for static assets.
- Low TTL (5min) or `no-cache` for HTML pages.
- HTTPS is a must - modern CDNs provide HTTPS.
- Enable Gzip/Brotli compression.

## Chapter Summary

- A CDN caches content on edge servers around the world.
- Closer to the user = faster delivery.
- Push CDN pre-populates; Pull CDN fetches on-demand.
- Cache invalidation via TTL, manual purge, or versioned URLs.
- Cloudflare, AWS CloudFront, Akamai - top providers.

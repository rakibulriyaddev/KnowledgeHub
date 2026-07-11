---
title: "CDN - Content Delivery Network — Q&A"
---

**Q: What does CDN stand for?**
A: Content Delivery Network — CDN = Content Delivery Network.

**Q: What is the main purpose of a CDN?**
A: Getting content closer to the user — A CDN serves content from the geographically nearest edge server.

**Q: In a CDN, DNS gives the IP of the nearest edge based on the user's location.**
A: True — GeoDNS / anycast routes to the nearest edge.

**Q: How does a Pull CDN work?**
A: Fetched and cached from origin on the first request — In a Pull CDN, the first request is a cache miss -> fetched from the origin.

**Q: When is a Push CDN good?**
A: Content that rarely changes and is known in advance — In a Push CDN, content is uploaded in advance - even the first request is fast. For static, predictable content.

**Q: A CDN can only cache images.**
A: False — A CDN can cache HTML, CSS, JS, video, PDF, even API responses.

**Q: Which technique is the most common for CDN cache invalidation?**
A: Versioned URL (cache busting) — app.[hash].css - when the file changes, the URL changes -> the CDN sees the new version.

**Q: Which of these is NOT an advantage of a CDN?**
A: Database query optimization — A CDN doesn't optimize database queries - that's the DB's job.

**Q: When would you set max-age=31536000, immutable in Cache-Control?**
A: Versioned static asset — A versioned (hash-suffixed) asset never changes - long TTL + immutable.

**Q: Which of these is a popular free-tier CDN?**
A: Cloudflare — Cloudflare has a generous free tier.

**Q: You run an e-commerce site where product images are updated every day. How would you handle caching?**
A: Use versioned URLs — product-image-v123.jpg or a hash-suffix means the URL changes as soon as it updates.

**Q: The origin server goes down. Are all users offline?**
A: No, the CDN can still serve cached content — The CDN can still serve cached content at the edge even when the origin is down - graceful degradation.

**Q: What is edge compute (Cloudflare Workers)?**
A: Executing JS/code at the edge — Running code at the edge lets you generate dynamic content - saving a trip to the origin.

**Q: The higher the cache hit ratio, the more effective the CDN.**
A: True — A high hit ratio = less pressure on the origin, faster for the user.

**Q: What CDN strategy does Netflix use?**
A: Open Connect - servers inside ISPs — Netflix's own CDN - Open Connect - places servers inside ISPs' local networks.

**Q: Which HTTP header tells a CDN the cache duration?**
A: Cache-Control — The Cache-Control header (max-age, public/private, no-cache, immutable).

**Q: Using HTTPS is optional on a CDN.**
A: False — Modern CDNs offer HTTPS as standard; HTTP-only is generally unsafe and hurts SEO.

**Q: What does Stale-while-revalidate do?**
A: Serves stale content while refreshing in the background — A fast (stale) response to the user, fresh fetch behind the scenes - an ideal trade-off.

**Q: What happens serving 1 million users without a CDN?**
A: Origin gets overwhelmed, slow, costly — Without a CDN, the origin takes all the load - bandwidth cost and latency both increase.

**Q: A CDN can benefit small sites too.**
A: True — On Cloudflare's free tier, even a small site gets DDoS protection, HTTPS, and performance.

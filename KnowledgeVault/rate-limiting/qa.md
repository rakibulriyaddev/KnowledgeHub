---
title: "Rate Limiting — Q&A"
---

**Q: What is the main purpose of Rate Limiting?**
A: Protect against abuse, overload, and ensure fair usage — Resource control + security.

**Q: How does Token Bucket work?**
A: Tokens accumulate in a bucket; refill rate; consumed per request — Burst-friendly and smooths the average rate.

**Q: What is special about Leaky Bucket?**
A: Constant outflow rate — Smooth, constant processing.

**Q: What is the problem with Fixed Window Counter?**
A: Double burst at the window boundary — 12:59:59 + 1:00:00 = 2× the limit.

**Q: What is the downside of Sliding Window Log?**
A: Memory expensive - logs every request — A per-user timestamp list.

**Q: Most flexible algorithm?**
A: Token Bucket — Handles bursts and smoothing - fits most use cases.

**Q: Cloudflare uses a sliding window counter.**
A: True — Memory-efficient with reasonable accuracy.

**Q: What can a rate limit be based on?**
A: IP, user ID, API key, endpoint - combined — Multiple dimensions are typical.

**Q: What is used for distributed rate limiting?**
A: Redis-based centralized counter — Atomic INCR - stays consistent across servers.

**Q: HTTP status when the rate limit is exceeded?**
A: 429 Too Many Requests — The standard rate-limit response.

**Q: The GitHub API allows 5,000 req/hour. A user exceeds a burst limit - what happens?**
A: 429 + Retry-After header — Inform the client and provide retry guidance.

**Q: A SaaS has premium and free tiers. What strategy?**
A: API-key based - higher limit for premium — Tier-based rate limiting.

**Q: Which HTTP header gives retry guidance?**
A: Retry-After — Tells the client how long to wait before retrying.

**Q: API Gateways typically handle rate limiting.**
A: True — A centralized location - a natural fit.

**Q: What about expensive endpoints?**
A: Stricter limit — Based on resource cost.

**Q: Which NGINX directive is for rate limiting?**
A: limit_req — limit_req_zone + limit_req.

**Q: What does the X-RateLimit-Remaining header tell you?**
A: How many requests remain in the current window — Client-friendly information.

**Q: At which level is DDoS protection applied?**
A: Edge/CDN level (Cloudflare) — Filtered at the edge - protects the origin.

**Q: Throttle vs Block?**
A: Throttle = delay; Block = reject — Different behavior strategies.

**Q: Whitelisting trusted IPs from rate limits is standard practice.**
A: True — Internal/partner IPs are left unrestricted.

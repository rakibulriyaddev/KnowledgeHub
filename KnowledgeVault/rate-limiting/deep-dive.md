---
title: "Rate Limiting — Deep Dive"
---

The Twitter API gives you 300 requests per 15 minutes. The GitHub API gives 5,000/hour. Why? Otherwise a single user/bot could break the entire API. This is **Rate Limiting**.

## Why Rate Limiting?

- **Abuse prevention:** Brute force, scraping, spam.
- **DDoS protection:** Malicious traffic floods.
- **Fair usage:** So one user can't take all the resources.
- **Cost control:** Keeps the cloud bill predictable.
- **Service stability:** Downstream services don't get overwhelmed.
- **SLA enforcement:** Tier-based pricing.

## Rate Limiting Algorithms

### 1. Token Bucket

Tokens accumulate in a bucket - refilled at a fixed rate. Each request consumes 1 token. When empty - block.

```
Capacity: 10 tokens
Refill: 1 token/second

Request → consume token → if 0 = REJECT
Bucket refills naturally over time
```

- Allows bursts (starts from a full bucket).
- Smooths the rate on average.
- The most common choice.

### 2. Leaky Bucket

Requests accumulate in a bucket - leak out (get processed) at a fixed rate. Bucket overflow = reject.

- Constant outflow rate.
- Smooths out bursts.
- Works like a queue.

### 3. Fixed Window Counter

A counter over a time window (e.g., 1 minute). Crossing the threshold = reject. Resets at the end of the window.

- Simple.
- Problem: double burst at the window boundary (12:59-1:00 + 1:00-1:01).

### 4. Sliding Window Log

Logs the timestamp of every request. Counts requests in the most recent N seconds.

- Most accurate.
- Memory expensive.

### 5. Sliding Window Counter

Fixed window plus a weighted contribution from the previous window. Approximate but efficient.

- Used by Cloudflare.
- Memory-efficient.
- Reasonable accuracy.

## Algorithm Comparison

**Token Bucket:** Allows bursts; smooths average rate; most flexible; memory O(1) per user.

**Leaky Bucket:** Constant rate; smooth output; queue-based; less burst-friendly.

**Fixed Window:** Simplest; boundary issue; memory O(1); approximate.

**Sliding Window:** Accurate; memory tradeoff; complex; counter version is efficient.

## Rate Limit by What?

- **IP address:** DDoS protection.
- **User ID:** Authenticated user.
- **API key:** SaaS - tier-based.
- **Endpoint:** Stricter limits on expensive endpoints.
- **Combined:** Multi-layer.

## Distributed Rate Limiting

An in-memory counter on a single server is easy. But what about 10 servers?

### The Problem

- Each server has its own count = total = 10× the allowed limit.
- Coordination is needed.

### Solutions

#### Centralized counter (Redis)

- All servers INCR in Redis.
- Atomic operation.
- Adds network-hop latency.

#### Sticky session

- Same user, same server.
- In-memory counter.
- State is lost if the server fails.

#### Consistent hashing

- User → a specific limiter node.
- Efficient for distributed setups.

## Response Strategy

### HTTP 429 Too Many Requests

```
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1700000000

{"error": "Rate limit exceeded"}
```

### Behavior Options

- **Block:** Reject the extra request.
- **Throttle:** Delay the response.
- **Queue:** Process it later.
- **Shape:** Lower priority.

## Implementation Layers

- **API Gateway:** Kong, AWS API Gateway, Cloudflare.
- **Reverse proxy:** NGINX limit_req.
- **Service Mesh:** Istio.
- **Application code:** Library (express-rate-limit).
- **Cloudflare/CDN:** Edge level.

## Real-World Examples

- **GitHub API:** 5,000 req/hour authenticated; 60 unauthenticated.
- **Twitter API:** 300 req/15min.
- **Stripe:** 100 req/sec, dynamic.
- **Reddit:** 60 req/minute OAuth.
- **Banking:** Aggressive - fraud detection.

## Common Misconceptions

1. **"An in-memory counter is enough":** Fine for a single server; not for distributed setups.
2. **"Fixed window is enough":** Boundary issue - up to 2× burst possible.
3. **"Just block silently":** Inform clients with 429 + headers instead.
4. **"Same limit for every endpoint":** Expensive endpoints need stricter limits.

## Best Practices

- Multi-layer (IP + user + API key).
- Token bucket as the default choice.
- Distributed: Redis-based centralized counter.
- HTTP 429 + Retry-After + RateLimit headers.
- Different limits for different endpoints.
- Whitelist trusted IPs.
- Monitoring + alerting.

## Chapter Summary

- Rate Limiting protects against abuse, overload, and ensures fair usage.
- Algorithms: Token bucket, Leaky bucket, Fixed/Sliding window.
- For distributed setups, use a Redis-based centralized counter.
- Respond with HTTP 429 + Retry-After.
- API Gateway and Cloudflare are common implementation points.

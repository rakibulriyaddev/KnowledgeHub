---
title: "Case Study: URL Shortener (TinyURL) — Deep Dive"
---

You want to share a 100-character URL. In a tweet or an SMS - that's a lot of characters. Solution: bit.ly/abc123 - a short URL that redirects to the original. How would you build this system? This is a classic interview question.

## Step 1: Requirements

### Functional

- Generate a short URL from a long URL.
- Accessing the short URL redirects to the original.
- Optional: custom alias (vanity URL).
- Optional: expiration.
- Analytics: click count, source.

### Non-Functional

- High availability (99.9%+) - a broken link is unacceptable.
- Low latency - <100ms redirect.
- Scalability - billions of URLs.
- Read-heavy: 100:1 ratio.

## Step 2: Capacity Estimation

```
URLs created: 100M/month
URLs/sec (write): 100M / 30days / 86400 ≈ 40 writes/sec
Reads/sec: 40 × 100 = 4,000 reads/sec

Storage:
Per URL: ~500 bytes (URL + metadata)
100M × 500 bytes/month = 50 GB/month
5 years: 6TB

Memory cache (hot 20%):
6TB × 0.2 = 1.2TB
```

## Step 3: API Design

```
POST /shorten
  body: { longUrl, customAlias?, expirationDate? }
  returns: { shortUrl }

GET /{shortCode}
  returns: 302 redirect to longUrl

GET /{shortCode}/analytics
  returns: { clicks, lastAccessed, sources }
```

## Step 4: Data Model

```
URLs table:
| short_code | long_url | user_id | created_at | expires_at |
| abc123 | https://... | 42 | 2026-01-01 | 2027-01-01 |

PRIMARY KEY: short_code
INDEX: user_id (analytics)
```

RDBMS (PostgreSQL) or NoSQL (DynamoDB) - depends on scale.

## Short Code Generation Strategy

### Approach 1: Random

A random 6-character string. Collision check + retry.

- **Pros:** Simple.
- **Cons:** Collision checking is expensive.

### Approach 2: Hash (MD5/SHA)

Hash the long URL + take the first 6-7 characters.

- **Pros:** Same URL → same short code.
- **Cons:** Collision possible.

### Approach 3: Base62 Counter

Auto-increment ID → base62 encode.

```
62 chars: a-z, A-Z, 0-9
6 chars: 62^6 ≈ 56 billion combinations
7 chars: 62^7 ≈ 3.5 trillion

ID 1 → "1"
ID 125 → "21"
ID 999999 → "4c91"
```

- **Pros:** No collision, deterministic.
- **Cons:** Sequential - predictable.

### Approach 4: Snowflake ID

Distributed ID generation (Twitter Snowflake, UUID v7).

## Step 5: High-Level Architecture

```
[Client] → [DNS] → [LB] → [Web Servers]
  ↓
[ID Gen Service] [Cache (Redis)]
  ↓ ↑
[URL Database]
  ↓
[Analytics Pipeline]
```

## Step 6: Component Deep-Dive

### ID Generation

Distributed counter or Snowflake. A single source becomes a bottleneck - shard it via Zookeeper.

### Cache Layer

- Hot URLs in Redis.
- LRU eviction.
- Cache hit ratio target 90%+.

### Database

- SQL: PostgreSQL - moderate scale.
- NoSQL: Cassandra/DynamoDB - massive scale.
- Sharding by short_code prefix.

### Redirect Flow

1. GET /abc123.
2. Check Redis - found? → 302 redirect.
3. Not found? → DB lookup → cache → 302.
4. Async: increment click count.

### 301 vs 302 Redirect

- **301 (permanent):** Browser caches it - analytics miss out. Faster on repeat visits.
- **302 (temporary):** Hits the server every time - accurate analytics.
- Most shorteners use 302.

## Step 7: Scale Considerations

### Read Path Optimization

- CDN edge cache.
- Geographic replicas.
- Aggressive Redis caching.

### Write Path

- Async analytics write (Kafka).
- ID generation pre-allocation (batch).

### Database Scaling

- Read replicas.
- Sharding by short_code hash.

### Reliability

- Multi-region active-passive.
- Cache failover.

## Advanced Topics

### Custom Aliases

User-provided string → uniqueness check.

### Expiration / TTL

A background job purges expired URLs.

### Analytics

- Click event → Kafka → analytics DB.
- Aggregated reports.
- Geo, device, referrer.

### Abuse Prevention

- Rate limit per user.
- Malicious URL detection (Google Safe Browsing).
- CAPTCHA.

## Real World

- **bit.ly:** Industry leader.
- **TinyURL:** The original.
- **t.co:** Twitter's internal shortener.
- **youtu.be:** YouTube.
- **goo.gl:** Google (shut down in 2019).

## Common Trade-offs

- Hash vs counter: collision vs predictability.
- SQL vs NoSQL: ACID vs scale.
- 301 vs 302: speed vs analytics.
- Synchronous analytics vs async: accuracy vs speed.

## Common Mistakes

1. Long IDs like UUIDs - defeats the purpose.
2. No cache - DB gets overwhelmed.
3. Sync analytics - slows down writes.
4. Single ID generator - SPOF.

## Chapter Summary

- URL shortener = read-heavy 100:1, billions of URLs.
- Base62 counter or Snowflake ID generation.
- Redis cache layer is essential.
- 302 redirect - for analytics.
- Sharding + CDN + async analytics - for scale.

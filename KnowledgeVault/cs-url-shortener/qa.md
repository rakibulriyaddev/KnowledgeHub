---
title: "Case Study: URL Shortener (TinyURL) — Q&A"
---

**Q: What is the read/write ratio for a URL shortener?**
A: ~100:1 (read-heavy) — shortened once, clicked many times.

**Q: How many combinations are there with 6 characters in Base62 encoding?**
A: ~56 billion — 62^6 ≈ 56B.

**Q: Which characters are used in Base62?**
A: a-z, A-Z, 0-9 — 26+26+10 = 62.

**Q: What's the problem with hash-based short codes?**
A: Collision possible - the same URL always maps to the same code, but different URLs can collide — truncated hash collision risk.

**Q: What's the downside of counter-based IDs?**
A: Predictable + sequential - security/business concern — URLs can be enumerated.

**Q: What is Twitter Snowflake?**
A: Distributed ID generation algorithm — time + machine ID + sequence.

**Q: The cache layer is critical for a URL shortener.**
A: True — read-heavy, target a 90%+ cache hit ratio.

**Q: What's the downside of a 301 redirect?**
A: Browser cache - analytics miss — permanent redirect, repeat visits don't hit the server.

**Q: 302 vs 301 - which is common in URL shorteners?**
A: 302 (for analytics) — 302 tracks every click.

**Q: What's the async approach for updating click counts?**
A: Kafka → analytics pipeline — redirect stays fast; analytics happens asynchronously.

**Q: A URL goes viral - millions of hits/sec. What's the strategy?**
A: CDN edge cache + Redis + DB tiered — multiple cache layers.

**Q: You want to set the custom alias "myurl". What check is needed?**
A: Uniqueness - look up the DB to see if it's already taken — handle the race condition (transaction).

**Q: Where is the long URL → short URL mapping stored?**
A: Database (SQL/NoSQL) + cache — persistent storage is essential.

**Q: UUIDs are good for short URLs.**
A: False — 36 characters, too long. Defeats the purpose.

**Q: What's the problem with a single ID generator?**
A: SPOF + bottleneck — distributed/sharded ID generation is needed.

**Q: At 100M URLs/month, what's the total over 5 years?**
A: 6B URLs — 100M × 12 × 5 = 6B.

**Q: How do you prevent malicious URLs?**
A: Google Safe Browsing API + rate limit + manual review — multi-layer abuse prevention.

**Q: Which company owns t.co?**
A: Twitter (internal) — Twitter's URL shortening service.

**Q: What could the sharding strategy be?**
A: short_code prefix or hash — for even distribution.

**Q: URL expiration is an optional feature.**
A: True — some services are TTL-based; the default is permanent.

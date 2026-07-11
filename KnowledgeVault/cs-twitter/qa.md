---
title: "Case Study: Twitter / X — Q&A"
---

**Q: What's the primary challenge with Twitter's timeline?**
A: Read-heavy 100:1 + celebrity problem — massive scale + skewed distribution.

**Q: What happens in the pull approach?**
A: At read time, fetch and sort tweets from every followee — lazy generation.

**Q: What happens in the push approach?**
A: At post time, pre-inject the tweet into followers' timelines — eager pre-computation.

**Q: What's the celebrity problem with pure push?**
A: A million followers → a million timeline writes per tweet — write amplification disaster.

**Q: What is Twitter's hybrid approach?**
A: Normal users get push, celebrities get pull — the best of both.

**Q: Twitter's timeline requires strong consistency.**
A: False — eventually consistent (1-2 sec) is acceptable.

**Q: What's the benefit of Snowflake ID?**
A: Time-ordered + distributed generation — Twitter's open-source ID generator.

**Q: Which DB does Twitter use for tweet storage?**
A: Manhattan / Cassandra (custom distributed) — a custom DB for massive scale.

**Q: Where does the timeline cache live?**
A: Redis (sorted set of tweet IDs per user) — fast in-memory access.

**Q: What queue powers the fan-out workers?**
A: Kafka — async event-driven fan-out.

**Q: A celebrity with 50M followers posts a tweet. What happens in the hybrid model?**
A: No fan-out - followers merge it at read time — celebrity is skipped; pulled at view time.

**Q: An inactive user logs in after 3 days. What happens?**
A: Cache evicted - pull approach + rebuild — inactive eviction + on-demand rebuild.

**Q: What does the search index use?**
A: Elasticsearch (full-text) — hashtag, full-text search.

**Q: How is trending topics processed?**
A: Stream processing (Storm/Heron) + sliding window — real-time aggregation.

**Q: A user's timeline cache typically holds the latest 800 tweets.**
A: True — bounded, older tweets are archived.

**Q: What's the read-heavy ratio for Twitter?**
A: ~100:1 — many reads, few writes.

**Q: What's the multi-tier cache strategy?**
A: CDN → Redis → DB — each tier has its own hit ratio.

**Q: What is Heron?**
A: Twitter's stream processing engine (Storm successor) — real-time analytics.

**Q: Why is eventual consistency acceptable?**
A: A tweet showing up 1-2 sec late is fine for a social feed — it's OK for Twitter's use case.

**Q: Pre-computation trades storage for speed.**
A: True — trading storage for read speed.

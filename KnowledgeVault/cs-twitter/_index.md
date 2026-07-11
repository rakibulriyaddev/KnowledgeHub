---
id: cs-twitter
title: "Case Study: Twitter / X"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, case-study, fan-out, caching, distributed-systems]
parent: case-studies
children: []
status: draft
---

## Overview

Twitter's home timeline is the classic system-design interview case study: a read-heavy (100:1) feed that must load in under 200ms for everyone, from a brand-new user to one following a celebrity with 150 million followers. The central engineering problem is timeline generation — deciding when and how to compute each user's feed.

## Key Concepts

- Read-heavy workload (100:1) with eventual consistency (1-2 sec) acceptable.
- Pull (read-time fan-out) — compute the timeline on every read by fetching from all followees.
- Push (write-time fan-out) — pre-inject a new tweet into every follower's cached timeline on write.
- Hybrid model — push for normal users, pull for celebrities (1M+ followers), merged at read time.
- Snowflake ID — distributed, time-ordered tweet ID generation.
- Redis timeline cache (latest 800 tweet IDs per user) backed by Cassandra/Manhattan storage.

## Core Knowledge

Twitter evaluated three timeline-generation strategies. Pure pull fetches and sorts tweets from every followee at read time — cheap writes, but slow reads for active users with many follows. Pure push pre-computes: when a tweet is posted, a fan-out worker injects its ID into every follower's Redis timeline cache — reads become instant, but writes explode for high-follower accounts (a celebrity tweet would trigger tens of millions of timeline writes, the "celebrity problem"). Twitter's answer is a hybrid: accounts under roughly 1 million followers get push fan-out; celebrities are skipped during fan-out and instead pulled live and merged into each viewer's timeline at read time. This keeps both the common case (normal users, fast precomputed reads) and the tail case (celebrities, no write explosion) cheap.

The architecture runs tweet writes through Kafka into asynchronous fan-out workers, tweet storage in a sharded, time-ordered store (Manhattan/Cassandra) keyed by Snowflake IDs, and a multi-tier read path (CDN → Redis → DB) for the actual feed. Search runs separately through Elasticsearch, and trending topics use stream processing (Storm/Heron) over a sliding window with decay. Because the product tolerates 1-2 seconds of staleness, the write path can stay fully asynchronous without hurting the user experience — a trade-off that would not hold for, say, a financial ledger.

## Interview Questions

**Q: Why doesn't pure push work for Twitter?**
A: A celebrity with 150 million followers would trigger 150 million timeline writes per tweet — the "celebrity problem" turns one write into a write storm that overwhelms the backend.

**Q: How does Twitter's hybrid model resolve the celebrity problem?**
A: Normal users' tweets are pushed into followers' cached timelines at write time; celebrity tweets skip fan-out entirely and are instead fetched live and merged into each follower's timeline at read time.

**Q: Why is eventual consistency acceptable for a social feed but not for many other systems?**
A: A tweet appearing 1-2 seconds late causes no real harm to the product experience, so Twitter can trade strict consistency for a fully asynchronous, horizontally scalable write path.

## Scenario

An interviewer asks "what happens when Elon Musk tweets?" The candidate should recognize this as the celebrity edge case: under the hybrid model, no fan-out write occurs for that tweet; instead, each follower's client merges it in at read time from a live pull, avoiding a 150-million-write storm.

---
id: cs-twitter
title: "Case Study: Twitter / X"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, case-study, fan-out, caching, distributed-systems]
parent: case-studies
children: []
status: draft
---

## Overview

Twitter's home timeline is a classic system-design interview topic: a feed that gets far more reads than writes (100:1), which must load in under 200ms for everyone, from a brand-new user to one who follows a star with 150 million followers. The main engineering problem is timeline generation — deciding when and how to build each user's feed.

## Key Concepts

- Read-heavy workload (100:1) where a 1-2 second delay in data is fine.
- Pull (read-time fan-out) — build the timeline on every read by fetching from everyone the user follows.
- Push (write-time fan-out) — add a new tweet into every follower's saved timeline right when it's posted.
- Hybrid model — push for normal users, pull for stars (1M+ followers), merged at read time.
- Snowflake ID — a way to make tweet IDs across many machines, kept in time order.
- Redis timeline cache (latest 800 tweet IDs per user) backed by Cassandra/Manhattan storage.

## Core Knowledge

Twitter looked at three ways to build timelines. Pure pull fetches and sorts tweets from everyone the user follows, at read time — writes are cheap, but reads are slow for active users who follow many people. Pure push builds ahead of time: when a tweet is posted, a worker adds its ID into every follower's Redis timeline — reads become instant, but writes explode for accounts with many followers (a tweet from a star could trigger tens of millions of timeline writes, the "celebrity problem"). Twitter's fix is a hybrid: accounts under about 1 million followers get push fan-out; tweets from stars skip fan-out and are instead pulled live and merged into each viewer's timeline at read time. This keeps both the common case (normal users, fast ready-made reads) and the rare case (stars, no write explosion) cheap.

The system sends tweet writes through Kafka to background fan-out workers, stores tweets in a split, time-ordered store (Manhattan/Cassandra) keyed by Snowflake IDs, and reads the feed through several layers (CDN → Redis → DB). Search runs on its own through Elasticsearch, and trending topics use stream processing (Storm/Heron) over a moving time window with decay. Because the product can handle 1-2 seconds of delay, the write path can stay fully background-based without hurting the user — a trade that would not work for, say, a bank ledger.

## Interview Questions

**Q: Why doesn't pure push work for Twitter?**
A: A star with 150 million followers would cause 150 million timeline writes per tweet — the "celebrity problem" turns one write into a flood that overloads the backend.

**Q: How does Twitter's hybrid model fix the celebrity problem?**
A: Normal users' tweets are pushed into followers' saved timelines when posted; tweets from stars skip fan-out and are instead fetched live and mixed into each follower's timeline when read.

**Q: Why is a small delay okay for a social feed but not for many other systems?**
A: A tweet showing up 1-2 seconds late causes no real harm to the user, so Twitter can trade strict up-to-date data for a fully background, easy-to-scale write path.

## Scenario

An interviewer asks "what happens when Elon Musk tweets?" The candidate should see this as the celebrity case: under the hybrid model, no fan-out write happens for that tweet; instead, each follower's app pulls it in live at read time and merges it in, avoiding a 150-million-write flood.

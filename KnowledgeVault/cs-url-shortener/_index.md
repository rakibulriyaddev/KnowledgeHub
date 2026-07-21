---
id: cs-url-shortener
title: "Case Study: URL Shortener (TinyURL)"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, case-study, caching, sharding, key-generation]
parent: case-studies
children: []
status: draft
---

## Overview

Building a URL shortener is the most common system-design interview question exactly because it looks simple but hides real depth: the core encode/decode logic is easy, while the real challenge is handling a read-heavy (100:1), billions-of-URLs workload with fast redirects.

## Key Concepts

- Short code creation methods — random, hash-and-cut, Base62 counter, or Snowflake-style spread-out IDs.
- Base62 counter — an auto-increasing ID written in a-z/A-Z/0-9, giving 62^6 (~56B) combos at 6 characters with no clashes.
- Redis caching of popular URLs matters a lot given the read-heavy ratio; aim for a 90%+ hit rate.
- 301 vs 302 redirect trade-off — 301 is saved by the browser (fast, but misses repeat-visit counts); 302 hits the server every time (correct counts).
- Background analytics — click counting goes through Kafka instead of slowing down the redirect.
- Abuse prevention — rate limits, bad-URL scanning (Google Safe Browsing), CAPTCHA.

## Core Knowledge

Four methods create short codes. Random strings are simple but need costly checks for clashes. Hashing (MD5/SHA) the long URL and cutting it short gives the same result every time for the same input, but cutting it short brings back clash risk between different URLs. A Base62 counter — increasing an ID by one and writing it in 62 characters — gives fixed, clash-free codes, but the codes are easy to guess and count through, which is a security and business concern; a single counter is also a bottleneck and a single point of failure unless split up (e.g., with Zookeeper-managed ranges). Spread-out ID schemes like Twitter Snowflake or UUID v7 avoid the single-source bottleneck but produce slightly longer IDs.

The redirect path (GET /{shortCode}) is built around caching: check Redis first, fall back to the database on a miss, then fill the cache — click-count updates happen in the background via Kafka so they never slow down the redirect. Most real shorteners pick a 302 (temporary) redirect over 301 (permanent) exactly because 301 gets saved by the browser and stops reaching the server on repeat visits, losing count data. At scale, the database (PostgreSQL for medium scale, Cassandra/DynamoDB for huge scale) is split by short-code prefix or hash, backed by CDN edge caching for viral links, with read copies handling the 100:1 read skew. Common mistakes include using long UUID-style codes (which defeats the point of "short"), skipping the cache layer, writing analytics counts right away instead of in the background, and depending on one non-split ID generator.

## Interview Questions

**Q: Why is a Base62 counter usually picked over random-string creation?**
A: It guarantees no clashes and needs no check-and-retry loop, at the cost of producing guessable, in-order codes that may need hiding for security.

**Q: Why do most URL shorteners use a 302 redirect instead of a 301?**
A: A 301 (permanent) redirect gets saved by the browser, so repeat visits never reach the server — losing click counts. A 302 (temporary) redirect is checked again on every visit, keeping counts correct at the cost of one extra round trip.

**Q: Why is a single ID-generation service a risk at scale?**
A: It becomes both a single point of failure and a speed bottleneck; the fix is to split ID generation (e.g., pre-set ranges managed via Zookeeper) or use a spread-out scheme like Snowflake.

## Scenario

A shortened link is shared in a viral tweet and suddenly gets millions of hits per second. The system leans on its multi-layer read path — CDN edge cache, then Redis, then database — so most redirects are served without ever reaching the database, while click events are still recorded in the background through Kafka for later analytics.

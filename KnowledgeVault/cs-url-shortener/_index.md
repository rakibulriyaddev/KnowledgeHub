---
id: cs-url-shortener
title: "Case Study: URL Shortener (TinyURL)"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, case-study, caching, sharding, key-generation]
parent: case-studies
children: []
status: draft
---

## Overview

Designing a URL shortener is the most common system-design interview question precisely because it looks trivial but hides real depth: the core encode/decode logic is simple, while the actual challenge is handling a read-heavy (100:1), billions-of-URLs workload with low-latency redirects.

## Key Concepts

- Short code generation strategies — random, hash-truncation, Base62 counter, or Snowflake-style distributed IDs.
- Base62 counter — an auto-increment ID encoded in a-z/A-Z/0-9, giving 62^6 (~56B) combinations at 6 characters with no collisions.
- Redis caching of hot URLs is essential given the read-heavy ratio; target 90%+ hit rate.
- 301 vs 302 redirect trade-off — 301 is cached by the browser (fast, but analytics miss repeat visits); 302 hits the server every time (accurate analytics).
- Async analytics — click counting goes through Kafka rather than blocking the redirect path.
- Abuse prevention — rate limiting, malicious-URL scanning (Google Safe Browsing), CAPTCHA.

## Core Knowledge

Four strategies generate short codes. Random strings are simple but need expensive collision checks. Hashing (MD5/SHA) the long URL and truncating gives determinism (same input, same output) but truncation reintroduces collision risk between different URLs. A Base62 counter — auto-incrementing an ID and encoding it in 62 characters — gives deterministic, collision-free codes, but sequential IDs are predictable and can be enumerated, a security/business concern; a single counter is also a bottleneck and single point of failure unless sharded (e.g., via Zookeeper-coordinated ranges). Distributed ID schemes like Twitter Snowflake or UUID v7 avoid the single-source bottleneck at the cost of slightly longer IDs.

The redirect path (GET /{shortCode}) is optimized around caching: check Redis first, fall back to the database on a miss, then populate the cache — click-count increments happen asynchronously via Kafka so they never slow down the redirect. Most production shorteners choose a 302 (temporary) redirect over 301 (permanent) specifically because 301 gets cached by the browser and stops hitting the server on repeat visits, losing analytics visibility. At scale, the database (PostgreSQL for moderate scale, Cassandra/DynamoDB for massive scale) is sharded by short-code prefix or hash, fronted by CDN edge caching for viral URLs, with read replicas absorbing the 100:1 read skew. Common anti-patterns include using long UUID-style codes (defeats the purpose of "short"), skipping the cache layer, doing synchronous analytics writes, and relying on a single non-sharded ID generator.

## Interview Questions

**Q: Why is a Base62 counter usually preferred over random-string generation?**
A: It guarantees no collisions and requires no collision-check-and-retry loop, at the cost of producing predictable, sequential codes that may need obfuscation for security.

**Q: Why do most URL shorteners use a 302 redirect instead of a 301?**
A: A 301 (permanent) redirect gets cached by the browser, so repeat visits never reach the server — losing click analytics. A 302 (temporary) redirect is re-validated on every visit, keeping analytics accurate at the cost of an extra round trip.

**Q: Why is a single ID-generation service a design risk at scale?**
A: It becomes both a single point of failure and a throughput bottleneck; the fix is to shard ID generation (e.g., pre-allocated ranges coordinated via Zookeeper) or use a distributed scheme like Snowflake.

## Scenario

A shortened link is shared in a viral tweet and suddenly receives millions of hits per second. The system leans on its multi-tier read path — CDN edge cache, then Redis, then database — so the vast majority of redirects are served without ever reaching the database, while click events are still recorded asynchronously through Kafka for later analytics.

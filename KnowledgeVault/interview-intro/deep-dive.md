---
title: "System Design Interviews - An Introduction — Deep Dive"
---

"Design Twitter for me," the interviewer says. You have 45 minutes. The candidate who starts drawing a database schema right away fails. The one who takes a structured approach, asks questions, and discusses trade-offs passes. This chapter teaches that framework.

## Why this interview?

In a system design interview, a company is looking for:

- Structured thinking on real-world, ambiguous problems.
- Decision-making that understands trade-offs.
- Communication and collaboration.
- Production-grade thinking - scale, reliability, security.
- A core skill for senior-level roles.

## Typical Format

- **Duration:** 45-60 minutes.
- **Whiteboard / virtual board.**
- **Open-ended:** "Design Instagram."
- **Discussion-based:** The interviewer guides you.
- **One main system:** sometimes with sub-questions.

## 7-Step Framework

```
1. Requirements (Functional + Non-functional)
2. Capacity Estimation
3. API Design / High-level
4. Data Model
5. High-Level Architecture
6. Detailed Design (component deep-dive)
7. Bottlenecks + Trade-offs
```

## Step 1: Requirements (5-10 min)

Clarify first - discuss scope with the interviewer.

### Functional Requirements

- What features are needed?
- "Design Twitter" → tweet, follow, timeline, search?
- Identify the critical path.

### Non-Functional Requirements

- **Scale:** DAU, requests/sec.
- **Latency:** Acceptable response time.
- **Availability:** 99.9%? 99.99%?
- **Consistency:** Strong vs eventual.
- **Durability:** Is data loss tolerable?

**Tip:** Don't be afraid to ask the interviewer questions. Clarification is a strength.

## Step 2: Capacity Estimation (5 min)

Numbers ground the design in reality.

### Common estimates

- **DAU:** Daily Active Users.
- **QPS:** Queries per second. Read/Write ratio.
- **Storage:** Per record × records × years.
- **Bandwidth:** Storage / time.
- **Memory:** Hot data cache.

### Example - Twitter

```
DAU: 200M
Tweets/day: 200M users × 2 tweets = 400M
Tweet QPS: 400M / 86400 ≈ 4,600 writes/sec
Read/write: 100:1 → 460K reads/sec
Storage/tweet: 280 chars + metadata ≈ 1KB
Daily storage: 400M × 1KB = 400GB/day
Yearly: 400GB × 365 = 146TB/year
```

## Step 3: API Design (5 min)

Define the external interface.

```
POST /tweet
  body: { text, mediaUrl }
  returns: { tweetId, timestamp }

GET /timeline?userId=X&limit=20&cursor=Y
  returns: { tweets[], nextCursor }

POST /follow
  body: { followeeId }
```

## Step 4: Data Model (5 min)

Core entities and their relationships.

```
User: { id, name, email, ... }
Tweet: { id, userId, text, timestamp, mediaUrl }
Follow: { followerId, followeeId, timestamp }
Timeline: { userId, tweetIds[] } -- denormalized
```

Discuss SQL vs NoSQL - the trade-offs.

## Step 5: High-Level Architecture (10 min)

A box-and-arrow diagram.

```
[Client] → [LB] → [API Gateway]
  ↓
[Auth] [Tweet Service] [Timeline Service]
  ↓ ↓
[Tweet DB] [Cache] [Timeline DB]
  ↓
[Message Queue]
  ↓
[Fan-out Worker] → updates timelines
```

## Step 6: Deep Dive (10-15 min)

Go deep on one component, based on the interviewer's interest.

### Example: Timeline generation

- **Pull (lazy):** Fetch and sort followees' tweets at read time.
- **Push (eager):** Inject into followers' timelines when a tweet is posted.
- **Hybrid:** Pull for celebrities (millions of followers); push for normal users.

Discuss the trade-offs.

## Step 7: Bottlenecks & Scale (5 min)

- Identify single points of failure.
- Handle hot spots (celebrity users).
- DB sharding strategy.
- Caching layers.
- Replication, geo-distribution.
- Monitoring, alerting.

## Do's and Don'ts

### Do's

- Clarify before designing.
- Think aloud - communicate your reasoning.
- Estimate numbers.
- Discuss trade-offs.
- Acknowledge what you don't know.
- Keep diagrams clear.
- Iterate - start simple, add complexity.

### Don'ts

- Start directly with a schema.
- Over-engineer - premature optimization.
- Use buzzwords without understanding them.
- Think silently - the interviewer can't read your mind.
- Ignore non-functional requirements.
- Apply one-size-fits-all thinking (e.g., "Use Kafka" for everything).

## Common Interview Questions

1. **URL Shortener (TinyURL, bit.ly)**
2. **WhatsApp / Messenger**
3. **Twitter / Instagram newsfeed**
4. **Uber / Lyft ride matching**
5. **Netflix / YouTube video streaming**
6. **Web crawler**
7. **Notification system**
8. **Distributed cache (Redis)**
9. **Search autocomplete**
10. **Rate limiter**
11. **Distributed file storage (Dropbox)**
12. **Payment system**

## Preparation Resources

- Alex Xu's "System Design Interview" - the most popular.
- Donne Martin's GitHub System Design Primer.
- Grokking the System Design Interview (Educative).
- YouTube: System Design Interview (Mikhail Smarshchok).
- Real engineering blogs (Netflix, Uber, Airbnb engineering).
- This book - System Design Bangla.

## Practice Strategy

1. Understand the concepts well (Parts 1-4 of this book).
2. Study famous case studies (the next 5 chapters).
3. Mock interview - practice with a peer.
4. Read real engineering blogs.
5. Think about the same problem at different scales.

## Common Mistakes

1. **Memorizing one solution:** you need to know the variations.
2. **Buzzword-driven:** "Just use Kafka" - but why?
3. **No trade-off discussion:** every choice has a cost.
4. **Over-confidence:** saying "I don't know" is OK.
5. **Ignoring scale:** numbers ground the design in reality.
6. **Silent monologue:** communicate continuously.

## Best Practices

- Don't memorize the designs of 5-10 famous case studies - internalize them instead.
- Deeply understand the building blocks (cache, LB, queue, DB).
- Read the architecture of real production systems.
- Record mock interviews - get feedback.
- Time management - stick to a time budget for each step.

## Chapter Summary

- A system design interview is open-ended, structured thinking.
- 7-step framework: Requirements → Estimate → API → Data → Architecture → Deep dive → Bottlenecks.
- Communicate, clarify, discuss trade-offs.
- Don't memorize - internalize the building blocks.
- Practicing mock interviews is essential.

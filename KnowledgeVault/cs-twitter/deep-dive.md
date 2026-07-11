---
title: "Case Study: Twitter / X — Deep Dive"
---

Elon Musk posts a tweet. How does it reach the timelines of 150 million followers so quickly? And yet a brand-new user's timeline still loads in 200ms? Twitter's architecture is the most dramatic case study in system design interviews.

## Step 1: Requirements

### Functional

- Post a tweet (280 chars + media).
- Follow/unfollow.
- Home timeline (tweets from people you follow).
- User timeline (your own tweets).
- Search / hashtag.
- Retweet, like, reply.

### Non-Functional

- Read-heavy (100:1).
- Timeline load <200ms.
- Eventually consistent is OK (1-2 sec).
- High availability.

## Step 2: Capacity Estimation

```
DAU: 250M
Tweets/day: 500M (avg 2/user)
Tweets/sec: 500M / 86400 ≈ 5,800 writes/sec
Read QPS: 5,800 × 100 = 580K timeline reads/sec

Per tweet: ~1KB
Daily tweet storage: 500GB
Timeline cache (per user 800 tweets): 1KB × 800 × 250M = 200TB
```

## Step 3: API Design

```
POST /tweet { text, mediaUrls? }
GET /timeline?cursor=X&limit=20
POST /follow { userId }
GET /user/:id/tweets
GET /search?q=...
```

## Step 4: Data Model

```
User: { id, name, handle, follower_count, ... }
Tweet: {
  id (Snowflake), user_id, text,
  media_urls[], created_at,
  reply_to, retweet_of
}
Follow: { follower_id, followee_id, ts }
Timeline (cache): { user_id, tweet_ids[] (latest 800) }
Engagement: { tweet_id, likes, retweets, replies }
```

## The Big Question: Timeline Generation

Three approaches:

### Approach 1: Pull (Read-time fan-out)

When the user views their timeline - fetch recent tweets from every followee + sort.

- **Pros:** Less storage, fast writes.
- **Cons:** Slow reads - fetching data for N users.
- **Use case:** Inactive users, users following few people.

### Approach 2: Push (Write-time fan-out)

When a tweet is posted - inject it into every follower's timeline cache.

- **Pros:** Reads are super fast - pre-computed.
- **Cons:** Writes are expensive - a disaster for celebrities.
- **Celebrity problem:** Elon Musk's tweet → 150M timeline writes.

### Approach 3: Hybrid (Twitter's Choice)

Most users get push; celebrities get pull.

- User with < 1M followers → push.
- Celebrity (1M+) → pull at read time.
- A user's timeline = pre-computed timeline + live fetch from celebrities + merge.

## Step 5: Architecture

```
[Client]
  ↓
[CDN] [LB]
  ↓
[API Gateway]
  ↓ ↓ ↓
[Tweet Service] [Timeline Service] [User Service]
  ↓ ↓ ↓
[Kafka] [Redis Timeline Cache] [User DB]
  ↓
[Fan-out Workers] → [Followers' Timelines]
  ↓
[Tweet Storage] (Cassandra/Manhattan)
[Search Index] (Elasticsearch)
```

## Step 6: Components

### Tweet Storage

- Manhattan/Cassandra (Twitter's internal system).
- Sharded by user_id.
- Snowflake ID - time-ordered.

### Timeline Cache (Redis)

- Latest 800 tweet IDs per user.
- Sorted by time.
- Eviction: inactive users (3 days without login).

### Fan-out Service

1. New tweet → Kafka event.
2. A worker fetches the tweet author's followers.
3. Prepends the tweet ID into each follower's timeline cache.
4. Skips celebrities - merged at runtime instead.

### Search

- Tweet → Elasticsearch index.
- Hashtag, full-text search.

## Celebrity Problem in Detail

When Elon Musk posts a tweet:

**Pure Push**
- 150M timeline writes
- Massive backend load
- Slow follower delivery
- Storage explosion

**Hybrid Approach**
- Celebrity tweet → no fan-out
- Followers' read-time merge
- Cache hit at celebrity level
- Manageable cost

## Trending Topics

- Stream processing (Storm/Heron).
- Hashtag counts over a sliding window.
- Real-time + decay function.
- Geographic trending.

## Scale Considerations

### Read Path

- Multi-tier cache (CDN → Redis → DB).
- Connection pooling.
- Pagination.

### Write Path

- Async fan-out via Kafka.
- Eventual consistency of 1-2 sec is OK.

### Storage

- Tweets sharded by user_id.
- Old tweets archived (cold storage).

## Real World

- 250M+ DAU.
- 500M+ tweets/day.
- Manhattan - Twitter's internal distributed DB.
- Heron - stream processing.
- Mesos - container orchestration.

## Trade-offs

- Push: write-heavy, fast reads, celebrity disaster.
- Pull: read-heavy, scalable writes, slow reads for active users.
- Hybrid: added complexity but right for both cases.
- Eventually consistent: fine if a tweet shows up 1-2 sec late.

## Engineering Lessons

1. Hybrid approach often best for skewed distributions.
2. Pre-computation trades storage for speed.
3. Eventually consistent OK for social.
4. Identify edge cases (celebrity).
5. Multi-tier caching essential.

## Chapter Summary

- Twitter timeline = read-heavy (100:1).
- Pull, Push, Hybrid - three strategies.
- Hybrid: normal users get push, celebrities get pull.
- Redis timeline cache + Cassandra storage.
- Async fan-out via Kafka.

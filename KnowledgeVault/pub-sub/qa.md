---
title: "Publish-Subscribe (Pub/Sub) — Q&A"
---

**Q: What is the core idea of Pub-Sub?**
A: One publisher → many subscribers broadcast — Pub-Sub = broadcast pattern; sending to a topic means every subscriber receives it.

**Q: What is the central concept in Pub-Sub?**
A: Topic/Channel — Topic = the route/channel of pub-sub.

**Q: What's the main difference between Queue and Pub-Sub?**
A: Queue: one consumer; Pub-Sub: all subscribers — Queue is point-to-point; Pub-Sub is broadcast.

**Q: What is fan-out?**
A: One event spread across multiple subscribers — Fan-out = broadcasting pattern.

**Q: Where does a tweet event go on Twitter?**
A: Followers' timelines (fan-out) — Twitter's timeline uses the fan-out pattern.

**Q: In Pub-Sub, the publisher needs to know its subscribers.**
A: False — Loose coupling - the publisher sends to a topic without knowing who will receive it.

**Q: What's the problem with Redis Pub/Sub (default)?**
A: No persistence - messages are missed if the subscriber is down — Default Redis Pub/Sub is fire-and-forget; use Streams for persistence.

**Q: In Kafka, what determines broadcast vs load-distribute?**
A: Consumer groups - same group = load distribute, different = broadcast — Load is split within the same consumer group; a separate copy goes to each different group.

**Q: What's the benefit of wildcard subscriptions?**
A: Receiving all events matching a pattern (order.*) — Hierarchical topics + wildcards = flexible subscription.

**Q: What is AWS's managed pub-sub service?**
A: SNS — SNS = Simple Notification Service.

**Q: When a video is uploaded - transcode, thumbnail, indexing, and notification are needed. Architecture?**
A: Pub-Sub: video.uploaded topic; 4 subscriber services — Loose coupling - a new feature just means adding a new subscriber.

**Q: You want to add a feature without changing any existing code. Which pattern?**
A: Pub-Sub - a new subscriber subscribes — Pub-Sub's biggest benefit - extensibility.

**Q: What is used for schema evolution?**
A: Avro or Protobuf - backward/forward compatible — So producer and consumer can handle different schema versions.

**Q: Pub-Sub has an exact realtime guarantee.**
A: False — Async - near-realtime; not exact realtime.

**Q: What is consumer lag?**
A: How far behind the subscriber is from the latest message — Fast producer + slow consumer = growing backlog.

**Q: What's a good topic naming convention?**
A: `domain.entity.event`, like order.payment.completed — Hierarchical naming = easier wildcard subscriptions.

**Q: What's the solution for backpressure?**
A: Auto-scale subscribers + monitor lag — Increase subscriber count or rate limit.

**Q: What happens in Kafka while a subscriber is down?**
A: Messages stay in the topic; the subscriber catches up once it's back — Kafka is persistent - replay is possible.

**Q: Pub-Sub is the foundation of event-driven architecture.**
A: True — The core mechanism of EDA - covered in detail in the next chapter.

**Q: Why should a subscriber be idempotent?**
A: Same result for duplicate messages - handles at-least-once delivery — Duplicates are common over the network - idempotency keeps correctness.

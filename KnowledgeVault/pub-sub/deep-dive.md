---
title: "Publish-Subscribe (Pub/Sub) — Deep Dive"
---

Think of a news magazine. It publishes an issue every month. The magazine doesn't need to know who has subscribed — it just publishes; subscribed readers receive it. That's exactly the **Pub-Sub pattern**.

## What is Pub-Sub?

**Publish-Subscribe** = a messaging pattern where a publisher sends a message to a topic, and every consumer subscribed to that topic receives a copy of the message.

### Core components

- **Publisher (Producer):** Creates and sends the message.
- **Topic (Channel):** The category/route for a message.
- **Subscriber (Consumer):** Receives the message from the topic.
- **Message Broker:** Manages topics and subscriptions.

## Structure

```
[Publisher A] ─┐
[Publisher B] ─┤
               ├─→ [Topic: order_events] ─→ [Subscriber 1: Email]
               │                          ├→ [Subscriber 2: Analytics]
               │                          ├→ [Subscriber 3: Inventory]
               │                          └→ [Subscriber 4: Recommendation]
```

## Queue vs Pub-Sub

**Queue (Point-to-Point)**
- Each message goes to one consumer
- Load distribution
- Order processing
- RabbitMQ default queue
- Once consumed → deleted

**Pub-Sub (Topic)**
- Every subscriber gets a copy
- Broadcast/notification
- Event-driven
- Kafka, Redis Pub/Sub
- Multiple consumer groups

## Benefits

- **Loose coupling:** Publisher and subscriber don't know each other.
- **Scalability:** Many subscribers can be added - publisher unaffected.
- **Flexibility:** New feature = new subscriber, no code change to the publisher.
- **Asynchronous:** Publisher fire-and-forget.
- **Many-to-many:** Multiple publishers, multiple subscribers.

## What kind of events go into topics?

Each domain event goes into a separate topic:

- `user.created` → email, analytics, recommendation
- `order.placed` → payment, inventory, shipping, notification
- `payment.failed` → alerting, retry, customer service
- `video.uploaded` → transcoding, thumbnail gen, indexing

## Pub-Sub Patterns

### Fan-out

One event spreads out to multiple subscribers.

Example: A Twitter user's post → gets injected into followers' timelines.

### Topic Filtering

A subscriber only receives messages matching a specific pattern.

- Subscribe: `order.*` → all order events.
- Subscribe: `order.placed` → only placed.

### Hierarchical Topics

- `asia.bangladesh.dhaka.weather`
- Subscriber wildcards: `asia.*.dhaka.*`

### Consumer Groups

Kafka's strength: multiple consumers in the same group - load distributed. Different groups → broadcast.

## Popular Pub-Sub Tools

- **Apache Kafka:** Industry leader, distributed log.
- **Redis Pub/Sub:** In-memory, fast, lightweight (no persistence by default).
- **Redis Streams:** Persistent + consumer groups.
- **Google Cloud Pub/Sub:** Managed, global scale.
- **AWS SNS:** Simple Notification Service - managed pub-sub.
- **RabbitMQ topic exchange:** Pub-sub routing.
- **NATS:** Cloud-native, high-performance.

## Challenges

### Subscriber Failure

What happens to a message when the subscriber is down?

- Persistent topic (Kafka) → backlog remains.
- Non-persistent (Redis Pub/Sub) → missed.

### Message Ordering

With multiple publishers - maintaining order is hard.

- FIFO within a Kafka partition; not across partitions.

### Backpressure

When a subscriber is slow - messages pile up.

- Auto-scale the subscriber, monitor consumer lag.

### Schema Evolution

If the publisher's schema changes - old subscribers break.

- Use backward-compatible formats (Avro, Protobuf).
- Schema registry (Kafka).

## Real-world examples

- **Twitter:** Tweet event → fan-out to followers' timelines.
- **Uber:** Driver location → multiple services (matching, surge, ETA).
- **Netflix:** Viewing event → recommendation, billing, analytics.
- **YouTube:** Upload event → transcoding, indexing, notification.
- **Banking:** Transaction event → audit, alert, fraud detection.

## When to use Pub-Sub?

- One event needs to trigger multiple actions.
- You want loose coupling.
- Future flexibility - possibility of adding new subscribers.
- Notification, broadcast.
- Event-driven architecture.
- Real-time dashboard.

## Common misconceptions

1. **"Pub-Sub = realtime":** It's async - there's no exact realtime guarantee.
2. **"All subscribers always receive":** Subscriber down + non-persistent topic = miss.
3. **"Pub-Sub = Queue":** Different patterns - broadcast vs point-to-point.

## Best Practices

- Design topics based on domain events.
- Use Avro/Protobuf for schema evolution.
- Idempotent subscribers (handle duplicates).
- Use Kafka for persistence + replay.
- Monitor consumer lag.
- Topic naming convention - `domain.entity.event`.

## Chapter summary

- Pub-Sub = one publisher → many subscribers broadcast.
- Loose coupling, scalability, flexibility.
- Queue vs Pub-Sub: load distribute vs broadcast.
- Kafka, Redis, Google Pub/Sub - top tools.
- Subscriber failure, ordering, schema - main challenges.

---
id: pub-sub
title: "Publish-Subscribe (Pub/Sub)"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, messaging, event-driven, distributed-systems]
parent: architecture-patterns
children: []
status: draft
---

## Overview

Publish-Subscribe is a messaging pattern where a publisher sends a message to a topic and every subscriber of that topic gets a copy — like a magazine publishing an issue without knowing who its readers are. It decouples producers from consumers as the broadcast counterpart to point-to-point queues.

## Key Concepts

- Core components — Publisher, Topic/Channel, Subscriber, Message Broker.
- Queue vs Pub-Sub — queue delivers to one consumer (load distribution); pub-sub delivers a copy to every subscriber (broadcast).
- Fan-out — one event spreads to many subscribers (e.g., a tweet reaching all followers).
- Topic filtering / hierarchical topics — subscribers match wildcards like `order.*` or `asia.*.dhaka.*`.
- Consumer groups (Kafka) — same group shares the load; different groups each get a full copy.
- Popular tools — Kafka, Redis Pub/Sub and Streams, Google Cloud Pub/Sub, AWS SNS, RabbitMQ topic exchange, NATS.

## Core Knowledge

Pub-Sub's main benefits are loose coupling (publisher and subscriber never know about each other), scalability (adding subscribers doesn't touch the publisher), flexibility (a new feature is just a new subscriber), and natural support for many-to-many, asynchronous, fire-and-forget messaging. Each domain event typically has its own topic — `order.placed` fans out to payment, inventory, shipping, and notification services, while `video.uploaded` fans out to transcoding, thumbnail generation, and indexing.

**Caution:** the pattern carries real operational challenges. What happens to a message when a subscriber is down depends on persistence — Kafka retains a backlog to replay, while default Redis Pub/Sub simply drops it. Ordering is only guaranteed within a partition, not globally. Backpressure builds when a subscriber is slower than the publisher, requiring auto-scaling and consumer-lag monitoring. Schema evolution needs backward-compatible formats (Avro, Protobuf) and a schema registry. Because delivery is often at-least-once, subscribers should be idempotent. A common misconception treats Pub-Sub as synonymous with "realtime" — it's asynchronous, and distinct from point-to-point queues.

## Interview Questions

**Q: How does Pub-Sub differ from a message queue?**
A: A queue delivers each message to exactly one consumer for load distribution; Pub-Sub broadcasts a copy of each message to every subscriber of a topic.

**Q: What happens to messages when a subscriber is offline?**
A: It depends on persistence — a persistent topic (Kafka) keeps a backlog for the subscriber to catch up on, while non-persistent Pub-Sub (default Redis) simply loses the message.

**Q: Why must Pub-Sub subscribers be idempotent?**
A: Because delivery is commonly at-least-once, duplicate messages are expected over the network, and idempotency keeps the resulting state correct despite reprocessing.

## Scenario

When a user uploads a video to a platform like YouTube, the `video.uploaded` event is published to a topic, and four independent subscribers — transcoding, thumbnail generation, search indexing, and notifications — each receive their own copy and act in parallel, with no changes needed to the upload service when a new subscriber is added later.

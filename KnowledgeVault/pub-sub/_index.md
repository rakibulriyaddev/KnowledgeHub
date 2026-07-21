---
id: pub-sub
title: "Publish-Subscribe (Pub/Sub)"
created: 2026-07-11
modified: 2026-07-22
tags: [architecture, messaging, event-driven, distributed-systems]
parent: architecture-patterns
children: []
status: draft
---

## Overview

Publish-Subscribe is a messaging pattern where a publisher sends a message to a topic, and every subscriber of that topic gets a copy — like a magazine that goes out to every reader without knowing who they are. It splits producers from consumers. It is the broadcast version of point-to-point queues.

## Key Concepts

- Core parts — Publisher, Topic/Channel, Subscriber, Message Broker.
- Queue vs Pub-Sub — a queue sends each message to one consumer (spreads out load); pub-sub sends a copy to every subscriber (broadcast).
- Fan-out — one event reaches many subscribers (like a tweet reaching all followers).
- Topic filtering / topic trees — subscribers can match patterns like `order.*` or `asia.*.dhaka.*`.
- Consumer groups (Kafka) — one group shares the load; different groups each get a full copy.
- Popular tools — Kafka, Redis Pub/Sub and Streams, Google Cloud Pub/Sub, AWS SNS, RabbitMQ topic exchange, NATS.

## Core Knowledge

Pub-Sub's main gains are loose coupling (publisher and subscriber never know about each other), easy growth (adding subscribers doesn't touch the publisher), flexibility (a new feature is just a new subscriber), and natural support for many-to-many, non-blocking, fire-and-forget messages. Each domain event usually has its own topic — `order.placed` goes out to payment, inventory, shipping, and notification services, while `video.uploaded` goes out to transcoding, thumbnail making, and indexing.

**Caution:** the pattern brings real problems to run in production. What happens to a message when a subscriber is down depends on whether it's saved — Kafka keeps a backlog to replay, while default Redis Pub/Sub just drops it. Order is only kept within one partition, not across the whole topic. Backpressure builds when a subscriber is slower than the publisher, so you need auto-scaling and lag checks. Message formats need to change in a safe way (Avro, Protobuf) with a schema registry. Because delivery is often at-least-once, subscribers should be safe to run twice (idempotent). A common wrong idea is that Pub-Sub means "realtime" — it's actually async, and different from point-to-point queues.

## Interview Questions

**Q: How does Pub-Sub differ from a message queue?**
A: A queue sends each message to exactly one consumer to spread out load; Pub-Sub sends a copy of each message to every subscriber of a topic.

**Q: What happens to messages when a subscriber is offline?**
A: It depends on whether messages are saved — a topic that saves messages (Kafka) keeps a backlog for the subscriber to catch up on, while non-saving Pub-Sub (default Redis) just loses the message.

**Q: Why must Pub-Sub subscribers be safe to run twice (idempotent)?**
A: Because delivery is usually at-least-once, repeat messages are normal over a network, and being safe to run twice keeps the final state correct even after reprocessing.

## Scenario

When a user uploads a video to a platform like YouTube, the `video.uploaded` event is sent to a topic, and four separate subscribers — transcoding, thumbnail making, search indexing, and notifications — each get their own copy and act at the same time, with no change needed to the upload service when a new subscriber is added later.

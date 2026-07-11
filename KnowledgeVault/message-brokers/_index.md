---
id: message-brokers
title: "Message Brokers & Queues"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, messaging, distributed-systems, asynchronous]
parent: architecture-patterns
children: []
status: draft
---

## Overview

A Message Broker is middleware that transmits messages asynchronously between a producer and a consumer, so the two never need to know about each other. It's what lets an e-commerce order return "OK" immediately while payment, inventory, email, and recommendations all happen in the background instead of blocking the user.

## Key Concepts

- **Producer/Consumer** — sender and receiver of a message, decoupled through the broker.
- **Point-to-point (Queue)** — one message, consumed by exactly one consumer.
- **Publish-Subscribe (Topic)** — one message, broadcast to every subscriber.
- **Delivery guarantees** — at-most-once, at-least-once (most common), exactly-once (hard, Kafka via transactions).
- **Dead Letter Queue (DLQ)** — holding area for messages that repeatedly fail processing.

## Core Knowledge

Message brokers exist to decouple, buffer, and add reliability to communication between services: producers fire-and-forget, messages persist safely during traffic spikes, and if a consumer goes down nothing is lost. There are two core delivery patterns — point-to-point queues where each message is consumed exactly once (good for order processing, load-balanced across consumers), and pub-sub topics where every subscriber gets its own copy (good for notifications and broadcast events).

**RabbitMQ** and **Apache Kafka** are the two dominant brokers and solve different problems. RabbitMQ speaks AMQP, pushes messages to consumers, offers flexible exchange-based routing, and deletes a message once acknowledged — a good fit for workflows and RPC-style tasks. Kafka is a distributed, pull-based log: consumers pull at their own pace, messages are retained so they can be replayed, throughput reaches millions/sec, and ordering is guaranteed only within a partition — the natural choice for event streaming and event sourcing. AWS SQS (managed, serverless) and Redis Streams (in-memory, limited durability) round out the common options.

**Note:** at-least-once is the default delivery guarantee in most systems, so consumers must be idempotent since duplicates are possible; exactly-once is achievable but hard — Kafka does it via its transactional/idempotent-producer API. Production reliability also depends on disk persistence, replication across brokers, acknowledgment-triggered redelivery, and routing failed messages to a Dead Letter Queue rather than losing them silently.

## Interview Questions

**Q: What's the fundamental difference between a queue (point-to-point) and a topic (pub-sub)?**
A: In a queue, each message is consumed by exactly one consumer; in a topic, every subscriber gets its own copy.

**Q: When would you choose Kafka over RabbitMQ?**
A: For very high throughput, replayable/persisted event streams, and partition-based ordering — e.g., event sourcing. RabbitMQ wins for complex, flexible routing in workflow-style tasks.

**Q: Why must consumers be idempotent in most messaging systems?**
A: At-least-once delivery — the most common guarantee — can redeliver the same message; the consumer must produce the same result regardless of how many times it processes it.

## Scenario

An order is placed on an e-commerce site: the API writes the order and immediately publishes an "OrderCreated" event, returning success to the user in milliseconds. Separate consumers — for payment, inventory, email, and recommendations — each pull that event and do their work asynchronously, so a spike in orders never makes checkout hang.

---
id: message-brokers
title: "Message Brokers & Queues"
created: 2026-07-11
modified: 2026-07-22
tags: [architecture, messaging, distributed-systems, asynchronous]
parent: architecture-patterns
children: []
status: draft
---

## Overview

A message broker is middleware that sends messages between a producer and a consumer without blocking, so the two never need to know about each other. It is what lets an online order return "OK" right away, while payment, inventory, email, and recommendations all run in the background instead of making the user wait.

## Key Concepts

- **Producer/Consumer** — the sender and receiver of a message, kept apart by the broker.
- **Point-to-point (Queue)** — one message, consumed by exactly one consumer.
- **Publish-Subscribe (Topic)** — one message, broadcast to every subscriber.
- **Delivery guarantees** — at-most-once, at-least-once (most common), exactly-once (hard, Kafka via transactions).
- **Dead Letter Queue (DLQ)** — a holding area for messages that keep failing to process.

## Core Knowledge

Message brokers exist to keep services apart, hold messages safely, and add reliability to how services talk. Producers send and forget, messages are kept safe during traffic spikes, and if a consumer goes down, nothing is lost. There are two core delivery patterns: point-to-point queues, where each message is used by exactly one consumer (good for order processing, spread across many consumers), and pub-sub topics, where every subscriber gets its own copy (good for notifications and broadcast events).

**RabbitMQ** and **Apache Kafka** are the two most-used brokers, and they solve different problems. RabbitMQ speaks AMQP, pushes messages out to consumers, offers flexible exchange-based routing, and deletes a message once it is acknowledged — a good fit for workflows and RPC-style tasks. Kafka is a distributed, pull-based log: consumers pull messages at their own pace, messages are kept so they can be replayed, throughput can reach millions per second, and order is only guaranteed within one partition — the natural choice for event streaming and event sourcing. AWS SQS (managed, serverless) and Redis Streams (in-memory, limited durability) are other common choices.

**Note:** at-least-once is the default delivery guarantee in most systems, so consumers must be idempotent, since duplicate messages are possible. Exactly-once is possible but hard — Kafka does it through its transactional and idempotent-producer API. Real-world reliability also depends on saving messages to disk, copying them across brokers, redelivering messages that were not acknowledged, and sending failed messages to a Dead Letter Queue instead of losing them quietly.

## Interview Questions

**Q: What's the fundamental difference between a queue (point-to-point) and a topic (pub-sub)?**
A: In a queue, each message is used by exactly one consumer. In a topic, every subscriber gets its own copy.

**Q: When would you choose Kafka over RabbitMQ?**
A: For very high throughput, event streams that can be replayed and are saved, and ordering within a partition — for example, event sourcing. RabbitMQ wins for complex, flexible routing in workflow-style tasks.

**Q: Why must consumers be idempotent in most messaging systems?**
A: At-least-once delivery — the most common guarantee — can send the same message more than once. The consumer must produce the same result no matter how many times it processes that message.

## Scenario

An order is placed on an online shop: the API saves the order and right away sends out an "OrderCreated" event, returning success to the user in milliseconds. Separate consumers — for payment, inventory, email, and recommendations — each pull that event and do their work without blocking, so a spike in orders never makes checkout hang.

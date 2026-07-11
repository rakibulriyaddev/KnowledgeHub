---
id: event-driven-architecture
title: "Event-Driven Architecture (EDA)"
created: 2026-07-11
modified: 2026-07-11
tags: [messaging, microservices, scalability, loose-coupling]
parent: architecture-patterns
children: []
status: draft
---

## Overview

Event-Driven Architecture makes the event — a record that something already happened — the primary way services communicate, instead of one service calling another directly. A producer emits an event and knows nothing about who consumes it, which is the opposite of the tight coupling created by explicit function calls chained together.

## Key Concepts

- Event (past tense, e.g. `OrderPlaced`) vs Command (imperative, e.g. `PlaceOrder`) vs Message (generic transport unit, can be either).
- Core components: event producer, event consumer, event channel/broker (Kafka, RabbitMQ), event schema, event store.
- Patterns: Event Notification (lightweight, ID only), Event-Carried State Transfer (full state included), Event Sourcing, CQRS.
- Main benefits: loose coupling, scalability, flexibility to add new consumers without touching the producer.
- Main challenges: eventual consistency, schema evolution, cross-service debugging, ordering, duplicate delivery.

## Core Knowledge

In a traditional design, one function (e.g. `placeOrder`) directly calls every dependent action — charge payment, reduce inventory, send email — coupling them together; adding a new reaction means editing that function. In EDA, `placeOrder` simply emits an `OrderPlaced` event, and each interested service subscribes and reacts independently — a new feature just means a new subscriber, producer unchanged. Two common styles are Event Notification (the event carries just an ID, consumers fetch details) and Event-Carried State Transfer (the full state rides along, so consumers never call back to the source).

**Caution:** EDA trades synchronous certainty for eventual consistency, and adds operational load: schemas must evolve backward-compatibly, consumers must be idempotent since delivery is typically at-least-once, ordering across partitions is hard, and tracing a chain requires correlation IDs and distributed tracing.

EDA earns its complexity when multiple services must react to the same event or an audit trail is needed, and it works fine inside a modular monolith with an internal event bus, not only microservices. It's overkill for simple CRUD apps or strictly sequential workflows. Kafka, AWS EventBridge, and Pub/Sub are the dominant platforms.

## Interview Questions

**Q: What's the difference between an event and a command?**
A: An event is past tense, describing something that already happened, broadcast to many listeners with no reply expected; a command is imperative and directed at one handler.

**Q: Why is idempotency important for event consumers?**
A: Most brokers guarantee at-least-once delivery, so the same event can arrive twice — consumers must handle duplicates without corrupting state.

**Q: Does EDA require microservices?**
A: No — EDA works inside a modular monolith using an internal event bus; it's a communication style, not a deployment topology.

## Scenario

When a user registers, an e-commerce platform emits a single `UserRegistered` event; separate services independently send the welcome email, create the profile, and log analytics — adding a loyalty-points feature later means adding one new subscriber, with zero changes to the registration code.

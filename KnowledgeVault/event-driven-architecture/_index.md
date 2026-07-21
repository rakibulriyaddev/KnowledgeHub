---
id: event-driven-architecture
title: "Event-Driven Architecture (EDA)"
created: 2026-07-11
modified: 2026-07-22
tags: [messaging, microservices, scalability, loose-coupling]
parent: architecture-patterns
children: []
status: draft
---

## Overview

Event-Driven Architecture (EDA) makes the event — a record that something already happened — the main way services talk to each other, instead of one service calling another directly. A producer sends out an event and knows nothing about who reads it. This is the opposite of the tight coupling you get from chaining explicit function calls together.

## Key Concepts

- Event (past tense, e.g. `OrderPlaced`) vs Command (an order to do something, e.g. `PlaceOrder`) vs Message (a general transport unit, which can be either).
- Core components: event producer, event consumer, event channel/broker (Kafka, RabbitMQ), event schema, event store.
- Patterns: Event Notification (lightweight, ID only), Event-Carried State Transfer (full state included), Event Sourcing, CQRS.
- Main benefits: loose coupling, ability to scale, and the flexibility to add new consumers without touching the producer.
- Main challenges: eventual consistency, changing schemas over time, debugging across services, keeping order, and duplicate delivery.

## Core Knowledge

In a traditional design, one function (like `placeOrder`) directly calls every action it depends on — charge payment, reduce inventory, send email — coupling them all together. Adding a new reaction means editing that function. In EDA, `placeOrder` just sends out an `OrderPlaced` event, and each interested service subscribes and reacts on its own — a new feature just means adding a new subscriber, with no change to the producer. Two common styles are Event Notification (the event carries just an ID, and consumers fetch the details themselves) and Event-Carried State Transfer (the full state travels with the event, so consumers never need to call back to the source).

**Caution:** EDA trades the certainty of a direct call for eventual consistency, and adds extra operational work: schemas must change in a backward-compatible way, consumers must be idempotent since delivery is usually at-least-once, keeping order across partitions is hard, and tracing a chain of events needs correlation IDs and distributed tracing.

EDA is worth its extra complexity when many services must react to the same event, or when an audit trail is needed. It also works fine inside a modular monolith with an internal event bus, not just in microservices. It is too much for simple CRUD apps or workflows that must run strictly in order. Kafka, AWS EventBridge, and Pub/Sub are the main platforms used for this.

## Interview Questions

**Q: What's the difference between an event and a command?**
A: An event is past tense — it describes something that already happened, and is sent to many listeners with no reply expected. A command is an order to do something, and is sent to one specific handler.

**Q: Why is idempotency important for event consumers?**
A: Most brokers only guarantee at-least-once delivery, so the same event can arrive twice. Consumers must handle duplicates without corrupting their state.

**Q: Does EDA require microservices?**
A: No — EDA works fine inside a modular monolith using an internal event bus. It is a style of communication, not a way of deploying the system.

## Scenario

When a user registers, an e-commerce platform sends out a single `UserRegistered` event. Separate services independently send the welcome email, create the profile, and log analytics. Adding a loyalty-points feature later just means adding one new subscriber, with zero changes to the registration code.

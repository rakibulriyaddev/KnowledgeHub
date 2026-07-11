---
title: "Event-Driven Architecture (EDA) — Q&A"
---

**Q: What defines EDA?**
A: Communication via event publish/subscribe — State change → event; consumer reacts.

**Q: What's the difference between Event vs Command?**
A: Event is past tense (something happened); Command is imperative (do this) — OrderPlaced (event) vs PlaceOrder (command).

**Q: What tense should an event be in?**
A: Past — like UserRegistered — Event = something that already happened.

**Q: What's the primary benefit of EDA?**
A: Loose coupling — producer and consumer are independent — Producer doesn't know the consumer; flexibility.

**Q: What happens in the Event Notification pattern?**
A: A lightweight event — an ID; consumer fetches details — A notification + lookup pattern.

**Q: What happens in Event-Carried State Transfer?**
A: Full state in the event — consumer doesn't need to go to the source — Self-contained event → independent consumer.

**Q: EDA only works with microservices.**
A: False — EDA is possible in a modular monolith too, with an internal event bus.

**Q: What are the primary tools for EDA?**
A: Apache Kafka, EventBridge, Pub-Sub — Event broker/streaming platforms.

**Q: What is a challenge of EDA?**
A: Eventual consistency, cross-service debugging — Tracing + syncing is hard in distributed systems.

**Q: Idempotent consumers are important in EDA.**
A: True — At-least-once delivery; need to handle duplicate processing.

**Q: When a user registers - email, profile, analytics, recommendation, welcome bonus all need to run. Which approach makes adding a new feature easy?**
A: EDA - UserRegistered event; new service subscribes — Producer code stays untouched; just add a new subscriber.

**Q: A simple CRUD admin panel. Should we use EDA?**
A: No - overkill, a simple call is better — EDA's complexity is wasted on single-user CRUD.

**Q: What's important for debugging in EDA?**
A: Correlation ID + distributed tracing — Correlation ID to trace cross-service event chains.

**Q: What's needed for schema evolution?**
A: Backward/forward compatibility - Avro, Protobuf — So producer and consumer can handle all versions.

**Q: What is CQRS?**
A: Command Query Responsibility Segregation - read and write separated — A pattern common with EDA.

**Q: EDA easily provides strong consistency.**
A: False — EDA typically means eventual consistency; strong consistency is hard.

**Q: How much data should you put in an event?**
A: Enough context - to avoid chatty fetches but not huge — Balance: too little = chatty; too much = bloat.

**Q: Why is EDA good for real-time analytics?**
A: Reacts to events immediately = near-real-time processing — Event push is faster than sync polling.

**Q: What's a use case for EDA in banking?**
A: Transaction event → fraud detection, audit, alerts (real-time) — Each transaction is reacted to by multiple downstream systems.

**Q: EDA can turn into an over-event antipattern.**
A: True — Don't turn every action into an event; sometimes a simple call is better.

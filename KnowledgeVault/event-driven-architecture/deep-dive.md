---
title: "Event-Driven Architecture (EDA) — Deep Dive"
---

In a traditional system: when a user registers - the code makes explicit calls: `sendWelcomeEmail()`, `createProfile()`, `addToAnalytics()`. Adding a new task means changing the registration code. In EDA: registration simply emits a `UserRegistered` event; other systems listen and react. The opposite of tight coupling.

## What is EDA?

**Event-Driven Architecture** = an architectural pattern where state changes are published as events, and interested services react to those events. Events are the primary communication mechanism.

## Event vs Message vs Command

| | Event | Command |
|---|---|---|
| Tense | Past tense (UserRegistered, OrderPlaced) | Imperative (RegisterUser, PlaceOrder) |
| Meaning | Something happened | "Do this" |
| Listeners | Many listeners | One handler typically |
| Sender expectation | Sender knows nothing about receiver | Sender expects action |
| Character | "Notification" character | Direct intent |

**Message** is the generic term — can be an event or a command, a transport unit (header + payload), a wider concept than either.

## Core components of EDA

- **Event Producer:** Publishes events.
- **Event Consumer:** Subscribes to and reacts to events.
- **Event Channel/Broker:** Event transport (Kafka, RabbitMQ).
- **Event Schema:** The structure of the event (Avro, JSON Schema).
- **Event Store:** Persistent log (used in Event Sourcing).

## Example — E-commerce

Traditional approach:
```
function placeOrder(order) {
  saveOrder(order);
  chargePayment(order);
  reduceInventory(order);
  sendConfirmationEmail(order);
  updateRecommendations(order);
  notifyShipping(order);
}
// everything coupled together in one place
```

EDA approach:
```
function placeOrder(order) {
  saveOrder(order);
  emit("OrderPlaced", order);
}
// Subscribed services react:
// PaymentService → charge
// InventoryService → reduce
// EmailService → send confirmation
// RecommendationService → update
// ShippingService → notify
```

## EDA Patterns

### 1. Event Notification
A lightweight event — just an ID/reference. The consumer fetches details if it wants.

### 2. Event-Carried State Transfer
The full state is in the event. The consumer stores this data — no need to go back to the source.

### 3. Event Sourcing
All state lives in events. The current state is derived by replaying them.

### 4. CQRS (Command Query Responsibility Segregation)
Read and write are separated — write is event-driven, read is denormalized.

## Benefits

- **Loose coupling:** Producer and consumer are independent.
- **Scalability:** Async + parallel processing.
- **Flexibility:** New consumer = new feature, no producer change.
- **Real-time:** Reacts immediately to events.
- **Audit trail:** Events log the full history.
- **Resilience:** Failures are isolated.

## Challenges

### Eventual Consistency
Not all services sync instantly. A user may see stale data in one service right after updating another.

### Event Schema Evolution
If the event format changes - old consumers break. Backward compatibility is essential.

### Debugging
Tracing an event chain is hard. Requires correlation IDs + distributed tracing.

### Message Ordering
Maintaining order across partitions is hard.

### Duplicate Handling
At-least-once delivery → requires idempotent consumers.

### Complex Workflow
Tracking multi-step business flows - saga pattern, workflow engines (Temporal).

## When to use EDA?

- Multiple services need to react to the same event.
- Real-time requirements.
- You want loose coupling.
- Audit trail / event sourcing.
- High-throughput async processing.
- Microservice architecture.
- Future feature flexibility.

## When not to use EDA?

- Simple CRUD app.
- Strong consistency is mandatory.
- Simple sequential workflow.
- Small team — operational overhead.

## Implementation Tools

- **Apache Kafka:** The most popular event streaming platform.
- **AWS EventBridge:** Managed event bus.
- **Google Pub/Sub:** Managed cloud service.
- **NATS:** Lightweight, fast.
- **RabbitMQ:** Traditional broker.
- **Apache Pulsar:** Cloud-native streaming.

## Real-world examples

- **Uber:** Trip events flow through Kafka.
- **Netflix:** Viewing event → recommendation, billing, analytics.
- **LinkedIn:** Activity feed is event-driven.
- **Airbnb:** Booking lifecycle is event-driven.
- **Banking:** Transaction → fraud detection, audit, reporting.

## Best Practices

- Events in past tense (OrderPlaced, not PlaceOrder).
- Schema versioning (Avro, Protobuf).
- Idempotent consumers.
- Correlation ID - trace requests.
- Dead Letter Queue.
- Enough context in the event - to avoid chatty fetches.
- Don't over-event - a simple call is fine sometimes.

## Common misconceptions

1. **"EDA = microservices":** EDA is possible without microservices too. Even in a modular monolith.
2. **"Event = command":** Different - event is past, command is future.
3. **"EDA is always better":** Overkill for simple apps.

## Chapter summary

- EDA = state change → event → consumer reacts.
- Event is past tense; command is imperative.
- Loose coupling, scalability, flexibility - main benefits.
- Eventual consistency, debugging - main challenges.
- Kafka, EventBridge, Pulsar - top tools.

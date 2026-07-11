---
title: "CQRS — Deep Dive"
---

In an e-commerce system: on the same product table, an admin is updating (write) on one side, while millions of customers are searching (read) on the other. One table trying to serve two purposes — and both suffer for it. CQRS says: "Separate them — one model for write, another for read."

## What is CQRS?

**CQRS** = Command Query Responsibility Segregation. In software, it means splitting **write** (command) and **read** (query) operations into separate models + separate data stores.

## Where did it come from?

Inspired by Bertrand Meyer's **Command-Query Separation (CQS)** principle:
- **Command:** Changes state, doesn't return a value.
- **Query:** Returns a value, doesn't change state.

Greg Young extended this idea to the architecture level.

## Traditional Approach (CRUD)

```
[Client]
  ↓
[Same Model + Same DB]
  ↓
- Read query
- Write command
- Same schema
- Single store
```

- Same model for both read and write — a compromise.
- Normalized for write integrity = JOIN-heavy reads = slow.
- Different scaling needs — but the same infrastructure.

## The CQRS Approach

```
[Client]
  ↓          ↓
[Command]  [Query]
  ↓          ↓
[Write Model]  [Read Model]
(Normalized)   (Denormalized)
  ↓                ↑
[Write DB] → sync → [Read DB]
```

- Separate models — different schemas.
- Possibly separate databases.
- Synced via events.
- Read model optimized for queries.

## Benefits

- **Independent scaling:** In a read-heavy app, the read model scales separately.
- **Optimized models:** Write normalized; read denormalized.
- **Different storage:** Write in SQL, read in Elasticsearch.
- **Multiple read views:** Same data, different projections.
- **Flexibility:** The read model can evolve without breaking the write side.
- **Performance:** Read queries become super-fast.
- **Security:** Read-only access comes naturally.

## Challenges

### Eventual Consistency
After a write, it takes time for the read model to update — so the user may see stale data.

### Complexity
Maintaining two models doubles both code and deployment.

### Sync Mechanism
How does write sync to read? Typically event-driven.

### Operational Overhead
Two DB infrastructures to run.

## CQRS + Event Sourcing

These are often paired together:

```
[Command]
  ↓
[Aggregate]
  ↓ emit event
[Event Store] (write side)
  ↓ project
[Read Model A]  [Read Model B]
(different views)
```

- Write side: events are stored.
- Read side: denormalized data is built as a projection from events.
- Multiple read models — same event source.

## Example — E-commerce Product

### Write side
- Normalized: products, categories, prices, inventory in separate tables.
- ACID transactions.
- Easy for admins to update.

### Read side (multiple)
- **Product detail page:** A denormalized document with all the info.
- **Search:** Elasticsearch — full-text indexed.
- **Recommendations:** Graph DB — user-product relationships.
- **Analytics:** Pre-aggregated sales data.

## When to use CQRS?

- Read-write ratio is highly skewed (100:1+).
- Different query patterns.
- Complex business logic.
- Multiple read views — search, analytics, etc.
- Event-sourced system.
- Independent teams evolving read/write separately.

## When not to use CQRS?

- Simple CRUD app.
- Read-write is balanced.
- Strong consistency is mandatory.
- Small team — can't afford the overhead.

## CQRS Variations

### Light CQRS
Same DB, separate models in code. Less syncing involved.

### Full CQRS
Separate DB, async sync, event-driven.

### CQRS without Event Sourcing
The read DB is synced from the write DB via CDC (Change Data Capture).

## Real-world examples

- **E-commerce:** Product writes in SQL, search in Elasticsearch.
- **Banking:** Transaction events; multiple report/dashboard projections.
- **Social media:** Post creation is event-driven; timeline feed uses a Redis read model.
- **Booking:** Reservations are strictly ACID; availability search uses a dimensional read model.

## Common misconceptions

1. **"CQRS = Event Sourcing":** No — CQRS is possible without ES.
2. **"CQRS overhead is always worth it":** Overkill for a simple app.
3. **"You always need two DBs":** With light CQRS, the same DB is possible.
4. **"You get strong consistency":** Eventual consistency is the norm.

## Best Practices

- Apply it at the bounded-context level, not across the whole system.
- Handle eventual consistency in the UI (loading, syncing indicators).
- Sync via events — Kafka, CDC.
- Make read-model updates idempotent.
- Monitor sync lag.
- Don't start with CQRS — migrate to it via refactoring.

## Chapter Summary

- CQRS = separate models + DBs for read and write.
- Independent scaling, optimized models.
- A natural pair for Event Sourcing.
- Eventual consistency and complexity are the main challenges.
- Great for read-heavy apps with a complex domain.

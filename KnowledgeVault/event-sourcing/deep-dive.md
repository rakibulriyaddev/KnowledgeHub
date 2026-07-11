---
title: "Event Sourcing — Deep Dive"
---

Your bank account currently has 5,000 taka. How did it get there? A traditional DB only tells you: "Balance = 5000". But banking needs the history of every deposit and withdrawal. In Event Sourcing, the data stored is: "+10,000 deposit", "-3,000 withdraw", "-2,000 fee". Adding them up = 5,000. Not just the current value — every change is recorded.

## What is Event Sourcing?

**Event Sourcing** = a pattern where we don't store the current state; instead we store every state-changing event in an immutable, append-only log. The current state is derived by replaying events.

## Traditional vs Event Sourcing

### Traditional (CRUD)

```
accounts table:
| id | balance |
| 1  | 5000    |
-- the old values no longer exist
```

### Event Sourcing

```
events log:
| id | type      | amount | timestamp  |
| 1  | Deposited | 10000  | 2026-01-01 |
| 2  | Withdrawn | 3000   | 2026-01-15 |
| 3  | Fee       | 2000   | 2026-02-01 |
-- Current balance = sum = 5000
```

## Why Event Sourcing?

- **Complete audit trail:** Who did what, and when — it's all available.
- **Time travel:** The state at any point in the past.
- **Debugging:** Trace which event caused a bug.
- **Replay capability:** A new service can replay events to build state.
- **Multiple projections:** Multiple read models from the same events.
- **Compliance:** Banking, healthcare, legal — audits are mandatory.
- **Event-driven friendly:** Events are already the source — a natural fit.

## Core Components

- **Event:** A past-tense fact (UserRegistered, MoneyDeposited).
- **Event Store:** An append-only log (Kafka, EventStoreDB).
- **Aggregate:** A domain object (Account, Order).
- **Projection (Read Model):** A view derived from events.
- **Snapshot:** A performance optimization.

## Flow

1. **Command arrives:** "Withdraw 1000 from account 1".
2. **Aggregate loads events:** All past events for account 1.
3. **Replay to current state:** Sum = balance.
4. **Validate command:** Sufficient funds? Yes.
5. **Emit new event:** "MoneyWithdrawn(1000)".
6. **Append to event store:** Persisted.
7. **Update projections:** Read models are updated.

## Snapshot — Performance Optimization

With millions of events — replaying is slow. Solution: periodic snapshots.

```
Events: 1...1000
Snapshot at event 1000 (state captured)
Events: 1001...1500

Current state = Snapshot + replay 1001-1500
```

- Snapshot frequency needs tuning.
- Snapshots can be rebuilt (the events are still the source).

## Relationship with CQRS

Event Sourcing often comes together with CQRS:

- Write side: Events.
- Read side: Projections (denormalized read models derived from events).
- Covered in detail in the CQRS topic.

## Benefits

- Full history available.
- Audit & compliance come naturally.
- Temporal queries (what was the state yesterday).
- Easy bug investigation — recreate by replaying.
- Multiple read models — different projections.
- The backbone of event-driven architecture.

## Challenges

### Eventual Consistency

The read model is derived from events — not updated instantly with the write.

### Event Schema Evolution

Old event formats still need to be handled in code. Versioning is critical.

### Initial debugging

A mental shift — from "where's the current state?" to "what were the events?"

### Storage Growth

The event log can never be deleted. Storage grows.

### Complexity

Harder than CRUD — more operational overhead.

### Replay Time

Long history → slow rebuild without snapshots.

## When to use Event Sourcing?

- Audit trail is mandatory (banking, healthcare, legal).
- Temporal queries are needed (historical state).
- Event-driven business domain.
- Multiple read views from the same data.
- Domain experts talk in terms of events (DDD).
- Historical replay is important for debugging.

## When not to use Event Sourcing?

- Simple CRUD app.
- Audit trail is unnecessary.
- Team has little experience.
- Strong real-time consistency needed everywhere.
- Rapidly changing schema.

## Event Store Tools

- **EventStoreDB:** A purpose-built event store.
- **Apache Kafka:** With long retention.
- **AWS DynamoDB Streams:** A serverless option.
- **Axon Framework:** Java/Spring.
- **EventStore (CockroachDB):** SQL-based.

## Real-world examples

- **Banking:** Account ledger — full transaction history.
- **Git:** Commits = events; HEAD = current state.
- **Accounting:** Double-entry bookkeeping — a natural fit for event sourcing.
- **Workflow systems:** Order lifecycle states.
- **Healthcare records:** An immutable patient timeline.

## Best Practices

- Events should be past tense, immutable, with business-meaningful names.
- Event versioning — backward compatible.
- Snapshot strategy — tune the frequency.
- Idempotent event handlers.
- Don't put PII directly in events — a GDPR right-to-erasure problem.
- Start with a bounded context — Event Sourcing across the whole system is overkill.
- Verify tooling and framework maturity.

## Common misconceptions

1. **"Event Sourcing = Pub-Sub":** Pub-Sub is a communication pattern; ES is a persistence pattern.
2. **"Always pair with CQRS":** Often, but not mandatory.
3. **"Easy to implement":** No — significant complexity.
4. **"GDPR compliant out of the box":** Right-to-erasure is hard — needs careful design.

## Chapter Summary

- Event Sourcing = state derived from an event log.
- Append-only, immutable events; current state via replay.
- Snapshots as a performance optimization.
- Audit trail, time travel, debugging — main benefits.
- Banking, accounting, workflow — natural fits.

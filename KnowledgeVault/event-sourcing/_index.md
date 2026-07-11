---
id: event-sourcing
title: "Event Sourcing"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, cqrs, event-driven, data-modeling]
parent: architecture-patterns
children: []
status: draft
---

## Overview

Event Sourcing is a persistence pattern where a system stores every state-changing event as an immutable, append-only log instead of just the current state. The current state is never stored directly — it's derived by replaying the events. This trades the simplicity of CRUD for a complete history, which pays off wherever audit, replay, or multiple views of the same data matter.

## Key Concepts

- **Event** — an immutable, past-tense fact (`MoneyDeposited`, `UserRegistered`).
- **Event Store** — the append-only log holding all events (Kafka, EventStoreDB).
- **Aggregate** — a domain object (Account, Order) whose state is built by applying its events.
- **Projection** — a read model derived from the event stream.
- **Snapshot** — a periodic checkpoint that avoids replaying the entire history.

## Core Knowledge

Instead of a table row like `balance = 5000`, Event Sourcing stores the facts that produced it: `+10,000 deposit`, `-3,000 withdraw`, `-2,000 fee`. Current state is computed by loading an aggregate's events and replaying them in order: a command arrives, past events are replayed to reach current state, the command is validated, a new event is appended, and projections are updated from it.

Replaying millions of events on every read is slow, so systems take periodic **snapshots** — a captured state at a given event number — making current state "snapshot + replay since." Snapshots are purely a performance optimization; the event log stays the sole source of truth and snapshots can always be rebuilt.

Event Sourcing pairs naturally with CQRS: events are the write side, projections the read side, each scaling independently. Benefits are substantial — audit trail, time-travel, easy bug reproduction, multiple projections from one stream — which is why it's standard in banking and compliance-heavy domains. Costs are real too: eventual consistency, careful event schema versioning, ever-growing storage, and a mental shift from "current row" to "what happened." **Caution:** storing PII directly in events is risky, since events are immutable and GDPR right-to-erasure typically needs workarounds like crypto-shredding.

## Interview Questions

**Q: When does Event Sourcing pay off over storing current state directly?**
A: When you need a full audit trail, temporal queries, multiple read models from one source, or the domain is naturally event-driven (banking, DDD).

**Q: What's the point of a snapshot if events are the source of truth?**
A: A performance shortcut — resume from a saved state and replay only what came after. The log stays intact and snapshots can be regenerated any time.

**Q: Why is Event Sourcing hard to reconcile with GDPR's right to erasure?**
A: Events are immutable, so data can't simply be deleted. Teams work around this by encrypting PII per-user and destroying the key (crypto-shredding) instead.

## Scenario

A bank's ledger never stores "just the balance" — every deposit, withdrawal, and fee is an immutable event, and the balance is the sum. This gives auditors a full transaction history and mirrors how Git stores commits (events) with HEAD as the derived current state.

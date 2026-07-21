---
id: event-sourcing
title: "Event Sourcing"
created: 2026-07-11
modified: 2026-07-22
tags: [architecture, cqrs, event-driven, data-modeling]
parent: architecture-patterns
children: []
status: draft
---

## Overview

Event Sourcing is a way of storing data where a system saves every event that changes state, as an unchangeable, append-only log, instead of just the current state. The current state is never stored directly — it is worked out by replaying the events. This trades the simplicity of CRUD for a full history, which pays off anywhere audits, replays, or several views of the same data matter.

## Key Concepts

- **Event** — an unchangeable, past-tense fact (`MoneyDeposited`, `UserRegistered`).
- **Event Store** — the append-only log holding all events (Kafka, EventStoreDB).
- **Aggregate** — a domain object (Account, Order) whose state is built by applying its events.
- **Projection** — a read model built from the event stream.
- **Snapshot** — a checkpoint taken now and then, so you do not have to replay the whole history.

## Core Knowledge

Instead of a table row like `balance = 5000`, Event Sourcing stores the facts that led to it: `+10,000 deposit`, `-3,000 withdraw`, `-2,000 fee`. The current state is worked out by loading an aggregate's events and replaying them in order: a command arrives, past events are replayed to reach the current state, the command is checked, a new event is added, and projections are updated from it.

Replaying millions of events on every read is slow, so systems take periodic **snapshots** — a saved state at a given event number — so current state becomes "snapshot plus replay since then." Snapshots are only there for speed; the event log stays the one source of truth, and snapshots can always be rebuilt from it.

Event Sourcing pairs naturally with CQRS: events form the write side, projections form the read side, and each can scale on its own. The benefits are real — an audit trail, time-travel, easy bug reproduction, several projections from one stream — which is why it is standard in banking and other compliance-heavy fields. The costs are real too: eventual consistency, careful versioning of event schemas, storage that keeps growing, and a mental shift from "the current row" to "what happened." **Caution:** storing personal data (PII) directly in events is risky, since events cannot be changed, and GDPR's right to erasure usually needs a workaround like crypto-shredding.

## Interview Questions

**Q: When does Event Sourcing pay off over storing current state directly?**
A: When you need a full audit trail, queries about the past, several read models from one source, or the domain is naturally event-driven (banking, DDD).

**Q: What's the point of a snapshot if events are the source of truth?**
A: It is a shortcut for speed — you resume from a saved state and replay only what happened after it. The log stays whole, and snapshots can be rebuilt at any time.

**Q: Why is Event Sourcing hard to reconcile with GDPR's right to erasure?**
A: Events cannot be changed, so data cannot simply be deleted. Teams work around this by encrypting personal data per user and destroying the key instead (crypto-shredding).

## Scenario

A bank's ledger never stores "just the balance" — every deposit, withdrawal, and fee is an unchangeable event, and the balance is the sum of all of them. This gives auditors a full transaction history, and works the same way Git stores commits (events), with HEAD as the current state worked out from them.

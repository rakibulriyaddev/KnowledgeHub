---
title: "Event Sourcing — Q&A"
---

**Q: What's the core idea of Event Sourcing?**
A: Store an event log instead of the current state — Events are stored; state is derived by replaying.

**Q: What's the key characteristic of an Event Store?**
A: Append-only, immutable — Events cannot be deleted or modified.

**Q: How do you get the current state?**
A: Replay events to aggregate them — Events applied sequentially → current state.

**Q: A snapshot deletes old events.**
A: False — Snapshot is purely for performance - events stay intact.

**Q: Why use a snapshot?**
A: Replaying millions of events is slow - periodic checkpoint — Start from the snapshot → apply the events after it.

**Q: Why is a banking ledger a natural fit for Event Sourcing?**
A: Each transaction is an event; full audit trail is mandatory — History is a regulatory requirement in banking.

**Q: Which idea does Git match with Event Sourcing?**
A: Commits = events, HEAD = current state — Git is a classic example of event sourcing.

**Q: Event Sourcing supports time-travel queries.**
A: True — State at any past point can be obtained by replaying events.

**Q: What tense is an event?**
A: Past - a fact (Deposited, Withdrawn) — Already happened - past tense.

**Q: What is a Projection?**
A: A read model derived from events — Multiple projections from the same event log.

**Q: What's a challenge of Event Sourcing?**
A: Schema evolution + storage growth — Old event formats must still be handled; the log is never deleted.

**Q: GDPR right-to-erasure is easy with Event Sourcing.**
A: False — Deleting immutable events is a design challenge - requires careful PII handling.

**Q: The balance in an account is wrong. Why? How do you debug it?**
A: Replay events at a point in time to see which event was bad — ES's strength - event-by-event audit.

**Q: A simple TODO app. Event Sourcing?**
A: No - overkill, simple CRUD is enough — Audit is unnecessary for a TODO app; the complexity is wasted.

**Q: How does Event Sourcing relate to CQRS?**
A: They're often paired - a natural fit — Write side is events, read side is projections.

**Q: Which of these is an event store?**
A: EventStoreDB, Kafka (with retention), Axon — Purpose-built or log-friendly platforms.

**Q: Why is putting PII in events risky?**
A: Immutable - can't directly delete for GDPR — Workarounds like deleting encryption keys (crypto shredding) are needed.

**Q: What is an Aggregate?**
A: A domain object - derives state by applying events — Aggregate = a bounded entity (Account, Order).

**Q: Event Sourcing is the backbone of event-driven architecture.**
A: True — Events are first-class citizens - a natural fit.

**Q: Which of these is NOT an advantage of Event Sourcing?**
A: Simple CRUD — It's more complex than CRUD - not simplicity.

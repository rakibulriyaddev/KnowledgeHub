---
title: "Distributed Transactions — Q&A"
---

**Q: What is the definition of a Distributed Transaction?**
A: An atomic operation across multiple DBs/services — Spans multiple resources - either everything succeeds or nothing does.

**Q: What is Phase 1 of 2PC?**
A: Prepare - everyone answers "yes/no" — Prepare - participants lock the resource and say "yes".

**Q: What is 2PC's biggest problem?**
A: Blocking if the coordinator fails — If the coordinator fails after Phase 1 = participants wait forever.

**Q: What is the Saga Pattern?**
A: Local transactions plus compensating actions — A big transaction → broken into local transactions + undo logic.

**Q: What are Saga's two patterns?**
A: Choreography and Orchestration — Event-driven (choreography) or a central controller (orchestration).

**Q: What is the benefit of choreography saga?**
A: Loose coupling - services react to events — No direct dependency - loose coupling via events.

**Q: What is the benefit of orchestration saga?**
A: Centralized control + easy to visualize — A centralized orchestrator tracks the workflow.

**Q: What are TCC's three phases?**
A: Try, Confirm, Cancel — Try-Confirm-Cancel - reserve then finalize.

**Q: What is a Compensating Action?**
A: Logic that undoes a previous step — In Saga, undoes completed steps when something fails.

**Q: Saga is eventually consistent.**
A: True — Once the steps and compensations finish - the final state is consistent.

**Q: What problem does the Outbox Pattern solve?**
A: Atomically writing to the DB and publishing the event - avoiding partial failure — Writes the DB change and the event row in the same transaction; a worker publishes it later.

**Q: Order → Payment → Inventory → Shipping. The Inventory step fails. What will Saga do?**
A: Run compensating actions for Order and Payment (cancel + refund) — Runs compensation for the already-completed steps.

**Q: How do you get "ACID-like" transactions in microservices?**
A: Saga (eventually consistent) — Modern best practice - Saga plus idempotent steps.

**Q: Where is TCC useful?**
A: Resource reservation in banking — Account freeze → confirm/cancel - a classic in banking.

**Q: 2PC is widely used in modern microservices.**
A: False — Modern microservices prefer Saga - 2PC is blocking and doesn't scale well.

**Q: Why does idempotency matter in distributed transactions?**
A: Compensating actions might be retried — Networks are unreliable - a compensation might run more than once. Without idempotency, it causes double effects.

**Q: What's preferred whenever possible?**
A: Bounded context - everything in one DB — A single DB gives you local ACID transactions; avoid going distributed.

**Q: Why is 3PC rare?**
A: Its complexity vs. benefit is unfavorable; less useful in practice — 3PC's non-blocking guarantee is weak - rare in practice.

**Q: Where should saga workflow state be stored?**
A: Persistent (DB) - so it can resume after a restart — Sagas need to be durable so the orchestrator can track the workflow after a restart.

**Q: Distributed transactions generally don't provide full ACID.**
A: True — Eventually consistent is usually the best you get - strict ACID is very expensive.

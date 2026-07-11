---
id: distributed-transactions
title: "Distributed Transactions"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, microservices, distributed-systems, consistency]
parent: sd-databases
children: []
status: draft
---

## Overview

A distributed transaction is a single logical operation spanning multiple databases or services where either everything succeeds or nothing does — an unavoidable problem once a system moves from a monolith to microservices. Unlike a single-DB transaction, there's no global lock, so coordination has to be built explicitly through protocols like 2PC, Saga, or TCC.

## Key Concepts

- Two-Phase Commit (2PC) — coordinator-driven, blocking, strong consistency.
- Saga pattern — local transactions plus compensating actions, eventually consistent.
- Choreography vs orchestration as Saga's two coordination styles.
- TCC (Try-Confirm-Cancel) — reservation-based, used in banking.
- Outbox pattern — solving atomic event publishing.

## Core Knowledge

Distributed transactions are hard because no single node can lock resources across services, networks fail mid-operation causing partial failures, each service can fail independently, multi-step transactions run long, and CAP-theorem trade-offs are unavoidable once data crosses machine boundaries. Two-Phase Commit is the classic protocol: in Phase 1 (Prepare) a coordinator asks all participants if they can commit and they lock resources and answer yes/no; in Phase 2 (Commit/Abort) the coordinator tells everyone to commit if all said yes, or abort if any said no. 2PC gives ACID-like guarantees but blocks indefinitely if the coordinator fails after Phase 1, is slow (two round trips plus locking), and makes the coordinator a single point of failure — which is why it's rare in modern microservices (3PC adds a pre-commit phase to reduce blocking but is rarely used in practice).

The Saga pattern is the modern alternative: break the large transaction into local transactions, each paired with a compensating action that undoes it if a later step fails (e.g., cancel order, refund payment, restore stock). Sagas come in two flavors — choreography, where each service publishes events and the next reacts with no central coordinator (loosely coupled but hard to visualize), and orchestration, where a central orchestrator drives the flow (easier to debug, but the orchestrator itself grows complex). TCC (Try-Confirm-Cancel) reserves resources tentatively (Try), finalizes them once every participant is ready (Confirm), or releases the reservations if anything fails (Cancel) — common in banking, where an account balance gets "frozen" before finalizing a transfer. A recurring problem across all of these is atomically writing to a database and publishing an event; the Outbox pattern solves it by writing the event to an outbox table in the same local transaction, with a background worker publishing it afterward. Whichever protocol is used, compensating actions and retried steps must be idempotent, since networks can cause a step to run more than once.

## Interview Questions

**Q: Why is 2PC rarely used in modern microservices?**
A: It blocks indefinitely if the coordinator fails mid-protocol, requires two round trips with resources locked throughout, and makes the coordinator a single point of failure — properties that don't scale well across independently-deployed, independently-failing services.

**Q: What is a compensating action and why must it be idempotent?**
A: It's the logic that undoes a previously completed step in a Saga when a later step fails (e.g., a refund undoing a charge); it must be idempotent because network retries can cause it to be invoked more than once, and a non-idempotent compensation would double-refund or otherwise corrupt state.

**Q: What problem does the Outbox pattern solve?**
A: It solves the atomicity gap between committing a database change and publishing the corresponding event — by writing the event into an outbox table within the same local transaction, a background worker can publish it reliably afterward instead of risking a DB commit succeeding while the event publish fails (or vice versa).

## Scenario

An e-commerce "Place Order" flow touches Order, Payment, Inventory, and Shipping services, each with its own database. The team implements this as an orchestrated Saga: if the Inventory step fails after Order and Payment have already succeeded, the orchestrator runs the compensating actions — cancel the order and refund the payment — rather than attempting a single all-or-nothing distributed transaction across four services.

---
id: distributed-transactions
title: "Distributed Transactions"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, microservices, distributed-systems, consistency]
parent: sd-databases
children: []
status: draft
---

## Overview

A distributed transaction is one logical action that spans many databases or services, where either everything succeeds or nothing does. This problem shows up as soon as a system moves from one big app (a monolith) to microservices. Unlike a transaction in a single database, there is no single lock covering everything, so the system must coordinate this by hand, using protocols like 2PC, Saga, or TCC.

## Key Concepts

- Two-Phase Commit (2PC) — a coordinator drives it, it can block, and it gives strong consistency.
- Saga pattern — small local transactions plus actions that undo them if needed, becomes consistent over time.
- Choreography vs orchestration as Saga's two coordination styles.
- TCC (Try-Confirm-Cancel) — reservation-based, used in banking.
- Outbox pattern — a fix for publishing events safely along with a database write.

## Core Knowledge

Distributed transactions are hard for several reasons: no single node can lock resources across services, networks can fail partway through, each service can fail on its own, multi-step transactions take a long time, and CAP-theorem tradeoffs cannot be avoided once data crosses machine boundaries. Two-Phase Commit is the classic protocol for this: in Phase 1 (Prepare), a coordinator asks every participant if it can commit; each one locks its resources and answers yes or no. In Phase 2 (Commit/Abort), the coordinator tells everyone to commit if all said yes, or to abort if any said no. 2PC gives ACID-like guarantees, but it can block forever if the coordinator fails after Phase 1, it is slow (two round trips plus locking), and the coordinator becomes a single point of failure. This is why 2PC is rare in modern microservices (3PC adds an extra step to reduce blocking, but it is rarely used in practice).

The Saga pattern is the more modern choice: it breaks the large transaction into small local transactions, each with an action that undoes it if a later step fails (for example, cancel order, refund payment, restore stock). Sagas come in two styles — choreography, where each service publishes events and the next one reacts, with no central coordinator (loosely coupled, but hard to picture as a whole), and orchestration, where one central orchestrator drives the whole flow (easier to debug, but the orchestrator itself can grow complex). TCC (Try-Confirm-Cancel) reserves resources for a moment (Try), then makes them final once every participant is ready (Confirm), or releases the reservation if anything fails (Cancel) — this is common in banking, where an account balance gets "frozen" before a transfer is finalized. A problem that comes up in all of these is writing to a database and publishing an event as one safe step; the Outbox pattern fixes this by writing the event to an outbox table in the same local transaction, then having a background worker publish it afterward. Whichever protocol is used, the undo actions and retried steps must be idempotent (safe to run more than once), since networks can cause a step to run twice.

## Interview Questions

**Q: Why is 2PC rarely used in modern microservices?**
A: It can block forever if the coordinator fails in the middle, it needs two round trips with resources locked the whole time, and it makes the coordinator a single point of failure. None of this scales well across services that are deployed and can fail on their own.

**Q: What is a compensating action and why must it be idempotent?**
A: It is the logic that undoes a step already completed in a Saga, when a later step fails (for example, a refund undoing a charge). It must be idempotent because network retries can cause it to run more than once, and a non-idempotent undo action could double-refund or otherwise corrupt the data.

**Q: What problem does the Outbox pattern solve?**
A: It closes the gap between saving a database change and publishing the matching event as one safe step. By writing the event into an outbox table inside the same local transaction, a background worker can publish it reliably afterward, instead of risking the database commit succeeding while the event publish fails (or the other way around).

## Scenario

An e-commerce "Place Order" flow touches the Order, Payment, Inventory, and Shipping services, each with its own database. The team builds this as an orchestrated Saga. If the Inventory step fails after Order and Payment have already succeeded, the orchestrator runs the undo actions — cancel the order and refund the payment — instead of trying one all-or-nothing distributed transaction across all four services.

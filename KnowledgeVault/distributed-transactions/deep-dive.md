---
title: "Distributed Transactions — Deep Dive"
---

When you click "Place Order" on an e-commerce site: the Order service creates the order, the Payment service charges the card, the Inventory service reduces stock, and the Shipping service books a shipment. If any one of these fails - the previous ones must be undone. But these are separate services and databases. This is a Distributed Transaction.

## What is a Distributed Transaction?

A **Distributed Transaction** = a transaction that spans multiple resources (DBs, services, systems). Either all of it succeeds - or none of it does. An inevitable problem in microservice architectures.

## Why is it hard?

- **No global lock:** One DB's transaction can't control another DB.
- **Network failure:** Service down/timeout - partial failure is common.
- **Independent failure:** Each service can fail independently.
- **Long duration:** Multi-step transactions take longer.
- **CAP theorem:** Trade-offs are inevitable in a distributed setting.

## Two-Phase Commit (2PC)

The classic distributed transaction protocol - a coordinator plus participants.

### Phase 1: Prepare
1. The coordinator sends "prepare" to all participants.
2. Each participant says "yes" if it can do the work, and locks it in place.
3. If it can't, it says "no".

### Phase 2: Commit / Abort
1. If everyone said "yes" - the coordinator sends "commit". Everyone commits.
2. If anyone said "no" - it sends "abort". Everyone rolls back.

```
Coordinator → Participants
PHASE 1: "Can you commit?"
← "Yes / No"
PHASE 2: "Commit!" or "Abort!"
```

### Problems
- **Blocking:** If the coordinator fails after Phase 1 - participants wait indefinitely.
- **Slow:** Two round trips plus locking.
- **Single point of failure:** The coordinator.
- **Reduced availability:** Locks held for a long time.

### 3PC (Three-Phase Commit)
Adds an extra "pre-commit" phase to reduce 2PC's blocking problem. Rare in practice.

## Saga Pattern

The modern alternative to distributed transactions. Break a large transaction into smaller local transactions, each with a **compensating action**.

### Example - Order workflow
1. Order service: create order. Compensation: cancel order.
2. Payment service: charge payment. Compensation: refund.
3. Inventory: reduce stock. Compensation: restore stock.
4. Shipping: book shipment. Compensation: cancel shipping.

If it fails partway through - run the compensating action for every previously-completed step.

### Saga's two patterns

#### Choreography
Each service publishes events, and the next service listens. There's no central coordinator.
- **Benefit:** Loose coupling.
- **Downside:** Hard to visualize the workflow; risk of cyclic dependencies.

#### Orchestration
A single orchestrator service controls the flow.
- **Benefit:** Centralized logic, easier to debug.
- **Downside:** The orchestrator itself becomes complex.

## TCC (Try-Confirm-Cancel)

Each service has three steps:
- **Try:** Reserve the resource (e.g. hold 1 unit of stock). Tentative.
- **Confirm:** If every Try succeeds - finalize it.
- **Cancel:** If anything fails - release all the Try reservations.

### Example
Banking transfer:
- Try: mark 1,000 as "frozen" in A's account.
- Try: mark 1,000 as "incoming" in B's account.
- Confirm (both OK): the actual debit/credit.
- Cancel: remove the marks.

## 2PC vs Saga vs TCC

**2PC**
- ACID guarantee
- Strong consistency
- Blocking, slow
- Single coordinator failure risk
- Rare in modern microservices

**Saga**
- Eventually consistent
- No blocking
- Requires designing compensating actions
- Long-running OK
- Standard in microservices

**TCC**
- Reservation-based
- Fast (no long lock)
- Each service has Try/Confirm/Cancel
- Used in banking
- Complex implementation

## Outbox Pattern

In Saga, publishing events has an atomicity problem - the DB write and the event publish can fail independently. Solution: write the event to an "outbox table" in the same transaction. A background worker publishes it later.

```sql
BEGIN;
  INSERT INTO orders ...;
  INSERT INTO outbox (event) VALUES ('OrderCreated');
COMMIT;

-- A background worker publishes the event from the outbox later.
```

## Real-world examples

- **Uber:** Saga pattern - trip lifecycle (request → match → start → end → payment).
- **Netflix:** Choreography saga across microservices.
- **Amazon checkout:** Saga + outbox pattern.
- **Banking core:** TCC or strict 2PC.

## Common misconceptions

1. **"I'll get ACID transactions in microservices":** No - distributed transactions don't provide full ACID.
2. **"2PC is widely used":** Rarely, in modern microservices.
3. **"Saga is simple":** Designing compensating actions is hard.
4. **"Eventual consistency is always fine":** Not acceptable in banking.

## Best Practices

- Avoid distributed transactions where possible. Keep a bounded context in a single DB.
- Choose Saga for microservices.
- Make compensating actions idempotent - safe against multiple invocations.
- Use the outbox pattern for atomicity.
- Monitoring is crucial - track long-running sagas.
- Model sagas with a state machine.

## Chapter Summary

- Distributed transaction = an atomic operation across multiple services.
- 2PC: classic, ACID, but blocking.
- Saga: uses compensating actions - standard in modern microservices.
- TCC: Try-Confirm-Cancel - used in banking.
- Outbox pattern for atomic event publishing.

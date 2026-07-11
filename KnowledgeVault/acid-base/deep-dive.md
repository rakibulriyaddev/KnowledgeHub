---
title: "ACID and BASE — Deep Dive"
---

You withdrew 5,000 taka from an ATM. The bank deducted the money from your account but the ATM machine didn't dispense it - the power went out midway. What happens now? Surely you'd want - either you get the money, or it isn't deducted from your account at all. This is the core promise of ACID.

## ACID Properties

ACID = four guarantees that ensure reliable database transactions. The core of RDBMS.

### A - Atomicity
A transaction is an indivisible unit. Either all steps happen, or none do.

```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 5000 WHERE id = 1;
  UPDATE accounts SET balance = balance + 5000 WHERE id = 2;
COMMIT;
```

If it fails midway → ROLLBACK → no change happens at all.

### C - Consistency
After a transaction, all of the DB's constraints, rules, and foreign keys remain valid.

Example: an account balance cannot be negative - this rule holds true both before and after the transaction.

**Caution:** This Consistency is different from the Consistency in the CAP theorem. ACID's C = constraint validity; CAP's C = same data across all nodes.

### I - Isolation
Concurrent transactions don't interfere with each other - as if they were running serialized.

Example: A is reading money from your account, while B is adding to it at the same time - their results won't mix even if you wanted them to.

#### Isolation Levels (low to high)
- **Read Uncommitted:** Dirty read possible - you can read data from another uncommitted transaction.
- **Read Committed:** Only committed data is read. PostgreSQL default.
- **Repeatable Read:** The same query gives the same result every time. MySQL default.
- **Serializable:** Strongest - transactions behave as if run one after another. Slow.

### D - Durability
Once committed, data is permanent - it survives power loss and crashes too.

WAL (Write-Ahead Log) is the implementation of this guarantee.

## BASE Properties

The philosophy of NoSQL distributed systems. In place of ACID's strictness - a flexible, scalable approach.

### B - Basically Available
The system always responds - it gives something back. Even if not fully correct, it's available.

### A - Soft state
The system's state can change even without input - because replicas are syncing asynchronously.

### E - Eventually Consistent
Over time, all replicas converge to the same state. Not instantly - but eventually.

## ACID vs BASE

**ACID**
- Strong consistency
- Pessimistic - locks
- Vertical scale
- Complex transaction
- Banking, finance
- RDBMS

**BASE**
- Eventually consistent
- Optimistic - flexible
- Horizontal scale
- Simple model
- Social, real-time
- NoSQL

## When is ACID needed?

- Financial transactions (banking, payment).
- Inventory management (stock count).
- Booking systems (avoiding double-booking seats).
- Healthcare data.
- Audit trails.
- Whenever accuracy > speed.

## When is BASE enough?

- Social media feeds (a post showing up a second late isn't a problem).
- Like/view counts.
- Real-time analytics.
- Search index.
- Caching.
- Whenever scale > perfect accuracy.

## Real-world examples

### Where ACID is essential
Withdrawing money from an ATM - a disaster without atomicity.
- Step 1: deduct from account
- Step 2: dispense money from ATM
- Step 1 happens but Step 2 fails = the customer's money vanishes!

### Where BASE helps
Twitter's like count - eventually consistent is fine.
- You liked something - I'll see it a second later. Not a problem.
- But if we wait for sync across every node, scale breaks down.

## Modern hybrids

Modern systems offer tunable consistency instead of strict ACID/BASE:
- **MongoDB 4+:** Multi-document transactions.
- **Cassandra:** Tunable consistency level (ONE, QUORUM, ALL).
- **DynamoDB:** Choose strong or eventual consistency.
- **Google Spanner:** Globally distributed ACID.

## Common misconceptions

1. **"ACID = SQL only":** No - some NoSQL databases offer ACID too (MongoDB 4+).
2. **"BASE = no consistency":** Eventually consistent - it becomes correct after some time.
3. **"ACID's C = CAP's C":** No - different. ACID = constraint; CAP = node sync.
4. **"Higher isolation always better":** No - it's slower. Choose based on the use case.

## Best Practices

- Use ACID for critical operations - payment, inventory.
- Use BASE for read-heavy real-time data - feeds, counts.
- Prefer the minimum isolation level needed - Read Committed is enough in many cases.
- If the application relies on BASE - show a "syncing..." indicator in the UI.
- Mixed approach - primary ACID DB + read replica/cache for BASE-style needs.

## Chapter Summary

- ACID = Atomicity, Consistency, Isolation, Durability.
- BASE = Basically Available, Soft state, Eventually consistent.
- ACID - RDBMS, banking; BASE - NoSQL, social media.
- There are 4 isolation levels (Uncommitted → Serializable).
- Modern databases offer tunable consistency.

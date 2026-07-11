---
title: "Database Transactions — Q&A"
---

**Q: What does COMMIT do?**
A: Makes a transaction permanent — COMMIT makes changes permanent; made durable through the WAL.

**Q: What does ROLLBACK do?**
A: Undoes the transaction - returns to the starting state — ROLLBACK cancels all uncommitted changes.

**Q: What is a Dirty Read?**
A: Reading uncommitted data — Uncommitted data from another transaction - invalid if it rolls back.

**Q: What is a Phantom Read?**
A: The same query returning a different row count — If B inserts/deletes rows, A's COUNT result changes.

**Q: Which level prevents non-repeatable reads?**
A: Repeatable Read+ — Repeatable Read and Serializable.

**Q: What does Serializable isolation prevent?**
A: Dirty + non-repeatable + phantom — The strongest isolation level - prevents every read anomaly.

**Q: What happens with Pessimistic Locking?**
A: Lock at the start, others wait — Locked first - other transactions wait.

**Q: What happens with Optimistic Locking?**
A: Version field checked at commit — Assumes conflicts are rare - checked at commit.

**Q: What is a Deadlock?**
A: Two transactions each waiting on the other's lock — A cycle - neither can proceed.

**Q: What is the benefit of MVCC?**
A: Reads and writes don't block each other — Multi-version - reads use an older version, writes create a new one.

**Q: PostgreSQL uses MVCC.**
A: True — PostgreSQL and Oracle are popular MVCC implementations.

**Q: What is a Savepoint?**
A: A checkpoint mid-transaction - allows partial rollback — A rollback target in the middle of a large transaction.

**Q: A transaction is sending an email. What's the problem?**
A: The external call is slow and the lock is held too long - blocking others — External (network) calls are recommended to be avoided inside a transaction.

**Q: 10 users are trying to buy the same inventory item at once. How do you avoid a race condition?**
A: SELECT FOR UPDATE (pessimistic lock) — Pessimistic locking works well under high contention.

**Q: Long transactions increase lock contention.**
A: True — The longer a lock is held, the longer others wait.

**Q: What can undo a committed transaction?**
A: Nothing - except a backup — There's no undo after commit - only restoring from a backup.

**Q: Which isolation level for a banking transfer?**
A: Serializable (strongest) — A critical operation can't risk wrong data.

**Q: What does the DB do during deadlock detection?**
A: Detects the cycle and kills one transaction — If the wait-for graph has a cycle - it picks a victim to kill.

**Q: Which property does WAL (Write-Ahead Log) implement?**
A: Durability — WAL recovers committed transactions after a crash - Durability.

**Q: Optimistic Locking is good when conflicts are rare.**
A: True — No lock overhead, but if conflicts are frequent it causes a retry storm.

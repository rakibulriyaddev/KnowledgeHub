---
id: lsm-tree
title: "LSM Tree"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, performance]
parent: database-indexing
children: [bloom-filter]
status: draft
---

# LSM Tree

## Overview

A log-structured merge (LSM) tree is a write-optimized storage structure that buffers writes in memory and flushes them sequentially to disk as sorted, immutable files, merging them later in the background. It exists as the alternative to B-trees for workloads dominated by heavy write throughput, trading some read simplicity and space for dramatically cheaper writes. It underpins Cassandra, RocksDB, LevelDB, and many wide-column and key-value engines.

## Key Concepts

- **Memtable** — in-memory sorted buffer that absorbs incoming writes before they touch disk
- **SSTable (sorted string table)** — immutable, sorted on-disk file produced when a memtable is flushed
- **Write-ahead log (WAL)** — durability mechanism recording writes before they land in the memtable, for crash recovery
- **Compaction** — background process merging multiple SSTables, discarding overwritten/deleted data
- **Tombstone** — marker recording a delete, physically removed only during compaction
- **Read amplification** — cost of checking multiple SSTables to answer one read, the structure's core tradeoff

## Core Knowledge

- Writes are sequential appends (to WAL, then memtable, then flushed SSTable) rather than in-place updates — this is why LSM trees vastly outperform B-trees on write-heavy workloads
- A read may need to check the memtable and multiple SSTables (newest to oldest) before finding the latest value — this read amplification is the direct cost of write optimization
- Bloom filters are commonly layered per SSTable to cheaply rule out "key definitely not here," avoiding unnecessary disk reads and mitigating read amplification
- Compaction strategy (size-tiered vs leveled) is a real tuning decision: size-tiered favors write throughput with more read/space overhead, leveled favors read performance and space efficiency at higher write cost
- Deletes are tombstones, not immediate removal — data physically disappears only when compaction processes the SSTables containing it, so heavy-delete workloads need compaction tuning, same concern noted generically for wide-column stores
- Space amplification (multiple versions of the same key existing across SSTables until compacted) is the storage-side cost paired with read amplification
- B-trees remain better for read-heavy or point-lookup-dominated workloads with in-place updates; LSM trees win when ingest volume is the bottleneck, not read latency
- Falling behind on compaction (due to sustained write bursts) degrades both read latency and space usage simultaneously — a common operational failure mode in LSM-backed systems

## Interview Questions

**Q:** Why are LSM trees faster for writes than B-trees?
**A:** Writes are sequential appends to an in-memory buffer and log, never in-place disk modifications, avoiding the random I/O and page-split costs a B-tree incurs on write.

**Q:** What is read amplification in an LSM tree and how is it mitigated?
**A:** A read may need to check the memtable plus several SSTables to find the current value; per-SSTable bloom filters cheaply skip files that can't contain the key, reducing unnecessary disk reads.

**Q:** Size-tiered vs leveled compaction — what's the tradeoff?
**A:** Size-tiered favors write throughput but costs more space and read overhead; leveled compaction keeps space and reads tighter at the cost of more background write work.

**Q:** Why might deleting a lot of data from an LSM-backed store not immediately free space?
**A:** Deletes are recorded as tombstones and only physically removed when compaction processes the relevant SSTables — space reclaims later, not on delete.

## Scenario

A metrics ingestion pipeline needs to sustain extremely high write throughput and a B-tree-backed relational store starts falling behind under the random-write pattern of concurrent inserts. Switching the hot path to an LSM-tree-backed store turns writes into sequential appends that the disk handles far more efficiently, and background compaction — not the write path — absorbs the cost of keeping data organized for later reads.

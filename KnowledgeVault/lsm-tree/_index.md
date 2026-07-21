---
id: lsm-tree
title: "LSM Tree"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, performance]
parent: database-indexing
children: [bloom-filter]
status: draft
---

# LSM Tree

## Overview

A log-structured merge (LSM) tree is a storage structure built for fast writes. It holds writes in memory first, then writes them to disk in order as sorted, unchanging files, and merges those files later in the background. It is the alternative to B-trees for workloads with heavy write traffic — it trades some read simplicity and space for much cheaper writes. It is used inside Cassandra, RocksDB, LevelDB, and many wide-column and key-value databases.

## Key Concepts

- **Memtable** — an in-memory sorted buffer that holds new writes before they reach disk
- **SSTable (sorted string table)** — an unchanging, sorted file on disk, made when a memtable is flushed
- **Write-ahead log (WAL)** — a durability method that records writes before they reach the memtable, so data survives a crash
- **Compaction** — a background job that merges many SSTables and drops data that was overwritten or deleted
- **Tombstone** — a marker for a delete; it is only removed for real during compaction
- **Read amplification** — the cost of checking many SSTables to answer one read; this is the main tradeoff of this design

## Core Knowledge

- Writes are added in order (to the WAL, then the memtable, then a flushed SSTable) instead of changed in place — this is why LSM trees beat B-trees by far on write-heavy workloads
- A read may need to check the memtable and several SSTables (newest to oldest) before it finds the latest value — this read amplification is the direct cost of making writes fast
- Bloom filters are often added per SSTable to cheaply rule out "this key is definitely not here," which avoids extra disk reads and lowers read amplification
- Choosing a compaction strategy (size-tiered vs leveled) is a real tuning decision. Size-tiered favors write speed but costs more in reads and space. Leveled favors read speed and space savings but costs more in writes.
- Deletes are stored as tombstones, not removed right away — the data only disappears for real once compaction processes the SSTables holding it. So workloads with heavy deletes need compaction tuning, the same concern seen generally in wide-column stores.
- Space amplification (many versions of the same key sitting across SSTables until compaction runs) is the storage-side cost that goes along with read amplification
- B-trees are still better for read-heavy work or lookups by key, with updates made in place. LSM trees win when the amount of incoming writes is the bottleneck, not read speed.
- Falling behind on compaction (from steady bursts of writes) hurts both read speed and space usage at the same time — a common failure seen when running LSM-backed systems

## Interview Questions

**Q:** Why are LSM trees faster for writes than B-trees?
**A:** Writes are added in order to an in-memory buffer and a log, never changed in place on disk. This avoids the random disk access and page-split cost that a B-tree pays on write.

**Q:** What is read amplification in an LSM tree and how is it mitigated?
**A:** A read may need to check the memtable plus several SSTables to find the current value. A bloom filter on each SSTable cheaply skips files that cannot hold the key, which cuts down on extra disk reads.

**Q:** Size-tiered vs leveled compaction — what's the tradeoff?
**A:** Size-tiered favors write speed but costs more in space and read overhead. Leveled compaction keeps space and reads tighter, at the cost of more background write work.

**Q:** Why might deleting a lot of data from an LSM-backed store not immediately free space?
**A:** Deletes are stored as tombstones and are only removed for real once compaction processes the right SSTables — the space is freed later, not right away.

## Scenario

A metrics pipeline needs to handle a very high, steady stream of writes, and a B-tree-backed relational store starts to fall behind under the random-write pattern of many inserts at once. Switching the busy path to an LSM-tree-backed store turns writes into ordered appends, which the disk handles far better. Background compaction — not the write path — now carries the cost of keeping data organized for later reads.

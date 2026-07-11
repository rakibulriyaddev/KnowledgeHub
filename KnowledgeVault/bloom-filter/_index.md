---
id: bloom-filter
title: "Bloom Filter"
created: 2026-07-11
modified: 2026-07-11
tags: [data, performance, algorithms]
parent: lsm-tree
children: []
status: draft
---

# Bloom Filter

## Overview

A Bloom filter is a compact, probabilistic data structure that answers "definitely not present" or "possibly present" for set membership, using far less space than storing the actual set. It exists to cheaply skip expensive lookups (disk reads, network calls) for keys that certainly don't exist, trading a small false-positive rate for large space and speed savings. It's the standard mechanism LSM-tree engines use to avoid checking every SSTable on a read.

## Key Concepts

- **Bit array** — fixed-size array of bits, the entire storage for the filter
- **Hash functions** — k independent hash functions, each mapping an element to one bit position
- **False positive** — filter says "possibly present" for an element never inserted; the only error type possible
- **No false negatives** — if the filter says "definitely not present," that is always correct
- **Tunable size** — bit array size and hash count trade memory for false-positive rate
- **No deletion (classic form)** — clearing a bit for one element can break membership checks for others sharing it

## Core Knowledge

- Membership check runs k hash functions and checks k bit positions — all set means "maybe present," any unset means "definitely absent," in constant time regardless of set size
- False positives are possible and expected (tuned to a target rate, e.g. 1%); false negatives are structurally impossible — this asymmetry is exactly what makes it safe as a pre-check before a real lookup
- Space efficiency is the whole point: a Bloom filter for millions of keys can fit in a fraction of the memory the actual key set would need, at the cost of an occasional wasted lookup
- Standard Bloom filters can't delete elements — unsetting a bit may falsely turn a different, still-present element into a "definitely not present" result — counting Bloom filters exist specifically to support deletion
- False-positive rate is tunable via bit-array size and hash function count — more space and more hashes lower the rate but increase computation and memory cost
- In LSM-tree engines, one Bloom filter per SSTable lets a read skip files guaranteed not to contain the key, directly reducing the read-amplification cost inherent to that structure
- Used broadly beyond databases — CDNs, spell checkers, network routers, and duplicate-detection systems all use Bloom filters for the same cheap pre-check pattern
- A Bloom filter is never the source of truth — it's always a fast pre-check layered in front of an authoritative lookup that would otherwise happen unconditionally

## Interview Questions

**Q:** Can a Bloom filter give a false negative?
**A:** No — if it reports an element as absent, that is guaranteed correct; only false positives (reporting present when it isn't) are possible.

**Q:** Why can't you delete an element from a classic Bloom filter?
**A:** Its bits are shared across multiple elements via hashing; clearing a bit to remove one element can incorrectly mark a different element as absent.

**Q:** How does a Bloom filter reduce read amplification in an LSM tree?
**A:** One filter per SSTable lets a read skip files that certainly don't contain the key, avoiding disk I/O for the majority of files that don't hold the requested key.

**Q:** What determines a Bloom filter's false-positive rate?
**A:** The size of the bit array and the number of hash functions used — more of either lowers the false-positive rate at the cost of more memory and computation.

## Scenario

A wide-column store must check dozens of SSTables per read to find a key's latest value, and disk I/O for files that don't even contain the key dominates read latency. Attaching a Bloom filter to each SSTable lets the engine skip nearly all files that definitely lack the key in memory, cutting disk reads down to only the few files where the key might actually be.

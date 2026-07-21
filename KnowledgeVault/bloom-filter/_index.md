---
id: bloom-filter
title: "Bloom Filter"
created: 2026-07-11
modified: 2026-07-22
tags: [data, performance, algorithms]
parent: lsm-tree
children: []
status: draft
---

# Bloom Filter

## Overview

A Bloom filter is a small, probability-based data structure that answers "definitely not present" or "possibly present" for whether something is in a set, using far less space than storing the real set. It exists to cheaply skip costly lookups (disk reads, network calls) for keys that certainly don't exist, trading a small chance of being wrong for big savings in space and speed. It's the standard tool LSM-tree engines use to avoid checking every SSTable on a read.

## Key Concepts

- **Bit array** — fixed-size array of bits; the entire storage used by the filter
- **Hash functions** — k separate hash functions, each mapping an item to one bit position
- **False positive** — filter says "possibly present" for an item never added; the only kind of error possible
- **No false negatives** — if the filter says "definitely not present," that is always correct
- **Tunable size** — bit array size and hash count trade memory for the false-positive rate
- **No deletion (classic form)** — clearing a bit for one item can break the check for others sharing that bit

## Core Knowledge

- A membership check runs k hash functions and checks k bit positions — all set means "maybe present," any unset means "definitely absent," in constant time no matter the set's size
- False positives are possible and expected (tuned to a target rate, like 1%); false negatives are impossible by design — this difference is exactly what makes it safe as a pre-check before a real lookup
- Space efficiency is the whole point: a Bloom filter for millions of keys can fit in a small fraction of the memory the real key set would need, at the cost of an occasional wasted lookup
- Standard Bloom filters can't delete items — clearing a bit may wrongly turn a different, still-present item into a "definitely not present" result — counting Bloom filters exist just to support deletion
- False-positive rate can be tuned through bit-array size and hash function count — more space and more hashes lower the rate but raise computation and memory cost
- In LSM-tree engines, one Bloom filter per SSTable lets a read skip files that are guaranteed not to hold the key, directly cutting the extra read cost built into that structure
- Used widely beyond databases — CDNs, spell checkers, network routers, and duplicate-detection systems all use Bloom filters for the same cheap pre-check pattern
- A Bloom filter is never the source of truth — it's always a fast pre-check placed in front of a real, authoritative lookup that would otherwise always happen

## Interview Questions

**Q:** Can a Bloom filter give a false negative?
**A:** No — if it reports an item as absent, that is guaranteed correct; only false positives (reporting present when it isn't) are possible.

**Q:** Why can't you delete an item from a classic Bloom filter?
**A:** Its bits are shared across several items through hashing; clearing a bit to remove one item can wrongly mark a different item as absent.

**Q:** How does a Bloom filter cut down extra reads in an LSM tree?
**A:** One filter per SSTable lets a read skip files that certainly don't hold the key, avoiding disk I/O for most files that don't hold the wanted key.

**Q:** What decides a Bloom filter's false-positive rate?
**A:** The size of the bit array and the number of hash functions used — more of either lowers the false-positive rate at the cost of more memory and computing.

## Scenario

A wide-column store must check dozens of SSTables per read to find a key's latest value, and disk I/O for files that don't even hold the key dominates read delay. Adding a Bloom filter to each SSTable lets the engine skip nearly all files that certainly lack the key, using memory only, cutting disk reads down to just the few files where the key might really be.

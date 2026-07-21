---
id: normalization
title: "Normalization"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, sql]
parent: structured-database
children: []
status: draft
---

# Normalization

## Overview

Normalization is the process of organizing tables in a relational database so data is not repeated and update mistakes don't happen. It works by splitting data into smaller tables linked by foreign keys. E.F. Codd came up with the idea in the 1970s. The goal is to make sure each fact is stored only once, so updates, inserts, and deletes stay correct by design, not just by care. Denormalization is doing the opposite on purpose, traded for faster reads.

## Key Concepts

- **1NF (first normal form)** — each column holds one plain value, no repeated groups in a row
- **2NF** — every non-key column depends on the whole primary key, not just part of it
- **3NF** — every non-key column depends only on the key, not on other non-key columns
- **BCNF** — a stricter version of 3NF for some tricky cases with overlapping keys
- **Update/insert/delete anomaly** — the kind of mistake that normalization is built to stop
- **Denormalization** — copying data on purpose for faster reads

## Core Knowledge

- Each normal form fixes one kind of problem — 1NF fixes non-plain data, 2NF fixes partial-key dependence, 3NF fixes column-to-column dependence
- An update mistake happens when the same fact is stored in more than one place, and one copy gets missed when updating. Normalization removes the repeated data that causes this.
- Most real systems aim for 3NF. BCNF and higher forms are rarely used outside school examples.
- Normalizing means more joins are needed to put a full picture of something back together. The trade is correctness for more query complexity.
- Denormalization isn't "doing it wrong" — it's a choice to allow some repeated data for a proven, busy read path.
- Over-normalizing a table that's mostly read and rarely changed wastes join effort protecting against problems that don't apply there.
- Normalization is a rule for relational databases. NoSQL document/wide-column models copy data on purpose by default, for a different reason (no cheap joins).
- A database doesn't have to pick one level everywhere — normalize the write-heavy, correctness-critical core, and denormalize specific busy read paths on purpose.
- Try cheaper fixes first (indexes, caching, read replicas) before denormalizing; data warehouses (star/snowflake schemas) are the extreme end of denormalizing on purpose for analytics.

## Interview Questions

**Q:** What problem does normalization actually solve?
**A:** Update/insert/delete mistakes caused by repeated data — normalizing makes sure each fact lives in exactly one place, so copies can't drift out of sync.

**Q:** Why is 3NF the common real-world target rather than BCNF or higher?
**A:** 3NF removes the mistakes that matter in almost all real databases; higher normal forms handle rare edge cases at a cost most systems don't need to pay.

**Q:** When is denormalization the right call?
**A:** When a specific, measured busy read path is slowed by join cost, and the team accepts writing extra sync code to keep the copied data correct.

**Q:** What's the cost of normalizing a table that doesn't need it?
**A:** Extra joins on every read, protecting against mistakes that a rarely-changed, read-heavy table doesn't actually have.

## Scenario

An e-commerce database first stores a customer's address directly on every order row. Updating a customer's address then means updating every past order, or old orders wrongly show the customer's new address as if that's where they lived when they bought the item. Moving address into its own table, linked by a foreign key from an address-at-time-of-order snapshot, removes the confusion — the mistake disappears because there's no longer a repeated fact that can drift out of sync.

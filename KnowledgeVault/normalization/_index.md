---
id: normalization
title: "Normalization"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, sql]
parent: structured-database
children: []
---

# Normalization

## Overview

Normalization is the process of organizing relational tables to reduce data duplication and eliminate update anomalies, by splitting data into smaller tables linked by foreign keys. It exists to guarantee a fact is stored once, so updates, inserts, and deletes stay consistent by construction rather than by discipline. Denormalization is the deliberate reversal of this, traded for read performance.

## Key Concepts

- **1NF (first normal form)** — atomic column values, no repeating groups within a row
- **2NF** — every non-key column depends on the whole primary key, not part of it
- **3NF** — every non-key column depends only on the key, not on other non-key columns
- **BCNF** — stricter version of 3NF handling certain overlapping candidate key edge cases
- **Update/insert/delete anomaly** — inconsistency risk that normalization specifically eliminates
- **Denormalization** — intentionally reintroducing duplication for read performance

## Core Knowledge

- Each normal form fixes a specific class of anomaly — 1NF fixes non-atomic data, 2NF fixes partial-key dependency, 3NF fixes transitive dependency
- An update anomaly happens when duplicated data must be changed in multiple places and one gets missed — normalization removes the duplication that makes this possible
- Most production schemas target 3NF as a practical default — BCNF and higher normal forms are rarely pursued outside academic contexts
- Normalizing multiplies the number of joins needed to reconstruct a full picture of an entity — the tradeoff is integrity for query complexity
- Denormalization is not "doing it wrong" — it's a deliberate choice to accept controlled duplication for a proven, high-traffic read path
- Over-normalizing a schema that's mostly read, rarely updated, wastes join cost for anomaly protection the workload doesn't need
- Normalization is a relational-model discipline; NoSQL document/wide-column models embrace denormalization by default for different reasons (no cheap joins)
- A schema doesn't need to pick one level globally — normalize the write-heavy, integrity-critical core, denormalize specific read-heavy paths deliberately

## Interview Questions

**Q:** What anomaly does normalization actually solve?
**A:** Update/insert/delete anomalies caused by duplicated data — normalizing ensures each fact lives in exactly one place, so there's nowhere for copies to drift out of sync.

**Q:** Why is 3NF the common practical target rather than BCNF or higher?
**A:** 3NF eliminates the anomalies that matter in almost all real schemas; higher normal forms handle rare edge cases at a complexity cost most systems don't need to pay.

**Q:** When is denormalization the right call?
**A:** When a specific, measured read-heavy path suffers from join cost, and the team accepts the tradeoff of explicit sync logic to keep the duplicated data consistent.

**Q:** What's the cost of normalizing a table that doesn't need it?
**A:** Extra joins on every read for anomaly protection that a rarely-updated, read-heavy table doesn't actually benefit from.

## Scenario

An e-commerce schema originally stores customer address directly on every order row, and updating a customer's address requires updating every historical order, or old orders silently show a customer's new address as if that's where they lived at purchase time. Normalizing address into its own table, referenced by foreign key from an address-at-time-of-order snapshot, removes the ambiguity — the anomaly disappears because there's no longer a duplicated fact that can drift out of sync.

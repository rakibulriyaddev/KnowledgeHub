---
id: schema-migration
title: "Schema Migration"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage]
parent: database-schema
children: []
status: draft
---

# Schema Migration

## Overview

A schema migration is a controlled, versioned change to a database's structure — adding a column, changing a type, splitting a table — applied to a system that's already running in production with live data and traffic. It exists because schemas must evolve as requirements change, but changing structure under a live workload is fundamentally riskier than designing it once upfront.

## Key Concepts

- **Migration script** — versioned, ordered file describing one structural change, usually with up/down (apply/revert) logic
- **Backward-compatible change** — a change old application code can still tolerate during rollout
- **Backfill** — populating a new column/table with derived or default data for existing rows
- **Online/zero-downtime migration** — technique avoiding table locks or service interruption during the change
- **Expand/contract pattern** — add the new shape, migrate usage, then remove the old shape, rather than changing in place
- **Rollback plan** — a tested way to undo the migration if it fails partway or causes issues

## Core Knowledge

- Adding a NOT NULL column to a large live table locks it or takes a long scan in many engines — add nullable first, backfill, then add the constraint
- The expand/contract pattern avoids a single risky cutover: add new structure alongside old, migrate reads/writes gradually, remove old structure only once nothing depends on it
- Migrations must be backward-compatible with the currently deployed app version during rolling deploys — old code and new code both run against the same schema for a window
- Backfilling millions of rows should run in small batches with throttling, not one giant transaction — avoids long locks, replication lag, and memory blowups
- Every migration needs a tested rollback path before running in production — "we'll figure it out if it fails" is not a rollback plan
- Renaming or dropping a column/table is the riskiest migration category — always go through expand/contract (add new, dual-write, cut over, remove old) rather than a direct rename
- Migrations should be idempotent and re-runnable where possible — a partially applied migration due to a crash shouldn't corrupt state on retry
- Index creation during migration can lock writes on some engines unless the engine's online/concurrent index-build option is used

## Interview Questions

**Q:** Why not just add a NOT NULL column directly on a large table?
**A:** The engine must validate/lock the existing rows, which can block writes for a long time; adding it nullable, backfilling in batches, then enforcing NOT NULL avoids the lock.

**Q:** What is the expand/contract pattern and why use it for renames?
**A:** Add the new column/table, dual-write to both old and new, migrate readers over, then remove the old one — a direct rename risks breaking any code still expecting the old name mid-deploy.

**Q:** Why do migrations need to be backward-compatible during a rolling deploy?
**A:** Old and new application code run simultaneously against the same database during rollout, so the schema must satisfy both versions until the deploy completes.

**Q:** What's the risk of backfilling a large table in one transaction?
**A:** Long lock duration, replication lag, and memory/log growth — batching the backfill with throttling avoids all three.

## Scenario

A team needs to rename a heavily used `status` column to `order_status` on a table serving live traffic, and a direct rename would break any in-flight requests hitting old code during a rolling deploy. Using expand/contract — adding `order_status`, dual-writing both columns, migrating all readers to the new name, then dropping `status` once nothing references it — completes the rename with zero downtime and no window where any deployed code version sees a broken schema.

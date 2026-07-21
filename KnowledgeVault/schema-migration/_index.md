---
id: schema-migration
title: "Schema Migration"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage]
parent: database-schema
children: []
status: draft
---

# Schema Migration

## Overview

A schema migration is a controlled, tracked change to a database's structure — adding a column, changing a type, splitting a table — done on a system already running in production with live data and traffic. It exists because schemas must change as needs change, but changing structure under a live workload is much riskier than designing it once up front.

## Key Concepts

- **Migration script** — a versioned, ordered file describing one structural change, usually with up/down (apply/undo) logic
- **Backward-compatible change** — a change the old app code can still handle during rollout
- **Backfill** — filling a new column/table with derived or default data for rows that already exist
- **Online/zero-downtime migration** — a way to avoid locking tables or stopping the service during the change
- **Expand/contract pattern** — add the new shape, move usage over, then remove the old shape, instead of changing things in place
- **Rollback plan** — a tested way to undo the migration if it fails partway or causes problems

## Core Knowledge

- Adding a NOT NULL column to a large live table locks it or takes a long scan in many engines — add it as nullable first, fill it in, then add the constraint
- The expand/contract pattern avoids one risky cutover: add the new structure next to the old, move reads/writes over bit by bit, remove the old structure only once nothing needs it
- Migrations must still work with the currently deployed app version during rolling deploys — old code and new code both run against the same schema for a while
- Filling in millions of rows should run in small batches with pacing, not one giant transaction — this avoids long locks, replication lag, and memory blowups
- Every migration needs a tested rollback path before it runs in production — "we'll figure it out if it fails" is not a rollback plan
- Renaming or dropping a column/table is the riskiest kind of migration — always use expand/contract (add new, write to both, cut over, remove old) instead of a direct rename
- Migrations should be safe to run twice where possible — a migration that crashes partway through shouldn't break things if retried
- Creating an index during a migration can lock writes on some engines unless the engine's online/concurrent index-build option is used

## Interview Questions

**Q:** Why not just add a NOT NULL column directly on a large table?
**A:** The engine has to check/lock the existing rows, which can block writes for a long time; adding it as nullable, filling it in batches, then enforcing NOT NULL avoids the lock.

**Q:** What is the expand/contract pattern and why use it for renames?
**A:** Add the new column/table, write to both old and new, move readers over, then remove the old one — a direct rename risks breaking any code still expecting the old name mid-deploy.

**Q:** Why do migrations need to work with old app code during a rolling deploy?
**A:** Old and new app code run at the same time against the same database during rollout, so the schema must work for both versions until the deploy finishes.

**Q:** What's the risk of filling in a large table in one transaction?
**A:** A long lock, replication lag, and memory/log growth — batching the fill-in with pacing avoids all three.

## Scenario

A team needs to rename a heavily used `status` column to `order_status` on a table serving live traffic, and a direct rename would break any in-flight requests hitting old code during a rolling deploy. Using expand/contract — adding `order_status`, writing to both columns, moving all readers to the new name, then dropping `status` once nothing uses it — finishes the rename with zero downtime and no moment where any deployed code version sees a broken schema.

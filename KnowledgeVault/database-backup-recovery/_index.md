---
id: database-backup-recovery
title: "Database Backup & Recovery"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, reliability]
parent: database
children: []
status: draft
---

# Database Backup & Recovery

## Overview

Backup and recovery is the discipline of capturing restorable copies of a database and proving they can actually be restored, so data survives hardware failure, corruption, or human error that replication and durability guarantees don't fully cover. It exists because replication protects against node loss, not against a bad deploy or accidental delete replicating everywhere just as fast as the good data.

## Key Concepts

- **Full backup** — complete point-in-time copy of the entire dataset
- **Incremental / differential backup** — captures only changes since the last full (or last incremental) backup
- **Point-in-time recovery (PITR)** — restoring to any specific moment using a base backup plus transaction/WAL logs
- **RPO (recovery point objective)** — maximum acceptable data loss, measured in time
- **RTO (recovery time objective)** — maximum acceptable time to restore service
- **Restore testing** — actually performing a restore to verify the backup is usable

## Core Knowledge

- A backup that has never been restored is unverified — corruption, incompatible tooling, or incomplete capture are only discovered at restore time if never tested beforehand
- Replication is not a backup: a dropped table or corrupted row replicates to every replica just as reliably as valid data, so replication protects availability, not against logical mistakes
- Point-in-time recovery (base backup + replayed logs) is what lets a team recover to "right before the bad migration ran," not just to the last nightly snapshot
- RPO and RTO are business decisions, not technical defaults — they determine backup frequency, retention, and whether standby infrastructure is needed for fast restores
- Backup storage needs its own security posture (encryption, access control) — a backup is a full copy of production data and an equally attractive attack target
- Incremental backups reduce storage and time cost but lengthen restore complexity — a full restore may require replaying a chain of incrementals in order
- Backup retention and deletion policy needs to balance recovery flexibility against storage cost and, in some jurisdictions, data-retention/compliance requirements
- Cross-region backup storage protects against a regional outage or disaster taking out both primary data and its backups simultaneously

## Interview Questions

**Q:** Why isn't replication a substitute for backups?
**A:** Replication propagates every write, including accidental deletes or corruption, to all replicas — it protects against node failure, not against logical data loss.

**Q:** What does point-in-time recovery let you do that a nightly backup alone doesn't?
**A:** Restore to any specific moment (e.g. seconds before a bad deploy) by replaying transaction logs on top of a base backup, rather than only to the last full snapshot.

**Q:** What's the difference between RPO and RTO?
**A:** RPO is how much data loss is acceptable (driving backup frequency); RTO is how long service can be down during recovery (driving restore speed and standby readiness).

**Q:** Why is "we have backups" not sufficient reassurance on its own?
**A:** An untested backup's restorability is unknown — corruption, tooling drift, or incomplete capture only surface at restore time unless restores are regularly rehearsed.

## Scenario

A bad migration script accidentally deletes a large chunk of customer data, and by the time it's noticed, the deletion has already replicated to every read replica. The team restores from the last base backup and replays the transaction logs up to just before the migration ran, recovering the exact pre-incident state — something the healthy, fully-replicated cluster alone could never have provided.

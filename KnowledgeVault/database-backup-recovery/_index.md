---
id: database-backup-recovery
title: "Database Backup & Recovery"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, reliability]
parent: database
children: []
status: draft
---

# Database Backup & Recovery

## Overview

Backup and recovery means making copies of a database that can be restored, and proving those copies actually work, so data survives hardware failure, corruption, or human mistakes that other safety nets don't fully cover. It matters because copying data to other nodes (replication) guards against losing a node, not against a bad deploy or an accidental delete that spreads everywhere just as fast as good data.

## Key Concepts

- **Full backup** — a complete copy of the whole dataset at one point in time
- **Incremental / differential backup** — captures only changes since the last full (or last incremental) backup
- **Point-in-time recovery (PITR)** — restoring to any exact moment using a base backup plus change logs
- **RPO (recovery point objective)** — the most data loss you can accept, measured in time
- **RTO (recovery time objective)** — the most time you can accept for service to be down
- **Restore testing** — actually running a restore to check the backup works

## Core Knowledge

- A backup that has never been restored is unproven — corruption, bad tools, or a missing piece are only found at restore time if it's never tested first
- Replication is not a backup: a dropped table or bad row copies to every replica just as fast as good data, so replication protects uptime, not against mistakes
- Point-in-time recovery (base backup + replayed logs) is what lets a team go back to "right before the bad change ran," not just to the last nightly copy
- RPO and RTO are business choices, not technical defaults — they set backup frequency, how long to keep backups, and whether standby systems are needed for fast restores
- Backup storage needs its own security setup (encryption, access control) — a backup is a full copy of live data and just as tempting a target
- Incremental backups cut storage and time cost but make restores more complex — a full restore may need to replay a chain of incrementals in order
- Backup keep/delete rules must balance recovery flexibility against storage cost and, in some places, legal data-keeping rules
- Storing backups in another region protects against a regional outage wiping out both live data and its backups at once

## Interview Questions

**Q:** Why isn't replication a stand-in for backups?
**A:** Replication copies every write, including accidental deletes or bad data, to all replicas — it protects against node failure, not against mistakes in the data itself.

**Q:** What can point-in-time recovery do that a nightly backup alone can't?
**A:** Restore to any exact moment (like seconds before a bad deploy) by replaying change logs on top of a base backup, instead of only to the last full copy.

**Q:** What's the difference between RPO and RTO?
**A:** RPO is how much data loss is okay (setting backup frequency); RTO is how long the service can be down during recovery (setting restore speed and standby readiness).

**Q:** Why isn't "we have backups" enough on its own?
**A:** An untested backup's ability to restore is unknown — corruption, tool problems, or a missing piece only show up at restore time unless restores are practiced often.

## Scenario

A bad migration script by mistake deletes a large chunk of customer data, and by the time it's noticed, the delete has already copied to every read replica. The team restores from the last base backup and replays the change logs up to just before the migration ran, getting back the exact state before the incident — something the healthy, fully-replicated cluster alone could never have given them.

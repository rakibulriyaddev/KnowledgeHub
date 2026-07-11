---
id: storage
title: "Storage"
created: 2026-07-11
modified: 2026-07-11
tags: [infrastructure, data, cloud]
parent: networking
children: []
status: draft
---

## Overview

Storage systems fall into three architectural types — block, file, and object — each trading off performance, sharing model, and scale differently. Choosing the right one for a given workload (database vs shared documents vs uploaded media) is a foundational system design decision.

## Key Concepts

- HDD (cheap, spinning disk, ~100 IOPS) vs SSD (flash, 10,000+ IOPS, modern default)
- RAID levels: 0 (striping), 1 (mirroring), 5/6 (parity), 10 (mirror+stripe)
- Block storage — fixed-size blocks, single-server attach, fastest, used for databases (AWS EBS)
- File storage — hierarchical, multi-client access via NFS/SMB, used for shared documents (AWS EFS)
- Object storage — flat key-based namespace via HTTP/REST, nearly unlimited scale, cheapest (AWS S3)
- Cloud storage tiers: Hot/Standard, Warm/Infrequent Access, Cold/Archive (Glacier)

## Core Knowledge

Block storage divides space into fixed-size blocks that the OS assembles into a file system; it's the lowest-level, fastest option, but it's mounted on a single server — ideal for databases and VM disks where fast random writes matter (AWS EBS, Azure Disk). File storage adds a familiar hierarchical folder/file structure and lets multiple clients access the same storage simultaneously over a network protocol like NFS or SMB — suited to shared team documents or legacy applications that expect POSIX semantics (AWS EFS). Object storage abandons hierarchy entirely: each object has a unique key and metadata, is accessed via an HTTP/REST API, and lives in a flat "bucket" namespace. It scales to petabytes with built-in geographic redundancy and is the cheapest per GB, but objects are immutable — updating one means re-uploading it entirely, not editing in place (AWS S3, Google Cloud Storage, Azure Blob).

RAID configurations combine multiple physical disks for either performance or redundancy: RAID 0 stripes data for speed with zero redundancy, RAID 1 mirrors data across two disks for fail-safety at half capacity, RAID 5 stripes with parity to survive one disk failure, RAID 6 adds a second parity block to survive two failures, and RAID 10 combines mirroring and striping for both performance and redundancy.

**Caution:** RAID is not a substitute for backup — it protects against hardware failure, not against accidental deletion, ransomware, or a fire that destroys the whole array; a separate backup strategy is always required. Similarly, object storage isn't suited to hosting a live database — it isn't built for the frequent random writes a database needs, and download (egress) bandwidth charges can add up.

Cloud providers layer cost-optimized tiers on top of these storage types: Hot/Standard for frequently accessed data, Warm/Infrequent Access for occasional reads at lower storage cost but a retrieval fee, and Cold/Archive (like Glacier) for rarely-touched data at minimal cost but slow retrieval — lifecycle policies can automatically migrate data between tiers as it ages.

## Interview Questions

**Q: When would you choose block storage over object storage?**
A: When the workload needs fast, frequent random writes on a single server — databases and VM disks are the classic case; object storage isn't designed for that access pattern and objects are immutable.

**Q: Why isn't RAID a substitute for a backup strategy?**
A: RAID protects against hardware/disk failure by providing redundancy, but it can't protect against human error (accidental deletion), ransomware, or a disaster that destroys the whole array — a separate, ideally offsite, backup is still required.

**Q: How would you store user-uploaded images for an Instagram-like app at scale?**
A: Object storage (e.g., S3) — it offers near-unlimited scale, built-in redundancy, and low per-GB cost, which fits the write-once/read-many pattern of uploaded media far better than block or file storage.

## Scenario

A team is deciding where to host a PostgreSQL database versus where to host user-uploaded profile photos. The database goes on SSD-backed block storage (e.g., AWS EBS) for fast random I/O, while the photos go to object storage (e.g., S3) behind a CDN — each storage type matched to the access pattern it's actually built for.

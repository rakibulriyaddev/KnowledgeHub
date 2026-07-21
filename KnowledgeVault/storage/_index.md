---
id: storage
title: "Storage"
created: 2026-07-11
modified: 2026-07-22
tags: [infrastructure, data, cloud]
parent: networking
children: []
status: draft
---

## Overview

Storage systems fall into three main types — block, file, and object — each with a different trade-off between speed, how it's shared, and how far it scales. Picking the right one for a given job (a database vs shared documents vs uploaded media) is a basic system design decision.

## Key Concepts

- HDD (cheap, spinning disk, about 100 IOPS) vs SSD (flash memory, 10,000+ IOPS, the modern default)
- RAID levels: 0 (striping), 1 (mirroring), 5/6 (parity), 10 (mirror + stripe)
- Block storage — fixed-size blocks, attaches to one server, fastest, used for databases (AWS EBS)
- File storage — folders and files, many clients can use it at once via NFS/SMB, used for shared documents (AWS EFS)
- Object storage — flat, key-based storage reached over HTTP/REST, almost unlimited scale, cheapest (AWS S3)
- Cloud storage tiers: Hot/Standard, Warm/Infrequent Access, Cold/Archive (Glacier)

## Core Knowledge

Block storage splits space into fixed-size blocks, which the OS puts together into a file system; it's the lowest-level, fastest option, but it connects to only one server at a time — great for databases and VM disks where fast, random writes matter (AWS EBS, Azure Disk). File storage adds the familiar folder/file structure and lets many clients use the same storage at once, over a network protocol like NFS or SMB — good for shared team documents or older apps that expect standard file behavior (AWS EFS). Object storage drops folders entirely: each object has its own key and extra info (metadata), is reached through an HTTP/REST API, and sits in a flat "bucket." It scales to huge sizes with built-in backup across regions and is the cheapest per GB, but objects can't be edited in place — updating one means uploading it again, fully (AWS S3, Google Cloud Storage, Azure Blob).

RAID setups combine several physical disks for either speed or safety: RAID 0 spreads data across disks for speed, with no safety backup; RAID 1 copies data across two disks for safety, using half the total space; RAID 5 spreads data with a parity check, and can survive one disk failing; RAID 6 adds a second parity check, and can survive two disks failing; and RAID 10 combines copying and spreading, for both speed and safety.

**Caution:** RAID is not a replacement for backup — it protects against hardware failing, but not against accidental deletion, ransomware, or a fire that destroys the whole set of disks; you always need a separate backup plan too. In the same way, object storage isn't a good fit for running a live database — it isn't built for the frequent, random writes a database needs, and charges for downloading data (egress) can add up.

Cloud providers add cost-saving tiers on top of these storage types: Hot/Standard for data used often, Warm/Infrequent Access for data read now and then, at a lower storage cost but with a fee to retrieve it, and Cold/Archive (like Glacier) for data almost never touched, at very low cost but slow to get back — rules can be set to move data between tiers automatically as it gets older.

## Interview Questions

**Q: When would you choose block storage over object storage?**
A: When the job needs fast, frequent random writes on one server — databases and VM disks are the classic case; object storage isn't built for that pattern, and objects can't be edited in place.

**Q: Why isn't RAID a substitute for a backup strategy?**
A: RAID protects against hardware or disk failure by adding redundancy, but it can't protect against human error (accidental deletion), ransomware, or a disaster that destroys the whole set of disks — a separate, ideally offsite, backup is still needed.

**Q: How would you store user-uploaded images for an Instagram-like app at scale?**
A: Object storage (like S3) — it gives near-unlimited scale, built-in redundancy, and low cost per GB, which fits the write-once/read-many pattern of uploaded media much better than block or file storage.

## Scenario

A team is deciding where to put a PostgreSQL database versus where to put user-uploaded profile photos. The database goes on SSD-backed block storage (like AWS EBS) for fast, random reads and writes, while the photos go to object storage (like S3) behind a CDN — each storage type matched to the way it's actually used.

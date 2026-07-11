---
title: "Storage — Deep Dive"
---

Your phone holds five kinds of things - apps, photos, videos, documents, music. All of them are "storage". But the operating system handles each of them differently. In the cloud this division is even clearer - block, file, and object storage.

## HDD vs SSD

**HDD (Hard Disk Drive)**
- Spinning magnetic disk
- Cheap, large capacity
- Sequential read is fast, random is slow
- ~100 IOPS
- Used for cold/archive storage

**SSD (Solid State Drive)**
- Flash memory chip
- Expensive but fast
- Random access much faster
- 10,000+ IOPS
- Default in modern servers

## RAID (Redundant Array of Independent Disks)

Combining multiple disks to get performance and/or redundancy.

- **RAID 0 (Striping):** Data split across two disks - fast but no redundancy.
- **RAID 1 (Mirroring):** Same copy on two disks - fail-safe but half the capacity.
- **RAID 5:** Stripe + parity - recovers even if one disk fails.
- **RAID 6:** Two parity blocks - tolerant of two disk failures.
- **RAID 10 (1+0):** Mirror + stripe - maximum performance + redundancy.

## Block Storage

Storage is divided into fixed-size **blocks** (e.g. 4KB). The OS organizes these blocks as a file system.

### Properties
- The lowest level
- OS accesses it directly
- Usually attached over a network (SAN, iSCSI)
- Mounted on a single server
- High performance - ideal for databases

### Examples
- AWS EBS (Elastic Block Store)
- Azure Disk
- GCP Persistent Disk

### When to use it?
Databases (MySQL, PostgreSQL), VM disks, transactional workloads.

## File Storage

Hierarchical - folder/subfolder/file. Accessed from multiple servers via a network protocol.

### Properties
- Familiar tree structure (like Windows Explorer)
- Multiple clients can access it simultaneously (NFS, SMB)
- POSIX file system semantics
- Metadata: permission, owner, timestamp

### Examples
- AWS EFS (Elastic File System)
- NetApp, Isilon
- Linux NFS, Windows SMB

### When to use it?
Shared files (a team's documents), legacy apps, content management.

## Object Storage

Flat structure - each object has a unique key and metadata. No file system, no hierarchy - objects in a bucket.

### Properties
- Accessed via HTTP/REST API
- Nearly unlimited scale (petabytes+)
- Built-in geographic redundancy
- Cheap per GB
- Can't be modified directly - re-upload instead
- Versioning support

### Examples
- AWS S3 (the most famous)
- Google Cloud Storage
- Azure Blob Storage
- MinIO (self-hosted)

### When to use it?
Image/video uploads, backups, archives, log files, static website assets, ML training data.

## Comparing All Three

**Block**
- Lowest level, fastest
- Single server only
- Used for DB, VM
- Most expensive

**File**
- Tree structure, sharable
- Multi-server access
- Shared documents
- Mid-range price

**Object**
- Flat, key-based
- HTTP API
- Unlimited scale
- Cheapest, slowest

## Cloud Storage Tiers

To optimize cost, cloud providers offer tiers:
- **Hot/Standard:** Frequently accessed - most expensive but fast.
- **Warm/Infrequent Access:** Accessed a few times a month - lower cost, with a retrieval cost.
- **Cold/Archive (Glacier):** Accessed a few times a year - very cheap, retrieval takes hours/minutes.

## Real-World Examples

- **Instagram:** Photos/videos in S3 (object); metadata in a DB (block-backed).
- **Netflix:** Master video files in S3, edge cache via CDN.
- **Dropbox:** File chunks in S3 (encrypted).
- **Banking DB:** SSD block storage with RAID 10.

## Common Misconceptions

1. **"You can put a DB on S3":** No - object storage isn't built for random writes.
2. **"Object storage is always cheap":** Egress (download) bandwidth charges can be substantial.
3. **"RAID = backup":** No - RAID gives hardware redundancy, backup is a separate thing.

## Best Practices

- DB -> SSD block storage.
- User uploads (image/video) -> object storage.
- Static website assets -> object storage + CDN.
- Backups -> object storage archive tier.
- Enable versioning - to protect against accidental deletes.
- Lifecycle policies - auto-archive old data.

## Chapter Summary

- Block = the lowest level, for databases (AWS EBS).
- File = shared tree structure (NFS, EFS).
- Object = HTTP API, infinite scale (S3).
- SSD is the modern default; HDD still used for archives.
- RAID provides redundancy, but it's not a substitute for backup.

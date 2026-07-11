---
title: "Storage — Q&A"
---

**Q: What is the main difference between SSD and HDD?**
A: SSD is flash, HDD is a spinning disk — SSD is electronic flash memory; HDD is a rotating magnetic disk.

**Q: What is the main purpose of RAID?**
A: Performance and/or redundancy — RAID combines multiple disks to provide speed (striping) and/or fault tolerance (mirroring/parity).

**Q: What is RAID 1?**
A: Mirroring — RAID 1 = the same copy on two disks. If one fails, everything can still be read from the other.

**Q: Where is block storage typically used?**
A: Database, VM disk — Block storage is fastest, attached to a single server - ideal for databases.

**Q: What type of storage is AWS S3?**
A: Object — S3 = Simple Storage Service, a classic object store.

**Q: How is object storage accessed?**
A: Via HTTP/REST API using a key — Object storage has a flat namespace, accessed via HTTP requests keyed by name.

**Q: An object in object storage can't be modified - it has to be fully re-uploaded.**
A: True — Objects are immutable; there's no partial update - you pull, modify, and push.

**Q: What type of storage is AWS EBS?**
A: Block — EBS = Elastic Block Store, attached to an EC2 instance.

**Q: What type of storage is AWS EFS?**
A: File — EFS = Elastic File System, NFS-compliant shared file storage.

**Q: When would you use the Cold/Glacier tier?**
A: Accessed a few times a year - archiving — The archive tier is very cheap but retrieval takes time. Good for backups and compliance archives.

**Q: You're building an Instagram-like app - millions of photos will be uploaded. Which storage?**
A: Object (S3) — Object storage has unlimited scale and cheap per-GB cost - the industry standard for image uploads.

**Q: Which storage for a PostgreSQL DB?**
A: Block (SSD) — A DB needs block storage (preferably SSD) - fast random writes required.

**Q: Which of these is NOT an advantage of object storage?**
A: Random write speed — Object storage can't do random write/append - it's full upload/replace.

**Q: RAID hardware is a substitute for backup.**
A: False — RAID provides redundancy but can't protect against human deletion, ransomware, or fire - a separate backup is essential.

**Q: What is IOPS?**
A: Input/Output Operations Per Second — IOPS = how many read/write operations a disk can do per second.

**Q: How many times higher is SSD's IOPS compared to HDD's?**
A: 10-100x — HDD ~100 IOPS; SSD 10,000+ IOPS - much higher random performance.

**Q: What is RAID 10?**
A: Mirror + stripe (best of both) — RAID 10 = RAID 1+0 - striping across mirrored pairs. Performance + redundancy.

**Q: Where would you host a static website's HTML/CSS/JS?**
A: S3 + CloudFront — Object storage + CDN = cheap, fast, scalable.

**Q: What does egress charge mean in object storage?**
A: Download/transfer-out cost — In AWS S3, downloading data (to another region/the internet) incurs a charge - often expensive.

**Q: Data can be auto-moved between cloud storage tiers (lifecycle policy).**
A: True — After 30 days S3 Standard -> IA, after 90 days -> Glacier - all via automated rules.

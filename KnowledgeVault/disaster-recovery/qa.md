---
title: "Disaster Recovery — Q&A"
---

**Q: What is Disaster Recovery?**
A: Restoring business continuity after a catastrophic failure — A pre-planned recovery strategy.

**Q: What is RPO?**
A: Data-loss tolerance - time between the last good backup and the disaster — Recovery Point Objective.

**Q: What is RTO?**
A: Tolerable time to bring the service back up after a disaster — Recovery Time Objective.

**Q: What does RPO 0 mean?**
A: No data loss - synchronous replication — Real-time replication - no loss in a disaster.

**Q: What does RTO 0 mean?**
A: Instant recovery - active-active — No downtime - multi-region active.

**Q: Cheapest DR strategy?**
A: Backup & Restore (cold) — Periodic backup, manual restore - slow but cheap.

**Q: Highest cost, lowest RTO/RPO?**
A: Active-Active multi-region — 2× infrastructure, but near-zero downtime.

**Q: What is the Pilot Light strategy?**
A: Minimal infra (DB replica) at the DR site; scale up on disaster — The database is ready; app servers need to scale up.

**Q: The 3-2-1 backup rule?**
A: 3 copies, 2 media types, 1 off-site — The standard backup best practice.

**Q: Taking a backup is enough - testing restoration is optional.**
A: False — An untested backup is no backup. Testing is mandatory.

**Q: Benefit of incremental backup?**
A: Only changes since the last backup - fast, smaller — Quick for daily incrementals.

**Q: Downside of full backup?**
A: Slow and large storage — A complete copy every time.

**Q: A bank can't tolerate outages. What strategy?**
A: Active-Active multi-region — Banking requires near-zero RPO/RTO.

**Q: A startup's blog. What DR strategy?**
A: Backup & Restore — Cost-conscious and low criticality.

**Q: What is Netflix's Chaos Monkey?**
A: Injects random failures in production to verify resilience — A pioneer of chaos engineering.

**Q: Multi-region failover mechanisms?**
A: DNS-based (Route 53), BGP anycast, application-level retry — Multiple options depending on the use case.

**Q: What is a BCP?**
A: Business Continuity Plan - DR plus people, communication, regulatory concerns — Broader in scope than DR.

**Q: Lesson from the 2017 AWS S3 outage?**
A: Multi-region is critical - a single region is a SPOF — Many services went down - multi-region became the default afterward.

**Q: The cloud is automatically disaster-proof.**
A: False — Regional outages happen - you need a multi-region architecture.

**Q: How often should a DR plan be tested?**
A: Quarterly and after major changes — Regular practice also catches outdated plans.

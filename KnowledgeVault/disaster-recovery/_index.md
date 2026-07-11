---
id: disaster-recovery
title: "Disaster Recovery"
created: 2026-07-11
modified: 2026-07-11
tags: [reliability, business-continuity, multi-region, backup]
parent: reliability-security
children: []
status: draft
---

## Overview

Disaster Recovery (DR) is a pre-planned strategy for restoring business continuity after a catastrophic failure — fire, earthquake, region-wide outage, or cyber attack. Companies that failed over to a backup region during real incidents (like the 2022 Bangladesh ISP data-center fire) stayed online; unprepared ones went down for hours.

## Key Concepts

- RPO (Recovery Point Objective) — how much data loss is acceptable.
- RTO (Recovery Time Objective) — how quickly service must be restored.
- Strategy spectrum — Backup & Restore → Pilot Light → Warm Standby → Active-Active.
- 3-2-1 backup rule — 3 copies, 2 media types, 1 off-site.
- DR testing — an untested plan is no plan (tabletop, walkthrough, simulation, game day).
- Business Continuity Plan (BCP) — the broader plan beyond technical recovery.

## Core Knowledge

Disasters come in many forms: natural, hardware, software, network, human error, cyber attack, and power failure. Two metrics quantify recovery targets: **RPO** measures acceptable data loss (0 = synchronous replication, no loss; hours = periodic backup), and **RTO** measures acceptable downtime (0 = instant active-active failover; days = manual cold restore). These drive the choice of strategy: **Backup & Restore** (cold, cheapest, RPO/RTO in hours-days, common for SMBs), **Pilot Light** (minimal DR infrastructure like a DB replica, scale up app servers on disaster, RPO minutes/RTO tens of minutes), **Warm Standby** (a scaled-down copy always running, RPO seconds/RTO minutes), and **Hot Standby / Active-Active** (full production load in every region, RPO 0/RTO seconds, at 2x infrastructure cost).

Backups themselves follow the 3-2-1 rule and come in full, incremental, differential, and snapshot forms. **Caution:** taking a backup is not enough — restoration must be tested regularly, or the backup may be worthless when actually needed. Multi-region architectures are either active-passive (secondary standing by, DNS/LB switches over on failover) or active-active (both regions serving traffic, with the added challenge of keeping stateful data in sync), often paired with geo-routing for latency. Failover itself can be DNS-based, BGP anycast, application-level retry, or manual.

DR is validated through testing — tabletop exercises, walkthroughs, simulations, and "game days" that inject real failures into production (Netflix's Chaos Monkey being the canonical example). DR is narrower than a **Business Continuity Plan (BCP)**, which also covers communication trees, status pages, customer notification, and regulatory reporting.

## Interview Questions

**Q: What's the difference between RPO and RTO?**
A: RPO is how much data loss is tolerable (time since the last good backup); RTO is how much downtime is tolerable (time to restore service). RPO 0 means synchronous replication with no data loss; RTO 0 means instant failover via active-active.

**Q: Why isn't "we have backups" the same as having a disaster recovery plan?**
A: A backup is just data; DR is the full process of restoring service — infrastructure, failover mechanism, runbooks, and testing. An untested backup may fail to restore when actually needed.

**Q: Which DR strategy would you pick for a bank versus a small startup blog?**
A: A bank needs near-zero RPO/RTO, justifying active-active multi-region despite the cost; a low-criticality blog can tolerate hours of downtime, so cheap backup & restore is sufficient.

## Scenario

A regional data-center fire takes an ISP offline for hours. Companies running active-active across multiple regions have their DNS/load balancer redirect traffic to the healthy region within seconds — customers barely notice. Companies relying only on nightly backups in a single region have to provision new infrastructure and restore data from scratch, resulting in hours of downtime.

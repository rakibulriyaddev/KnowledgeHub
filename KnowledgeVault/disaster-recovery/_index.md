---
id: disaster-recovery
title: "Disaster Recovery"
created: 2026-07-11
modified: 2026-07-22
tags: [reliability, business-continuity, multi-region, backup]
parent: reliability-security
children: []
status: draft
---

## Overview

Disaster Recovery (DR) is a plan made ahead of time for getting a business running again after a huge failure — a fire, an earthquake, a region-wide outage, or a cyber attack. Companies that switched over to a backup region during real events (like the 2022 Bangladesh ISP data-center fire) stayed online. Companies that were not ready went down for hours.

## Key Concepts

- RPO (Recovery Point Objective) — how much data loss is okay.
- RTO (Recovery Time Objective) — how fast service must come back.
- Strategy spectrum — Backup & Restore → Pilot Light → Warm Standby → Active-Active.
- 3-2-1 backup rule — 3 copies, 2 media types, 1 off-site.
- DR testing — a plan that has never been tested is not really a plan (tabletop, walkthrough, simulation, game day).
- Business Continuity Plan (BCP) — the bigger plan that covers more than just technical recovery.

## Core Knowledge

Disasters come in many forms: natural events, hardware failure, software bugs, network failure, human error, cyber attack, and power loss. Two numbers set the recovery targets: **RPO** measures how much data loss is okay (0 means data is copied live with no loss; hours means backups taken now and then), and **RTO** measures how much downtime is okay (0 means an instant switch to another live region; days means a slow manual restore). These numbers decide which strategy to use: **Backup & Restore** (cold and cheapest, RPO/RTO in hours to days, common for small businesses), **Pilot Light** (a small DR setup, like a database copy, scaled up to full size when disaster hits, RPO in minutes, RTO in tens of minutes), **Warm Standby** (a smaller copy of the system running all the time, RPO in seconds, RTO in minutes), and **Hot Standby / Active-Active** (full production load running in every region at once, RPO 0, RTO in seconds, but at double the infrastructure cost).

Backups follow the 3-2-1 rule and come in full, incremental, differential, and snapshot forms. **Caution:** taking a backup is not enough on its own — restoring from it must be tested often, or the backup may turn out useless when it is really needed. Systems that run in more than one region are either active-passive (a backup region waits, and DNS or a load balancer switches over when needed) or active-active (both regions handle traffic at once, which adds the challenge of keeping shared data in sync), often paired with geo-routing to keep latency low. The switch-over itself can happen through DNS, BGP anycast, retries at the app level, or by hand.

DR plans are checked through testing — tabletop exercises, walkthroughs, simulations, and "game days" that create real failures in production on purpose (Netflix's Chaos Monkey is the best-known example). DR covers less ground than a **Business Continuity Plan (BCP)**, which also covers who to call, status pages, telling customers, and reporting to regulators.

## Interview Questions

**Q: What's the difference between RPO and RTO?**
A: RPO is how much data loss is okay — the time since the last good backup. RTO is how much downtime is okay — the time it takes to restore service. RPO 0 means data is copied live with no loss; RTO 0 means an instant switch-over using active-active.

**Q: Why isn't "we have backups" the same as having a disaster recovery plan?**
A: A backup is just data. DR is the whole process of getting service back up — infrastructure, a way to switch over, step-by-step guides, and testing. A backup that has never been tested might fail to restore when it is really needed.

**Q: Which DR strategy would you pick for a bank versus a small startup blog?**
A: A bank needs RPO and RTO close to zero, so active-active across regions is worth the extra cost. A small blog can handle hours of downtime, so cheap backup & restore is enough.

## Scenario

A fire in one region's data center takes an ISP offline for hours. Companies running active-active across several regions have their DNS or load balancer send traffic to the healthy region within seconds — customers barely notice. Companies that only rely on nightly backups in one region have to set up new infrastructure and restore data from scratch, which means hours of downtime.

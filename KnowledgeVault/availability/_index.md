---
id: availability
title: "Availability"
created: 2026-07-11
modified: 2026-07-22
tags: [reliability, sla, distributed-systems, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Availability measures how much of the time a system stays up and reachable, worked out as uptime divided by total time. It matters because the gap between "good enough" and "top-tier" availability is huge, in both work needed and cost.

## Key Concepts

- Availability = Uptime / (Uptime + Downtime)
- "Nines" — 99% (2 nines) through 99.999% (5 nines), each extra nine cuts downtime by 10x
- Backup copies — Active-Active (all machines handle traffic) vs Active-Passive (a standby takes over on failure)
- Failover, copying data, spreading across regions, load balancing with health checks
- Stateless design, graceful reduction in service, circuit breakers
- Parts in series multiply availability down; parts in parallel (backup) multiply the chance of failure down

## Core Knowledge

Availability is a simple ratio, but its real effects add up fast: 99% availability means 3.65 days of downtime a year, which is very bad for something like online shopping, while 99.999% ("five nines") means only about 5.26 minutes a year but needs multi-region active-active setup, special hardware, and real cost — each extra nine usually costs several times more than the last. **Caution:** reaching five-nines is rarely about better code alone — it needs backup infrastructure spread across several places that could fail.

The main ways to get high availability are backup copies (extra copies of key parts), automatic failover, data copying, spreading across regions, load-balanced health checks that skip unhealthy servers, stateless design so servers can be swapped freely, graceful reduction (part of the system still works instead of a full outage), and circuit breakers that stop calls to a failing part to keep failures from spreading.

The math of linked systems matters: when parts are linked in series (App → DB → Cache, all needed), availability multiplies down — three parts at 99.9% each give only about 99.7% overall. In parallel (backup) setups, chances of failure multiply instead, so two 99% servers running side by side give 99.99% combined availability — the payoff of having backups.

Reliability and availability are related but not the same: reliability is about how rarely a system fails; availability is about how fast it comes back when it does. A very reliable system that's slow to recover can still have poor availability.

## Interview Questions

**Q: Why does going from 99.99% to 99.999% cost so much more than going from 99% to 99.9%?**
A: Each extra nine cuts downtime by 10x, but reaching it needs progressively more costly backups — multi-region active-active setups, special failover hardware, and careful operations — instead of a small improvement.

**Q: What is the difference between Active-Active and Active-Passive backup setups?**
A: In Active-Active, all machines handle traffic at once with load spread across them; in Active-Passive, one machine handles traffic while a standby only takes over after a failover, usually with a short break.

**Q: How does availability differ from reliability?**
A: Reliability measures how rarely a system fails; availability measures the percent of time it's usable, which depends on both how often it fails and how fast it recovers.

## Scenario

A banking app now at 99.99% availability wants to reach 99.999% to meet a new rule from regulators. The jump from about 52 minutes to about 5 minutes of yearly downtime forces the team to move from a single active-passive pair to a multi-region active-active setup with automatic failover and regular failure-testing drills — a tenfold jump in engineering and infrastructure spending for that last nine.

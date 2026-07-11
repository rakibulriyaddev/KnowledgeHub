---
id: availability
title: "Availability"
created: 2026-07-11
modified: 2026-07-11
tags: [reliability, sla, distributed-systems, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Availability measures the percentage of time a system stays up and accessible, calculated as uptime divided by total time. It matters because the gap between "good enough" and "enterprise grade" availability is enormous in both engineering effort and cost.

## Key Concepts

- Availability = Uptime / (Uptime + Downtime)
- "Nines" — 99% (2 nines) through 99.999% (5 nines), each extra nine cuts downtime 10x
- Redundancy — Active-Active (all nodes serve traffic) vs Active-Passive (standby takes over on failure)
- Failover, replication, geographic redundancy, load balancing with health checks
- Stateless architecture, graceful degradation, circuit breakers
- Series components multiply availability down; parallel (redundant) components multiply failure probability down

## Core Knowledge

Availability is a simple ratio, but its practical implications compound quickly: 99% availability means 3.65 days of downtime a year, which is disastrous for something like e-commerce, while 99.999% ("five nines") means only about 5.26 minutes a year but demands multi-region active-active deployment, custom hardware, and significant cost — each additional nine typically costs several times more than the last. **Caution:** achieving five-nines is rarely about better code alone — it requires redundant infrastructure across multiple failure domains.

The core strategies for high availability are redundancy (duplicate critical components), automatic failover, data replication, geographic redundancy across regions, load-balanced health checks that skip unhealthy servers, stateless architecture so servers are interchangeable, graceful degradation (partial functionality instead of full outage), and circuit breakers that stop calls to a failing dependency to prevent cascading failure.

The math of composed systems matters: when components are chained in series (App → DB → Cache, all required), availability multiplies down — three components at 99.9% each yield only ~99.7% overall. In parallel (redundant) configurations, failure probabilities multiply instead, so two 99% servers running side by side yield 99.99% combined availability — the mathematical payoff of redundancy.

Reliability and availability are related but distinct: reliability is about how infrequently a system fails; availability is about how quickly it recovers when it does. A highly reliable system with slow recovery can still have poor availability.

## Interview Questions

**Q: Why does going from 99.99% to 99.999% cost so much more than going from 99% to 99.9%?**
A: Each additional nine reduces downtime by 10x, but achieving it requires progressively more expensive redundancy — multi-region active-active deployments, custom failover hardware, and operational rigor — rather than incremental improvement.

**Q: What is the difference between Active-Active and Active-Passive redundancy?**
A: In Active-Active, all nodes serve traffic simultaneously with load distributed across them; in Active-Passive, one node handles traffic while a standby node takes over only after a failover, typically with a brief interruption.

**Q: How does availability differ from reliability?**
A: Reliability measures how rarely a system fails; availability measures the percentage of time it's usable, which depends on both failure frequency and how fast the system recovers.

## Scenario

A banking app currently at 99.99% availability wants to reach 99.999% to satisfy a new regulatory requirement. The jump from ~52 minutes to ~5 minutes of yearly downtime forces the team to move from a single active-passive pair to a multi-region active-active architecture with automated failover and regular chaos-engineering drills — a tenfold increase in engineering and infrastructure investment for that last nine.

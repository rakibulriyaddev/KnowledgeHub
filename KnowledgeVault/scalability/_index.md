---
id: scalability
title: "Scalability"
created: 2026-07-11
modified: 2026-07-11
tags: [distributed-systems, capacity-planning, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Scalability is a system's ability to handle increased load — more users, data, or transactions — without its performance breaking down. A simple test: if users grow 10x, does the system need 10x the hardware, or less? If less, it's scalable.

## Key Concepts

- Vertical scaling (scale up: more CPU/RAM on one machine) vs Horizontal scaling (scale out: more machines)
- The Scale Cube: X-axis (duplication), Y-axis (functional decomposition/microservices), Z-axis (data sharding)
- Common bottlenecks: CPU, memory, disk I/O, network, and — most often — the database
- Patterns: stateless architecture, caching, async processing, replication, sharding, CDN, microservices
- Capacity planning: QPS, storage, bandwidth, peak-vs-average, headroom buffer
- Auto-scaling reacts to CPU/memory thresholds or scheduled/predictable load

## Core Knowledge

Vertical scaling adds resources to a single machine — simple, requiring no code changes, but capped by hardware limits, a single point of failure, and exponentially rising cost. Horizontal scaling adds more machines instead, offering nearly unlimited scale and easier high availability, but it demands stateless code and introduces distributed-systems complexity. In the cloud, horizontal scaling is almost always preferred for its auto-scaling, redundancy, and cost-effectiveness; vertical scaling is reserved for cases where refactoring costs more than the extra hardware.

Martin Abbott's Scale Cube frames scaling along three independent axes: the X-axis duplicates the same server behind a load balancer (the simplest approach); the Y-axis decomposes an application into separate services by function (microservices — user, order, payment services split apart); and the Z-axis partitions data itself, sharding a database across multiple servers by something like user ID.

The database is usually the first bottleneck to hit, since it's the hardest component to scale — the standard progression is caching and read replicas first, and sharding only once that's exhausted. Other bottlenecks include CPU (compute-heavy work, fixed by optimizing or scaling out), memory (fixed with bigger servers or distributed caching), disk I/O (fixed with SSDs, indexing, caching), and network bandwidth (fixed with CDN and compression).

**Caution:** premature scaling wastes money and adds needless complexity — building a Kubernetes cluster for an app with ten users is optimization with no payoff. The right approach is to measure first (profiling, load testing) and scale only where data shows a real bottleneck, keeping roughly 30% headroom above expected peak load.

## Interview Questions

**Q: Why is horizontal scaling generally preferred over vertical scaling in cloud environments?**
A: Vertical scaling hits a hardware ceiling and remains a single point of failure with exponentially rising cost; horizontal scaling offers nearly unlimited growth, easier high availability, and fits cloud auto-scaling models — provided the application is stateless.

**Q: Explain the three axes of the Scale Cube.**
A: X-axis duplicates identical copies of the whole app behind a load balancer; Y-axis splits the app into separate services by function (microservices); Z-axis partitions data itself across shards, typically by a key like user ID.

**Q: Why does the database usually become the first bottleneck as a system scales?**
A: Because it's the hardest component to scale — unlike stateless app servers that can simply be duplicated, a database holds state, so scaling it requires replication, careful sharding, or caching layers rather than simply adding more machines.

## Scenario

A startup's single database is straining under heavy read traffic as its user base grows. Rather than jumping straight to complex sharding, the team first adds a read replica and a caching layer in front of the database — the simplest, lowest-risk step that resolves most read-heavy bottlenecks before more invasive architecture changes are needed.

---
id: scalability
title: "Scalability"
created: 2026-07-11
modified: 2026-07-22
tags: [distributed-systems, capacity-planning, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Scalability is a system's ability to handle more load — more users, data, or transactions — without its performance falling apart. A simple test: if users grow 10x, does the system need 10x the hardware, or less? If less, it's scalable.

## Key Concepts

- Vertical scaling (scale up: more CPU/RAM on one machine) vs Horizontal scaling (scale out: more machines)
- The Scale Cube: X-axis (making copies), Y-axis (splitting by function/microservices), Z-axis (splitting data/sharding)
- Common bottlenecks: CPU, memory, disk I/O, network, and — most often — the database
- Patterns: stateless design, caching, async processing, replication, sharding, CDN, microservices
- Capacity planning: requests per second, storage, bandwidth, peak vs average, extra headroom
- Auto-scaling reacts to CPU/memory thresholds or planned/expected load

## Core Knowledge

Vertical scaling adds resources to a single machine — simple, needs no code changes, but capped by hardware limits, is a single point of failure, and gets very costly fast. Horizontal scaling adds more machines instead, giving close to unlimited scale and easier high availability, but it needs stateless code and brings distributed-systems complexity. In the cloud, horizontal scaling is almost always preferred for its auto-scaling, backup copies, and lower cost; vertical scaling is kept for cases where rewriting code costs more than the extra hardware.

Martin Abbott's Scale Cube frames scaling along three separate axes: the X-axis makes copies of the same server behind a load balancer (the simplest way); the Y-axis splits an app into separate services by function (microservices — user, order, payment services split apart); and the Z-axis splits the data itself, sharding a database across many servers by something like user ID.

The database is usually the first bottleneck to hit, since it's the hardest part to scale — the normal order is caching and read replicas first, and sharding only once that's used up. Other bottlenecks include CPU (heavy compute work, fixed by making code faster or scaling out), memory (fixed with bigger servers or a shared cache), disk I/O (fixed with SSDs, indexing, caching), and network bandwidth (fixed with a CDN and compression).

**Caution:** scaling too early wastes money and adds needless complexity — building a Kubernetes cluster for an app with ten users gains nothing. The right move is to measure first (profiling, load testing) and scale only where the data shows a real bottleneck, keeping about 30% headroom above expected peak load.

## Interview Questions

**Q: Why is horizontal scaling generally preferred over vertical scaling in the cloud?**
A: Vertical scaling hits a hardware ceiling and stays a single point of failure with fast-rising cost; horizontal scaling gives close to unlimited growth, easier high availability, and fits cloud auto-scaling — as long as the app is stateless.

**Q: Explain the three axes of the Scale Cube.**
A: X-axis makes identical copies of the whole app behind a load balancer; Y-axis splits the app into separate services by function (microservices); Z-axis splits the data itself across shards, usually by a key like user ID.

**Q: Why does the database usually become the first bottleneck as a system scales?**
A: Because it's the hardest part to scale — unlike stateless app servers that can just be copied, a database holds state, so scaling it needs replication, careful sharding, or caching layers instead of just adding more machines.

## Scenario

A startup's single database is straining under heavy read traffic as its user base grows. Instead of jumping straight to complex sharding, the team first adds a read replica and a caching layer in front of the database — the simplest, lowest-risk step that fixes most read-heavy bottlenecks before bigger architecture changes are needed.

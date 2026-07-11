---
id: monoliths-microservices
title: "Monoliths vs Microservices"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, microservices, scalability, distributed-systems]
parent: architecture-patterns
children: []
status: draft
---

## Overview

A monolith packages an entire application — UI, business logic, data access — into one codebase and deployment unit, while microservices split the same functionality into small, independently deployable services that own their own data. Neither is universally "better"; the right choice depends on team size, domain clarity, and scaling needs.

## Key Concepts

- Monolith — single codebase, single process, single database, in-process calls.
- Microservice — independent codebases/deployments, per-service database, communication via API or events.
- Modular monolith — a monolith with strict internal module boundaries, easy to split later.
- Monolith First / Strangler Fig — recommended migration path from monolith to services.
- Fault isolation vs fault propagation — a microservice failure is contained; a monolith bug can take down the whole app.

## Core Knowledge

Monoliths win on simplicity: one codebase, an integrated stack trace, easy end-to-end testing, in-process calls with no network latency, and trivial ACID transactions against a single database. The weaknesses show up at scale — the whole app must scale together, a small change forces a full redeploy, the tech stack is locked in, one bug can take the entire app down, and large teams collide in the same codebase.

Microservices flip these tradeoffs: each service scales, deploys, and fails independently, teams own their service end-to-end, and different services can use different languages or databases (polyglot persistence). The cost is distributed-systems complexity — network failures, cross-service debugging, distributed transactions (Saga pattern, eventual consistency instead of ACID), and a real requirement for mature CI/CD and observability tooling.

**Note:** Martin Fowler's "Monolith First" advice is to start monolithic since domain boundaries are rarely clear upfront and a wrong split is expensive to undo. The **Strangler Fig Pattern** operationalizes migration: extract one bounded context as a service, redirect traffic via a proxy, repeat until the monolith is empty. A **modular monolith** — single deployment, strict module boundaries — is often the pragmatic middle ground. Stack Overflow proves monoliths scale; Netflix and Uber prove microservices solve team-scaling, not just performance.

## Interview Questions

**Q: When should a team choose a monolith over microservices?**
A: For startups/MVPs, small teams (under ~10), unclear domain boundaries, or when strong ACID transactions matter.

**Q: What is the Strangler Fig Pattern and why use it?**
A: Gradually extracting bounded contexts out of a monolith into services one at a time via a proxy — it minimizes risk versus a big-bang rewrite.

**Q: Why do large companies favor microservices despite the added complexity?**
A: To solve team-scaling problems — independent teams need independent deployability and ownership, not necessarily raw performance gains.

## Scenario

A 5-person startup launches an MVP as a single Rails monolith to move fast with unclear domain boundaries. Three years and 40 engineers later, the checkout and inventory modules are the bottleneck for deploys and scaling, so the team applies the strangler fig pattern — extracting those two bounded contexts into services behind an API gateway while the rest of the app stays a modular monolith.

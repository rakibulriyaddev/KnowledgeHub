---
id: monoliths-microservices
title: "Monoliths vs Microservices"
created: 2026-07-11
modified: 2026-07-22
tags: [architecture, microservices, scalability, distributed-systems]
parent: architecture-patterns
children: []
status: draft
---

## Overview

A monolith packs a whole application — UI, business logic, data access — into one codebase and one deployment unit. Microservices split that same functionality into small services that can each be deployed on their own and that own their own data. Neither one is always "better" — the right choice depends on team size, how clear the domain is, and scaling needs.

## Key Concepts

- Monolith — single codebase, single process, single database, in-process calls.
- Microservice — independent codebases/deployments, per-service database, communication via API or events.
- Modular monolith — a monolith with strict internal module boundaries, easy to split later.
- Monolith First / Strangler Fig — the recommended path for moving from a monolith to services.
- Fault isolation vs fault propagation — a microservice failure is contained; a monolith bug can take down the whole app.

## Core Knowledge

Monoliths win on being simple: one codebase, one combined stack trace, easy end-to-end testing, in-process calls with no network delay, and simple ACID transactions against a single database. The weak points show up at scale — the whole app must scale as one unit, a small change forces a full redeploy, the tech stack is locked in, one bug can take down the whole app, and large teams get in each other's way in the same codebase.

Microservices flip these tradeoffs. Each service scales, deploys, and fails on its own, teams own their service end to end, and different services can use different languages or databases (polyglot persistence). The cost is the complexity of distributed systems — network failures, debugging across services, distributed transactions (the Saga pattern, eventual consistency instead of ACID), and a real need for mature CI/CD and monitoring tools.

**Note:** Martin Fowler's "Monolith First" advice is to start as a monolith, since domain boundaries are rarely clear at the start, and a wrong split is costly to undo. The **Strangler Fig Pattern** puts migration into practice: pull out one bounded context as a service, send traffic to it through a proxy, and repeat until the monolith is empty. A **modular monolith** — one deployment, with strict module boundaries — is often the practical middle ground. Stack Overflow shows monoliths can scale; Netflix and Uber show microservices solve team-scaling problems, not just performance ones.

## Interview Questions

**Q: When should a team choose a monolith over microservices?**
A: For startups and MVPs, small teams (under about 10 people), unclear domain boundaries, or when strong ACID transactions matter.

**Q: What is the Strangler Fig Pattern and why use it?**
A: Slowly pulling bounded contexts out of a monolith into services one at a time, using a proxy — this lowers risk compared with a big-bang rewrite.

**Q: Why do large companies favor microservices despite the added complexity?**
A: To solve team-scaling problems — independent teams need to deploy and own their own service, not necessarily to gain raw performance.

## Scenario

A 5-person startup launches an MVP as a single Rails monolith, to move fast while domain boundaries are still unclear. Three years and 40 engineers later, the checkout and inventory modules are now the bottleneck for deploys and scaling. So the team applies the strangler fig pattern — pulling those two bounded contexts out into services behind an API gateway, while the rest of the app stays a modular monolith.

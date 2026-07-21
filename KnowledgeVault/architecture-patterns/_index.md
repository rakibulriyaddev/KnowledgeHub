---
id: architecture-patterns
title: "Architecture Patterns"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, distributed-systems, software-architecture]
parent: system-design
children: [api-gateway, cqrs, esb, event-driven-architecture, event-sourcing, long-polling-ws-sse, message-brokers, monoliths-microservices, n-tier, pub-sub, rest-graphql-grpc]
status: draft
---

## Overview

Architecture patterns describe how a system's services are built and how they talk to each other — right away through APIs, later through queues and events, or somewhere in between. Getting this wrong means either an over-built monolith-turned-microservices mess, or a tightly linked system that can't grow its teams or traffic on their own.

## Key Concepts

- Service structure — monoliths vs. microservices, n-tier
- Same-time (synchronous) talk — REST, GraphQL, gRPC, API gateways
- Live talk — long polling, WebSockets, SSE
- Later (asynchronous) talk — message brokers, pub/sub, event-driven design, event sourcing, CQRS, ESB

## Core Knowledge

Monoliths are simple to build and launch early on but become a slow point as teams and traffic grow; microservices trade that simplicity for scaling and launching parts on their own, at the cost of more work to run. An API gateway gives microservices one front door for routing, login checks, and rate limiting. REST, GraphQL, and gRPC are different ways to do request/response talk at the same time; long polling, WebSockets, and SSE handle cases where the server needs to push updates out. Message brokers and pub/sub keep senders separate from receivers for later workflows, event-driven design builds the whole system around events that get sent out, event sourcing saves state as a list of events instead of a snapshot, and CQRS keeps the read and write models apart so each can grow and change on its own.

## Interview Questions

**Q: Why add an API gateway in a microservices setup?**
A: To give clients one entry point instead of talking to every service directly — gathering login checks, rate limiting, and routing in one place.

**Q: When does event sourcing pay off over saving current state?**
A: When you need a full record of history, the ability to replay/rebuild state, or to support several read models from the same event stream.

**Q: What problem does CQRS solve?**
A: It lets read and write workloads grow and be tuned on their own, since most systems read far more often than they write.

## Scenario

A ride-hailing app uses REST for account management, gRPC for fast internal service-to-service calls, WebSockets to push live driver location to riders, and an event-driven pipeline (through a message broker) to handle finished rides for billing and analytics — no single method fits every need.

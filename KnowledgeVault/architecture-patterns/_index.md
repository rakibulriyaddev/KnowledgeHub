---
id: architecture-patterns
title: "Architecture Patterns"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, distributed-systems, software-architecture]
parent: system-design
children: [api-gateway, cqrs, esb, event-driven-architecture, event-sourcing, long-polling-ws-sse, message-brokers, monoliths-microservices, n-tier, pub-sub, rest-graphql-grpc]
status: draft
---

## Overview

Architecture patterns describe how a system's services are structured and how they talk to each other — synchronously via APIs, asynchronously via queues and events, or somewhere between. Choosing wrong here means either an over-engineered monolith-turned-microservices mess, or a tightly coupled system that can't scale teams or traffic independently.

## Key Concepts

- Service structure — monoliths vs. microservices, n-tier.
- Synchronous communication — REST, GraphQL, gRPC, API gateways.
- Real-time communication — long polling, WebSockets, SSE.
- Asynchronous communication — message brokers, pub/sub, event-driven architecture, event sourcing, CQRS, ESB.

## Core Knowledge

Monoliths are simple to build and deploy early on but become a bottleneck as teams and traffic grow; microservices trade that simplicity for independent scaling and deployment at the cost of operational complexity. An API gateway gives microservices a single front door for routing, auth, and rate limiting. REST, GraphQL, and gRPC are different contracts for synchronous request/response; long polling, WebSockets, and SSE handle cases where the server needs to push updates. Message brokers and pub/sub decouple producers from consumers for async workflows, event-driven architecture builds the whole system around emitted events, event sourcing stores state as a sequence of events rather than a snapshot, and CQRS separates the read and write models so each can scale and evolve independently.

## Interview Questions

**Q: Why introduce an API gateway in a microservices architecture?**
A: To give clients one entry point instead of talking to every service directly — centralizing auth, rate limiting, and routing.

**Q: When does event sourcing pay off over storing current state?**
A: When you need a full audit trail, the ability to replay/rebuild state, or to support multiple read models from the same event stream.

**Q: What problem does CQRS solve?**
A: It lets read and write workloads scale and be optimized independently, since most systems read far more often than they write.

## Scenario

A ride-hailing app uses REST for account management, gRPC for low-latency internal service-to-service calls, WebSockets to push live driver location to riders, and an event-driven pipeline (via a message broker) to process completed rides for billing and analytics — no single protocol fits every need.

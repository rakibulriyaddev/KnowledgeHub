---
id: connection-pooling
title: "Connection Pooling"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, performance]
parent: database
children: []
status: draft
---

# Connection Pooling

## Overview

Connection pooling maintains a reusable set of open database connections instead of opening/closing one per request, since establishing a connection (TCP handshake, auth, session setup) is expensive relative to a typical query. It exists because most databases handle a limited number of concurrent connections efficiently, and per-request connections don't scale under real traffic.

## Key Concepts

- **Pool** — pre-established set of live connections, checked out and returned by callers
- **Pool size** — max concurrent connections held open; bounded by both client and server capacity
- **Checkout / checkin** — borrowing a connection for a unit of work, returning it after
- **Application-side pooling** — pooling inside the app process/library (e.g. HikariCP, most ORM pools)
- **External pooler** — standalone proxy process (PgBouncer, ProxySQL) sitting between app and database
- **Connection exhaustion** — all pooled connections in use, new requests wait or fail

## Core Knowledge

- Opening a raw connection costs real time (TCP + auth + session init) — pooling amortizes that cost across many requests instead of paying it per request
- Process-per-connection engines (e.g. Postgres) have low per-connection concurrency ceilings, making an external pooler (PgBouncer) close to mandatory at scale, not just an optimization
- Pool size isn't "bigger is better" — too many connections can overwhelm the database server itself (memory, context switching), separate from client-side throughput
- Multiple app instances each running their own pool multiply effective connections against the database — aggregate pool size across instances matters, not just per-instance config
- External poolers can multiplex many client connections onto fewer real database connections (transaction/statement pooling modes), but this can break session-level features (prepared statements, session variables) depending on mode
- A connection held too long (leaked, or wrapped around a long transaction) starves the pool for other callers — timeouts and leak detection are necessary safeguards
- Serverless/ephemeral compute (functions scaling to zero and back) stresses traditional pooling models, since each cold instance may try to open fresh connections — this drives specialized poolers for serverless
- Pool exhaustion under load surfaces as request timeouts/errors that look like a database outage but are actually a client-side capacity limit

## Interview Questions

**Q:** Why is opening a new connection per request a scalability problem?
**A:** Each connection setup costs real time and server-side resources; under concurrent load this overhead and the server's connection ceiling become the bottleneck before query execution does.

**Q:** Why is an external pooler like PgBouncer often needed even with application-side pooling?
**A:** Each app instance's pool is independent, so total connections across instances can still exceed what the database handles well — an external pooler consolidates and caps real connections centrally.

**Q:** What's the risk of transaction-mode pooling in an external pooler?
**A:** Session-scoped features like prepared statements or session variables can break, since a logical client connection may be multiplexed across different physical connections between transactions.

**Q:** How does pool exhaustion typically present to an on-call engineer?
**A:** As request timeouts or connection-wait errors that resemble a database outage, but the database itself may be healthy — the bottleneck is the client-side pool's capacity.

## Scenario

A service scales from 5 to 50 instances during a traffic spike, and each instance opens its own 20-connection pool, pushing the database past its connection limit and causing new connections to be refused across the fleet. Introducing an external pooler between the fleet and the database caps real connections centrally while still letting each instance keep its own logical pool, resolving the exhaustion without touching application code.

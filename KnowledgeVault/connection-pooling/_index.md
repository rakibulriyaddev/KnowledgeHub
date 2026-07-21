---
id: connection-pooling
title: "Connection Pooling"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, performance]
parent: database
children: []
status: draft
---

# Connection Pooling

## Overview

Connection pooling keeps a reusable set of open database connections instead of opening and closing a new one for every request, since setting up a connection (TCP handshake, login, session setup) costs a lot compared to a normal query. It exists because most databases only handle a limited number of connections at once well, and opening one per request does not scale under real traffic.

## Key Concepts

- **Pool** — pre-established set of live connections, checked out and returned by callers
- **Pool size** — the most connections held open at once; limited by both the client and the server
- **Checkout / checkin** — borrowing a connection for a unit of work, returning it after
- **Application-side pooling** — pooling inside the app process/library (e.g. HikariCP, most ORM pools)
- **External pooler** — standalone proxy process (PgBouncer, ProxySQL) sitting between app and database
- **Connection exhaustion** — all pooled connections in use, new requests wait or fail

## Core Knowledge

- Opening a raw connection takes real time (TCP + login + session setup) — pooling spreads that cost across many requests instead of paying it every time
- Databases that use one process per connection (like Postgres) can only handle a small number of connections well, which makes an external pooler (PgBouncer) close to required at scale, not just a nice-to-have
- A bigger pool is not always better — too many connections can overload the database server itself (memory, context switching), separately from how much traffic the client can send
- If many app instances each run their own pool, the real number of connections to the database multiplies — the total pool size across all instances matters, not just the setting on one instance
- External poolers can share many client connections across fewer real database connections (using transaction or statement pooling modes), but depending on the mode, this can break session-level features like prepared statements or session variables
- A connection held too long (leaked, or stuck in a long transaction) starves the pool for other callers — timeouts and leak detection are needed to guard against this
- Serverless or short-lived compute (functions that scale down to zero and back) puts stress on normal pooling, since each fresh instance may try to open new connections — this is why special poolers exist for serverless
- When the pool runs out under load, it shows up as request timeouts or errors that look like a database outage, but is really a limit on the client side

## Interview Questions

**Q:** Why is opening a new connection per request a scalability problem?
**A:** Each connection setup costs real time and server resources; under concurrent load, this overhead and the server's connection limit become the bottleneck before query execution even does.

**Q:** Why is an external pooler like PgBouncer often needed even with application-side pooling?
**A:** Each app instance's pool is separate, so the total connections across all instances can still be more than the database handles well — an external pooler brings them together and caps the real connections centrally.

**Q:** What's the risk of transaction-mode pooling in an external pooler?
**A:** Session-level features like prepared statements or session variables can break, since one logical client connection may be spread across different real connections between transactions.

**Q:** How does pool exhaustion typically present to an on-call engineer?
**A:** As request timeouts or connection-wait errors that look like a database outage, but the database itself may be fine — the bottleneck is the client-side pool's limit.

## Scenario

A service scales from 5 to 50 instances during a traffic spike, and each instance opens its own pool of 20 connections, pushing the database past its connection limit and causing new connections to be refused across all instances. Adding an external pooler between the fleet and the database caps the real connections centrally, while each instance still keeps its own logical pool — this fixes the problem without changing any application code.

---
id: rest-graphql-grpc
title: "REST, GraphQL, and gRPC"
created: 2026-07-11
modified: 2026-07-22
tags: [architecture, api-design, web-services, networking]
parent: architecture-patterns
children: []
status: draft
---

## Overview

REST, GraphQL, and gRPC are three API styles that solve the same problem — how clients and services trade data — with different tradeoffs on flexibility, speed, and tooling. Picking the wrong one causes integration pain, so most modern systems mix all three instead of settling on just one.

## Key Concepts

- REST — resource-based URLs, HTTP methods (GET/POST/PUT/DELETE), stateless, JSON/XML, can be cached via HTTP headers.
- GraphQL — one endpoint, client-driven queries, a strongly typed schema, Query/Mutation/Subscription.
- gRPC — Protocol Buffers (binary format) over HTTP/2, schema-first `.proto` contracts, code generation, built-in streaming.
- Over-fetching / under-fetching — REST's main weakness, which GraphQL directly fixes.
- N+1 query problem — GraphQL's common performance trap, fixed with batching/DataLoader.

## Core Knowledge

REST (Roy Fielding, 2000) treats data as resources named by nouns in the URL, using standard HTTP verbs; it's widely used and cacheable, but suffers from over-fetching (getting a whole object when only one field is needed) and under-fetching (needing multiple calls for related data, like a user plus their orders). GraphQL (Facebook, 2015) fixes both by letting the client say exactly which fields it wants from a single, strongly typed endpoint, and adds Subscriptions for real-time push — at the cost of harder HTTP caching, the N+1 query problem, and a steeper learning curve. gRPC (Google, 2015) is a schema-first RPC framework using Protocol Buffers over HTTP/2, giving low latency, code generation in many languages, and four streaming modes — but no built-in browser support, hard-to-read binary payloads, and little HTTP caching.

In practice: REST fits public APIs and standard CRUD where compatibility and caching matter (Twitter, GitHub, Stripe); GraphQL fits mobile/app clients with varied, nested data needs (Facebook, Shopify, Airbnb); gRPC fits internal service-to-service calls needing low latency and high throughput across many languages (Google, Netflix, Uber). **Note:** these aren't either/or — a common mix uses REST or GraphQL on the outside and gRPC on the inside. Wrong ideas to avoid: GraphQL isn't "replacing" REST, gRPC isn't always the fastest choice everywhere, REST isn't limited to JSON, and gRPC fits internal use, not public browser-facing APIs.

## Interview Questions

**Q: What problem does GraphQL solve that REST has?**
A: Over-fetching and under-fetching — the client asks for exactly the fields it needs from one endpoint instead of shaping calls around fixed REST resources.

**Q: Why is gRPC preferred for internal microservice calls?**
A: Binary Protocol Buffers over HTTP/2 give very low latency and high throughput, plus code generation in many languages and built-in streaming.

**Q: Why is caching harder in GraphQL than REST?**
A: A single endpoint with POST-based queries means the URL can't act as a cache key the way separate REST resource URLs can.

## Scenario

A ride-hailing platform offers a public REST API for partner integrations (wide compatibility, easy caching), serves its mobile app through GraphQL so the app only pulls the fields it needs over a slow connection, and connects its internal matching, pricing, and ETA services through gRPC for low-latency, high-throughput streaming.

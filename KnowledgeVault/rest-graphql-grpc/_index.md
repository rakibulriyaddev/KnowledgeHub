---
id: rest-graphql-grpc
title: "REST, GraphQL, and gRPC"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, api-design, web-services, networking]
parent: architecture-patterns
children: []
status: draft
---

## Overview

REST, GraphQL, and gRPC are three API styles solving the same problem — how clients and services exchange data — with different tradeoffs on flexibility, performance, and tooling. Picking the wrong one leads to integration pain, so most modern systems mix all three rather than standardizing on one.

## Key Concepts

- REST — resource-based URLs, HTTP methods (GET/POST/PUT/DELETE), stateless, JSON/XML, cacheable via HTTP headers.
- GraphQL — single endpoint, client-driven queries, strongly typed schema, Query/Mutation/Subscription.
- gRPC — Protocol Buffers (binary) over HTTP/2, schema-first `.proto` contracts, code generation, native streaming.
- Over-fetching / under-fetching — REST's core weakness that GraphQL directly solves.
- N+1 query problem — GraphQL's common performance pitfall, fixed with batching/DataLoader.

## Core Knowledge

REST (Roy Fielding, 2000) models data as resources addressed by nouns in the URL using standard HTTP verbs; it's universal and cacheable, but suffers from over-fetching (a whole object when one field is needed) and under-fetching (multiple calls for related data, e.g. a user plus their orders). GraphQL (Facebook, 2015) fixes both by letting the client specify exactly which fields it wants against a single, strongly typed endpoint, adding Subscriptions for real-time push — at the cost of harder HTTP caching, the N+1 query problem, and a steeper learning curve. gRPC (Google, 2015) is a schema-first RPC framework using Protocol Buffers over HTTP/2, giving low latency, multi-language code generation, and four streaming modes — but no native browser support, hard-to-debug binary payloads, and little HTTP caching.

In practice: REST fits public APIs and standard CRUD where compatibility and caching matter (Twitter, GitHub, Stripe); GraphQL fits mobile/SPA clients with varied, nested data needs (Facebook, Shopify, Airbnb); gRPC fits internal service-to-service calls needing low latency and high throughput in polyglot systems (Google, Netflix, Uber). **Note:** these aren't mutually exclusive — a common hybrid uses REST or GraphQL externally and gRPC internally. Misconceptions: GraphQL isn't "replacing" REST, gRPC isn't automatically fastest everywhere, REST isn't limited to JSON, and gRPC suits internal, not public browser-facing, APIs.

## Interview Questions

**Q: What problem does GraphQL solve that REST has?**
A: Over-fetching and under-fetching — the client requests exactly the fields it needs from one endpoint instead of shaping calls around fixed REST resources.

**Q: Why is gRPC preferred for internal microservice communication?**
A: Binary Protocol Buffers over HTTP/2 give very low latency and high throughput, plus multi-language code generation and native streaming.

**Q: Why is caching harder in GraphQL than REST?**
A: A single endpoint with POST-based queries means the URL can't serve as a cache key the way distinct REST resource URLs can.

## Scenario

A ride-hailing platform exposes a public REST API for third-party partner integrations (wide compatibility, easy caching), serves its mobile app through GraphQL so the app only pulls the fields it needs over constrained bandwidth, and connects its internal matching, pricing, and ETA microservices via gRPC for low-latency, high-throughput streaming.

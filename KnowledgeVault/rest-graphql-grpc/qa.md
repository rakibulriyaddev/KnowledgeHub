---
title: "REST, GraphQL, and gRPC — Q&A"
---

**Q: What is the core idea of REST?**
A: Resource-based, HTTP methods — An architectural style from Roy Fielding.

**Q: Where did GraphQL come from?**
A: Facebook (2015) — Facebook open-sourced GraphQL.

**Q: Where did gRPC come from?**
A: Google — Google created the gRPC framework.

**Q: What is GraphQL's primary advantage?**
A: The client says which fields it needs - no over/under-fetching — Client-driven queries.

**Q: Which data format does gRPC use?**
A: Protocol Buffers (binary) — Protobuf - small, fast binary serialization.

**Q: Which HTTP version does gRPC use?**
A: HTTP/2 — HTTP/2 - multiplexing + streaming.

**Q: Browsers directly support gRPC.**
A: False — gRPC-Web is needed in the browser - direct HTTP/2 control is limited.

**Q: Why does REST need multiple endpoint calls to get the same data?**
A: Resource-based - related data lives at separate endpoints — User + orders needing two endpoints = under-fetching.

**Q: What is a GraphQL Subscription?**
A: Real-time updates - server push — Changes are pushed to the subscription via WebSocket.

**Q: Which of these is an advantage of REST?**
A: Universal HTTP support, cacheable — Browser, curl, and tooling all work with it.

**Q: A mobile app with low bandwidth and varied data needs. Which is better?**
A: GraphQL - client-driven, no over-fetching — GraphQL's strength shows on mobile.

**Q: Internal microservice communication needing high throughput. Which one?**
A: gRPC - binary, fast over HTTP/2 — gRPC is ideal for service-to-service communication.

**Q: You want a public API that's easy for third-party integration. Which one?**
A: REST - universal support — REST = wide compatibility.

**Q: What is GraphQL's N+1 problem?**
A: A nested query → a separate DB query for each item — Solution: DataLoader, batching.

**Q: gRPC streaming supports bidirectional communication.**
A: True — Unary, server-stream, client-stream, bidirectional - four modes.

**Q: Why is caching easier in REST?**
A: HTTP-native - Cache-Control, ETag headers — Standard HTTP cache mechanism.

**Q: Why is caching hard in GraphQL?**
A: Single endpoint - same URL, different query/result — POST-based queries make the URL an inadequate cache key.

**Q: Which is GitHub's modern API?**
A: GraphQL (REST also available) — GitHub GraphQL API v4 (v3 REST is still available).

**Q: A polyglot system (Java + Python + Go) - which API style?**
A: gRPC - multi-language code-gen — gRPC's protobuf generates clients/servers for any language.

**Q: In modern systems, REST/GraphQL/gRPC can all be used together.**
A: True — Public REST, mobile GraphQL, internal gRPC - a common pattern.

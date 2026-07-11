---
title: "REST, GraphQL, and gRPC — Deep Dive"
---

The most common question in API design: REST, GraphQL, or gRPC? Each has a different strength - the wrong choice means an integration nightmare. Let's take a detailed look.

## REST (Representational State Transfer)

**REST** = an architectural style proposed in Roy Fielding's 2000 dissertation. It's resource-based and uses HTTP methods.

### Core principles

- **Resource-based:** URL = noun (e.g., `/users/123`).
- **HTTP methods:** GET, POST, PUT, PATCH, DELETE.
- **Stateless:** Each request is self-contained.
- **JSON/XML:** Standard data format.
- **HATEOAS:** Links to the next action in the response (rare in practice).
- **Cacheable:** HTTP cache headers.

### Example

```
GET /users/123 → Get user
POST /users → Create user
PUT /users/123 → Update user
DELETE /users/123 → Delete
GET /users/123/orders → User's orders
```

### Advantages

- Universal - everyone knows it.
- HTTP-native - browser, curl works.
- Cacheable.
- Stateless = scalable.
- Mature tooling.

### Disadvantages

- Over-fetching: getting the entire user object - when only the name was needed.
- Under-fetching: user + orders needs two endpoint calls.
- Versioning is complex.
- No native real-time support.

## GraphQL

**GraphQL** = created by Facebook (2015) - a query language for APIs. The client says what it wants; the server delivers exactly that.

### Core principles

- **Single endpoint:** `/graphql` - every query goes there.
- **Schema:** Strongly typed; the client knows every field.
- **Query, Mutation, Subscription:** Read, write, real-time.
- **Client-driven:** The client says which fields it needs.

### Example query

```
query {
  user(id: 123) {
    name
    email
    orders {
      id
      total
      product { name }
    }
  }
}

-- Response: only the requested fields.
```

### Advantages

- No over/under-fetching.
- Single endpoint.
- Strongly typed schema.
- Self-documenting.
- Can merge multiple data sources.
- Subscriptions = real-time.
- Frontend autonomy - no backend changes needed.

### Disadvantages

- Caching is complex (single endpoint).
- N+1 query problem.
- Greater complexity.
- Authentication isn't granular.
- File upload is tricky.
- Steep learning curve.

## gRPC

**gRPC** = created by Google (2015) - a high-performance RPC framework. Protocol Buffers + HTTP/2.

### Core principles

- **Protocol Buffers (protobuf):** Binary serialization - small, fast.
- **HTTP/2:** Multiplexing, server push.
- **Schema-first:** Contract defined in a .proto file.
- **Code generation:** Multi-language client/server.
- **Streaming:** Unary, server-stream, client-stream, bidirectional.

### Example .proto

```
service UserService {
  rpc GetUser(UserRequest) returns (User);
  rpc StreamUsers(Empty) returns (stream User);
}

message UserRequest { int32 id = 1; }
message User {
  int32 id = 1;
  string name = 2;
}
```

### Advantages

- Very fast - binary protocol.
- Strongly typed.
- Streaming support.
- Multi-language code-gen.
- HTTP/2 multiplexing.
- Ideal for service-to-service.

### Disadvantages

- No direct browser support (gRPC-Web needed).
- Binary - hard to debug.
- HTTP tooling doesn't work.
- Limited caching.
- Learning curve.

## Comparison

**REST**
- JSON, HTTP/1.1
- Resource-based
- Multiple endpoints
- Easy to start
- Public API standard

**GraphQL**
- JSON, HTTP/1.1
- Query language
- Single endpoint
- Flexible client
- Mobile/SPA-friendly

**gRPC**
- Protobuf, HTTP/2
- RPC-style
- Binary fast
- Service-to-service
- Internal API

## Which one, when?

### REST is good for

- Public API - wide compatibility.
- Standard CRUD.
- When caching is critical.
- Simple resource model.

### GraphQL is good for

- Mobile/SPA - bandwidth-conscious.
- Multiple frontends with varied data needs.
- Complex nested data.
- Rapid frontend evolution.
- Aggregating multiple data sources.

### gRPC is good for

- Microservice-to-microservice.
- When low latency is critical.
- High throughput.
- Streaming data.
- Polyglot systems.

## Real-world examples

- **REST:** Twitter API, GitHub API, Stripe.
- **GraphQL:** Facebook, GitHub (newer), Shopify, Airbnb.
- **gRPC:** Google internal, Netflix, Uber, etcd, Kubernetes internal.

## Mixed Approach

Modern systems often use these together:

- External: REST/GraphQL.
- Internal microservices: gRPC.
- Frontend: GraphQL (with a REST/gRPC backend).

## Common misconceptions

1. **"GraphQL will replace REST":** Different use cases - they coexist.
2. **"gRPC is always fastest":** HTTP/2 is good on the network - but other factors matter too.
3. **"REST = JSON":** XML and HTML are REST too.
4. **"Use gRPC for public APIs":** Browser support is limited.

## Best Practices

- Public/external API: REST by default.
- Internal service-to-service: gRPC.
- Mobile/SPA: GraphQL.
- Versioning must exist - keep the strategy clear.
- Schema-first design - strong typing.
- Auto-generate documentation (OpenAPI, GraphQL introspection).

## Chapter Summary

- REST: standard, simple, for public APIs.
- GraphQL: client-driven, for mobile/SPA.
- gRPC: fast binary, for service-to-service.
- Choose based on use case; they can coexist.
- A hybrid approach is common in modern systems.

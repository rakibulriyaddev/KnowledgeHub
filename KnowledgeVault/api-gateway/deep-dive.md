---
title: "API Gateway — Deep Dive"
---

Suppose your app's backend has 50 microservices. If the mobile app talks to each one separately, auth, retry, and error handling all end up duplicated. The solution: put an **API Gateway** in front; every request arrives there and the gateway forwards it to the right service.

## What Is an API Gateway?

**API Gateway** = a reverse proxy that takes client requests, routes them to multiple backend services, and returns the response to the client. It's a standard pattern in microservice architecture.

## Without an API Gateway

```
[Client]
  ↓ ↓ ↓ ↓ ↓ (50 connections)
[Service 1] [Service 2] [Service 3] ... [Service 50]
```

The problems:
- The client has to know about every service — tight coupling.
- Authentication in every single service.
- Cross-cutting concerns scattered everywhere.
- Network calls multiply.

## With an API Gateway

```
[Client]
  ↓
[API Gateway]
  ↓ ↓ ↓ ↓ ↓
[Service 1] [Service 2] ... [Service 50]
```

## Responsibilities of an API Gateway

### 1. Routing
Forward to the correct service based on URL/header.
- `/api/users/*` → User Service
- `/api/orders/*` → Order Service

### 2. Authentication & Authorization
JWT verification, OAuth — centralized at the gateway.

### 3. Rate Limiting
Per-user, per-IP throttling. DDoS protection.

### 4. Caching
Cache frequent responses.

### 5. Request/Response Transformation
Old client compatibility, format conversion.

### 6. Aggregation
Merges responses from multiple services into a single response (BFF pattern).

### 7. Logging & Monitoring
Centralized request logs, metrics.

### 8. SSL Termination
Terminate HTTPS; the backend speaks plain HTTP.

### 9. Circuit Breaker
Stop routing to a failed service.

### 10. Versioning
Support for v1, v2 APIs.

## BFF Pattern (Backend For Frontend)

A separate gateway for each different client:

```
[Mobile App] → [Mobile BFF] ─┐
[Web App]    → [Web BFF]    ─┼→ [Microservices]
[Smart TV]   → [TV BFF]     ─┘
```

- Each client's needs are different.
- Mobile needs less data; web needs more information.
- The BFF aggregates and tailors the response.

## Popular Tools

- **Kong:** Open-source, plugin-rich.
- **AWS API Gateway:** Managed, serverless integration.
- **Azure API Management:** Enterprise-grade.
- **Google Cloud Apigee:** Full lifecycle management.
- **Tyk:** Open-source, lightweight.
- **Express Gateway:** Node.js based.
- **Spring Cloud Gateway:** Java/Spring.
- **Envoy/Istio:** Also used in service mesh.

## API Gateway vs Load Balancer vs Reverse Proxy

| | Load Balancer | Reverse Proxy | API Gateway |
|---|---|---|---|
| Scope | L4/L7 traffic distribution across identical instances | Request forwarding, caching, SSL — often a single backend | Microservice routing, API-aware |
| Extras | Simple routing, no business logic | NGINX classic | Auth, rate limit, transform, aggregation |

API Gateway = reverse proxy + extra API management features.

## Benefits

- Client simplification — a single endpoint.
- Cross-cutting concerns centralized.
- Flexibility to refactor backend services.
- Centralized security.
- A single point for monitoring.
- Aggregation reduces client roundtrips.

## Challenges

- **Single Point of Failure:** If it goes down, everything goes down. An HA cluster is needed.
- **Performance bottleneck:** All traffic passes through the gateway.
- **Latency:** An extra hop.
- **Complexity:** Configuration management.
- **Coupling risk:** Too much business logic in the gateway = anti-pattern.

## Real-World Examples

- **Netflix Zuul:** Pioneering API gateway.
- **Amazon:** Custom internal gateway + public AWS API Gateway.
- **Uber:** Internal gateway + edge proxy.
- **WeChat:** Massive gateway handling over a billion requests daily.

## Common Misconceptions

1. **"Gateway = ESB":** The gateway is lightweight; an ESB is heavyweight.
2. **"Business logic in the gateway":** Anti-pattern — it should live in the service.
3. **"One gateway for everything":** The BFF pattern suggests using multiple gateways.
4. **"Mandatory":** Overkill for a single-service app.

## Best Practices

- Keep the gateway lightweight — only routing, auth, and cross-cutting concerns.
- Keep business logic in the backend services.
- HA cluster — multiple gateway instances.
- Cache aggressively.
- Configure rate limits per route.
- Use the BFF pattern when you have multiple clients.
- Monitor latency — if the gateway is slow, everything is slow.

## Chapter Summary

- API Gateway = the single front door for microservices.
- Routing, auth, rate limiting, aggregation, monitoring.
- BFF pattern for multiple clients.
- Kong, AWS API Gateway, Tyk — top tools.
- HA + lightweight = success.

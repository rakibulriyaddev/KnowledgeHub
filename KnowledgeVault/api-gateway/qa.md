---
title: "API Gateway — Q&A"
---

**Q: What is the definition of an API Gateway?**
A: A reverse proxy + API management sitting in front of microservices — Single entry point + cross-cutting concerns.

**Q: Which of these is a responsibility of an API Gateway?**
A: Routing, auth, rate limiting, aggregation — Cross-cutting concerns are centralized.

**Q: What is the BFF pattern?**
A: A separate gateway for each different client (Mobile BFF, Web BFF) — Backend For Frontend, client-specific tailoring.

**Q: It's good practice to put all business logic in the API Gateway.**
A: False — Anti-pattern; the gateway should stay lightweight, logic belongs in the service.

**Q: What's the difference between an API Gateway and a Load Balancer?**
A: LB simply distributes traffic; Gateway is API-aware + handles auth/aggregation — The gateway has far more API management features.

**Q: Why put authentication at the gateway?**
A: Centralized — avoids duplicating it in every service — A single point; the services trust it.

**Q: What does rate limiting do?**
A: Throttles requests per user/IP — DDoS protection — Abuse prevention + fair usage.

**Q: What is API aggregation?**
A: Merges responses from multiple services into a single client response — Reduces the client's roundtrips.

**Q: Which of these is a popular open-source API Gateway?**
A: Kong, Tyk, Express Gateway — Top open-source API gateways.

**Q: Netflix's famous API gateway?**
A: Zuul — Zuul is Netflix's pioneering gateway.

**Q: A mobile app has limited bandwidth; the web app needs full data. What strategy fits?**
A: BFF — Mobile BFF returns less data, Web BFF returns more — A classic use case for the BFF pattern.

**Q: The API Gateway goes down. What happens?**
A: All backend access is blocked, so an HA cluster is mandatory — SPOF risk; multiple instances are needed.

**Q: What's the benefit of doing SSL termination at the gateway?**
A: Backend uses plain HTTP — better performance + simplified config — The backend doesn't have to handle SSL.

**Q: An API Gateway is essential for a single-service application.**
A: False — Overkill for a single service; a reverse proxy is enough.

**Q: What's the difference between a Service Mesh and an API Gateway?**
A: Gateway: north-south (client-server); Mesh: east-west (service-service) — Different traffic direction.

**Q: AWS's managed API gateway?**
A: AWS API Gateway — Popular with Lambda integration.

**Q: How would you handle API versioning?**
A: URL path (v1/, v2/) or header-based — route at the gateway — The gateway routes to multiple version-specific backends.

**Q: Why use a circuit breaker at the gateway?**
A: Stop sending requests to a failed service — avoid cascading failure — Resilience pattern, covered in more detail in a later part.

**Q: Which of these is NOT a benefit of an API Gateway?**
A: Always faster — It's an extra hop, sometimes slower, but it offers other benefits.

**Q: In modern microservice architecture, an API Gateway is almost mandatory.**
A: True — Without a gateway, client-side complexity becomes unmanageable.

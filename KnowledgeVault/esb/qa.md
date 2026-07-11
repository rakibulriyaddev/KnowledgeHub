---
title: "Enterprise Service Bus (ESB) — Q&A"
---

**Q: What does ESB stand for?**
A: Enterprise Service Bus.

**Q: What is the main purpose of an ESB?**
A: Central integration of heterogeneous systems — Communication, transformation, and routing across multiple systems.

**Q: What's the problem with spaghetti integration?**
A: Point-to-point connections are N²/2 — unmanageable — N systems → N(N-1)/2 connections, exponential complexity.

**Q: With ESB integration, how many connections do N systems need?**
A: N (everyone connects to the ESB) — Every system → ESB = N connections, not N².

**Q: Which of these is NOT a feature of an ESB?**
A: Database storage — ESB is an integration platform; not database storage.

**Q: Which of these is an ESB product?**
A: MuleSoft, WSO2, IBM Integration Bus — Top ESB products.

**Q: The microservice slogan "smart endpoint, dumb pipe" is the opposite of which ESB-era slogan?**
A: Smart pipes, dumb endpoints — In the ESB era logic lived in the pipe; in microservices, in the endpoint.

**Q: ESB fits well with modern microservices.**
A: False — ESB is centralized; microservices are decentralized, opposite philosophies.

**Q: What's the biggest problem with ESB?**
A: Single Point of Failure + performance bottleneck — All traffic goes through the ESB; disaster if it fails or slows down.

**Q: What's a modern alternative to ESB?**
A: API Gateway + Service Mesh + Kafka — Distributed responsibility, no single bottleneck.

**Q: A Bangladeshi bank has a mainframe core + a modern mobile app + ATM + CRM. What's suitable?**
A: ESB (legacy integration) — Heterogeneous legacy + modern systems, a classic ESB use case.

**Q: A greenfield startup. Should we go with ESB?**
A: No — use a modern alternative (microservices + Kafka + API Gateway) — ESB is overkill and heavy for a new project.

**Q: What's the main difference between ESB and a message broker?**
A: ESB is a full integration platform; a broker is primarily for messaging — A broker is a subset of an ESB; ESB also does transformation and orchestration.

**Q: What is iPaaS?**
A: Integration Platform as a Service — a modern cloud ESB — MuleSoft cloud, Boomi — managed ESB-style integration.

**Q: What is Apache Camel?**
A: A lightweight integration framework (open-source) — A Java-based implementation of Enterprise Integration Patterns (EIP).

**Q: At what level does a Service Mesh operate?**
A: Infrastructure — service-to-service communication — Istio, Linkerd handle network/security in a sidecar proxy.

**Q: How do you migrate from a heavy ESB to microservices?**
A: Gradually — extract feature by feature — Strangler fig pattern; replace incrementally.

**Q: Vendor lock-in is a real concern with ESB.**
A: True — Hard to migrate away from a proprietary ESB.

**Q: Which of these is an advantage of ESB?**
A: Centralized monitoring + standardized adapters — Single visibility, consistent transformation patterns.

**Q: ESB is still widely used in sectors like banking, insurance, and telecom.**
A: True — Heavy legacy + regulatory requirements; ESB persists.

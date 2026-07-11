---
title: "Monoliths vs Microservices — Q&A"
---

**Q: What defines a monolith?**
A: Single codebase + single deployment unit — One codebase, one process, one deployment.

**Q: What defines a microservice?**
A: Split into small independent services, deployed separately — Independent deployment, own DB, communicates via API.

**Q: What's the biggest advantage of a monolith?**
A: Simplicity - easy development, debugging, testing — A single codebase is the simplest.

**Q: What's the biggest advantage of microservices?**
A: Independent scaling, deployment, fault isolation — Each service scales and deploys independently.

**Q: What's the deployment problem with a monolith?**
A: One small change = redeploy the entire app — Coupled deployment - even a small change has big consequences.

**Q: What's the biggest challenge with microservices?**
A: Distributed system complexity (network, debugging, transactions) — Network, distributed transactions, observability - all become hard.

**Q: Microservices are always better than a monolith.**
A: False — It depends on the use case. A monolith is often better for small projects.

**Q: Which architect gives the "Monolith First" advice?**
A: Martin Fowler — Martin Fowler - start with a monolith, extract later.

**Q: What is the Strangler Fig Pattern?**
A: Gradual extraction - new services "strangle" the old code — Incremental migration - feature by feature.

**Q: What is a Modular Monolith?**
A: A monolith with strict internal module boundaries - easy to split later — Single deployment + clean boundaries = best of both.

**Q: A 5-person startup wants to launch an MVP. Architecture?**
A: Monolith - for speed — Small team + unclear domain - a monolith is faster.

**Q: A company with 50 teams, like Netflix. Architecture?**
A: Microservice - team autonomy + scale — Independent teams own independent services.

**Q: Which company is a famous monolith?**
A: Stack Overflow — Stack Overflow - a famous successful monolith, high traffic, simple.

**Q: What's a mandatory prerequisite for microservices?**
A: Strong DevOps/CI-CD culture — Managing many services requires CI/CD and monitoring lifecycle.

**Q: Multi-service ACID transactions are trivial in microservices.**
A: False — Distributed transactions are hard - Saga pattern, eventual consistency.

**Q: Which of these is NOT an advantage of a monolith?**
A: Independent service scaling — Independent scaling is a strength of microservices.

**Q: A growing app is a bloated monolith. What's the first step?**
A: Modular monolith → identify boundaries → strangler fig — A gradual approach - minimize risk.

**Q: What's the DB design in microservices?**
A: Database per service (federation) — Each service has its own DB - avoids coupling.

**Q: Microservices have low operational overhead.**
A: False — Many deployment units, monitoring, network - overhead is higher.

**Q: What's Spotify's organizational pattern for microservices?**
A: Squad-based - small autonomous teams — The squad model - medium-sized teams, full feature ownership.

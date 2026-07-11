---
title: "Monoliths vs Microservices — Deep Dive"
---

Say you're building a big house: one giant hall room where everything happens — eating, sleeping, working — all in one? Or separate bedrooms, a kitchen, an office room? The first is a **monolith**, the second is a **microservice**. Both have their place — but which one, and when?

## What is a monolith?

**Monolithic Architecture** = the entire application is a single codebase, a single deployment unit, a single process. All functionality (UI, business logic, DB access) lives together.

### Structure

```
[Single Application]
  ├── User module
  ├── Product module
  ├── Order module
  ├── Payment module
  ├── Inventory module
  └── Notification module
       ↓
  [Single Database]
```

## What is a microservice?

**Microservices Architecture** = the application is split into small, independent services. Each service:

- Has a single responsibility.
- Has its own codebase and deployment.
- Has its own database (preferably).
- Communicates via API/events.

```
[User Service] [Product Service] [Order Service]
      ↓               ↓                ↓
   [User DB]     [Product DB]     [Order DB]
      ↑               ↑                ↑
      └──── [ API Gateway / Message Broker ] ────┘
```

## Detailed comparison

**Monolith**
- Single codebase
- One deployment
- One DB
- Internal call (in-process)
- Tech stack lock-in
- Simple debugging
- Slow scaling
- One bug → entire app down

**Microservices**
- Multiple codebases
- Independent deployments
- Per-service DB
- Network call
- Polyglot — different tech
- Distributed debugging
- Independent scaling
- Fault isolation

## Advantages of a monolith

- **Simple development:** One codebase, easy navigation.
- **Easy debugging:** Single process, integrated stack trace.
- **Performance:** In-process calls — no network latency.
- **ACID transactions:** Single DB — easy.
- **Easy testing:** End-to-end tests are simple.
- **Low operational overhead:** One deployment.
- **Less DevOps complexity.**

## Disadvantages of a monolith

- **Scaling is difficult:** The whole app has to scale together.
- **Slow deployment:** One small change = full redeploy.
- **Tech lock-in:** A single tech stack across the whole app.
- **Fault impact:** One bug = entire app down.
- **Team coordination:** Codebase conflicts in a big team.
- **Codebase complexity:** The monolith bloats over time.

## Advantages of microservices

- **Independent scaling:** Scale only the hot service.
- **Independent deployment:** Others stay untouched when one service changes.
- **Tech diversity:** Best tool per service.
- **Fault isolation:** One service fails = others continue.
- **Team autonomy:** Each team owns a service end-to-end.
- **Faster development:** Small codebase per service.
- **Polyglot persistence:** Different DB per need.

## Disadvantages of microservices

- **Distributed complexity:** Network failures, latency.
- **Operational overhead:** Many deployments, monitoring.
- **Distributed transactions:** Saga, eventual consistency.
- **Debugging:** Cross-service tracing is hard.
- **Complex testing:** End-to-end testing is challenging.
- **DevOps requirement:** CI/CD, K8s, observability tooling.
- **High initial cost:** Infrastructure + organizational effort.

## When to use which?

### Monolith is good when:

- Startup/MVP — fast launch.
- Small team (fewer than ~10).
- Application boundaries are unclear.
- Domain is simple.
- Limited scale needs.
- Strong ACID transaction requirements.

### Microservices are good when:

- The application is large with a complex domain.
- Big team (multiple teams).
- Different features need different scaling.
- Tech diversity is needed.
- High availability is required.
- Frequent deployments.

## Migration Strategy

### Monolith First (Recommended)

Martin Fowler's advice — start with a monolith, extract services later.

Reason: domain boundaries aren't clear at first; a wrong split is disastrous.

### Strangler Fig Pattern

Gradually add new services around the old monolith — "strangling" the old code.

1. Identify a bounded context.
2. Extract one module — make it a service.
3. Redirect traffic (proxy).
4. Repeat — until the monolith is empty.

## Modular Monolith — Middle Ground

A monolith, but well-organized:

- Single deployment.
- Strict internal module boundaries.
- Each module has its own DB tables.
- Easy to extract later.

In many cases — a modular monolith is better than microservices.

## Real-world examples

### Successful as a monolith

- **Stack Overflow:** A famous monolith — high traffic, simple architecture.
- **GitHub:** A Rails monolith (initially).
- **Basecamp:** The Rails "majestic monolith".

### Went to microservices

- **Netflix:** Pioneers — 700+ microservices.
- **Amazon:** Hundreds of services.
- **Uber:** 2200+ microservices (later consolidated some).
- **Spotify:** Squad-based microservices.

## Common misconceptions

1. **"Microservices are always better":** No — a disaster for small projects.
2. **"Microservices = scalable":** Monoliths can scale too (Stack Overflow proves it).
3. **"Big companies use microservices":** Big companies use microservices because of their team-scaling problems.
4. **"Microservice migration is easy":** Years of effort + many failures.

## Best Practices

- Start with a monolith (or modular monolith).
- Identify boundaries using Domain-Driven Design (DDD).
- Verify DevOps maturity before moving to microservices.
- Use the strangler fig pattern — gradual migration.
- Microservices = team autonomy + scale; don't chase them for their own sake otherwise.
- Observability (logging, tracing, metrics) — critical in microservices.

## Chapter summary

- Monolith: single codebase + single deployment. Simple, fast, but challenging for scaling/teams.
- Microservice: small independent services. Flexible, scalable, but complex.
- Start with a monolith → extract services later (strangler fig).
- Modular monolith is often the best balance.
- Basis for choosing: team size, domain complexity, scale needs.

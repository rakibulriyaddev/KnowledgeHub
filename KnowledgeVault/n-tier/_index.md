---
id: n-tier
title: "N-tier Architecture"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, layered-design, scalability, web-applications]
parent: architecture-patterns
children: []
status: draft
---

## Overview

N-tier architecture splits software into N logical layers — commonly presentation, application/logic, and data — each with a distinct responsibility and a defined interface to the next. It is the default structure behind most web applications; "tier" is the physical-deployment cousin of "layer."

## Key Concepts

- Layer vs Tier — layer is logical code organization; tier is physical deployment (separate servers).
- 1-tier — everything in one executable (e.g., MS Word); no multi-user support.
- 2-tier (client-server) — client + database server; logic spread across both, hard to update.
- 3-tier — presentation, application/logic, data; the web-app standard.
- 4/N-tier — adds a web tier (NGINX/reverse proxy), CDN, load balancer, API gateway, microservices, cache.
- Anti-patterns — layer skipping, logic in UI, logic in DB (stored procedures), tight coupling.

## Core Knowledge

In 3-tier architecture, the **presentation tier** is the UI (browser, mobile, React/Vue/Angular) with no business logic; the **application/logic tier** holds business rules, validation, authentication, and workflow (Node.js, Django, Spring); the **data tier** handles persistence — RDBMS, NoSQL, cache, file storage. This split gives separation of concerns, independent scaling (only the hot tier needs more capacity), reusability (one API serves web and mobile), and better security (the database sits behind the API, never exposed directly).

Modern systems extend this into 4-tier or N-tier setups — a web tier (NGINX/Apache for static content, SSL, routing) in front of the application tier, or a chain like CDN → load balancer → web tier → API gateway → microservices → cache → DB. N-tier maps onto MVC too: View → presentation, Controller → application tier entry point, Model → data-access logic. **Caution:** common anti-patterns are layer skipping (UI calling the DB directly), logic bleeding into the UI or DB stored procedures, and tight coupling — more tiers isn't automatically better, since each hop adds network overhead. A stateless application tier is best practice, letting any instance handle any request for easy horizontal scaling.

## Interview Questions

**Q: What is the difference between a tier and a layer?**
A: A layer is a logical code separation (can run on one machine); a tier is a physical separation — a distinct deployment unit on its own server.

**Q: Why is putting business logic in the presentation tier an anti-pattern?**
A: It duplicates logic across UIs and is hard to maintain — logic belongs in the application tier so all clients share one source of truth.

**Q: How do microservices relate to N-tier?**
A: Microservices extend N-tier, adding functional decomposition on top of the same layered separation of presentation, logic, and data.

## Scenario

A banking system serves both a mobile app and a web client through the same API gateway and business-logic tier, which enforces transaction rules and talks to an Oracle database tier — when the logic tier gets busy during peak hours, the team scales only that tier horizontally, leaving the presentation and data tiers untouched.

---
id: facade-pattern
title: "Facade Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Facade provides a simplified, unified interface over a complex subsystem of classes, hiding internal complexity from client code. It doesn't add new capability — it packages existing subsystem operations behind an easier entry point.

## Key Concepts
- Facade class — the single simplified entry point client code interacts with
- Subsystem classes — the complex internals the facade coordinates, still usable directly if needed
- Reduced coupling — clients depend on the facade, not on every subsystem class individually
- Layering — facades often mark boundaries between architectural layers or modules

## Core Knowledge
- Facade doesn't prevent direct access to subsystem classes — it's an optional convenience layer, not an encapsulation enforcement mechanism
- Reduces coupling between client code and a subsystem's internal structure, so subsystem internals can be refactored with less client-facing impact
- Different from Adapter — Facade simplifies an interface that's complex but not necessarily incompatible; Adapter specifically fixes an interface mismatch
- Common at module/library boundaries — a public API class that internally orchestrates many private collaborators
- Overuse risk: a facade that grows to expose every subsystem operation eventually becomes just as complex as the subsystem itself ("god facade")
- Multiple facades can coexist over the same subsystem for different client needs (e.g. an admin facade vs a end-user facade)
- Pairs naturally with layered architecture — each layer exposing a facade to the layer above hides its internal composition

## Interview Questions
**Q:** What is Facade's main purpose?
**A:** To provide a simple, unified interface over a complex subsystem, reducing how much client code needs to know about that subsystem's internals.

**Q:** Does Facade prevent direct access to subsystem classes?
**A:** No — it's an optional simplified entry point; subsystem classes generally remain accessible directly if a client needs finer control.

**Q:** How does Facade differ from Adapter?
**A:** Facade simplifies an interface that's complex, not necessarily incompatible; Adapter specifically bridges an interface mismatch between a client and an existing class.

**Q:** What's a risk of an overgrown facade?
**A:** It can accumulate so many responsibilities and exposed operations that it becomes as complex as the subsystem it was meant to simplify.

## Scenario
Starting a video conversion involves configuring a codec, demuxer, audio processor, and output writer across several classes with a specific initialization order. A `VideoConverterFacade.convert(file, format)` method hides that orchestration behind one call, while advanced users needing fine-grained control can still use the underlying classes directly.

---
id: facade-pattern
title: "Facade Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Facade gives a simple, single interface over a complex subsystem of classes, hiding the internal complexity from client code. It does not add any new ability — it just packages existing subsystem operations behind an easier entry point.

## Key Concepts
- Facade class — the single simplified entry point client code interacts with
- Subsystem classes — the complex internals the facade coordinates, still usable directly if needed
- Reduced coupling — clients depend on the facade, not on every subsystem class individually
- Layering — facades often mark boundaries between architectural layers or modules

## Core Knowledge
- Facade does not stop direct access to subsystem classes — it is an optional convenience layer, not a way of forcing encapsulation
- It reduces coupling between client code and a subsystem's internal structure, so the subsystem's internals can be changed with less impact on clients
- It differs from Adapter — Facade simplifies an interface that is complex but not necessarily a mismatch; Adapter specifically fixes an interface mismatch
- Common at the edge of a module or library — a public API class that internally coordinates many private helper classes
- Risk of overuse: a facade that grows to expose every subsystem operation ends up as complex as the subsystem itself (a "god facade")
- Several facades can exist over the same subsystem for different client needs (for example, an admin facade and a separate end-user facade)
- Pairs naturally with layered architecture — each layer showing a facade to the layer above hides how it is built inside

## Interview Questions
**Q:** What is Facade's main purpose?
**A:** To give a simple, single interface over a complex subsystem, so client code needs to know much less about that subsystem's internals.

**Q:** Does Facade prevent direct access to subsystem classes?
**A:** No — it is an optional, simplified entry point. Subsystem classes usually stay directly accessible if a client needs finer control.

**Q:** How does Facade differ from Adapter?
**A:** Facade simplifies an interface that is complex, not necessarily incompatible; Adapter specifically bridges a mismatch between a client and an existing class.

**Q:** What's a risk of an overgrown facade?
**A:** It can pile up so many responsibilities and exposed operations that it becomes just as complex as the subsystem it was meant to simplify.

## Scenario
Starting a video conversion means setting up a codec, demuxer, audio processor, and output writer, spread across several classes with a specific setup order. A `VideoConverterFacade.convert(file, format)` method hides all that coordination behind one call, while advanced users who need fine control can still use the underlying classes directly.

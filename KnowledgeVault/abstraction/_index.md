---
id: abstraction
title: "Abstraction"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, interface-design]
parent: oop
children: []
status: draft
---

## Overview
Abstraction means modeling only the properties of a concept that matter for the problem at hand, and hiding everything else behind a simpler interface. It's the design goal that encapsulation implements — deciding *what* to expose, while encapsulation enforces *how* it stays hidden.

## Key Concepts
- Essential vs incidental complexity — abstraction strips away detail irrelevant to the caller's purpose
- Interfaces and abstract classes — the primary language tools for expressing an abstraction
- Levels of abstraction — a system is a stack of them, each hiding the layer below
- Abstraction vs encapsulation — a design decision vs the mechanism that enforces it
- Leaky abstractions — when hidden details surface anyway and break the simplification

## Core Knowledge
- Abstraction is a modeling decision made before any code — encapsulation is the implementation technique that protects it
- A good abstraction picks the smallest interface that fully captures the caller's needs — over-abstracting adds indirection with no payoff
- "All non-trivial abstractions are leaky to some degree" — e.g. network calls behind a method signature can still time out
- Abstraction layers let large systems be reasoned about locally — a caller trusts the interface without knowing the implementation
- Premature abstraction (guessing at future variation) is as costly as no abstraction — YAGNI applies here directly
- Abstract classes bundle partial implementation with a contract; interfaces are pure contracts — the choice shapes how much is hidden vs shared
- Too many abstraction layers slow debugging — each layer must be mentally unwound to find where a bug actually lives
- Good abstractions are discovered from real duplicate concrete cases, not designed speculatively upfront

## Interview Questions
**Q:** What's the difference between abstraction and encapsulation?
**A:** Abstraction is the design decision of what to expose and what to hide; encapsulation is the mechanism (access modifiers, bundling) that enforces it.

**Q:** What is a "leaky abstraction"?
**A:** An abstraction that hides implementation details in the common case, but lets those details surface under certain conditions — e.g. an ORM hiding SQL until a slow query forces you to reason about it anyway.

**Q:** Why can too much abstraction hurt a codebase?
**A:** Extra indirection layers make code harder to trace and debug, and often exist to support flexibility that's never actually used.

**Q:** How do you decide the right level of abstraction for an interface?
**A:** Base it on actual, observed variation in concrete implementations rather than speculation — abstract only what genuinely differs.

## Scenario
A reporting module needs to fetch data from either a SQL database or a REST API depending on deployment. Defining a `DataSource` abstraction with a single `fetch()` method lets the reporting logic stay unaware of which concrete source is behind it, so a new source type can be added without touching any report code.

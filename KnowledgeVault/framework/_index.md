---
id: framework
title: "Framework"
created: 2026-06-19
modified: 2026-06-19
tags: [programming, architecture]
parent: null
children: [dotnet]
---

# Framework

A **software framework** is a reusable, semi-complete foundation that provides structure, conventions, and tools for building applications. Unlike a library — which your code calls on demand — a framework calls your code through predefined extension points. This reversal is known as the *inversion of control* principle: "don't call us, we'll call you."

Frameworks reduce boilerplate, enforce consistent patterns across a codebase, and let teams focus on domain logic rather than infrastructure plumbing.

## Key concepts

- **Inversion of Control (IoC)** — the framework owns the main loop; your code plugs in at hooks
- **Convention over configuration** — sensible defaults minimize setup decisions
- **Extension points** — callbacks, overrides, or middleware where custom code runs
- **Opinionated vs. unopinionated** — Rails constrains choices tightly; Express leaves them open
- **Full-stack vs. domain-specific** — some cover the whole app lifecycle, others just one layer (ORM, DI, testing)
- **Lifecycle management** — frameworks typically control initialization, request handling, and teardown

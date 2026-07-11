---
id: strategy-pattern
title: "Strategy Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Strategy defines a family of interchangeable algorithms, encapsulates each one behind a common interface, and lets the client select or swap which one to use at runtime. It's the canonical fix for growing conditional logic that branches on algorithm variant.

## Key Concepts
- Strategy interface — the common contract all algorithm variants implement
- Concrete strategies — each interchangeable algorithm implementation
- Context — the class using a strategy, holding a reference to the current one
- Runtime selection — the strategy can be swapped at any point, not fixed at compile time

## Core Knowledge
- Strategy is the standard fix for `if/else` or `switch` chains branching on algorithm type — each branch becomes its own strategy class instead
- It's a direct Open/Closed Principle application — adding a new algorithm means adding a new strategy class, no changes to the context
- In languages with first-class functions, Strategy often needs no formal class hierarchy — a function reference passed to the context achieves the same result
- Context delegates entirely to the current strategy — it shouldn't contain algorithm-specific logic itself, only orchestration
- Differs structurally from State in intent, not shape — Strategy is chosen explicitly by the client; State transitions are driven internally by the object's own logic
- Overuse for a single, unlikely-to-change algorithm adds unnecessary indirection — Strategy pays off specifically when multiple interchangeable variants genuinely exist or are expected
- Testability benefit — each strategy can be unit tested in isolation, and the context can be tested with a mock/stub strategy

## Interview Questions
**Q:** What problem does Strategy solve?
**A:** It replaces conditional branching on algorithm type with polymorphism, letting new algorithms be added without modifying existing code (an OCP application).

**Q:** How does Strategy differ from State, given their nearly identical class structure?
**A:** Strategy is selected explicitly by the client based on external choice; State changes automatically based on the object's own internal transitions, often without the client's direct involvement.

**Q:** Do you always need a formal Strategy class hierarchy?
**A:** No — in languages with first-class functions, passing a function or lambda as the "strategy" achieves the same decoupling without formal classes.

**Q:** Give a concrete example of Strategy.
**A:** A shipping cost calculator with `StandardShipping`, `ExpressShipping`, and `FreightShipping` strategies, each implementing `calculateCost(order)` — the checkout context picks one at runtime without branching internally.

## Scenario
A file compressor needs to support ZIP, GZIP, and RAR formats, and the algorithm to use is chosen per file at runtime based on user preference. Each format is implemented as a `CompressionStrategy`, and the compressor context simply delegates to whichever strategy was selected — adding a new format later needs only a new strategy class, no changes to the compressor itself.

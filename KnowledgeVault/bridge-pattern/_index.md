---
id: bridge-pattern
title: "Bridge Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Bridge decouples an abstraction from its implementation so the two can vary independently, splitting what would be one combined inheritance hierarchy into two separate ones connected by composition. It's designed upfront, unlike Adapter which retrofits compatibility after the fact.

## Key Concepts
- Abstraction — the high-level control layer defining operations in terms of the implementor
- Refined abstraction — subclasses extending the abstraction with more specific behavior
- Implementor interface — the low-level operations the abstraction delegates to
- Concrete implementors — actual platform/technology-specific implementations

## Core Knowledge
- Bridge prevents the "class explosion" of combining M abstractions × N implementations into M×N subclasses — instead M+N classes connected via composition
- The abstraction holds a reference to an implementor and delegates to it, rather than inheriting implementation details directly
- Both hierarchies (abstraction and implementor) can be extended independently — adding a new abstraction subtype or a new implementor doesn't multiply existing classes
- Bridge vs Adapter — Bridge is planned upfront to let two hierarchies evolve separately; Adapter is applied after the fact to make an existing incompatible class fit
- Common in cross-platform code — a `Shape` abstraction bridged to a `Renderer` implementor (OpenGL, DirectX, software) lets shapes and renderers vary independently
- Adds indirection that's only worth it when both sides genuinely need independent extension — for a fixed, small combination set it's unnecessary complexity
- GUI toolkit "look and feel" separation (widget abstraction vs OS-native rendering implementor) is a classic textbook example

## Interview Questions
**Q:** What problem does Bridge solve?
**A:** It prevents a combinatorial class explosion when both an abstraction and its implementation need to vary independently, by connecting them via composition instead of a single inheritance hierarchy.

**Q:** How is Bridge different from Adapter?
**A:** Bridge is designed upfront so abstraction and implementation evolve independently; Adapter is applied retroactively to make an already-existing incompatible interface work with a client.

**Q:** Give a concrete example of the class explosion Bridge avoids.
**A:** Without Bridge, M shape types × N rendering APIs would need M×N subclasses; Bridge needs only M abstraction classes and N implementor classes, connected by composition.

**Q:** When is Bridge unnecessary?
**A:** When only one side (abstraction or implementation) is expected to vary, or the combination set is small and fixed — the added indirection isn't worth it.

## Scenario
A drawing application needs shapes (`Circle`, `Square`) rendered via different backends (vector, raster) without multiplying classes for every shape-backend combination. Bridge connects a `Shape` abstraction to a `Renderer` implementor interface — adding a new shape or a new renderer backend each requires only one new class, not a new class per combination.

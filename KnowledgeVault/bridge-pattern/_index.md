---
id: bridge-pattern
title: "Bridge Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Bridge separates an abstraction from how it's built, so the two can change on their own — splitting what would be one combined inheritance tree into two separate ones linked by composition. It's planned upfront, unlike Adapter, which is added later to fix compatibility.

## Key Concepts
- Abstraction — the high-level control layer that defines actions in terms of the implementor
- Refined abstraction — subclasses that extend the abstraction with more specific behavior
- Implementor interface — the low-level actions the abstraction hands off to
- Concrete implementors — the actual platform/technology-specific versions

## Core Knowledge
- Bridge stops the "class explosion" of combining M abstractions × N implementations into M×N subclasses — instead there are M+N classes linked through composition
- The abstraction holds a reference to an implementor and hands work off to it, instead of inheriting the implementation details directly
- Both trees (abstraction and implementor) can grow on their own — adding a new abstraction subtype or a new implementor doesn't multiply the existing classes
- Bridge vs Adapter — Bridge is planned upfront so two trees can grow apart from each other; Adapter is added later to make an already-existing mismatched class fit
- Common in cross-platform code — a `Shape` abstraction linked to a `Renderer` implementor (OpenGL, DirectX, software) lets shapes and renderers change on their own
- Adds indirection that's only worth it when both sides truly need to grow on their own — for a fixed, small set of combos it's needless complexity
- GUI toolkit "look and feel" separation (widget abstraction vs OS-native drawing implementor) is a classic textbook example

## Interview Questions
**Q:** What problem does Bridge solve?
**A:** It stops a huge growth in classes when both an abstraction and how it's built need to change on their own, by linking them through composition instead of one inheritance tree.

**Q:** How is Bridge different from Adapter?
**A:** Bridge is planned upfront so the abstraction and its implementation grow apart from each other; Adapter is added after the fact to make an already-mismatched interface work with a client.

**Q:** Give a real example of the class explosion Bridge avoids.
**A:** Without Bridge, M shape types × N drawing APIs would need M×N subclasses; Bridge needs only M abstraction classes and N implementor classes, linked by composition.

**Q:** When is Bridge not needed?
**A:** When only one side (abstraction or implementation) is expected to change, or the set of combos is small and fixed — the extra indirection isn't worth it.

## Scenario
A drawing application needs shapes (`Circle`, `Square`) drawn through different backends (vector, raster) without multiplying classes for every shape-backend combo. Bridge links a `Shape` abstraction to a `Renderer` implementor interface — adding a new shape or a new drawing backend each needs only one new class, not a new class per combo.

---
id: oop
title: "Object-Oriented Programming"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, paradigm, software-design]
parent: null
children: [design-patterns, solid-principles, encapsulation, polymorphism, inheritance, abstraction]
status: draft
---

## Overview
Object-Oriented Programming (OOP) is a paradigm that models software as interacting objects — bundles of state and behavior — rather than as a sequence of procedures acting on data. It underlies most mainstream enterprise languages (Java, C#, C++, Python) and gives rise to the vocabulary (classes, interfaces, polymorphism) that design patterns and SOLID principles build on.

## Key Concepts
- Encapsulation — bundling state with the behavior that operates on it, hiding internals behind an interface
- Inheritance — reusing and specializing behavior through a type hierarchy
- Polymorphism — one interface, many implementations, resolved at compile- or run-time
- Abstraction — modeling only the relevant properties of a real-world concept
- Composition vs inheritance — assembling behavior from parts vs extending a base type

## Core Knowledge
- "Favor composition over inheritance" — deep inheritance hierarchies are brittle and hard to change; composition is more flexible
- Polymorphism comes in two flavors — subtype (interface/virtual dispatch) and parametric (generics) — interviews usually mean the former
- Encapsulation is about invariants, not just making fields private — a getter/setter pair on every field defeats the purpose
- The "fragile base class" problem — changing a base class can silently break subclasses that depend on its implementation details
- OOP and functional programming aren't mutually exclusive — modern languages mix objects with immutability and first-class functions
- Interfaces define a contract without implementation; abstract classes can share partial implementation — choice affects extensibility
- Overuse of inheritance for code reuse (rather than true "is-a" relationships) is a common design smell
- SOLID principles and GoF design patterns exist specifically to keep OOP codebases maintainable as they grow

## Interview Questions
**Q:** What are the four pillars of OOP?
**A:** Encapsulation, inheritance, polymorphism, abstraction.

**Q:** When would you choose composition over inheritance?
**A:** When the relationship is "has-a" rather than "is-a", or when you need to change behavior at runtime — composition avoids locking a class into a rigid hierarchy.

**Q:** What's the difference between an abstract class and an interface?
**A:** An abstract class can hold shared state and partial implementation; an interface defines a pure contract with no implementation (default methods aside) and supports multiple inheritance of type.

**Q:** What's the fragile base class problem?
**A:** A change to a base class's internals breaks derived classes that implicitly relied on its old behavior, even though the public contract didn't change.

## Scenario
A team building a shape-drawing app starts with a `Shape` base class holding a `draw()` method, then keeps adding subclasses and special-casing behavior as new shape types arrive, and the hierarchy grows tangled. Recognizing the need for per-shape behavior without rigid subclassing points toward composing shapes from smaller behaviors (e.g. a `Renderer` strategy) instead of deepening the inheritance tree.

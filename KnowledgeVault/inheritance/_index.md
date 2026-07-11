---
id: inheritance
title: "Inheritance"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, composition]
parent: oop
children: []
status: draft
---

## Overview
Inheritance lets a class derive state and behavior from a base class, expressing an "is-a" relationship and enabling code reuse and polymorphic substitution. It's one of the oldest OOP mechanisms but also one of the most misused, which is why "favor composition over inheritance" became a standard guideline.

## Key Concepts
- "Is-a" vs "has-a" — inheritance models is-a; composition models has-a
- Single vs multiple inheritance — most mainstream languages restrict class inheritance to single, using interfaces for multiple contracts
- Method overriding vs overloading — overriding replaces base behavior; overloading adds a same-named method with a different signature
- Abstract base classes — provide partial shared implementation plus a contract subclasses must complete
- Fragile base class problem — changes to a base class's internals can silently break subclasses

## Core Knowledge
- Deep inheritance hierarchies are hard to reason about and refactor — every level adds coupling between base and derived behavior
- Inheritance for pure code reuse (no true is-a relationship) is a classic anti-pattern — composition achieves reuse without the coupling
- Liskov Substitution Principle is the formal rule for whether an inheritance relationship is sound — a subtype must be usable anywhere the base type is expected
- Constructors aren't inherited — each subclass must explicitly initialize or delegate to the base class constructor
- Overriding a method can unintentionally change behavior relied on elsewhere — the fragile base class problem
- Multiple inheritance of implementation causes the diamond problem — most languages avoid it, allowing multiple interface inheritance instead
- "Sealed"/"final" classes exist specifically to prevent inheritance where a fragile hierarchy would otherwise result
- Modern guidance defaults to composition; inheritance is reserved for genuine, stable is-a relationships (e.g. a UI widget hierarchy)

## Interview Questions
**Q:** When should you use inheritance vs composition?
**A:** Inheritance when there's a genuine, stable is-a relationship and shared behavior naturally belongs in a base type; composition when you need to reuse or swap behavior flexibly, or when the relationship is has-a.

**Q:** What is the diamond problem?
**A:** Ambiguity arising when a class inherits the same method from two base classes via multiple inheritance — the compiler can't determine which implementation to use. Solved by disallowing multiple class inheritance (only interfaces) in most languages.

**Q:** What's the fragile base class problem?
**A:** Changing a base class's implementation (even without changing its public contract) can break derived classes that implicitly depended on the old behavior.

**Q:** Why doesn't a subclass inherit its base class's constructors?
**A:** Construction is type-specific setup; each subclass must define its own constructor and explicitly call the base constructor to initialize inherited state.

## Scenario
A `Bird` base class has a `fly()` method, and a `Penguin` subclass is forced to override it to throw an exception since penguins can't fly — a classic Liskov Substitution violation. Restructuring so `fly()` lives only in a `FlyingBird` interface (or is delegated to a composed behavior) rather than the shared `Bird` base avoids forcing an invalid capability onto every subclass.

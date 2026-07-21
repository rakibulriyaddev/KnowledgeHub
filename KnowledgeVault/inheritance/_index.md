---
id: inheritance
title: "Inheritance"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, composition]
parent: oop
children: []
status: draft
---

## Overview
Inheritance lets a class take on state and behavior from a base class, showing an "is-a" link and letting code be reused and swapped in and out. It's one of the oldest OOP tools but also one of the most misused, which is why "favor composition over inheritance" became a common rule.

## Key Concepts
- "Is-a" vs "has-a" — inheritance models is-a; composition models has-a
- Single vs multiple inheritance — most common languages only allow single class inheritance, using interfaces for more than one contract
- Method overriding vs overloading — overriding replaces base behavior; overloading adds a same-named method with different inputs
- Abstract base classes — give some shared code plus a contract that subclasses must finish
- Fragile base class problem — changes inside a base class can quietly break subclasses

## Core Knowledge
- Deep chains of inheritance are hard to follow and change — every added level links base and derived behavior more tightly
- Using inheritance just to reuse code (with no real is-a link) is a classic mistake — composition gives you reuse without the tight link
- The Liskov Substitution Principle is the formal rule for whether an inheritance link is sound — a subtype must work anywhere the base type is expected
- Constructors are not inherited — each subclass must set itself up, or pass the work to the base class constructor
- Overriding a method can change behavior other code relies on without meaning to — the fragile base class problem
- Multiple inheritance of code causes the diamond problem — most languages avoid it, allowing multiple interface inheritance instead
- "Sealed"/"final" classes exist just to stop inheritance where it would create a fragile chain
- Modern advice defaults to composition; inheritance is kept for real, steady is-a links (like a UI widget family)

## Interview Questions
**Q:** When should you use inheritance vs composition?
**A:** Inheritance when there's a real, steady is-a link and shared behavior truly belongs in a base type; composition when you need to reuse or swap behavior freely, or when the link is has-a.

**Q:** What is the diamond problem?
**A:** Confusion that comes up when a class inherits the same method from two base classes through multiple inheritance — the compiler can't tell which one to use. Fixed by not allowing multiple class inheritance (only interfaces) in most languages.

**Q:** What's the fragile base class problem?
**A:** Changing a base class's inner workings (even without changing its public contract) can break subclasses that quietly relied on the old behavior.

**Q:** Why doesn't a subclass inherit its base class's constructors?
**A:** Building an object is specific to its type; each subclass must define its own constructor and call the base constructor to set up inherited state.

## Scenario
A `Bird` base class has a `fly()` method, and a `Penguin` subclass must override it to throw an error since penguins can't fly — a classic Liskov Substitution problem. Changing the design so `fly()` only lives in a `FlyingBird` interface (or is handled by a separate composed behavior) rather than the shared `Bird` base stops every subclass from being forced into a capability it can't do.

---
id: polymorphism
title: "Polymorphism"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, dispatch]
parent: oop
children: []
status: draft
---

## Overview
Polymorphism lets code work with objects of different exact types through one shared interface, so a caller writes one code path that works correctly no matter which version it's given. It's what lets OOP code grow to support new types without changing the code that calls it.

## Key Concepts
- Subtype polymorphism — a base type/interface reference resolves to a subclass's own behavior while the program runs
- Parametric polymorphism — generics/templates, the same code working over different types with no runtime choosing
- Ad-hoc polymorphism — function/operator overloading, decided at build time by the function's shape
- Dynamic vs static dispatch — a lookup table used while running vs a choice made when the code is built
- Duck typing — dynamic languages check "does this object support the call" with no declared interface needed

## Core Knowledge
- Subtype polymorphism is what interviews usually mean by "polymorphism" — interface/virtual behavior picked while running, based on the object's real type
- Needs a shared interface or base type — polymorphism doesn't work without a shared rule callers can count on
- Breaking the Liskov Substitution rule breaks polymorphism's safety — a subtype that changes the expected behavior makes swapping it in dangerous
- Runtime (dynamic) dispatch has a small speed cost (a lookup) compared to static dispatch — rarely a real problem outside hot paths
- Polymorphism is the tool that makes the Open/Closed Principle possible — new types add behavior without editing old switch/if-else logic
- Overload picking (ad-hoc polymorphism) is decided at build time by argument types, unrelated to runtime subtype dispatch
- Generics (parametric polymorphism) reuse code with no shared base type and no runtime cost, at the cost of less per-type customizing
- Pattern matching / type checks on exact types is often a sign that polymorphism should replace the branching instead

## Interview Questions
**Q:** What's the difference between build-time and run-time polymorphism?
**A:** Build-time (overloading, generics) is decided by the compiler from fixed types; run-time (virtual/interface dispatch) is decided from the object's real type while the program runs.

**Q:** How does polymorphism relate to the Open/Closed Principle?
**A:** Polymorphism lets new behavior come from a new subtype/version, so old code that calls through the interface never needs to change.

**Q:** Why can breaking the Liskov Substitution rule break polymorphic code?
**A:** Callers count on any subtype acting in line with the base rule; a subtype that breaks that rule causes bugs right where swapping it in was assumed safe.

**Q:** What is duck typing?
**A:** A dynamic-language form of polymorphism where an object can be used anywhere its methods match what's being called, with no declared shared interface.

## Scenario
A billing system needs to work out totals differently for `CreditCardPayment`, `PaypalPayment`, and `WireTransferPayment`. Setting up a shared `Payment` interface with a `calculateFee()` method and calling it through polymorphism keeps the billing loop unchanged as new payment types are added, each with its own version.

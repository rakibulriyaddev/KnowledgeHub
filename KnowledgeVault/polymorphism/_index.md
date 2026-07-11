---
id: polymorphism
title: "Polymorphism"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, dispatch]
parent: oop
children: []
status: draft
---

## Overview
Polymorphism lets code work with objects of different concrete types through a single shared interface, so a caller writes one code path that behaves correctly regardless of which implementation it's handed. It's what lets OOP code be extended with new types without modifying existing call sites.

## Key Concepts
- Subtype polymorphism — a base type/interface reference resolves to a subclass's overridden behavior at runtime
- Parametric polymorphism — generics/templates, same code operating over different types with no runtime dispatch
- Ad-hoc polymorphism — function/operator overloading, resolved at compile time by signature
- Dynamic vs static dispatch — virtual method tables (runtime) vs compile-time method resolution
- Duck typing — dynamic languages resolve "does this object support the call" without a declared interface

## Core Knowledge
- Subtype polymorphism is what interviews usually mean by "polymorphism" — virtual/interface dispatch chosen at runtime based on actual object type
- Requires a shared interface or base type — polymorphism doesn't work without a common contract callers can rely on
- Violating Liskov Substitution breaks polymorphism's safety — a subtype that changes expected behavior makes runtime substitution dangerous
- Runtime (dynamic) dispatch has a small performance cost (vtable lookup) vs static dispatch — rarely significant outside hot paths
- Polymorphism is the mechanism that makes the Open/Closed Principle achievable — new types extend behavior without editing existing switch/if-else logic
- Overload resolution (ad-hoc polymorphism) is resolved at compile time by argument types, unrelated to runtime subtype dispatch
- Generics (parametric polymorphism) achieve reuse without a common base type or runtime cost, at the price of less behavioral customization per type
- Pattern matching / type switches on concrete types is often a sign polymorphism should replace the branching instead

## Interview Questions
**Q:** What's the difference between compile-time and runtime polymorphism?
**A:** Compile-time (overloading, generics) is resolved by the compiler from static types; runtime (virtual/interface dispatch) is resolved from the object's actual type at execution.

**Q:** How does polymorphism relate to the Open/Closed Principle?
**A:** Polymorphism lets new behavior be added via a new subtype/implementation, so existing code that calls through the interface never needs modification.

**Q:** Why can a Liskov Substitution violation break polymorphic code?
**A:** Callers rely on any subtype behaving consistently with the base contract; a subtype that violates that contract causes runtime bugs exactly where substitution was assumed safe.

**Q:** What is duck typing?
**A:** A dynamic-language form of polymorphism where an object is usable anywhere its methods match what's called, without declaring a shared interface.

## Scenario
A billing system needs to calculate totals differently for `CreditCardPayment`, `PaypalPayment`, and `WireTransferPayment`. Defining a common `Payment` interface with a `calculateFee()` method and calling it polymorphically lets the billing loop stay unchanged as new payment types are added, each supplying its own implementation.

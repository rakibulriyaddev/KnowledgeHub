---
id: liskov-substitution-principle
title: "Liskov Substitution Principle"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Liskov Substitution Principle (LSP) states that objects of a subtype must be substitutable for objects of their supertype without breaking the correctness of the program. It's the "L" in SOLID and the formal rule behind "inheritance should model true is-a behavior, not just shared data."

## Key Concepts
- Behavioral subtyping — subtype must honor the supertype's contract, not just its interface signature
- Preconditions and postconditions — subclass can't strengthen preconditions or weaken postconditions
- Invariants — subclass must preserve the base type's invariants
- The classic Rectangle/Square counterexample

## Core Knowledge
- LSP is about behavior, not just method signatures — a subclass can compile fine and still violate LSP
- Strengthening a precondition (subclass requires more than base promised) breaks callers written against the base type
- Weakening a postcondition (subclass guarantees less than base promised) breaks callers relying on the base contract
- Throwing new exception types not expected by base-type callers is a common, subtle LSP violation
- Overriding a method to do nothing (no-op) or throw `NotSupportedException` is a strong LSP violation signal
- LSP violations often surface only at runtime, in code paths that specifically depend on base-type assumptions
- Favoring composition over inheritance sidesteps LSP risk entirely when true is-a doesn't hold
- Design by Contract (preconditions/postconditions/invariants) is the formal framework LSP is built on

## Interview Questions
**Q:** What's the classic example of an LSP violation?
**A:** `Square` extending `Rectangle` and overriding `setWidth`/`setHeight` to keep both equal — code that sets width and height independently on any `Rectangle` breaks when given a `Square`.

**Q:** How can LSP be violated without any compiler error?
**A:** By strengthening preconditions, weakening postconditions, or throwing unexpected exceptions in an override — all type-check fine but break callers' assumptions at runtime.

**Q:** How does LSP relate to inheritance vs composition?
**A:** LSP is the test for whether inheritance is appropriate — if a subtype can't honor the full contract, composition is the safer alternative.

**Q:** What's a red flag in code review for an LSP violation?
**A:** An override that throws `NotImplementedException`/`NotSupportedException`, or one that silently does nothing where the base type expects an effect.

## Scenario
A `Bird` base class has a `fly()` method, and a `Penguin` subclass is added that overrides `fly()` to throw an exception. Any code iterating over a list of `Bird` and calling `fly()` now crashes on penguins — violating LSP. The fix is to model flight capability separately (e.g. a `Flyable` interface) rather than assuming every bird can fly.

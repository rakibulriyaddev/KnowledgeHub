---
id: liskov-substitution-principle
title: "Liskov Substitution Principle"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Liskov Substitution Principle (LSP) says you must be able to swap in a subtype object for a supertype object without breaking the program. It is the "L" in SOLID. It is the formal rule behind "inheritance should model a true is-a relationship, not just shared data."

## Key Concepts
- Behavioral subtyping — the subtype must keep the supertype's contract, not just match its interface
- Preconditions and postconditions — a subclass cannot ask for more upfront (precondition) or promise less at the end (postcondition) than the base type
- Invariants — a subclass must keep the base type's invariants (rules that always stay true)
- The classic Rectangle/Square example

## Core Knowledge
- LSP is about behavior, not just method names — a subclass can compile fine and still break LSP
- Asking for more upfront (a stronger precondition) than the base type breaks code written for the base type
- Promising less at the end (a weaker postcondition) than the base type breaks callers who trust the base contract
- Throwing new error types that callers of the base type don't expect is a common, hidden way to break LSP
- An override that does nothing, or throws `NotSupportedException`, is a strong warning sign of an LSP break
- LSP breaks often show up only when the program runs, in code that depends on base-type rules
- Using composition instead of inheritance avoids LSP risk when a true is-a link does not hold
- Design by Contract (preconditions, postconditions, invariants) is the formal idea LSP is built on

## Interview Questions
**Q:** What's the classic example of an LSP violation?
**A:** `Square` extends `Rectangle` and overrides `setWidth`/`setHeight` to keep both equal. Any code that sets width and height on its own, for any `Rectangle`, breaks when given a `Square`.

**Q:** How can LSP be violated without any compiler error?
**A:** By asking for more upfront, promising less at the end, or throwing a new kind of error in an override. All of these compile fine but break what callers expect when the program runs.

**Q:** How does LSP relate to inheritance vs composition?
**A:** LSP is the test for whether inheritance is the right choice. If a subtype cannot keep the full contract, composition is the safer choice.

**Q:** What's a red flag in code review for an LSP violation?
**A:** An override that throws `NotImplementedException`/`NotSupportedException`, or one that quietly does nothing where the base type expects some effect.

## Scenario
A `Bird` base class has a `fly()` method. A new `Penguin` subclass overrides `fly()` to throw an error. Any code that loops over a list of `Bird` and calls `fly()` now crashes on penguins — this breaks LSP. The fix is to model the ability to fly on its own (for example, a `Flyable` interface) instead of assuming every bird can fly.

---
id: encapsulation
title: "Encapsulation"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, information-hiding]
parent: oop
children: []
status: draft
---

## Overview
Encapsulation bundles an object's state with the behavior that operates on it, exposing only what's necessary through a controlled interface and hiding the rest. It's the mechanism that lets an object protect its own invariants — the guarantees a caller can rely on without knowing internal representation.

## Key Concepts
- Access modifiers — public, private, protected (and package/internal) control visibility
- Invariants — conditions a class enforces on itself across every public operation
- Information hiding — callers depend on behavior, not internal representation
- Tell, don't ask — favor methods that perform actions over exposing state for callers to manipulate
- Getters/setters are a tool, not the goal — encapsulation is about protecting invariants, not restricting field access uniformly

## Core Knowledge
- A class with public getters/setters on every field has state, but no real encapsulation — invariants aren't protected
- Encapsulation enables safe refactoring — internal representation can change without breaking callers, as long as the public contract holds
- Immutable objects take encapsulation further — state can't change after construction, eliminating a whole class of invariant violations
- Over-encapsulation (excessive private helper layers, defensive copying everywhere) adds ceremony without protecting anything real
- Leaky encapsulation often shows up as returning mutable internal collections/objects directly instead of copies or read-only views
- Encapsulation is a prerequisite for polymorphism to be safe — callers rely on the interface, not the concrete type's internals
- Language support varies — some languages enforce access modifiers strictly at compile time, others (Python) rely on convention only
- Encapsulation boundaries typically align with a class's single responsibility — a class doing too much tends to leak its internals

## Interview Questions
**Q:** What's the difference between encapsulation and abstraction?
**A:** Encapsulation is the mechanism (bundling state + behavior, restricting access); abstraction is the design goal (exposing only relevant concepts). Encapsulation is how abstraction is implemented.

**Q:** Why is exposing a mutable internal list via a getter a violation of encapsulation?
**A:** It lets callers mutate the object's internal state directly, bypassing any invariant checks the class enforces.

**Q:** Does having private fields automatically mean a class is well-encapsulated?
**A:** No — if every field has a public getter/setter, callers can still put the object into any state, defeating the purpose.

**Q:** How does encapsulation support safe refactoring?
**A:** As long as the public contract is unchanged, internal implementation can be rewritten freely without breaking any calling code.

## Scenario
A `BankAccount` class exposes `balance` as a public mutable field, letting any code set it to a negative number directly. Encapsulating it — making the field private and only allowing changes through `deposit()`/`withdraw()` methods that enforce a non-negative invariant — makes an invalid balance state impossible to reach from outside the class.

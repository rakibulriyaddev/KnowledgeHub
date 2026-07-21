---
id: encapsulation
title: "Encapsulation"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, information-hiding]
parent: oop
children: []
status: draft
---

## Overview
Encapsulation bundles an object's state together with the behavior that acts on it. It shows only what is needed through a controlled interface, and hides the rest. This is the mechanism that lets an object protect its own invariants — the guarantees a caller can trust, without needing to know how the object works inside.

## Key Concepts
- Access modifiers — public, private, protected (and package/internal) control visibility
- Invariants — conditions a class always keeps true, across every public operation
- Information hiding — callers depend on behavior, not on how things are stored inside
- Tell, don't ask — favor methods that do actions, instead of exposing state for callers to change directly
- Getters/setters are just a tool, not the goal — encapsulation is about protecting invariants, not blocking access to every field the same way

## Core Knowledge
- A class with a public getter and setter for every field still has state, but no real encapsulation — nothing is protecting its invariants
- Encapsulation makes refactoring safer — the internal design can change without breaking callers, as long as the public contract stays the same
- Immutable objects take this further — the state cannot change after the object is built, which removes a whole class of invariant-breaking bugs
- Too much encapsulation (too many private helper layers, copying data defensively everywhere) adds extra work without really protecting anything
- A common way encapsulation leaks is returning a mutable internal collection or object directly, instead of a copy or a read-only view
- Encapsulation is needed for polymorphism to be safe — callers rely on the interface, not on the details of the concrete type
- Language support varies — some languages enforce access modifiers strictly at compile time, while others (like Python) rely only on convention
- Encapsulation boundaries usually match a class's single responsibility — a class that does too much tends to leak its internal details

## Interview Questions
**Q:** What's the difference between encapsulation and abstraction?
**A:** Encapsulation is the mechanism — bundling state and behavior together, and limiting access. Abstraction is the goal — showing only the ideas that matter. Encapsulation is how abstraction gets built.

**Q:** Why is exposing a mutable internal list via a getter a violation of encapsulation?
**A:** It lets callers change the object's internal state directly, skipping any invariant checks the class is supposed to enforce.

**Q:** Does having private fields automatically mean a class is well-encapsulated?
**A:** No — if every field still has a public getter and setter, callers can put the object into any state anyway, which defeats the point.

**Q:** How does encapsulation support safe refactoring?
**A:** As long as the public contract does not change, the internal code can be rewritten freely, without breaking any code that calls it.

## Scenario
A `BankAccount` class exposes `balance` as a public, changeable field, so any code can set it to a negative number directly. Encapsulating it — making the field private and only allowing changes through `deposit()`/`withdraw()` methods that enforce a rule that balance stays zero or above — makes an invalid balance impossible to reach from outside the class.

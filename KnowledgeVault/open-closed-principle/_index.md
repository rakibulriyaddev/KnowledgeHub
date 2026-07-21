---
id: open-closed-principle
title: "Open/Closed Principle"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Open/Closed Principle (OCP) says code should be open to adding new behavior but closed to changing old, tested code. New behavior should come from new code, not edits to code that already works. It's the "O" in SOLID and the main defense against fragile, always-changing if/else logic.

## Key Concepts
- Extension vs modification — add new types/classes, don't edit the old ones
- Polymorphism as the main tool — swapping in different behavior replaces checking a type
- Abstraction points — interfaces/abstract classes mark where new code can be added
- Strategy pattern — the standard OCP-friendly design for changing behavior

## Core Knowledge
- Growing `if/else` or `switch` chains based on a type is the classic OCP mistake
- OCP works by depending on a shared shape and adding new versions of it, instead of branching on the exact type
- Also applies at the edges of modules — a stable public API shouldn't need to change for every new user's need
- Using OCP too early (building flexibility before a second case even exists) creates unused, made-up extension points — this fights with YAGNI (you aren't gonna need it)
- Plugin systems, middleware chains, and strategy/visitor patterns are OCP in real use
- "Closed" only means closed to change along one expected direction — no module is closed to literally every change
- Breaking OCP raises the risk of bugs — every new case means retesting the whole changed function, not just the new part
- Language features like overloading, generics, and event/hook systems all support OCP's goal

## Interview Questions
**Q:** What does "closed for modification" really mean in practice?
**A:** Old, tested code shouldn't need to change to support a new case — new behavior comes from new code (a new class/version) instead.

**Q:** How is OCP usually built in OOP languages?
**A:** Through interfaces or abstract base classes — new behavior means a new class that follows the interface, not editing old if/else logic.

**Q:** What's a risk of using OCP too much?
**A:** Adding flexibility too early — building extension points for changes that never happen, which just adds complexity with no payoff.

**Q:** Give a real OCP mistake and its fix.
**A:** A `PaymentProcessor` with `if (type == "credit") ... else if (type == "paypal") ...` — fix it by making an `IPaymentMethod` interface and adding new payment types as new classes.

## Scenario
A discount calculator has a growing `switch` on customer type (`regular`, `premium`, `vip`) that needs editing every time sales adds a new tier — each edit risks breaking the tiers that already work. Replacing it with an `IDiscountStrategy` interface and one class per tier means adding a tier is just adding a new class, with no changes to old, already-tested code.

---
id: open-closed-principle
title: "Open/Closed Principle"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Open/Closed Principle (OCP) states software entities should be open for extension but closed for modification — new behavior should be added by adding new code, not editing tested, working code. It's the "O" in SOLID and the main lever against fragile, ever-mutating conditional logic.

## Key Concepts
- Extension vs modification — add new types/classes, don't edit existing ones
- Polymorphism as the primary mechanism — virtual dispatch replaces type-switching
- Abstraction seams — interfaces/abstract classes define the extension points
- Strategy pattern — the canonical OCP-compliant design for varying behavior

## Core Knowledge
- Growing `if/else` or `switch` chains on a type discriminator is the classic OCP violation
- OCP is achieved by depending on an abstraction and adding new implementations, not branching on concrete type
- Applies at module boundaries too — a stable public API shouldn't require modification for every new consumer need
- Over-applying OCP prematurely (abstracting before a second variant exists) creates speculative, unused extension points — YAGNI tension
- Plugin architectures, middleware pipelines, and strategy/visitor patterns are OCP in practice
- "Closed" is relative to a specific kind of change — no module is closed to literally all modification, just to modification for its expected extension axis
- Violating OCP increases regression risk — every new case means retesting the whole modified function, not just the new addition
- Language features like function overloading, generics, and event/hook systems all serve OCP's goal

## Interview Questions
**Q:** What does "closed for modification" actually mean in practice?
**A:** Existing, tested code shouldn't need to change to support a new case — new behavior is added via new code (new class/implementation) instead.

**Q:** How is OCP typically implemented in OOP languages?
**A:** Through interfaces or abstract base classes — new behavior means a new class implementing the interface, not editing existing conditional logic.

**Q:** What's a risk of over-applying OCP?
**A:** Premature abstraction — creating extension points for variations that never materialize, adding complexity without payoff.

**Q:** Give a concrete OCP violation and its fix.
**A:** A `PaymentProcessor` with `if (type == "credit") ... else if (type == "paypal") ...` — fix by defining an `IPaymentMethod` interface and adding new payment types as new classes.

## Scenario
A discount calculator has a growing `switch` on customer type (`regular`, `premium`, `vip`) that needs editing every time sales adds a new tier — each edit risks breaking existing tiers. Replacing it with an `IDiscountStrategy` interface and one class per tier means adding a tier is just adding a new class, with zero changes to existing, already-tested code.

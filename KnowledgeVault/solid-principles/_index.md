---
id: solid-principles
title: "SOLID Principles"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, design-pattern, oop]
parent: oop
children: [di, single-responsibility-principle, open-closed-principle, liskov-substitution-principle, interface-segregation-principle, dependency-inversion-principle]
status: draft
---

## Overview
SOLID is a set of five object-oriented design rules — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — made to guide how you design classes and modules, so code is easier to change, test, and add to without breaking what already works.

## Key Concepts
- Single Responsibility — a class should have only one reason to change
- Open/Closed — open to adding new behavior, closed to changing old code
- Liskov Substitution — a subtype must work anywhere its base type is used
- Interface Segregation — many small interfaces are better than one big one
- Dependency Inversion — depend on abstractions, not on fixed, concrete code

## Core Knowledge
- SOLID is guidance, not a strict law — following it too rigidly leads to too many layers and too much indirection (sometimes called "SOLID rot")
- SRP is the most misused rule — "one reason to change" is about business responsibility, not "only one method per class"
- OCP is done through polymorphism and interfaces, not through long if/else or switch chains that check a type
- LSP problems often hide in errors thrown by overridden methods, or rules made stricter in a subclass
- ISP directly fixes "fat interface" problems, where a class must add empty, unused methods just to fit an interface
- DIP is the rule that Dependency Injection puts into practice at runtime — it flips the usual direction of dependency
- These rules are older than, and not tied to, any one language, though people usually talk about them using C#/Java-style OOP
- Using all five too much on every small class adds extra work without real benefit

## Interview Questions
**Q:** Name the five SOLID principles and one line on each.
**A:** SRP (one reason to change), OCP (add new behavior without changing old code), LSP (subtypes must work in place of their base type), ISP (small, focused interfaces), DIP (depend on abstractions).

**Q:** How does Dependency Inversion differ from Dependency Injection?
**A:** DIP is the design rule (depend on abstractions); DI is the pattern that puts it into practice by supplying those abstractions from outside the class.

**Q:** Give an example of an Open/Closed violation.
**A:** A `calculateArea(shape)` function with a growing switch statement on shape type — adding a new shape means changing the function instead of adding to it through polymorphism.

**Q:** What's a common real-world Liskov Substitution violation?
**A:** A `Square` class that extends `Rectangle` and overrides `setWidth`/`setHeight` to keep both equal — this breaks any code that expects a `Rectangle`'s width and height to change independently.

## Scenario
A reporting module has one class that keeps growing — it fetches data, formats output, and sends emails, all in one place. Any small change risks breaking the other parts. Splitting it into focused classes (SRP), where each one depends on interfaces instead of fixed, concrete code (DIP), lets the team swap out the email sender or the output format on its own, without touching the rest.

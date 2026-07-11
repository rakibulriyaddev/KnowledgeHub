---
id: solid-principles
title: "SOLID Principles"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, design-pattern, oop]
parent: oop
children: [di, single-responsibility-principle, open-closed-principle, liskov-substitution-principle, interface-segregation-principle, dependency-inversion-principle]
status: draft
---

## Overview
SOLID is a set of five object-oriented design principles — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — coined to guide class and module design toward code that's easier to change, test, and extend without breaking existing behavior.

## Key Concepts
- Single Responsibility — a class should have one reason to change
- Open/Closed — open for extension, closed for modification
- Liskov Substitution — subtypes must be substitutable for their base types
- Interface Segregation — many small interfaces beat one fat one
- Dependency Inversion — depend on abstractions, not concretions

## Core Knowledge
- SOLID is guidance, not law — dogmatic application produces excessive abstraction and indirection ("SOLID rot")
- SRP is the most misapplied — "one reason to change" is about business responsibility, not "one method per class"
- OCP is achieved through polymorphism/interfaces, not endless if/else or switch statements on type
- LSP violations often hide in exceptions thrown by overrides or preconditions strengthened in subclasses
- ISP directly counters "fat interface" problems where implementers stub out unused methods
- DIP is the principle Dependency Injection implements at runtime — inversion of the traditional dependency direction
- These principles predate and are language-agnostic, though most commonly discussed via C#/Java-style OOP
- Overuse is a real cost — applying all five principles to every trivial class adds ceremony without payoff

## Interview Questions
**Q:** Name the five SOLID principles and one line on each.
**A:** SRP (one reason to change), OCP (extend without modifying), LSP (subtypes substitutable), ISP (small focused interfaces), DIP (depend on abstractions).

**Q:** How does Dependency Inversion differ from Dependency Injection?
**A:** DIP is the design principle (depend on abstractions); DI is the pattern/mechanism that implements it by supplying those abstractions from outside.

**Q:** Give an example of an Open/Closed violation.
**A:** A `calculateArea(shape)` function with a growing switch on shape type — adding a shape means modifying the function instead of extending it polymorphically.

**Q:** What's a common real-world Liskov Substitution violation?
**A:** A `Square` subclassing `Rectangle` that overrides `setWidth`/`setHeight` to keep both equal, breaking code that assumes independent width/height on any `Rectangle`.

## Scenario
A reporting module keeps growing a single class that fetches data, formats output, and sends emails — every unrelated change risks breaking the others. Splitting it into focused classes (SRP), each depending on interfaces rather than concrete implementations (DIP), lets the team swap the email sender or output format independently without touching the rest.

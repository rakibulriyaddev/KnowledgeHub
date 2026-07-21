---
id: dependency-inversion-principle
title: "Dependency Inversion Principle"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Dependency Inversion Principle (DIP) says high-level code shouldn't depend on low-level code — both should depend on abstractions, and abstractions shouldn't depend on details. It's the "D" in SOLID and the design-level rule that Dependency Injection carries out while the program runs.

## Key Concepts
- Flipping the usual dependency direction — high-level code sets the interface, low-level code implements it
- High-level vs low-level modules — business logic vs implementation detail
- Abstractions own the contract — the interface lives with the code that uses it, not the code that implements it
- DIP vs DI — DIP is the rule, DI is the tool that supplies real implementations

## Core Knowledge
- Traditional layered design has high-level code directly calling low-level code — DIP flips this so both depend on an interface instead
- The abstraction (interface) should be owned by or defined near the high-level module, not the low-level one
- Without DIP, a business logic change ripples down; with DIP, low-level code can change without touching high-level logic
- DIP is a design-time rule about which way dependencies point; DI is the runtime tool (constructor injection, containers) that carries it out
- A common mix-up: "using an interface" alone isn't DIP if the interface still lives in and is shaped by the low-level module
- DIP allows plugin-style designs — a high-level core sets contracts, and low-level plugins implement them on their own
- Breaking DIP shows up as high-level code directly using concrete infrastructure types (like a specific database driver)
- DIP is what makes hexagonal/ports-and-adapters architecture possible at the system level

## Interview Questions
**Q:** What's the difference between Dependency Inversion and Dependency Injection?
**A:** DIP is the rule — depend on abstractions, flip the usual dependency direction; DI is the pattern/tool (constructor injection, containers) that supplies those abstractions' real implementations.

**Q:** Who should own the interface in a DIP-following design?
**A:** The high-level (using) module — the abstraction is shaped by what the logic needs, not by what the low-level code happens to offer.

**Q:** Give an example of a DIP violation.
**A:** An `OrderService` (high-level) directly creating and calling a concrete `MySqlOrderRepository` (low-level) — the business logic now depends on one specific database.

**Q:** How does DIP relate to hexagonal architecture?
**A:** Hexagonal architecture is DIP used at the system level — the core domain sets ports (interfaces), and adapters (infrastructure) implement them, keeping the domain free of infrastructure details.

## Scenario
A checkout module directly calls a concrete `StripePaymentGateway` class, so switching payment providers means editing checkout logic. Applying DIP, checkout depends on an `IPaymentGateway` interface it defines, and `StripePaymentGateway`/`PaypalPaymentGateway` implement it — checkout logic never changes when the payment provider does.

---
id: dependency-inversion-principle
title: "Dependency Inversion Principle"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Dependency Inversion Principle (DIP) states high-level modules shouldn't depend on low-level modules — both should depend on abstractions, and abstractions shouldn't depend on details. It's the "D" in SOLID and the design-level rule that Dependency Injection implements at runtime.

## Key Concepts
- Inversion of the traditional dependency direction — high-level defines the interface, low-level implements it
- High-level vs low-level modules — policy/business logic vs implementation detail
- Abstractions own the contract — the interface lives with the consumer, not the implementer
- DIP vs DI — DIP is the principle, DI is the mechanism that supplies concrete implementations

## Core Knowledge
- Traditional layered design has high-level code directly importing/calling low-level code — DIP inverts this so both depend on an interface
- The abstraction (interface) should be owned by or defined near the high-level module, not the low-level one
- Without DIP, a business logic change ripples down; with DIP, low-level implementations can change without touching high-level policy
- DIP is a compile-time/design-time principle about dependency direction; DI is the runtime mechanism (constructor injection, containers) that fulfills it
- A common misconception: "using an interface" alone isn't DIP if the interface still lives in and is shaped by the low-level module
- DIP enables plugin-style architectures — high-level core defines contracts, low-level plugins implement them independently
- Violating DIP shows up as high-level modules importing concrete infrastructure types (e.g. a specific database driver) directly
- DIP is what makes hexagonal/ports-and-adapters architecture possible at the architectural level

## Interview Questions
**Q:** What's the difference between Dependency Inversion and Dependency Injection?
**A:** DIP is the principle — depend on abstractions, invert the traditional dependency direction; DI is the pattern/mechanism (constructor injection, containers) that supplies those abstractions' concrete implementations.

**Q:** Who should own the interface in a DIP-compliant design?
**A:** The high-level (consuming) module — the abstraction is shaped by what the policy needs, not by what the low-level implementation happens to expose.

**Q:** Give an example of a DIP violation.
**A:** An `OrderService` (high-level) directly instantiating and calling a concrete `MySqlOrderRepository` (low-level) — the business logic now depends on a specific database technology.

**Q:** How does DIP relate to hexagonal architecture?
**A:** Hexagonal architecture is DIP applied at the system level — the core domain defines ports (interfaces), and adapters (infrastructure) implement them, keeping the domain independent of infrastructure details.

## Scenario
A checkout module directly calls a concrete `StripePaymentGateway` class, so switching payment providers means editing checkout logic. Applying DIP, checkout depends on an `IPaymentGateway` interface it defines, and `StripePaymentGateway`/`PaypalPaymentGateway` implement it — checkout logic never changes when the payment provider does.

---
id: di
title: "Dependency Injection"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
Dependency Injection (DI) is a design pattern where an object's dependencies are provided from the outside rather than constructed internally. It's the most common implementation of the Inversion of Control principle, decoupling *what* a class needs from *how* those needs are satisfied.

## Key Concepts
- Constructor, property, and method injection — the three injection styles
- IoC container / DI container — resolves and wires dependency graphs automatically
- Service lifetimes — transient, scoped, singleton
- Interface-based programming — depend on abstractions, not concrete types
- Composition root — the single place where the object graph is wired up

## Core Knowledge
- DI enables unit testing via mocking/stubbing without touching production wiring code
- Constructor injection is preferred — makes required dependencies explicit and immutable
- Overusing DI containers as a service locator (pulling dependencies at runtime) defeats the purpose and hides coupling
- Wrong lifetime scoping is a common bug source — e.g. injecting a scoped service into a singleton causes captive dependency issues
- DI is a runtime pattern; distinct from compile-time approaches like generics-based composition
- Circular dependencies between injected services indicate a design smell, not something to work around mechanically
- Most modern frameworks (ASP.NET Core, Spring, Angular) ship a built-in DI container
- Too many constructor parameters signals a class doing too much — a cue to split responsibilities

## Interview Questions
**Q:** What's the difference between Dependency Injection and the Service Locator pattern?
**A:** DI pushes dependencies in explicitly (usually via constructor); Service Locator has code pull dependencies from a central registry at runtime, hiding what a class actually needs.

**Q:** Why prefer constructor injection over property injection?
**A:** Constructor injection makes dependencies required and immutable, failing fast at object creation instead of allowing a partially-configured object to exist.

**Q:** What's a captive dependency?
**A:** A longer-lived service (e.g. singleton) holding a reference to a shorter-lived one (e.g. scoped), causing the shorter-lived dependency to outlive its intended scope.

**Q:** Does using DI require an IoC container?
**A:** No — "poor man's DI" (manual constructor wiring) is valid DI; a container just automates graph resolution for larger apps.

## Scenario
A payment service class directly instantiates a concrete `SqlPaymentRepository`, making it impossible to unit test without a real database. Refactoring to accept an `IPaymentRepository` via constructor injection lets tests supply an in-memory fake, and lets production wire the SQL implementation — the class code never changes.

---
id: di
title: "Dependency Injection"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
Dependency Injection (DI) is a design pattern where an object's dependencies are given to it from outside, instead of the object building them itself. It is the most common way to apply the Inversion of Control principle. It separates *what* a class needs from *how* those needs get met.

## Key Concepts
- Constructor, property, and method injection — the three injection styles
- IoC container / DI container — finds and connects dependency graphs automatically
- Service lifetimes — transient, scoped, singleton
- Interface-based programming — depend on interfaces, not concrete types
- Composition root — the one place where the whole object graph gets connected

## Core Knowledge
- DI makes unit testing easier, since tests can use mocks or stubs without touching production wiring code
- Constructor injection is the preferred style — it makes required dependencies clear and fixed once set
- Using a DI container as a service locator (pulling dependencies at runtime instead of receiving them) defeats the point and hides coupling
- Picking the wrong lifetime is a common source of bugs — for example, putting a scoped service inside a singleton causes a captive dependency problem
- DI works at runtime; it is different from compile-time approaches such as composing things through generics
- Circular dependencies between injected services are a sign of a design problem, not something to just patch around
- Most modern frameworks (ASP.NET Core, Spring, Angular) ship a built-in DI container
- Too many constructor parameters is a sign a class is doing too much — a hint to split it into smaller pieces

## Interview Questions
**Q:** What's the difference between Dependency Injection and the Service Locator pattern?
**A:** DI pushes dependencies in directly, usually through the constructor. Service Locator instead has code pull dependencies from a central registry at runtime, which hides what a class really needs.

**Q:** Why prefer constructor injection over property injection?
**A:** Constructor injection makes dependencies required and fixed. It fails right away when the object is created, instead of letting a half-set-up object exist.

**Q:** What's a captive dependency?
**A:** When a longer-lived service (like a singleton) holds a reference to a shorter-lived one (like a scoped service), making the shorter-lived one live longer than it should.

**Q:** Does using DI require an IoC container?
**A:** No — wiring constructors by hand ("poor man's DI") still counts as DI. A container just automates this connecting for bigger apps.

## Scenario
A payment service class directly creates a concrete `SqlPaymentRepository`, which makes it impossible to unit test without a real database. Changing it to accept an `IPaymentRepository` through constructor injection lets tests use an in-memory fake, while production still wires up the real SQL version — the class code itself never changes.

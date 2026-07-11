---
id: factory-method-pattern
title: "Factory Method Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Factory Method defines an interface for creating an object but lets subclasses decide which concrete class to instantiate. It replaces direct `new` calls scattered through client code with a single overridable creation point, keeping client code closed to modification when new product types appear.

## Key Concepts
- Creator base class — declares the factory method, may provide a default implementation
- Concrete creators — override the factory method to produce specific product types
- Product interface — the common type all created objects implement
- Parallel class hierarchies — creators and products typically mirror each other 1:1

## Core Knowledge
- Factory Method is an Open/Closed Principle application — adding a new product means adding a new creator subclass, not editing existing ones
- Differs from Abstract Factory — Factory Method creates one product via subclassing; Abstract Factory creates families of related products via composition
- Common simplification: a static "simple factory" function without inheritance — technically not GoF Factory Method, but achieves similar decoupling for simple cases
- Overuse creates parallel class hierarchies that are harder to navigate than a single switch statement would be for genuinely small, stable product sets
- Language features matter — first-class functions let a factory be a simple lambda/function reference instead of a class hierarchy
- Testability benefit — client code depends on the product interface, so tests can substitute a factory returning test doubles
- Frameworks commonly expose factory methods for extensibility points (e.g. `createConnection()`, `createElement()`)

## Interview Questions
**Q:** How does Factory Method differ from Abstract Factory?
**A:** Factory Method uses subclassing to produce one type of product; Abstract Factory uses object composition to produce families of related products.

**Q:** What problem does Factory Method solve?
**A:** It decouples client code from concrete class instantiation, so new product types can be added without modifying existing client or creator code.

**Q:** What's the difference between Factory Method and a "simple factory" function?
**A:** Simple factory is a single function/method with conditional logic choosing which class to instantiate; Factory Method uses polymorphism via subclassed creators instead of conditionals.

**Q:** When might Factory Method be overkill?
**A:** When the set of product types is small and stable — a simple factory function or direct instantiation is clearer than a parallel class hierarchy.

## Scenario
A document editor needs to support opening both `PdfDocument` and `WordDocument`, and new formats will be added later. An `Application` base class declares an abstract `createDocument()` factory method, with `PdfApplication` and `WordApplication` subclasses each returning their document type — adding a new format means adding a new subclass, not touching existing application logic.

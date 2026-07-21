---
id: factory-method-pattern
title: "Factory Method Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Factory Method defines an interface for creating an object, but lets subclasses decide which exact class to create. It replaces direct `new` calls scattered through client code with a single creation point that can be overridden, so client code does not need to change when new product types appear.

## Key Concepts
- Creator base class — declares the factory method, may provide a default implementation
- Concrete creators — override the factory method to produce specific product types
- Product interface — the common type all created objects implement
- Parallel class hierarchies — creators and products usually mirror each other one-to-one

## Core Knowledge
- Factory Method is an example of the Open/Closed Principle — adding a new product means adding a new creator subclass, not editing the existing ones
- It differs from Abstract Factory — Factory Method creates one product through subclassing; Abstract Factory creates whole families of related products through composition
- A common shortcut is a static "simple factory" function with no inheritance — technically not the real GoF Factory Method, but it gives similar decoupling for simple cases
- Overusing it creates parallel class hierarchies that are harder to work through than a single switch statement would be, for product sets that are genuinely small and stable
- Language features matter — first-class functions let a factory just be a simple lambda or function reference, instead of a whole class hierarchy
- Testing benefit — client code depends on the product interface, so tests can swap in a factory that returns test doubles
- Frameworks often expose factory methods as extension points (e.g. `createConnection()`, `createElement()`)

## Interview Questions
**Q:** How does Factory Method differ from Abstract Factory?
**A:** Factory Method uses subclassing to produce one type of product; Abstract Factory uses object composition to produce whole families of related products.

**Q:** What problem does Factory Method solve?
**A:** It separates client code from creating concrete classes directly, so new product types can be added without changing existing client or creator code.

**Q:** What's the difference between Factory Method and a "simple factory" function?
**A:** A simple factory is one function or method with if/else logic to choose which class to create. Factory Method instead uses polymorphism, through subclassed creators, instead of conditionals.

**Q:** When might Factory Method be overkill?
**A:** When the set of product types is small and stable — a simple factory function, or just creating objects directly, is clearer than a parallel class hierarchy.

## Scenario
A document editor needs to open both `PdfDocument` and `WordDocument`, and more formats will be added later. An `Application` base class declares an abstract `createDocument()` factory method, with `PdfApplication` and `WordApplication` subclasses each returning their own document type. Adding a new format means adding a new subclass, without touching any existing application logic.

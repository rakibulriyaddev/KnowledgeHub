---
id: creational-patterns
title: "Creational Patterns"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: design-patterns
children: [singleton-pattern, factory-method-pattern, abstract-factory-pattern, builder-pattern, prototype-pattern]
status: draft
---

## Overview
Creational patterns deal with object creation mechanisms, aiming to create objects in a manner suited to the situation rather than direct instantiation everywhere. They decouple *what* gets created from *how* and *when* it gets constructed, which matters most when construction is complex, expensive, or needs to vary.

## Key Concepts
- Singleton — ensure a class has exactly one instance, provide global access
- Factory Method — defer instantiation to subclasses via a creation method
- Abstract Factory — produce families of related objects without specifying concrete classes
- Builder — separate complex object construction from its representation, built step by step
- Prototype — create new objects by cloning an existing instance

## Core Knowledge
- Singleton is the most misused pattern — global mutable state complicates testing; DI containers with singleton lifetime scope usually replace it in modern code
- Factory Method vs Abstract Factory — Factory Method creates one product via inheritance/overriding; Abstract Factory creates families of related products via composition
- Builder solves the "telescoping constructor" problem — many optional constructor parameters replaced by a fluent step-by-step API
- Prototype is useful when object creation is expensive (e.g. deep config load) and cloning is cheaper than rebuilding from scratch
- All creational patterns trade a small amount of indirection for flexibility in swapping concrete types later — a direct OCP payoff
- Overuse of factories creates "factory of factories" complexity — apply only when construction logic genuinely needs to vary or be centralized
- Dependency injection containers have absorbed much of what Factory/Abstract Factory used to solve manually
- Language features matter — languages with named/default parameters reduce the need for Builder; language with first-class functions can implement Factory as a simple function

## Interview Questions
**Q:** What's the difference between Factory Method and Abstract Factory?
**A:** Factory Method creates a single product type via subclass overriding; Abstract Factory creates families of related products through a composed factory object.

**Q:** Why is Singleton considered an anti-pattern by some?
**A:** It introduces global mutable state and hidden dependencies, making unit testing harder — DI-managed singleton lifetime usually achieves the same goal more testably.

**Q:** When would you reach for Builder over a constructor?
**A:** When an object has many optional parameters or requires multi-step construction — Builder avoids telescoping constructors and improves readability.

**Q:** What problem does Prototype solve that Factory doesn't?
**A:** Prototype avoids re-running expensive construction logic by cloning a pre-configured instance, rather than building one from scratch each time.

## Scenario
A UI library needs to render buttons and checkboxes consistently across "light" and "dark" themes without the calling code knowing which theme is active. An Abstract Factory (`LightThemeFactory`, `DarkThemeFactory`) each producing matching `Button`/`Checkbox` implementations lets client code request components without coupling to a specific theme's concrete classes.

---
id: creational-patterns
title: "Creational Patterns"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: design-patterns
children: [singleton-pattern, factory-method-pattern, abstract-factory-pattern, builder-pattern, prototype-pattern]
status: draft
---

## Overview
Creational patterns are about how objects get made, aiming to create them in a way that fits the situation, instead of just creating objects directly everywhere. They separate *what* gets made from *how* and *when* it gets built. This matters most when building the object is complex, costly, or needs to change.

## Key Concepts
- Singleton — ensure a class has exactly one instance, provide global access
- Factory Method — let subclasses decide how an object is created, through a creation method
- Abstract Factory — produce families of related objects without specifying concrete classes
- Builder — separate building a complex object from how it is represented, building it step by step
- Prototype — create new objects by cloning an existing instance

## Core Knowledge
- Singleton is the most misused pattern — global state that can change makes testing harder. DI containers with a singleton lifetime usually replace it in modern code
- Factory Method vs Abstract Factory — Factory Method makes one product through inheritance and overriding; Abstract Factory makes whole families of related products through composition
- Builder fixes the "telescoping constructor" problem — many optional constructor parameters get replaced with a smooth, step-by-step API
- Prototype is useful when creating an object is costly (for example, loading a deep config) and copying it is cheaper than building it again from scratch
- All creational patterns trade a small amount of extra indirection for the freedom to swap concrete types later — a direct payoff for the Open/Closed Principle
- Overusing factories leads to "factory of factories" complexity — use them only when the construction logic really needs to change or be centralized
- Dependency injection containers now handle much of what Factory and Abstract Factory used to solve by hand
- Language features matter — languages with named or default parameters need Builder less often; languages with first-class functions can write Factory as a simple function

## Interview Questions
**Q:** What's the difference between Factory Method and Abstract Factory?
**A:** Factory Method creates a single product type through subclass overriding; Abstract Factory creates families of related products through a factory object made of parts.

**Q:** Why is Singleton considered an anti-pattern by some?
**A:** It creates global state that can change and hides dependencies, making unit testing harder — a DI-managed singleton usually reaches the same goal in a way that is easier to test.

**Q:** When would you reach for Builder over a constructor?
**A:** When an object has many optional parameters or needs several steps to build — Builder avoids telescoping constructors and reads more clearly.

**Q:** What problem does Prototype solve that Factory doesn't?
**A:** Prototype avoids re-running costly construction logic by copying a ready-made instance, instead of building a new one from scratch each time.

## Scenario
A UI library needs to render buttons and checkboxes the same way across "light" and "dark" themes, without the calling code knowing which theme is active. An Abstract Factory (`LightThemeFactory`, `DarkThemeFactory`), each making matching `Button`/`Checkbox` objects, lets client code ask for components without being tied to one theme's actual classes.

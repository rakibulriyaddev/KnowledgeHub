---
id: abstract-factory-pattern
title: "Abstract Factory Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Abstract Factory provides an interface for creating families of related objects without specifying their concrete classes. Where Factory Method produces one product via inheritance, Abstract Factory produces a coordinated set of products via composition — guaranteeing the products it creates are compatible with each other.

## Key Concepts
- Abstract factory interface — declares creation methods for each product in the family
- Concrete factories — one per product family/variant, implementing all creation methods
- Product families — sets of related products meant to be used together
- Client code depends only on abstract factory and abstract product interfaces

## Core Knowledge
- The key guarantee is cross-product consistency — a client using one concrete factory gets a matching set of products, never mismatched combinations
- Adding a new product family means adding one new concrete factory implementing all creation methods — an OCP-friendly extension
- Adding a new *kind* of product to the family requires changing the abstract factory interface and every concrete factory — the pattern's main extension cost
- Frequently implemented using Factory Method internally — each creation method on the abstract factory can itself be a Factory Method
- Common in cross-platform UI toolkits, where one factory produces a consistent set of native-looking widgets per platform
- Overkill for single-product creation — Abstract Factory pays off specifically when products must be created in matched sets
- DI containers can partially replace hand-rolled Abstract Factory by resolving a whole family of related registered implementations by profile/environment

## Interview Questions
**Q:** What's the core guarantee Abstract Factory provides that plain factories don't?
**A:** That all objects created by one concrete factory belong to the same compatible family — preventing accidental mixing of incompatible variants.

**Q:** What's the cost of adding a new product type (not family) to an Abstract Factory design?
**A:** Every concrete factory implementation must be updated to support the new creation method — this violates OCP at the factory interface level.

**Q:** Give a real-world use case for Abstract Factory.
**A:** A cross-platform UI library where `WindowsFactory` and `MacFactory` each produce native-looking buttons, checkboxes, and menus consistent with their platform.

**Q:** How does Abstract Factory relate to Factory Method?
**A:** Abstract Factory is often implemented as a collection of Factory Methods — one per product type in the family — bundled behind a single factory interface.

## Scenario
A theming system needs consistent light/dark variants of buttons, dialogs, and menus, and mixing a light button with a dark dialog would look broken. A `LightThemeFactory` and `DarkThemeFactory` each implement `createButton()`, `createDialog()`, `createMenu()` — client code picks one factory based on the active theme and every component it creates is guaranteed to match.

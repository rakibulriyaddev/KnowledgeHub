---
id: abstract-factory-pattern
title: "Abstract Factory Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Abstract Factory gives a way to make groups of related objects without saying which exact classes to use. Factory Method makes one product through inheritance. Abstract Factory makes a matching set of products through composition — it makes sure the products it creates work well together.

## Key Concepts
- Abstract factory interface — lists creation methods for each product in the group
- Concrete factories — one for each product family/variant, they build all products
- Product families — sets of related products meant to be used together
- Client code only depends on the abstract factory and abstract product interfaces

## Core Knowledge
- The main guarantee is that products match — a client using one concrete factory always gets a matching set, never a mixed-up combo
- Adding a new product family just means adding one new concrete factory that builds all the products — easy to add, following the open/closed rule
- Adding a new *kind* of product to the family means changing the abstract factory interface and every concrete factory — this is the pattern's main cost
- Often built using Factory Method inside it — each creation method on the abstract factory can itself be a Factory Method
- Common in cross-platform UI toolkits, where one factory builds a matching set of native-looking widgets for each platform
- Too much for making just one product — Abstract Factory is worth it only when products must be made in matched sets
- DI containers can replace hand-built Abstract Factory by resolving a full family of related registered pieces by profile/environment

## Interview Questions
**Q:** What's the main guarantee Abstract Factory gives that plain factories don't?
**A:** That all objects made by one concrete factory belong to the same matching family — this stops incompatible parts from mixing by accident.

**Q:** What's the cost of adding a new product type (not family) to an Abstract Factory design?
**A:** Every concrete factory must be updated to support the new creation method — this breaks the open/closed rule at the factory interface level.

**Q:** Give a real-world use case for Abstract Factory.
**A:** A cross-platform UI library where `WindowsFactory` and `MacFactory` each build native-looking buttons, checkboxes, and menus that match their platform.

**Q:** How does Abstract Factory relate to Factory Method?
**A:** Abstract Factory is often built as a group of Factory Methods — one for each product type in the family — put together behind one factory interface.

## Scenario
A theming system needs matching light/dark versions of buttons, dialogs, and menus, and mixing a light button with a dark dialog would look wrong. A `LightThemeFactory` and `DarkThemeFactory` each build `createButton()`, `createDialog()`, `createMenu()` — client code picks one factory based on the active theme, and every part it makes is sure to match.

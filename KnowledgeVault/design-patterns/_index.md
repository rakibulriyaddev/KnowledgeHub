---
id: design-patterns
title: "Design Patterns"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: oop
children: [creational-patterns, structural-patterns, behavioral-patterns]
status: draft
---

## Overview
Design patterns are named, reusable answers to design problems that keep coming up in object-oriented code. They give engineers a shared way to talk about structure ("just use a Strategy here") instead of working it out from scratch every time. The main list of patterns comes from a 1994 book by four authors (the "Gang of Four", or GoF), grouped into three types based on what they are for.

## Key Concepts
- Creational — patterns for making objects, kept separate from how they get used (Singleton, Factory Method, Abstract Factory, Builder, Prototype)
- Structural — patterns for putting classes and objects together into bigger structures (Adapter, Decorator, Facade, Proxy, Composite, Bridge, Flyweight)
- Behavioral — patterns for how objects work together and share work (Strategy, Observer, Command, Iterator, State, Template Method, Chain of Responsibility, Mediator, Memento, Visitor)
- Pattern vs principle — patterns are real, recurring shapes; SOLID principles are the reasons that tell you when to use them
- Anti-patterns — what goes wrong when a pattern is used where it does not fit

## Core Knowledge
- Patterns are named shapes, not rules you must follow — forcing one in where it is not needed just adds extra layers with no real gain
- Most GoF patterns are older than, and not tied to, any single language, though modern language features (lambdas, first-class functions) make some (Strategy, Command) easy without a full class hierarchy
- Using too many patterns ("patternitis") is a common sign of a junior engineer; senior engineers only reach for one when the same shape truly keeps showing up
- Many patterns line up directly with SOLID principles in practice — Strategy follows the Open/Closed Principle, and Adapter/Facade help with the kind of decoupling DIP asks for
- Patterns built on composition (Strategy, Decorator, Composite) are usually better than ones built on heavy inheritance, because they stay more flexible
- In interviews, you mostly need to spot the right pattern in a scenario and explain its tradeoffs, not draw UML diagrams from memory
- Some patterns solve problems modern tools already handle — for example, Singleton is often replaced by lifetimes managed by a DI container
- Pattern names work as a shared vocabulary — their main value is making it faster for a team to talk about code, not the code itself

## Interview Questions
**Q:** What are the three GoF pattern categories?
**A:** Creational (making objects), Structural (putting objects/classes together), Behavioral (how objects interact and share work).

**Q:** How do design patterns relate to SOLID principles?
**A:** Principles explain why; patterns show how — many patterns are just named ways of using one or more SOLID principles.

**Q:** What's the risk of overusing design patterns?
**A:** Extra layers and complexity for no real reason — using a pattern where a simpler, direct solution would work just as well.

**Q:** Are design patterns tied to one language?
**A:** No — they're general ideas; some (like Singleton or Visitor) are needed less in languages that already have modules, closures, or built-in DI.

## Scenario
A codebase has payment code that branches on provider type through a growing if/else chain. It also has a notification system that needs new channels (email, SMS, push) added without changing the existing dispatch code. Seeing the first as a good fit for Strategy, and the second as a fit for Observer/pub-sub, lets the team name the right shape right away, instead of designing it from scratch each time.

---
id: design-patterns
title: "Design Patterns"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: null
children: [creational-patterns, structural-patterns, behavioral-patterns]
status: draft
---

## Overview
Design patterns are named, reusable solutions to recurring object-oriented design problems — a shared vocabulary that lets engineers communicate structure ("just use a Strategy here") instead of re-deriving it from scratch. The canonical catalog comes from the 1994 "Gang of Four" (GoF) book, grouped into three categories by intent.

## Key Concepts
- Creational — object creation logic decoupled from usage (Singleton, Factory Method, Abstract Factory, Builder, Prototype)
- Structural — composing classes/objects into larger structures (Adapter, Decorator, Facade, Proxy, Composite, Bridge, Flyweight)
- Behavioral — object collaboration and responsibility distribution (Strategy, Observer, Command, Iterator, State, Template Method, Chain of Responsibility, Mediator, Memento, Visitor)
- Pattern vs principle — patterns are concrete recurring shapes; SOLID principles are the reasoning that justifies choosing them
- Anti-patterns — the failure mode of applying a pattern where it doesn't fit

## Core Knowledge
- Patterns are named shapes, not mandatory templates — forcing one where the problem doesn't call for it adds indirection without payoff
- Most GoF patterns predate and are independent of any specific language, though modern language features (lambdas, first-class functions) make some (Strategy, Command) trivial without a formal class hierarchy
- Overuse ("patternitis") is a real career-stage smell — junior engineers often over-apply patterns; senior engineers reach for them only when the shape genuinely recurs
- Many patterns map directly to SOLID principles in practice — Strategy implements OCP, Adapter/Facade support DIP-style decoupling
- Composition-based patterns (Strategy, Decorator, Composite) are generally preferred over inheritance-heavy ones for flexibility
- Interview usage skews toward recognizing the pattern in a scenario and naming tradeoffs, not reciting UML diagrams
- Some patterns solve problems largely obsolete in modern stacks (e.g. Singleton is often replaced by DI container-managed lifetimes)
- Pattern names function as a shared vocabulary — the main value is communication efficiency across a team, not the code itself

## Interview Questions
**Q:** What are the three GoF pattern categories?
**A:** Creational (object creation), Structural (composing objects/classes), Behavioral (object interaction/responsibility).

**Q:** How do design patterns relate to SOLID principles?
**A:** Principles are the reasoning (why); patterns are concrete recurring solutions (how) — many patterns are just named applications of one or more SOLID principles.

**Q:** What's the risk of overusing design patterns?
**A:** Unnecessary indirection and complexity — applying a pattern where the simpler direct solution would do, purely for the sake of using a named pattern.

**Q:** Are design patterns language-specific?
**A:** No — they're conceptual solutions; some (like Singleton or Visitor) are less needed in languages with modules, closures, or built-in DI support.

## Scenario
A codebase has payment logic branching on provider type with a growing if/else chain, and a notification system that needs to add new channels (email, SMS, push) without editing existing dispatch code. Recognizing the first as a Strategy candidate and the second as Observer/pub-sub lets the team name the target shape immediately instead of designing from first principles each time.

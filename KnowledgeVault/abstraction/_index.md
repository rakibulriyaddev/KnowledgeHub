---
id: abstraction
title: "Abstraction"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, interface-design]
parent: oop
children: []
status: draft
---

## Overview
Abstraction means modeling only the parts of a concept that matter for the problem, and hiding everything else behind a simpler interface. It is the design goal that encapsulation carries out — abstraction decides *what* to show, encapsulation makes sure it stays hidden.

## Key Concepts
- Essential vs incidental complexity — abstraction removes detail that doesn't matter to the caller
- Interfaces and abstract classes — the main language tools for building an abstraction
- Levels of abstraction — a system is a stack of these, each one hiding the layer below
- Abstraction vs encapsulation — a design choice vs the method that enforces it
- Leaky abstractions — when hidden details show up anyway and break the simple picture

## Core Knowledge
- Abstraction is a modeling choice made before any code is written — encapsulation is the method used to protect it
- A good abstraction picks the smallest interface that fully covers what the caller needs — too much abstraction just adds extra steps with no gain
- "Almost every abstraction leaks a little" — for example, a network call hidden behind a method can still time out
- Abstraction layers let big systems be understood one part at a time — a caller trusts the interface without needing to know how it works inside
- Building an abstraction too early (guessing at future change) can cost as much as having none — the YAGNI rule applies here directly
- Abstract classes bundle some working code with a contract; interfaces are pure contracts — the choice shapes how much is hidden vs shared
- Too many abstraction layers slow down debugging — each layer must be worked through by hand to find where a bug really is
- Good abstractions come from real, repeated cases already seen in code, not from guessing ahead of time

## Interview Questions
**Q:** What's the difference between abstraction and encapsulation?
**A:** Abstraction is the design choice of what to show and what to hide; encapsulation is the method (access modifiers, bundling) that makes sure it stays hidden.

**Q:** What is a "leaky abstraction"?
**A:** An abstraction that hides its inner details in normal cases, but lets them show under some conditions — for example, an ORM hiding SQL until a slow query forces you to think about it anyway.

**Q:** Why can too much abstraction hurt a codebase?
**A:** Extra layers make code harder to follow and debug, and they often exist to support flexibility that never actually gets used.

**Q:** How do you decide the right level of abstraction for an interface?
**A:** Base it on real, seen differences between working versions, not guesses — only make abstract what truly differs.

## Scenario
A reporting module needs to get data from either a SQL database or a REST API, depending on where it's set up. Making a `DataSource` abstraction with one `fetch()` method lets the reporting logic stay unaware of which one is behind it, so a new source type can be added without changing any report code.

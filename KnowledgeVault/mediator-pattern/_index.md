---
id: mediator-pattern
title: "Mediator Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Mediator centralizes complex communication between a set of objects into a single coordinator, so those objects no longer refer to each other directly. It replaces a tangled many-to-many web of direct references with a hub-and-spoke structure, trading direct coupling for coupling to the mediator.

## Key Concepts
- Mediator interface — defines how colleagues communicate through the hub
- Concrete mediator — implements the coordination/business logic between colleagues
- Colleagues — the participant objects that only know the mediator, not each other
- Centralized control logic — interaction rules live in the mediator, not scattered across colleagues

## Core Knowledge
- Without Mediator, N objects communicating directly can require up to N² relationships; Mediator reduces this to N relationships, each colleague to the mediator only
- Colleagues become simpler and more reusable in isolation since they no longer hold references to each other, only to the mediator interface
- The tradeoff is concentration of complexity — the mediator itself can become a large, hard-to-maintain "god object" if it accumulates too much interaction logic
- Differs from Observer — Observer is a direct one-to-many broadcast from a known subject; Mediator routes many-to-many communication through a central object that actively coordinates behavior, not just notifies
- Common in UI dialogs — a dialog mediator coordinates how form fields, buttons, and validation messages react to each other's state changes
- Well-suited when a set of objects' interactions are complex and would otherwise be duplicated pairwise across many direct references
- Overuse for simple, low-interaction object sets adds unnecessary indirection — Mediator earns its complexity specifically when interaction logic is genuinely tangled

## Interview Questions
**Q:** What problem does Mediator solve?
**A:** It replaces many-to-many direct object references (up to N² relationships) with each object only knowing a central mediator, reducing coupling to N relationships.

**Q:** What's the main risk of using Mediator?
**A:** The mediator itself can grow into a large, hard-to-maintain object as it accumulates all the interaction logic previously spread across the colleagues.

**Q:** How does Mediator differ from Observer?
**A:** Observer is a one-directional broadcast from a subject to its observers; Mediator actively coordinates bidirectional, many-to-many interaction logic between colleague objects through a central hub.

**Q:** Give a real-world example of Mediator.
**A:** An air traffic control tower coordinating multiple aircraft — planes don't communicate directly with each other, only with the tower, which manages the interaction logic.

## Scenario
A UI form has a dropdown, several text fields, and a submit button whose enabled state depends on multiple fields' validity, and fields need to react to each other's changes. A `FormMediator` coordinates all these interactions centrally — the fields and button only notify the mediator of their own changes, without needing direct references to each other.

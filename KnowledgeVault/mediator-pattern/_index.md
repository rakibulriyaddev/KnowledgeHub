---
id: mediator-pattern
title: "Mediator Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Mediator puts all the complex talk between a group of objects into one central coordinator, so those objects no longer point to each other directly. It replaces a tangled many-to-many web of direct links with a hub-and-spoke shape, trading direct coupling for coupling to the mediator instead.

## Key Concepts
- Mediator interface — defines how colleagues communicate through the hub
- Concrete mediator — holds the actual coordination and business logic between colleagues
- Colleagues — the participant objects that only know the mediator, not each other
- Centralized control logic — the rules for how objects interact live in the mediator, not spread across colleagues

## Core Knowledge
- Without Mediator, N objects talking directly to each other can need up to N² links. Mediator cuts this down to N links, since each colleague only talks to the mediator.
- Colleagues become simpler and easier to reuse on their own, since they no longer hold links to each other — only to the mediator interface.
- The tradeoff is that complexity piles up in one place — the mediator itself can grow into a large, hard-to-maintain "god object" if it takes on too much interaction logic.
- It differs from Observer. Observer is a direct one-to-many broadcast from a known subject. Mediator routes many-to-many communication through a central object that actively coordinates behavior, not just sends notices.
- Common in UI dialogs — a dialog mediator controls how form fields, buttons, and validation messages react to changes in each other's state.
- It fits well when a group of objects' interactions are complex, and the logic would otherwise be copied pair by pair across many direct links.
- Using it for simple object sets with little interaction just adds needless indirection — Mediator is worth its added complexity only when the interaction logic is genuinely tangled.

## Interview Questions
**Q:** What problem does Mediator solve?
**A:** It replaces many-to-many direct object links (up to N² relationships) with each object only knowing a central mediator, cutting coupling down to N relationships.

**Q:** What's the main risk of using Mediator?
**A:** The mediator itself can grow into a large, hard-to-maintain object as it takes on all the interaction logic that used to be spread across the colleagues.

**Q:** How does Mediator differ from Observer?
**A:** Observer is a one-way broadcast from a subject to its observers. Mediator actively coordinates two-way, many-to-many interaction logic between colleague objects through a central hub.

**Q:** Give a real-world example of Mediator.
**A:** An air traffic control tower coordinating many aircraft — planes do not talk directly to each other, only to the tower, which manages the interaction logic.

## Scenario
A UI form has a dropdown, several text fields, and a submit button whose enabled state depends on whether several fields are valid, and the fields need to react to each other's changes. A `FormMediator` coordinates all of this in one place — the fields and button only tell the mediator about their own changes, and never need direct links to each other.

---
id: behavioral-patterns
title: "Behavioral Patterns"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: design-patterns
children: [strategy-pattern, observer-pattern, command-pattern, iterator-pattern, state-pattern, template-method-pattern, chain-of-responsibility-pattern, mediator-pattern, memento-pattern, visitor-pattern]
status: draft
---

## Overview
Behavioral patterns focus on how objects talk to each other, spread out responsibility, and change steps or workflows while the program runs. Where structural patterns shape how objects are put together, behavioral patterns shape how objects work together — often the biggest and most varied GoF group.

## Key Concepts
- Strategy — wraps up interchangeable steps/algorithms behind one shared interface
- Observer — one-to-many notice sent out when a subject's state changes
- Command — wraps up a request/action as an object
- Iterator — moves through a collection without showing its inner structure
- State — an object's behavior changes based on its own internal state
- Template Method — sets an algorithm's outline, subclasses fill in the steps
- Chain of Responsibility, Mediator, Memento, Visitor — handler chains, one central point for talk, saved snapshots of state, and outside actions run over object structures

## Core Knowledge
- Most behavioral patterns are about swapping conditional logic or tight linking for polymorphism or indirection — Strategy replaces switching between algorithms, State replaces state-flag conditionals
- Observer and Mediator both deal with objects talking to each other, but differently — Observer is one-to-many broadcast, Mediator gathers many-to-many talk through one coordinator
- Command turns actions into full objects, allowing undo/redo, queuing, and logging of actions — something a plain method call can't do
- Iterator keeps traversal logic separate from a collection's inner setup, letting the same client code work over arrays, trees, or linked structures the same way
- State and Strategy have almost the same structure (both swap in an interchangeable object) but differ in purpose — State changes based on internal shifts, Strategy is picked by the client
- Modern languages with first-class functions can build many behavioral patterns (Strategy, Command, Observer via events) without formal class hierarchies
- Chain of Responsibility and Mediator both keep senders separate from receivers, but Chain passes a request along a line of handlers, while Mediator routes it through one central hub

## Interview Questions
**Q:** What's the difference between Strategy and State patterns, given their almost identical structure?
**A:** Strategy is about a client picking an interchangeable algorithm; State is about an object's own internal shifts changing its behavior on their own, based on context.

**Q:** How does Observer differ from Mediator for object communication?
**A:** Observer is one-to-many — a subject broadcasts to any number of listeners; Mediator gathers many-to-many talk so objects speak through one coordinator instead of directly to each other.

**Q:** Why is Command useful beyond a plain function call?
**A:** Because it wraps up a request as an object, allowing things a bare method call can't — queuing, logging, undo/redo, and delayed running.

**Q:** What problem does Iterator solve?
**A:** It gives one shared way to move through different collection types without showing their inner structure to client code.

## Scenario
An e-commerce checkout needs to support several discount algorithms, cart actions that can be undone, and telling several unrelated systems (email, inventory, analytics) when an order finishes. Strategy handles interchangeable discount algorithms, Command wraps cart actions to allow undo, and Observer tells all interested subsystems when an order finishes, without the checkout logic knowing who's listening.

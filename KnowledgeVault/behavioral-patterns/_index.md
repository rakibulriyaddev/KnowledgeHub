---
id: behavioral-patterns
title: "Behavioral Patterns"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: design-patterns
children: [strategy-pattern, observer-pattern, command-pattern, iterator-pattern, state-pattern, template-method-pattern, chain-of-responsibility-pattern, mediator-pattern, memento-pattern, visitor-pattern]
status: draft
---

## Overview
Behavioral patterns focus on how objects communicate, distribute responsibility, and vary algorithms or workflows at runtime. Where structural patterns shape object composition, behavioral patterns shape object collaboration — often the largest and most varied GoF category.

## Key Concepts
- Strategy — encapsulates interchangeable algorithms behind a common interface
- Observer — one-to-many notification when subject state changes
- Command — encapsulates a request/action as an object
- Iterator — traverses a collection without exposing its internal structure
- State — object behavior changes based on internal state
- Template Method — defines an algorithm skeleton, subclasses fill in steps
- Chain of Responsibility, Mediator, Memento, Visitor — handler chains, centralized communication, state snapshots, and external operations over object structures

## Core Knowledge
- Most behavioral patterns are about replacing conditional logic or tight coupling with polymorphism or indirection — Strategy replaces algorithm switches, State replaces state-flag conditionals
- Observer and Mediator both address object communication but differently — Observer is one-to-many broadcast, Mediator centralizes many-to-many communication through one coordinator
- Command turns actions into first-class objects, enabling undo/redo, queuing, and logging of operations — something a plain method call can't do
- Iterator decouples traversal logic from the collection's internal representation, letting the same client code work over arrays, trees, or linked structures identically
- State and Strategy share nearly identical structure (both swap in a interchangeable object) but differ in intent — State changes based on internal transitions, Strategy is chosen by the client
- Modern languages with first-class functions implement many behavioral patterns (Strategy, Command, Observer via events) without formal class hierarchies
- Chain of Responsibility and Mediator both decouple senders from receivers, but Chain passes a request along a line of handlers, while Mediator routes through one central hub

## Interview Questions
**Q:** What's the difference between Strategy and State patterns given their nearly identical structure?
**A:** Strategy is about a client choosing an interchangeable algorithm; State is about an object's own internal transitions changing its behavior automatically based on context.

**Q:** How does Observer differ from Mediator for object communication?
**A:** Observer is one-to-many — a subject broadcasts to any number of listeners; Mediator centralizes many-to-many communication so objects talk through one coordinator instead of directly to each other.

**Q:** Why is Command useful beyond a plain function call?
**A:** Because it encapsulates a request as an object, enabling features a bare method call can't — queuing, logging, undo/redo, and deferred execution.

**Q:** What problem does Iterator solve?
**A:** It provides a uniform way to traverse different collection types without exposing their internal structure to client code.

## Scenario
An e-commerce checkout needs to support multiple discount algorithms, undoable cart operations, and notifying several unrelated systems (email, inventory, analytics) when an order completes. Strategy handles interchangeable discount algorithms, Command wraps cart operations for undo support, and Observer notifies all interested subsystems on order completion without checkout logic knowing who's listening.

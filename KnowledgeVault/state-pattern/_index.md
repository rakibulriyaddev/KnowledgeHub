---
id: state-pattern
title: "State Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
State lets an object change how it behaves when its inner state changes, making it look like it changed its class. It replaces long, spread-out if/else logic based on a state flag or enum, and instead uses polymorphism, handing behavior off to one object per state.

## Key Concepts
- Context — the object whose behavior changes; it holds a reference to its current state object
- State interface — the shared contract that every concrete state follows
- Concrete states — one class per state, holding that state's behavior and often triggering the move to the next state
- State transitions — moving the context to a new state object, either from inside the state itself or from the context

## Core Knowledge
- Directly replaces `if (state == X) ... else if (state == Y) ...` chains spread across a class with one class per state
- Built almost the same way as Strategy, but the intent is different — State changes are driven by the object's own inner logic in response to events, not chosen from outside by a client
- The logic for moving between states can live in the state itself (each state decides what comes next) or be kept in one place, in the context — an important choice that affects how easy the whole state machine is to follow
- Fits well with clear state machines: order handling (pending → shipped → delivered), connection life cycles, steps in a UI flow
- Adding a new state just means adding a new class that follows the state interface — an easy, OCP-friendly way to grow, instead of editing a growing if/else chain
- Too much for objects with only two simple states and no real difference in behavior — a simple true/false flag may be clearer
- State objects can have no data and be shared (like a flyweight) if they hold nothing specific to one context, or can be made one-per-instance if they need to track context-specific details

## Interview Questions
**Q:** What problem does State solve?
**A:** It replaces if/else logic based on an object's current state with polymorphism, keeping each state's behavior in its own class.

**Q:** How does State differ from Strategy given their similar structure?
**A:** State changes happen on their own, based on the object's own inner logic and events; Strategy is picked directly by an outside client, based on its own choice.

**Q:** Where should state transition logic live?
**A:** Either inside each concrete state (deciding what the next state is) or kept in one place in the context — a tradeoff between keeping transition logic close to the state versus being able to see the whole state machine at once.

**Q:** When is State overkill?
**A:** For objects with only a couple of simple states and little difference in behavior between them — a boolean or enum with simple if/else may be clearer than a full set of classes.

## Scenario
An order object behaves differently depending on whether it's `Pending`, `Shipped`, or `Delivered` — cancelling should work while `Pending` but not while `Shipped`. Each status becomes an `OrderState` class with its own `cancel()`, `ship()`, `deliver()` behavior, so the order class just hands work off to its current state object, instead of checking a status field everywhere.

---
id: state-pattern
title: "State Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
State lets an object alter its behavior when its internal state changes, appearing to change its class. It replaces sprawling conditional logic keyed on a state flag/enum with polymorphism, delegating behavior to a dedicated object per state.

## Key Concepts
- Context — the object whose behavior varies, holds a reference to its current state object
- State interface — common contract each concrete state implements
- Concrete states — one class per distinct state, implementing behavior and often triggering transitions
- State transitions — moving the context to a new state object, either from within the state or from the context

## Core Knowledge
- Directly replaces `if (state == X) ... else if (state == Y) ...` chains scattered across a class with one class per state
- Structurally near-identical to Strategy, but intent differs — State transitions are driven by the object's own internal logic in response to events, not chosen externally by a client
- Transition logic can live in the state itself (each state decides the next state) or be centralized in the context — a key design decision affecting how easy the state machine is to reason about
- Well-suited to explicit state machines: order processing (pending → shipped → delivered), connection lifecycles, UI workflow steps
- Adding a new state means adding a new class implementing the state interface — an OCP-friendly extension over editing a growing conditional
- Overkill for objects with only two simple states and no complex per-state behavior — a boolean flag may be clearer
- State objects can be stateless and shared (flyweight-style) if they hold no per-context data, or per-instance if they need to track context-specific info

## Interview Questions
**Q:** What problem does State solve?
**A:** It replaces conditional logic branching on an object's current state with polymorphism, isolating each state's behavior into its own class.

**Q:** How does State differ from Strategy given their similar structure?
**A:** State transitions happen automatically based on the object's own internal logic and events; Strategy is explicitly selected by an external client based on its own choice.

**Q:** Where should state transition logic live?
**A:** Either within each concrete state (deciding what the next state is) or centralized in the context — a tradeoff between locality of transition logic and ease of seeing the whole state machine at once.

**Q:** When is State overkill?
**A:** For objects with only a couple of simple states and minimal per-state behavior differences — a boolean or enum with simple branching may be clearer than a full class hierarchy.

## Scenario
An order object behaves differently depending on whether it's `Pending`, `Shipped`, or `Delivered` — cancelling should work in `Pending` but not `Shipped`. Each status becomes a `OrderState` implementation with its own `cancel()`, `ship()`, `deliver()` behavior, so the order class delegates to its current state object instead of branching on a status field everywhere.

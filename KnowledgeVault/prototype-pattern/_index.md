---
id: prototype-pattern
title: "Prototype Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Prototype creates new objects by cloning an existing, fully-configured instance rather than constructing from scratch. It pays off when object creation is expensive or complex, and an existing instance is a cheaper starting point than rebuilding from raw inputs.

## Key Concepts
- Clone method — each prototype exposes a way to copy itself
- Shallow vs deep copy — whether nested/referenced objects are copied or shared
- Prototype registry — a cache of pre-configured prototypes to clone from by key
- Runtime object creation — new instances derived from a live object, not a class

## Core Knowledge
- Shallow copy shares references to nested mutable objects — a mutation on the clone can unexpectedly affect the original unless deep-copied
- Deep copy fully duplicates the object graph, at the cost of more work per clone — the right depth depends on what state is safe to share
- Useful when construction involves expensive operations (network calls, heavy computation, file parsing) that a clone can skip entirely
- A Prototype registry lets code request "a copy of the X prototype" by name, decoupling client code from concrete construction logic entirely
- Differs from Factory/Builder — those build objects from parameters/steps; Prototype builds them from an existing object's current state
- Language support varies — some languages provide built-in clone semantics (copy constructors, `Object.clone()`, structural cloning); others require manual implementation
- Circular references in the object graph complicate deep copy and need careful handling to avoid infinite recursion

## Interview Questions
**Q:** What's the main benefit of Prototype over constructing objects normally?
**A:** It avoids repeating expensive or complex construction logic by cloning an already-configured instance instead of building from raw inputs.

**Q:** What's the risk of a shallow copy in Prototype?
**A:** Nested mutable objects are shared by reference, so mutating the clone's nested state can unintentionally mutate the original too.

**Q:** How does a Prototype registry work?
**A:** It stores a set of pre-configured prototype instances keyed by type/variant, and client code requests a clone by key instead of constructing a new instance directly.

**Q:** How is Prototype different from Builder?
**A:** Builder constructs an object step by step from parameters; Prototype constructs a new object by copying an existing, already-built one.

## Scenario
A game needs to spawn hundreds of similarly-configured enemy units, each requiring expensive initialization (loading assets, computing stats). Instead of re-running that setup per unit, the game clones a pre-configured prototype enemy and only tweaks position/health per instance, skipping the expensive initialization entirely.

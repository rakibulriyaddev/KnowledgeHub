---
id: prototype-pattern
title: "Prototype Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Prototype makes new objects by copying an existing, fully-set-up instance instead of building from scratch. It pays off when making an object is costly or complex, and an existing instance is a cheaper starting point than rebuilding from raw inputs.

## Key Concepts
- Clone method — each prototype offers a way to copy itself
- Shallow vs deep copy — whether nested/linked objects are copied or shared
- Prototype registry — a stored set of ready-made prototypes to copy from by key
- Runtime object creation — new instances made from a live object, not a class

## Core Knowledge
- Shallow copy shares links to nested changeable objects — a change on the copy can unexpectedly change the original too, unless it's deep-copied
- Deep copy fully duplicates the whole object graph, at the cost of more work per copy — the right depth depends on what state is safe to share
- Useful when building something involves costly work (network calls, heavy computing, file reading) that a copy can skip completely
- A Prototype registry lets code ask for "a copy of the X prototype" by name, keeping the calling code fully separate from the actual building logic
- Different from Factory/Builder — those build objects from parameters/steps; Prototype builds them from an existing object's current state
- Language support varies — some languages have built-in copy tools (copy constructors, `Object.clone()`, structural cloning); others need it built by hand
- Circular links in the object graph make deep copy trickier and need careful handling to avoid an endless loop

## Interview Questions
**Q:** What's the main benefit of Prototype over building objects the normal way?
**A:** It skips repeating costly or complex building steps by copying an already-set-up instance instead of building from raw inputs.

**Q:** What's the risk of a shallow copy in Prototype?
**A:** Nested changeable objects are shared by reference, so changing the copy's nested state can accidentally change the original too.

**Q:** How does a Prototype registry work?
**A:** It stores a set of ready-made prototype instances by type/variant, and calling code asks for a copy by key instead of building a new instance directly.

**Q:** How is Prototype different from Builder?
**A:** Builder builds an object step by step from parameters; Prototype builds a new object by copying an existing, already-built one.

## Scenario
A game needs to create hundreds of similarly set-up enemy units, each needing costly setup (loading assets, computing stats). Instead of re-running that setup for each unit, the game copies a ready-made prototype enemy and only changes position/health per instance, skipping the costly setup completely.

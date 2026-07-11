---
id: memento-pattern
title: "Memento Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Memento captures and externalizes an object's internal state so it can be restored later, without violating encapsulation by exposing that state's internal representation to the code doing the saving. It's the standard mechanism behind undo/history features.

## Key Concepts
- Originator — the object whose state is captured and can restore itself from a memento
- Memento — an opaque snapshot of the originator's state at a point in time
- Caretaker — holds mementos (e.g. in a history stack) without inspecting or modifying their contents
- Encapsulation preservation — the caretaker manages mementos without knowing what's inside them

## Core Knowledge
- The key discipline is that the caretaker never reads or modifies memento contents — only the originator that created a memento knows how to interpret and restore from it
- Frequently paired with Command — each command stores a memento of pre-execution state, letting undo restore it directly instead of computing an inverse operation
- Memory cost can be significant for large object graphs — storing full deep snapshots per history step doesn't scale without pruning, compression, or diff-based storage
- Differs from simply exposing getters/setters for all state — Memento avoids breaking encapsulation by keeping the snapshot's internal shape private to the originator
- Can be implemented with varying snapshot granularity — full state copies, or incremental diffs against the previous state for efficiency
- Common in editors (undo history), games (save states), and transactional systems (rollback points)
- Serialization-based mementos (converting state to a serialized blob) are a common practical implementation, especially for cross-process or persisted history

## Interview Questions
**Q:** What encapsulation problem does Memento solve?
**A:** It lets an object's state be saved and restored externally without exposing that state's internal representation to the code managing the history (the caretaker).

**Q:** What's the caretaker's responsibility in Memento?
**A:** Storing and managing mementos (e.g. in a stack) without inspecting or modifying their internal contents — only the originator can interpret a memento.

**Q:** How does Memento relate to Command for implementing undo?
**A:** Command can capture a Memento of state before executing, so undo restores that snapshot directly instead of the command needing to implement a separate inverse operation.

**Q:** What's a practical concern with Memento at scale?
**A:** Memory usage — storing full state snapshots for every history step can be expensive; diff-based or compressed snapshots mitigate this for large object graphs.

## Scenario
A drawing application needs undo/redo across arbitrary edits without every editing operation implementing its own reverse logic. Each edit triggers the canvas (originator) to produce a memento of its current state, pushed onto a history stack (caretaker) — undo simply restores the canvas from the most recent memento, regardless of what specific edit created it.

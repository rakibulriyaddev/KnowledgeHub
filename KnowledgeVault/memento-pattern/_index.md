---
id: memento-pattern
title: "Memento Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Memento saves an object's internal state outside the object, so it can be restored later. It does this without breaking encapsulation — the code that does the saving never sees how the state is actually shaped inside. It is the standard method behind undo and history features.

## Key Concepts
- Originator — the object whose state is captured and can restore itself from a memento
- Memento — a closed, opaque snapshot of the originator's state at one point in time
- Caretaker — holds mementos (for example, in a history stack) without looking into or changing their contents
- Encapsulation preservation — the caretaker manages mementos without knowing what's inside them

## Core Knowledge
- The key rule is that the caretaker never reads or changes a memento's contents. Only the originator that made a memento knows how to read it and restore from it.
- Often paired with Command — each command stores a memento of the state before it runs, so undo can restore it directly instead of working out an inverse action.
- Memory cost can grow large for big object graphs — storing a full deep snapshot at every history step does not scale well, unless you prune old snapshots, compress them, or store only the differences.
- This is different from just exposing getters and setters for all state — Memento avoids breaking encapsulation by keeping the snapshot's inner shape private to the originator.
- Can be built with different levels of detail — full copies of the state, or small diffs against the previous state, for better efficiency.
- Common in editors (undo history), games (save states), and transactional systems (rollback points)
- Mementos built by turning state into a serialized blob are a common, practical way to build this, especially for history that must cross processes or be saved to disk.

## Interview Questions
**Q:** What encapsulation problem does Memento solve?
**A:** It lets an object's state be saved and restored from outside the object, without showing the state's inner shape to the code that manages history (the caretaker).

**Q:** What's the caretaker's responsibility in Memento?
**A:** Storing and managing mementos (for example, in a stack) without looking at or changing their inner contents — only the originator can read a memento.

**Q:** How does Memento relate to Command for implementing undo?
**A:** A command can capture a Memento of the state before it runs, so undo restores that snapshot directly instead of the command needing to build a separate inverse action.

**Q:** What's a practical concern with Memento at scale?
**A:** Memory use — storing a full state snapshot at every history step can get expensive. Diff-based or compressed snapshots ease this problem for large object graphs.

## Scenario
A drawing app needs undo and redo across any kind of edit, without every edit action having to build its own reverse logic. Each edit makes the canvas (originator) produce a memento of its current state, which is pushed onto a history stack (caretaker). Undo simply restores the canvas from the newest memento, no matter which edit created it.

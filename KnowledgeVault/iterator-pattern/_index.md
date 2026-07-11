---
id: iterator-pattern
title: "Iterator Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Iterator provides a way to access elements of a collection sequentially without exposing its underlying representation. It decouples traversal logic from the collection's internal structure, letting the same client code walk arrays, trees, or linked structures identically.

## Key Concepts
- Iterator interface — typically `hasNext()`/`next()` or equivalent cursor operations
- Concrete iterator — tracks traversal position/state for a specific collection type
- Aggregate/collection interface — exposes a method to create an iterator over itself
- External vs internal iteration — client drives traversal (external) vs the collection drives it via callback (internal, e.g. `forEach`)

## Core Knowledge
- The core benefit is decoupling — client code traverses via a uniform interface regardless of whether the underlying structure is an array, linked list, tree, or hash map
- Multiple simultaneous, independent iterators over the same collection are supported by giving each iterator its own traversal state
- Modifying a collection while iterating over it (without careful design) causes the classic "concurrent modification" bug — most languages either throw an exception or produce undefined behavior
- External iteration (client calls `next()` explicitly) gives more control (pause, early exit); internal iteration (`forEach`, generators) is more concise but less flexible
- Most modern languages provide Iterator as a first-class built-in feature (iterator protocols, generators/yield) rather than requiring a hand-rolled GoF implementation
- Lazy iterators (generators) can represent infinite or very large sequences without materializing them all in memory upfront
- Different traversal strategies (depth-first, breadth-first, reverse) can be provided as different iterator implementations over the same collection

## Interview Questions
**Q:** What problem does Iterator solve?
**A:** It provides a uniform way to traverse different collection types without exposing their internal structure, decoupling traversal logic from the collection's implementation.

**Q:** What's the difference between external and internal iteration?
**A:** External iteration has the client explicitly call `next()`/check `hasNext()`; internal iteration has the collection drive traversal itself via a callback (e.g. `forEach`), trading control for conciseness.

**Q:** What bug can occur when modifying a collection during iteration?
**A:** Concurrent modification — adding/removing elements mid-traversal can invalidate the iterator's internal position, causing skipped elements, duplicates, or a runtime exception depending on the language.

**Q:** How do generators relate to Iterator?
**A:** Generators (`yield`-based) are a language-level implementation of lazy iteration, producing values on demand — useful for representing large or infinite sequences without materializing them upfront.

## Scenario
A custom tree-based data structure needs to support both depth-first and breadth-first traversal without callers needing to know the tree's internal node representation. Two separate iterator implementations (`DepthFirstIterator`, `BreadthFirstIterator`) expose the same `hasNext()`/`next()` interface, letting client code switch traversal strategy without touching the tree's internals.

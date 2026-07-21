---
id: iterator-pattern
title: "Iterator Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Iterator gives a way to go through the items in a collection one by one without showing how the collection is built inside. It separates the walk-through logic from the collection's inner structure, letting the same client code walk through arrays, trees, or linked structures the same way.

## Key Concepts
- Iterator interface — usually `hasNext()`/`next()` or similar cursor actions
- Concrete iterator — keeps track of position/state for one specific collection type
- Aggregate/collection interface — gives a method to make an iterator over itself
- External vs internal iteration — client drives the walk-through (external) vs the collection drives it through a callback (internal, e.g. `forEach`)

## Core Knowledge
- The main gain is separation — client code walks through items using one uniform way no matter if the structure underneath is an array, linked list, tree, or hash map
- Several separate iterators over the same collection at once are supported by giving each iterator its own tracking state
- Changing a collection while walking through it (without care) causes the classic "concurrent modification" bug — most languages either throw an error or give unclear results
- External iteration (client calls `next()` directly) gives more control (pause, stop early); internal iteration (`forEach`, generators) is shorter to write but less flexible
- Most modern languages give Iterator as a built-in feature (iterator rules, generators/yield) rather than needing it hand-built
- Lazy iterators (generators) can stand for endless or very large sequences without holding them all in memory at once
- Different ways of walking through (depth-first, breadth-first, reverse) can be given as different iterator versions over the same collection

## Interview Questions
**Q:** What problem does Iterator solve?
**A:** It gives one uniform way to walk through different collection types without showing their inner structure, separating the walk-through logic from how the collection is built.

**Q:** What's the difference between external and internal iteration?
**A:** External iteration has the client directly call `next()`/check `hasNext()`; internal iteration has the collection drive the walk-through itself through a callback (e.g. `forEach`), trading control for shorter code.

**Q:** What bug can happen when changing a collection during iteration?
**A:** Concurrent modification — adding/removing items mid-walk can break the iterator's inner position, causing skipped items, duplicates, or a runtime error depending on the language.

**Q:** How do generators relate to Iterator?
**A:** Generators (`yield`-based) are a language-level way to build lazy iteration, giving values as needed — useful for large or endless sequences without holding them all in memory upfront.

## Scenario
A custom tree-based data structure needs to support both depth-first and breadth-first walk-throughs without callers needing to know how the tree stores its nodes inside. Two separate iterator versions (`DepthFirstIterator`, `BreadthFirstIterator`) expose the same `hasNext()`/`next()` interface, letting client code switch walk-through style without touching the tree's inner workings.

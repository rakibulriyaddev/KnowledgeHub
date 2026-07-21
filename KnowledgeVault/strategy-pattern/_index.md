---
id: strategy-pattern
title: "Strategy Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Strategy defines a group of algorithms that can be swapped for each other, wraps each one behind a shared interface, and lets the client pick or swap which one to use while the program is running. It's the standard fix for growing if/else logic that branches on which algorithm to use.

## Key Concepts
- Strategy interface — the shared contract that every algorithm version follows
- Concrete strategies — each swappable algorithm, built out
- Context — the class that uses a strategy, and holds a reference to the current one
- Runtime selection — the strategy can be swapped at any time while the program runs, not fixed when it's built

## Core Knowledge
- Strategy is the standard fix for `if/else` or `switch` chains that branch on which algorithm to use — each branch becomes its own strategy class instead
- It's a direct use of the Open/Closed Principle — adding a new algorithm just means adding a new strategy class, with no change to the context
- In languages with first-class functions, Strategy often needs no formal class structure at all — passing a function reference to the context does the same job
- The context hands everything off to the current strategy — it shouldn't hold any algorithm-specific logic itself, only manage the flow
- Built almost the same way as State, but the intent is different — Strategy is picked directly by the client; State changes are driven by the object's own inner logic
- Using it for a single algorithm that's unlikely to ever change just adds indirection with no real benefit — Strategy pays off when several swappable versions genuinely exist or are expected
- Good for testing — each strategy can be tested on its own, and the context can be tested with a fake/stub strategy

## Interview Questions
**Q:** What problem does Strategy solve?
**A:** It replaces if/else logic that branches on algorithm type with polymorphism, letting new algorithms be added without changing existing code (an OCP application).

**Q:** How does Strategy differ from State, given their nearly identical class structure?
**A:** Strategy is picked directly by the client based on an outside choice; State changes on its own based on the object's own inner logic, often without the client being involved at all.

**Q:** Do you always need a formal Strategy class hierarchy?
**A:** No — in languages with first-class functions, passing a function or lambda as the "strategy" gives the same result without needing formal classes.

**Q:** Give a concrete example of Strategy.
**A:** A shipping cost calculator with `StandardShipping`, `ExpressShipping`, and `FreightShipping` strategies, each with its own `calculateCost(order)` — the checkout context picks one while running, with no if/else needed inside it.

## Scenario
A file compressor needs to support ZIP, GZIP, and RAR formats, and which one to use is chosen per file while running, based on what the user wants. Each format is built as a `CompressionStrategy`, and the compressor context just hands the work off to whichever strategy was picked — adding a new format later only needs a new strategy class, with no change to the compressor itself.

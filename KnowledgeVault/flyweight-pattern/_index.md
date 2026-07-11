---
id: flyweight-pattern
title: "Flyweight Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Flyweight minimizes memory usage by sharing as much state as possible across many similar objects, splitting object state into shareable intrinsic state and per-instance extrinsic state. It matters specifically when an application needs to instantiate a very large number of fine-grained objects.

## Key Concepts
- Intrinsic state — shareable, context-independent data stored once in the flyweight
- Extrinsic state — context-dependent data passed in by the client at use time, not stored in the flyweight
- Flyweight factory — manages a pool of shared flyweight instances, returning existing ones instead of creating duplicates
- Object pooling — related concept, though Flyweight specifically focuses on sharing immutable intrinsic state

## Core Knowledge
- The core technique is separating what's shareable (intrinsic) from what's not (extrinsic) — extrinsic state must be supplied by the caller on each operation, not stored on the flyweight
- Flyweights must be treated as immutable once shared — mutating shared intrinsic state would corrupt every context using that flyweight
- Only worth applying when object count is large enough that per-object overhead genuinely matters — for small object counts the added complexity isn't justified
- Classic textbook example: text rendering, where each character glyph's font/shape data (intrinsic) is shared across every occurrence, while position (extrinsic) is passed per render call
- A flyweight factory typically uses a map/cache keyed by the intrinsic state to avoid creating duplicate flyweights for identical shared data
- Trades memory savings for a small lookup/indirection cost and the design complexity of correctly splitting state
- Modern managed-memory runtimes with efficient small-object allocation reduce (but don't eliminate) how often Flyweight is needed compared to older, memory-constrained environments

## Interview Questions
**Q:** What's the difference between intrinsic and extrinsic state in Flyweight?
**A:** Intrinsic state is shareable and stored once inside the flyweight; extrinsic state is context-specific and supplied by the caller at the point of use, never stored in the shared object.

**Q:** Why must flyweights be immutable?
**A:** Because they're shared across many contexts — mutating one would incorrectly affect every other context referencing that same shared instance.

**Q:** When is Flyweight worth the added complexity?
**A:** Only when the application creates a very large number of fine-grained objects where shared state genuinely dominates memory usage.

**Q:** Give a classic example of Flyweight.
**A:** A text editor sharing one glyph object per character/font/style combination across an entire document, with each character's on-screen position passed in as extrinsic state at render time.

## Scenario
A map rendering application needs to display millions of tree icons across a large map, and instantiating a full icon object per tree would exhaust memory. A Flyweight factory returns a shared icon object (image, color — intrinsic) for all trees of the same type, while each tree's position on the map (extrinsic) is passed in only at render time.

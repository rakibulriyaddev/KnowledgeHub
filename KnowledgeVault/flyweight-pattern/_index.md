---
id: flyweight-pattern
title: "Flyweight Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Flyweight cuts memory use by sharing state across many similar objects. It splits object state into two kinds: intrinsic state (shared) and extrinsic state (per-instance). It matters when an app must create a very large number of small, similar objects.

## Key Concepts
- Intrinsic state — shared data stored once inside the flyweight
- Extrinsic state — data that depends on context, passed in by the caller when used, not stored in the flyweight
- Flyweight factory — keeps a pool of shared flyweight objects and gives back an existing one instead of making a new one
- Object pooling — a related idea, but Flyweight is specifically about sharing state that never changes

## Core Knowledge
- The main trick is splitting what can be shared (intrinsic) from what can't (extrinsic) — the caller must supply extrinsic state each time it uses the flyweight; it is never stored on the flyweight itself
- Flyweights must not change once shared — changing shared intrinsic state would break every place using that flyweight
- Only worth doing when there are enough objects that the memory saved is worth the extra complexity — for a small number of objects, it's not worth it
- Classic example: rendering text, where each letter's font and shape (intrinsic) is shared across every place it appears, while its position on screen (extrinsic) is passed in each time it is drawn
- A flyweight factory usually uses a map or cache, keyed by the intrinsic state, so it never builds the same shared data twice
- It trades memory savings for a small extra lookup cost and the work of splitting state correctly
- Modern languages with fast memory handling need Flyweight less often than older systems with tight memory limits, but it still helps

## Interview Questions
**Q:** What's the difference between intrinsic and extrinsic state in Flyweight?
**A:** Intrinsic state is shared and stored once inside the flyweight; extrinsic state is specific to one use and given by the caller each time, never stored in the shared object.

**Q:** Why must flyweights never change?
**A:** Because many places share the same object — changing it in one place would wrongly change it everywhere else that uses it.

**Q:** When is Flyweight worth the extra complexity?
**A:** Only when an app creates a huge number of small objects and shared state makes up most of the memory use.

**Q:** Give a classic example of Flyweight.
**A:** A text editor sharing one object per letter, font, and style across a whole document, while each letter's position on screen is passed in separately when it is drawn.

## Scenario
A map app must show millions of tree icons on a large map, and making a full object for each tree would use too much memory. A Flyweight factory gives back one shared icon object (image, color — intrinsic) for all trees of the same kind, while each tree's spot on the map (extrinsic) is passed in only when it is drawn.

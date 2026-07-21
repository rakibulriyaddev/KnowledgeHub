---
id: structural-patterns
title: "Structural Patterns"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: design-patterns
children: [adapter-pattern, decorator-pattern, facade-pattern, proxy-pattern, composite-pattern, bridge-pattern, flyweight-pattern]
status: draft
---

## Overview
Structural patterns deal with how classes and objects are put together into bigger structures, while keeping those structures flexible and efficient. Where creational patterns focus on *making* objects, structural patterns focus on *putting them together* — connecting interfaces that don't match, adding new behavior, and making complex parts of a system simpler to use.

## Key Concepts
- Adapter — connects an interface that doesn't match to the one a client expects
- Decorator — adds behavior to an object while running, without needing a subclass
- Facade — gives a simple interface over a complex set of parts
- Proxy — controls access to another object, adding a layer in between
- Composite — treats single objects and groups of them the same way (tree structures)
- Bridge — separates an abstraction from how it's built, so both can change on their own
- Flyweight — shares common data across many objects to save memory

## Core Knowledge
- Structural patterns favor putting objects together over building deep class hierarchies — most avoid deep inheritance in favor of wrapping and handing off work between objects
- Adapter and Facade both make interfaces simpler, but for different reasons — Adapter makes an existing interface match what's expected; Facade makes an interface simpler when it's just naturally complex, not mismatched
- Decorator and Proxy are built almost the same way (both wrap an object with the same interface), but for different reasons — Decorator adds behavior, Proxy controls access
- Composite is the standard fix for tree-shaped data (file systems, UI trees, org charts), where the client shouldn't need to tell a leaf apart from a branch
- Bridge is often mixed up with Adapter — Bridge is planned from the start so two hierarchies can change on their own; Adapter is added later to fix a mismatch that already exists
- Flyweight trades extra computing and lookup work for memory savings — only worth it when there are a lot of objects and much of their data can be shared
- Using too many wrapping layers (long Decorator or Proxy chains) can make bugs harder to find — each layer adds one more step to trace through

## Interview Questions
**Q:** What's the difference between Adapter and Facade?
**A:** Adapter makes one specific mismatched interface match what a client expects; Facade gives a simple entry point over a whole complex set of parts, without necessarily fixing a mismatch.

**Q:** How do Decorator and Proxy differ structurally?
**A:** Both wrap an object behind the same interface, but Decorator's goal is adding or extending behavior, while Proxy's goal is controlling or managing access to the wrapped object.

**Q:** When would you use Composite?
**A:** When client code needs to treat single objects and groups of them the same way — usually for tree-shaped structures like file systems or UI hierarchies.

**Q:** What's the tradeoff of Flyweight?
**A:** Less memory used, thanks to shared data, at the cost of added complexity in telling apart data that can be shared (intrinsic) from data that's per-instance (extrinsic).

## Scenario
A UI framework needs buttons that can optionally get borders, shadows, and scrollbars added in any mix, plus a simple `renderPage()` entry point that hides how complex the rendering process is. Decorators wrap the base button to add optional visual features, while a Facade class offers one simple call that handles layout, styling, and painting behind the scenes.

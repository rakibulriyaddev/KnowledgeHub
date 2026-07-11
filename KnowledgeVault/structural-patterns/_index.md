---
id: structural-patterns
title: "Structural Patterns"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: design-patterns
children: [adapter-pattern, decorator-pattern, facade-pattern, proxy-pattern, composite-pattern, bridge-pattern, flyweight-pattern]
status: draft
---

## Overview
Structural patterns deal with how classes and objects are composed into larger structures while keeping those structures flexible and efficient. Where creational patterns focus on *making* objects, structural patterns focus on *assembling* them — bridging incompatible interfaces, adding behavior, and simplifying complex subsystems.

## Key Concepts
- Adapter — bridges an incompatible interface to the one a client expects
- Decorator — adds behavior to an object dynamically without subclassing
- Facade — provides a simplified interface over a complex subsystem
- Proxy — controls access to another object, adding a layer of indirection
- Composite — treats individual objects and compositions of them uniformly (tree structures)
- Bridge — decouples an abstraction from its implementation so both can vary independently
- Flyweight — shares common state across many objects to reduce memory

## Core Knowledge
- Structural patterns favor object composition over class inheritance — most avoid deep inheritance hierarchies in favor of wrapping/delegating objects
- Adapter and Facade both simplify interfaces but differ in intent — Adapter makes an existing interface match what's expected; Facade simplifies an interface that's inherently complex, not incompatible
- Decorator and Proxy have similar structure (both wrap an object implementing the same interface) but differ in intent — Decorator adds behavior, Proxy controls access
- Composite is the standard solution for tree-shaped data (file systems, UI component trees, org charts) where clients shouldn't need to distinguish leaf from branch
- Bridge is often confused with Adapter — Bridge is designed upfront to let two hierarchies vary independently; Adapter retrofits compatibility after the fact
- Flyweight trades computation/lookup overhead for memory savings — only worth it when object count is very large and much state is shareable
- Overuse of wrapping layers (Decorator chains, Proxy chains) can make debugging harder — each layer adds an indirection to trace through

## Interview Questions
**Q:** What's the difference between Adapter and Facade?
**A:** Adapter makes one specific incompatible interface match what a client expects; Facade provides a simplified entry point over an entire complex subsystem, without necessarily fixing incompatibility.

**Q:** How do Decorator and Proxy differ structurally?
**A:** Both wrap an object behind the same interface, but Decorator's intent is adding/extending behavior, while Proxy's intent is controlling or mediating access to the wrapped object.

**Q:** When would you use Composite?
**A:** When client code needs to treat individual objects and groups of them uniformly — typically for tree-shaped structures like file systems or UI hierarchies.

**Q:** What's the tradeoff of Flyweight?
**A:** Reduced memory via shared state, at the cost of added complexity in separating shareable (intrinsic) from per-instance (extrinsic) state.

## Scenario
A UI framework needs buttons that can optionally have borders, shadows, and scrollbars added in any combination, plus a simplified `renderPage()` entry point that hides the rendering pipeline's complexity. Decorators wrap the base button for optional visual features, while a Facade class exposes one simple call that internally coordinates layout, styling, and painting subsystems.

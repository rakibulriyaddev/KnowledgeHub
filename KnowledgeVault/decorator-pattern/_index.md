---
id: decorator-pattern
title: "Decorator Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Decorator attaches additional responsibilities to an object dynamically by wrapping it in another object implementing the same interface. It's an alternative to subclassing for extending behavior, letting features be composed at runtime in any combination.

## Key Concepts
- Component interface — the shared interface both the base object and decorators implement
- Concrete component — the base object being decorated
- Decorator base — wraps a component reference, delegates by default
- Concrete decorators — add specific behavior before/after delegating to the wrapped component

## Core Knowledge
- Decorators can be stacked — wrapping a decorator in another decorator composes behaviors without a combinatorial explosion of subclasses
- Solves the subclass explosion problem — supporting every combination of N optional features via inheritance would need 2^N subclasses; Decorator needs only N decorator classes
- Each decorator implements the same interface as the component, so client code can't tell (and doesn't need to) how many layers are wrapped
- Order of wrapping can matter — some decorator combinations are only correct in a specific application order (e.g. compress-then-encrypt vs encrypt-then-compress)
- Overly long decorator chains hurt debuggability — stepping through many wrapped layers to find where behavior originates gets tedious
- Common in I/O libraries (stream wrappers), UI toolkits (scrollable/bordered widgets), and middleware pipelines
- Differs from Proxy structurally-identical wrapping — Decorator's intent is adding behavior; Proxy's intent is controlling access, often transparently

## Interview Questions
**Q:** What problem does Decorator solve?
**A:** It lets behavior be added to individual objects dynamically and composably, avoiding a combinatorial explosion of subclasses for every feature combination.

**Q:** How many classes does Decorator need to support N optional features, compared to subclassing?
**A:** N decorator classes (composable in any combination) versus up to 2^N subclasses if each combination needed its own subclass.

**Q:** Does the order of stacking decorators matter?
**A:** Yes in general — some behaviors are only correct applied in a specific order, e.g. compressing data before encrypting versus after.

**Q:** How is Decorator different from Proxy?
**A:** Both wrap an object behind the same interface, but Decorator's purpose is extending behavior while Proxy's purpose is controlling or mediating access to the underlying object.

## Scenario
A coffee-ordering system needs to price combinations of a base coffee with any mix of milk, extra shot, and whipped cream, without a subclass for every combination. Each add-on is a Decorator wrapping an `ICoffee`, adding its cost and description on top of whatever it wraps — ordering a coffee with milk and extra shot just stacks two decorators around the base.

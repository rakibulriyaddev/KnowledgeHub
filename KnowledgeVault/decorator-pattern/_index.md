---
id: decorator-pattern
title: "Decorator Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Decorator adds extra jobs to an object while it runs, by wrapping it in another object that follows the same interface. It's an alternative to subclassing for adding behavior, letting features be combined at runtime in any mix.

## Key Concepts
- Component interface — the shared interface both the base object and decorators follow
- Concrete component — the base object being wrapped
- Decorator base — holds a reference to a component, passes calls through by default
- Concrete decorators — add specific behavior before/after passing the call to the wrapped component

## Core Knowledge
- Decorators can be stacked — wrapping a decorator in another decorator combines behaviors without needing a huge pile of subclasses
- Solves the subclass explosion problem — supporting every mix of N optional features through inheritance would need 2^N subclasses; Decorator needs only N decorator classes
- Each decorator follows the same interface as the component, so calling code can't tell (and doesn't need to know) how many layers are wrapped
- The order of wrapping can matter — some decorator combos are only correct in one order (e.g. squeeze-then-lock vs lock-then-squeeze data)
- Very long decorator chains hurt debugging — stepping through many wrapped layers to find where behavior comes from gets slow and tiring
- Common in I/O libraries (stream wrappers), UI toolkits (scrollable/bordered widgets), and middleware pipelines
- Differs from Proxy, which wraps the same way — Decorator's goal is adding behavior; Proxy's goal is controlling access, often without the caller noticing

## Interview Questions
**Q:** What problem does Decorator solve?
**A:** It lets behavior be added to single objects while running, and combined freely, avoiding a huge pile of subclasses for every feature mix.

**Q:** How many classes does Decorator need to support N optional features, compared to subclassing?
**A:** N decorator classes (combinable in any mix) versus up to 2^N subclasses if each combo needed its own subclass.

**Q:** Does the order of stacking decorators matter?
**A:** Yes, in general — some behaviors are only correct in a specific order, e.g. squeezing data before locking it versus after.

**Q:** How is Decorator different from Proxy?
**A:** Both wrap an object behind the same interface, but Decorator's goal is adding behavior while Proxy's goal is controlling or managing access to the object underneath.

## Scenario
A coffee-ordering system needs to price combos of a base coffee with any mix of milk, extra shot, and whipped cream, without a subclass for every combo. Each add-on is a Decorator wrapping an `ICoffee`, adding its cost and description on top of whatever it wraps — ordering a coffee with milk and extra shot just stacks two decorators around the base.

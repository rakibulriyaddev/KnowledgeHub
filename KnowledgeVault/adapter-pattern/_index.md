---
id: adapter-pattern
title: "Adapter Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Adapter changes the interface of a class into another interface that client code expects, letting mismatched interfaces work together without changing either side. It's the pattern to reach for when adding third-party or old code whose interface doesn't match what the rest of the system uses.

## Key Concepts
- Target interface — the interface the client code expects
- Adaptee — the existing class with the interface that doesn't match
- Object adapter — wraps the adaptee using composition, and builds the target interface
- Class adapter — inherits from the adaptee (where multiple inheritance is possible)

## Core Knowledge
- Object adapter (composition) is usually better than class adapter (inheritance) — it's more flexible, and works even if the adaptee is already used elsewhere
- Adapter changes nothing about the adaptee's code — it wraps and translates, so the adaptee stays reusable elsewhere, unchanged
- Common where systems connect — wrapping a third-party SDK, old API, or differently-shaped data behind the interface your codebase expects
- Two-way adapters (building both interfaces) exist but add complexity — usually adapting in one direction is enough
- Different from Facade — Adapter's job is fixing a specific interface mismatch; Facade's job is making a whole subsystem simpler
- Using Adapter as a permanent fix (instead of a temporary bridge) too often can hide a deeper design problem that should be fixed directly
- Easy to test alone — the adapter is just a thin translation layer, easy to unit test against both interfaces

## Interview Questions
**Q:** What problem does Adapter solve?
**A:** It lets two interfaces that weren't built to work together do so, by wrapping the mismatched one behind the interface the client expects.

**Q:** Object adapter vs class adapter — which is better and why?
**A:** Object adapter (composition) is better — it doesn't need multiple inheritance, works even if the adaptee is already part of another hierarchy, and is easier to change.

**Q:** How does Adapter differ from Facade?
**A:** Adapter fixes an interface mismatch for one existing class; Facade gives a new, simpler interface over a whole subsystem, without necessarily fixing any mismatch.

**Q:** Give a real-world example of Adapter.
**A:** Wrapping a third-party payment SDK's `charge(amount, token)` method behind your own `IPaymentGateway.pay(request)` interface, so the rest of the app never depends on the SDK's shape directly.

## Scenario
A reporting module expects data sources to build `IDataSource.fetchRows()`, but a newly added legacy system only offers `LegacySystem.getRecords(startIdx, count)`. A `LegacySystemAdapter` builds `IDataSource` and calls `getRecords` inside, translating the inputs and the result shape — the reporting module never needs to know the legacy system exists.

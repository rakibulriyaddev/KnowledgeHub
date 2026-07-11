---
id: adapter-pattern
title: "Adapter Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Adapter converts the interface of a class into another interface clients expect, letting incompatible interfaces work together without modifying either side. It's the go-to pattern when integrating third-party or legacy code whose interface doesn't match what the rest of the system uses.

## Key Concepts
- Target interface — the interface the client code expects
- Adaptee — the existing class with the incompatible interface
- Object adapter — wraps the adaptee via composition, implements the target interface
- Class adapter — inherits from the adaptee (where multiple inheritance is available)

## Core Knowledge
- Object adapter (composition) is generally preferred over class adapter (inheritance) — more flexible, works with adaptees that are already subclassed elsewhere
- Adapter changes nothing about the adaptee's code — it wraps and translates, keeping the adaptee reusable elsewhere unmodified
- Common at integration boundaries — wrapping a third-party SDK, legacy API, or differently-shaped data format behind the interface your codebase expects
- Two-way adapters (implementing both interfaces) exist but add complexity — usually one-directional adapting is sufficient
- Distinct from Facade — Adapter's goal is interface compatibility for a specific mismatch; Facade's goal is simplifying a broad subsystem
- Overusing Adapter as a permanent fixture (rather than an integration seam) can hide a deeper design mismatch that should be resolved directly
- Testable in isolation — the adapter itself is a thin translation layer, easy to unit test against both interfaces

## Interview Questions
**Q:** What problem does Adapter solve?
**A:** It lets two interfaces that weren't designed to work together cooperate, by wrapping the incompatible one behind the interface the client expects.

**Q:** Object adapter vs class adapter — which is preferred and why?
**A:** Object adapter (composition) is preferred — it doesn't require multiple inheritance, works even if the adaptee is already part of another hierarchy, and is more flexible to change.

**Q:** How does Adapter differ from Facade?
**A:** Adapter fixes an interface mismatch for a specific existing class; Facade provides a new, simplified interface over an entire subsystem, without necessarily addressing incompatibility.

**Q:** Give a real-world example of Adapter.
**A:** Wrapping a third-party payment SDK's `charge(amount, token)` method behind your own `IPaymentGateway.pay(request)` interface so the rest of the app never depends on the SDK's shape directly.

## Scenario
A reporting module expects data sources implementing `IDataSource.fetchRows()`, but a newly integrated legacy system only exposes `LegacySystem.getRecords(startIdx, count)`. A `LegacySystemAdapter` implements `IDataSource` and internally calls `getRecords`, translating parameters and result shape — the reporting module never needs to know the legacy system exists.

---
id: interface-segregation-principle
title: "Interface Segregation Principle"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Interface Segregation Principle (ISP) states clients shouldn't be forced to depend on methods they don't use — many small, client-specific interfaces beat one large, general-purpose one. It's the "I" in SOLID, aimed directly at "fat interface" designs.

## Key Concepts
- Fat interfaces — one interface bundling unrelated capabilities
- Role interfaces — small interfaces scoped to what a specific client actually needs
- Stub implementations — the smell of `NotImplementedException` in unused interface methods
- Interface composition — a class can implement multiple small interfaces instead of one large one

## Core Knowledge
- A class implementing an interface method it doesn't need, throwing or no-op'ing it, is the canonical ISP violation
- ISP is client-driven — design interfaces around what each consumer needs, not around the full capability of the implementing class
- Splitting fat interfaces improves testability — mocks only need to satisfy the narrow interface actually used
- Overlaps with LSP — a stubbed no-op method used to satisfy an interface can also become an LSP violation if callers expect it to work
- Language support matters — languages with multiple interface implementation (Java, C#, Go) make ISP cheap; single-inheritance-only OOP languages make it harder
- Over-segregating is a real cost too — too many one-method interfaces adds indirection without meaningful benefit
- Common in evolving codebases — an interface grows features over time until most implementers only need a subset
- Role-based interfaces (`IReadable`, `IWritable` instead of one `IRepository` with both) are the standard fix pattern

## Interview Questions
**Q:** What's a concrete symptom of an ISP violation?
**A:** A class implementing an interface that throws `NotImplementedException` or leaves methods empty because it doesn't need that part of the interface's contract.

**Q:** How does ISP differ from SRP?
**A:** SRP is about a class having one reason to change; ISP is about an interface not forcing clients to depend on methods irrelevant to them — SRP targets the implementer's cohesion, ISP targets the consumer's dependency surface.

**Q:** Give an example of fixing an ISP violation.
**A:** Splitting an `IWorker` interface with `work()` and `eat()` into `IWorkable` and `IFeedable` so a `RobotWorker` only implements `IWorkable`, without stubbing `eat()`.

**Q:** Can ISP be over-applied?
**A:** Yes — splitting into too many single-method interfaces adds cognitive overhead and indirection without a corresponding decoupling benefit.

## Scenario
A `IPrinter` interface has `print()`, `scan()`, and `fax()`, and a basic printer class must implement all three even though it only prints — forcing it to throw on `scan()` and `fax()`. Splitting into `IPrint`, `IScan`, `IFax` interfaces lets the basic printer implement only `IPrint`, with no stubbed, misleading methods.

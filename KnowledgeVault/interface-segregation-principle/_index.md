---
id: interface-segregation-principle
title: "Interface Segregation Principle"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Interface Segregation Principle (ISP) says clients shouldn't be forced to depend on methods they don't use — many small, client-specific interfaces beat one large, do-everything one. It's the "I" in SOLID, aimed right at "fat interface" designs.

## Key Concepts
- Fat interfaces — one interface bundling unrelated abilities together
- Role interfaces — small interfaces built around what one specific client actually needs
- Stub code — the warning sign of `NotImplementedException` in unused interface methods
- Interface composition — a class can use several small interfaces instead of one big one

## Core Knowledge
- A class that implements an interface method it doesn't need, by throwing an error or doing nothing, is the clearest ISP problem
- ISP is client-driven — design interfaces around what each user of the code needs, not around everything the implementing class can do
- Splitting fat interfaces makes testing easier — mocks only need to match the small interface actually used
- It overlaps with LSP — a stubbed do-nothing method used just to satisfy an interface can also break LSP if callers expect it to actually work
- Language support matters — languages that allow implementing many interfaces (Java, C#, Go) make ISP cheap; languages that only allow single inheritance make it harder
- Splitting too much is also a real cost — too many one-method interfaces adds extra layers without real benefit
- Common in codebases that grow over time — an interface picks up more and more features until most users only need part of it
- Role-based interfaces (`IReadable`, `IWritable` instead of one `IRepository` with both) are the standard fix

## Interview Questions
**Q:** What's a clear sign of an ISP problem?
**A:** A class that implements an interface but throws `NotImplementedException` or leaves methods empty because it doesn't need that part of the interface's contract.

**Q:** How does ISP differ from SRP?
**A:** SRP is about a class having one reason to change; ISP is about an interface not forcing clients to depend on methods that don't matter to them — SRP is about the code doing the work, ISP is about the code using it.

**Q:** Give an example of fixing an ISP problem.
**A:** Splitting an `IWorker` interface with `work()` and `eat()` into `IWorkable` and `IFeedable` so a `RobotWorker` only implements `IWorkable`, without stubbing `eat()`.

**Q:** Can ISP be overdone?
**A:** Yes — splitting into too many single-method interfaces adds extra mental load and layers without real gain in decoupling.

## Scenario
An `IPrinter` interface has `print()`, `scan()`, and `fax()`, and a basic printer class must implement all three even though it only prints — forcing it to throw errors on `scan()` and `fax()`. Splitting into `IPrint`, `IScan`, `IFax` interfaces lets the basic printer implement only `IPrint`, with no stubbed, misleading methods.

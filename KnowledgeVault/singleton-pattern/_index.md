---
id: singleton-pattern
title: "Singleton Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Singleton makes sure a class has only one instance, and gives one shared way to reach it. It's the easiest GoF pattern to build, but the most argued-about to use, because it puts global changeable state into code that should stay separate.

## Key Concepts
- Private constructor — stops other code from making new instances
- Static accessor — `getInstance()` gives back the one shared instance
- Lazy vs eager setup — instance made on first use, or made right away at load time
- Thread-safety concerns — double-checked locking, static setup holder

## Core Knowledge
- Simple Singleton code is not safe with threads — two threads using it at the same time, without a lock, can end up making two instances instead of one
- Global state makes unit tests hard — tests can't easily swap in a fake instance, and state can leak from one test into the next
- Modern practice swaps a hand-built Singleton for a DI container's "singleton" setting — same one-instance rule, but easier to test and swap out
- Singleton hides what a class needs — a class that calls `Singleton.getInstance()` doesn't show that need in its constructor, unlike DI
- Saving/loading an object (serialization) and reflection can break the one-instance rule if you don't guard against it
- Fair uses still exist: logging, settings, connection pools — anything truly meant to be one per running app
- Using it too much turns Singleton into a global variable in disguise — reviewers often flag this as a smell

## Interview Questions
**Q:** What's wrong with using Singleton for shared state?
**A:** It hides what a class depends on, makes unit testing harder (you can't easily swap in a test double), and can let state leak across test runs or requests.

**Q:** How do you make a Singleton thread-safe when it's built lazily?
**A:** Use double-checked locking, or a static setup holder class that relies on the language runtime's guaranteed thread-safe class loading.

**Q:** How does DI relate to Singleton?
**A:** A DI container that registers a service as "singleton" gives the same one-instance rule, but keeps the need explicit and easy to swap for tests.

**Q:** When is Singleton still a fair choice?
**A:** For app-wide resources that are truly meant to be one — a logger, a settings loader, a connection pool — where testing concerns are small.

## Scenario
An app's logging tool needs one shared instance that writes to a single log file for the whole app, so many writers don't clash over the file. Instead of building a Singleton by hand, the team registers the logger as "singleton" in the DI container — keeping the one-instance rule while still being easy to fake in tests.

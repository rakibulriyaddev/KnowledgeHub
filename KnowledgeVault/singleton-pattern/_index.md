---
id: singleton-pattern
title: "Singleton Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Singleton ensures a class has exactly one instance and provides a global access point to it. It's the simplest GoF pattern to implement and the most controversial to use, since it introduces global mutable state into otherwise decoupled code.

## Key Concepts
- Private constructor — prevents external instantiation
- Static accessor — `getInstance()` returns the single shared instance
- Lazy vs eager initialization — instance created on first use vs at load time
- Thread-safety concerns — double-checked locking, static initialization holder

## Core Knowledge
- Naive Singleton implementations are not thread-safe — concurrent first-access can create two instances without synchronization
- Global state makes unit testing hard — tests can't easily substitute a fake instance, and state leaks between test cases
- Modern practice replaces manual Singleton with a DI container's singleton lifetime — same guarantee, but testable and swappable
- Singleton hides dependencies — a class calling `Singleton.getInstance()` doesn't declare that dependency in its constructor, unlike DI
- Serialization and reflection can break the single-instance guarantee if not explicitly guarded against
- Legitimate uses remain: logging, configuration, connection pools — anything genuinely single per process
- Overuse turns Singleton into a global variable in disguise — a common code-smell flag in reviews

## Interview Questions
**Q:** What's wrong with using Singleton for shared state?
**A:** It creates hidden global dependencies, complicates unit testing (can't substitute test doubles easily), and can leak state across test runs or requests.

**Q:** How do you make a Singleton thread-safe in a lazily-initialized form?
**A:** Double-checked locking, or a static initialization holder class that leverages the language runtime's guaranteed thread-safe class loading.

**Q:** How does DI relate to Singleton?
**A:** A DI container registering a service with singleton lifetime achieves the same one-instance guarantee, but keeps the dependency explicit and swappable for tests.

**Q:** When is Singleton still a reasonable choice?
**A:** For process-wide resources that are genuinely single by nature — a logger, a config loader, a connection pool — where testability concerns are minimal.

## Scenario
An application logging utility needs one shared instance writing to a single log file across the whole app, avoiding file-handle conflicts from multiple writers. Rather than hand-rolling a static-instance Singleton, the team registers the logger with singleton lifetime in the DI container, keeping the one-instance guarantee while staying mockable in tests.

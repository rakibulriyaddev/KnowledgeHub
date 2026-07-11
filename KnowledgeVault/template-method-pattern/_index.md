---
id: template-method-pattern
title: "Template Method Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Template Method defines the skeleton of an algorithm in a base class method, deferring some steps to subclasses without letting them change the algorithm's overall structure. It's inheritance-based reuse focused specifically on fixing the outer shape of a process while varying its parts.

## Key Concepts
- Template method — the base class method defining the fixed algorithm sequence, usually marked final/non-overridable
- Primitive/abstract steps — individual steps subclasses must implement
- Hook methods — optional steps with a default (often no-op) implementation subclasses may override
- Inversion of control — the base class calls subclass-provided steps ("Hollywood principle": don't call us, we'll call you)

## Core Knowledge
- The algorithm's sequence lives in exactly one place (the base class) — subclasses can't reorder or skip steps, only fill in the designated ones
- Hook methods provide optional extension points with sensible defaults, distinct from abstract steps which subclasses must implement
- This is inheritance-based, unlike Strategy which achieves similar variability via composition — Template Method is simpler for small variations but less flexible (single inheritance limits combining variants)
- Common in frameworks — lifecycle methods (`setUp()`/`tearDown()` in test frameworks, `onCreate()`/`onResume()` in UI frameworks) are Template Method in practice
- Overriding the template method itself (if not sealed/final) defeats the pattern's purpose — the fixed algorithm shape is the entire point
- Favor Strategy over Template Method when the varying behavior needs to be swapped at runtime rather than fixed per subclass at compile time
- Reduces duplicated boilerplate across subclasses that would otherwise reimplement the same overall sequence with slight variations

## Interview Questions
**Q:** What does Template Method fix that subclasses reimplementing a whole algorithm wouldn't?
**A:** It centralizes the algorithm's overall sequence in one place, so subclasses only override the specific steps that vary, eliminating duplicated boilerplate for the unchanging parts.

**Q:** What's the difference between an abstract step and a hook method?
**A:** An abstract step has no default implementation and must be overridden; a hook method provides a default (often no-op) implementation that subclasses may optionally override.

**Q:** How does Template Method differ from Strategy?
**A:** Template Method varies behavior via subclass inheritance with a fixed algorithm shape decided at compile time; Strategy varies behavior via composition, swappable at runtime.

**Q:** Give a framework example of Template Method.
**A:** Unit testing frameworks calling `setUp()`, then the test method, then `tearDown()` in a fixed sequence — subclasses only implement the specific steps, not the overall flow.

## Scenario
A data-processing pipeline always needs to read input, transform it, then write output, but the transform step differs per data format (CSV, JSON, XML). A base `DataPipeline` class implements `process()` calling `read()`, `transform()`, `write()` in order, with format-specific subclasses overriding only `transform()` — the overall sequence can never be accidentally reordered by a subclass.

---
id: template-method-pattern
title: "Template Method Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Template Method sets the fixed steps of a process in a base class method, letting subclasses fill in some steps without letting them change the overall order. It's a way to reuse code through inheritance, focused on keeping the outer shape of a process fixed while letting parts of it change.

## Key Concepts
- Template method — the base class method that sets the fixed step order, usually marked so it can't be overridden
- Primitive/abstract steps — single steps that subclasses must fill in
- Hook methods — optional steps with a default (often empty) version that subclasses may change
- Inversion of control — the base class calls the steps subclasses provide ("Hollywood principle": don't call us, we'll call you)

## Core Knowledge
- The order of steps lives in exactly one place (the base class) — subclasses can't reorder or skip steps, only fill in the ones set aside for them
- Hook methods give optional extension points with safe defaults, different from abstract steps which subclasses must fill in
- This uses inheritance, unlike Strategy which gets similar flexibility through composition — Template Method is simpler for small changes but less flexible (using only one base class limits mixing variants)
- Common in frameworks — lifecycle methods (`setUp()`/`tearDown()` in test frameworks, `onCreate()`/`onResume()` in UI frameworks) are Template Method in real use
- Overriding the template method itself (if it's not locked/final) breaks the whole point of the pattern — keeping the step order fixed is the entire goal
- Pick Strategy over Template Method when the changing behavior needs to be swapped while the program runs, instead of fixed per subclass ahead of time
- Cuts down repeated code across subclasses that would otherwise redo the same overall steps with small changes

## Interview Questions
**Q:** What does Template Method fix that subclasses redoing a whole process wouldn't?
**A:** It puts the overall step order in one place, so subclasses only override the steps that change, cutting out repeated code for the parts that stay the same.

**Q:** What's the difference between an abstract step and a hook method?
**A:** An abstract step has no default version and must be overridden; a hook method has a default (often empty) version that subclasses may choose to override.

**Q:** How does Template Method differ from Strategy?
**A:** Template Method changes behavior through subclass inheritance with a fixed step order set ahead of time; Strategy changes behavior through composition, which can be swapped while the program runs.

**Q:** Give a framework example of Template Method.
**A:** Test frameworks calling `setUp()`, then the test method, then `tearDown()` in a fixed order — subclasses only fill in the specific steps, not the overall flow.

## Scenario
A data pipeline always needs to read input, change it, then write output, but the change step is different for each data format (CSV, JSON, XML). A base `DataPipeline` class has a `process()` method that calls `read()`, `transform()`, `write()` in order, with format-specific subclasses only overriding `transform()` — the overall order can never be changed by accident by a subclass.

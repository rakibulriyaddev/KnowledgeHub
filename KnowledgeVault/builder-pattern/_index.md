---
id: builder-pattern
title: "Builder Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Builder separates the construction of a complex object from its representation, assembling it step by step through a dedicated builder object. It solves the "telescoping constructor" problem where a class accumulates many optional parameters, making constructor calls unreadable and error-prone.

## Key Concepts
- Builder interface — declares steps for building parts of the product
- Concrete builder — implements the steps, tracks the in-progress product
- Director (optional) — orchestrates the build steps in a specific order/recipe
- Fluent interface — chained method calls (`.setX().setY().build()`) common in modern Builder implementations

## Core Knowledge
- Telescoping constructors (many overloaded constructors for optional parameter combinations) are the problem Builder directly solves
- Builder allows constructing immutable objects step by step, then finalizing with a `build()` call that validates and freezes state
- Fluent Builder (method chaining returning `this`) is the dominant modern form; the classic GoF Director-based form is less common now
- Distinguishes from Factory — Factory decides *which* class to instantiate; Builder controls *how* one complex object is assembled from parts
- Validation logic belongs in `build()` — catching invalid/incomplete configurations at one clear point rather than scattered setters
- Overuse for simple objects (few optional fields) adds ceremony where a plain constructor or named-parameter language feature would suffice
- Common in configuration objects, HTTP request builders, and query builders (e.g. SQL query builders)

## Interview Questions
**Q:** What problem does Builder solve that a constructor doesn't?
**A:** It avoids telescoping constructors for objects with many optional parameters, and allows staged, readable construction of complex or immutable objects.

**Q:** What's the difference between Builder and Factory?
**A:** Factory chooses which class to instantiate; Builder controls the step-by-step assembly of one complex object's internal parts.

**Q:** Where should validation logic live in a Builder?
**A:** In the final `build()` method — checking the accumulated state is complete and valid before returning the finished, often immutable, object.

**Q:** When is Builder unnecessary?
**A:** When a class has few fields and no complex construction order — a plain constructor or a language's named/default parameters are simpler.

## Scenario
An HTTP client needs to configure optional headers, timeout, retries, and auth tokens before sending a request, and not every request uses every option. A fluent `RequestBuilder` (`.header(...).timeout(...).build()`) lets callers set only what they need, with `build()` validating the final configuration before constructing an immutable `Request` object.

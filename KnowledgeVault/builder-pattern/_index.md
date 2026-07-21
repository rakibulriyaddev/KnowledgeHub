---
id: builder-pattern
title: "Builder Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: creational-patterns
children: []
status: draft
---

## Overview
Builder separates the building of a complex object from what it looks like, putting it together step by step through a dedicated builder object. It fixes the "telescoping constructor" problem, where a class builds up many optional inputs, making constructor calls hard to read and easy to get wrong.

## Key Concepts
- Builder interface — lists the steps for building parts of the product
- Concrete builder — builds the steps, keeps track of the in-progress product
- Director (optional) — runs the build steps in a set order/recipe
- Fluent interface — chained method calls (`.setX().setY().build()`) common in modern Builder setups

## Core Knowledge
- Telescoping constructors (many overloaded constructors for combos of optional inputs) are the problem Builder directly fixes
- Builder lets you build unchangeable objects step by step, then finish with a `build()` call that checks and locks the state
- Fluent Builder (chained methods returning `this`) is the main modern form; the older GoF Director-based form is less common now
- Different from Factory — Factory decides *which* class to make; Builder controls *how* one complex object is put together from parts
- Checking logic belongs in `build()` — catching bad or incomplete setups at one clear point, instead of scattered across setters
- Overusing it for simple objects (few optional fields) adds needless steps where a plain constructor or a named-parameter language feature would be enough
- Common in configuration objects, HTTP request builders, and query builders (like SQL query builders)

## Interview Questions
**Q:** What problem does Builder solve that a constructor doesn't?
**A:** It avoids telescoping constructors for objects with many optional inputs, and allows staged, readable building of complex or unchangeable objects.

**Q:** What's the difference between Builder and Factory?
**A:** Factory picks which class to make; Builder controls the step-by-step building of one complex object's inner parts.

**Q:** Where should checking logic live in a Builder?
**A:** In the final `build()` method — checking that the built-up state is complete and valid before returning the finished, often unchangeable, object.

**Q:** When is Builder not needed?
**A:** When a class has few fields and no complex build order — a plain constructor or a language's named/default inputs are simpler.

## Scenario
An HTTP client needs to set up optional headers, timeout, retries, and auth tokens before sending a request, and not every request uses every option. A fluent `RequestBuilder` (`.header(...).timeout(...).build()`) lets callers set only what they need, with `build()` checking the final setup before building an unchangeable `Request` object.

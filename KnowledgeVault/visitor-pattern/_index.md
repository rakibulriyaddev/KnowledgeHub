---
id: visitor-pattern
title: "Visitor Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Visitor lets a new operation be defined over a set of object types without modifying those types themselves, by moving the operation into a separate visitor object that each element accepts and dispatches to. It's the pattern for adding functionality across an object structure whose classes you don't want to keep editing.

## Key Concepts
- Visitor interface — declares a `visit` method per concrete element type
- Concrete visitor — implements the actual operation logic per type
- Element interface — declares an `accept(visitor)` method
- Double dispatch — the element calls back into the visitor with its own concrete type, resolving which visit method runs

## Core Knowledge
- Solves the problem of adding new operations to a class hierarchy without editing every class — the operation lives entirely in the visitor
- Double dispatch is the mechanism that makes this work — `element.accept(visitor)` calls `visitor.visitConcreteType(this)`, resolving to the correct overload based on both the element's and visitor's actual types
- Trades one flexibility for another versus Composite/inheritance-based operations — adding a new operation is easy (new visitor), but adding a new element type is hard (every existing visitor must be updated)
- Best suited for stable object structures where operations change/grow more often than the types themselves — the inverse of typical OCP-friendly design
- Commonly used in compilers/parsers (AST node visitors), document object models, and Composite tree traversal where multiple unrelated operations (render, validate, export) need to run over the same structure
- Some languages achieve similar results more simply via pattern matching or multiple dispatch, reducing the need for the formal GoF Visitor structure
- Adds real complexity (two-way coupling between visitor and element interfaces) that's only worth it when the "many operations over stable types" shape genuinely applies

## Interview Questions
**Q:** What problem does Visitor solve?
**A:** It lets new operations be added over a set of related classes without modifying those classes, by encapsulating the operation in a separate visitor object instead.

**Q:** What is double dispatch and why does Visitor need it?
**A:** Double dispatch resolves a method call based on two objects' runtime types instead of one — the element's `accept()` calls back into the visitor with itself, so the correct type-specific `visit` method runs without manual type-checking.

**Q:** What's the tradeoff Visitor introduces compared to adding methods directly to element classes?
**A:** Adding a new operation becomes easy (just a new visitor), but adding a new element type becomes hard (every existing visitor must be updated to handle it) — the inverse of typical extensibility.

**Q:** When is Visitor a good fit?
**A:** When the object structure (element types) is stable but new operations over it are added frequently — compilers, ASTs, and document processors are classic cases.

## Scenario
A compiler's AST has stable node types (numbers, binary expressions, variables) but needs multiple operations over it — type checking, code generation, and pretty-printing — without cluttering each node class with all three. Each operation is implemented as a separate Visitor, and every AST node's `accept()` dispatches to the right visitor method for its type, keeping the node classes themselves unchanged as operations are added.

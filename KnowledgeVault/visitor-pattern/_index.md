---
id: visitor-pattern
title: "Visitor Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Visitor lets you add a new action across a set of object types without changing those types, by moving the action into a separate visitor object that each element accepts and passes control to. It's the pattern for adding new behavior across a group of objects whose classes you don't want to keep editing.

## Key Concepts
- Visitor interface — declares a `visit` method for each concrete element type
- Concrete visitor — holds the real logic for the action, for each type
- Element interface — declares an `accept(visitor)` method
- Double dispatch — the element calls back into the visitor with its own concrete type, deciding which visit method runs

## Core Knowledge
- Solves the problem of adding new actions to a group of classes without editing every class — the action lives entirely inside the visitor
- Double dispatch is what makes this work — `element.accept(visitor)` calls `visitor.visitConcreteType(this)`, picking the right method based on both the element's and visitor's real types
- It trades one kind of flexibility for another compared to Composite/inheritance-based actions — adding a new action is easy (new visitor), but adding a new element type is hard (every existing visitor must be updated)
- Best used for object groups that stay stable, where actions change or grow more often than the types themselves — the opposite of typical flexible design
- Common in compilers/parsers (AST node visitors), document object models, and Composite tree walks where several different actions (render, check, export) need to run over the same structure
- Some languages get similar results more simply through pattern matching or multiple dispatch, cutting the need for the formal Visitor structure
- Adds real complexity (two-way link between visitor and element interfaces) that's only worth it when "many actions over stable types" truly fits

## Interview Questions
**Q:** What problem does Visitor solve?
**A:** It lets new actions be added over a group of related classes without changing those classes, by putting the action in a separate visitor object instead.

**Q:** What is double dispatch and why does Visitor need it?
**A:** Double dispatch picks a method call based on two objects' real types instead of one — the element's `accept()` calls back into the visitor with itself, so the right type-specific `visit` method runs without manual type-checking.

**Q:** What's the tradeoff Visitor brings compared to adding methods straight to element classes?
**A:** Adding a new action becomes easy (just a new visitor), but adding a new element type becomes hard (every existing visitor must be updated to handle it) — the reverse of typical flexibility.

**Q:** When is Visitor a good fit?
**A:** When the object group (element types) stays stable but new actions over it are added often — compilers, ASTs, and document processors are classic cases.

## Scenario
A compiler's AST has stable node types (numbers, binary expressions, variables) but needs several actions over it — type checking, code generation, and pretty-printing — without cluttering each node class with all three. Each action is built as a separate Visitor, and every AST node's `accept()` sends control to the right visitor method for its type, keeping the node classes themselves unchanged as actions are added.

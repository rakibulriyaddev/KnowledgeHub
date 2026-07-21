---
id: composite-pattern
title: "Composite Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Composite builds objects into tree structures to show part-whole relationships. It lets client code treat single objects (leaves) and groups of objects (branches) through the same interface. It is the standard answer whenever data is naturally shaped like a tree.

## Key Concepts
- Component interface — common operations shared by both leaves and composites
- Leaf — a node with no children, implements component operations directly
- Composite — a node holding child components, that does its work by passing it down to and combining the children
- Uniform treatment — client code calls the same methods regardless of leaf or composite

## Core Knowledge
- The main benefit is simpler client code — code that works on the tree never needs `if (isLeaf) ... else ...` checks anywhere
- Operations on a composite usually call themselves on each child (for example, `getSize()` on a folder adds up its children's sizes)
- Adding child-management methods (`add`/`remove`) to the shared interface makes client code simpler, but forces leaves to implement or reject operations that do not apply to them — this conflicts a bit with Interface Segregation
- Common real-world trees: file systems (files/folders), UI component trees (widgets/containers), org charts, expression trees (parsers)
- Walking the tree (depth-first, breadth-first) is usually written once at the composite level and reused across the whole tree
- Composite works well with Visitor — Visitor adds new operations to a Composite tree without changing the node classes
- Using this pattern for data that is really flat, with no hierarchy, adds structure you don't need — Composite pays off only for recursive part-whole relationships

## Interview Questions
**Q:** What problem does Composite solve?
**A:** It lets client code treat single objects and groups of objects the same way, through a shared interface, making it simpler to work with tree-shaped data.

**Q:** Where should child-management methods (add/remove) live in Composite?
**A:** Often on the shared component interface, for simpler client code, at the cost of leaves needing to reject or ignore those calls — a common trade-off discussed with ISP.

**Q:** Give a canonical real-world example of Composite.
**A:** A file system where `File` and `Folder` both implement `getSize()` — a folder's size adds up its children's sizes recursively, and calling code treats files and folders the same way.

**Q:** How does Composite pair with Visitor?
**A:** Visitor lets new operations be added over a Composite tree's node types without changing the node classes themselves, so the tree structure and its operations can grow independently.

## Scenario
A UI framework renders a layout where a `Panel` can hold buttons, labels, or other panels, and `render()` must work correctly at any level of nesting. Both `Button` (leaf) and `Panel` (composite) implement the same `render()` method — a panel's `render()` simply calls `render()` on each child, so the rendering code never needs to know the tree's real depth or shape.

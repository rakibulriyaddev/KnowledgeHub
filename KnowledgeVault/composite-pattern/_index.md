---
id: composite-pattern
title: "Composite Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Composite composes objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects (leaves) and compositions of objects (branches) through the same interface. It's the standard solution wherever data is naturally recursive or tree-shaped.

## Key Concepts
- Component interface — common operations shared by both leaves and composites
- Leaf — a node with no children, implements component operations directly
- Composite — a node holding child components, implements operations by delegating/aggregating over children
- Uniform treatment — client code calls the same methods regardless of leaf or composite

## Core Knowledge
- The defining benefit is client simplicity — code operating on the tree doesn't need `if (isLeaf) ... else ...` branching anywhere
- Operations on a composite typically recurse into children (e.g. `getSize()` on a folder sums children's sizes)
- Adding child-management methods (`add`/`remove`) to the component interface simplifies client code but forces leaves to implement or reject operations that don't apply to them — a tension with Interface Segregation
- Common real-world trees: file systems (files/folders), UI component trees (widgets/containers), org charts, expression trees (parsers)
- Traversal (depth-first, breadth-first) is typically implemented once at the composite level and reused across the whole tree
- Composite pairs naturally with Visitor — Visitor adds new operations over a Composite tree without modifying the node classes
- Overuse for genuinely flat, non-hierarchical data adds unnecessary structure — Composite pays off specifically for recursive part-whole relationships

## Interview Questions
**Q:** What problem does Composite solve?
**A:** It lets client code treat individual objects and groups of objects identically through a shared interface, simplifying operations over tree-shaped data.

**Q:** Where should child-management methods (add/remove) live in Composite?
**A:** Often on the shared component interface for client simplicity, at the cost of leaves needing to reject or no-op those calls — a common ISP tradeoff discussion.

**Q:** Give a canonical real-world example of Composite.
**A:** A file system where `File` and `Folder` both implement `getSize()` — a folder's size recursively sums its children's sizes, files and folders handled identically by calling code.

**Q:** How does Composite pair with Visitor?
**A:** Visitor lets new operations be added over a Composite tree's node types without modifying the node classes themselves, keeping the tree structure and its operations independently extensible.

## Scenario
A UI framework renders a layout where a `Panel` can contain buttons, labels, or other panels, and `render()` needs to work correctly at any nesting depth. Both `Button` (leaf) and `Panel` (composite) implement the same `render()` method — a panel's `render()` simply calls `render()` on each child, so the rendering code never needs to know the tree's actual depth or shape.

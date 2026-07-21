---
id: chain-of-responsibility-pattern
title: "Chain of Responsibility Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Chain of Responsibility passes a request along a chain of possible handlers until one of them handles it. This keeps the sender from needing to know which handler will end up doing the work. It is the base idea behind middleware pipelines and request-processing filters.

## Key Concepts
- Handler interface — common contract with a "handle" method and a reference to the next handler
- Concrete handlers — each decides whether to process the request, pass it along, or both
- Chain construction — handlers linked in a specific order, often configured at startup
- Passing vs stopping — a handler can send the request onward, or stop the chain by fully handling it

## Core Knowledge
- The sender does not need to know which handler, if any, will process the request — the sender and the final receiver are fully separated
- A handler can handle the request and stop, handle it and still pass it on, or just pass it through untouched — this depends on how it is designed
- The order of the chain matters and is often a real source of bugs — putting a broad "catch-all" handler too early can stop more specific handlers later in the chain from ever running
- It is a valid outcome for no handler to process the request, but this must be planned for on purpose — otherwise requests just disappear with no warning
- Middleware pipelines (web frameworks), event bubbling in UI systems, and logging or validation filter chains are all real examples of Chain of Responsibility
- It differs from plain, one-after-another function calls because handlers can be added, removed, or reordered while the app runs, without changing the sender or the other handlers
- Using this pattern for a small, fixed set of checks that never changes can make debugging harder than a simple function would. The extra layer is worth it mainly when the chain needs to change.

## Interview Questions
**Q:** What does Chain of Responsibility decouple?
**A:** The sender of a request from the specific handler that ends up processing it — the sender only knows the chain exists, not which link handles the request.

**Q:** What's a common bug in Chain of Responsibility designs?
**A:** Wrong handler order — a broad or catch-all handler placed too early can catch requests meant for more specific handlers later in the chain.

**Q:** What happens if no handler in the chain processes the request?
**A:** It depends on the design — the chain should have a default or fallback behavior (or a clear "unhandled" signal), otherwise the request just disappears with no warning.

**Q:** Give a real-world example of Chain of Responsibility.
**A:** Web framework middleware pipelines, where a request passes through authentication, logging, and validation steps in order before reaching the route handler.

## Scenario
A support ticket system needs tickets sent to the right tier — simple questions to L1 support, technical issues to L2, and serious outages sent even further up — without the ticket submission code needing to know which tier will handle it. Each support tier is a handler that either solves the ticket or passes it to the next tier in the chain, and the order of the chain can be changed without touching the ticket submission code.

---
id: chain-of-responsibility-pattern
title: "Chain of Responsibility Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Chain of Responsibility passes a request along a chain of potential handlers until one of them handles it, decoupling the sender from knowing which handler will ultimately process the request. It's the structural basis of middleware pipelines and request-processing filters.

## Key Concepts
- Handler interface — common contract with a "handle" method and a reference to the next handler
- Concrete handlers — each decides whether to process the request, pass it along, or both
- Chain construction — handlers linked in a specific order, often configured at startup
- Passing vs short-circuiting — a handler can forward the request onward or stop the chain by fully handling it

## Core Knowledge
- The sender doesn't need to know which handler (if any) will process the request — full decoupling between sender and eventual receiver
- Handlers can either handle-and-stop, handle-and-continue (processing plus forwarding), or pass-through untouched, depending on design intent
- Chain order matters and is often a real source of bugs — placing a broad "catch-all" handler too early can prevent more specific handlers downstream from ever running
- No handler processing the request is a valid outcome that must be explicitly designed for — otherwise requests silently disappear
- Middleware pipelines (web frameworks), event bubbling in UI systems, and logging/validation filter chains are Chain of Responsibility in practice
- Differs from plain sequential function calls by allowing handlers to be added, removed, or reordered dynamically without touching the sender or other handlers
- Overuse for a genuinely fixed, small set of checks can make debugging harder than a simple sequential function — the indirection pays off mainly when the chain composition needs to vary

## Interview Questions
**Q:** What does Chain of Responsibility decouple?
**A:** The sender of a request from the specific handler that ultimately processes it — the sender only knows the chain exists, not which link handles the request.

**Q:** What's a common bug in Chain of Responsibility designs?
**A:** Incorrect handler ordering — a broad or catch-all handler placed too early can intercept requests meant for more specific handlers later in the chain.

**Q:** What happens if no handler in the chain processes the request?
**A:** It depends on explicit design — the chain should define a default/fallback behavior (or an explicit "unhandled" signal), otherwise the request silently disappears.

**Q:** Give a real-world example of Chain of Responsibility.
**A:** Web framework middleware pipelines, where a request passes through authentication, logging, and validation middleware in sequence before reaching the route handler.

## Scenario
A support ticket system needs tickets routed to the right tier — basic questions to L1 support, technical issues to L2, and critical outages escalated further — without the ticket submission code knowing which tier will handle it. Each support tier is a handler that either resolves the ticket or passes it to the next tier in the chain, and the chain's order can be reconfigured without touching ticket submission code.

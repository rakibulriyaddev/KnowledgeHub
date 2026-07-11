---
id: proxy-pattern
title: "Proxy Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Proxy provides a placeholder or surrogate for another object to control access to it, implementing the same interface so clients can't tell they're talking to the proxy instead of the real object. It adds a controlled indirection layer for concerns like lazy loading, access control, caching, or remote communication.

## Key Concepts
- Virtual proxy — defers expensive object creation until actually needed (lazy loading)
- Protection proxy — controls access based on permissions/roles
- Remote proxy — represents an object living in a different address space/process
- Caching proxy — stores results of expensive operations for reuse

## Core Knowledge
- Proxy implements the same interface as the real subject, so client code is unaware whether it holds a proxy or the real object
- Virtual proxy is the most common form — delaying creation of an expensive resource (e.g. a large image, a DB connection) until first real use
- Protection proxy adds authorization checks before delegating to the real object, without the real object needing to know about permissions
- Remote proxy is the basis of RPC/stub generation — client-side stubs proxy calls across process/network boundaries transparently
- Structurally identical to Decorator (both wrap an object behind a shared interface), but intent differs — Proxy controls access, Decorator adds behavior
- Caching proxies must handle invalidation carefully — stale cached results silently served are a common bug source
- Framework-generated proxies (dynamic proxies, AOP interceptors) implement this pattern automatically for cross-cutting concerns like logging or transactions

## Interview Questions
**Q:** What's the core intent of Proxy versus Decorator, given both wrap an object identically?
**A:** Proxy controls or mediates access to the real object (lazy loading, permissions, remoteness); Decorator adds new behavior on top of it.

**Q:** What is a virtual proxy used for?
**A:** Deferring the creation of an expensive object until it's actually needed, transparently to the client.

**Q:** How does a protection proxy enforce access control?
**A:** It checks the caller's permissions before delegating the call to the real subject, keeping authorization logic out of the real object itself.

**Q:** Give an example of Proxy in a framework.
**A:** ORM lazy-loaded entity references — accessing a related entity returns a proxy that only hits the database when a property is actually accessed.

## Scenario
A document viewer needs to display a list of images, but loading every full-resolution image upfront would be slow and memory-heavy. Each image is represented by a virtual proxy that only loads the actual image data from disk the first time it's rendered, keeping initial load fast while behaving identically to a real image object from the client's perspective.

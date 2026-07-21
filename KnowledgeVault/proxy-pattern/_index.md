---
id: proxy-pattern
title: "Proxy Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: structural-patterns
children: []
status: draft
---

## Overview
Proxy gives a stand-in for another object to control access to it. It follows the same interface, so callers can't tell whether they're talking to the proxy or the real object. It adds a controlled middle layer for things like lazy loading, access control, caching, or talking to something remote.

## Key Concepts
- Virtual proxy — delays making an expensive object until it's actually needed (lazy loading)
- Protection proxy — controls access based on permissions/roles
- Remote proxy — stands in for an object living in a different process or machine
- Caching proxy — stores the results of costly operations for reuse

## Core Knowledge
- Proxy follows the same interface as the real object, so calling code doesn't know whether it holds a proxy or the real thing
- Virtual proxy is the most common kind — delaying the creation of an expensive resource (like a large image or a DB connection) until it's first really needed
- Protection proxy adds permission checks before passing the call to the real object, without the real object ever needing to know about permissions
- Remote proxy is the base of RPC/stub setups — client-side stand-ins pass calls across process/network boundaries without the caller noticing
- Structurally the same as Decorator (both wrap an object behind a shared interface), but the goal differs — Proxy controls access, Decorator adds behavior
- Caching proxies must handle clearing old data carefully — stale cached results served without warning are a common source of bugs
- Framework-made proxies (dynamic proxies, AOP interceptors) build this pattern automatically for cross-cutting jobs like logging or transactions

## Interview Questions
**Q:** What's the core goal of Proxy versus Decorator, given both wrap an object the same way?
**A:** Proxy controls or manages access to the real object (lazy loading, permissions, remoteness); Decorator adds new behavior on top of it.

**Q:** What is a virtual proxy used for?
**A:** Putting off the creation of an expensive object until it's actually needed, without the caller noticing.

**Q:** How does a protection proxy enforce access control?
**A:** It checks the caller's permissions before passing the call to the real object, keeping permission logic out of the real object itself.

**Q:** Give an example of Proxy in a framework.
**A:** ORM lazy-loaded entity references — reaching a related entity gives back a proxy that only hits the database when a field is actually read.

## Scenario
A document viewer needs to show a list of images, but loading every full-size image up front would be slow and use a lot of memory. Each image is stood in for by a virtual proxy that only loads the real image data from disk the first time it's shown, keeping start-up fast while acting exactly like a real image object from the caller's view.

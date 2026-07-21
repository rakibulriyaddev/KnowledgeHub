---
id: circuit-breaker
title: "Circuit Breaker Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [resilience, fault-tolerance, distributed-systems, microservices]
parent: reliability-security
children: []
status: draft
---

## Overview

A circuit breaker wraps calls to another service so that once too many calls fail, calls stop automatically instead of piling up and spreading trouble through the system. Made popular by Michael Nygard's *Release It!* (2007), it works like an electrical circuit breaker: trip early, and protect the rest of the house.

## Key Concepts

- Cascading failure — one slow or failing service uses up all of its callers' threads and connections, and pulls down the whole chain.
- Three states — Closed (normal), Open (fast-fail), Half-Open (testing recovery).
- Fast fail — instant error instead of waiting for a timeout.
- Fallback strategy — what to return while the circuit is open.
- Related patterns — retry, timeout, bulkhead, rate limiting.

## Core Knowledge

Without protection, if Service A calls a failing Service B, it waits until it times out, fills up its own threads and connections, and stops taking new requests — a domino effect that also takes down whatever calls Service A. A circuit breaker stops this with three states. In **Closed**, requests pass through as normal while failures are counted. Once failures cross a limit (say, 50% of the last 10 requests), it trips to **Open**, where all calls fail right away without even reaching the service. After a wait (say, 30 seconds), it moves to **Half-Open**, letting a small number of test requests through — if they succeed, it goes back to Closed; if they fail, it goes back to Open.

**Note:** a circuit breaker is not the same as a retry — a retry keeps trying the same call, while a breaker blocks all calls for a while.

Key settings: the failure limit, the wait time before moving from open to half-open, the success count needed to move from half-open to closed, and the time window used to measure the failure rate. While open, callers need a fallback: a default value, a cached response, an empty response, an honest error, or a different service to call instead. Popular tools that do this include Resilience4j (Java, the modern standard), the now-retired Hystrix (Netflix, the first well-known one), Polly (.NET), opossum (Node.js), and built-in support in service meshes like Istio.

Good practice is one circuit breaker per dependency (not one big global one), combined with retry (with growing wait times and jitter), timeouts, and bulkheads (separate resource pools) for full protection. Common mistakes: limits set too low so it trips on small blips, missing fallbacks, and no monitoring — an open circuit can quietly stay open forever with no alert.

## Interview Questions

**Q: What are the three states of a circuit breaker and how do they transition?**
A: Closed (normal, counting failures) trips to Open when the limit is crossed; Open fast-fails all calls until a wait time passes, then moves to Half-Open; Half-Open lets test requests through — success goes back to Closed, failure goes back to Open.

**Q: How is a circuit breaker different from a simple retry?**
A: A retry tries the same failing call again, which can make things worse under long failure; a circuit breaker notices repeated failure and blocks calls entirely for a while, protecting both caller and callee. They are often used together.

**Q: Why should each dependency have its own circuit breaker instead of one global breaker?**
A: One global breaker is all-or-nothing — one failing dependency would block protection for unrelated calls too. Separate breakers per dependency isolate failures precisely.

## Scenario

An online store's product page calls a recommendation service that starts timing out. Without a breaker, the whole page loads slowly while it waits for those timeouts. With a circuit breaker, once the failure limit is crossed, the recommendation panel switches right away to showing "popular items," while the rest of the page loads at normal speed — a graceful drop in quality instead of a slow or broken page.

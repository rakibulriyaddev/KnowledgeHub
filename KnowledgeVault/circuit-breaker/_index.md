---
id: circuit-breaker
title: "Circuit Breaker Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [resilience, fault-tolerance, distributed-systems, microservices]
parent: reliability-security
children: []
status: draft
---

## Overview

A circuit breaker wraps calls to a dependency so that once a failure threshold is crossed, calls stop automatically instead of piling up and cascading through the system. Popularized by Michael Nygard's *Release It!* (2007), it's the software equivalent of an electrical circuit breaker: trip early, protect the rest of the house.

## Key Concepts

- Cascading failure — one slow/failing service exhausts callers' threads and connection pools, taking down the whole chain.
- Three states — Closed (normal), Open (fast-fail), Half-Open (testing recovery).
- Fast fail — instant error instead of waiting for a timeout.
- Fallback strategy — what to return while the circuit is open.
- Related patterns — retry, timeout, bulkhead, rate limiting.

## Core Knowledge

Without protection, Service A calling a failing Service B waits until timeout, fills its thread/connection pool, and stops accepting new requests — a domino effect that takes down upstream callers too. A circuit breaker prevents this with a three-state machine. In **Closed**, requests pass through normally while failures are counted; crossing a threshold (e.g., 50% failures over 10 requests) trips it to **Open**, where all calls fail immediately without reaching the service. After a timeout (e.g., 30s), it moves to **Half-Open**, letting a limited number of trial requests through — success returns to Closed, failure goes back to Open.

**Note:** a circuit breaker is not a retry — retry keeps attempting the same call, while a breaker blocks calls entirely for a period.

Key configuration knobs: failure threshold, timeout duration (open → half-open), success threshold (half-open → closed), and the time window over which failure rate is measured. While open, callers need a fallback: a default value, cached response, empty response, honest error, or an alternative service. Popular implementations include Resilience4j (Java, the modern standard), the now-deprecated Hystrix (Netflix, the pioneer), Polly (.NET), opossum (Node.js), and built-in support in service meshes like Istio.

Best practice is one circuit breaker per dependency (not a single global one), combined with retry (with exponential backoff + jitter), timeouts, and bulkheads (isolated resource pools) for full resilience. Common mistakes: overly aggressive thresholds that trip on minor blips, missing fallbacks, and no monitoring — an open circuit can silently stay open indefinitely without alerting.

## Interview Questions

**Q: What are the three states of a circuit breaker and how do they transition?**
A: Closed (normal, tracking failures) trips to Open on threshold breach; Open fast-fails all calls until a timeout elapses, moving to Half-Open; Half-Open allows trial requests — success returns to Closed, failure returns to Open.

**Q: How is a circuit breaker different from a simple retry?**
A: Retry re-attempts the same failing call, often making things worse under sustained failure; a circuit breaker detects repeated failure and blocks calls entirely for a period, protecting both caller and callee. They're typically combined.

**Q: Why should each dependency have its own circuit breaker instead of one global breaker?**
A: A single global breaker is all-or-nothing — one failing dependency trips protection for unrelated calls too. Per-dependency breakers isolate failures precisely.

## Scenario

An e-commerce product page calls a recommendation service that starts timing out. Without a breaker, the whole page loads slowly waiting on those timeouts. With a circuit breaker, once the failure threshold trips, the recommendation panel immediately falls back to "popular items" while the rest of the page renders at normal speed — graceful degradation instead of a slow or broken page.

---
id: sla-slo-sli
title: "SLA, SLO, SLI"
created: 2026-07-11
modified: 2026-07-11
tags: [reliability, sre, observability, metrics]
parent: reliability-security
children: []
status: draft
---

## Overview

"Our service delivers 99.9% uptime" only means something once you separate what's measured, what's targeted internally, and what's contractually promised. SLI, SLO, and SLA are the vocabulary Site Reliability Engineering (Google) uses to make reliability precise and measurable instead of a vague marketing claim.

## Key Concepts

- SLI (Service Level Indicator) — the measured metric, e.g. availability, latency percentile, error rate.
- SLO (Service Level Objective) — the internal target on top of an SLI.
- SLA (Service Level Agreement) — the customer-facing contract, looser than the SLO, with financial consequences.
- Error budget — the allowed failure margin implied by an SLO (99.9% = 0.1% budget).
- The "nines" — each additional nine of uptime is exponentially more expensive.
- Composite SLO — end-to-end reliability across components multiplies, and is always lower than any single part.

## Core Knowledge

An **SLI** is a measurable metric — availability, latency (P50/P95/P99), throughput, error rate, or durability — and a good one reflects actual user experience rather than server-side metrics like CPU. An **SLO** sets a target on an SLI, in the form "X% of [SLI] meets [threshold] over [time window]," e.g. "99.95% of requests finish in under 200ms." An **SLA** is the formal, looser contract with the customer, carrying financial consequences (service credits, refunds) if breached — **Note:** SLA is always kept below the SLO, because missing the SLO is just an internal warning while missing the SLA costs money.

Uptime math compounds fast: 99% allows ~3.65 days/year down (fine for a hobby project), 99.9% allows ~8.76 hours/year (standard SaaS), 99.99% allows ~52 minutes/year (enterprise), and 99.999% allows ~5.26 minutes/year (telecom/banking). The **error budget** is the flip side of the SLO — an SLO of 99.9% over 30 days permits 43 minutes of downtime, and that budget can be spent shipping risky features or doing maintenance; once exhausted, the standard SRE practice is to freeze new deployments and focus purely on reliability.

Good SLIs are user-centric — "is checkout completing," "does search return in 500ms" — measured via synthetic monitoring and real user monitoring (RUM), not just server uptime. When a system has multiple components in series (frontend 99.95% × API 99.9% × DB 99.99%), the **composite SLO** multiplies to roughly 99.84% — always lower than the weakest individual link, which is why the critical path deserves the most optimization attention. Setting SLOs well means picking the user journey, choosing the right SLI, basing the target on historical data rather than aspiration, calculating the resulting error budget, and reviewing quarterly.

## Interview Questions

**Q: What's the difference between SLA, SLO, and SLI?**
A: SLI is the measured metric itself (e.g., latency or availability), SLO is the internal target set on that metric, and SLA is the external contractual promise to the customer — looser than the SLO, with financial penalties for breach.

**Q: What is an error budget and how is it used?**
A: It's the failure margin implied by an SLO — e.g., 99.9% over 30 days allows 43 minutes of downtime. Teams can "spend" it on risky launches or maintenance; once exhausted, the standard practice is to freeze deployments and prioritize reliability work.

**Q: Why is a composite SLO across multiple components always lower than any individual component's SLO?**
A: Because the probabilities multiply across the chain (e.g., 99.95% × 99.9% × 99.99% ≈ 99.84%) — the end-to-end system is only as reliable as the product of all its dependencies, not just its weakest link.

## Scenario

A checkout flow depends on a frontend (99.95% SLO), an API (99.9% SLO), and a database (99.99% SLO). The composite end-to-end reliability is about 99.84% — noticeably lower than any single component. The SRE team realizes the API is the biggest drag on the composite and focuses reliability investment there rather than over-engineering the already-solid database layer.

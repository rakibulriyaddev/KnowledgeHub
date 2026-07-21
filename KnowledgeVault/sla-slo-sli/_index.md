---
id: sla-slo-sli
title: "SLA, SLO, SLI"
created: 2026-07-11
modified: 2026-07-22
tags: [reliability, sre, observability, metrics]
parent: reliability-security
children: []
status: draft
---

## Overview

"Our service has 99.9% uptime" only makes sense once you split apart three things: what is measured, what is the internal goal, and what is promised in a contract. SLI, SLO, and SLA are the words Site Reliability Engineering (SRE, from Google) uses to make reliability clear and measurable, instead of just a vague marketing claim.

## Key Concepts

- SLI (Service Level Indicator) — the number you measure, like uptime, latency, or error rate.
- SLO (Service Level Objective) — the internal goal set on top of an SLI.
- SLA (Service Level Agreement) — the contract you show customers, looser than the SLO, with money on the line if you miss it.
- Error budget — how much failure an SLO allows (99.9% = 0.1% budget).
- The "nines" — each extra nine of uptime costs a lot more than the last.
- Composite SLO — when parts of a system are chained together, the end-to-end reliability multiplies, and is always lower than any one part.

## Core Knowledge

An **SLI** is a number you can measure — uptime, latency (P50/P95/P99), throughput, error rate, or how well data is kept safe — and a good SLI shows what the user actually feels, not just server numbers like CPU use. An **SLO** sets a goal on an SLI, written as "X% of [SLI] meets [target] over [time window]," like "99.95% of requests finish in under 200ms." An **SLA** is the formal, looser contract with the customer, with money on the line (service credits, refunds) if it's broken. **Note:** the SLA target is always set below the SLO, because missing the SLO is just an internal warning, but missing the SLA costs real money.

Uptime math adds up fast: 99% allows about 3.65 days of downtime a year (fine for a small hobby project), 99.9% allows about 8.76 hours a year (normal for SaaS), 99.99% allows about 52 minutes a year (enterprise level), and 99.999% allows about 5.26 minutes a year (telecom/banking level). The **error budget** is the other side of the SLO — an SLO of 99.9% over 30 days allows 43 minutes of downtime, and teams can "spend" that budget on risky new features or maintenance work. Once it runs out, the normal SRE rule is to stop new releases and focus only on reliability.

Good SLIs focus on the user — "does checkout finish," "does search answer in 500ms" — measured with synthetic monitoring and real user monitoring (RUM), not just server uptime. When a system has several parts in a row (frontend 99.95% × API 99.9% × database 99.99%), the **composite SLO** multiplies to about 99.84% — always lower than the weakest single part. That's why the most-used path deserves the most work to improve. Setting good SLOs means picking the user journey that matters, choosing the right SLI, basing the target on past data instead of wishful thinking, working out the error budget, and checking it again every few months.

## Interview Questions

**Q: What's the difference between SLA, SLO, and SLI?**
A: SLI is the number you measure (like latency or uptime), SLO is the internal goal set on that number, and SLA is the outside contract you promise the customer — looser than the SLO, with money on the line if you break it.

**Q: What is an error budget and how is it used?**
A: It's the amount of failure an SLO allows — for example, 99.9% over 30 days allows 43 minutes of downtime. Teams can "spend" it on risky launches or maintenance. Once it's used up, the normal rule is to stop new releases and focus on reliability work.

**Q: Why is a composite SLO across multiple components always lower than any individual component's SLO?**
A: Because the chances multiply across the chain (like 99.95% × 99.9% × 99.99% ≈ 99.84%) — the whole system is only as reliable as the product of all the parts it depends on, not just its weakest part.

## Scenario

A checkout flow depends on a frontend (99.95% SLO), an API (99.9% SLO), and a database (99.99% SLO). The combined end-to-end reliability is about 99.84% — clearly lower than any single part. The SRE team sees that the API is the biggest drag on this number and puts its reliability work there, instead of over-improving the database layer, which is already strong.

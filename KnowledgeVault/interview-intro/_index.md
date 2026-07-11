---
id: interview-intro
title: "System Design Interviews - An Introduction"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, interview-prep, framework, communication]
parent: case-studies
children: []
status: draft
---

## Overview

A system design interview tests structured thinking on an ambiguous, open-ended problem ("design Twitter") under time pressure, not memorized diagrams. This topic lays out the 7-step framework and the communication habits that separate a candidate who passes from one who dives straight into a schema and fails.

## Key Concepts

- 7-step framework: Requirements → Capacity Estimation → API Design → Data Model → High-Level Architecture → Deep Dive → Bottlenecks/Trade-offs.
- Functional requirements (what the system does) vs non-functional requirements (scale, latency, availability, consistency, durability).
- Capacity estimation grounds the design in real numbers — DAU, QPS, storage, bandwidth.
- The deep-dive step goes into one component in detail, steered by the interviewer's interest.
- Communication matters as much as the design itself — think aloud, clarify scope, discuss trade-offs, admit gaps.

## Core Knowledge

The interview typically runs 45-60 minutes and is deliberately open-ended and discussion-based rather than a coding problem with one right answer. The 7-step framework structures the time: clarify functional and non-functional requirements first (5-10 min) — features needed, scale (DAU, QPS), latency targets, availability target (99.9% vs 99.99%), and consistency needs (strong vs eventual); then do capacity estimation (5 min) to turn assumptions into concrete numbers (e.g., Twitter-scale: 200M DAU × 2 tweets/day ≈ 4,600 writes/sec, 460K reads/sec at a 100:1 ratio); then sketch the API (5 min), data model (5 min), and a box-and-arrow high-level architecture (10 min); then spend the largest block (10-15 min) on a deep dive into whichever component the interviewer probes — for a feed system this is usually timeline generation (pull vs push vs hybrid); and close by naming bottlenecks, single points of failure, and scaling trade-offs (5 min).

What separates a pass from a fail is less the diagram and more the process: asking clarifying questions before designing, narrating reasoning continuously instead of thinking silently, backing choices with numbers, discussing trade-offs explicitly rather than asserting one "correct" answer, admitting "I don't know" rather than bluffing, and iterating from a simple design toward complexity instead of over-engineering upfront. Common failure modes are buzzword-driven answers ("just use Kafka" without justification), memorizing a single canned solution instead of internalizing the underlying building blocks (cache, load balancer, queue, database) that recombine across problems, and ignoring non-functional requirements entirely. Preparation should combine internalizing core building blocks, studying real case studies (URL shorteners, chat systems, feeds, ride-matching, video streaming), reading real engineering blogs (Netflix, Uber, Airbnb), and running timed mock interviews for feedback.

## Interview Questions

**Q: What's the first thing a candidate should do when asked to "design Twitter"?**
A: Clarify functional and non-functional requirements and scope with the interviewer — which features are in scope, what scale, what latency and consistency requirements — before proposing any architecture.

**Q: Why does capacity estimation matter if the numbers are rough?**
A: Approximate numbers (DAU, QPS, storage growth) ground later design decisions in reality — they reveal whether a single database can handle the load or whether sharding, caching, and async processing are actually necessary.

**Q: Is it acceptable to say "I don't know" in a system design interview?**
A: Yes — acknowledging a gap and reasoning about how you'd find out or approach it is viewed more favorably than bluffing or overconfidence.

## Scenario

An interviewer opens with "design Instagram." Instead of sketching a database schema immediately, the candidate asks about scope (photo/video, feed, stories?), scale (DAU, read/write ratio), and latency targets, then works through capacity estimation and a high-level architecture before the interviewer steers them into a deep dive — most likely feed generation, mirroring the same pull/push/hybrid trade-off central to the Twitter case study.

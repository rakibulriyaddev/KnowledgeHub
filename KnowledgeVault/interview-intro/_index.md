---
id: interview-intro
title: "System Design Interviews - An Introduction"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, interview-prep, framework, communication]
parent: case-studies
children: []
status: draft
---

## Overview

A system design interview tests clear thinking on an open-ended problem ("design Twitter") under time pressure, not memorized diagrams. This topic lays out the 7-step plan and the habits that separate a candidate who passes from one who jumps straight into a schema and fails.

## Key Concepts

- 7-step plan: Requirements → Size Estimate → API Design → Data Model → High-Level Design → Deep Dive → Weak Points/Trade-offs.
- Functional requirements (what the system does) vs non-functional requirements (scale, delay, uptime, consistency).
- Size estimation grounds the design in real numbers — daily users, requests per second, storage, bandwidth.
- The deep-dive step goes into one part in detail, guided by what the interviewer is curious about.
- Talking clearly matters as much as the design itself — think out loud, ask about scope, discuss trade-offs, admit gaps.

## Core Knowledge

The interview usually runs 45-60 minutes and is meant to be open-ended and discussion-based, not a coding problem with one right answer. The 7-step plan structures the time: first check functional and non-functional requirements (5-10 min) — what features are needed, the scale (daily users, requests per second), delay targets, uptime target (99.9% vs 99.99%), and consistency needs (strict vs eventual); then do a size estimate (5 min) to turn guesses into real numbers (example, Twitter-scale: 200M daily users x 2 tweets/day ≈ 4,600 writes/sec, 460K reads/sec at a 100:1 ratio); then sketch the API (5 min), data model (5 min), and a simple box-and-arrow high-level design (10 min); then spend the biggest chunk of time (10-15 min) on a deep dive into whatever part the interviewer asks about — for a feed system this is usually how the timeline is built (pull vs push vs mixed); and finish by naming weak points, single points of failure, and scaling trade-offs (5 min).

What separates a pass from a fail is less the diagram and more how you work: asking questions before designing, talking through your thinking out loud instead of going quiet, backing choices with real numbers, discussing trade-offs openly instead of claiming one "right" answer, saying "I don't know" instead of faking it, and building up from something simple instead of over-building from the start. Common mistakes are buzzword answers ("just use Kafka" with no reason given), memorizing one fixed answer instead of learning the basic building blocks (cache, load balancer, queue, database) that mix and match across problems, and skipping non-functional requirements entirely. To prepare, learn the core building blocks, study real case studies (URL shorteners, chat systems, feeds, ride-matching, video streaming), read real engineering blog posts (Netflix, Uber, Airbnb), and practice with timed mock interviews for feedback.

## Interview Questions

**Q: What's the first thing a candidate should do when asked to "design Twitter"?**
A: Check the functional and non-functional requirements and scope with the interviewer — which features matter, what scale, what delay and consistency needs — before suggesting any design.

**Q: Why does size estimation matter if the numbers are rough?**
A: Rough numbers (daily users, requests per second, storage growth) ground later choices in reality — they show whether one database can handle the load or whether splitting data, caching, and background processing are actually needed.

**Q: Is it okay to say "I don't know" in a system design interview?**
A: Yes — admitting a gap and explaining how you'd find out or approach it is seen more kindly than faking confidence.

## Scenario

An interviewer opens with "design Instagram." Instead of drawing a database schema right away, the candidate asks about scope (photo/video, feed, stories?), scale (daily users, read/write ratio), and delay targets, then works through size estimation and a high-level design before the interviewer steers them into a deep dive — most likely feed building, matching the same pull/push/mixed trade-off central to the Twitter case study.

---
id: system-design
title: "System Design"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, distributed-systems, scalability, engineering]
parent: null
children: [networking, sd-databases, architecture-patterns, reliability-security, case-studies]
status: draft
---

## Overview

System design is the process of planning a software system's architecture, interfaces, and data so it meets specific requirements — scale, reliability, cost, and speed of change. It is a thinking skill, not a specific library or framework: breaking a large problem into smaller, well-bounded pieces and reasoning about trade-offs between them.

## Key Concepts

- Architecture — how components are arranged and communicate.
- Data model — where and how data lives, and how it's accessed.
- Scale — behavior from 10 users to 10 million.
- Reliability — what happens when a component fails.
- Cost — avoiding unnecessary infrastructure.

## Core Knowledge

Wrong system design decisions are expensive to reverse — refactoring code is easy, changing a live database schema or architecture is not. This is why the initial design phase matters disproportionately. The discipline spans five practical areas covered by the topics under this tree: networking fundamentals (how requests travel), databases (how data is stored and kept consistent), architecture patterns (how services are structured and communicate), reliability & security (how systems stay up and safe), and case studies (how real, large-scale systems combine all of the above).

## Interview Questions

**Q: What is system design, in one sentence?**
A: Planning a system's architecture, interfaces, and data model to meet requirements around scale, reliability, and cost.

**Q: Why are system design decisions harder to reverse than code?**
A: They constrain everything built on top — changing a database schema or a service boundary later means migrating live data and coordinating multiple teams, unlike a code refactor.

**Q: Is system design only relevant to senior engineers?**
A: No — it's tested in interviews at all levels and used day-to-day for scaling decisions, architecture reviews, and technical leadership.

## Scenario

Twitter's early "Fail Whale" outages happened because a design built for a small user base couldn't handle tens of millions of users. The fix wasn't a patch — it was redesigning core systems from scratch. This illustrates the core lesson: design for the scale you expect to reach, not just the scale you have today.

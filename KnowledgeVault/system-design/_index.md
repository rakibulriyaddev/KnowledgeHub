---
id: system-design
title: "System Design"
created: 2026-07-11
modified: 2026-07-22
tags: [architecture, distributed-systems, scalability, engineering]
parent: null
children: [networking, sd-databases, architecture-patterns, reliability-security, case-studies, system-design-vs-dsa]
status: draft
---

## Overview

System design means planning how a software system is built — its parts, its connections, and its data — so it can handle real needs like scale, staying up, cost, and future change. It is a way of thinking, not one fixed tool: you take a big problem, split it into smaller clear pieces, and pick trade-offs between them.

## Key Concepts

- Architecture — how the parts are placed and talk to each other.
- Data model — where data sits and how you get it.
- Scale — how the system acts with 10 users vs 10 million users.
- Reliability — what happens when one part breaks.
- Cost — not adding more servers or tools than needed.

## Core Knowledge

Bad system design choices are hard to undo. Fixing code is easy; changing a live database or the whole architecture is not. This is why planning at the start matters so much. This topic covers five main areas: networking (how requests move), databases (how data is stored and kept correct), architecture patterns (how services are built and connect), reliability & security (how systems stay safe and running), and case studies (how big real systems use all of this together).

## Interview Questions

**Q: What is system design, in one simple line?**
A: Planning a system's structure, connections, and data so it meets goals like scale, reliability, and cost.

**Q: Why is it harder to undo a system design choice than a code change?**
A: Everything else is built on top of it. Changing a database or a service boundary later means moving live data and getting many teams to agree — a normal code fix does not need that.

**Q: Is system design only for senior engineers?**
A: No. Companies ask about it in interviews at every level, and it is used often for scaling choices, design reviews, and tech leadership.

## Scenario

Twitter's old "Fail Whale" crashes happened because its system was built for few users but got tens of millions. A small fix was not enough — they had to rebuild core parts from the ground up. Lesson: plan for the scale you expect later, not just the scale you have now.

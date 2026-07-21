---
id: case-studies
title: "System Design Case Studies"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, distributed-systems, interview-prep]
parent: system-design
children: [cs-netflix, cs-twitter, cs-uber, cs-url-shortener, cs-whatsapp, interview-intro]
status: draft
---

## Overview

Case studies use every other system-design idea — networking, databases, architecture patterns, reliability — on real, big products. Looking at how Netflix streams video, how Twitter builds a home timeline, how Uber matches riders with drivers, how a URL shortener stays simple at huge scale, and how WhatsApp sends messages reliably turns hard trade-offs into real design choices.

## Key Concepts

- Requirements gathering — find functional and non-functional needs before you design.
- High-level design — how the parts fit together for one product.
- Trade-off justification — why you pick one way over another for this scale and use case.
- Interview framing — how to give a clear answer under time pressure.

## Core Knowledge

Each case study shows how to pick the right tool for one scale of problem. A URL shortener's main problem is making unique short keys and handling read-heavy traffic with a cache, not hard data models. WhatsApp's main problem is sending messages in the right order, every time, not just storing a lot of data. Twitter's main problem is fan-out — building a personal feed for millions of users fast. Uber's main problem is matching riders and drivers in real time with low delay. Netflix's main problem is storing video, converting it, and sending it around the world. The `interview-intro` topic shows how to handle any of these live in an interview: ask about requirements, guess the scale, draw a high-level design, then go deep on one or two parts.

## Interview Questions

**Q: What's the first thing you should do in a system design interview?**
A: Find out the functional and non-functional needs and the scale (users, traffic, data size) before you suggest any design.

**Q: Why is fan-out the central problem for a Twitter-like feed?**
A: Because building a personal timeline for millions of users on every read (or building it ahead of time on every write) is where the read/write trade-off and the scale problem come together.

**Q: What makes a URL shortener's design deceptively simple?**
A: The core logic (turn a key into a short code and back) is easy; the real hard part is handling read-heavy scale, key clashes, and caching.

## Scenario

Asked to design WhatsApp in an interview, a candidate first checks the scope (just 1:1 chat, or also groups, media, read receipts), then designs around sure message delivery and order before writing even one line about the database schema — this matches the case study's focus on reliable delivery over storage.

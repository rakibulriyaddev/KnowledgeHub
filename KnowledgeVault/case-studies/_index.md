---
id: case-studies
title: "System Design Case Studies"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, distributed-systems, interview-prep]
parent: system-design
children: [cs-netflix, cs-twitter, cs-uber, cs-url-shortener, cs-whatsapp, interview-intro]
status: draft
---

## Overview

Case studies apply every other system-design concept — networking, databases, architecture patterns, reliability — to real, large-scale products. Studying how Netflix streams video, how Twitter serves a home timeline, how Uber matches riders to drivers, how a URL shortener stays simple at massive scale, and how WhatsApp delivers messages reliably turns abstract trade-offs into concrete design decisions.

## Key Concepts

- Requirements gathering — functional and non-functional requirements before designing.
- High-level design — how components fit together for a specific product.
- Trade-off justification — why one approach was chosen over another for this specific scale and use case.
- Interview framing — structuring an answer under time pressure.

## Core Knowledge

Each case study is a worked example of picking the right tool for a specific scale: a URL shortener's core challenge is generating unique short keys and handling read-heavy traffic with caching, not complex data modeling. WhatsApp's core challenge is reliable message delivery and ordering, not raw storage volume. Twitter's core challenge is fan-out — efficiently generating a personalized feed for millions of users. Uber's core challenge is real-time geospatial matching at low latency. Netflix's core challenge is video storage, transcoding, and global content delivery. The `interview-intro` topic frames how to approach any of these problems live in an interview: clarify requirements, estimate scale, sketch a high-level design, then go deep on 1-2 components.

## Interview Questions

**Q: What's the first thing you should do in a system design interview?**
A: Clarify functional and non-functional requirements and scale (users, traffic, data size) before proposing any design.

**Q: Why is fan-out the central problem for a Twitter-like feed?**
A: Because generating a personalized timeline for millions of users on every read (or precomputing it on every write) is where the read/write trade-off and scale challenge concentrate.

**Q: What makes a URL shortener's design deceptively simple?**
A: The core logic (encode/decode a short key) is trivial; the real design challenge is handling read-heavy scale, key collisions, and caching.

## Scenario

Asked to design WhatsApp in an interview, a candidate first clarifies scope (1:1 chat only vs. groups, media, read receipts), then designs around message delivery guarantees and ordering before writing a single line about the database schema — matching the study's emphasis on delivery reliability over storage.

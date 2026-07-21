---
id: observer-pattern
title: "Observer Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Observer sets up a one-to-many link between objects, so when one object (the subject) changes, all the objects that depend on it (observers) get told right away. It's the base idea behind event-driven and reactive programming.

## Key Concepts
- Subject — holds the state and a list of watching observers, and tells them when it changes
- Observer interface — the shared `update()`/callback rule every observer follows
- Subscribe/unsubscribe — observers can join and leave at any time
- Push vs pull — the subject either sends the full changed data (push) or just a signal that something changed, letting observers ask for details later (pull)

## Core Knowledge
- Keeps the subject separate from the exact types of its observers — the subject only knows the observer's shared shape, not who's watching or how many
- Memory leaks are a classic problem here — observers that never unsubscribe keep the subject holding onto them, stopping cleanup ("lapsed listener" problem)
- The order observers are told in is often not fixed — code should not depend on one observer firing before another unless that's built in on purpose
- The push model sends the changed data straight in the message; the pull model just signals "something changed," and observers ask the subject what they need — pull is more flexible but adds an extra step
- Modern code often uses event emitters, pub-sub systems, or reactive streams (Rx) instead of a hand-built Observer class setup
- Telling observers right away, in the same call, can cause odd ordering or repeat-call bugs if an observer changes the subject while being told
- Different from Mediator — Observer is a direct one-to-many message from a known subject; Mediator routes many-to-many messages through one central hub

## Interview Questions
**Q:** What problem does Observer solve?
**A:** It lets a subject tell any number of interested parties about changes, without the subject needing to know their exact types.

**Q:** What's a classic bug tied to Observer?
**A:** The "lapsed listener" problem — an observer that never unsubscribes stays linked in the subject, causing a memory leak.

**Q:** What's the difference between push and pull notification?
**A:** Push sends the changed data straight to observers in the message; pull just signals that a change happened, and observers ask the subject afterward for what they need.

**Q:** How is Observer different from Mediator?
**A:** Observer is a direct one-to-many message from a known subject to its observers; Mediator centers many-to-many messages between objects that don't know about each other, through one hub.

## Scenario
A stock ticker app needs several UI parts (chart, price label, alert banner) to update whenever a stock's price changes, without the price-fetching service knowing about any one of them. Each part signs up as an observer of the stock subject — when the price changes, all signed-up parts are told and update on their own.

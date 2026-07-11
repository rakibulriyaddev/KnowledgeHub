---
id: observer-pattern
title: "Observer Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Observer defines a one-to-many dependency between objects so that when one object (the subject) changes state, all its dependents (observers) are notified automatically. It's the foundation of event-driven and reactive programming models.

## Key Concepts
- Subject — holds state and a list of subscribed observers, notifies them on change
- Observer interface — the common `update()`/callback contract all observers implement
- Subscribe/unsubscribe — observers register and deregister interest dynamically
- Push vs pull — subject sends full changed data (push) or just a change signal, letting observers query for details (pull)

## Core Knowledge
- Decouples the subject from concrete observer types — the subject only knows the observer interface, not who's listening or how many
- Memory leaks are a classic pitfall — observers that don't unsubscribe keep the subject holding references, preventing garbage collection ("lapsed listener" problem)
- Notification order among multiple observers is often unspecified — code shouldn't rely on a particular observer firing before another unless explicitly designed
- Push model sends the changed data directly in the notification; pull model just signals "something changed" and observers query the subject for what they need — pull is more flexible but adds a round-trip
- Modern implementations are often event emitters, pub-sub buses, or reactive streams (Rx) rather than a hand-rolled GoF Observer class hierarchy
- Synchronous notification (calling observers inline) can create unexpected ordering/reentrancy issues if an observer mutates the subject during notification
- Distinct from Mediator — Observer is a direct one-to-many broadcast from a known subject; Mediator routes many-to-many communication through a central, decoupled hub

## Interview Questions
**Q:** What problem does Observer solve?
**A:** It lets a subject notify an arbitrary number of interested parties of state changes without the subject needing to know their concrete types.

**Q:** What's a classic bug associated with Observer?
**A:** The "lapsed listener" problem — an observer that never unsubscribes keeps a reference alive in the subject, causing a memory leak.

**Q:** What's the difference between push and pull notification models?
**A:** Push sends the changed data directly to observers in the notification call; pull just signals a change occurred, and observers query the subject afterward for details they need.

**Q:** How does Observer differ from Mediator?
**A:** Observer is a direct one-to-many broadcast from a known subject to its observers; Mediator centralizes many-to-many communication between otherwise-unaware objects through one coordinating hub.

## Scenario
A stock ticker application needs multiple UI widgets (chart, price label, alert banner) to update whenever a stock's price changes, without the price-fetching service knowing about any specific widget. Each widget subscribes as an observer to the stock subject — when the price updates, all subscribed widgets are notified and refresh independently.

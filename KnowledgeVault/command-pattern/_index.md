---
id: command-pattern
title: "Command Pattern"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Command encapsulates a request or action as a standalone object, decoupling the object that invokes an operation from the one that knows how to perform it. Turning actions into first-class objects unlocks capabilities a plain method call can't provide — queuing, logging, and undo.

## Key Concepts
- Command interface — typically a single `execute()` method
- Concrete command — binds a receiver and the parameters needed to perform the action
- Invoker — triggers command execution without knowing what the command actually does
- Receiver — the object that performs the real work when the command executes

## Core Knowledge
- Encapsulating a request as an object enables deferred execution, queuing, logging, and undo/redo — none of which a direct method call supports
- Undo is implemented by having each command also support an inverse operation (`undo()`), often requiring the command to store enough state to reverse itself
- Macro commands (a command composed of a list of other commands) let composite operations be treated identically to atomic ones
- Invoker and receiver are fully decoupled — the invoker (e.g. a UI button or menu item) doesn't need to know what a command does, only that it can `execute()`
- Command queues/logs enable features like transaction replay, batch processing, or crash recovery by replaying logged commands
- In languages with first-class functions, simple commands can be closures instead of a full command class hierarchy — formal Command classes are more valuable when undo, queuing, or serialization are needed
- Overkill for simple, one-off actions with no need for undo, queuing, or logging — direct method calls are simpler there

## Interview Questions
**Q:** What capability does Command provide that a direct method call doesn't?
**A:** It turns an action into an object that can be queued, logged, deferred, composed, or undone — none of which a plain method call supports.

**Q:** How is undo typically implemented with Command?
**A:** Each command also implements an inverse operation and stores whatever state it needs to reverse its effect, so an undo stack can call `undo()` on previously executed commands.

**Q:** What's a macro command?
**A:** A command composed of a sequence of other commands, executed as one unit — letting composite operations be treated the same as atomic ones.

**Q:** When is a full Command class hierarchy unnecessary?
**A:** For simple actions with no need for undo, queuing, logging, or deferred execution — a direct function call or closure is simpler.

## Scenario
A text editor needs undo/redo across arbitrary sequences of user actions (typing, deleting, formatting). Each user action is wrapped as a Command object storing what's needed to reverse it, pushed onto an undo stack as it executes — undo simply pops and calls `undo()` on the most recent command, regardless of what specific action it was.

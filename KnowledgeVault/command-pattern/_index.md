---
id: command-pattern
title: "Command Pattern"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, oop, architecture]
parent: behavioral-patterns
children: []
status: draft
---

## Overview
Command wraps up a request or action as its own object, separating the object that starts an action from the one that knows how to do it. Turning actions into full objects lets you do things a plain method call can't — queuing, logging, and undo.

## Key Concepts
- Command interface — typically a single `execute()` method
- Concrete command — binds a receiver and the parameters needed to perform the action
- Invoker — triggers command execution without knowing what the command actually does
- Receiver — the object that performs the real work when the command executes

## Core Knowledge
- Wrapping a request as an object lets you delay running it, queue it, log it, and undo or redo it — a direct method call cannot do any of this
- Undo works by giving each command an opposite action too (`undo()`), which often means the command must store enough state to reverse itself
- Macro commands (a command made of a list of other commands) let a group of actions be treated just like a single action
- The invoker and the receiver are fully separate — the invoker (like a UI button or menu item) does not need to know what a command does, only that it can call `execute()`
- Command queues or logs allow features like replaying transactions, batch processing, or recovering from a crash by running the logged commands again
- In languages that support first-class functions, simple commands can just be closures instead of a full set of Command classes — real Command classes matter more when you need undo, queuing, or serialization
- This is too much for simple, one-time actions that don't need undo, queuing, or logging — a direct method call is simpler there

## Interview Questions
**Q:** What capability does Command provide that a direct method call doesn't?
**A:** It turns an action into an object that can be queued, logged, delayed, combined, or undone — none of which a plain method call can do.

**Q:** How is undo typically implemented with Command?
**A:** Each command also has an opposite action and stores whatever state it needs to undo its effect, so an undo stack can call `undo()` on commands that already ran.

**Q:** What's a macro command?
**A:** A command made of a sequence of other commands, run as one unit — letting a group of actions be treated the same as a single action.

**Q:** When is a full Command class hierarchy unnecessary?
**A:** For simple actions that don't need undo, queuing, logging, or delayed running — a plain function call or closure is simpler.

## Scenario
A text editor needs undo/redo across any sequence of user actions (typing, deleting, formatting). Each user action is wrapped as a Command object that stores what it needs to reverse itself, and is pushed onto an undo stack as it runs — undo just pops the last command off the stack and calls `undo()` on it, no matter what the action actually was.

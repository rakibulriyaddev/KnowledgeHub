---
id: single-responsibility-principle
title: "Single Responsibility Principle"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Single Responsibility Principle (SRP) states a class or module should have exactly one reason to change — one axis of responsibility it owns. It's the "S" in SOLID and the most frequently misapplied of the five, since "responsibility" is about business/organizational change drivers, not method count.

## Key Concepts
- Reason to change — tied to a stakeholder/actor, not a line count
- Cohesion — code that changes together should live together
- Coupling — separating responsibilities reduces ripple effects across the codebase
- God classes / god objects — the classic SRP violation pattern

## Core Knowledge
- "One reason to change" means one actor/stakeholder, not literally one method or one line of logic
- A class mixing business logic, persistence, and presentation violates SRP even if each method is short
- SRP is about the axis of change, not the size of the class — a large class can be SRP-compliant if it changes for only one reason
- Over-applying SRP creates excessive fragmentation — dozens of tiny classes for trivial logic adds navigation overhead without benefit
- Symptom of violation: unrelated features breaking each other when one is modified
- SRP at the function level and SRP at the class/module level are related but distinct — most interview discussion is class-level
- Refactoring towards SRP usually means extracting collaborators (e.g. a `Notifier`, `Repository`) and composing them, not inheritance
- Test suites are a signal — a class needing many unrelated test setups likely has multiple responsibilities

## Interview Questions
**Q:** What does "one reason to change" actually mean?
**A:** The class should answer to a single actor or business concern — if two different stakeholders could request changes to the same class for unrelated reasons, it violates SRP.

**Q:** Is a 500-line class automatically an SRP violation?
**A:** Not necessarily — size isn't the metric; whether it changes for more than one reason is.

**Q:** How do you refactor a class that violates SRP?
**A:** Extract each distinct responsibility into its own class/collaborator, then compose them (often via dependency injection) rather than keeping them coupled in one type.

**Q:** What's a common code smell indicating an SRP violation?
**A:** A class with unrelated groups of methods/fields, or one that requires unrelated changes for unrelated feature requests.

## Scenario
An `Employee` class calculates pay, saves itself to the database, and generates a report — a change to the database schema, the pay policy, or the report format all touch the same file. Splitting it into `Employee`, `EmployeeRepository`, and `PayrollReportGenerator` isolates each concern so a schema change no longer risks breaking payroll calculation.

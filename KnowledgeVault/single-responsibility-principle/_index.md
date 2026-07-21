---
id: single-responsibility-principle
title: "Single Responsibility Principle"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, design-pattern, oop]
parent: solid-principles
children: []
status: draft
---

## Overview
The Single Responsibility Principle (SRP) says a class or module should have exactly one reason to change — one area of responsibility it owns. It's the "S" in SOLID and the most often misused of the five, since "responsibility" is about business or organizational reasons for change, not method count.

## Key Concepts
- Reason to change — tied to a stakeholder/actor, not a line count
- Cohesion — code that changes together should live together
- Coupling — separating responsibilities cuts down ripple effects across the codebase
- God classes / god objects — the classic example of an SRP violation

## Core Knowledge
- "One reason to change" means one actor/stakeholder, not literally one method or one line of logic
- A class mixing business logic, saving data, and display breaks SRP even if each method is short
- SRP is about the reason for change, not the size of the class — a large class can still follow SRP if it only changes for one reason
- Following SRP too strictly creates too much splitting up — dozens of tiny classes for simple logic adds navigation overhead without any real benefit
- Sign of a violation: unrelated features breaking each other when one is changed
- SRP at the function level and SRP at the class/module level are related but different — most interview talk is about the class level
- Refactoring toward SRP usually means pulling out helper objects (like a `Notifier`, `Repository`) and combining them, not using inheritance
- Test suites are a signal — a class that needs many unrelated test setups likely has more than one responsibility

## Interview Questions
**Q:** What does "one reason to change" actually mean?
**A:** The class should answer to a single actor or business concern — if two different stakeholders could ask for changes to the same class for unrelated reasons, it breaks SRP.

**Q:** Is a 500-line class automatically an SRP violation?
**A:** Not necessarily — size isn't the measure; whether it changes for more than one reason is.

**Q:** How do you refactor a class that breaks SRP?
**A:** Pull each separate responsibility into its own class/helper, then combine them (often through dependency injection) instead of keeping them stuck together in one type.

**Q:** What's a common code smell that points to an SRP violation?
**A:** A class with unrelated groups of methods/fields, or one that needs unrelated changes for unrelated feature requests.

## Scenario
An `Employee` class works out pay, saves itself to the database, and makes a report — a change to the database schema, the pay rule, or the report format all touch the same file. Splitting it into `Employee`, `EmployeeRepository`, and `PayrollReportGenerator` keeps each concern separate so a schema change no longer risks breaking pay calculation.

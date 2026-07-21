---
id: oop
title: "Object-Oriented Programming"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, paradigm, software-design]
parent: null
children: [design-patterns, solid-principles, encapsulation, polymorphism, inheritance, abstraction]
status: draft
---

## Overview
Object-Oriented Programming (OOP) is a style of coding that models software as objects — pieces holding both state and behavior — instead of a list of steps acting on data. It is behind most major business languages (Java, C#, C++, Python), and it gives us the words (classes, interfaces, polymorphism) that design patterns and SOLID principles build on.

## Key Concepts
- Encapsulation — keeping state together with the behavior that works on it, hiding the inside behind an interface
- Inheritance — reusing and adjusting behavior through a chain of types
- Polymorphism — one interface, many versions, picked at build-time or run-time
- Abstraction — modeling only the parts of a real-world thing that matter
- Composition vs inheritance — building behavior from parts vs extending a base type

## Core Knowledge
- "Favor composition over inheritance" — deep chains of inheritance are fragile and hard to change; composition is more flexible
- Polymorphism comes in two forms — subtype (interface/virtual dispatch) and parametric (generics) — interviews usually mean the first one
- Encapsulation is about keeping rules true, not just making fields private — a getter/setter on every field misses the point
- The "fragile base class" problem — changing a base class can quietly break subclasses that rely on how it used to work
- OOP and functional programming aren't opposites — modern languages mix objects with unchanging values and functions as data
- Interfaces set a rule with no code; abstract classes can share some code — the choice affects how easy things are to extend later
- Using inheritance just to reuse code (instead of a true "is-a" link) is a common design mistake
- SOLID principles and GoF design patterns exist to keep OOP code easy to manage as it grows

## Interview Questions
**Q:** What are the four pillars of OOP?
**A:** Encapsulation, inheritance, polymorphism, abstraction.

**Q:** When would you pick composition over inheritance?
**A:** When the link is "has-a" rather than "is-a," or when you need to change behavior while the program runs — composition avoids locking a class into a rigid chain.

**Q:** What's the difference between an abstract class and an interface?
**A:** An abstract class can hold shared state and some working code; an interface sets a pure rule with no code (aside from default methods) and lets a class follow more than one at once.

**Q:** What's the fragile base class problem?
**A:** A change to a base class's inner workings breaks classes built on it that quietly relied on its old behavior, even though its public rule didn't change.

## Scenario
A team building a shape-drawing app starts with a `Shape` base class holding a `draw()` method, then keeps adding subclasses and special cases as new shape types show up, and the chain grows messy. Seeing the need for per-shape behavior without a rigid chain of subclasses points toward building shapes from smaller pieces of behavior (e.g. a `Renderer` strategy) instead of making the inheritance chain deeper.

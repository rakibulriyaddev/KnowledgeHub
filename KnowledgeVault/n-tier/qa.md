---
title: "N-tier Architecture — Q&A"
---

**Q: What is the core idea of N-tier architecture?**
A: Splitting software into separate layers — Logical separation - separation of concerns.

**Q: What is the difference between Tier and Layer?**
A: Layer is logical, Tier is physical (deployment) — Layer is code organization; Tier is a deployment unit.

**Q: What are the three tiers of 3-tier architecture?**
A: Presentation, Logic/Application, Data — The standard 3-tier - Presentation, Application, Data.

**Q: What lives in the presentation tier?**
A: UI/UX - what the user sees — Browser, mobile UI - the visual layer.

**Q: Which tier holds the business logic?**
A: Application/Logic tier — The application tier holds business rules and validation.

**Q: In N-tier architecture, it's fine to put business logic in the presentation tier.**
A: False — Anti-pattern - logic should live in the application tier.

**Q: Which of these is NOT a benefit of N-tier?**
A: Always faster — N-tier adds network calls and extra latency - speed isn't one of its benefits.

**Q: What is the problem with 2-tier (client-server)?**
A: Business logic is spread across client and server - updates are painful — Logic split across two sides - a problem.

**Q: What's an example of a 1-tier application?**
A: MS Word, Notepad — A standalone installation - everything in one executable.

**Q: In N-tier, each layer can use a different technology.**
A: True — As long as the API contract stays intact - backend in Java, frontend in React, DB in Postgres is fine.

**Q: The API server is hot - DB and presentation are fine. What do you do?**
A: Scale only the application tier (independent scaling) — The biggest benefit of N-tier - selective scaling.

**Q: The frontend and mobile app use the same API. Which tier is that API in?**
A: Application/Logic tier — The API/business logic = the application tier; multiple presentations reuse it.

**Q: How does the MVC pattern map onto N-tier?**
A: View → Presentation, Controller → Application entry, Model → data — MVC is the internal structure of the presentation tier.

**Q: Microservice architecture is an extension of N-tier.**
A: True — Microservices = N-tier + functional decomposition.

**Q: Anti-pattern: the UI calls the DB directly. What's the problem?**
A: Layer skip - security risk + scattered business logic — Direct UI-to-DB exposure breaks both security and design.

**Q: What lives in the data tier?**
A: Persistence - DB, cache, storage — The storage layer - RDBMS, NoSQL, Redis, etc.

**Q: What's the advantage of a stateless application tier?**
A: Easy horizontal scaling - any instance can take a request — If state isn't kept on the server, instances become interchangeable.

**Q: In a modern 4-tier setup, which extra tier is common?**
A: Web tier (NGINX/Apache) - static content, SSL, routing — The web tier is separate from presentation - a reverse proxy/static server.

**Q: How many tiers is ideal?**
A: As many as needed for the use case - usually 3-4 — More tiers = more network hops; scale according to need.

**Q: N-tier and microservices are mutually exclusive.**
A: False — Microservices are an extended form of N-tier - both are layered approaches.

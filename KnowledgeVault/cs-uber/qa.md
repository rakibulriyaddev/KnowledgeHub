---
title: "Case Study: Uber / Pathao — Q&A"
---

**Q: What geospatial library does Uber use?**
A: Google S2 (cell-based) — hierarchical division of the earth.

**Q: What's the typical driver location update interval?**
A: Every 4 seconds — a balance between real-time tracking and battery life.

**Q: Where is the active driver pool stored?**
A: Redis (cell_id → driver set) — fast in-memory lookup.

**Q: How is the "5km nearby driver" query performed?**
A: S2 cell + neighbor cell lookup → distance filter — a spatial index is essential.

**Q: Is driver matching based only on distance?**
A: No - ETA, rating, vehicle type, ML model — multi-factor optimization.

**Q: What pattern governs the trip lifecycle?**
A: Saga (compensating actions) — a multi-service workflow.

**Q: What's used for real-time client-server tracking?**
A: WebSocket - pushes driver location to the rider — a persistent connection for real-time updates.

**Q: What is surge pricing based on?**
A: The demand/supply ratio per area — pending requests vs available drivers.

**Q: What's the goal of surge pricing?**
A: Attract drivers + reduce rider demand → equilibrium — balancing supply and demand.

**Q: Uber had 2200+ microservices.**
A: True — a pioneer of microservices, later consolidated some.

**Q: A driver sends a location update and the S2 cell changes. What happens?**
A: Removed from the old cell's driver set + added to the new cell — the index must be maintained.

**Q: Payment fails for a trip. What happens?**
A: Saga compensating action - retry, restrict next ride — distributed transaction recovery.

**Q: What is Uber's Schemaless DB?**
A: A custom MySQL-based sharded DB — Uber's internal storage solution.

**Q: What is Ringpop?**
A: A distributed coordination library - consistent hashing + SWIM — open-source, from Uber.

**Q: Uber needs sticky WebSocket sessions.**
A: True — driver/rider connection state.

**Q: What's the primary inter-service communication method?**
A: gRPC + Kafka (events) — high-performance internal calls.

**Q: What architecture do Pathao/Foodpanda follow?**
A: A similar Uber pattern - geospatial + real-time matching — same domain, similar architecture.

**Q: Where is driver online/offline status stored?**
A: Redis (active driver pool) — fast availability check.

**Q: Where is time-series location history stored?**
A: Cassandra - time-series writes — long-term storage for analytics.

**Q: You've finished all 54 chapters of this book!**
A: True — congratulations! You're now ready for interviews.

---
id: cs-uber
title: "Case Study: Uber / Pathao"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, case-study, geospatial, real-time, microservices]
parent: case-studies
children: []
status: draft
---

## Overview

Uber matches riders to nearby drivers in seconds, at a scale of 100M+ users across 650+ cities, by combining live location search, ML-ranked matching, and an event-driven trip lifecycle. It's the go-to case study for location-based, real-time system design.

## Key Concepts

- Location search using Google S2 — the Earth split into a grid of cells, each mapped to a set of nearby drivers in Redis.
- Driver location updates about every 4 seconds over WebSocket, balancing live tracking against battery and network cost.
- Multi-factor ML matching — not just nearest driver, but distance, ETA, rating, accept rate, and vehicle type.
- Trip lifecycle modeled as a Saga — a chain of events with backup actions for failures (e.g., payment retry).
- Surge pricing driven by the live demand-to-supply ratio in an area, aiming to balance the market.
- Ringpop — Uber's open-source library for consistent hashing plus group membership, used to run the location service.

## Core Knowledge

The core question — "which drivers are within 5km?" — is solved with Google's S2 library, which splits the Earth into a grid of cells along a path that keeps nearby places close together in the grid too. Each driver's location update is turned into an S2 cell ID, and Redis keeps a map from cell ID to driver set; a rider's request looks up their cell plus nearby cells, then narrows results by real distance and open status. Matching a rider to a driver is not just about the nearest one: an ML model ranks options by real road ETA, driver rating and accept rate, vehicle type match, and signals meant to avoid unfair bias.

The trip itself — request, match, on the way, pickup, in trip, done, rating — is modeled as a Saga: each step sends a Kafka event, and failures (like a turned-down match or a failed payment) trigger backup actions (re-match, retry, or block future rides) instead of one all-or-nothing action across services. Uber runs this on a large group of small services (at its peak over 2200, later reduced) talking over gRPC and Kafka, with Schemaless (a custom split MySQL store) for trip and user data, Cassandra for location history over time, and Redis for the live driver pool. Surge pricing streams counts of pending requests and open drivers per area in real time; when the ratio crosses a limit, a price multiplier turns on to pull in more drivers and cool rider demand toward balance.

## Interview Questions

**Q: Why use Google S2 cells instead of checking distance to every driver?**
A: Checking every driver doesn't scale as driver count grows; S2 cells let you check only drivers in the rider's cell and nearby cells, then apply exact distance checks to a much smaller group.

**Q: Why is driver matching ML-based instead of just picking the nearest driver?**
A: Nearest distance ignores real road ETA, driver trust (rating, accept rate), and vehicle-type fit — an ML ranking model weighs all of these for a better overall match.

**Q: Why model the trip lifecycle as a Saga instead of one big transaction?**
A: A ride spans many separate services (matching, trip, payment) over minutes; a Saga lets each step finish on its own and sets backup actions (retry payment, block future rides) instead of holding one long lock across services.

## Scenario

A rider asks for a ride during a stadium event, where demand jumps but few drivers are nearby. Surge pricing spots the local demand-supply gap and raises the multiplier, which both pulls idle drivers from nearby cells toward the area and makes some price-sensitive riders wait — pushing the market back toward balance.

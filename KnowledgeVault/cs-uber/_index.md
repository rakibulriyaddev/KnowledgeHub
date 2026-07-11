---
id: cs-uber
title: "Case Study: Uber / Pathao"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, case-study, geospatial, real-time, microservices]
parent: case-studies
children: []
status: draft
---

## Overview

Uber matches riders to nearby drivers within seconds, at a scale of 100M+ users across 650+ cities, by combining real-time geospatial indexing, ML-ranked matching, and an event-driven trip lifecycle. It's the canonical case study for location-based, real-time system design.

## Key Concepts

- Geospatial indexing via Google S2 — hierarchical cells covering the Earth, mapped to sets of nearby drivers in Redis.
- Driver location updates every ~4 seconds over WebSocket, balancing real-time tracking against battery/network cost.
- Multi-factor ML matching — not nearest-only, but distance, ETA, rating, acceptance rate, and vehicle type.
- Trip lifecycle modeled as a Saga — a sequence of events with compensating actions for failures (e.g., payment retry).
- Surge pricing driven by real-time demand/supply ratio per area, aiming for market equilibrium.
- Ringpop — Uber's open-source consistent-hashing + SWIM membership library for coordinating the location service ring.

## Core Knowledge

The core query — "which drivers are within 5km?" — is solved with Google's S2 library, which divides the Earth into hierarchical cells along a Hilbert curve that preserves spatial locality. Each driver's location update is converted to an S2 cell ID, and Redis maintains a cell_id-to-driver-set mapping; a rider's request looks up their cell plus neighboring cells, then filters candidates by exact distance and availability. Matching a rider to a driver is not simply nearest-driver: an ML model ranks candidates on road-network ETA, driver rating and acceptance rate, vehicle type match, and anti-bias signals from rider-driver history.

The trip itself — request, match, en-route, pickup, in-trip, complete, rating — is modeled as a Saga: each step emits a Kafka event, and failures (like a declined match or failed payment) trigger compensating actions (re-match, retry, or restrict future rides) rather than a single atomic transaction across services. Uber runs this on a large microservices fleet (at its peak 2200+ services, later consolidated) communicating over gRPC and Kafka, with Schemaless (a custom sharded MySQL store) for trip/user data, Cassandra for time-series location history, and Redis for the live driver pool. Surge pricing streams pending-request and available-driver counts per area in real time; when the ratio crosses a threshold, a multiplier kicks in to attract more drivers and temper rider demand toward equilibrium.

## Interview Questions

**Q: Why use Google S2 cells instead of a naive distance scan for "nearby drivers"?**
A: A naive O(N) scan against every driver doesn't scale; S2 cells let you look up only drivers in the rider's cell and its neighbors, then apply exact distance filtering to a much smaller candidate set.

**Q: Why is driver matching ML-based rather than pure nearest-distance?**
A: Nearest distance ignores real road-network ETA, driver reliability (rating, acceptance rate), and vehicle-type fit — an ML ranking model balances all of these for a better overall match.

**Q: Why model the trip lifecycle as a Saga instead of a single distributed transaction?**
A: A ride spans multiple independent services (matching, trip, payment) over minutes; a Saga lets each step commit independently and defines compensating actions (retry payment, restrict future rides) instead of holding a long-lived cross-service lock.

## Scenario

A rider requests a ride during a stadium event, where demand spikes but few drivers are nearby. Surge pricing detects the local demand/supply imbalance and raises the multiplier, which both nudges idle drivers in adjacent cells toward the area and causes some price-sensitive riders to wait — pushing the market back toward equilibrium.

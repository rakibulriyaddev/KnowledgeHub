---
id: geohashing
title: "Geohashing and Quadtrees"
created: 2026-07-11
modified: 2026-07-11
tags: [spatial-indexing, algorithms, data-structures, location-services]
parent: reliability-security
children: []
status: draft
---

## Overview

Geospatial indexing solves "what's nearby" queries efficiently — finding an available Uber driver within 5km without computing distance to every one of millions of rows. Geohash, quadtrees, and R-trees are the three dominant structures for indexing 2D location data, each suited to a different access pattern.

## Key Concepts

- Geohash — encodes lat/lng into a string; shared prefixes imply proximity.
- Quadtree — recursively splits 2D space into 4 quadrants, adapting depth to point density.
- R-tree — bounding-box index, the database-native standard (PostGIS, MySQL spatial).
- Two-stage proximity search — spatial filter (geohash/tree) then exact distance (Haversine).
- Google S2 — sphere-based alternative to geohash using a Hilbert curve, used by Lyft and Pokemon Go.

## Core Knowledge

A naive "find points within 5km" query computes distance to every row — O(N) and far too slow at scale. **Geohash** solves this by recursively dividing the world into rectangles, encoding a coordinate as a short string where each added character increases precision (5 chars ≈ ±2.4km, 7 chars ≈ ±76m). Because nearby locations share prefixes, a database prefix index makes lookups fast — but boundary points can land in a different-but-adjacent cell, so a real query must also check the 8 neighboring geohashes, not just an exact prefix match.

A **Quadtree** instead builds a hierarchical tree where each node splits into 4 quadrants (NW/NE/SW/SE), going deeper in dense areas and staying shallow over empty regions like open ocean — well suited to dynamic data like moving vehicles since it updates efficiently in memory. An **R-tree** indexes bounding rectangles rather than points, making it the natural fit for polygons and complex shapes; it's what PostgreSQL/PostGIS and MySQL spatial extensions use under the hood (via GiST-style variants).

A typical proximity query — e.g., "drivers within 5km" — runs in two stages: first convert the query location to a geohash and pull candidates from the target cell plus its 8 neighbors (or query a quadtree/R-tree), then refine that candidate set to true distance using the **Haversine formula** (great-circle distance accounting for Earth's curvature) and sort by distance. **Caution:** a geohash prefix match is a bucket, not an exact distance — always refine with Haversine, and never assume a flat-earth distance calculation is accurate.

Real-world usage: Uber combines geohash with custom indexing for driver-rider matching; Lyft and Pokemon Go use Google's S2 library (sphere-based, Hilbert-curve cells, more accurate than rectangular geohash); Tinder uses geohash for nearby-user discovery; and Redis has built-in `GEOADD`/`GEORADIUS` commands backed by geohash internally.

## Interview Questions

**Q: Why isn't a single-column index on latitude or longitude enough for "find nearby points" queries?**
A: A 2D proximity search needs both dimensions combined; a single-column index can't express "nearby in 2D space" efficiently, so it degenerates into scanning too many candidates. Geohash, quadtree, or R-tree structures encode 2D locality directly.

**Q: How does geohash express proximity, and what's its main pitfall?**
A: It recursively subdivides the world into rectangles and encodes a location as a string prefix, so nearby locations usually share a prefix, enabling fast prefix-index lookups. The pitfall is boundary cases: two nearby points can fall on opposite sides of a cell edge and get different prefixes, so a real query must also check neighboring cells.

**Q: When would you choose a quadtree over an R-tree, or vice versa?**
A: Quadtree suits dynamic point data (moving vehicles, frequent updates) held in memory with adaptive density-based splitting. R-tree suits complex shapes like polygons and is the database-native standard (PostGIS), better for static or DB-backed spatial data.

## Scenario

A ride-hailing app needs to find drivers within 5km of a rider. It converts the rider's coordinates into a 5-character geohash (~2.4km precision), computes the geohash of the 8 neighboring cells, and runs a prefix-match query against the drivers table to get a candidate set. It then applies the Haversine formula to each candidate to compute exact distance, filters out anyone beyond 5km, and sorts the remainder by distance — a fast two-stage search instead of an O(N) scan over millions of drivers.

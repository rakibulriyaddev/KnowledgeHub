---
id: geohashing
title: "Geohashing and Quadtrees"
created: 2026-07-11
modified: 2026-07-22
tags: [spatial-indexing, algorithms, data-structures, location-services]
parent: reliability-security
children: []
status: draft
---

## Overview

Geospatial indexing solves "what's nearby" questions fast — finding a free Uber driver within 5km without checking the distance to every one of millions of rows. Geohash, quadtrees, and R-trees are the three main structures used to index 2D location data, each best for a different kind of search.

## Key Concepts

- Geohash — turns lat/lng into a string; matching starting letters mean the points are close.
- Quadtree — splits 2D space into 4 parts again and again, going deeper where points are packed close together.
- R-tree — an index built on boxes around groups of points; the standard choice inside databases (PostGIS, MySQL spatial).
- Two-stage nearby search — a rough spatial filter (geohash/tree) first, then an exact distance check (Haversine).
- Google S2 — a sphere-based option instead of geohash, using a Hilbert curve; used by Lyft and Pokemon Go.

## Core Knowledge

A simple "find points within 5km" search checks the distance to every row — slow and not workable at large scale. **Geohash** fixes this by splitting the world into rectangles again and again, turning a location into a short string where each extra letter makes it more exact (5 letters ≈ ±2.4km, 7 letters ≈ ±76m). Since close locations share starting letters, a normal database prefix search makes lookups fast — but points near a boundary can land in a different, nearby box, so a real search must also check the 8 neighboring geohash boxes, not just an exact match.

A **Quadtree** instead builds a tree where each area splits into 4 parts (NW/NE/SW/SE), going deeper in packed areas and staying shallow over empty space like open ocean — this fits well with moving data like cars, since it can update fast in memory. An **R-tree** indexes boxes around groups of points rather than single points, so it fits shapes and areas well; it's what PostgreSQL/PostGIS and MySQL spatial tools use under the hood.

A normal nearby search — like "drivers within 5km" — runs in two steps: first turn the search spot into a geohash and pull matches from that box plus its 8 neighbor boxes (or search a quadtree/R-tree), then narrow that list down to true distance using the **Haversine formula** (a distance formula that accounts for the Earth's curve) and sort by distance. **Caution:** a geohash match is only a rough bucket, not an exact distance — always check with Haversine, and never assume a flat-earth distance guess is correct.

Real-world use: Uber mixes geohash with its own indexing to match drivers and riders; Lyft and Pokemon Go use Google's S2 tool (sphere-based, more exact than boxy geohash); Tinder uses geohash to find nearby users; and Redis has built-in `GEOADD`/`GEORADIUS` commands built on geohash.

## Interview Questions

**Q: Why isn't a single index on latitude or longitude enough for "find nearby points" searches?**
A: A 2D nearby search needs both values together; a single-column index can't express "close by in 2D space" well, so it ends up checking too many rows. Geohash, quadtree, or R-tree structures capture 2D closeness directly.

**Q: How does geohash show closeness, and what's its main flaw?**
A: It splits the world into rectangles again and again and turns a spot into a string prefix, so close spots usually share a prefix, making prefix-index lookups fast. The flaw: two close points can fall on opposite sides of a box edge and get different prefixes, so a real search must also check neighboring boxes.

**Q: When would you pick a quadtree over an R-tree, or the other way around?**
A: Quadtree fits moving point data (cars, frequent updates) held in memory with splits based on how packed the points are. R-tree fits shapes like polygons and is the standard inside databases (PostGIS), better for fixed or DB-stored spatial data.

## Scenario

A ride-hailing app must find drivers within 5km of a rider. It turns the rider's coordinates into a 5-letter geohash (~2.4km exact), works out the geohash of the 8 neighbor boxes, and runs a prefix search on the drivers table to get a list of matches. It then runs the Haversine formula on each match to get the exact distance, drops anyone past 5km, and sorts the rest by distance — a fast two-step search instead of checking millions of drivers one by one.

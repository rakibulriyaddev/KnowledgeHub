---
title: "Geohashing and Quadtrees — Deep Dive"
---

You requested a ride on Uber. How does the app find an available driver within 5 km of you? The database has millions of drivers - calculating distance to every one of them would be slow. Solution: **Geospatial indexing**.

## The Problem with Geographic Search

A table has millions of locations (lat/lng pairs). Question: "Which points are within 5 km of this point?"

- Naive: compute distance to everyone → O(N) - slow.
- A single-column index (lat or lng) can be used but isn't optimal.
- We need a spatial structure for 2D space.

## What is Geohash?

**Geohash** is a system for encoding a geographic coordinate (lat, lng) into a short string. Nearby locations end up with similar geohash prefixes.

### Encoding

The world is recursively divided into rectangles:

1. First, the world is split into 32 parts.
2. Each part is split into 32 sub-parts - an extra character is added to the string.
3. More characters → more precision.

```
Dhaka, BD: lat=23.8103, lng=90.4125
Geohash: "wh0qe" (5 chars ≈ ±2.4km)
"wh0qee" (6 chars ≈ ±610m)
"wh0qeer" (7 chars ≈ ±76m)
```

### Property: Prefix Match = Proximity

If two geohashes share the same prefix → the locations are nearby.

- `wh0qe` and `wh0qf` - adjacent boxes.
- Fast lookup in the database using a prefix index.

### Edge Cases

- At box boundaries - adjacent boxes must also be checked.
- Equator/poles - distortion.

## Quadtree

A **Quadtree** is a tree data structure where every internal node has 4 children. 2D space is recursively divided into 4 quadrants.

### Structure

```
[World]
 / | | \
NW NE SW SE
 /|...
NW NE
...

Each leaf = small bounded region with ≤ N points
```

### Adaptive Splitting

Not all regions are the same size - busy areas (Dhaka) go deeper, empty areas (sea) stay shallow.

### Use cases

- Dynamic location data (moving cars).
- Region-based queries.
- Game development.
- Image processing.

## R-Tree

An **R-Tree** is a spatial index built from bounding rectangles. Good for polygons and complex shapes.

- Internal nodes = bounding box.
- Leaf = actual geometry.
- PostgreSQL/PostGIS, MySQL spatial - all R-tree based.

## Geohash vs Quadtree vs R-Tree

**Geohash:** String-encoded; database prefix index; simple, fast; boundary edge case; good for static data.

**Quadtree:** Hierarchical tree; adaptive density; good for dynamic data; update efficient; memory in-process.

**R-Tree:** Bounding box; complex shapes; database native; polygon support; PostGIS standard.

## Proximity Query

### "Find drivers within 5km"

1. User's location → geohash (5-char precision ≈ 2.4km).
2. Compute 9 neighboring geohashes (target + 8 adjacent boxes).
3. Run a prefix-match query in the database.
4. Filter results by exact distance (Haversine formula).
5. Sort by distance.

## Real-World Usage

- **Uber:** Geohash + custom indexing - driver-rider matching.
- **Lyft:** Quadtree-based S2 (Google library).
- **Foursquare:** Geohash for venue search.
- **Tinder:** Geohash-based nearby user discovery.
- **Pokemon Go:** S2 cells.
- **Redis:** Built-in GEO commands (geohash inside).

## Redis GEO Commands

```
GEOADD locations 90.41 23.81 "driver_1"
GEORADIUS locations 90.41 23.81 5 km

# Returns drivers within 5km
```

Redis uses geohash internally.

## Google S2 Geometry Library

Google's open-source geospatial library:

- Sphere-based (more accurate than rectangular geohash).
- Hilbert curve - adjacent cells are contiguous.
- Variable cell size.
- Used by Google Maps, Lyft, Pokemon Go.

## Haversine Formula

Great-circle distance between two lat/lng points:

```
a = sin²(Δφ/2) + cos φ1 · cos φ2 · sin²(Δλ/2)
c = 2 · atan2(√a, √(1−a))
d = R · c (R = Earth's radius ≈ 6371 km)
```

Filter candidates with geohash first, then get the exact distance with Haversine.

## Common Misconceptions

1. **"Geohash gives exact distance":** No - it's bucket-based; refine with Haversine.
2. **"Adjacent prefix always means proximity":** A nearby point at a boundary can fall into a different prefix.
3. **"Quadtree is the DB standard":** R-Tree is more common in databases.

## Best Practices

- Match the use case: static = geohash; dynamic = quadtree; complex shape = R-tree.
- Handle boundaries - check neighboring cells.
- Choose geohash precision according to the use case.
- Two-stage search: spatial filter + exact distance.
- Use a production-grade DB like PostGIS.
- Redis GEO is enough for simple use cases.

## Chapter Summary

- Geospatial indexing - makes "nearby" queries fast.
- Geohash: string prefix = proximity.
- Quadtree: adaptive 2D tree.
- R-tree: bounding box, DB standard.
- Uber, Lyft, Tinder - all use it.

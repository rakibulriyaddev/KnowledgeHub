---
title: "Geohashing and Quadtrees — Q&A"
---

**Q: What is Geohash?**
A: Encodes lat/lng into a string - nearby locations get similar prefixes — A string encoding for spatial indexing.

**Q: What happens as a geohash gets more characters?**
A: More precision (smaller box) — Each extra character shrinks the box.

**Q: What do the geohashes of two nearby locations have in common?**
A: Similar prefix — Prefix match = proximity.

**Q: How many children does a Quadtree internal node have?**
A: 4 — 2D space → 4 quadrants (NW/NE/SW/SE).

**Q: Quadtrees are adaptive - busy areas go deeper, empty areas stay shallow.**
A: True — Density-based splitting is efficient.

**Q: Which spatial index does PostgreSQL/PostGIS use?**
A: R-Tree (variants like GiST) — R-Tree variants are the standard in databases.

**Q: What do Redis's GEO commands use internally?**
A: Geohash — Redis sorted set + geohash.

**Q: What does the Haversine formula compute?**
A: Great-circle distance between two lat/lng points — Accurate distance on a spherical earth.

**Q: What is the Google S2 library?**
A: A sphere-based geospatial library - Hilbert curve — Used by Lyft and Pokemon Go.

**Q: At geohash boundaries, adjacent cells must be checked.**
A: True — Even without a shared prefix, a nearby point may need a search in the neighbors.

**Q: What strategy fits Uber's "available drivers within 5km" query?**
A: Geohash prefix → candidates → Haversine refine — Two-stage: spatial filter + exact distance.

**Q: What's best for tracking moving cars on an app's map?**
A: Quadtree (efficient for dynamic updates) — Quadtree is better for frequent updates.

**Q: What does Tinder use for nearby user search?**
A: Geohash-based — Distance-based matching.

**Q: What's best for polygon search (state boundary, country)?**
A: R-tree (bounding box) — R-tree is native for complex shapes.

**Q: Geohash precision is chosen according to the use case.**
A: True — City-level vs street-level - the character count differs.

**Q: Is a pure DB index sufficient for spatial queries?**
A: No - application-level filtering is also needed (exact distance) — The DB gives candidates; exact filtering happens in the app.

**Q: What is PostGIS?**
A: PostgreSQL's spatial extension — Adds support for geographic objects.

**Q: What is GeoJSON?**
A: A JSON encoding for geographic data — A standard format for points, lines, polygons.

**Q: Which geospatial library does Pokemon Go use?**
A: Google S2 — S2 cells - used for game world segmentation.

**Q: Calculating distance assuming a flat earth is accurate.**
A: False — The earth is a sphere - you need Haversine or S2's spherical math.

---
id: graph-database
title: "Graph Database"
created: 2026-07-10
modified: 2026-07-11
tags: [data, storage, nosql]
parent: unstructured-database
children: [neo4j]
---

# Graph Database

## Overview

A graph database stores data as nodes and edges, making relationships first-class citizens instead of something reconstructed via joins. It exists for problems dominated by traversal — "what connects to what, how, and how far" — where relational joins grow too expensive as depth increases. Neo4j, Amazon Neptune, and JanusGraph anchor this space.

## Key Concepts

- **Node** — an entity, typically with properties (key-value attributes)
- **Edge / relationship** — a typed, directed connection between two nodes, often with its own properties
- **Property graph** — the common model: labeled nodes and edges each carrying properties
- **Traversal** — walking from node to node along edges to answer a relationship query
- **Index-free adjacency** — each node stores direct pointers to its neighbors, avoiding index lookups per hop
- **Query language** — declarative graph languages (Cypher, Gremlin) express traversals and pattern matching

## Core Knowledge

- Multi-hop relationship queries (friends-of-friends, shortest path, recommendation paths) stay fast as depth grows, where relational joins degrade sharply with each additional hop
- Index-free adjacency means traversal cost depends on the size of the local neighborhood, not the size of the whole dataset — the key structural advantage over join-based lookups
- The model shines when relationships are the point of the query (social graphs, fraud rings, recommendation engines, dependency graphs) — not when data is mostly independent records
- Schema is typically flexible on nodes/edges, similar to document stores, but relationship types are usually well-defined and intentional
- Graph databases are not naturally suited to bulk aggregate analytics (sums, group-bys across millions of unrelated rows) — relational or columnar stores fit that better
- Horizontal scaling is harder than other NoSQL families: partitioning a densely connected graph without constant cross-partition traversal is a genuinely hard problem
- Cypher/Gremlin let you express "find all X connected to Y within N hops" in one declarative query that would be a nightmare of recursive joins in SQL
- Choosing a graph database is a data-shape decision, not a scale decision — a small, deeply relational dataset benefits as much as (sometimes more than) a huge one

## Interview Questions

**Q:** Why do relational joins get slower with traversal depth while graph traversal doesn't as much?
**A:** A join re-scans/re-indexes at each level of depth, while index-free adjacency lets a graph database follow direct pointers between connected nodes regardless of overall dataset size.

**Q:** When is a graph database the wrong choice?
**A:** When the workload is bulk aggregation over largely independent records rather than relationship traversal — relational or columnar stores handle that better and scale more easily.

**Q:** What is index-free adjacency?
**A:** Each node directly references its neighboring nodes/edges, so traversing a relationship is a pointer-follow rather than an index lookup — the core reason graph traversal stays fast.

**Q:** Why is horizontal scaling harder for graph databases than for other NoSQL stores?
**A:** Densely connected data resists clean partitioning — any split risks constant cross-partition traversal, unlike key-value or document data that partitions cleanly by key.

## Scenario

A fraud detection system needs to find whether a new account is connected, through shared devices, addresses, or payment methods, to any account previously flagged as fraudulent — a query that in a relational schema means recursive multi-table joins that slow down sharply past two or three hops. A graph database models accounts and shared attributes as nodes and edges, and a shortest-path traversal answers "is this connected to a known-bad account within N hops" in roughly constant time relative to the graph's local density, not the size of the whole dataset.

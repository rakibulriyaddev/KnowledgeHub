---
id: neo4j
title: "Neo4j"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, nosql]
parent: graph-database
children: []
status: draft
---

# Neo4j

## Overview

Neo4j is the reference property-graph database. It is built around native index-free adjacency and the Cypher query language, which lets you describe traversals in a declarative way. It is the real engine behind the general graph-database ideas — nodes, relationships, pattern matching — and is the one teams most often reach for when they first try graph modeling.

## Key Concepts

- **Cypher** — a declarative pattern-matching query language, with an ASCII-art-like syntax for describing graph shapes
- **Native graph storage** — relationships are actual pointers on disk, not worked out through joins or indexes
- **Labels** — tags on nodes used for grouping and typing (similar to a table name, but not exclusive — a node can have more than one)
- **ACID transactions** — single-instance Neo4j supports full transactional guarantees, unlike some graph stores
- **Causal clustering** — Neo4j's replication/HA model, with a core cluster for writes and read replicas for scale
- **Graph algorithms library** — built-in versions of PageRank, community detection, shortest path, and more, beyond basic traversal

## Core Knowledge

- Cypher's pattern-matching syntax (`(a)-[:KNOWS]->(b)`) maps directly onto how you picture the graph, making complex multi-hop queries far easier to read than the same thing written in recursive SQL
- Native storage means the cost of walking relationships depends on the number of relationships touched, not the size of the whole graph — this is index-free adjacency in real form
- Unlike some NoSQL stores, single-instance Neo4j offers full ACID transactions, making it a reasonable choice even for workloads that need strong consistency, not just eventual consistency
- Vertical scaling (a bigger machine) handles most single-instance graph workloads well, since the whole graph does better when traversal data fits in memory. Horizontal write scaling is the truly hard problem, inherited from graph databases in general
- Causal clustering separates write capacity (core servers) from read capacity (read replicas), similar in spirit to primary/replica replication elsewhere. But it does not solve graph partitioning itself
- The built-in graph algorithms library (PageRank, Louvain community detection, shortest path options) is a major practical advantage — teams often pick Neo4j specifically for these, instead of building their own traversal logic
- A schema is optional, but constraints and indexes on node properties can be added on purpose — going fully schemaless by default, like document stores do, is not the common pattern seen in production
- Bulk import of large existing datasets needs dedicated tooling (`neo4j-admin import`) instead of row-by-row transactional writes, for performance reasons

## Interview Questions

**Q:** What does Cypher's pattern-matching syntax let you express that SQL struggles with?
**A:** Traversal patterns of varying length or multiple hops, as one declarative shape, like `(a)-[:FOLLOWS*1..3]->(b)` — avoiding the recursive CTEs or repeated joins SQL would need.

**Q:** Does Neo4j give up transactional guarantees for graph flexibility?
**A:** No — single-instance Neo4j provides full ACID transactions, which sets it apart from some other NoSQL graph engines that trade away consistency for scale.

**Q:** How does Neo4j's causal clustering scale the system?
**A:** Core servers handle writes using consensus, while read replicas scale out read traffic. But it does not partition the graph itself, so one huge, densely-connected graph still runs into the general graph-partitioning problem.

**Q:** Why would a team choose Neo4j specifically over building custom traversal logic on another store?
**A:** Its built-in graph algorithms library (PageRank, community detection, shortest path) gives production-grade implementations right out of the box, instead of needing custom-built ones.

## Scenario

A recommendation team first models "customers who bought X also bought Y" using SQL self-joins on a purchases table, and the query becomes too slow to use past two hops of "also bought" chaining. Modeling customers and products as nodes with PURCHASED relationships in Neo4j, and running a Cypher traversal query, returns multi-hop recommendation paths in roughly steady time relative to the local neighborhood, not the size of the whole purchase history table.

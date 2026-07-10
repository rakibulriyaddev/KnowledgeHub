---
id: neo4j
title: "Neo4j"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, nosql]
parent: graph-database
children: []
---

# Neo4j

## Overview

Neo4j is the reference property-graph database, built around native index-free adjacency and the Cypher query language for expressing traversals declaratively. It's the concrete engine behind the generic graph-database concepts — nodes, relationships, pattern matching — and the one most commonly reached for when a team first adopts graph modeling.

## Key Concepts

- **Cypher** — declarative pattern-matching query language, ASCII-art-like syntax for describing graph shapes
- **Native graph storage** — relationships are physical pointers on disk, not computed via joins or indexes
- **Labels** — tags on nodes used for grouping/typing (analogous to a table name, but not exclusive — a node can have multiple)
- **ACID transactions** — single-instance Neo4j supports full transactional guarantees, unlike some graph stores
- **Causal clustering** — Neo4j's replication/HA model, with a core cluster for writes and read replicas for scale
- **Graph algorithms library** — built-in implementations (PageRank, community detection, shortest path) beyond basic traversal

## Core Knowledge

- Cypher's pattern-matching syntax (`(a)-[:KNOWS]->(b)`) maps directly onto the mental model of the graph, making complex multi-hop queries far more readable than equivalent recursive SQL
- Native storage means relationship traversal cost is proportional to the number of relationships touched, not the total graph size — this is index-free adjacency in concrete form
- Unlike some NoSQL stores, single-instance Neo4j offers full ACID transactions, making it a reasonable choice even for workloads needing strong consistency, not just eventual
- Vertical scaling handles most single-instance graph workloads well since the whole graph benefits from fitting traversal-relevant data in memory; horizontal write scaling is the genuinely hard problem inherited from generic graph-database
- Causal clustering separates write capacity (core servers) from read capacity (read replicas), similar in spirit to primary/replica replication elsewhere, but doesn't solve graph partitioning itself
- The built-in graph algorithms library (PageRank, Louvain community detection, shortest path variants) is a major practical differentiator — teams often adopt Neo4j specifically for these rather than building traversal logic themselves
- Schema is optional but constraints and indexes (on node properties) can be added deliberately — pure schemaless-by-default like document stores is not the common production pattern
- Bulk import of large existing datasets requires dedicated tooling (`neo4j-admin import`) rather than row-by-row transactional writes, for performance reasons

## Interview Questions

**Q:** What does Cypher's pattern-matching syntax let you express that SQL struggles with?
**A:** Variable-length or multi-hop traversal patterns as a single declarative shape, like `(a)-[:FOLLOWS*1..3]->(b)`, avoiding the recursive CTEs or repeated joins SQL would need.

**Q:** Does Neo4j give up transactional guarantees for graph flexibility?
**A:** No — single-instance Neo4j provides full ACID transactions, distinguishing it from some other NoSQL graph engines that trade consistency for scale.

**Q:** How does Neo4j's causal clustering scale the system?
**A:** Core servers handle writes with consensus, while read replicas scale out read traffic — but it doesn't partition the graph itself, so a single huge densely-connected graph still faces the generic graph-partitioning problem.

**Q:** Why would a team choose Neo4j specifically over building custom traversal logic on another store?
**A:** Its built-in graph algorithms library (PageRank, community detection, shortest path) provides production-grade implementations out of the box rather than requiring custom implementation.

## Scenario

A recommendation team initially models "customers who bought X also bought Y" using SQL self-joins on a purchases table, and the query becomes unusably slow past two hops of "also bought" chaining. Modeling customers and products as nodes with PURCHASED relationships in Neo4j and running a Cypher traversal query returns multi-hop recommendation paths in roughly constant time relative to the local neighborhood, not the size of the purchase history table.

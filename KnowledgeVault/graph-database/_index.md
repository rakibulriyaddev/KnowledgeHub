---
id: graph-database
title: "Graph Database"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, nosql]
parent: unstructured-database
children: [neo4j]
status: draft
---

# Graph Database

## Overview

A graph database stores data as nodes and edges, making relationships a main part of the data instead of something rebuilt each time with joins. It exists for problems built around moving through connections — "what connects to what, how, and how far" — where table joins get slow as the number of steps grows. Neo4j, Amazon Neptune, and JanusGraph are the main tools here.

## Key Concepts

- **Node** — a thing, usually with properties (key-value details)
- **Edge / relationship** — a named, one-way link between two nodes, often with its own properties
- **Property graph** — the common model: nodes and edges, each with a label and properties
- **Traversal** — moving from node to node along edges to answer a question about relationships
- **Index-free adjacency** — each node stores direct links to its neighbors, so no index lookup is needed per step
- **Query language** — graph languages (Cypher, Gremlin) that describe traversals and pattern matches

## Core Knowledge

- Multi-step relationship searches (friends-of-friends, shortest path, suggestion paths) stay fast as the number of steps grows, while table joins slow down a lot with each extra step
- Index-free adjacency means the cost of moving through the graph depends on the size of the nearby area, not the size of the whole dataset — this is the main edge over join-based lookups
- This model works best when relationships are the point of the question (social networks, fraud rings, suggestion engines, dependency graphs) — not when data is mostly separate records
- The shape of nodes/edges is usually loose, like document stores, but relationship types are usually well defined and clear
- Graph databases don't naturally fit bulk math (sums, group-bys across millions of unrelated rows) — table or column stores fit that better
- Scaling across many machines is harder than other NoSQL types: splitting up a tightly connected graph without constant cross-machine traversal is a genuinely hard problem
- Cypher/Gremlin let you write "find all X connected to Y within N steps" in one simple query, which would be a mess of repeated joins in SQL
- Picking a graph database is about the shape of the data, not the size — a small, deeply connected dataset gains as much as (sometimes more than) a huge one

## Interview Questions

**Q:** Why do table joins get slower with more steps, while graph traversal doesn't as much?
**A:** A join re-checks and re-indexes at each step, while index-free adjacency lets a graph database follow direct links between connected nodes no matter how big the whole dataset is.

**Q:** When is a graph database the wrong choice?
**A:** When the work is bulk totals over mostly separate records rather than moving through relationships — table or column stores handle that better and scale more easily.

**Q:** What is index-free adjacency?
**A:** Each node directly points to its neighboring nodes/edges, so following a relationship is just a pointer-follow rather than an index lookup — the main reason graph traversal stays fast.

**Q:** Why is scaling across machines harder for graph databases than other NoSQL stores?
**A:** Tightly connected data resists clean splitting — any split risks constant traversal across machines, unlike key-value or document data that splits cleanly by key.

## Scenario

A fraud detection system must check if a new account is linked, through shared devices, addresses, or payment methods, to any account already flagged as bad — a question that in a table-based design means repeated multi-table joins that slow down a lot past two or three steps. A graph database models accounts and shared details as nodes and edges, and a shortest-path traversal answers "is this linked to a known-bad account within N steps" in roughly steady time based on the graph's nearby density, not the size of the whole dataset.

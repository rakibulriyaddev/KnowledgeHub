---
id: document-database
title: "Document Database"
created: 2026-07-10
modified: 2026-07-10
tags: [data, storage, nosql]
parent: unstructured-database
children: []
---

# Document Database

## Overview

A document database stores data as self-contained, semi-structured documents (typically JSON/BSON) rather than rows in fixed tables — each record carries its own shape. It exists to fit data whose structure varies between records or nests naturally, and to serve access patterns built around retrieving a whole entity at once. MongoDB, Couchbase, and Firestore lead this space.

## Key Concepts

- **Document** — self-contained record (JSON/BSON-like), can nest arrays and sub-objects
- **Collection** — grouping of documents, loosely analogous to a table but without enforced schema
- **Embedding** — nesting related data inside the parent document instead of a separate table/join
- **Referencing** — storing an id to another document instead of embedding, when data is shared or grows unbounded
- **Schema validation** — optional, engine-enforced rules some document databases allow layering on top
- **Sharding key** — field(s) determining how documents distribute across a cluster

## Core Knowledge

- Model around access patterns: embed data that's always read together, reference data that's shared across many parents or grows without bound
- Embedding avoids joins and serves "read whole entity" access patterns in one lookup, but duplicated embedded data must be kept in sync on updates
- No engine-enforced schema by default, but "schema-on-read" still means the application must handle every historical document shape that was ever written
- Unbounded embedded arrays (e.g. comments growing forever inside a post document) blow past document size limits and degrade performance — reference instead past a certain scale
- Multi-document transactions exist in modern document databases but cost more than single-document atomicity — design for single-document atomicity where possible
- Secondary indexes work similarly to relational indexes, but indexing deeply nested or array fields has different cost/behavior than a normal indexed field
- Schema validation layers (e.g. MongoDB's JSON Schema validator) let teams get some structure enforcement back without abandoning document flexibility
- Sharding key choice directly determines query routing efficiency and hot-shard risk, same as wide-column stores — pick based on the dominant access pattern, not convenience

## Interview Questions

**Q:** When do you embed vs reference data in a document model?
**A:** Embed when the data is always accessed together and bounded in size; reference when the data is shared across many parents or grows unbounded.

**Q:** Is a document database really schemaless?
**A:** The engine doesn't enforce one, but the application implicitly has a schema and must handle every shape it has ever written — flexibility moves the burden, not removes it.

**Q:** Why is a comments array embedded directly in a post document a risk?
**A:** Unbounded growth pushes the document toward size limits and degrades read/write performance — better to reference comments as separate documents past a small scale.

**Q:** How do document database transactions compare to relational ones?
**A:** Single-document writes are atomic by default and cheap; multi-document transactions are supported in modern versions but carry more overhead than the relational default.

## Scenario

A blogging platform models posts with an embedded array of comments, and once popular posts reach thousands of comments, document reads and writes slow down and occasionally hit size limits. Switching comments to separate documents referencing the post by id, with pagination on read, keeps each document small and fast while still supporting posts with unlimited comment counts.

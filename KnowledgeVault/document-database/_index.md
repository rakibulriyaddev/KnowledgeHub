---
id: document-database
title: "Document Database"
created: 2026-07-10
modified: 2026-07-22
tags: [data, storage, nosql]
parent: unstructured-database
children: [mongodb]
status: draft
---

# Document Database

## Overview

A document database stores data as self-contained documents (usually JSON/BSON) instead of rows in fixed tables — each record can have its own shape. It exists for data whose structure changes from record to record, or naturally nests inside itself, and for cases where you want to read a whole item in one go. MongoDB, Couchbase, and Firestore are the leading examples.

## Key Concepts

- **Document** — self-contained record (JSON/BSON-like), can nest arrays and sub-objects
- **Collection** — grouping of documents, a bit like a table but with no fixed schema
- **Embedding** — putting related data inside the parent document, instead of a separate table with a join
- **Referencing** — storing the id of another document instead of nesting it, used when data is shared or keeps growing
- **Schema validation** — optional rules some document databases let you add, checked by the engine
- **Sharding key** — the field(s) that decide how documents spread across a cluster

## Core Knowledge

- Design around how the data is read: nest data that is always read together, and reference data that is shared by many parents or that keeps growing
- Nesting data avoids joins and lets you read a whole item in one lookup, but any copy of that data must be kept in sync whenever it changes
- There is no fixed schema by default, but this "schema-on-read" style still means the app must handle every old document shape it has ever written
- Arrays nested inside a document that keep growing without limit (like comments inside a post) can pass the document size limit and slow things down — past a certain size, reference them instead
- Modern document databases support transactions across many documents, but these cost more than a single-document write, which is atomic by default — design for single-document writes where you can
- Secondary indexes work much like relational indexes, but indexing deeply nested fields or array fields behaves and costs differently than a normal indexed field
- Schema validation layers (like MongoDB's JSON Schema validator) let teams get some structure back without giving up document flexibility
- The sharding key you pick directly affects how well queries route and the risk of a hot shard, just like in wide-column stores — choose it based on the main access pattern, not what is easiest

## Interview Questions

**Q:** When do you embed vs reference data in a document model?
**A:** Nest data when it is always read together and stays a bounded size; reference it when it is shared by many parents or keeps growing.

**Q:** Is a document database really schemaless?
**A:** The engine does not enforce a schema, but the app still has one implicitly, and must handle every shape it has ever written. Flexibility just moves this work, it does not remove it.

**Q:** Why is a comments array embedded directly in a post document a risk?
**A:** Growth with no limit pushes the document toward its size limit and slows down reads and writes — past a small scale, it is better to store comments as separate documents and reference them.

**Q:** How do document database transactions compare to relational ones?
**A:** A single-document write is atomic by default and cheap; transactions across many documents are supported in modern versions, but cost more than the relational default.

## Scenario

A blogging platform stores posts with a nested array of comments. Once popular posts reach thousands of comments, reading and writing the document slows down and sometimes hits the size limit. Switching comments to separate documents that reference the post by id, with pagination on read, keeps each document small and fast, while still allowing unlimited comments on a post.

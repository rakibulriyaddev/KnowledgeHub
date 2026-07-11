---
id: database-federation
title: "Database Federation"
created: 2026-07-11
modified: 2026-07-11
tags: [databases, scaling, microservices, architecture]
parent: sd-databases
children: []
status: draft
---

## Overview

Database Federation (functional partitioning) splits one monolithic database into separate databases by function or feature — a User DB, an Order DB, a Product DB — instead of one DB holding everything. It is the database-level foundation of the "database per service" pattern in microservices.

## Key Concepts

- Functional partitioning — split by domain/feature, not by rows.
- Federation vs sharding — different schemas/tables vs same schema, different rows.
- Cross-DB JOIN and distributed transaction challenges.
- Data duplication and eventual sync between federated DBs.
- Database-per-service as the microservices manifestation of federation.

## Core Knowledge

Federation gives each business domain its own database, enabling independent scaling, independent technology choice (polyglot persistence — MySQL for users, MongoDB for a forum), team autonomy, and failure isolation (a forum outage doesn't take down checkout). It differs from sharding: sharding splits rows of one logical table across nodes using a shard key, while federation splits by service boundary into different schemas entirely — and the two are complementary (federate first, then shard the hot DB).

The main costs are architectural. Cross-DB JOINs disappear — a user profile plus their orders now requires two queries merged at the application or API-gateway layer. Transactions spanning federated DBs (order + payment + inventory) can no longer rely on single-DB ACID; the Saga pattern with eventual consistency is the standard fix. Reporting across domains becomes harder and typically needs a separate data warehouse fed by ETL or CDC. Data that's needed across domains (e.g., a username shown in product reviews) has to be cached or duplicated with async sync rather than joined live.

Federation fits when an app has multiple distinct domains needing different scale or technology, and when a team wants autonomy or is heading toward microservices. It's a poor fit for small monoliths, JOIN-heavy relational data, or teams unable to absorb the added operational overhead of running and monitoring multiple databases.

## Interview Questions

**Q: How does Database Federation differ from Sharding?**
A: Sharding splits rows of the same table/schema across nodes by a shard key; federation splits into different databases by function/domain, each potentially with its own schema and technology.

**Q: How do you handle a query that needs data from two federated databases?**
A: There's no cross-DB JOIN — query each DB independently and merge the results at the application or API-gateway layer, or denormalize/cache the needed fields locally.

**Q: How are transactions handled across federated databases?**
A: Via the Saga pattern — a sequence of local transactions with compensating actions — accepting eventual consistency instead of a single distributed ACID transaction.

## Scenario

An e-commerce platform's single database serving users, products, orders, and forum posts becomes a bottleneck. The team federates it into a User DB, Product DB, Order DB, and Forum DB, letting each scale independently and even use different storage technology, while a Saga handles the checkout flow that touches Order, Payment, and Inventory.

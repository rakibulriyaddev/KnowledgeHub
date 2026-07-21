---
id: database-federation
title: "Database Federation"
created: 2026-07-11
modified: 2026-07-22
tags: [databases, scaling, microservices, architecture]
parent: sd-databases
children: []
status: draft
---

## Overview

Database Federation (splitting by job) breaks one big database into separate databases by job or feature — a User DB, an Order DB, a Product DB — instead of one DB holding everything. It is the database-level base for the "one database per service" pattern in microservices.

## Key Concepts

- Splitting by job — split by area/feature, not by rows.
- Federation vs sharding — different structures/tables vs same structure, different rows.
- Cross-DB JOIN and spread-out transaction problems.
- Data copying and delayed syncing between federated DBs.
- Database-per-service as the microservices version of federation.

## Core Knowledge

Federation gives each business area its own database, allowing separate scaling, separate tech choice (mixed storage — MySQL for users, MongoDB for a forum), team freedom, and failure isolation (a forum outage doesn't take down checkout). It differs from sharding: sharding splits rows of one logical table across nodes using a shard key, while federation splits by service boundary into completely different structures — and the two work well together (federate first, then shard the busy DB).

The main costs are structural. Cross-DB JOINs go away — getting a user's profile plus their orders now needs two queries joined at the app or gateway layer. Transactions that cross federated DBs (order + payment + inventory) can no longer rely on single-DB ACID rules; the Saga pattern with delayed consistency is the standard fix. Reporting across areas becomes harder and usually needs a separate data warehouse fed by ETL or CDC. Data needed across areas (like a username shown in product reviews) has to be cached or copied with a background sync instead of joined live.

Federation fits when an app has several clearly different areas needing different scale or tech, and when a team wants freedom or is moving toward microservices. It fits poorly for small single systems, JOIN-heavy relational data, or teams that can't handle the extra work of running and watching many databases.

## Interview Questions

**Q: How does Database Federation differ from Sharding?**
A: Sharding splits rows of the same table/structure across nodes by a shard key; federation splits into different databases by job/area, each maybe with its own structure and tech.

**Q: How do you handle a query that needs data from two federated databases?**
A: There's no cross-DB JOIN — query each DB on its own and join the results at the app or gateway layer, or copy/cache the needed fields locally.

**Q: How are transactions handled across federated databases?**
A: Through the Saga pattern — a chain of local transactions with backup actions — accepting delayed consistency instead of one spread-out ACID transaction.

## Scenario

An e-commerce site's single database serving users, products, orders, and forum posts becomes a bottleneck. The team splits it into a User DB, Product DB, Order DB, and Forum DB, letting each scale on its own and even use different storage tech, while a Saga handles the checkout flow that touches Order, Payment, and Inventory.

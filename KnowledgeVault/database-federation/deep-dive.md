---
title: "Database Federation — Deep Dive"
---

An e-commerce site has users, products, orders, payments - all in one DB. The database gets overwhelmed. Sharding is complex. Another option: separate DBs by function. A User DB for the user service, an Order DB for the order service, and so on. This is Database Federation.

## What is Database Federation?

**Federation** (functional partitioning) = splitting one monolithic DB into separate DBs by function/feature. Each federated DB handles a specific business domain.

## Example

Before federation:

```
[Single DB]
- users (table)
- products
- orders
- payments
- forum_posts
- analytics
```

After federation:

```
[User DB] [Product DB] [Order DB] [Forum DB]
- users - products - orders - posts
- profiles - inventory - payments - comments
- sessions - reviews - shipping - threads
```

## Why Federation?

- **Performance:** Each DB is smaller, faster.
- **Independent scaling:** Scale the hot service's DB.
- **Independent technology choice:** MySQL for Users, MongoDB for Forum.
- **Team autonomy:** Each team manages its own DB.
- **Failure isolation:** Forum DB down = user/order unaffected.
- **Schema isolation:** Different domains can evolve different schemas.

## Federation vs Sharding

**Sharding**
- Splits rows of the same table
- Same schema
- Horizontal partition
- Scales: data volume
- Via hash/range key

**Federation**
- Splits into different tables
- Different schemas possible
- Functional partition
- Scales: feature load
- Via service boundary

They can be used together - federate first, then shard the hot DB.

## Relationship to Microservices

In microservice architecture, federation is almost mandatory - the "database per service" pattern:
- Each microservice has its own DB.
- Service-to-service communication happens via API.
- Cross-DB queries are restricted.

## Challenges

### Cross-DB JOIN
Need a user profile + their orders together? Separate queries against two DBs.
- **Solution:** Application-level join, denormalization, API gateway aggregation.

### Distributed Transaction
Order creation + payment debit + inventory deduction - different DBs.
- **Solution:** Saga pattern, eventual consistency.

### Reporting
Cross-feature analytics becomes hard.
- **Solution:** A data warehouse - ETL from every DB.

### Data Duplication
Need the user's name in the Product DB too (for reviews). Where do you keep it?
- **Solution:** Cache user data; eventual sync.

## When to Use Federation?

- The application has multiple distinct features/domains.
- Different features need different scale.
- You prefer different data models (SQL vs NoSQL).
- You want team autonomy.
- You're planning a microservice migration.

## When Not to Use Federation?

- Small monolithic applications.
- Highly relational, JOIN-heavy data.
- Strong cross-feature transactions are needed.
- A small team that can't handle the operational overhead.

## Real-world Examples

- **Amazon:** Orders, inventory, recommendations - all separate DBs.
- **Netflix:** Polyglot persistence + a DB per service.
- **Uber:** Trips, payments, users - federated, microservices.
- **Wikipedia:** Wiki content, users, images - different DBs.

## Implementation Path

1. **Identify boundaries:** Domain-driven design, bounded contexts.
2. **Extract incrementally:** One feature, one DB at a time.
3. **Define APIs:** Cross-domain access goes through APIs - no direct DB access.
4. **Data sync:** Event-driven, eventual consistency.
5. **Reporting layer:** Data warehouse or CQRS.

## Common Misconceptions

1. **"Federation is a simple split":** No - it adds operational complexity.
2. **"Cross-DB JOINs are easy":** No - they need application/API-level merging.
3. **"Federation = microservices":** Related but not the same - federation is DB-level, microservices are service-level.

## Best Practices

- Define bounded contexts - domain-driven design.
- Respect API/service boundaries - avoid direct cross-DB queries.
- Saga + eventual consistency.
- Cache cross-domain data - accept duplication.
- A separate reporting layer (data warehouse, CDC).
- Incremental migration - avoid big bang.

## Chapter Summary

- Federation = splitting a DB by function/feature.
- Sharding is row-based; Federation is function-based.
- The foundation of microservices' "database per service".
- Cross-DB JOINs and transactions - the main challenges.
- Handled with Saga + eventual consistency.

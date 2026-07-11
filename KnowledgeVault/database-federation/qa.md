---
title: "Database Federation — Q&A"
---

**Q: What is the definition of Database Federation?**
A: Splitting a DB by function/feature — Federation = functional partitioning across DBs.

**Q: What's the main difference between Federation and Sharding?**
A: Federation is function-based, Sharding splits rows of the same table — Federation splits by different features; Sharding splits rows of the same table.

**Q: Federation and Sharding can be used together.**
A: True — Federate first; then shard the hot DB.

**Q: Which pattern underlies microservices' "database per service"?**
A: Federation — Each microservice having its own DB = the federation pattern.

**Q: Which of these is NOT a benefit of Federation?**
A: Easy cross-DB JOINs — Cross-DB JOINs actually become harder with federation.

**Q: Which pattern is commonly paired with federation?**
A: Saga (eventual consistency) — Cross-DB transactions are handled with Saga.

**Q: How is reporting handled with federation?**
A: ETL into a data warehouse - aggregate from every DB — Cross-feature analytics is pulled into a warehouse.

**Q: Federation increases operational complexity.**
A: True — Monitoring, backing up, and deploying multiple DBs adds overhead.

**Q: An e-commerce site has users, products, orders - all in one DB. Performance is poor. What do you do?**
A: Federation: separate User DB, Product DB, Order DB — A functional split allows independent scaling per domain.

**Q: You need a user's profile + recent order together (federated DBs). What do you do?**
A: Application level - merge two API calls — There's no cross-DB JOIN - merge at the application/API gateway level.

**Q: When is it best not to use Federation?**
A: A small app + JOIN-heavy data + a small team — The overhead of federation is hard for a small team to absorb.

**Q: Why is bounded context important?**
A: For identifying federation boundaries - domain-driven — DDD tells you which data belongs to which service.

**Q: Sharding after federation is impossible.**
A: False — The hot DB among the federated DBs can be sharded separately.

**Q: How does polyglot persistence work with federation?**
A: Each federated DB can choose a different technology — User DB on MySQL, Product DB on MongoDB - independent choice.

**Q: Why does team autonomy increase with federation?**
A: Each team can evolve its own DB schema/tech without coordination — Independent ownership = independent decisions.

**Q: How is cross-feature data sync typically done?**
A: Event-driven (Kafka/RabbitMQ) — Publish an event → other services react = eventual sync.

**Q: Why is data duplication natural with federation?**
A: There's no cross-DB JOIN - some data must be cached/duplicated — A user's name in the Product DB - for fast access in reviews.

**Q: Why is big-bang migration not a good idea?**
A: The risk is higher - incremental is better — Incremental migration is safer - feature by feature.

**Q: Federation makes strong cross-feature transactions harder.**
A: True — Distributed transactions are complex - Saga accepts eventual consistency instead.

**Q: Which is the best example of a heavily federated company?**
A: Amazon (orders, inventory, recommendations in separate DBs) — Large e-commerce/social media companies are heavily federated.

---
title: "Scalability — Deep Dive"
---

You opened a small tea stall - selling 50 cups a day. A few months later it's 500 cups - you can't keep up alone anymore. What do you do? Work faster yourself (vertical), or hire 2 more people (horizontal)? It's the same story in software.

## What is Scalability?

**Scalability** = a system's ability to handle increased load (users, data, transactions) without its performance breaking down.

**Note:** A simple yardstick - if users increase 10x, do you need 10x the hardware, or less? If less, it's scalable. If more, that's diseconomies of scale.

## Vertical vs Horizontal Scaling

**Vertical Scaling (Scale Up)**
- More CPU, RAM, storage on the same server
- Simple - no code changes needed
- Limit: the hardware's maximum
- Single point of failure
- Cost increases exponentially
- Example: 4-core -> 32-core CPU

**Horizontal Scaling (Scale Out)**
- Add more servers
- Nearly unlimited scale
- Easier HA
- Code must be stateless
- Complexity increases - distributed systems
- Example: 1 server -> 100 servers

**Note:** Today's reality - in the cloud, horizontal scaling is almost always preferred - auto-scaling, redundancy, cost-effectiveness. Only scale vertically when the refactor cost is greater than the hardware cost.

## The Scale Cube - Scaling Across Three Dimensions

Martin Abbott's model from the book The Art of Scalability:

### X-axis: Horizontal duplication
Multiple copies of the same server. Traffic distributed by a load balancer. The simplest approach.

### Y-axis: Functional decomposition
Breaking an application into services. Microservices. User service, Order service, Payment service separated.

### Z-axis: Data partitioning
Sharding data. Split the DB into 10 shards by User ID. Each shard on a separate server.

## Where are the bottlenecks?

- **CPU:** Compute-heavy operations (image processing, ML). Solution: optimize, parallelize, scale out.
- **Memory:** Cache full, GC pressure. Solution: bigger server, distributed cache.
- **Disk I/O:** Slow database reads/writes. Solution: SSD, indexing, caching.
- **Network:** Bandwidth saturated. Solution: CDN, compression.
- **Database:** Usually the first bottleneck. Solution: replication, sharding, caching.

## Scalability Patterns

### Stateless Architecture
Don't keep session state on the server. Keep it in Redis/JWT instead. Servers become interchangeable.

### Caching
Serve read-heavy load from cache instead of the DB - protecting the DB.

### Asynchronous Processing
Heavy tasks go to a background queue. The user gets an immediate response.

### Database Replication
Distribute read load with read replicas. Writes go to the master.

### Database Sharding
Partition data - each shard in a separate DB.

### CDN
Offload static assets - reduces load on the origin.

### Microservices
Independent scaling - scale only the hot service.

## Capacity Planning

To scale correctly you need to measure first:
- **QPS (Queries per Second):** 100M users x 10 actions/day = ~12K QPS.
- **Storage:** Users x data per user x growth.
- **Bandwidth:** Daily transfer x peak factor.
- **Peak vs average:** Peak is usually 2-3x the average.
- **Headroom:** Keep a 30% buffer.

## Auto-scaling

Auto-scaling groups in the cloud (AWS, GCP, Azure):
- CPU > 70% -> add a server
- CPU < 30% -> remove a server
- Predictable load: scheduled scaling (more during office hours)
- Spike: rapid scaling rules

## Real-World Examples

- **Twitter:** Horizontal scaling + functional decomposition (timeline, tweet, search services all separate).
- **Instagram:** 14M users served by 1 engineer - heavy use of Postgres + Redis caching.
- **WhatsApp:** Scaled vertically on the Erlang VM to handle several million concurrent connections per server.

## Common Misconceptions

1. **"Scale early":** Premature optimization - you don't need Kubernetes for 10 users.
2. **"More servers = more performance":** Distributed systems have overhead. Network I/O, coordination.
3. **"Vertical scaling is backward":** No, it's the simplest approach for a small system.

## Best Practices

- Design stateless apps (scale-out-friendly).
- The database becomes the bottleneck first - start with caching and indexing from day one.
- Monitoring (Prometheus, Datadog) - spot bottlenecks early.
- Load testing (k6, JMeter) - no surprises once in production.
- Async processing - heavy jobs go to the background.
- Avoid premature scaling - measure first.

## Chapter Summary

- Scalability = the ability to handle increased load.
- Vertical = a bigger server; Horizontal = more servers.
- Scale Cube: X (duplicate), Y (functional), Z (data shard).
- The database is usually the first bottleneck.
- Stateless + caching + async = a scalable foundation.

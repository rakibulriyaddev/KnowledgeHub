---
title: "Clustering — Deep Dive"
---

![Kubernetes cluster architecture](/vault/clustering/Kubernetes_cluster_architecture.jpeg)

Think of a football team. Even if one player is sick, the team can still play - because the rest of the team members work together. In the world of computing, this same teamwork is called **Clustering**.

## What is Clustering?

**Clustering** is the process of connecting two or more computers (nodes) together to form a unified system, so that they work like a single powerful server.

**Note:** Load Balancing only distributes traffic. Clustering also provides failover, shared storage, and distributed processing on top of that.

## Why is Clustering needed?

- **High Availability (HA):** The system keeps running even if one node fails.
- **Scalability:** New nodes can be added when load increases.
- **Performance:** Splitting up work gets it done faster.
- **Fault Tolerance:** Tolerates hardware or software failures.

## Types of Clusters

**Active-Passive**
- One node is active, the other is on standby
- The passive one takes over when the active one fails
- Slight downtime during failover
- Simple configuration
- Example: Database HA setup

**Active-Active**
- All nodes work together at the same time
- Load is distributed evenly
- No downtime
- Requires more resources
- Example: Web server cluster

## How does a Cluster work?

Key components of a cluster:
- **Nodes:** Each server in the cluster.
- **Cluster Manager:** Monitors and coordinates the nodes (e.g. Kubernetes, Pacemaker).
- **Heartbeat:** Nodes regularly tell each other "I'm alive".
- **Shared Storage:** All nodes can use the same storage (SAN, NAS).
- **Virtual IP:** A shared IP for the cluster - accessible from any node.

## Kubernetes Cluster

In the modern era, **Kubernetes** is the most popular container orchestration platform:
- **Master Node:** Manages the cluster (API Server, Scheduler, Controller).
- **Worker Node:** Runs application containers.
- **Pod:** The smallest deployable unit of containers.
- **Auto-healing:** If a Pod crashes, Kubernetes creates a new Pod itself.

## Database Clustering

Clustering is especially important for databases:
- **MySQL Cluster (NDB):** Real-time, in-memory distributed database.
- **PostgreSQL Patroni:** HA cluster manager.
- **MongoDB Replica Set:** One Primary, multiple Secondaries.
- **Cassandra:** Masterless cluster - all nodes are equal.

## Real-world examples

- **Netflix:** Thousands of nodes clustered on AWS - 24/7 uptime.
- **Google:** Clustering with their own Borg (predecessor of Kubernetes).
- **Facebook:** Distributed coordination with Apache ZooKeeper.
- **Airbnb:** Microservice clustering with Kubernetes.

## The Split-Brain Problem

**Caution:** During a network partition, two cluster nodes each think the other is dead and both become active - causing data inconsistency. Solution: Quorum (a voting system) - whatever the majority of nodes decide is what runs.

## Common misconceptions

1. **"A cluster is automatically fault-tolerant":** No - without proper configuration, the whole cluster can fail together.
2. **"More nodes is always better":** No - adding nodes increases network overhead and management complexity.
3. **"Cluster = Load Balancer":** No - a Load Balancer is one component; a Cluster is a broader concept.

## Best Practices

- Keep an odd number of nodes for quorum (3, 5, 7).
- Keep nodes in different physical locations (AZ or Region).
- Run regular failover drills - verify readiness.
- Set up health monitoring and alerting.
- Always keep a backup of the cluster state.

## Chapter Summary

- A cluster makes multiple servers/nodes function as one unified system.
- Active-Passive is simple; Active-Active is more effective.
- Kubernetes is the modern standard for container clustering.
- Use Quorum to prevent Split-Brain.
- Odd node count and different AZs - the key strategies for HA.

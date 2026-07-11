---
id: clustering
title: "Clustering"
created: 2026-07-11
modified: 2026-07-11
tags: [high-availability, distributed-systems, orchestration, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Clustering connects two or more computers (nodes) so they function as one unified, more powerful and resilient system. Unlike load balancing, which only distributes traffic, clustering adds failover, shared storage, and coordinated processing on top — the system keeps running even when individual nodes fail.

## Key Concepts

- Active-Passive — one node active, standby takes over on failure, brief downtime
- Active-Active — all nodes serve traffic simultaneously, no downtime, more resources needed
- Heartbeat — nodes signal liveness to each other continuously
- Cluster manager (Kubernetes, Pacemaker) coordinates nodes; shared storage and a virtual IP unify access
- Split-brain — a partition makes two sides both think they're primary; solved with quorum voting
- Kubernetes: Master/Worker nodes, Pods, auto-healing

## Core Knowledge

Clustering is built for four goals: high availability (the system survives a node failure), scalability (add nodes as load grows), performance (splitting work across nodes), and fault tolerance (absorbing hardware/software failures). Active-Passive clusters keep one node live and a standby ready, trading simplicity for a small failover gap; Active-Active clusters run all nodes concurrently with load spread across them, eliminating downtime at the cost of more resources and complexity.

A working cluster depends on several coordinating pieces: nodes (the individual servers), a cluster manager that monitors and orchestrates them, a heartbeat mechanism so nodes know when a peer has gone silent, shared storage (SAN/NAS) so failover doesn't lose data, and a virtual IP that gives clients one stable address regardless of which node is actually serving. Kubernetes has become the standard modern cluster manager: a Master Node runs the API server, scheduler, and controllers; Worker Nodes run application Pods (the smallest deployable unit); and auto-healing means Kubernetes recreates a crashed Pod without operator intervention.

Database clustering has its own patterns — MongoDB Replica Sets use one Primary and multiple Secondaries, Cassandra is masterless with all nodes equal, and PostgreSQL Patroni provides HA cluster management with automated failover and leader election.

**Caution:** during a network partition, split-brain can occur — each side of the partition believes the other has failed and both become active, corrupting data. The fix is quorum: only the partition with a majority of nodes is allowed to remain active, which is why clusters are typically sized with an odd node count (3, 5, 7).

## Interview Questions

**Q: What's the difference between clustering and load balancing?**
A: Load balancing only distributes incoming traffic across servers; clustering is the broader concept that also provides failover, shared storage, and coordinated processing — a load balancer is often just one component within a cluster.

**Q: What causes split-brain and how is it prevented?**
A: A network partition can make two sides of a cluster each believe the other has failed, so both become active and diverge. Quorum voting — requiring a majority of nodes to agree — prevents both sides from acting as primary simultaneously.

**Q: Why are clusters usually sized with an odd number of nodes?**
A: An odd count (e.g., 3 or 5) guarantees a clear majority is always possible during a partition, which is what quorum-based split-brain prevention depends on.

## Scenario

A team runs a web application needing 99.99% uptime across regions. They deploy an Active-Active Kubernetes cluster spanning multiple availability zones, with health-checked auto-healing Pods and an odd-numbered control-plane quorum — traffic keeps flowing and no single AZ or node failure takes the service down.

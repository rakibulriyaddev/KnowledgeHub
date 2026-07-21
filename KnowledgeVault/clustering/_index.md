---
id: clustering
title: "Clustering"
created: 2026-07-11
modified: 2026-07-22
tags: [high-availability, distributed-systems, orchestration, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

Clustering connects two or more computers (nodes) so they work as one bigger, stronger system. Unlike load balancing, which only spreads out traffic, clustering also adds failover, shared storage, and work done together across nodes — the system keeps running even when single nodes fail.

## Key Concepts

- Active-Passive — one node active, standby takes over on failure, brief downtime
- Active-Active — all nodes serve traffic simultaneously, no downtime, more resources needed
- Heartbeat — nodes keep telling each other that they are still alive
- Cluster manager (Kubernetes, Pacemaker) coordinates the nodes; shared storage and a virtual IP give one single point of access
- Split-brain — a network split makes both sides think they are the main one; fixed with quorum voting
- Kubernetes: Master/Worker nodes, Pods, auto-healing

## Core Knowledge

Clustering is built for four goals: high availability (the system survives a node failing), scalability (add nodes as load grows), performance (splitting work across nodes), and fault tolerance (handling hardware or software failures). Active-Passive clusters keep one node live and a standby ready — this is simple, but there is a small gap during failover. Active-Active clusters run all nodes at the same time with load spread across them — this removes downtime but needs more resources and is more complex.

A working cluster depends on several parts working together: nodes (the actual servers), a cluster manager that watches and controls them, a heartbeat so nodes know when another node has gone quiet, shared storage (SAN/NAS) so failover does not lose data, and a virtual IP that gives clients one steady address no matter which node is actually serving them. Kubernetes has become the standard cluster manager today: a Master Node runs the API server, scheduler, and controllers; Worker Nodes run application Pods (the smallest unit you can deploy); and auto-healing means Kubernetes brings back a crashed Pod on its own, with no person needed.

Database clustering has its own patterns — MongoDB Replica Sets use one Primary and several Secondaries, Cassandra is masterless with every node equal, and PostgreSQL Patroni gives HA cluster management with automatic failover and leader election.

**Caution:** during a network split, split-brain can happen — each side thinks the other side has failed, and both become active, which corrupts data. The fix is quorum: only the side with more than half the nodes is allowed to stay active. This is why clusters are usually sized with an odd number of nodes (3, 5, 7).

## Interview Questions

**Q: What's the difference between clustering and load balancing?**
A: Load balancing only spreads incoming traffic across servers; clustering is the bigger idea that also gives failover, shared storage, and coordinated processing — a load balancer is often just one piece inside a cluster.

**Q: What causes split-brain and how is it prevented?**
A: A network split can make both sides of a cluster believe the other side has failed, so both become active and drift apart. Quorum voting — needing agreement from more than half the nodes — stops both sides from acting as the main one at the same time.

**Q: Why are clusters usually sized with an odd number of nodes?**
A: An odd count (like 3 or 5) makes sure a clear majority is always possible during a network split, which is what quorum-based split-brain prevention needs.

## Scenario

A team runs a web app that needs 99.99% uptime across regions. They set up an Active-Active Kubernetes cluster spread across several availability zones, with health-checked, auto-healing Pods and an odd number of control-plane nodes for quorum — traffic keeps flowing, and no single zone or node failure can take the service down.

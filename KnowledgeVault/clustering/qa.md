---
title: "Clustering — Q&A"
---

**Q: What is the main purpose of Clustering?**
A: High Availability and Fault Tolerance — Clustering ensures High Availability and Fault Tolerance by making multiple nodes work together.

**Q: How many nodes work at the same time in an Active-Passive cluster?**
A: Just one (active) — In Active-Passive, only one node is active while the rest wait on standby.

**Q: What is the advantage of an Active-Active cluster?**
A: All nodes share the load together — In Active-Active, all nodes work, so load is distributed evenly and throughput increases.

**Q: What does Heartbeat do in a cluster?**
A: Nodes telling each other they're "alive" — Heartbeat is a regular signal telling whether a node is alive. A node is considered failed if the heartbeat is missed.

**Q: What is the smallest unit for running an application in Kubernetes?**
A: Pod — A Pod is the smallest deployable unit in Kubernetes, containing one or more containers.

**Q: What is the job of the Kubernetes Master Node?**
A: Managing and coordinating the cluster — The Master Node (Control Plane) manages the cluster via the scheduler, controller, and API server.

**Q: What is the solution to the Split-Brain problem?**
A: Quorum (voting system) — Quorum ensures that whatever the majority of nodes agree on is what runs - two partitions can't both be active at once.

**Q: Why are odd numbers of nodes (3, 5, 7) kept in a cluster?**
A: To ensure quorum — An odd number (like 3) ensures a majority can always be reached - 2 agreeing is a quorum.

**Q: In a MongoDB Replica Set, all nodes play an equal role.**
A: False — In a MongoDB Replica Set, one node is Primary and the rest are Secondary. Writes go to Primary, reads can happen from Secondary too.

**Q: Cassandra is a masterless cluster.**
A: True — In Cassandra all nodes are equal - there is no master. Read/write is possible from any node.

**Q: Using a cluster means data loss never happens.**
A: False — Clustering increases fault tolerance, but data loss can still happen without proper replication and backup.

**Q: Kubernetes can do auto-healing.**
A: True — Kubernetes automatically recreates a crashed Pod - a self-healing capability.

**Q: With Shared Storage, what can all the cluster's nodes do?**
A: Access the same storage — Shared Storage (SAN/NAS) gives all nodes access to the same data - ensuring data continuity during failover.

**Q: What does a Virtual IP (VIP) do in a cluster?**
A: Gives clients a stable IP for the cluster — The VIP is the cluster's shared IP - the client always connects to this IP, whichever node is active.

**Q: What is Google Borg?**
A: Container orchestration (predecessor of Kubernetes) — Google Borg is their internal container orchestration - the inspiration behind building Kubernetes.

**Q: What does PostgreSQL Patroni do in database clustering?**
A: HA cluster management — Patroni is PostgreSQL's HA cluster manager - it handles automatic failover and leader election.

**Q: Your web application needs 99.99% uptime. Which cluster type would you use?**
A: Active-Active (multiple AZ) — Active-Active across multiple AZs gives the highest uptime - the other AZ stays up even if one goes down.

**Q: How would you know if a node in the cluster has failed?**
A: Heartbeat monitoring and alerting — Heartbeat monitoring tracks node health in real time - it sends an alert on failure.

**Q: What should you do first when setting up a new cluster?**
A: Set up health checks and monitoring — Monitoring and health checks come first - without them you won't know when a node fails.

**Q: Where would you place nodes for a Disaster Recovery (DR) cluster?**
A: In a different geographic region — For DR, use a different geographic region - the system stays up even if a whole data center or region goes down.

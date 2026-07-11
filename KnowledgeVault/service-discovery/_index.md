---
id: service-discovery
title: "Service Discovery"
created: 2026-07-11
modified: 2026-07-11
tags: [microservices, distributed-systems, kubernetes, networking]
parent: reliability-security
children: []
status: draft
---

## Overview

Service discovery is a system that tracks how many instances of a service are running and where each one lives, letting clients query it for currently available instances instead of relying on static, hardcoded IPs. It solves the dynamic problem created by auto-scaling: if the Order Service goes from 5 to 20 instances, the User Service still needs to know which addresses are valid right now.

## Key Concepts

- Service registry — the database of running services and their locations.
- Self-registration vs. third-party registration (e.g., Kubernetes' kubelet).
- Client-side discovery — client queries registry and load-balances itself.
- Server-side discovery — a load balancer queries the registry on the client's behalf.
- Health checks — heartbeat, HTTP `/health`, TCP check, or custom script.
- Service mesh — sidecar proxies (Istio, Linkerd) unify discovery, load balancing, retry, and circuit breaking.

## Core Knowledge

Static configuration (a config file listing "Order service IP: 10.0.0.5") breaks down once auto-scaling makes instance counts and IPs change constantly, and it can't detect a failed instance still receiving traffic. Service discovery replaces this with a **registry** that services register into (self-registration with periodic heartbeats, or third-party registration by an orchestrator) and consumers query for a current instance list.

Two discovery patterns dominate. **Client-side discovery** has the client query the registry directly, then load-balance and call an instance itself (Netflix Eureka + Ribbon) — smart but pushes routing logic into every client. **Server-side discovery** has the client call a load balancer, which queries the registry and forwards the request (AWS ELB, Kubernetes Service) — simpler clients, at the cost of an extra hop. Popular registries include Consul (DNS-based, HashiCorp), etcd (Kubernetes' backbone KV store), ZooKeeper, Eureka (Netflix, an AP system), Kubernetes DNS (built-in via ClusterIP), and AWS Cloud Map.

DNS-based discovery is simple and standard — a client does a lookup to get the IP — but TTL caching can serve stale entries; SRV records add port information for more advanced cases. Kubernetes bakes discovery in natively: pods register automatically, a Service object exposes a stable DNS name, CoreDNS resolves it, and failed pods are automatically removed from the virtual ClusterIP's load-balancing pool.

**Note:** the modern trend is a **service mesh** (Istio, Linkerd, Consul Connect) — an Envoy sidecar per service that bundles discovery with load balancing, retries, and circuit breaking, removing that logic from application code entirely. Key challenges across all approaches: eventual consistency (registry update lag), stale entries from crashed instances, network partitions making the registry unreachable, and the registry itself needing high availability (typically a 3-5 node Raft/Paxos cluster) so it isn't a single point of failure.

## Interview Questions

**Q: What's the difference between client-side and server-side service discovery?**
A: In client-side discovery, the client queries the registry directly and load-balances across instances itself (more client logic, e.g. Eureka + Ribbon). In server-side discovery, the client calls a load balancer that queries the registry and forwards the request (simpler client, extra network hop, e.g. Kubernetes Service).

**Q: How does Kubernetes implement service discovery?**
A: Pods register automatically on creation; a Service object provides a stable DNS name resolved via CoreDNS/kube-dns; the virtual ClusterIP load-balances across healthy pods, and failed pods are automatically removed based on health checks.

**Q: Why can't the service registry itself be a single instance?**
A: It's critical infrastructure — if it goes down, no service can discover any other service. It's run as a highly-available cluster (typically 3-5 nodes) using a consensus protocol like Raft or Paxos.

## Scenario

An auto-scaling group for the Order Service scales from 5 instances to 20 during a traffic spike, then back down to 8. Each new instance self-registers with the registry and starts sending heartbeats; each terminated instance fails its health check and is automatically removed. The User Service never has a hardcoded IP — it always queries the registry (or its local load balancer) and gets the current, healthy instance list.

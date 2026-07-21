---
id: service-discovery
title: "Service Discovery"
created: 2026-07-11
modified: 2026-07-22
tags: [microservices, distributed-systems, kubernetes, networking]
parent: reliability-security
children: []
status: draft
---

## Overview

Service discovery is a system that tracks how many copies of a service are running and where each one lives, letting clients ask it for the currently available copies instead of relying on fixed, hardcoded addresses. It solves the moving-target problem created by auto-scaling: if the Order Service goes from 5 to 20 copies, the User Service still needs to know which addresses work right now.

## Key Concepts

- Service registry — the list of running services and where they are.
- Self-registration vs. registration by a third party (like Kubernetes' kubelet).
- Client-side discovery — the client asks the registry and spreads load itself.
- Server-side discovery — a load balancer asks the registry on the client's behalf.
- Health checks — heartbeat, HTTP `/health`, TCP check, or a custom script.
- Service mesh — sidecar proxies (Istio, Linkerd) combine discovery, load balancing, retry, and circuit breaking.

## Core Knowledge

A fixed config file (listing "Order service IP: 10.0.0.5") stops working once auto-scaling makes instance counts and IPs change all the time, and it can't tell when an instance has failed but is still getting traffic. Service discovery replaces this with a **registry** that services join (self-registration with regular heartbeats, or registration by an outside orchestrator), and callers query for the current list of instances.

Two patterns are common. **Client-side discovery** has the client ask the registry directly, then spread load and call an instance itself (Netflix Eureka + Ribbon) — powerful, but pushes routing logic into every client. **Server-side discovery** has the client call a load balancer, which asks the registry and forwards the request (AWS ELB, Kubernetes Service) — simpler clients, at the cost of one extra hop. Popular registries include Consul (DNS-based, HashiCorp), etcd (Kubernetes' backbone key-value store), ZooKeeper, Eureka (Netflix), Kubernetes DNS (built in via ClusterIP), and AWS Cloud Map.

DNS-based discovery is simple and standard — a client just looks up a name to get an IP — but caching (TTL) can hand back old entries; SRV records add port info for more advanced cases. Kubernetes has discovery built in: pods register on their own, a Service object gives a stable DNS name, CoreDNS resolves it, and failed pods are automatically taken out of the virtual ClusterIP's pool.

**Note:** the modern trend is a **service mesh** (Istio, Linkerd, Consul Connect) — an Envoy sidecar per service that bundles discovery with load balancing, retries, and circuit breaking, taking that logic out of app code completely. Key problems across all approaches: lag in the registry catching up, old entries left behind by crashed instances, network splits that make the registry unreachable, and the registry itself needing high availability (usually a 3-5 node Raft/Paxos cluster) so it isn't a single point of failure.

## Interview Questions

**Q: What's the difference between client-side and server-side service discovery?**
A: In client-side discovery, the client asks the registry directly and spreads load across instances itself (more client logic, e.g. Eureka + Ribbon). In server-side discovery, the client calls a load balancer that asks the registry and forwards the request (simpler client, one extra hop, e.g. Kubernetes Service).

**Q: How does Kubernetes handle service discovery?**
A: Pods register on their own when created; a Service object gives a stable DNS name resolved via CoreDNS/kube-dns; the virtual ClusterIP spreads load across healthy pods, and failed pods are removed automatically based on health checks.

**Q: Why can't the service registry itself be a single instance?**
A: It's critical infrastructure — if it goes down, no service can find any other service. It runs as a highly-available cluster (usually 3-5 nodes) using a consensus method like Raft or Paxos.

## Scenario

An auto-scaling group for the Order Service grows from 5 instances to 20 during a traffic spike, then shrinks back to 8. Each new instance registers itself with the registry and starts sending heartbeats; each stopped instance fails its health check and gets removed automatically. The User Service never has a hardcoded IP — it always asks the registry (or its local load balancer) and gets the current, healthy list.

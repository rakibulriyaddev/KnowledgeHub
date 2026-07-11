---
title: "Service Discovery — Deep Dive"
---

Your backend runs 10 instances of the Order Service. Auto-scaling changes the count - from 5 to 20. Each instance has its own IP. When the User Service wants to call the "Order Service", which IP should it call? The solution to this dynamic problem is **Service Discovery**.

## Problem: Static Configuration Breaks Down

The traditional approach:

- A config file says "Order service IP: 10.0.0.5".
- When the IP changes - update the config and redeploy.
- Auto-scaling means constant change.
- A failed instance still gets requests sent to it.

## What Is Service Discovery?

**Service Discovery** = a system that tracks how many instances of a service are running and the network location of each one. Clients query this system to get the currently available instances.

## Key Components

- **Service Registry:** A database of all running services and their locations.
- **Service Provider:** The service that registers itself.
- **Service Consumer:** Queries the registry to get a location.
- **Health Check:** Periodically checks whether it's alive.

## Service Registration

### Self-Registration

The service registers itself with the registry on startup, unregisters on shutdown, and sends periodic heartbeats.

### Third-party Registration

An external agent (orchestrator) registers/unregisters it. In Kubernetes, kubelet does this automatically.

## Discovery Patterns

### Client-Side Discovery

The client queries the registry → gets the instance list → load-balances and calls directly.

```
[Client]
   ↓ query
[Service Registry]
   ↓ instance list
[Client] choose + call → [Instance]
```

- **Benefit:** Smart routing lives on the client.
- **Drawback:** More client-side logic; complex across multiple languages.
- **Tools:** Netflix Eureka + Ribbon.

### Server-Side Discovery

The client calls a load balancer → the LB queries the registry, picks an instance, and forwards.

```
[Client] → [Load Balancer]
                ↓ query
          [Service Registry]
                ↓
            [Instance]
```

- **Benefit:** Simpler client.
- **Drawback:** Extra hop (the LB).
- **Tools:** AWS ELB, Kubernetes Service.

## Popular Tools

- **Consul:** HashiCorp - full-featured, DNS-based discovery.
- **etcd:** Kubernetes' backbone - a distributed KV store.
- **ZooKeeper:** Apache, part of the Hadoop ecosystem.
- **Eureka (Netflix):** An AP system, client-side discovery.
- **Kubernetes DNS:** Built-in - via ClusterIP on a Service.
- **AWS Cloud Map:** Managed service discovery.

## DNS-Based Discovery

Service registration → DNS records. The client does a DNS lookup to get the IP.

- Standard and simple.
- TTL caching can cause issues.
- SRV records are more advanced (include port info).
- The default in Kubernetes.

## Kubernetes Service Discovery

Service discovery is built into K8s:

- A pod is created → automatically registered.
- A Service object provides a stable name (e.g., `user-service`).
- kube-dns or CoreDNS resolves it via DNS.
- ClusterIP is virtual - load-balances across pods.
- If a pod fails, it's automatically removed.

## Health Check

Detecting whether a service is alive:

- **Heartbeat:** The service periodically pings the registry.
- **HTTP health endpoint:** `/health` returns 200.
- **TCP check:** Whether the port is open.
- **Custom script:** Application-specific.

On failure detection → the instance is unregistered.

## Service Mesh - the Modern Approach

Istio, Linkerd, Consul Connect - via a sidecar proxy:

- Automates service-to-service communication.
- Discovery + load balancing + retry + circuit breaker, all together.
- No network logic in the application code.
- An Envoy proxy per service.

## Real-World Examples

- **Netflix:** Eureka - the pioneer.
- **Airbnb:** SmartStack (Consul-based).
- **Modern startups:** Kubernetes' built-in discovery.
- **HashiCorp ecosystem:** Consul.

## Challenges

- **Eventual consistency:** Lag in registry updates.
- **Stale entries:** A crashed instance is still listed.
- **Network partition:** Registry unreachable = trouble.
- **Registry HA:** The registry itself shouldn't be a single point of failure.

## Common Misconceptions

1. **"DNS is enough":** Caching issues plus no health check.
2. **"Manual config is fine at small scale":** Breaks down with auto-scaling.
3. **"Client-side is always better than server-side":** Depends on the use case.

## Best Practices

- Health checks are mandatory.
- Run the registry as an HA cluster (3-5 nodes).
- Short TTL - detect failures quickly.
- Consider migrating to a service mesh for modern systems.
- If you have K8s - use its built-in discovery.
- Local cache + fallback if the registry is down.

## Chapter Summary

- Service Discovery tracks dynamic locations.
- Service Registry + provider + consumer + health check.
- Client-side vs Server-side discovery patterns.
- Consul, etcd, Eureka, K8s DNS are popular choices.
- Service Mesh (Istio) is the modern, unified solution.

---
title: "Service Discovery — Q&A"
---

**Q: What is the main purpose of Service Discovery?**
A: Track dynamic locations - where services are — Tracks changes when IP/port changes.

**Q: What is a Service Registry?**
A: A database of running services and their locations — The central source of truth.

**Q: What is self-registration?**
A: The service registers itself on startup; sends heartbeats — The service's own responsibility.

**Q: What happens in Client-Side Discovery?**
A: The client queries the registry → chooses an instance and calls it — The client load-balances and routes.

**Q: What happens in Server-Side Discovery?**
A: The load balancer queries the registry and forwards — The client stays simple; the LB is smart.

**Q: Netflix's service registry?**
A: Eureka — Eureka - Netflix's open-source project.

**Q: Kubernetes' underlying KV store?**
A: etcd — etcd is the backbone of K8s state.

**Q: HashiCorp's service-mesh-friendly registry?**
A: Consul — Consul with a DNS interface.

**Q: Kubernetes provides built-in service discovery.**
A: True — CoreDNS + Service object - automatic.

**Q: A common health check approach?**
A: An HTTP /health endpoint or a TCP port check — Detects whether the service is alive.

**Q: An auto-scaling group changes instance count 5 → 20 → 8. What is service discovery's role?**
A: Automatic register/unregister + health-check tracking — A core need in dynamic environments.

**Q: An instance crashes. What happens?**
A: Health check fails → removed from registry → traffic redirected — Self-healing - automatic detection.

**Q: What's the problem with DNS-based discovery?**
A: TTL caching - stale entries — DNS cache update lag.

**Q: What is an SRV record used for?**
A: Service location including port info — A standard DNS record for services.

**Q: Service Mesh is the modern unified solution for service discovery.**
A: True — Discovery + LB + retry + CB all in the sidecar.

**Q: Popular Service Mesh implementations?**
A: Istio, Linkerd, Consul Connect — The sidecar proxy pattern.

**Q: How do you avoid the service registry becoming a SPOF?**
A: An HA cluster (3-5 nodes) with Raft/Paxos consensus — The registry itself is critical infrastructure.

**Q: Eureka's CAP category?**
A: AP - prioritizes availability — Availability is critical at Netflix.

**Q: Why does static config break in modern microservices?**
A: Auto-scaling means constant IP changes — Static config doesn't fit dynamic environments.

**Q: A local cache + fallback is useful when the registry is down.**
A: True — Adds resilience during a temporary registry outage.

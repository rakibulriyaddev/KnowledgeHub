---
id: reliability-security
title: "Reliability & Security"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, distributed-systems, reliability, security]
parent: system-design
children: [circuit-breaker, disaster-recovery, rate-limiting, service-discovery, sla-slo-sli, geohashing, oauth-oidc, ssl-tls-mtls, sso, vm-containers]
status: draft
---

## Overview

A system that's fast but falls over under failure, or fast but insecure, isn't done. This group covers keeping systems up when parts fail (circuit breakers, disaster recovery, service discovery), keeping them fair under load (rate limiting), measuring reliability itself (SLA/SLO/SLI), securing access (OAuth/OIDC, SSO, SSL/TLS/mTLS), the compute layer underneath it all (VMs and containers), and an applied technique for location-based systems (geohashing).

## Key Concepts

- Failure containment — circuit breakers, disaster recovery, service discovery.
- Fairness under load — rate limiting.
- Reliability measurement — SLA, SLO, SLI.
- Security — OAuth/OIDC, SSO, SSL/TLS/mTLS.
- Compute isolation — VMs vs. containers.

## Core Knowledge

Circuit breakers stop a failing downstream dependency from cascading failures upstream by failing fast instead of piling up retries. Service discovery lets dynamically-scaled services find each other without hardcoded addresses. Disaster recovery plans for the worst case — losing a whole region or datacenter. Rate limiting protects a system from being overwhelmed, whether by abuse or legitimate spikes. SLAs, SLOs, and SLIs turn "reliable" into a measurable, contractual target. On the security side, OAuth/OIDC and SSO handle who a user is and what they can access, while SSL/TLS/mTLS secure the transport itself. VMs and containers are the two dominant ways to isolate and package workloads, trading full OS isolation for weight and startup time.

## Interview Questions

**Q: What's the difference between SLA, SLO, and SLI?**
A: SLI is the measured metric (e.g. latency), SLO is the internal target for that metric, and SLA is the external contractual promise, usually with a penalty for missing it.

**Q: How does a circuit breaker differ from a retry?**
A: A retry keeps trying the same failing call; a circuit breaker detects repeated failure and stops calling entirely for a period, protecting both caller and callee.

**Q: What does mTLS add over TLS?**
A: TLS authenticates the server to the client; mTLS additionally authenticates the client to the server, so both sides prove identity — common for service-to-service auth.

## Scenario

A payment service starts timing out. A circuit breaker on the calling service trips after a threshold of failures, so upstream requests fail fast instead of queuing up and exhausting connection pools — buying time for the payment service to recover without taking the whole platform down with it.

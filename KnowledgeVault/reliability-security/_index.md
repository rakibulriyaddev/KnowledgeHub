---
id: reliability-security
title: "Reliability & Security"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, distributed-systems, reliability, security]
parent: system-design
children: [circuit-breaker, disaster-recovery, rate-limiting, service-discovery, sla-slo-sli, geohashing, oauth-oidc, ssl-tls-mtls, sso, vm-containers]
status: draft
---

## Overview

A system that's fast but falls over under failure, or fast but not safe, isn't finished. This group covers keeping systems up when parts fail (circuit breakers, disaster recovery, service discovery), keeping them fair under load (rate limiting), measuring reliability itself (SLA/SLO/SLI), keeping access safe (OAuth/OIDC, SSO, SSL/TLS/mTLS), the compute layer under all of it (VMs and containers), and one method used for location-based systems (geohashing).

## Key Concepts

- Stopping failure from spreading — circuit breakers, disaster recovery, service discovery.
- Fairness under load — rate limiting.
- Measuring reliability — SLA, SLO, SLI.
- Security — OAuth/OIDC, SSO, SSL/TLS/mTLS.
- Splitting compute — VMs vs. containers.

## Core Knowledge

Circuit breakers stop a failing service downstream from spreading failure upstream, by failing fast instead of piling up retries. Service discovery lets services that scale up and down find each other without fixed addresses. Disaster recovery plans for the worst case — losing a whole region or data center. Rate limiting protects a system from being overwhelmed, whether by abuse or a real traffic spike. SLAs, SLOs, and SLIs turn "reliable" into something you can measure and put in a contract. On the security side, OAuth/OIDC and SSO handle who a user is and what they can access, while SSL/TLS/mTLS keep the connection itself safe. VMs and containers are the two main ways to isolate and package workloads, trading full OS isolation against weight and startup time.

## Interview Questions

**Q: What's the difference between SLA, SLO, and SLI?**
A: SLI is the measured number (like latency), SLO is the internal target for that number, and SLA is the outside promise made to customers, usually with a penalty for missing it.

**Q: How does a circuit breaker differ from a retry?**
A: A retry keeps trying the same failing call; a circuit breaker notices repeat failures and stops calling entirely for a while, protecting both the caller and the callee.

**Q: What does mTLS add over TLS?**
A: TLS proves the server's identity to the client; mTLS also proves the client's identity to the server, so both sides prove who they are — common for service-to-service checks.

## Scenario

A payment service starts timing out. A circuit breaker on the calling service trips after enough failures, so requests upstream fail fast instead of piling up and using up all the connections — buying time for the payment service to recover without taking the whole platform down with it.

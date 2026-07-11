---
id: esb
title: "Enterprise Service Bus (ESB)"
created: 2026-07-11
modified: 2026-07-11
tags: [integration, soa, messaging, legacy-systems]
parent: architecture-patterns
children: []
status: draft
---

## Overview

An Enterprise Service Bus is a central integration platform that routes, transforms, and orchestrates messages between heterogeneous systems — the core concept of Service-Oriented Architecture (SOA) in the 2000s. It replaces point-to-point "spaghetti integration" between N systems, which requires N(N-1)/2 connections, with a hub that every system connects to just once.

## Key Concepts

- Core features: content-based routing, format/protocol transformation (XML↔JSON, SOAP↔REST↔FTP↔JMS), orchestration and choreography, centralized security/monitoring, adapters.
- Contains a message broker but is much more — a full integration platform, not just async transport.
- Philosophy: "smart pipes, dumb endpoints" — logic lives in the bus, not the services.
- Microservices reversed this to "smart endpoints, dumb pipes."
- Modern replacements: API Gateway, Service Mesh, Kafka, iPaaS, workflow engines.

## Core Knowledge

The problem ESB solves is combinatorial: integrating N systems point-to-point needs N(N-1)/2 connections — 20 systems means 190, unmanageable. A central ESB reduces this to N connections, handling content-based routing, transformation, and protocol translation between systems that speak different technologies (a mainframe, a CRM, a mobile app).

An ESB is heavier than a plain message broker (Kafka, RabbitMQ): a broker is primarily async messaging with simple routing, while an ESB adds orchestration, protocol translation, and governance — it contains a broker but goes well beyond it. This centralization is also its downside: an ESB down breaks everything integrated through it, and proprietary vendors create lock-in. Popular products include MuleSoft, WSO2, IBM Integration Bus, and the open-source Apache Camel.

**Note:** the ESB philosophy of "smart pipes, dumb endpoints" is the opposite of the microservices philosophy of "smart endpoints, dumb pipes" — part of why microservices emerged as a reaction to heavyweight SOA/ESB stacks.

By the 2020s, pure ESB is largely legacy: greenfield systems favor an API Gateway, Service Mesh, Kafka, and iPaaS instead. ESB remains relevant in legacy-heavy enterprises — banking, insurance, telecom — where migration away from it happens gradually (strangler fig pattern).

## Interview Questions

**Q: Why does spaghetti integration become unmanageable?**
A: Point-to-point connections between N systems grow as N(N-1)/2, so 20 systems already need 190 — an ESB reduces this to N connections through a central hub.

**Q: How does an ESB differ from a message broker like Kafka?**
A: A broker mainly moves messages asynchronously with simple routing; an ESB also transforms formats, translates protocols, and orchestrates workflows.

**Q: Why did microservices emerge partly in reaction to ESB?**
A: ESB centralizes logic in the bus ("smart pipes, dumb endpoints"), creating lock-in and a bottleneck; microservices decentralize logic into services with thin transport.

## Scenario

A bank with a 1990s mainframe core, Salesforce CRM, an ATM network, and a mobile app integrates them all through an ESB instead of building dozens of point-to-point connections — though it's now gradually strangling the ESB out in favor of an API Gateway and Kafka for new services.

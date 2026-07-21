---
id: esb
title: "Enterprise Service Bus (ESB)"
created: 2026-07-11
modified: 2026-07-22
tags: [integration, soa, messaging, legacy-systems]
parent: architecture-patterns
children: []
status: draft
---

## Overview

An Enterprise Service Bus (ESB) is a central platform that routes, changes, and coordinates messages between different systems. It was the core idea behind Service-Oriented Architecture (SOA) in the 2000s. It replaces "spaghetti integration" — direct point-to-point connections between N systems, which needs N(N-1)/2 connections — with one hub that every system connects to just once.

## Key Concepts

- Core features: routing based on message content, changing format/protocol (XML↔JSON, SOAP↔REST↔FTP↔JMS), orchestration and choreography, security/monitoring in one place, adapters.
- Contains a message broker, but is much more than that — a full integration platform, not just a way to move messages.
- Philosophy: "smart pipes, dumb endpoints" — logic lives in the bus, not the services.
- Microservices reversed this to "smart endpoints, dumb pipes."
- Modern replacements: API Gateway, Service Mesh, Kafka, iPaaS, workflow engines.

## Core Knowledge

The problem ESB solves grows fast: connecting N systems directly to each other needs N(N-1)/2 connections — 20 systems means 190, too many to manage. A central ESB cuts this down to N connections, and handles routing by content, format changes, and protocol translation between systems built on different technology (a mainframe, a CRM, a mobile app).

An ESB is heavier than a plain message broker (Kafka, RabbitMQ). A broker mainly does async messaging with simple routing, while an ESB adds orchestration, protocol translation, and governance — it contains a broker, but goes well beyond it. This central setup is also its weak point: if the ESB goes down, everything connected through it breaks, and vendor-specific products can lock you in. Popular products include MuleSoft, WSO2, IBM Integration Bus, and the open-source Apache Camel.

**Note:** the ESB idea of "smart pipes, dumb endpoints" is the opposite of the microservices idea of "smart endpoints, dumb pipes" — this is part of why microservices grew up as a reaction to heavy SOA/ESB setups.

By the 2020s, plain ESB is mostly a legacy choice: new systems prefer an API Gateway, Service Mesh, Kafka, or iPaaS instead. ESB is still common in older, legacy-heavy companies — banking, insurance, telecom — where moving away from it happens slowly, step by step (the strangler fig pattern).

## Interview Questions

**Q: Why does spaghetti integration become unmanageable?**
A: Direct connections between N systems grow as N(N-1)/2, so 20 systems already need 190 connections — an ESB cuts this down to N connections through one central hub.

**Q: How does an ESB differ from a message broker like Kafka?**
A: A broker mainly moves messages asynchronously with simple routing; an ESB also changes formats, translates protocols, and coordinates whole workflows.

**Q: Why did microservices emerge partly in reaction to ESB?**
A: ESB puts logic in the central bus ("smart pipes, dumb endpoints"), which creates lock-in and a bottleneck. Microservices spread logic across services instead, keeping the transport between them thin.

## Scenario

A bank with a 1990s mainframe core, a Salesforce CRM, an ATM network, and a mobile app connects them all through an ESB, instead of building dozens of direct connections. It is now slowly moving away from the ESB, step by step, in favor of an API Gateway and Kafka for new services.

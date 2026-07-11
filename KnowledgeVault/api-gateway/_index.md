---
id: api-gateway
title: "API Gateway"
created: 2026-07-11
modified: 2026-07-11
tags: [microservices, api-management, routing, reverse-proxy]
parent: architecture-patterns
children: []
status: draft
---

## Overview

An API Gateway is a reverse proxy placed in front of a microservices backend so clients talk to one endpoint instead of dozens of services directly. It centralizes cross-cutting concerns — authentication, rate limiting, routing, aggregation — that would otherwise be duplicated in every service.

## Key Concepts

- Reverse proxy that routes requests to the correct backend service by URL path or header.
- Centralizes auth, rate limiting, caching, request/response transformation, aggregation, logging, SSL termination, circuit breaking, and versioning.
- BFF (Backend For Frontend) — a separate tailored gateway per client type.
- Distinct from a load balancer (traffic distribution only, no API awareness) and a plain reverse proxy (single backend, no API management).
- Distinct from a service mesh — gateway handles north-south (client-to-service) traffic; mesh handles east-west (service-to-service) traffic.

## Core Knowledge

Without a gateway, a client must know about and connect to every backend service directly — duplicating auth and error handling everywhere and multiplying network calls. An API Gateway becomes the single front door: it routes by path or header (e.g. `/api/users/*` → User Service), terminates SSL so backends can speak plain HTTP, throttles requests per user/IP, caches frequent responses, transforms payloads for older clients, aggregates responses from multiple services into one, and centralizes logging and circuit breaking to stop cascading failures.

The BFF pattern extends this: instead of one generic gateway, each client type — mobile, web, smart TV — gets its own gateway tailored to the data shape and volume that client needs. Popular products include Kong, AWS API Gateway, Azure API Management, Apigee, and Tyk; Netflix's Zuul was an early pioneer.

**Caution:** the biggest risk is letting the gateway become a single point of failure or accumulate business logic that belongs in the services — best practice keeps it lightweight and runs it as an HA cluster.

## Interview Questions

**Q: How does an API Gateway differ from a load balancer?**
A: A load balancer distributes traffic with no API awareness; a gateway is API-aware and adds routing, auth, rate limiting, and response aggregation.

**Q: What is the BFF pattern?**
A: Backend For Frontend — a separate gateway per client type, each tailoring the response instead of serving one generic payload to everyone.

**Q: What's the biggest operational risk with an API Gateway?**
A: Becoming a single point of failure or accumulating business logic that belongs in the services — mitigated with an HA cluster and a lightweight gateway.

## Scenario

A company with 50 microservices puts Kong in front of them: a Mobile BFF returns compact JSON, a Web BFF returns fuller payloads, and both share auth, rate limiting, and SSL termination at the gateway layer.

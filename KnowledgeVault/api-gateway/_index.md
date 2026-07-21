---
id: api-gateway
title: "API Gateway"
created: 2026-07-11
modified: 2026-07-22
tags: [microservices, api-management, routing, reverse-proxy]
parent: architecture-patterns
children: []
status: draft
---

## Overview

An API Gateway is a reverse proxy placed in front of a microservices backend, so clients talk to one endpoint instead of dozens of services directly. It gathers cross-cutting jobs — login checks, rate limits, routing, combining results — that would otherwise be repeated in every service.

## Key Concepts

- Reverse proxy that sends requests to the right backend service by URL path or header
- Gathers login checks, rate limiting, caching, request/response changes, combining results, logging, SSL handling, circuit breaking, and versioning in one place
- BFF (Backend For Frontend) — a separate gateway built for each client type
- Different from a load balancer (spreads traffic only, doesn't know about the API) and a plain reverse proxy (one backend, no API management)
- Different from a service mesh — the gateway handles client-to-service traffic; the mesh handles service-to-service traffic

## Core Knowledge

Without a gateway, a client has to know about and connect to every backend service directly — repeating login checks and error handling everywhere, and making far more network calls. An API Gateway becomes the single front door: it sends requests by path or header (like `/api/users/*` → User Service), handles SSL so backends can use plain HTTP, limits requests per user/IP, caches common answers, changes payloads for older clients, combines answers from several services into one, and gathers logging and circuit breaking to stop failures from spreading.

The BFF pattern builds on this: instead of one general gateway, each client type — mobile, web, smart TV — gets its own gateway built for the data shape and amount that client needs. Popular tools include Kong, AWS API Gateway, Azure API Management, Apigee, and Tyk; Netflix's Zuul was an early example.

**Caution:** the biggest risk is letting the gateway become a single point of failure, or pile up business logic that belongs in the services — best practice keeps it light and runs it as a high-availability cluster.

## Interview Questions

**Q: How does an API Gateway differ from a load balancer?**
A: A load balancer spreads traffic with no knowledge of the API; a gateway knows the API and adds routing, login checks, rate limiting, and combining of responses.

**Q: What is the BFF pattern?**
A: Backend For Frontend — a separate gateway for each client type, each one shaping the response instead of giving everyone the same general payload.

**Q: What's the biggest operational risk with an API Gateway?**
A: Becoming a single point of failure, or piling up business logic that belongs in the services — fixed with a high-availability cluster and a light gateway.

## Scenario

A company with 50 microservices puts Kong in front of them: a Mobile BFF returns small JSON, a Web BFF returns fuller payloads, and both share login checks, rate limiting, and SSL handling at the gateway layer.

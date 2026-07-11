---
id: http
title: "HTTP"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, application-layer, web]
parent: networking
children: []
status: draft
---

## Overview

HTTP is the Application-layer protocol that powers the web: a request-response exchange between a client and a server, built on top of TCP. Every page load, API call, and REST request ultimately speaks HTTP, making it the most-used protocol in system design.

## Key Concepts

- Request-response model — client sends a request, server returns a response
- Methods — GET, POST, PUT, PATCH, DELETE, and others, each with a defined intent
- Status codes — 2xx success, 3xx redirect, 4xx client error, 5xx server error
- Headers — metadata carried alongside the request/response body (content type, auth, caching)
- Stateless — each request is independent; the server holds no memory of prior requests by itself
- Versions — HTTP/1.1 (persistent connections), HTTP/2 (multiplexing over one connection), HTTP/3 (runs over QUIC/UDP instead of TCP)

## Core Knowledge

An HTTP request has a method, a URL, headers, and an optional body; the response has a status code, headers, and a body. Because HTTP is stateless, any "session" behavior (login state, shopping carts) is layered on top using cookies, tokens, or server-side session stores — HTTP itself remembers nothing between requests.

HTTP/1.1 introduced persistent connections (reusing one TCP connection for multiple requests) but still processes requests head-of-line — one at a time per connection unless multiple connections are opened. HTTP/2 fixed this with multiplexing: many requests and responses interleave over a single TCP connection, cutting latency from connection setup and head-of-line blocking at the HTTP layer. HTTP/3 goes further by dropping TCP entirely in favor of QUIC over UDP, removing TCP-level head-of-line blocking and speeding up connection establishment.

## Interview Questions

**Q: Why is HTTP called stateless?**
A: Each request is processed independently with no memory of previous requests; any continuity (login, cart) is built on top via cookies or tokens, not by HTTP itself.

**Q: What's the practical benefit of HTTP/2's multiplexing?**
A: Multiple requests/responses can share a single TCP connection concurrently, avoiding the overhead of opening many connections and reducing head-of-line blocking at the HTTP layer.

**Q: What does a 404 status code mean, and what class of error is it?**
A: Not Found — a 4xx client error, meaning the client requested a resource that doesn't exist on the server.

## Scenario

A REST API serving a mobile app needs to minimize round-trip latency on a slow connection. Moving from HTTP/1.1 to HTTP/2 lets the client fire off multiple API calls over one connection simultaneously instead of queuing them, cutting perceived load time without changing a single endpoint.

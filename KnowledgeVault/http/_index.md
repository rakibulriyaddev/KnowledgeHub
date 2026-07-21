---
id: http
title: "HTTP"
created: 2026-07-11
modified: 2026-07-22
tags: [protocols, application-layer, web]
parent: networking
children: []
status: draft
---

## Overview

HTTP is the protocol that powers the web: a request-response exchange between a client and a server, built on top of TCP. Every page load, API call, and REST request speaks HTTP in the end, making it the most used protocol in system design.

## Key Concepts

- Request-response model — client sends a request, server sends back a response
- Methods — GET, POST, PUT, PATCH, DELETE, and others, each with a clear purpose
- Status codes — 2xx success, 3xx redirect, 4xx client error, 5xx server error
- Headers — extra info sent with the request/response (content type, login info, caching)
- Stateless — each request stands alone; the server keeps no memory of past requests by itself
- Versions — HTTP/1.1 (connections stay open), HTTP/2 (many requests share one connection), HTTP/3 (runs over QUIC/UDP instead of TCP)

## Core Knowledge

An HTTP request has a method, a URL, headers, and maybe a body; the response has a status code, headers, and a body. Because HTTP keeps no memory, any "session" feel (staying logged in, a shopping cart) is added on top using cookies, tokens, or server-side session storage — HTTP itself remembers nothing between requests.

HTTP/1.1 let one connection be reused for many requests, but it still handles them one at a time per connection unless more connections are opened. HTTP/2 fixed this by letting many requests and responses share one connection at the same time, cutting the delay caused by opening connections and waiting in line. HTTP/3 goes further by dropping TCP for QUIC over UDP, removing TCP-level waiting and making connections start faster.

## Interview Questions

**Q: Why is HTTP called stateless?**
A: Each request is handled on its own with no memory of past requests; any continued feel (staying logged in, a cart) is built on top with cookies or tokens, not by HTTP itself.

**Q: What's the real benefit of HTTP/2's shared connections?**
A: Many requests/responses can share one connection at the same time, avoiding the cost of opening many connections and cutting delays from waiting in line.

**Q: What does a 404 status code mean, and what type of error is it?**
A: Not Found — a 4xx client error, meaning the client asked for something that doesn't exist on the server.

## Scenario

A REST API for a mobile app must cut round-trip delay on a slow connection. Moving from HTTP/1.1 to HTTP/2 lets the client send many API calls over one connection at once instead of waiting in line, cutting load time without changing a single endpoint.

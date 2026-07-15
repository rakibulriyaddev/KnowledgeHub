---
id: nginx
title: "Nginx"
created: 2026-07-15
modified: 2026-07-15
tags: [infrastructure, web-server, reverse-proxy]
parent: proxy
children: []
status: draft
---

## Overview

Nginx is an event-driven web server and reverse proxy built to solve the C10K problem — serving tens of thousands of concurrent connections without one thread per connection. It has become the default choice for reverse proxying, load balancing, and static file serving in front of application servers.

## Key Concepts

- Master/worker process model — one master manages config and privileged ops, workers handle connections
- Event-driven, non-blocking I/O — a single worker handles thousands of connections via an event loop
- `server` and `location` blocks — the core config units for routing requests
- Reverse proxy directives: `proxy_pass`, `upstream` blocks for backend pools
- Also functions as a static file server, load balancer, and SSL/TLS termination point

## Core Knowledge

Nginx's worker-per-CPU-core model with async I/O lets it handle far more concurrent connections per unit of memory than thread-per-connection servers like classic Apache (prefork MPM) — this is why it fronts most high-traffic sites.
Config is declarative: nested `server` blocks match by host/port, `location` blocks match by URL path, and directives like `proxy_pass http://backend;` forward matched requests upstream.
An `upstream` block defines a pool of backend servers with a load-balancing method (round robin by default, or `least_conn`, `ip_hash`) — this is how Nginx doubles as both reverse proxy and load balancer.
Static assets (JS, CSS, images) are served directly by Nginx without touching the app server, since Nginx's static-file path is dramatically faster than most application runtimes.
SSL/TLS termination at Nginx lets backend services run plain HTTP internally, simplifying certificate management to one place.
Config changes require `nginx -s reload` (graceful, zero-downtime worker respawn) rather than a hard restart — a common production gotcha is forgetting `nginx -t` to test config syntax first.
A single misconfigured `location` regex or missing `proxy_set_header Host` can silently break header forwarding to backends — a frequent source of subtle bugs.

## Interview Questions

**Q: Why can Nginx handle far more concurrent connections than a thread-per-connection server?**
A: Its event-driven, non-blocking worker model handles many connections per worker via an event loop, avoiding the memory and context-switch overhead of one OS thread per connection.

**Q: What's the difference between a `server` block and a `location` block?**
A: `server` matches on host/port (defines a virtual host); `location` matches on URL path within that server to route to different backends or file paths.

**Q: How does Nginx load balance across multiple backend instances?**
A: Via an `upstream` block listing backend addresses with a balancing method (round robin, least connections, IP hash) — `proxy_pass` then points at the upstream name instead of a single server.

**Q: How do you reload Nginx config without dropping connections?**
A: `nginx -s reload` — the master re-reads config and spawns new workers with it while old workers finish in-flight requests before exiting.

## Scenario

A team runs a Node.js API that also needs to serve a React app's static build and handle SSL. Placing Nginx in front lets it terminate TLS, serve the static build directly from disk, and reverse-proxy only API routes to Node — cutting load on the app server and centralizing SSL cert management in one place.

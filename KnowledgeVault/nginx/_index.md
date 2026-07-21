---
id: nginx
title: "Nginx"
created: 2026-07-15
modified: 2026-07-22
tags: [infrastructure, web-server, reverse-proxy]
parent: proxy
children: []
status: draft
---

## Overview

Nginx is an event-driven web server and reverse proxy built to solve the C10K problem — serving tens of thousands of connections at once, without needing one thread per connection. It has become the default choice for reverse proxying, load balancing, and serving static files in front of application servers.

## Key Concepts

- Master/worker process model — one master handles config and privileged tasks, workers handle connections
- Event-driven, non-blocking I/O — a single worker handles thousands of connections via an event loop
- `server` and `location` blocks — the core config units for routing requests
- Reverse proxy directives: `proxy_pass`, `upstream` blocks for backend pools
- Also functions as a static file server, load balancer, and SSL/TLS termination point

## Core Knowledge

Nginx's one-worker-per-CPU-core model, with async I/O, lets it handle far more connections at once per unit of memory than thread-per-connection servers like classic Apache (prefork MPM). This is why it sits in front of most high-traffic sites.
Config is declarative: nested `server` blocks match by host and port, `location` blocks match by URL path, and directives like `proxy_pass http://backend;` forward matching requests upstream.
An `upstream` block defines a pool of backend servers with a load-balancing method (round robin by default, or `least_conn`, `ip_hash`) — this is how Nginx works as both a reverse proxy and a load balancer.
Static files (JS, CSS, images) are served directly by Nginx without touching the app server, since Nginx's static-file path is far faster than most app runtimes.
SSL/TLS termination at Nginx lets backend services run plain HTTP internally, which keeps certificate management in one place.
Config changes need `nginx -s reload` (a graceful worker respawn with no downtime), not a hard restart. A common production mistake is forgetting to run `nginx -t` to check the config syntax first.
A single wrong `location` regex, or a missing `proxy_set_header Host`, can quietly break header forwarding to backends — a frequent source of subtle bugs.

## Interview Questions

**Q: Why can Nginx handle far more concurrent connections than a thread-per-connection server?**
A: Its event-driven, non-blocking worker model handles many connections per worker through an event loop, avoiding the memory cost and context-switch overhead of one OS thread per connection.

**Q: What's the difference between a `server` block and a `location` block?**
A: `server` matches on host/port (defines a virtual host); `location` matches on URL path within that server to route to different backends or file paths.

**Q: How does Nginx load balance across multiple backend instances?**
A: Through an `upstream` block that lists backend addresses with a balancing method (round robin, least connections, IP hash). `proxy_pass` then points at the upstream name instead of a single server.

**Q: How do you reload Nginx config without dropping connections?**
A: `nginx -s reload` — the master re-reads the config and starts new workers with it, while the old workers finish their current requests before shutting down.

## Scenario

A team runs a Node.js API that also needs to serve a React app's static build and handle SSL. Putting Nginx in front lets it end TLS, serve the static build straight from disk, and reverse-proxy only the API routes to Node — cutting load on the app server and keeping SSL certificate management in one place.

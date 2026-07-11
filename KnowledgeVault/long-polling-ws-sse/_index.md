---
id: long-polling-ws-sse
title: "Long Polling, WebSockets & SSE"
created: 2026-07-11
modified: 2026-07-11
tags: [architecture, real-time, networking, web-protocols]
parent: architecture-patterns
children: []
status: draft
---

## Overview

HTTP's request-response model doesn't let a server initiate contact with a client, yet chat, live scores, and notifications all need server-to-client push. Long polling, WebSockets, and Server-Sent Events (SSE) are the three practical techniques that fill this gap, each with a different trade-off between simplicity, direction, and overhead.

## Key Concepts

- **Short polling** — client asks repeatedly on a timer; simple but wasteful, not real-time.
- **Long polling** — client requests, server holds the connection until data exists, then responds and the client re-requests.
- **WebSockets** — full-duplex, persistent, bidirectional connection after an HTTP-upgrade handshake.
- **SSE (Server-Sent Events)** — one-way HTTP stream from server to client, with built-in reconnection.
- **Scaling** — sticky sessions plus a pub-sub backplane (Redis/Kafka) to broadcast across servers.

## Core Knowledge

Long polling gives the *illusion* of server push while staying pure HTTP: the client asks, the server holds the connection until it has something to say, responds, and the client immediately asks again. It's firewall-friendly and universally supported, but each round trip carries full HTTP header overhead, holding connections consumes server resources, and it's effectively one-directional.

WebSockets solve this properly: an HTTP handshake (`Upgrade` header, `101 Switching Protocols`) escalates to a persistent, frame-based, full-duplex connection where either side can send at any time with low overhead. The cost is operational — connections are stateful and live on a specific server, so load balancers need sticky sessions, reconnect logic must be handled explicitly, and some firewalls block the non-HTTP protocol.

SSE sits between the two: a plain HTTP stream (`text/event-stream`) pushing one-way, server-to-client, where the browser's `EventSource` API auto-reconnects and can replay missed events via `Last-Event-ID`. It's simpler to operate than WebSockets and proxy-friendly, but text-oriented and, on HTTP/1.1, limited to 6 connections per origin (removed under HTTP/2).

**Note:** the choice comes down to direction and complexity budget — long polling is a legacy fallback, WebSockets suit true bidirectional real-time (chat, games, trading), and SSE is simpler whenever only server-to-client push is needed (feeds, scores, notifications). At scale, persistent-connection approaches need sticky sessions plus a pub-sub backplane so a message published on one server reaches clients on any other.

## Interview Questions

**Q: When would you pick SSE over WebSockets?**
A: When communication is one-way (server to client) — SSE is simpler, plain HTTP, and gives auto-reconnect and event replay for free.

**Q: Why does WebSocket scaling require sticky sessions?**
A: The connection is stateful and lives on one server; a load balancer must route a client back to that server, with a pub-sub backplane (Redis/Kafka) broadcasting across the fleet.

**Q: Is "WebSocket = HTTP" a correct statement?**
A: No — HTTP is used only for the initial upgrade handshake; once switched, the connection uses a separate frame protocol.

## Scenario

A live sports-score app pushes updates via SSE (simple, one-way, auto-reconnecting), while its live-chat feature between fans uses WebSockets (bidirectional, low-latency) — the same product picks different transports for different data flows.

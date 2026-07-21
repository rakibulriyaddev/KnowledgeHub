---
id: long-polling-ws-sse
title: "Long Polling, WebSockets & SSE"
created: 2026-07-11
modified: 2026-07-22
tags: [architecture, real-time, networking, web-protocols]
parent: architecture-patterns
children: []
status: draft
---

## Overview

HTTP's request-response model does not let a server start contact with a client on its own. But chat, live scores, and notifications all need the server to push data to the client. Long polling, WebSockets, and Server-Sent Events (SSE) are the three real ways to fill this gap. Each has a different trade-off between simplicity, direction, and overhead.

## Key Concepts

- **Short polling** — the client asks again and again on a timer. Simple, but wasteful, and not real-time.
- **Long polling** — the client asks, the server holds the connection open until it has data, then answers, and the client asks again right away.
- **WebSockets** — a full-duplex, long-lived, two-way connection, set up after an HTTP-upgrade handshake.
- **SSE (Server-Sent Events)** — a one-way HTTP stream from server to client, with reconnect built in.
- **Scaling** — needs sticky sessions plus a pub-sub backplane (Redis/Kafka) to send messages across many servers.

## Core Knowledge

Long polling gives the *feeling* of server push while staying pure HTTP: the client asks, the server holds the connection until it has something to say, answers, and the client asks again right away. It works through firewalls and is supported everywhere. But each round trip carries the full HTTP header overhead, holding connections open uses up server resources, and it only really works one way.

WebSockets solve this properly. An HTTP handshake (`Upgrade` header, `101 Switching Protocols`) moves up to a long-lived, frame-based, two-way connection where either side can send at any time, with low overhead. The cost shows up in running it: connections hold state and live on one specific server, so load balancers need sticky sessions, reconnect logic must be written by hand, and some firewalls block the non-HTTP protocol.

SSE sits between the two. It is a plain HTTP stream (`text/event-stream`) pushing data one way, server to client. The browser's `EventSource` API reconnects on its own and can replay missed events using `Last-Event-ID`. It is simpler to run than WebSockets and works well with proxies, but it only sends text and, on HTTP/1.1, is limited to 6 connections per origin (this limit goes away under HTTP/2).

**Note:** the choice comes down to direction and how much complexity you can take on. Long polling is an old fallback. WebSockets fit true two-way, real-time needs (chat, games, trading). SSE is simpler whenever only server-to-client push is needed (feeds, scores, notifications). At scale, connection-based methods need sticky sessions plus a pub-sub backplane, so a message sent from one server reaches clients on any other server.

## Interview Questions

**Q: When would you pick SSE over WebSockets?**
A: When communication only goes one way (server to client) — SSE is simpler, plain HTTP, and gives auto-reconnect and event replay for free.

**Q: Why does WebSocket scaling require sticky sessions?**
A: The connection holds state and lives on one server. A load balancer must send a client back to that same server, while a pub-sub backplane (Redis/Kafka) sends messages across all the servers.

**Q: Is "WebSocket = HTTP" a correct statement?**
A: No — HTTP is only used for the first upgrade handshake. Once the switch happens, the connection uses its own separate frame protocol.

## Scenario

A live sports-score app sends updates using SSE (simple, one-way, auto-reconnecting), while its live-chat feature between fans uses WebSockets (two-way, low-latency). The same product picks different transports for different kinds of data.

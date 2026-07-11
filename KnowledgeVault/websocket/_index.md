---
id: websocket
title: "WebSocket"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, application-layer, real-time]
parent: networking
children: []
status: draft
---

## Overview

WebSocket is a protocol providing a persistent, full-duplex connection between client and server over a single TCP connection — unlike HTTP's request-response cycle, either side can push messages at any time. It's the protocol underlying most real-time features: chat, live notifications, collaborative editing.

## Key Concepts

- Full-duplex — client and server can both send messages independently, at any time, over the same connection
- Starts as an HTTP request (`Upgrade: websocket` header) and upgrades to the WebSocket protocol — the handshake reuses port 80/443
- Persistent connection — stays open until either side closes it, avoiding the overhead of repeated HTTP requests
- Low overhead per message compared to repeated HTTP polling — no headers re-sent on every message
- Not the only way to get server push — see `long-polling-ws-sse` for how it compares to long polling and SSE

## Core Knowledge

A WebSocket connection begins life as a normal HTTP request carrying an `Upgrade: websocket` header; if the server agrees, the same TCP connection is repurposed for the WebSocket protocol instead of closing after one response. From then on, both sides can send frames independently — the server doesn't need to wait for a client request to push data, which is the core difference from HTTP.

Because the connection stays open, WebSocket avoids the repeated handshake and header overhead of polling-based alternatives, making it efficient for high-frequency, bidirectional traffic like a multiplayer game's state updates or a collaborative document's edits. The tradeoff is operational: an open connection per client consumes server resources for the connection's lifetime, and infrastructure (load balancers, proxies) needs to explicitly support the upgrade and long-lived connections rather than treating everything as short HTTP requests.

## Interview Questions

**Q: How does a WebSocket connection start?**
A: As a normal HTTP request with an `Upgrade: websocket` header; if the server accepts, the same TCP connection switches protocols instead of closing.

**Q: What's the core difference between WebSocket and plain HTTP?**
A: HTTP is request-response — the server can only reply to a client request. WebSocket is full-duplex and persistent — either side can send a message at any time over the same open connection.

**Q: Why is WebSocket preferred over polling for a chat app?**
A: Polling repeats full HTTP requests/responses on an interval, wasting overhead and adding latency; WebSocket keeps one connection open and pushes new messages the instant they exist.

## Scenario

A collaborative document editor needs every keystroke from one user to appear on another user's screen within milliseconds. Polling the server every second would feel laggy and waste bandwidth on empty checks; a WebSocket connection lets the server push each change the moment it happens.

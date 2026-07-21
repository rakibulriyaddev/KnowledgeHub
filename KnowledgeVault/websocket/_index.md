---
id: websocket
title: "WebSocket"
created: 2026-07-11
modified: 2026-07-22
tags: [protocols, application-layer, real-time]
parent: networking
children: []
status: draft
---

## Overview

WebSocket is a protocol that gives a lasting, two-way connection between client and server over a single TCP connection — unlike HTTP's ask-and-answer cycle, either side can send messages at any time. It's the protocol behind most real-time features: chat, live notifications, shared editing.

## Key Concepts

- Full-duplex — client and server can both send messages on their own, at any time, over the same connection
- Starts as an HTTP request (`Upgrade: websocket` header) and switches to the WebSocket protocol — the handshake reuses port 80/443
- Persistent connection — stays open until either side closes it, avoiding the cost of repeated HTTP requests
- Low cost per message compared to repeated HTTP polling — no headers sent again for every message
- Not the only way to get server push — see `long-polling-ws-sse` for how it compares to long polling and SSE

## Core Knowledge

A WebSocket connection starts life as a normal HTTP request carrying an `Upgrade: websocket` header; if the server agrees, the same TCP connection is reused for the WebSocket protocol instead of closing after one response. From then on, both sides can send data independently — the server doesn't need to wait for a client request to push data, which is the main difference from HTTP.

Because the connection stays open, WebSocket avoids the repeated handshake and header cost of polling-based options, making it efficient for fast, two-way traffic like a multiplayer game's state updates or a shared document's edits. The tradeoff is operational: an open connection per client uses server resources for as long as it's open, and infrastructure (load balancers, proxies) needs to clearly support the upgrade and long-lived connections instead of treating everything as short HTTP requests.

## Interview Questions

**Q: How does a WebSocket connection start?**
A: As a normal HTTP request with an `Upgrade: websocket` header; if the server accepts, the same TCP connection switches protocols instead of closing.

**Q: What's the main difference between WebSocket and plain HTTP?**
A: HTTP is ask-and-answer — the server can only reply to a client request. WebSocket is two-way and stays open — either side can send a message at any time over the same open connection.

**Q: Why is WebSocket preferred over polling for a chat app?**
A: Polling repeats full HTTP requests/responses on a timer, wasting effort and adding delay; WebSocket keeps one connection open and pushes new messages the instant they exist.

## Scenario

A shared document editor needs every keystroke from one user to show up on another user's screen within milliseconds. Checking the server every second would feel slow and waste bandwidth on empty checks; a WebSocket connection lets the server push each change the moment it happens.

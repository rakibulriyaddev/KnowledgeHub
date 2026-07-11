---
title: "Long Polling, WebSockets & SSE — Deep Dive"
---

Someone sends you a message on Facebook chat - the notification arrives instantly. A stock price updates live right before your eyes. A cricket score auto-refreshes. How does data get *pushed* from server to client? The traditional HTTP request-response model doesn't do this on its own. So there are a few real-time techniques.

## Problem: The limitation of HTTP

In the HTTP request-response model, the client asks and the server answers. The server generally cannot initiate contact with the client. But chat, live scores, notifications - these need to be real-time.

## Short Polling (Baseline)

The client asks the server every few seconds: "Is there any new data?"

```
Client → Server: any new data?
Server → Client: no
[wait 5 seconds]
Client → Server: any new data?
Server → Client: yes! here's data
```

- Simple but wasteful - lots of empty requests.
- Latency: the polling interval.
- Not "real-time".

## Long Polling

The client makes a request; if the server has no data, it holds the connection open and waits. When data arrives, it responds. The client immediately makes a new request.

```
Client → Server: any new data?
Server: ...waits (holds if no data)...
Server → Client: data arrived!
Client → Server: any new data? (immediately)
Server: ...waits...
```

### Advantages

- Gives the illusion of server-initiated push.
- HTTP-native - no special protocol needed.
- Firewall-friendly.
- Works in every browser, everywhere.

### Disadvantages

- HTTP overhead on every message.
- Holding connections consumes server resources.
- Not bidirectional (only server → client).
- Header-heavy.

### Use cases

- Notifications
- Comment updates
- Simple chat (legacy)

## WebSockets

A full-duplex, bidirectional, persistent connection. It handshakes over HTTP, then upgrades to the WebSocket protocol.

```
Client → Server: HTTP Upgrade: websocket
Server → Client: 101 Switching Protocols
[Persistent connection established]
Client ←→ Server: send messages anytime
[Connection closes when done]
```

### Advantages

- True real-time, bidirectional.
- Low overhead - a frame-based protocol.
- Persistent connection.
- Either side can initiate.
- Binary or text data.

### Disadvantages

- Connection scaling is complex.
- Stateful - state lives on the server.
- Needs auto-reconnect logic.
- Some firewalls block it.
- No HTTP caching.

### Use cases

- Live chat (WhatsApp Web, Slack).
- Multiplayer games.
- Collaborative editing (Google Docs).
- Live trading platforms.
- Real-time dashboards.

## Server-Sent Events (SSE)

An HTTP-based unidirectional stream from server to client. One-way push.

```
Client → Server: GET /events (Accept: text/event-stream)
Server → Client: data: msg1\n\n
Server → Client: data: msg2\n\n
[Connection persists]
Server → Client: data: msg3\n\n
```

### Advantages

- Pure HTTP - proxy and firewall friendly.
- Auto-reconnection built in.
- Last-Event-ID - replays missed events.
- The browser's EventSource API is simple.
- Server is simple - no protocol upgrade needed.

### Disadvantages

- One-way only (server → client).
- Typically text-only.
- Connection limit in some browsers (HTTP/1.1: 6 per origin).
- This limit is gone with HTTP/2.

### Use cases

- Live news feeds.
- Sports scores.
- Notification feeds.
- Stock tickers (one-way).
- Server log streams.
- Build status updates.

## Comparison

### Long Polling

- HTTP request-response cycle
- Server hold-then-respond
- Server → Client (one-way effectively)
- HTTP-friendly
- Higher overhead

### WebSockets

- Persistent TCP connection
- Full-duplex
- Both directions
- Low overhead
- Stateful

### SSE

- HTTP-based stream
- One-way (server → client)
- Auto-reconnect
- Simple
- Text-focused

## Which one, when?

### Long Polling

Legacy compatibility, simple notifications, occasional events.

### WebSockets

Bi-directional real-time - chat, games, collaborative tools.

### SSE

One-way push - news feeds, scores, notifications; simpler than WebSocket.

### WebHook

Server-to-server callbacks (different - async push from one server to another).

## Real-world examples

- **Slack/Discord:** WebSocket (chat).
- **Twitter timeline updates:** SSE / Long polling.
- **Online games (multiplayer):** WebSocket.
- **Stock trading:** WebSocket.
- **Server logs (kubectl logs):** Effectively SSE.
- **GitHub Actions live log:** SSE/WebSocket.

## Scaling Real-time

- Sticky session - same client, same server.
- Pub-Sub (Redis, Kafka) - broadcast across servers.
- Connection limit per server - the million-connection problem.
- Specialized tools: Centrifugo, SignalR, Socket.IO.
- WhatsApp/Erlang - 2 million concurrent connections per server.

## Common misconceptions

1. **"WebSocket is always best":** Depends on the use case - SSE is simpler for one-way streams.
2. **"SSE is deprecated":** No - it's standard in modern browsers.
3. **"Long polling is slow":** It's reasonable, but has more overhead.
4. **"WebSocket = HTTP":** HTTP is only used for the handshake; the data uses a different protocol.

## Best Practices

- One-way push: SSE (simpler).
- Bidirectional: WebSocket.
- Reconnection logic - connection drops are normal.
- Heartbeat/ping - to check the connection is alive.
- Authentication - at the initial handshake.
- Sticky session + pub-sub backplane for scaling.
- Monitor connection limits.

## Chapter Summary

- Evolution: Short polling → Long polling → WebSocket → SSE.
- WebSocket: bidirectional, persistent - chat, games.
- SSE: one-way HTTP stream - news, scores.
- Long polling: legacy fallback.
- Scaling: sticky session + pub-sub backplane.

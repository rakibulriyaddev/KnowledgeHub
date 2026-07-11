---
title: "Long Polling, WebSockets & SSE — Q&A"
---

**Q: What does the server do in Long Polling?**
A: Holds the connection and waits if there's no data — The server waits if there's no data - and responds once data arrives.

**Q: What is a WebSocket?**
A: A full-duplex, bidirectional, persistent connection — A TCP-based persistent connection - both sides can send.

**Q: What direction does SSE flow in?**
A: One-way: server → client — Server-Sent Events - one-way push.

**Q: How does a WebSocket connection start?**
A: HTTP Upgrade handshake → switch protocol — An HTTP/1.1 Upgrade header → 101 Switching Protocols.

**Q: What's best for a chat application?**
A: WebSocket - bidirectional real-time — Both sides can send - ideal for chat.

**Q: What's simplest for a live news feed (one-way)?**
A: SSE - HTTP-native, auto-reconnect — For one-way push, SSE is simpler and browser-native.

**Q: The WebSocket protocol is based on HTTP.**
A: False — The handshake is over HTTP; the data uses a different binary protocol.

**Q: SSE supports auto-reconnection.**
A: True — The browser's EventSource API auto-reconnects, and also supports Last-Event-ID.

**Q: What's a downside of long polling?**
A: HTTP overhead on every message, connection holding — Frequent reconnects plus header overhead.

**Q: What's the scaling challenge with WebSocket?**
A: Stateful - connection state lives on the server + sticky session — Persistent connections require load balancer awareness.

**Q: A multiplayer game needs low latency and both sides sending. Which one?**
A: WebSocket — Bidirectional plus low overhead is WebSocket's strength for games.

**Q: A live stock ticker update - one-way. Which one?**
A: SSE - simple HTTP stream — SSE is elegant for one-way push.

**Q: What's the firewall issue with WebSocket?**
A: Some corporate firewalls block the non-standard protocol — It's not standard HTTP-friendly - not every firewall allows it.

**Q: Why use a heartbeat?**
A: To check the connection is alive - detect dead connections — Long-lived connections can silently die - periodic pings catch that.

**Q: SSE can always send binary data.**
A: False — SSE is typically text - binary data needs base64 encoding, or use WebSocket instead.

**Q: Which famous platform scales to millions of concurrent connections?**
A: WhatsApp on Erlang/BEAM VM — WhatsApp on Erlang handles 2M+ connections per server.

**Q: What backplane is used for real-time scaling?**
A: Pub-Sub (Redis/Kafka) - broadcast across servers — Broadcasts messages across multiple WebSocket servers.

**Q: What's the difference between a WebHook and real-time push?**
A: WebHook is a server-to-server callback; real-time push targets a browser/client — A WebHook does a POST to an external server's URL.

**Q: Why is sticky session needed for WebSocket?**
A: Stateful connection - same client must reach the same server — Connection state lives on one server - the load balancer needs to be aware of this.

**Q: Long polling is obsolete now.**
A: False — Still used for legacy/firewall compatibility.

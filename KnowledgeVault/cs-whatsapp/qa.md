---
title: "Case Study: WhatsApp / Messenger — Q&A"
---

**Q: What protocol does WhatsApp use for client-server communication?**
A: WebSocket (persistent) — a real-time bidirectional connection.

**Q: What language is WhatsApp built in?**
A: Erlang (server) — the BEAM VM enables massive concurrency.

**Q: Which feature of Erlang is crucial for WhatsApp?**
A: Lightweight processes - millions concurrently — 2M+ connections per server.

**Q: What is WhatsApp's E2E encryption protocol?**
A: Signal Protocol (Open Whisper Systems) — the industry-standard E2E protocol.

**Q: The WhatsApp server can decrypt messages.**
A: False — E2E, only sender + recipient can. The server sees an encrypted blob.

**Q: What does "✓✓ blue" indicate?**
A: Read receipt — the recipient has read the message.

**Q: What is Forward Secrecy?**
A: Past messages stay secure - even if the current key is compromised — per-message session keys.

**Q: How is a message delivered to an offline user?**
A: Server queues it → delivers + push notification once online — asynchronous delivery.

**Q: How does push notification work?**
A: APNs (iOS), FCM (Android) — OS-level push services.

**Q: Which protocol handles voice/video calls?**
A: WebRTC (typically peer-to-peer) — real-time media streaming.

**Q: Both users are online and the message is delivered and read. What happens to the message on the server?**
A: Deleted (privacy + storage) — WhatsApp keeps minimal message storage.

**Q: A group chat has 100 members. One message → what happens?**
A: An encrypted copy for each member + fan-out — per-recipient encryption.

**Q: Where does WhatsApp media (image, video) live?**
A: Encrypted upload to CDN/S3 - link in the message — object storage + CDN delivery.

**Q: Online presence is tracked in Redis.**
A: True — fast in-memory lookup.

**Q: Why does WhatsApp need sticky sessions?**
A: WebSocket is persistent - same user, same server — connection state lives on one server.

**Q: What helps with NAT traversal in voice calls?**
A: STUN/TURN servers — needed for peers behind NAT.

**Q: What was WhatsApp's engineering team size historically?**
A: ~50 (acquired by FB) — a lean team scaled to 500M+ users.

**Q: What's the typical max group chat member count?**
A: 1024 — current WhatsApp limit.

**Q: What's the storage approach like?**
A: Server temporary; client device persistent — a server-light architecture.

**Q: 500M+ concurrent connections are achievable on a single Erlang cluster.**
A: False — 2M+ per server; 250+ servers.

---
id: cs-whatsapp
title: "Case Study: WhatsApp / Messenger"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, case-study, real-time, encryption, messaging]
parent: case-studies
children: []
status: draft
---

## Overview

WhatsApp delivers 100+ billion messages a day to 2 billion users, end-to-end encrypted, with a historically tiny engineering team. Its architecture prioritizes reliable real-time delivery and a server-light, client-heavy design over feature breadth.

## Key Concepts

- Erlang/BEAM VM — lightweight processes enable millions of concurrent connections per server with "let it crash" fault tolerance.
- Persistent WebSocket connections with sticky sessions per user.
- Signal Protocol end-to-end encryption — identity keys, pre-keys, per-session keys, and forward secrecy; the server cannot decrypt messages.
- Server-light storage — messages are held only until delivered, then deleted; chat history lives on the client device.
- Offline delivery via message queuing plus APNs/FCM push notifications.
- Group chat fan-out — each member gets a separately encrypted copy, capped at 1024 members.

## Core Knowledge

WhatsApp's choice of Erlang is central to its scale story: the BEAM VM's lightweight processes let a single server hold roughly 2 million concurrent WebSocket connections, and Erlang's supervisor-tree "let it crash" philosophy plus hot code reload let a lean team (historically ~50 engineers for 500M+ users) operate reliably without downtime for updates. Messages flow over a persistent, TLS-encrypted WebSocket to a geo-routed chat server; the server stores an encrypted message only long enough to guarantee delivery, and once both sender and recipient have synced (sent → delivered ✓✓ → read ✓✓ blue), it deletes it — chat history is a client-side responsibility, not a server one, which both limits server storage needs and reinforces privacy.

End-to-end encryption uses the Signal Protocol: long-term identity keys per user, short-term pre-keys stored on the server for asynchronous session setup, and per-conversation session keys that rotate to provide forward secrecy — even if a session key is later compromised, past messages stay unreadable. The server only ever sees ciphertext. Offline users get their messages queued and delivered via a push notification (APNs on iOS, FCM on Android) once they reconnect. Group chats fan out a message into one encrypted copy per member (capped at 1024), and media (images, video) is uploaded encrypted to CDN/object storage with only a link and decryption key traveling through the chat message itself. Voice/video calls typically negotiate a direct WebRTC peer-to-peer stream via STUN/TURN for NAT traversal, keeping media off the chat backend entirely.

## Interview Questions

**Q: Why does WhatsApp's server delete messages once delivered, instead of retaining a server-side history?**
A: It keeps the server storage footprint minimal at 100B+ messages/day scale and reinforces the end-to-end encryption model — the server is a relay, not a data store, and message history is the client's responsibility.

**Q: What is forward secrecy, and why does it matter for WhatsApp?**
A: Forward secrecy means that even if a current session key is compromised, previously sent messages encrypted under earlier rotated keys remain unreadable — it limits the blast radius of any single key compromise.

**Q: Why is Erlang particularly well suited to WhatsApp's workload?**
A: Its lightweight, massively concurrent process model lets one server hold millions of persistent connections, and its fault-isolation model ("let it crash" plus supervisor trees) keeps individual connection failures from taking down the whole service — a natural fit for telecom-style real-time messaging.

## Scenario

A user sends a message while the recipient's phone is offline. The chat server queues the encrypted message, triggers an FCM push notification to wake the recipient's device, and once the recipient's app reconnects over WebSocket, the queued message is delivered and the read-receipt chain (✓ → ✓✓ → blue ✓✓) begins — after both sides have synced, the server discards its copy.

---
id: cs-whatsapp
title: "Case Study: WhatsApp / Messenger"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, case-study, real-time, encryption, messaging]
parent: case-studies
children: []
status: draft
---

## Overview

WhatsApp sends 100+ billion messages a day to 2 billion users, fully encrypted end-to-end, with a historically tiny engineering team. Its design favors reliable real-time delivery and a light server, heavy client setup over lots of features.

## Key Concepts

- Erlang/BEAM VM — light processes let millions of open connections run per server, with a "let it crash" fault-tolerance style.
- Long-held WebSocket connections with sticky sessions per user.
- Signal Protocol end-to-end encryption — identity keys, pre-keys, per-session keys, and forward secrecy; the server can't read messages.
- Light server storage — messages are kept only until delivered, then deleted; chat history lives on the client device.
- Offline delivery through message queues plus APNs/FCM push notices.
- Group chat fan-out — each member gets a separately encrypted copy, capped at 1024 members.

## Core Knowledge

WhatsApp's pick of Erlang is central to its scale story: the BEAM VM's light processes let a single server hold about 2 million open WebSocket connections at once, and Erlang's "let it crash" style plus live code reload let a small team (historically ~50 engineers for 500M+ users) run reliably without downtime for updates. Messages travel over a steady, TLS-encrypted WebSocket to a location-routed chat server; the server keeps an encrypted message only long enough to make sure it's delivered, and once both sender and receiver have synced (sent → delivered ✓✓ → read ✓✓ blue), it deletes it — chat history is the client's job, not the server's, which both cuts server storage needs and backs up privacy.

End-to-end encryption uses the Signal Protocol: long-term identity keys per user, short-term pre-keys stored on the server for setting up sessions while offline, and per-chat session keys that rotate to give forward secrecy — even if a session key is later stolen, past messages stay unreadable. The server only ever sees scrambled text. Offline users get their messages queued and sent via a push notice (APNs on iOS, FCM on Android) once they reconnect. Group chats split a message into one encrypted copy per member (capped at 1024), and media (photos, video) is uploaded encrypted to CDN/object storage with only a link and unlock key traveling inside the chat message itself. Voice and video calls usually set up a direct WebRTC peer-to-peer stream via STUN/TURN to get past network address blocks, keeping media off the chat backend entirely.

## Interview Questions

**Q: Why does WhatsApp's server delete messages once delivered, instead of keeping a server-side history?**
A: It keeps server storage small at 100B+ messages/day scale and backs up the end-to-end encryption model — the server is a relay, not a data store, and message history is the client's job.

**Q: What is forward secrecy, and why does it matter for WhatsApp?**
A: Forward secrecy means that even if a current session key is stolen, messages sent earlier under older rotated keys stay unreadable — it limits the damage from any one key being stolen.

**Q: Why is Erlang a good fit for WhatsApp's workload?**
A: Its light, highly concurrent process model lets one server hold millions of steady connections, and its fault-isolation style ("let it crash" plus supervisor trees) stops single connection failures from taking down the whole service — a natural fit for phone-style real-time messaging.

## Scenario

A user sends a message while the receiver's phone is offline. The chat server queues the encrypted message, sends an FCM push notice to wake the receiver's device, and once the receiver's app reconnects over WebSocket, the queued message is delivered and the read-receipt chain (✓ → ✓✓ → blue ✓✓) begins — after both sides have synced, the server drops its copy.

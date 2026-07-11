---
title: "UDP — Deep Dive"
---

Imagine sending a letter and not caring whether it's confirmed — regular post will do. **UDP** is the internet's regular post: fast, but no guarantee.

## UDP - User Datagram Protocol

**UDP** is a *connectionless* and *fast* protocol. It sends data but doesn't guarantee delivery.

### Characteristics of UDP
- **Connectionless:** no handshake, sends data directly.
- **Fast:** much less overhead - fast.
- **No guarantee:** data can get lost.
- **No ordering:** data can arrive in any order.
- **Lightweight header:** only an 8-byte header.

### Where is UDP used?
- **Live streaming:** YouTube Live, Twitch - it's fine if a few frames are missed.
- **Video calls:** Zoom, WhatsApp call - speed matters most.
- **Online gaming:** reducing latency is essential.
- **DNS queries:** small, quick question-answer.
- **VoIP:** voice calls.

## Real-world examples

- **WhatsApp video call:** UDP - it's fine to lose some frames, latency matters.
- **YouTube video:** UDP for the live-streaming portion.
- **Online games:** UDP - speed matters most.

## Common misconceptions

1. **"UDP is always bad":** No, UDP is the best choice for real-time work.
2. **"UDP has no error checking at all":** It does (checksum), but when an error is detected it isn't retransmitted.

## When to use UDP in system design

- **Latency matters:** gaming, video calls.
- **Broadcast/Multicast:** UDP.
- **Many small requests at once:** UDP (DNS).

## Chapter Summary

- UDP is connectionless, fast - but with no guarantee.
- Video call, gaming, DNS, live streaming -> UDP.
- Choose UDP when latency matters more than guaranteed delivery.

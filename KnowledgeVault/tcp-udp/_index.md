---
id: tcp-udp
title: "TCP and UDP"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, networking-fundamentals, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

TCP and UDP are the internet's two Transport-layer (Layer 4) protocols, each embodying a different philosophy: TCP guarantees reliable, ordered delivery at the cost of speed, while UDP is fast and lightweight but offers no delivery guarantee. Choosing between them is a core system design decision wherever reliability and latency trade off against each other.

## Key Concepts

- TCP — connection-oriented, reliable, ordered delivery, flow control, congestion control, established via a 3-way handshake
- UDP — connectionless, fast, no delivery/order guarantee, minimal 8-byte header
- TCP use cases: HTTP/HTTPS, email (SMTP/IMAP), FTP, SSH
- UDP use cases: live streaming, video calls, online gaming, DNS queries, VoIP
- An application can use both simultaneously for different features (e.g., chat vs. calls)
- Both operate at the Transport Layer (Layer 4) of the OSI model

## Core Knowledge

TCP establishes a connection before sending any data via a 3-way handshake (SYN, SYN-ACK, ACK), and from there guarantees every packet arrives, arrives in the correct order, and gets retransmitted if lost or corrupted — flow control and congestion control coordinate sender/receiver speed and back off under network strain. This reliability costs overhead: a ~20-byte header, handshake latency, and acknowledgement round-trips, making TCP the right choice whenever correctness matters more than speed — web browsing, email, file transfer, remote access.

UDP skips all of that. It's connectionless — no handshake, data is simply sent — with only an 8-byte header and no ordering or delivery guarantee. That tradeoff is exactly what real-time applications want: live streaming and video calls tolerate a dropped frame far better than they tolerate lag from retransmission, so UDP is standard there, as it is for DNS queries (small, fast question-answer exchanges) and online gaming (where latency directly hurts the experience).

**Caution:** it's a misconception that UDP has zero error checking — it does include a checksum — the difference is that on detecting an error, UDP simply drops the packet rather than retransmitting it, preserving speed over correctness.

Real applications often mix both protocols by feature: a messaging app like WhatsApp uses TCP for chat messages (which must never be lost) and UDP for video/voice calls (where low latency matters more than occasional frame loss). The underlying rule for system design is simple — pick TCP when reliability is non-negotiable (payments, file transfers), and UDP when latency is the priority (gaming, calls, broadcast/multicast, or high-volume small requests like DNS).

## Interview Questions

**Q: Why would using TCP for an online multiplayer game be a bad idea?**
A: TCP's retransmission and acknowledgement mechanics introduce latency whenever a packet is lost, and in a real-time game that lag is far more damaging to the experience than simply dropping a stale packet, which is what UDP effectively does.

**Q: Does UDP have any error detection at all?**
A: Yes — it includes a checksum — but unlike TCP, UDP doesn't retransmit a corrupted or lost packet; it just discards it, trading correctness for speed.

**Q: Why does DNS typically use UDP instead of TCP?**
A: DNS queries are small, simple question-answer exchanges where speed matters more than guaranteed delivery; the client can simply retry a lost query, which is cheaper than the overhead of a TCP handshake for such tiny exchanges. TCP is used instead only for larger responses, like zone transfers.

## Scenario

A messaging app needs a chat message to always arrive, but its video call feature needs to feel real-time even at the cost of occasionally losing a frame. It uses TCP for chat delivery — since a lost message is unacceptable — and UDP for the video/voice stream, since minimizing latency matters far more than guaranteeing every packet arrives.

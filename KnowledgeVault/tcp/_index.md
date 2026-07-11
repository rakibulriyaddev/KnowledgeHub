---
id: tcp
title: "TCP (Transmission Control Protocol)"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, transport-layer, networking-fundamentals]
parent: networking
children: []
status: draft
---

## Overview

TCP is the internet's connection-oriented Transport-layer (Layer 4) protocol: it guarantees data arrives completely, in order, and error-checked, at the cost of extra overhead. Wherever correctness matters more than raw speed — web pages, email, file transfers, payments — TCP is the default choice.

## Key Concepts

- Connection-oriented — a session is established via a 3-way handshake before any data flows
- Reliable — every packet is acknowledged; lost or corrupted packets are retransmitted
- Ordered delivery — data is reassembled in the exact order it was sent
- Flow control and congestion control — sender/receiver speed is coordinated and backs off under network strain
- ~20-byte header, heavier than UDP's 8 bytes
- Common uses: HTTP/HTTPS, SMTP/IMAP, FTP, SSH

## Core Knowledge

A TCP connection begins with a 3-way handshake — SYN, SYN-ACK, ACK — before either side sends real data. From there, every segment is numbered and acknowledged; if an acknowledgement doesn't arrive in time, the sender retransmits. This guarantees the receiving application sees exactly what was sent, in the order it was sent, with nothing missing. Flow control prevents a fast sender from overwhelming a slow receiver, and congestion control throttles the whole connection when the network itself is under strain — both mechanisms trade some throughput for stability.

That reliability isn't free: the handshake adds a round-trip of latency before data even starts, and every acknowledgement is extra traffic. That's why TCP is the right tool exactly when correctness outweighs latency — a corrupted file download or a silently-dropped payment request is unacceptable, while a video call can tolerate a dropped frame far better than it can tolerate TCP's retransmission lag.

## Interview Questions

**Q: Why does TCP need a handshake before sending data?**
A: To establish shared state — both sides agree on sequence numbers and confirm they can both send and receive — so reliable, ordered delivery is possible from the first real packet.

**Q: What happens when a TCP packet is lost?**
A: The sender doesn't receive an acknowledgement in time and retransmits the packet, preserving both reliability and order.

**Q: Why would TCP be a poor choice for a live multiplayer game?**
A: Its retransmission and acknowledgement mechanics introduce latency whenever a packet is lost — lag that hurts a real-time game far more than simply dropping a stale packet would.

## Scenario

A payment API must never silently lose or corrupt a transaction request. It uses TCP: the 3-way handshake and per-packet acknowledgement guarantee the request arrives exactly once, completely, and in order — the small latency cost is irrelevant next to the cost of a lost payment.

---
id: tcp
title: "TCP (Transmission Control Protocol)"
created: 2026-07-11
modified: 2026-07-22
tags: [protocols, transport-layer, networking-fundamentals]
parent: networking
children: []
status: draft
---

## Overview

TCP is the internet's connection-based Transport-layer (Layer 4) protocol: it makes sure data arrives complete, in order, and checked for errors, at the cost of extra overhead. Wherever getting it right matters more than raw speed — web pages, email, file transfers, payments — TCP is the normal choice.

## Key Concepts

- Connection-based — a session starts with a 3-way handshake before any data is sent
- Reliable — every packet is confirmed; lost or broken packets are sent again
- Ordered delivery — data is put back together in the exact order it was sent
- Flow control and congestion control — sender and receiver speed is matched, and both slow down when the network is under strain
- ~20-byte header, heavier than UDP's 8 bytes
- Common uses: HTTP/HTTPS, SMTP/IMAP, FTP, SSH

## Core Knowledge

A TCP connection starts with a 3-way handshake — SYN, SYN-ACK, ACK — before either side sends real data. After that, every piece of data is numbered and confirmed; if a confirmation doesn't arrive in time, the sender sends it again. This makes sure the receiving app sees exactly what was sent, in the right order, with nothing missing. Flow control stops a fast sender from overwhelming a slow receiver, and congestion control slows the whole connection down when the network itself is under strain — both trade some speed for stability.

That reliability isn't free: the handshake adds a round-trip of delay before data even starts, and every confirmation is extra traffic. That's why TCP is the right tool exactly when getting it right matters more than delay — a broken file download or a silently-dropped payment request is not okay, while a video call can handle a dropped frame far better than it can handle TCP's resend delay.

## Interview Questions

**Q: Why does TCP need a handshake before sending data?**
A: To set up shared state — both sides agree on numbers and check they can both send and receive — so reliable, ordered delivery is possible from the very first real packet.

**Q: What happens when a TCP packet is lost?**
A: The sender doesn't get a confirmation in time and sends it again, keeping both reliability and order.

**Q: Why would TCP be a poor choice for a live multiplayer game?**
A: Its resend-and-confirm steps add delay whenever a packet is lost — lag that hurts a real-time game far more than just dropping an old packet would.

## Scenario

A payment API must never silently lose or damage a transaction request. It uses TCP: the 3-way handshake and per-packet confirmation make sure the request arrives exactly once, complete, and in order — the small delay cost doesn't matter next to the cost of a lost payment.

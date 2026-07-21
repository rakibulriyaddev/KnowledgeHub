---
id: udp
title: "UDP (User Datagram Protocol)"
created: 2026-07-11
modified: 2026-07-22
tags: [protocols, transport-layer, networking-fundamentals]
parent: networking
children: []
status: draft
---

## Overview

UDP is the internet's connectionless Transport-layer (Layer 4) protocol: it sends data right away with no handshake and no delivery guarantee, trading reliability for speed. Wherever delay matters more than guaranteed delivery — live video, gaming, DNS — UDP is the normal choice.

## Key Concepts

- Connectionless — no handshake, data is just sent
- No delivery or order guarantee — packets can be lost or arrive out of order
- Small 8-byte header — much lighter than TCP's ~20 bytes
- No flow control or congestion control
- Still has a checksum for basic error checking, but drops bad packets instead of sending them again
- Common uses: live streaming, video/voice calls, online gaming, DNS queries

## Core Knowledge

UDP skips everything TCP does to guarantee reliability: no handshake, no confirmations, no resending, no ordering. A packet is sent and the sender moves on — if it's lost, UDP does nothing about it. That simple approach is exactly what real-time apps want: a video call or live stream handles a dropped frame far better than it handles the lag that TCP's resending would cause, and a DNS query is small enough that the client can just try again rather than pay for a TCP handshake.

**Caution:** it's a common wrong idea that UDP has zero error checking — it does have a checksum — the difference from TCP is that when it finds an error, UDP just drops the packet rather than sending it again, keeping speed over correctness. UDP is also a natural fit for broadcast/multicast and lots of small requests, since there's no per-packet handshake cost to add up.

## Interview Questions

**Q: Why would you choose UDP over TCP?**
A: When speed matters more than guaranteed delivery — for example video streaming, gaming, or DNS — since UDP skips TCP's handshake and resend overhead.

**Q: Does UDP have any error checking at all?**
A: Yes — it has a checksum — but unlike TCP, UDP doesn't resend a broken or lost packet; it just throws it away, trading correctness for speed.

**Q: Why does DNS usually use UDP instead of TCP?**
A: DNS queries are small, simple question-answer exchanges where speed matters more than guaranteed delivery; a lost query is cheap to just try again. TCP is only used for bigger responses, like zone transfers.

## Scenario

A live-streaming platform can't afford the lag of resending a dropped frame in the middle of a broadcast — a short glitch is better than freezing the whole stream to wait for a resend. It uses UDP: frames that arrive, arrive fast; frames that don't are simply skipped.

---
id: udp
title: "UDP (User Datagram Protocol)"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, transport-layer, networking-fundamentals]
parent: networking
children: []
status: draft
---

## Overview

UDP is the internet's connectionless Transport-layer (Layer 4) protocol: it sends data immediately with no handshake and no delivery guarantee, trading reliability for speed. Wherever latency matters more than guaranteed delivery — live video, gaming, DNS — UDP is the default choice.

## Key Concepts

- Connectionless — no handshake, data is simply sent
- No delivery or ordering guarantee — packets can be lost or arrive out of order
- Minimal 8-byte header — far lighter than TCP's ~20 bytes
- No flow control or congestion control
- Still has a checksum for basic error detection, but drops bad packets instead of retransmitting
- Common uses: live streaming, video/voice calls, online gaming, DNS queries

## Core Knowledge

UDP skips everything TCP does to guarantee reliability: no handshake, no acknowledgements, no retransmission, no ordering. A packet is sent and the sender moves on — if it's lost, UDP does nothing about it. That minimalism is exactly what real-time applications want: a video call or live stream tolerates a dropped frame far better than it tolerates the lag TCP's retransmission would introduce, and a DNS query is small enough that the client can just retry rather than pay for a TCP handshake.

**Caution:** it's a misconception that UDP has zero error checking — it does include a checksum — the difference from TCP is that on detecting an error, UDP simply drops the packet rather than retransmitting it, preserving speed over correctness. UDP is also the natural fit for broadcast/multicast and high-volume small requests, since there's no per-packet handshake overhead to multiply.

## Interview Questions

**Q: Why would you choose UDP over TCP?**
A: When speed matters more than guaranteed delivery — e.g. video streaming, gaming, or DNS — since UDP skips TCP's handshake and retransmission overhead.

**Q: Does UDP have any error detection at all?**
A: Yes — it includes a checksum — but unlike TCP, UDP doesn't retransmit a corrupted or lost packet; it just discards it, trading correctness for speed.

**Q: Why does DNS typically use UDP instead of TCP?**
A: DNS queries are small, simple question-answer exchanges where speed matters more than guaranteed delivery; a lost query is cheap to just retry. TCP is used instead only for larger responses, like zone transfers.

## Scenario

A live-streaming platform can't afford the lag of retransmitting a dropped frame mid-broadcast — a brief glitch is preferable to stuttering the whole stream to wait for a resend. It uses UDP: frames that arrive, arrive fast; frames that don't are simply skipped.

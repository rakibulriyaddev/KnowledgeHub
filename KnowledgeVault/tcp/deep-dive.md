---
title: "TCP — Deep Dive"
---

![TCP three-way handshake](/vault/tcp/TCP_Three-Way_Handshake_diagram.jpeg)

Imagine sending a letter and wanting confirmation it arrived — you'd use Registered Post. **TCP** is the internet's Registered Post: reliable, but a bit slower.

## TCP - Transmission Control Protocol

**TCP** is a *connection-oriented* and *reliable* protocol. It ensures that data reaches its destination in the correct order and completely.

### Characteristics of TCP
- **Connection-oriented:** establishes a connection through a handshake before sending data.
- **Reliable:** ensures every packet is delivered.
- **Ordered delivery:** data arrives in the correct order.
- **Error checking:** if bad data is detected, it's resent.
- **Flow control:** coordinates the speed between sender and receiver.
- **Congestion control:** slows down data speed when the network is congested.

### 3-Way Handshake
A TCP connection begins with a 3-step handshake: SYN, SYN-ACK, ACK.

### Where is TCP used?
- Web browsing (HTTP, HTTPS)
- Email (SMTP, IMAP)
- File transfer (FTP)
- Remote access (SSH)

## Common misconceptions

1. **"TCP is always good":** No — using TCP for a real-time video call would make the experience worse than UDP would.

## When to use TCP in system design

- **Reliability matters:** payments, file transfer, chat messages that must not be lost.
- **Order matters:** anything where out-of-sequence data is meaningless (e.g. a file download).

## Chapter Summary

- TCP is connection-oriented, reliable, ordered — but slower than UDP.
- TCP starts a connection with a 3-way handshake.
- HTTP/HTTPS, Email, FTP -> TCP.
- Choose TCP when correctness matters more than latency.

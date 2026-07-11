---
title: "TCP and UDP — Deep Dive"
---

![TCP three-way handshake](/vault/tcp-udp/TCP_Three-Way_Handshake_diagram.jpeg)

Imagine you're sending letters to two friends. One friend wants the letter to arrive for sure, and wants a confirmation once it does - for that you'd use Registered Post. The other friend just wants it sent fast - regular post will do for that.

The internet also has two philosophies - **TCP** (reliable but a bit slower) and **UDP** (fast but no guarantee).

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

## TCP vs UDP - comparison

**TCP**
- Reliable - guaranteed delivery
- Ordered - correct sequence
- Error correction
- Slower (handshake + acknowledgement)
- Needs more bandwidth
- Use: HTTP, Email, FTP

**UDP**
- Fast - low overhead
- Ideal for real-time apps
- Low latency
- No reliability
- Data can be lost
- Use: Video call, Gaming, DNS

## Real-world examples

- **WhatsApp chat message:** TCP - the message absolutely must arrive.
- **WhatsApp video call:** UDP - it's fine to lose some frames, latency matters.
- **YouTube video:** TCP for the download portion, UDP for live streaming.
- **Online games:** UDP - speed matters most.

## Common misconceptions

1. **"UDP is always bad":** No, UDP is the best choice for real-time work.
2. **"TCP is always good":** No, using TCP for a video call would make the experience bad.
3. **"UDP has no error checking at all":** It does (checksum), but when an error is detected it isn't retransmitted.

## When to use which in system design

- **Reliability matters:** TCP (payments, file transfer)
- **Latency matters:** UDP (gaming, video calls)
- **Broadcast/Multicast:** UDP
- **Many small requests at once:** UDP (DNS)

## Chapter Summary

- TCP is connection-oriented, reliable, ordered - but slower.
- UDP is connectionless, fast - but with no guarantee.
- TCP starts a connection with a 3-way handshake.
- HTTP/HTTPS, Email, FTP -> TCP.
- Video call, gaming, DNS, live streaming -> UDP.
- Choose the right protocol based on the application's needs.

---
title: "TCP and UDP — Q&A"
---

**Q: What does TCP stand for?**
A: Transmission Control Protocol — TCP = Transmission Control Protocol.

**Q: What does UDP stand for?**
A: User Datagram Protocol — UDP = User Datagram Protocol.

**Q: Which protocol is connection-oriented?**
A: TCP — TCP is connection-oriented; UDP is connectionless.

**Q: How many steps is TCP's handshake?**
A: 3 — TCP uses a 3-way handshake: SYN, SYN-ACK, ACK.

**Q: UDP guarantees delivery of data.**
A: False — UDP has no guarantee at all, data can get lost.

**Q: Which is an ideal use case for UDP?**
A: Live video streaming — Latency matters in live streaming, and it's fine to lose a few frames - UDP is ideal.

**Q: Which is an ideal use case for TCP?**
A: HTTPS web browsing — Accuracy and security of data matter for HTTPS - TCP is ideal.

**Q: Which protocol is faster?**
A: UDP — UDP has no handshake or acknowledgement, so it's faster.

**Q: Which protocol does a DNS query typically use?**
A: UDP — DNS typically uses UDP for fast query/response, especially on port 53. However, DNS also uses TCP in some cases, such as zone transfers, large responses, or large DNSSEC-related responses.

**Q: TCP ensures data arrives in the correct order.**
A: True — TCP provides ordered delivery - data arrives in the same order it was sent.

**Q: How big is a TCP header typically?**
A: 20 bytes — A TCP header is usually 20 bytes (more than UDP's 8 bytes).

**Q: How big is a UDP header?**
A: 8 bytes — A UDP header is only 8 bytes - very lightweight.

**Q: Which protocol is used in a WhatsApp chat message, and why?**
A: TCP - the message must absolutely arrive — A chat message must not be lost, so TCP is used for reliability.

**Q: Which protocol is suitable for a WhatsApp video call?**
A: UDP — Latency matters in a real-time video call, and it's still watchable if a few frames are lost - UDP.

**Q: Which feature does TCP NOT provide?**
A: Low latency — TCP is reliable but doesn't provide low latency - because of the handshake and acknowledgements.

**Q: An app can use both TCP and UDP at the same time.**
A: True — For example WhatsApp - TCP for chat, UDP for calls.

**Q: Which is an advantage of UDP?**
A: Low overhead and speed — UDP's main advantage is lightweight and fast transmission.

**Q: What problem would using TCP in an online game cause?**
A: The game would lag due to high latency — TCP's retransmission and acknowledgement cause delay, which is disastrous in a real-time game.

**Q: Which layer's protocol is TCP?**
A: Transport — Both TCP and UDP are Transport Layer (Layer 4) protocols.

**Q: UDP has congestion control.**
A: False — UDP has no congestion control. TCP does.

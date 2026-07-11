---
title: "UDP — Q&A"
---

**Q: What does UDP stand for?**
A: User Datagram Protocol.

**Q: Is UDP connection-oriented or connectionless?**
A: Connectionless — no handshake, data is sent directly.

**Q: UDP guarantees delivery of data.**
A: False — UDP has no guarantee at all, data can get lost.

**Q: Which is an ideal use case for UDP?**
A: Live video streaming — latency matters, and it's fine to lose a few frames.

**Q: Which protocol is faster, TCP or UDP?**
A: UDP — no handshake or acknowledgement, so it's faster.

**Q: Which protocol does a DNS query typically use?**
A: UDP — for fast query/response, especially on port 53. TCP is used in some cases, such as zone transfers or large DNSSEC responses.

**Q: How big is a UDP header?**
A: 8 bytes — very lightweight.

**Q: Which protocol is suitable for a WhatsApp video call?**
A: UDP — latency matters in a real-time call, and it's still watchable if a few frames are lost.

**Q: Which is an advantage of UDP?**
A: Low overhead and speed.

**Q: Does UDP have congestion control?**
A: False — UDP has no congestion control; TCP does.

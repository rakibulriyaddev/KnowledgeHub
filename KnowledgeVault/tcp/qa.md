---
title: "TCP — Q&A"
---

**Q: What does TCP stand for?**
A: Transmission Control Protocol.

**Q: Is TCP connection-oriented or connectionless?**
A: Connection-oriented — it establishes a session via a handshake before sending data.

**Q: How many steps is TCP's handshake?**
A: 3 — SYN, SYN-ACK, ACK.

**Q: Which layer's protocol is TCP?**
A: Transport — Layer 4 of the OSI model.

**Q: How big is a TCP header typically?**
A: 20 bytes.

**Q: Which is an ideal use case for TCP?**
A: HTTPS web browsing — accuracy and security of data matter, so TCP is ideal.

**Q: Which protocol is used for a WhatsApp chat message, and why?**
A: TCP — a chat message must not be lost, so TCP is used for reliability.

**Q: Which feature does TCP NOT provide?**
A: Low latency — TCP is reliable but not low-latency, because of the handshake and acknowledgements.

**Q: What problem would using TCP in an online game cause?**
A: The game would lag due to high latency from retransmission and acknowledgement.

**Q: Does TCP have congestion control?**
A: Yes — TCP slows down transmission when the network is congested.

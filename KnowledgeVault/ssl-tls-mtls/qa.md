---
title: "SSL, TLS, mTLS — Q&A"
---

**Q: What are TLS's three goals?**
A: Confidentiality, Integrity, Authentication — Encryption + tamper detection + server identity.

**Q: What's the relationship between SSL and TLS?**
A: TLS is SSL's modern successor — SSL is deprecated; TLS is the standard.

**Q: Which TLS version is recommended today?**
A: TLS 1.2 minimum, 1.3 preferred — 1.0 and 1.1 are deprecated; 1.2+ is secure.

**Q: Why is a symmetric key used in the TLS handshake?**
A: Asymmetric is slow - symmetric encrypts the actual data fast — Asymmetric for the handshake; symmetric for the data - a performance balance.

**Q: What is a Certificate Authority?**
A: A trusted entity that signs certificates — The browser verifies the CA's signature.

**Q: What is Let's Encrypt?**
A: A free, automated CA — It democratized HTTPS for the web.

**Q: What's the difference between mTLS and TLS?**
A: In mTLS both client and server present certificates — Bidirectional authentication.

**Q: TLS 1.3 has a faster handshake than 1.2.**
A: True — 1-RTT (vs 2-RTT) - the initial connection is faster.

**Q: What does a certificate contain?**
A: Subject (domain), public key, issuer, validity, signature — The fields of a digital ID card.

**Q: Why is a self-signed cert bad in production?**
A: No CA trust - triggers a browser warning — It appears untrusted to the user.

**Q: A banking API integration. Security must be strict. What should you use?**
A: mTLS - both sides verify — Mutual auth is standard in banking.

**Q: A public website - the visitor is unknown. What should you use?**
A: TLS - server-only auth — Standard TLS is the norm for public sites.

**Q: What does Service Mesh (Istio) enable by default?**
A: mTLS between services — Automatic mTLS service-to-service.

**Q: HTTPS means a completely secure application.**
A: False — It's only encryption - XSS, SQL injection, and auth bugs are separate concerns.

**Q: What is HSTS?**
A: HTTP Strict Transport Security - forces the browser to use HTTPS — Prevents downgrade attacks.

**Q: What does "ClientHello" send in the TLS handshake?**
A: Supported TLS version, cipher suites, random value — It kicks off negotiation.

**Q: What happens when a cert expires?**
A: Browser warning + connection is blocked — Microsoft Teams had downtime in 2020 due to an expired cert.

**Q: Where does SSL Termination happen?**
A: At the reverse proxy/load balancer - the backend gets plain HTTP — The decrypt-once pattern saves backend resources.

**Q: What is forward secrecy?**
A: Even if a past session key is compromised, earlier traffic still can't be decrypted — Per-session ephemeral keys - mandatory in TLS 1.3.

**Q: A self-signed cert can sometimes be fine for an internal service.**
A: True — OK in a closed network with an internal CA - a trusted environment.

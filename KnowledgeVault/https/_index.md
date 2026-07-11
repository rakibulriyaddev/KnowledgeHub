---
id: https
title: "HTTPS"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, application-layer, security]
parent: networking
children: []
status: draft
---

## Overview

HTTPS is HTTP layered on top of TLS: the same request-response protocol, but every byte is encrypted and the server's identity is verified before any data is exchanged. It's the default for the modern web — browsers actively flag plain HTTP as "not secure."

## Key Concepts

- HTTPS = HTTP + TLS (Transport Layer Security) — see `ssl-tls-mtls` for the handshake details
- Encryption in transit — protects against eavesdropping on the network path
- Server authentication — a certificate proves the server is who it claims to be
- Integrity — data can't be tampered with in transit without detection
- Runs over port 443 by default (vs. HTTP's port 80)
- Certificates are issued by a Certificate Authority (CA) and can expire or be revoked

## Core Knowledge

Before any HTTP request is sent, the client and server perform a TLS handshake: the server presents a certificate, the client verifies it against a trusted CA, and both sides negotiate a shared symmetric key used to encrypt the rest of the session. Everything after that — the actual HTTP request and response — travels encrypted, so a network observer sees only ciphertext, not the URL path, headers, or body.

This adds a small latency cost (the handshake round-trip) beyond plain HTTP, though TLS 1.3 and session resumption have shrunk that cost significantly. In exchange, HTTPS defends against two real threats plain HTTP can't: a man-in-the-middle reading or modifying traffic, and an attacker impersonating the server entirely. Because of this, HTTPS is now effectively mandatory — browsers warn on plain HTTP, and many APIs and OAuth flows refuse to operate over anything else.

## Interview Questions

**Q: What does HTTPS add on top of HTTP?**
A: A TLS layer that encrypts the connection and authenticates the server via a certificate, before any HTTP request/response is exchanged.

**Q: Why can a network eavesdropper not read an HTTPS request's contents?**
A: The TLS handshake establishes a shared symmetric key before any HTTP data is sent, so the request/response bodies and headers are encrypted in transit.

**Q: What happens if a server's TLS certificate has expired?**
A: The client's TLS handshake fails validation and the browser blocks the connection with a security warning, since it can no longer trust the server's identity.

## Scenario

A login form must never expose a user's password on the wire. Serving it over HTTPS means the credentials are encrypted before leaving the browser, so even if an attacker intercepts the network traffic on a public Wi-Fi network, they see only unreadable ciphertext.

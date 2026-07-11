---
id: ssl-tls-mtls
title: "SSL, TLS, mTLS"
created: 2026-07-11
modified: 2026-07-11
tags: [security, encryption, networking, authentication]
parent: reliability-security
children: []
status: draft
---

## Overview

TLS (Transport Layer Security) is the technology behind every HTTPS site, protecting data in transit from eavesdropping, tampering, and impersonation as it crosses wifi routers, ISPs, and network hops. SSL is its deprecated predecessor, and mTLS (mutual TLS) extends the same protocol so both client and server authenticate each other, not just the server.

## Key Concepts

- Three goals — confidentiality (encryption), integrity (tamper detection), authentication (server identity).
- TLS handshake — ClientHello, ServerHello + certificate, certificate verification, key exchange, encrypted session begins.
- Asymmetric vs symmetric crypto — asymmetric (RSA/ECDSA) for the handshake, symmetric (AES) for actual data.
- Certificate — a CA-signed digital ID card proving a domain's identity.
- mTLS — both client and server present and verify certificates; used for service-to-service and zero-trust auth.
- TLS 1.3 — 1-RTT handshake, mandatory forward secrecy, weak ciphers removed.

## Core Knowledge

Plain HTTP is vulnerable to eavesdropping, tampering, and server impersonation. TLS (the modern successor to the deprecated SSL, created by Netscape in 1995) fixes this with three goals: confidentiality, integrity, and authentication. **Caution:** "SSL certificate" is still common terminology, but it's actually TLS doing the work — the name is a legacy holdover, and SSL 2.0/3.0 plus TLS 1.0/1.1 are all deprecated; TLS 1.2 is the minimum acceptable today, with 1.3 preferred.

The handshake negotiates this trust: the client sends supported versions/ciphers (`ClientHello`), the server responds with its choice and certificate, the client verifies that certificate against a trusted Certificate Authority (CA) such as Let's Encrypt (free, automated, and now powering most of the web's HTTPS), then both sides derive a shared symmetric key via a key-exchange algorithm like Diffie-Hellman. From there, asymmetric crypto (RSA/ECDSA — slow but enables the initial exchange) hands off to symmetric crypto (AES — fast, used for the actual data stream). TLS 1.3 improves on 1.2 with a 1-RTT handshake (vs 2-RTT), 0-RTT session resumption, removal of weak ciphers, and mandatory forward secrecy (a compromised session key can't retroactively decrypt past traffic).

**Mutual TLS (mTLS)** flips standard TLS's one-way trust into two-way: the server requests a certificate from the client too, and verifies it's a known, trusted party — essential for service-to-service auth in microservices, banking API integrations, IoT device authentication, and zero-trust networks (Istio enables mTLS by default in its service mesh). Common pitfalls include expired certificates causing outages (Microsoft Teams, 2020), self-signed certs in production triggering browser warnings, weak cipher suites, mixed HTTP/HTTPS content, and missing HSTS (which otherwise opens the door to downgrade attacks).

## Interview Questions

**Q: Why does TLS use both asymmetric and symmetric encryption instead of just one?**
A: Asymmetric crypto (RSA/ECDSA) is computationally slow but doesn't require a pre-shared secret, so it's used only during the handshake to establish a session key. Symmetric crypto (AES) is fast, so it's used for the actual bulk data transfer once that shared key exists.

**Q: What's the difference between TLS and mTLS?**
A: In standard TLS, only the client verifies the server's certificate — the server doesn't know who the client is beyond the application layer. In mTLS, the server also requests and verifies a certificate from the client, giving both sides cryptographic proof of identity — common in service meshes and banking integrations.

**Q: What is forward secrecy, and why does TLS 1.3 make it mandatory?**
A: Forward secrecy means that even if a session's key is later compromised, past traffic encrypted under different ephemeral keys remains safe — because each session negotiates its own throwaway key rather than reusing a long-term one. TLS 1.3 mandates it to ensure a single leaked key can't retroactively expose historical communications.

## Scenario

A bank exposes an API to a partner integration. Standard TLS would only prove the bank's server identity to the partner, leaving the bank unable to verify who's actually calling. Using mTLS instead, the bank requires the partner to present a client certificate during the handshake — the connection is only established once both the partner's certificate and the bank's own are mutually verified, satisfying the strict authentication requirements typical of financial integrations.

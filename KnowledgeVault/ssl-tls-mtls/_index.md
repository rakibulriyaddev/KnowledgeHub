---
id: ssl-tls-mtls
title: "SSL, TLS, mTLS"
created: 2026-07-11
modified: 2026-07-22
tags: [security, encryption, networking, authentication]
parent: reliability-security
children: []
status: draft
---

## Overview

TLS (Transport Layer Security) is the technology behind every HTTPS site. It keeps data safe while it travels, protecting it from being read, changed, or faked as it passes through wifi routers, ISPs, and other network stops. SSL is its older version, no longer used, and mTLS (mutual TLS) extends the same protocol so both the client and the server prove who they are, not just the server.

## Key Concepts

- Three goals — keeping data private (encryption), catching any changes to it (tamper detection), and proving identity (checking who the server is)
- TLS handshake — ClientHello, ServerHello plus certificate, checking the certificate, exchanging keys, then the encrypted session starts
- Asymmetric vs symmetric crypto — asymmetric (RSA/ECDSA) is used for the handshake, symmetric (AES) is used for the actual data
- Certificate — a digital ID card, signed by a CA, that proves a domain's identity
- mTLS — both the client and the server show and check certificates; used for service-to-service and zero-trust login
- TLS 1.3 — faster handshake (1 round trip), forward secrecy is always on, weak ciphers are removed

## Core Knowledge

Plain HTTP can be read, changed, or faked by others. TLS (the modern version that replaced the old, no-longer-used SSL, made by Netscape in 1995) fixes this with three goals: keeping data private, catching changes, and proving identity. **Caution:** people still say "SSL certificate," but TLS is actually doing the work now — the old name just stuck around. SSL 2.0/3.0 and TLS 1.0/1.1 are all no longer used; TLS 1.2 is the least you should accept today, and TLS 1.3 is better.

The handshake sets up this trust: the client sends the versions and ciphers it supports (`ClientHello`), the server answers with its choice and its certificate, the client checks that certificate against a trusted Certificate Authority (CA) such as Let's Encrypt (free, automatic, and now behind most of the web's HTTPS), then both sides work out a shared symmetric key using a key-exchange method like Diffie-Hellman. From there, asymmetric crypto (RSA/ECDSA — slow, but good for this first exchange) hands off to symmetric crypto (AES — fast, used for the actual flow of data). TLS 1.3 improves on 1.2 with a faster handshake (1 round trip instead of 2), 0-round-trip session resume, removal of weak ciphers, and forward secrecy that is always on (a stolen session key can't be used to read past traffic).

**Mutual TLS (mTLS)** turns standard TLS's one-way trust into two-way trust: the server also asks the client for a certificate, and checks that it's a known, trusted party — important for service-to-service login in microservices, banking API links, IoT device login, and zero-trust networks (Istio turns on mTLS by default in its service mesh). Common mistakes include expired certificates causing outages (this happened to Microsoft Teams in 2020), using self-signed certificates in production (which triggers browser warnings), weak cipher choices, mixing HTTP and HTTPS content, and missing HSTS (which otherwise leaves the door open to downgrade attacks).

## Interview Questions

**Q: Why does TLS use both asymmetric and symmetric encryption instead of just one?**
A: Asymmetric crypto (RSA/ECDSA) is slow to compute but doesn't need a secret shared ahead of time, so it's only used during the handshake to set up a session key. Symmetric crypto (AES) is fast, so it's used for the actual bulk data once that shared key exists.

**Q: What's the difference between TLS and mTLS?**
A: In standard TLS, only the client checks the server's certificate — the server doesn't know who the client is beyond the app layer. In mTLS, the server also asks for and checks a certificate from the client, so both sides get proof of who the other is — common in service meshes and banking links.

**Q: What is forward secrecy, and why does TLS 1.3 make it mandatory?**
A: Forward secrecy means that even if a session's key is stolen later, past traffic protected by other, one-time keys stays safe — because each session works out its own throwaway key instead of reusing a long-term one. TLS 1.3 requires it so that one leaked key can't be used to read past communication.

## Scenario

A bank opens up an API for a partner to use. Standard TLS would only prove the bank's server identity to the partner, leaving the bank unable to check who's actually calling. Using mTLS instead, the bank asks the partner to show a client certificate during the handshake — the connection only starts once both the partner's certificate and the bank's own are checked and trusted, meeting the strict identity-checking rules common in financial systems.

---
id: https
title: "HTTPS"
created: 2026-07-11
modified: 2026-07-22
tags: [protocols, application-layer, security]
parent: networking
children: []
status: draft
---

## Overview

HTTPS is HTTP with TLS added on top: the same request-response protocol, but every bit of data is encrypted and the server's identity is checked before anything is sent. It is the default for the modern web — browsers openly mark plain HTTP as "not secure."

## Key Concepts

- HTTPS = HTTP + TLS (Transport Layer Security) — see `ssl-tls-mtls` for handshake details
- Encryption in transit — protects against someone listening in on the network
- Server check — a certificate proves the server is who it says it is
- Integrity — data can't be changed in transit without it being noticed
- Runs over port 443 by default (HTTP uses port 80)
- Certificates are given out by a Certificate Authority (CA) and can expire or be canceled

## Core Knowledge

Before any HTTP request is sent, the client and server do a TLS handshake: the server shows a certificate, the client checks it against a trusted CA, and both sides agree on a shared key used to encrypt the rest of the session. Everything after that — the actual HTTP request and response — travels encrypted, so someone watching the network sees only scrambled data, not the URL, headers, or body.

This adds a small delay (the handshake round-trip) beyond plain HTTP, though TLS 1.3 and reusing sessions have cut that cost a lot. In return, HTTPS blocks two real threats plain HTTP can't stop: someone in the middle reading or changing traffic, and someone pretending to be the server. Because of this, HTTPS is now almost required — browsers warn on plain HTTP, and many APIs and login flows refuse to work over anything else.

## Interview Questions

**Q: What does HTTPS add on top of HTTP?**
A: A TLS layer that encrypts the connection and checks the server's identity with a certificate, before any HTTP request/response is sent.

**Q: Why can't someone watching the network read an HTTPS request's contents?**
A: The TLS handshake sets up a shared key before any HTTP data is sent, so the request/response bodies and headers are encrypted in transit.

**Q: What happens if a server's TLS certificate has expired?**
A: The client's TLS handshake fails the check and the browser blocks the connection with a warning, since it can no longer trust the server's identity.

## Scenario

A login form must never show a user's password on the network. Sending it over HTTPS means the login info is encrypted before it leaves the browser, so even if someone grabs the network traffic on public Wi-Fi, they only see unreadable scrambled data.

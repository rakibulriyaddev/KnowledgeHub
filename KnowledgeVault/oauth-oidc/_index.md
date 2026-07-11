---
id: oauth-oidc
title: "OAuth 2.0 and OpenID Connect"
created: 2026-07-11
modified: 2026-07-11
tags: [security, authentication, authorization, identity]
parent: reliability-security
children: []
status: draft
---

## Overview

OAuth 2.0 is an authorization framework that lets a third-party app access a user's resources without ever seeing the password — the mechanism behind "Sign in with Google." OpenID Connect (OIDC) adds an authentication layer on top of OAuth, answering "who is this user" rather than just "what can this app do."

## Key Concepts

- Four actors — Resource Owner (user), Client (app), Authorization Server, Resource Server.
- Authorization Code Flow — the standard, most secure flow for web/mobile apps.
- PKCE — Proof Key for Code Exchange, required for mobile apps/SPAs that can't store a secret.
- Access token vs. refresh token — short-lived API credential vs. long-lived renewal credential.
- ID Token (OIDC) — a JWT expressing user identity, distinct from the access token.
- JWT — the common self-contained, signed (not encrypted) token format.

## Core Knowledge

Before OAuth, a third-party app needing access to your data had to ask for your actual password — insecure, all-or-nothing, and unrevocable per-app. **OAuth 2.0** solves this with four actors: the Resource Owner (you), the Client (the app), the Authorization Server (Google/Facebook, which authenticates and issues tokens), and the Resource Server (the API holding your data). **Caution:** OAuth is about authorization, not authentication — proving who you are requires OIDC on top.

The **Authorization Code Flow** is the standard: the app redirects to the authorization server with a requested scope, the user logs in and consents, the server redirects back with a one-time authorization code, the app's backend exchanges that code plus its client secret for an access token and refresh token, then calls the resource server with `Authorization: Bearer {token}`. Other grant types exist for different contexts: **Authorization Code + PKCE** for mobile/SPA clients that can't safely store a secret, **Client Credentials** for server-to-server calls with no user, and **Device Code** for input-constrained devices like smart TVs. The **Implicit Flow** and **Resource Owner Password Credentials** grants are both deprecated for security reasons — implicit leaks tokens into the URL, and password credentials defeats the whole point of OAuth.

Tokens split into short-lived **access tokens** (15 min–1 hour, used per API call, often JWT) and long-lived **refresh tokens** (days/months, exchanged for a new access token, ideally rotated on each use). **OIDC** layers identity on top of this: an **ID Token** (a JWT describing the user, meant for the app itself, not for API calls), a standardized UserInfo endpoint, standardized scopes (`openid`, `profile`, `email`), and provider auto-discovery. JWTs themselves are three base64URL parts — header, payload, signature — self-contained and tamper-evident via signature, but **not encrypted by default**, and hard to revoke since they're stateless (revocation typically relies on short expiry plus a blocklist).

## Interview Questions

**Q: What's the difference between OAuth 2.0 and OpenID Connect?**
A: OAuth 2.0 is an authorization framework — it lets an app access resources on a user's behalf via scoped tokens. OIDC adds an authentication layer on top, introducing the ID Token so an app can verify who the user actually is, not just what they've authorized.

**Q: Why does PKCE exist, and when is it required?**
A: Mobile apps and single-page apps are "public clients" that can't safely store a client secret. PKCE (Proof Key for Code Exchange) adds a dynamically generated code verifier/challenge pair so the authorization code can't be intercepted and exchanged by an attacker, even without a stored secret.

**Q: Why is JWT revocation considered hard?**
A: JWTs are stateless and self-contained — validity is checked via signature and expiration, not a database lookup. Revoking one before its natural expiry requires extra infrastructure like a blocklist check, defeating some of the statelessness benefit; short-lived access tokens plus refresh token rotation are the common mitigation.

## Scenario

A mobile app adds "Sign in with Google." It uses Authorization Code + PKCE since it can't securely embed a client secret: the app generates a code verifier, redirects the user to Google with the derived challenge, the user logs in and consents, Google redirects back with an authorization code, and the app exchanges the code plus the original verifier for an access token (API calls) and an ID token (proves identity, since OIDC is layered in) — all without the app ever seeing the user's Google password.

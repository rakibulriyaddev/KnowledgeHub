---
id: oauth-oidc
title: "OAuth 2.0 and OpenID Connect"
created: 2026-07-11
modified: 2026-07-22
tags: [security, authentication, authorization, identity]
parent: reliability-security
children: []
status: draft
---

## Overview

OAuth 2.0 is a framework that lets a third-party app use a user's data without ever seeing the password — it's the idea behind "Sign in with Google." OpenID Connect (OIDC) adds a layer on top of OAuth that answers "who is this user," not just "what can this app do."

## Key Concepts

- Four actors — Resource Owner (user), Client (app), Authorization Server, Resource Server.
- Authorization Code Flow — the standard, safest flow for web/mobile apps.
- PKCE — Proof Key for Code Exchange, needed for mobile apps/SPAs that can't keep a secret safe.
- Access token vs. refresh token — a short-lived API pass vs. a long-lived pass used to get a new one.
- ID Token (OIDC) — a JWT that states who the user is, different from the access token.
- JWT — the common self-contained, signed (not encrypted) token format.

## Core Knowledge

Before OAuth, a third-party app that needed your data had to ask for your real password — unsafe, all-or-nothing, and hard to undo per app. **OAuth 2.0** fixes this with four actors: the Resource Owner (you), the Client (the app), the Authorization Server (Google/Facebook, which checks who you are and hands out tokens), and the Resource Server (the API holding your data). **Caution:** OAuth is about permission, not proving identity — proving who you are needs OIDC on top.

The **Authorization Code Flow** is the standard one: the app sends you to the authorization server with the access it wants, you log in and agree, the server sends you back with a one-time code, the app's backend swaps that code plus its own secret for an access token and a refresh token, then calls the resource server with `Authorization: Bearer {token}`. Other flow types exist for other cases: **Authorization Code + PKCE** for mobile/SPA apps that can't safely hold a secret, **Client Credentials** for server-to-server calls with no user involved, and **Device Code** for devices with limited input, like smart TVs. The **Implicit Flow** and **Resource Owner Password Credentials** flows are both no longer recommended for safety reasons — implicit puts tokens in the URL where they can leak, and password credentials defeats the whole point of OAuth.

Tokens come in two kinds: short-lived **access tokens** (15 minutes to an hour, used on every API call, often a JWT) and long-lived **refresh tokens** (days or months, swapped for a new access token, ideally replaced each time it's used). **OIDC** adds identity on top of this: an **ID Token** (a JWT describing the user, meant for the app itself, not for API calls), a standard UserInfo endpoint, standard scopes (`openid`, `profile`, `email`), and auto-discovery of the provider. A JWT itself has three base64URL parts — header, payload, signature — self-contained and tamper-proof through its signature, but **not encrypted by default**, and hard to cancel early since it holds no state (canceling usually relies on a short lifespan plus a blocklist).

## Interview Questions

**Q: What's the difference between OAuth 2.0 and OpenID Connect?**
A: OAuth 2.0 is a permission framework — it lets an app use resources on a user's behalf through scoped tokens. OIDC adds an identity layer on top, adding the ID Token so an app can check who the user really is, not just what they've allowed.

**Q: Why does PKCE exist, and when is it needed?**
A: Mobile apps and single-page apps are "public clients" that can't safely hold a client secret. PKCE (Proof Key for Code Exchange) adds a freshly made code pair so the code can't be caught and used by an attacker, even with no stored secret.

**Q: Why is canceling a JWT early considered hard?**
A: JWTs hold no state and check themselves — they're valid based on their signature and expiry, not a database lookup. Canceling one before it expires needs extra work like a blocklist check, which cancels out some of the benefit of holding no state; short-lived access tokens plus refresh token swaps are the usual fix.

## Scenario

A mobile app adds "Sign in with Google." It uses Authorization Code + PKCE since it can't safely hold a client secret: the app makes a code verifier, sends the user to Google with a matching challenge, the user logs in and agrees, Google sends back an authorization code, and the app swaps the code plus the first verifier for an access token (for API calls) and an ID token (proves identity, since OIDC is added in) — all without the app ever seeing the user's Google password.

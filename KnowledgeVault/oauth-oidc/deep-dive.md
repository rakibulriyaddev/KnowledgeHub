---
title: "OAuth 2.0 and OpenID Connect — Deep Dive"
---

You tap the "Sign in with Google" button on a new app. The browser goes to Google, you log in, you tap allow - and back at the app, you're logged in! But the app never knew your Gmail password. That's the magic of **OAuth**.

## What problem does it solve?

In the old days a third-party app would ask for your password (e.g., "This photo printing site needs your Facebook password to access your photos"). The problems:

- Sharing a password is insecure.
- Limited permissions were impossible - it was all-or-nothing access.
- If you changed your password - everything broke.
- Revoking a specific app was impossible.

## What is OAuth 2.0?

**OAuth 2.0** is an authorization framework that lets a third-party app access a user's resources - without ever sharing the password.

**Caution:** OAuth is about *authorization* (what it's allowed to do), not authentication (who you are). For authentication you need OIDC.

## The 4 Actors

- **Resource Owner:** The user (you).
- **Client:** The third-party app that wants access.
- **Authorization Server:** Authenticates the user and issues tokens (Google, Facebook).
- **Resource Server:** Holds the protected data (Gmail API).

## Authorization Code Flow (most common)

1. The user clicks "Login with Google" on the app.
2. The app redirects the user to Google's authorization server - along with a scope (permissions).
3. The user logs in to Google and grants consent.
4. Google redirects back to the app with a one-time authorization code.
5. The app's backend calls Google with the authorization code + client secret.
6. Google returns an access token + refresh token.
7. The app fetches user data (Gmail, profile) using the access token.

```
User → App: Login
App → Google: redirect with scope
User → Google: authenticate + consent
Google → App: authorization code
App → Google (back-channel): code + secret
Google → App: access token + refresh token
App → Resource Server: Authorization: Bearer {token}
```

## OAuth Grant Types

### Authorization Code (Recommended)

For web/mobile apps - the secret lives server-side. The most secure option.

### Authorization Code + PKCE

For mobile apps/SPAs - solves the problem of storing a secret.

PKCE = Proof Key for Code Exchange - an extra verification step.

### Client Credentials

Server-to-server, no user involved - internal API calls.

### Device Code

Smart TVs, IoT - devices with limited input. The user enters a code on their mobile phone.

### Implicit Flow (Deprecated)

Used to be for SPAs - had security problems.

### Resource Owner Password Credentials (Deprecated)

The app takes the password directly - goes against the spirit of OAuth.

## Tokens

### Access Token

- Short-lived (15 minutes to 1 hour).
- Used on API calls.
- JWT format is common.

### Refresh Token

- Long-lived (days/months).
- Used to get a new access token.
- Good practice to rotate it (refresh token rotation).

## OpenID Connect (OIDC)

OAuth 2.0 is about authorization. OIDC is an authentication layer built on top of OAuth.

### What does OIDC add?

- **ID Token:** A JWT that expresses the user's identity.
- **UserInfo Endpoint:** A standardized user profile API.
- **Standardized scopes:** openid, profile, email.
- **Discovery:** Auto-discovers provider configuration.

### ID Token vs Access Token

**ID Token:** Speaks about the user; JWT - readable; used for app authentication; not used on API calls.

**Access Token:** API permission; format is implementation-dependent; used for resource access; should not be parsed by the app.

## JWT (JSON Web Token)

JWT is the typical OAuth/OIDC token format:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0..._signature
[Header].[Payload].[Signature]

Header: {"alg":"HS256","typ":"JWT"}
Payload: {"sub":"123","name":"Mahfuz","exp":1234}
Signature: HMAC(header.payload, secret)
```

### Properties

- Self-contained - the claims live in the token.
- Signed - tampering is detectable.
- Stateless - no DB lookup (typically).
- Base64URL encoded.

### Pitfalls

- A leaked secret is catastrophic.
- Algorithm confusion attacks.
- Revocation is hard (stateless).
- Token size grows with many claims.

## Popular Providers

- **Google Identity:** Google login.
- **Auth0 (Okta):** Managed identity.
- **AWS Cognito:** On AWS.
- **Microsoft Azure AD:** Enterprise.
- **Keycloak:** Open-source, self-hosted.
- **Firebase Auth:** Mobile-friendly.

## Real-world examples

- **"Sign in with Google":** OIDC + OAuth.
- **"Connect to Slack/GitHub":** OAuth.
- **API platforms (Stripe, Twitter):** Scope-based OAuth.
- **Mobile app authentication:** Auth Code + PKCE.

## Security Best Practices

- HTTPS everywhere.
- State parameter (CSRF protection).
- PKCE on mobile/SPA.
- Short-lived access tokens.
- Refresh token rotation.
- Grant minimum scope.
- Validate JWT signature + expiration.
- Don't expose tokens in the URL.

## Common misconceptions

1. **"OAuth = authentication":** No - it's authorization. OIDC is authentication.
2. **"JWT is always secure":** A wrong implementation is a disaster.
3. **"OAuth is complex":** Straightforward once you choose the right flow.
4. **"Implicit flow is OK":** Deprecated - use Auth Code + PKCE.

## Chapter Summary

- OAuth 2.0 = third-party authorization (not authentication).
- OIDC = OAuth + an authentication layer (ID token).
- Authorization Code Flow is the standard; PKCE for mobile/SPA.
- Access tokens are short-lived; refresh tokens are long-lived.
- JWT is the common token format - stateless and self-contained.

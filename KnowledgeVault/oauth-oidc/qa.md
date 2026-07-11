---
title: "OAuth 2.0 and OpenID Connect — Q&A"
---

**Q: What is OAuth 2.0 fundamentally?**
A: Authorization framework — OAuth is authorization (what it can do); OIDC is authentication.

**Q: How many actors are there in OAuth?**
A: 4 (User, Client, Auth Server, Resource Server) — Resource owner, client, auth server, resource server.

**Q: In which grant type does the user never have to share their password?**
A: Authorization Code — In Auth Code the password is given to Google itself; the app never receives it.

**Q: What is the lifetime of an authorization code like?**
A: One-time, short (seconds) — The code is exchanged once - then it becomes invalid.

**Q: Why does PKCE exist?**
A: Solves the problem of storing a secret in mobile apps/SPAs — Public clients risk secret leaks; PKCE adds extra verification.

**Q: What does OIDC add to OAuth?**
A: An authentication layer + ID Token — An ID Token (JWT) is added for the user's identity.

**Q: ID Token vs Access Token?**
A: ID = user identity; Access = API permission — ID Token is for authentication; Access Token is for authorization.

**Q: What is the typical lifetime of an access token?**
A: 15 minutes to 1 hour — Short-lived - a security best practice.

**Q: What is a refresh token used for?**
A: Long-lived - used to get a new access token — A refresh token gets a new access token without the user having to log in again.

**Q: JWT is inherently encrypted.**
A: False — JWT is signed (integrity); not encrypted by default. The payload is readable base64.

**Q: What are the three parts of a JWT?**
A: Header.Payload.Signature — Three base64URL-encoded parts separated by dots.

**Q: Why does the state parameter exist?**
A: CSRF protection — Matching the state value in the auth flow prevents CSRF.

**Q: You're building a mobile app - which OAuth flow?**
A: Authorization Code + PKCE — The modern recommendation is Auth Code + PKCE.

**Q: A backend-to-backend API call (no user). What should you use?**
A: Client Credentials — Client Credentials is for machine-to-machine communication.

**Q: Why is the implicit flow deprecated?**
A: The token leaks into the URL - a security risk — It leaks via browser history and referrers.

**Q: What is scope?**
A: What permission the app wants (read email, post a tweet) — Granular permissions - grant the minimum.

**Q: Is it fine for a token to sit in the URL?**
A: No - it belongs in the Authorization header — URLs risk leaking via logs, history, and referrers. Use Bearer in the header.

**Q: What is Auth0/Okta?**
A: A managed identity provider - an OAuth/OIDC platform — A managed solution instead of self-hosting.

**Q: Why is JWT revocation hard?**
A: Stateless - no DB lookup, it relies on expiration — Short expiration + revocation lists are the workaround.

**Q: OAuth 2.0 and OIDC are the same thing.**
A: False — OIDC is an authentication layer on top of OAuth - different concerns.

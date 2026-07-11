---
title: "Single Sign-On (SSO) — Deep Dive"
---

You work at a company. Every day it's Slack, Gmail, Jira, Google Drive, Salesforce, Zoom - all separate logins? A different password for every app? The solution: **SSO** - log in once, get access to every app.

## What is SSO?

**Single Sign-On** is an authentication system that lets a user log in once and get access to multiple applications - without having to re-authenticate.

## Benefits

### For the user

- Log in once - access 10 apps.
- Only one password to remember.
- Productivity goes up.

### For the organization

- Centralized user management.
- Easy onboarding/offboarding.
- Enforces a stronger security policy.
- Centralized audit trail.
- Lower password-reset costs.

## The Actors in SSO

- **Identity Provider (IdP):** Performs authentication - Okta, Auth0, Azure AD, Google.
- **Service Provider (SP):** The app the user wants access to - Slack, Jira, Salesforce.
- **User:** The one logging in.

## SSO Flow

1. The user goes to Slack.
2. Slack (the SP) redirects to the IdP - if the user isn't authenticated.
3. The user logs in at the IdP (only once).
4. The IdP gives an authentication assertion (token/SAML response).
5. The SP verifies the assertion - the user is authenticated.
6. The user gets access to Slack.
7. Later, when they go to Jira - the IdP session already exists - no need to log in again.

## Common SSO Protocols

### SAML 2.0

XML-based, enterprise standard (2005).

- The SP sends an AuthnRequest to the IdP.
- The IdP returns a signed XML assertion.
- Browser-based, redirect flow.
- Heavy but widely supported.

### OpenID Connect (OIDC)

Built on OAuth 2.0 - the modern alternative.

- JSON-based (lightweight).
- Mobile-friendly.
- JWT ID token.
- Supported by Google, Microsoft, Apple - everyone.

### Kerberos

Enterprise networks (Windows AD).

- Ticket-based.
- Favored on local networks.

### OAuth 2.0 (sometimes)

Strictly speaking it's authorization, but "Login with Google" feels like SSO to the user.

## SAML vs OIDC

**SAML 2.0:** XML-based; mature enterprise standard; browser/web-focused; heavy markup; banking, government.

**OIDC:** JSON/JWT; modern, mobile-friendly; API-friendly; lightweight; SaaS, modern apps.

## Identity Federation

**Federation** is SSO across organizational boundaries - your company's IdP is trusted by my company's app.

Example: an employee of company A accesses company B's Slack tenant - via company A's IdP.

## Popular Identity Providers

- **Okta:** Industry leader.
- **Auth0:** Developer-friendly (acquired by Okta).
- **Microsoft Azure AD / Entra ID:** Dominant in enterprise.
- **Google Workspace:** "Sign in with Google."
- **Ping Identity:** Enterprise.
- **Keycloak:** Open-source, self-hosted.
- **OneLogin, JumpCloud:** SMB-friendly.

## Security Considerations

- **SSO compromise is catastrophic:** if the one IdP fails, every app is vulnerable.
- **MFA is mandatory:** multi-factor at the IdP (TOTP, hardware key).
- **Session management:** idle timeout, forcing re-auth on sensitive actions.
- **Logout - single logout (SLO):** logging out in one place logs you out of every app.
- **Phishing risk:** fake IdP pages.

## Real-world examples

- **Google Workspace:** Gmail, Drive, Calendar - single login.
- **Microsoft 365:** Office, Teams, OneDrive.
- **Enterprise:** Okta + Salesforce + Slack + Jira.
- **"Sign in with Apple/Google/Facebook":** Consumer SSO.

## Challenges

- Initial setup is complex (especially SAML).
- SP integration differs per app.
- Identity attribute mapping.
- Multi-IdP scenarios (multi-cloud).
- SSO bypass - emergency local access.

## Common misconceptions

1. **"SSO = OAuth":** SSO is a concept; OAuth/OIDC/SAML are implementations.
2. **"SSO is insecure (one point of failure)":** Properly implemented, with MFA, it's strong.
3. **"SAML is deprecated":** Not yet - still widely used in enterprise.
4. **"Social login is the same as enterprise SSO":** Same idea, different context.

## Best Practices

- Enforce MFA at the IdP level.
- Prefer OIDC over SAML for modern apps.
- Strict session timeouts.
- Implement Single Logout (SLO).
- Conditional access - based on location, device.
- Monitoring - failed logins, anomalies.
- Keep an emergency break-glass account.

## Chapter Summary

- SSO = log in once, access multiple apps.
- Identity Provider (IdP) and Service Provider (SP) are the two actors.
- SAML for enterprise; OIDC is modern; Kerberos for networks.
- Centralized - both a benefit and a risk.
- MFA + monitoring are mandatory.

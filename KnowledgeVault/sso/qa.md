---
title: "Single Sign-On (SSO) — Q&A"
---

**Q: What is the definition of SSO?**
A: Log in once, access multiple apps — Single Sign-On - authenticate once, access every app.

**Q: What are the two main actors in SSO?**
A: Identity Provider (IdP) and Service Provider (SP) — The IdP authenticates; the SP accepts the user.

**Q: What is Okta?**
A: Identity Provider (IdP) — Okta is an industry-leading IdP.

**Q: What format does SAML use?**
A: XML — SAML 2.0 assertions are XML-based.

**Q: What format does OIDC use?**
A: JSON/JWT — JSON Web Token - modern and lightweight.

**Q: Which SSO protocol is widely used in enterprise?**
A: SAML 2.0 — SAML is the standard in banking, government, and large corporations.

**Q: Which is preferred for SSO in modern apps?**
A: OIDC - JSON, mobile-friendly — OIDC fits mobile, API, and modern web.

**Q: SSO is an alternative to MFA.**
A: False — SSO + MFA together is the security best practice.

**Q: What is Single Logout (SLO)?**
A: Logging out in one place logs you out of every app — Centralized termination of the session.

**Q: What is Identity Federation?**
A: SSO across organizational boundaries — Company A's IdP is trusted by company B's app.

**Q: A startup wants SSO for its employees - which is fastest?**
A: Managed Okta/Auth0 — A managed solution deploys faster.

**Q: The IdP gets compromised. What happens?**
A: Every app becomes vulnerable - central control means central risk — This is SSO's downside - defense-in-depth is needed.

**Q: Who sends the AuthnRequest in SAML?**
A: SP → IdP — The SP sends an AuthnRequest to the IdP to authenticate the user.

**Q: Microsoft 365 is an example of SSO.**
A: True — Office, Teams, OneDrive - single login via Azure AD.

**Q: Where is Kerberos common?**
A: Windows enterprise networks (Active Directory) — Ticket-based auth on local networks.

**Q: What is conditional access?**
A: Access policy based on location/device/time — Risk-based - login from Bangladesh is fine, a suspicious country is blocked.

**Q: What is a break-glass account?**
A: An emergency local admin account - for access if the IdP fails — Exists so an IdP outage doesn't cause a lockout.

**Q: What protocol is used for user provisioning in SSO?**
A: SCIM (System for Cross-domain Identity Management) — SCIM auto-provisions new users across apps.

**Q: Social login (Google, Facebook) is a form of consumer SSO.**
A: True — Same concept, consumer context.

**Q: What is Keycloak?**
A: Open-source, self-hosted IdP — Red Hat's open-source project - SSO/OAuth/OIDC/SAML.

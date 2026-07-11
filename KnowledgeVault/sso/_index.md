---
id: sso
title: "Single Sign-On (SSO)"
created: 2026-07-11
modified: 2026-07-11
tags: [security, authentication, identity, enterprise]
parent: reliability-security
children: []
status: draft
---

## Overview

Single Sign-On (SSO) lets a user log in once and gain access to multiple applications — Slack, Gmail, Jira, Salesforce — without re-authenticating for each one. It centralizes authentication behind an Identity Provider, trading a proliferation of passwords for one strong login, at the cost of that IdP becoming a high-value target.

## Key Concepts

- Identity Provider (IdP) vs Service Provider (SP) — the two core actors in every SSO flow.
- SAML 2.0 — XML-based, mature enterprise standard.
- OpenID Connect (OIDC) — JSON/JWT-based, modern, mobile-friendly, built on OAuth 2.0.
- Identity Federation — SSO trust extended across organizational boundaries.
- Single Logout (SLO) — logging out in one place ends the session everywhere.
- SSO + MFA — SSO is not a substitute for multi-factor authentication; they're complementary.

## Core Knowledge

SSO benefits both users (one login for many apps, less password fatigue) and organizations (centralized user management, fast onboarding/offboarding, a single audit trail, stronger enforced policy, and fewer password-reset tickets). The flow: a user visits an SP (e.g., Slack), which redirects to the IdP if unauthenticated; the user logs in once at the IdP; the IdP returns a signed authentication assertion (SAML XML or a JWT); the SP verifies it and grants access; visiting a second SP (e.g., Jira) reuses the existing IdP session with no further login.

Two protocols dominate. **SAML 2.0** (2005) is XML-based: the SP sends an `AuthnRequest` to the IdP, which returns a signed XML assertion via browser redirect — heavyweight but the mature, still-widely-used enterprise standard (banking, government). **OIDC**, built on OAuth 2.0, is JSON/JWT-based, lightweight, and mobile/API-friendly — the modern choice for SaaS and consumer apps. Kerberos is a third, ticket-based option common in Windows Active Directory networks. **Identity Federation** extends SSO across company boundaries — an employee of Company A can access Company B's Slack tenant, authenticated through Company A's own IdP.

**Caution:** SSO concentrates risk as much as it concentrates convenience — if the IdP is compromised, every connected app is exposed. This makes mandatory MFA at the IdP, strict session timeouts, Single Logout (SLO), conditional access (location/device-based policy), and monitoring for anomalous logins essential rather than optional. A "break-glass" emergency local account is standard practice so an IdP outage doesn't lock everyone out. Popular IdPs include Okta, Auth0 (now part of Okta), Microsoft Entra ID (Azure AD), Google Workspace, Ping Identity, and the open-source Keycloak.

## Interview Questions

**Q: What's the difference between SAML and OIDC, and when would you choose one over the other?**
A: SAML is XML-based and browser-redirect-focused, mature and dominant in enterprise/government/banking contexts. OIDC is JSON/JWT-based, lightweight, and mobile/API-friendly, making it the better fit for modern SaaS and consumer apps. Legacy enterprise integrations often still require SAML.

**Q: Why is "SSO reduces security because it's a single point of failure" a common misconception?**
A: While a compromised IdP does expose every connected app, that's an argument for hardening the IdP (mandatory MFA, monitoring, conditional access), not against SSO itself — a properly secured centralized login is generally stronger than dozens of independently weak per-app passwords.

**Q: What is Identity Federation and how does it differ from ordinary SSO within one company?**
A: Ordinary SSO covers multiple apps trusting one IdP inside a single organization. Federation extends that trust across organizational boundaries, so a user authenticated by their own company's IdP can access a different company's application — e.g., an employee of Company A accessing Company B's Slack tenant.

## Scenario

An employee logs into their laptop each morning via the company's Okta portal. Throughout the day they open Slack, Gmail, and Jira without ever typing a password again — each app redirects to Okta, finds an existing session, and grants access immediately. When the employee leaves the company, IT deactivates a single Okta account, instantly revoking access to every connected application at once instead of chasing down credentials app by app.

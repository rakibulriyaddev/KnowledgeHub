---
id: sso
title: "Single Sign-On (SSO)"
created: 2026-07-11
modified: 2026-07-22
tags: [security, authentication, identity, enterprise]
parent: reliability-security
children: []
status: draft
---

## Overview

Single Sign-On (SSO) lets a user log in once and get access to many apps — Slack, Gmail, Jira, Salesforce — without logging in again for each one. It puts login in one place, behind an Identity Provider, trading many passwords for one strong login — but that also makes the Identity Provider a high-value target for attackers.

## Key Concepts

- Identity Provider (IdP) vs Service Provider (SP) — the two main players in every SSO flow
- SAML 2.0 — XML-based, an older but still common enterprise standard
- OpenID Connect (OIDC) — JSON/JWT-based, modern, works well on mobile, built on OAuth 2.0
- Identity Federation — SSO trust stretched across the boundary between two companies
- Single Logout (SLO) — logging out in one place ends the session everywhere else too
- SSO + MFA — SSO does not replace multi-factor authentication; the two work together

## Core Knowledge

SSO helps both users (one login for many apps, less password tiredness) and companies (managing users from one place, fast onboarding/offboarding, one clear log of activity, stronger rules that are actually followed, and fewer password-reset tickets). The flow: a user opens an SP (like Slack), which sends them to the IdP if they're not logged in; the user logs in once at the IdP; the IdP sends back a signed proof of login (SAML XML or a JWT); the SP checks it and lets the user in; opening a second SP (like Jira) reuses the same IdP session with no extra login needed.

Two protocols lead the field. **SAML 2.0** (from 2005) is XML-based: the SP sends an `AuthnRequest` to the IdP, which sends back a signed XML proof through a browser redirect — heavier, but still the mature, widely-used enterprise standard (banking, government). **OIDC**, built on OAuth 2.0, is JSON/JWT-based, lighter, and works well for mobile and APIs — the modern choice for SaaS and consumer apps. Kerberos is a third, ticket-based option, common in Windows Active Directory networks. **Identity Federation** stretches SSO across company boundaries — an employee of Company A can get into Company B's Slack, all logged in through Company A's own IdP.

**Caution:** SSO brings risk together just as much as it brings convenience together — if the IdP is broken into, every connected app is at risk. This is why MFA at the IdP must be required, session timeouts must be strict, Single Logout (SLO) must be used, conditional access (rules based on location or device) must be in place, and watching for strange logins is a must, not an option. A "break-glass" backup local account is standard practice, so that an IdP outage doesn't lock everyone out. Popular IdPs include Okta, Auth0 (now part of Okta), Microsoft Entra ID (Azure AD), Google Workspace, Ping Identity, and the open-source Keycloak.

## Interview Questions

**Q: What's the difference between SAML and OIDC, and when would you choose one over the other?**
A: SAML is XML-based and built around browser redirects, mature and common in enterprise, government, and banking settings. OIDC is JSON/JWT-based, lighter, and works well for mobile and APIs, making it the better fit for modern SaaS and consumer apps. Older enterprise setups often still need SAML.

**Q: Why is "SSO reduces security because it's a single point of failure" a common misconception?**
A: A broken-into IdP does put every connected app at risk, but that's an argument for making the IdP stronger (required MFA, monitoring, conditional access), not against SSO itself — one well-secured central login is usually stronger than many weak, separate app passwords.

**Q: What is Identity Federation and how does it differ from ordinary SSO within one company?**
A: Ordinary SSO covers many apps trusting one IdP inside one company. Federation stretches that trust across company boundaries, so a user logged in through their own company's IdP can reach a different company's app — like an employee of Company A getting into Company B's Slack.

## Scenario

An employee logs into their laptop each morning through the company's Okta portal. Through the day, they open Slack, Gmail, and Jira without ever typing a password again — each app sends them to Okta, finds an existing session, and lets them in right away. When the employee leaves the company, IT turns off one Okta account, instantly taking away access to every connected app at once, instead of chasing down logins one app at a time.

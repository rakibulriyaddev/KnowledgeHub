---
id: database-security
title: "Database Security"
created: 2026-07-11
modified: 2026-07-11
tags: [data, storage, security]
parent: database
children: []
status: draft
---

# Database Security

## Overview

Database security covers the controls that protect data from unauthorized access, tampering, and leakage — authentication, authorization, encryption, and injection prevention — since a database typically holds the most sensitive data in a system and is a prime attack target. It exists because application-layer security alone doesn't stop a compromised credential, a misconfigured network rule, or an injection attack from reaching data directly.

## Key Concepts

- **Authentication** — verifying who is connecting (passwords, certificates, IAM-based auth)
- **Authorization / roles** — controlling what an authenticated principal can do (read/write/admin, row/column-level)
- **Encryption at rest** — data encrypted on disk, protecting against stolen storage media/backups
- **Encryption in transit** — TLS between client and database, protecting against network interception
- **SQL/query injection** — attacker-supplied input altering query logic, the most common data-layer vulnerability
- **Auditing** — logging who accessed or changed what, for detection and compliance

## Core Knowledge

- Principle of least privilege applies directly: application accounts should hold only the permissions their code path needs, not admin/superuser access by default
- Parameterized queries/prepared statements neutralize injection at the root cause — string-concatenated queries built from user input are the primary attack surface
- Encryption at rest protects against stolen disks/backups but not against a compromised, already-authenticated connection — it's one layer, not a complete answer
- Row-level and column-level security (native in some engines, e.g. Postgres RLS) enforce access rules inside the database itself, closing gaps left by inconsistent application-layer checks
- Network exposure is a common real-world breach vector — databases left reachable on public networks with weak or default credentials are repeatedly exploited in the wild
- Secrets management (credentials, connection strings) belongs in a dedicated secrets store, not source code or plain config files — leaked credentials are a frequent root cause
- Auditing and logging access patterns is what turns a breach from undetected data exfiltration into a detected, contained incident — prevention and detection are both necessary
- Backup files carry the same sensitivity as live data and need equivalent access control and encryption — a secured production database with unprotected backups is a common gap

## Interview Questions

**Q:** Why does encryption at rest not fully protect against a data breach?
**A:** It protects against stolen physical media or backups, but an attacker with a valid, already-authenticated connection or application-layer access bypasses it entirely.

**Q:** How do parameterized queries prevent SQL injection?
**A:** User input is bound as data to a precompiled query structure rather than concatenated into query text, so it can never alter the query's logic regardless of its content.

**Q:** What does the principle of least privilege mean for a database service account?
**A:** The account should only have the specific permissions its application code path actually needs — not broad read/write or admin access "just in case."

**Q:** Why is database auditing important even with strong access controls in place?
**A:** Controls can fail or be misconfigured; audit logs are what let a team detect, scope, and respond to unauthorized access after the fact rather than remain unaware of it.

## Scenario

A support tool built with string-concatenated SQL queries lets an attacker inject a crafted input that bypasses the WHERE clause and dumps an entire customer table. Rewriting the queries to use parameterized statements closes the injection vector entirely, while adding least-privilege service accounts and audit logging ensures that any future attempt is both harder to execute and immediately visible.

---
id: database-security
title: "Database Security"
created: 2026-07-11
modified: 2026-07-22
tags: [data, storage, security]
parent: database
children: []
status: draft
---

# Database Security

## Overview

Database security covers the checks that protect data from unwanted access, tampering, and leaks — login checks, permission rules, encryption, and injection prevention — since a database usually holds the most sensitive data in a system and is a top attack target. It matters because app-layer security alone doesn't stop a stolen password, a wrong network setting, or an injection attack from reaching data directly.

## Key Concepts

- **Authentication** — checking who is connecting (passwords, certificates, IAM-based login)
- **Authorization / roles** — controlling what a checked-in user can do (read/write/admin, row/column-level)
- **Encryption at rest** — data scrambled on disk, protecting against stolen storage or backups
- **Encryption in transit** — TLS between client and database, protecting against network snooping
- **SQL/query injection** — attacker-given input changing query logic, the most common data-layer weakness
- **Auditing** — logging who touched or changed what, for spotting problems and for rule-following

## Core Knowledge

- Least privilege applies directly: app accounts should hold only the permissions their code path needs, not admin/superuser access by default
- Parameterized queries/prepared statements stop injection at the root — queries built by gluing user input into text are the main attack surface
- Encryption at rest protects against stolen disks/backups but not against a stolen, already-logged-in connection — it's one layer, not a full answer
- Row-level and column-level security (built into some engines, e.g. Postgres RLS) enforce access rules inside the database itself, closing gaps left by uneven app-layer checks
- Being reachable on the open network is a common real-world way in — databases left open on public networks with weak or default passwords are exploited again and again
- Secrets (passwords, connection strings) belong in a dedicated secrets store, not in source code or plain config files — leaked passwords are a frequent root cause of breaches
- Logging access patterns is what turns a breach from unseen data theft into a spotted, contained incident — prevention and detection are both needed
- Backup files carry the same sensitivity as live data and need the same access control and encryption — a locked-down live database with open backups is a common gap

## Interview Questions

**Q:** Why doesn't encryption at rest fully protect against a data breach?
**A:** It protects against stolen physical media or backups, but an attacker with a valid, already-logged-in connection or app-layer access skips it entirely.

**Q:** How do parameterized queries stop SQL injection?
**A:** User input is passed as data to a pre-built query structure instead of being glued into query text, so it can never change the query's logic no matter what it contains.

**Q:** What does least privilege mean for a database service account?
**A:** The account should only have the specific permissions its app code path actually needs — not broad read/write or admin access "just in case."

**Q:** Why does database auditing matter even with strong access controls in place?
**A:** Controls can fail or be set up wrong; audit logs are what let a team spot, size up, and respond to unwanted access after the fact instead of staying unaware.

## Scenario

A support tool built with queries glued together from raw text lets an attacker sneak in crafted input that skips the WHERE clause and dumps an entire customer table. Rewriting the queries to use parameterized statements closes the injection hole entirely, while adding least-privilege service accounts and logging makes sure any future attempt is both harder to pull off and easy to spot.

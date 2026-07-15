---
id: ssh-key-management
title: "SSH Key Management"
created: 2026-07-15
modified: 2026-07-15
tags: [security, infrastructure, key-management]
parent: ssh
children: []
status: draft
---

## Overview

SSH key management covers how key pairs are generated, distributed, rotated, and revoked across a fleet of machines and users. Get this wrong at scale and either access is too slow to grant (bottlenecked provisioning) or too hard to revoke (ex-employees or compromised keys retaining access indefinitely).

## Key Concepts

- Key generation — algorithm choice (Ed25519 over RSA for new keys), passphrase protection
- Distribution — copying public keys to `authorized_keys` manually vs. via config management/CA
- Rotation — periodic key replacement to bound the blast radius of an undetected leak
- Revocation — removing a public key from every host once a user leaves or a key leaks
- SSH Certificate Authority — a CA signs short-lived certs instead of distributing raw public keys

## Core Knowledge

Ed25519 is the modern default for new keys — smaller, faster, and just as secure as RSA-4096, with RSA kept mainly for legacy device compatibility.
Manually maintaining `authorized_keys` across many hosts doesn't scale — config management (Ansible, Puppet) or centralized identity (LDAP, an SSH CA) is required once past a handful of servers.
An SSH Certificate Authority signs short-lived certificates for users/hosts instead of trusting long-lived public keys directly — revocation becomes "let the cert expire" instead of "hunt down and delete a key from every host."
Revoking access for a single raw public key (no CA) means finding and removing it from every `authorized_keys` file it was ever copied to — a common source of stale access after offboarding.
Key rotation policy should be driven by blast-radius reduction: if a key is compromised undetected, rotation limits how long the exposure window stays open.
**Caution:** the same weak-passphrase problem that plagues passwords applies to key files — an unencrypted private key on a laptop is a single-file credential leak away from full access.
Host keys (server-side identity) need their own lifecycle too — rotating a host key without warning breaks every client's known_hosts and looks identical to a MITM attack from the client's perspective.

## Interview Questions

**Q: Why is Ed25519 generally preferred over RSA for new SSH keys?**
A: It offers equivalent or better security with smaller key size and faster operations; RSA is mostly kept around for compatibility with older systems that don't support Ed25519.

**Q: Why does an SSH Certificate Authority scale better than distributing raw public keys?**
A: Revocation becomes automatic via certificate expiry instead of manually hunting down and removing a key from every host it was copied to — access grants and revokes centrally.

**Q: What's the operational risk of manually managing `authorized_keys` across many servers?**
A: Offboarded users or compromised keys can retain access on hosts the admin forgot to update, since there's no single source of truth to revoke from.

**Q: Why does rotating a server's host key require client-side coordination?**
A: Clients cache the old host key in `known_hosts`; an unannounced rotation makes the new key look identical to a man-in-the-middle attack, triggering warnings or blocked connections.

## Scenario

A company with 200 engineers manually copies public keys into `authorized_keys` on each of 50 servers. When an engineer leaves, security has no reliable way to confirm their key is removed everywhere — adopting an SSH CA that issues 8-hour certificates means the ex-employee's access simply expires without any manual cleanup.

---
id: ssh-key-management
title: "SSH Key Management"
created: 2026-07-15
modified: 2026-07-22
tags: [security, infrastructure, key-management]
parent: ssh
children: []
status: draft
---

## Overview

SSH key management covers how key pairs are made, given out, changed, and taken away, across many machines and users. Get this wrong at scale, and either it takes too long to give someone access, or it's too hard to take access away (so ex-employees or leaked keys can keep access forever).

## Key Concepts

- Key generation — which algorithm to use (Ed25519 instead of RSA for new keys), and protecting keys with a passphrase
- Distribution — copying public keys into `authorized_keys` by hand, or using config management tools or a CA instead
- Rotation — changing keys often, to limit the damage if a leak isn't noticed right away
- Revocation — removing a public key from every host once a user leaves the company or a key leaks
- SSH Certificate Authority — a CA signs short-lived certificates instead of handing out public keys directly

## Core Knowledge

Ed25519 is the modern default choice for new keys — it's smaller, faster, and just as safe as RSA-4096; RSA is mostly kept around for older devices that need it.
Keeping `authorized_keys` up to date by hand across many hosts doesn't scale — once you pass a handful of servers, you need config management tools (Ansible, Puppet) or a shared identity system (LDAP, an SSH CA) instead.
An SSH Certificate Authority signs short-lived certificates for users and hosts, instead of trusting long-lived public keys directly — taking away access just means "let the cert expire," instead of "find and delete a key from every host."
Taking away access for one raw public key (with no CA) means finding and removing it from every `authorized_keys` file it was ever put in — a common cause of leftover access after someone leaves.
Key rotation rules should focus on limiting damage: if a key leaks without anyone noticing, rotating it often limits how long that leak stays open.
**Caution:** the same weak-passphrase problem that hurts passwords also hurts key files — an unprotected private key on a laptop is just one stolen file away from full access.
Host keys (the server's own identity) need their own plan too — changing a host key without warning breaks every client's saved `known_hosts` entry, and looks exactly like a man-in-the-middle attack from the client's side.

## Interview Questions

**Q: Why is Ed25519 generally preferred over RSA for new SSH keys?**
A: It gives the same or better security with a smaller key size and faster speed; RSA is mostly kept for compatibility with older systems that don't support Ed25519.

**Q: Why does an SSH Certificate Authority scale better than distributing raw public keys?**
A: Taking away access becomes automatic once a certificate expires, instead of manually finding and removing a key from every host it was copied to — access is given and taken away from one central place.

**Q: What's the operational risk of manually managing `authorized_keys` across many servers?**
A: Ex-employees or leaked keys can keep access on hosts an admin forgot to update, since there's no single place to remove access from.

**Q: Why does rotating a server's host key require client-side coordination?**
A: Clients save the old host key in `known_hosts`; changing it without warning makes the new key look exactly like a man-in-the-middle attack, which triggers warnings or blocks the connection.

## Scenario

A company with 200 engineers copies public keys into `authorized_keys` by hand on each of 50 servers. When an engineer leaves, the security team has no sure way to check their key is removed everywhere. Switching to an SSH CA that gives out 8-hour certificates means the ex-employee's access simply runs out on its own, with no manual cleanup needed.

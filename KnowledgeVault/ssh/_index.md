---
id: ssh
title: "SSH"
created: 2026-07-15
modified: 2026-07-22
tags: [infrastructure, networking, security]
parent: networking
children: [ssh-key-management]
status: draft
---

## Overview

SSH (Secure Shell) is an encrypted protocol for running commands, sending files, and tunneling over a network you can't fully trust, and it runs on port 22 by default. It replaced plain-text protocols like Telnet and rsh, and is now the standard way engineers reach remote machines.

## Key Concepts

- Encrypted transport — symmetric encryption for the session, set up using asymmetric key exchange
- Authentication — by password, or by public key (the private key stays on your machine, the public key sits on the server)
- Host key check — the client checks the server's identity to stop man-in-the-middle attacks
- Port forwarding/tunneling — local, remote, and dynamic (SOCKS) tunnels, all through one SSH connection
- Related tools — `scp`/`sftp` for sending files, `ssh-agent` for handling keys, Git-over-SSH

## Core Knowledge

Public-key login is better than passwords: the private key never leaves your machine, the server only keeps the matching public key in `~/.ssh/authorized_keys`, and there's nothing sent over the network that an attacker could brute-force or steal.
The first time you connect to a new host, it asks you to check its host key fingerprint — just clicking "yes" without checking, when the fingerprint has changed, is a common mistake that removes the protection this check is meant to give.
`ssh-agent` keeps unlocked private keys in memory for the session, so you don't have to type your passphrase again on every connection or jump.
SSH config (`~/.ssh/config`) lets you give hosts short names, set default users, ports, and keys, and chain jumps (`ProxyJump`) without repeating flags every time.
Turning off password login completely (key-only) and turning off direct root login are basic safety steps for any server open to the internet.
SSH also works as a general secure tunnel — port forwarding through it is how you can send local, remote, or dynamic (SOCKS) traffic through it, without opening extra holes in a firewall.
**Caution:** a leaked private key is just as bad as a leaked password that never expires — keys should be protected with a passphrase and changed or removed (taken out of `authorized_keys`) if a machine is broken into.

## Interview Questions

**Q: Why is public-key authentication considered more secure than password authentication?**
A: The private key never leaves the client and never crosses the network, so there's nothing to brute-force, catch, or steal — the server only ever sees a signed proof, not a shared secret.

**Q: What does host key verification protect against?**
A: Man-in-the-middle attacks — the client checks the server's identity using a fingerprint before trusting the encrypted connection, so accepting a fingerprint without checking it removes this protection.

**Q: What's the role of `ssh-agent`?**
A: It keeps unlocked private keys in memory for the session, so you unlock a passphrase-protected key once instead of on every SSH connection.

**Q: What are two common SSH hardening steps for a production server?**
A: Turn off password login (key-only) and turn off direct root login — both close off the most common ways attackers try to guess their way in.

## Scenario

A team needs engineers to reach a production database that can only be reached from inside a private VPC. Instead of opening the database's port to the internet, they SSH into a bastion host and use local port forwarding to send a local port to the database's internal address — giving access without ever opening the database port to the outside world.

---
id: ssh
title: "SSH"
created: 2026-07-15
modified: 2026-07-15
tags: [infrastructure, networking, security]
parent: networking
children: [ssh-key-management]
status: draft
---

## Overview

SSH (Secure Shell) is an encrypted protocol for remote command execution, file transfer, and tunneling over an untrusted network, running by default on port 22. It replaced plaintext protocols like Telnet and rsh, making it the standard way engineers access remote machines.

## Key Concepts

- Encrypted transport — symmetric encryption for the session, negotiated via asymmetric key exchange
- Authentication — password-based or public-key (private key stays local, public key on server)
- Host key verification — client checks the server's identity to prevent MITM attacks
- Port forwarding/tunneling — local, remote, and dynamic (SOCKS) tunnels over one SSH connection
- Related tools — `scp`/`sftp` for file transfer, `ssh-agent` for key management, Git-over-SSH

## Core Knowledge

Public-key auth is preferred over passwords: a private key never leaves the client, the server only stores the corresponding public key in `~/.ssh/authorized_keys`, and there's nothing to brute-force or phish over the wire.
The first connection to a new host prompts to verify its host key fingerprint — accepting a changed fingerprint blindly (a common muscle-memory mistake) defeats the MITM protection this check exists for.
`ssh-agent` holds decrypted private keys in memory for a session so you're not re-entering a passphrase on every connection or hop.
SSH config (`~/.ssh/config`) lets you alias hosts, set default users/ports/keys, and chain jumps (`ProxyJump`) without repeating flags on every command.
Disabling password auth entirely (key-only) and disabling root login are baseline hardening steps for any internet-facing server.
SSH doubles as a generic secure tunnel — port forwarding through it is how `port-forwarding` describes local/remote/dynamic tunneling without opening extra firewall holes.
**Caution:** a leaked private key is equivalent to a leaked password with no expiry — keys should be passphrase-protected and rotated/revoked (removed from `authorized_keys`) if a machine is compromised.

## Interview Questions

**Q: Why is public-key authentication considered more secure than password authentication?**
A: The private key never leaves the client and never crosses the network, so there's nothing to brute-force, intercept, or phish — the server only ever sees a signed challenge, not a shared secret.

**Q: What does host key verification protect against?**
A: Man-in-the-middle attacks — the client confirms the server's identity via a fingerprint before trusting the encrypted channel, so a stale or accepted-without-checking fingerprint defeats the protection.

**Q: What's the role of `ssh-agent`?**
A: It caches decrypted private keys in memory for the session, so you unlock a passphrase-protected key once instead of on every SSH connection.

**Q: What are two common SSH hardening steps for a production server?**
A: Disable password authentication (key-only) and disable direct root login — both close off the most common brute-force and credential-guessing attack paths.

## Scenario

A team needs engineers to access a production database that's only reachable from inside a private VPC. Rather than exposing the DB port to the internet, they SSH into a bastion host and use local port forwarding to tunnel a local port to the DB's internal address — access without ever opening the DB port externally.

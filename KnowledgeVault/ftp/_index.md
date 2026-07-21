---
id: ftp
title: "FTP (File Transfer Protocol)"
created: 2026-07-11
modified: 2026-07-22
tags: [protocols, application-layer, file-transfer]
parent: networking
children: []
status: draft
---

## Overview

FTP is a protocol built to send files between a client and a server over a network. It came before the web and is still used to move large files, though safer or easier tools have mostly replaced it.

## Key Concepts

- Runs over TCP, using two separate connections: a control connection (port 21) for commands, and a data connection for the actual file
- Supports login (username/password) but sends this info as plain text by default
- Active vs. passive mode — differ in which side opens the data connection; matters for firewalls and NAT
- FTPS adds TLS encryption to FTP; SFTP is a fully different protocol that sends files over SSH
- Common actions: upload, download, list a folder, rename, delete

## Core Knowledge

FTP's main quirk is using two connections. The control connection stays open for the whole session and carries commands like LIST or RETR, while a separate data connection opens for each file transfer to move the actual bytes. In active mode, the client tells the server which port to connect back to for data — firewalls often block this. Passive mode flips this so the client opens both connections itself, which works better with firewalls and NAT today.

Because plain FTP sends both login info and file contents with no encryption, it's a bad choice for anything sensitive on an untrusted network. Two later options fix this in different ways: FTPS wraps the same FTP protocol in TLS, while SFTP is not related to FTP at all under the hood — it's a file-transfer part of the SSH protocol, and it has become the more common safe choice in practice.

## Interview Questions

**Q: Why does FTP use two separate connections?**
A: A control connection carries commands for the whole session, while a data connection opens for each file transfer — keeping session control apart from moving the actual file.

**Q: Is FTP safe by default?**
A: No — plain FTP sends login info and file data with no encryption; FTPS (FTP+TLS) or SFTP (over SSH) are used when safety matters.

**Q: What's the difference between FTPS and SFTP?**
A: FTPS is FTP with TLS added. SFTP is a different protocol built on top of SSH — they are not the same despite the similar name.

## Scenario

A backend job must upload nightly report files to a partner's server that only allows SFTP. Since the partner needs encrypted transfer and SSH-based login, plain FTP is not an option — the job connects over SFTP instead.

---
id: ftp
title: "FTP (File Transfer Protocol)"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, application-layer, file-transfer]
parent: networking
children: []
status: draft
---

## Overview

FTP is an Application-layer protocol built for transferring files between a client and a server over a network. It predates the web and is still used for bulk file transfer, though it has largely been superseded by more secure or more convenient alternatives.

## Key Concepts

- Runs over TCP, using two separate connections: a control connection (port 21) for commands, and a data connection for the actual file transfer
- Supports authentication (username/password) but sends credentials in plain text by default
- Active vs. passive mode — differ in which side opens the data connection, relevant for firewall/NAT traversal
- FTPS adds TLS encryption to FTP; SFTP is a different protocol entirely, running file transfer over SSH
- Common operations: upload, download, list directory, rename, delete

## Core Knowledge

FTP's defining quirk is its two-connection design: the control connection stays open for the session and carries commands like LIST or RETR, while a separate data connection is opened per transfer to move the actual file bytes. In active mode, the client tells the server which port to connect back to for data — which firewalls often block. Passive mode flips this so the client initiates both connections, making it the more NAT/firewall-friendly default today.

Because plain FTP sends both credentials and file contents unencrypted, it's a poor fit for anything sensitive over an untrusted network. Two successors address this differently: FTPS wraps the same FTP protocol in TLS, while SFTP is unrelated to FTP under the hood — it's a file-transfer subsystem of the SSH protocol, and has become the more common secure choice in practice.

## Interview Questions

**Q: Why does FTP use two separate connections?**
A: A control connection carries commands for the whole session, while a data connection is opened per file transfer — separating session management from the actual file transfer.

**Q: Is FTP secure by default?**
A: No — plain FTP transmits credentials and file data unencrypted; FTPS (FTP+TLS) or SFTP (over SSH) are used when security matters.

**Q: What's the difference between FTPS and SFTP?**
A: FTPS is FTP with TLS added; SFTP is a different protocol built on top of SSH — they aren't interchangeable despite the similar name.

## Scenario

A backend job needs to upload nightly report files to a partner's server that only exposes SFTP. Since the partner requires encrypted transfer and SSH-based authentication, plain FTP isn't an option — the job connects over SFTP instead.

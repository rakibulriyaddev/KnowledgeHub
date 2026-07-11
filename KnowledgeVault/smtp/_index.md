---
id: smtp
title: "SMTP (Simple Mail Transfer Protocol)"
created: 2026-07-11
modified: 2026-07-11
tags: [protocols, application-layer, email]
parent: networking
children: []
status: draft
---

## Overview

SMTP is the Application-layer protocol used to send email between mail servers, and from a client to its outgoing mail server. It only handles sending — reading mail from a mailbox is a separate concern, handled by IMAP or POP3.

## Key Concepts

- Runs over TCP, traditionally port 25 (server-to-server), with 587 (with STARTTLS) or 465 (implicit TLS) common for client submission
- Push protocol — a sender pushes a message to the next server in the delivery chain
- A message may hop through multiple SMTP servers (relays) before reaching the recipient's mailbox
- Only handles outgoing/relaying mail — retrieving mail uses IMAP (syncs state across devices) or POP3 (downloads and often deletes from server)
- Plain SMTP is unencrypted by default; STARTTLS upgrades a connection to encrypted mid-session

## Core Knowledge

Sending an email involves a chain of SMTP hops: the sender's client submits the message to its outgoing mail server, which then uses SMTP again to relay the message toward the recipient's mail server, which finally deposits it into the recipient's mailbox. Each hop is a separate SMTP conversation — commands like MAIL FROM, RCPT TO, and DATA establish the sender, recipient, and body.

SMTP alone doesn't let a user read their inbox — that's why an email client also speaks IMAP or POP3 on the receiving side. IMAP keeps the mailbox on the server and syncs read/unread state across multiple devices, which is why it's the modern default; POP3 traditionally downloads messages to one device and removes them from the server, fitting single-device setups. Because plain SMTP traffic (including credentials during authenticated submission) can be intercepted, STARTTLS is used to upgrade the connection to TLS before sensitive data is sent.

## Interview Questions

**Q: What does SMTP do, and what does it not do?**
A: SMTP sends and relays outgoing email between servers; it does not handle a user reading mail from their inbox — that's IMAP or POP3's job.

**Q: Why might an email pass through several SMTP servers before reaching its recipient?**
A: Each server relays the message closer to its destination — from the sender's outgoing server, through intermediate relays, to the recipient's mail server — with a separate SMTP exchange at each hop.

**Q: What's the difference between IMAP and POP3?**
A: IMAP keeps mail on the server and syncs state across devices; POP3 downloads mail to one device and typically removes it from the server.

## Scenario

A user sends an email from their phone. Their mail client submits it via SMTP to their provider's outgoing server, which relays it via SMTP to the recipient's mail server. When the recipient opens their inbox on a laptop and a phone simultaneously, both stay in sync — because their client reads the mailbox via IMAP, not SMTP.

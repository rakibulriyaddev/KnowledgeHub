---
id: smtp
title: "SMTP (Simple Mail Transfer Protocol)"
created: 2026-07-11
modified: 2026-07-22
tags: [protocols, application-layer, email]
parent: networking
children: []
status: draft
---

## Overview

SMTP is the Application-layer protocol used to send email between mail servers, and from a mail app to its outgoing mail server. It only handles sending — reading mail from a mailbox is a different job, done by IMAP or POP3.

## Key Concepts

- Runs over TCP, usually on port 25 (server-to-server), with 587 (using STARTTLS) or 465 (using TLS from the start) common for sending from a mail app
- Push protocol — a sender pushes a message forward to the next server in the chain
- A message may pass through several SMTP servers (relays) before it reaches the recipient's mailbox
- Only handles sending/relaying mail — reading mail uses IMAP (keeps things in sync across devices) or POP3 (downloads mail and often deletes it from the server)
- Plain SMTP is not encrypted by default; STARTTLS turns on encryption partway through the connection

## Core Knowledge

Sending an email means a chain of SMTP hops: the sender's mail app sends the message to its outgoing mail server, which then uses SMTP again to pass the message toward the recipient's mail server, which finally puts it into the recipient's mailbox. Each hop is its own SMTP exchange — commands like MAIL FROM, RCPT TO, and DATA set the sender, the recipient, and the message body.

SMTP alone doesn't let a user read their inbox — that's why a mail app also uses IMAP or POP3 on the receiving side. IMAP keeps the mailbox on the server and keeps read/unread status the same across many devices, which is why it's the common choice today; POP3 usually downloads messages to one device and removes them from the server, which fits a single-device setup. Because plain SMTP traffic (including login details when sending needs a login) can be read by others, STARTTLS is used to turn on TLS before any sensitive data is sent.

## Interview Questions

**Q: What does SMTP do, and what does it not do?**
A: SMTP sends and passes along outgoing email between servers; it does not let a user read mail from their inbox — that's the job of IMAP or POP3.

**Q: Why might an email pass through several SMTP servers before reaching its recipient?**
A: Each server passes the message closer to where it's going — from the sender's outgoing server, through servers in between, to the recipient's mail server — with its own SMTP exchange at each step.

**Q: What's the difference between IMAP and POP3?**
A: IMAP keeps mail on the server and keeps things the same across devices; POP3 downloads mail to one device and usually removes it from the server.

## Scenario

A user sends an email from their phone. Their mail app sends it using SMTP to their provider's outgoing server, which passes it using SMTP to the recipient's mail server. When the recipient opens their inbox on a laptop and a phone at the same time, both stay in sync — because their mail app reads the mailbox using IMAP, not SMTP.

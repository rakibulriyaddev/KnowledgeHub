---
id: osi
title: "OSI Model"
created: 2026-07-11
modified: 2026-07-11
tags: [networking-fundamentals, protocols, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

The OSI Model is a conceptual 7-layer framework, created by ISO in 1984, that breaks network communication into isolated stages from physical signal transmission up to the application the user interacts with. It matters because it standardizes how engineers reason about, debug, and design networked systems, even though the real internet runs on the simpler 4-layer TCP/IP model.

## Key Concepts

- 7 layers top to bottom: Application, Presentation, Session, Transport, Network, Data Link, Physical ("All People Seem To Need Data Processing")
- Each layer has its own protocols and responsibilities, and relies on the layer below it
- Encapsulation (sending) adds a header per layer; decapsulation (receiving) reverses it
- Layer 3 (IP, routers) handles routing; Layer 4 (TCP/UDP) handles end-to-end delivery; Layer 7 (HTTP) is where applications operate
- OSI is conceptual; the real internet uses the 4-layer TCP/IP model (Application, Transport, Internet, Network Access)
- Load balancer and firewall design (Layer 4 vs Layer 7) both depend on understanding these layers

## Core Knowledge

Each OSI layer has a distinct job. Application (Layer 7) is where user-facing protocols like HTTP, FTP, SMTP, and DNS operate. Presentation (Layer 6) handles data formatting, encryption, and compression — SSL/TLS and image/encoding conversions live here. Session (Layer 5) manages starting, maintaining, and ending a connection between two devices. Transport (Layer 4) splits data into segments and ensures end-to-end delivery via TCP (reliable) or UDP (fast), using port numbers and flow/congestion control. Network (Layer 3) handles packet routing via IP, using routers to decide the path data takes. Data Link (Layer 2) manages direct communication between devices on the same network using MAC addresses, via switches. Physical (Layer 1) is the lowest layer — transmitting raw 0s and 1s over cables, radio, or fiber, via hubs, repeaters, and NICs.

When you load a webpage, data flows down through all seven layers on the sending side (encapsulation, each layer adding its own header) and back up through all seven on the receiving side (decapsulation) — HTTP request formed, SSL-encrypted, segmented into TCP with a port, wrapped in an IP packet with source/destination addresses, framed with MAC addresses, and finally sent as physical signal.

**Caution:** OSI is a teaching and design model, not what literally runs the internet — production networking uses the simplified TCP/IP 4-layer model (Application, Transport, Internet, Network Access), which collapses OSI's top three layers into one and its bottom two into one.

Understanding OSI layers pays off practically: it clarifies the difference between a Layer 4 (fast, IP/port-based) and Layer 7 (smart, HTTP-aware) load balancer, explains how a firewall can filter at multiple layers simultaneously, and speeds up troubleshooting by letting you isolate which layer a problem lives in — e.g., no Wi-Fi signal is a Layer 1 issue, while a site that won't load despite a successful ping is likely a Layer 7 issue.

## Interview Questions

**Q: What's the mnemonic for remembering the OSI layers, and what does it map to?**
A: "All People Seem To Need Data Processing" maps top-to-bottom to Application, Presentation, Session, Transport, Network, Data Link, Physical.

**Q: A website won't load but ping succeeds. Which layer is likely at fault?**
A: Layer 7 (Application) — a successful ping confirms Layer 3 connectivity is fine, so the problem is likely with the web server or application-level protocol, not the network path.

**Q: How does OSI explain the Layer 4 vs Layer 7 load balancer distinction?**
A: A Layer 4 load balancer only sees IP and port information (Transport layer), making it fast but blind to content; a Layer 7 load balancer operates at the Application layer and can route based on URL, headers, or cookies.

## Scenario

A network engineer is troubleshooting an office where Wi-Fi shows no signal at all. Rather than digging into application logs, they start at Layer 1 (Physical) — checking cabling, signal strength, and hardware — because a total lack of connectivity almost always points to the lowest layer first.

---
id: osi
title: "OSI Model"
created: 2026-07-11
modified: 2026-07-22
tags: [networking-fundamentals, protocols, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

The OSI Model is a 7-layer framework, made by ISO in 1984, that breaks network communication into separate steps, from sending raw signals up to the app the user sees. It matters because it gives engineers a shared way to think about, fix, and design networked systems, even though the real internet actually runs on the simpler 4-layer TCP/IP model.

## Key Concepts

- 7 layers top to bottom: Application, Presentation, Session, Transport, Network, Data Link, Physical ("All People Seem To Need Data Processing")
- Each layer has its own rules and jobs, and depends on the layer below it
- Sending adds a header at each layer (encapsulation); receiving removes them in reverse (decapsulation)
- Layer 3 (IP, routers) handles routing; Layer 4 (TCP/UDP) handles end-to-end delivery; Layer 7 (HTTP) is where apps work
- OSI is just a model; the real internet uses the 4-layer TCP/IP model (Application, Transport, Internet, Network Access)
- Load balancer and firewall design (Layer 4 vs Layer 7) both depend on knowing these layers

## Core Knowledge

Each OSI layer has its own job. Application (Layer 7) is where user-facing rules like HTTP, FTP, SMTP, and DNS work. Presentation (Layer 6) handles formatting, encryption, and compression — SSL/TLS and encoding changes happen here. Session (Layer 5) starts, keeps, and ends a connection between two devices. Transport (Layer 4) splits data into pieces and makes sure it gets there end-to-end, using TCP (reliable) or UDP (fast), plus port numbers and traffic control. Network (Layer 3) handles routing packets using IP, with routers deciding the path data takes. Data Link (Layer 2) handles direct talk between devices on the same network using MAC addresses, through switches. Physical (Layer 1) is the lowest layer — sending raw 0s and 1s over cables, radio, or fiber, through hubs, repeaters, and network cards.

When you load a webpage, data goes down through all seven layers on the sending side (each layer adding its own header) and back up through all seven on the receiving side (removing them) — an HTTP request is made, locked with SSL, cut into TCP pieces with a port, wrapped in an IP packet with source/destination addresses, framed with MAC addresses, and finally sent as a physical signal.

**Caution:** OSI is a teaching and design model, not what actually runs the internet — real networking uses the simpler TCP/IP 4-layer model (Application, Transport, Internet, Network Access), which folds OSI's top three layers into one and its bottom two into one.

Knowing the OSI layers pays off in real work: it makes clear the difference between a Layer 4 (fast, IP/port-based) and Layer 7 (smart, HTTP-aware) load balancer, explains how a firewall can filter at more than one layer at once, and speeds up fixing problems by helping you point to which layer a problem sits in — for example, no Wi-Fi signal is a Layer 1 problem, while a site that won't load even though ping works is likely a Layer 7 problem.

## Interview Questions

**Q: What's the memory trick for the OSI layers, and what does it map to?**
A: "All People Seem To Need Data Processing" maps top-to-bottom to Application, Presentation, Session, Transport, Network, Data Link, Physical.

**Q: A website won't load but ping works. Which layer is likely at fault?**
A: Layer 7 (Application) — a working ping shows Layer 3 connection is fine, so the problem is likely the web server or app-level rule, not the network path.

**Q: How does OSI explain the Layer 4 vs Layer 7 load balancer difference?**
A: A Layer 4 load balancer only sees IP and port info (Transport layer), so it's fast but can't see content; a Layer 7 load balancer works at the Application layer and can route by URL, headers, or cookies.

## Scenario

A network engineer is fixing an office where Wi-Fi shows no signal at all. Instead of digging into app logs, they start at Layer 1 (Physical) — checking cables, signal strength, and hardware — because a total loss of connection almost always points to the lowest layer first.

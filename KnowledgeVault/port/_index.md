---
id: port
title: "Port"
created: 2026-07-15
modified: 2026-07-22
tags: [infrastructure, networking, tcp-ip]
parent: networking
children: []
status: draft
---

## Overview

A port is a number from 0 to 65535 that lets one IP address run many separate network services at once, by letting the transport layer (TCP/UDP) send incoming traffic to the right app. Without ports, an IP address could only ever run one network service at a time.

## Key Concepts

- Well-known ports (0–1023) — set aside for standard services (80 HTTP, 443 HTTPS, 22 SSH, 53 DNS)
- Registered ports (1024–49151) — given to specific apps (3306 MySQL, 5432 Postgres)
- Ephemeral/dynamic ports (49152–65535) — short-lived, picked by the OS for the client side of a connection
- A socket = IP address + port + protocol — the real reachable endpoint
- Port binding — a process claims a port; only one process can hold a given port/protocol at a time

## Core Knowledge

Every TCP/UDP connection is uniquely marked by a set of four values (source IP, source port, destination IP, destination port) — this is what lets a server tell apart thousands of connections all hitting the same destination port at once.
The OS blocks ports below 1024 for admin-level processes on most Unix systems — a common reason a dev server uses 8080 instead of 80 while testing locally.
"Address already in use" errors mean another process already holds that port — the fix is to stop the old process or pick a different port, not to keep retrying blindly.
Firewalls and security groups filter by port, which is why showing a service means opening its port on purpose — closing unused ports shrinks the attack surface a lot.
Port scanning (nmap and similar tools) checks which ports are open on a target, which is why unused ports should stay closed/filtered rather than just left with no login required.
NAT and port forwarding remap ports between a private network and the internet, letting many inside devices share one public IP with no clashes.
**Caution:** a port number alone says nothing about what protocol is running on it — assuming "port 443 must be HTTPS" breaks down once a service runs on a non-standard port to hide itself or share one port for many uses.

## Interview Questions

**Q: What uniquely marks a single network connection?**
A: The set of four values — source IP, source port, destination IP, and destination port — this is what lets a server track many connections at once from different clients on the same port.

**Q: Why do dev servers often use port 8080 instead of 80?**
A: Ports below 1024 need higher/admin rights on most operating systems; 8080 skips that requirement during local testing.

**Q: What causes an "address already in use" error?**
A: Another process already holds that port/protocol pair — only one process can hold a given port at a time.

**Q: What's the real difference between well-known and ephemeral ports?**
A: Well-known ports (0–1023) are set aside for standard services a client connects to; ephemeral ports are picked for a short time by the OS for the client side of an outgoing connection, and freed once it closes.

## Scenario

A developer starts two local API servers and the second one crashes right away with "EADDRINUSE." Checking `lsof -i :3000` shows the first server never freed the port — stopping that process (or moving the second server to 3001) fixes the clash.

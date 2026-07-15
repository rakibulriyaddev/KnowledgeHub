---
id: port
title: "Port"
created: 2026-07-15
modified: 2026-07-15
tags: [infrastructure, networking, tcp-ip]
parent: networking
children: []
status: draft
---

## Overview

A port is a 16-bit number (0–65535) that lets a single IP address host many independent network services, letting the transport layer (TCP/UDP) demultiplex incoming traffic to the correct application. Without ports, an IP address could only ever run one network service at a time.

## Key Concepts

- Well-known ports (0–1023) — reserved for standard services (80 HTTP, 443 HTTPS, 22 SSH, 53 DNS)
- Registered ports (1024–49151) — assignable to specific applications (3306 MySQL, 5432 Postgres)
- Ephemeral/dynamic ports (49152–65535) — temporary, OS-assigned to the client side of a connection
- A socket = IP address + port + protocol — the actual addressable endpoint
- Port binding — a process claims a port; only one process can bind a given port/protocol at a time

## Core Knowledge

Every TCP/UDP connection is uniquely identified by a 4-tuple (source IP, source port, dest IP, dest port) — this is what lets a server distinguish thousands of simultaneous client connections all hitting the same destination port.
The OS reserves ports below 1024 for root/admin-privileged processes on most Unix systems — a common reason a dev server binds to 8080 instead of 80 during local development.
"Address already in use" errors mean another process already bound that port — the fix is killing the old process or picking a different port, not retrying blindly.
Firewalls and security groups filter by port, which is why exposing a service means explicitly opening its port — closing unused ports shrinks attack surface significantly.
Port scanning (nmap etc.) probes which ports are open on a target, which is why unused ports should stay closed/filtered rather than just unauthenticated.
NAT and port forwarding remap ports between a private network and the internet, letting many internal devices share one public IP without collisions.
**Caution:** a port number alone says nothing about the protocol running on it — assuming "port 443 must be HTTPS" breaks down once a service runs behind a non-standard port for obfuscation or multiplexing.

## Interview Questions

**Q: What uniquely identifies a single network connection?**
A: The 4-tuple of source IP, source port, destination IP, and destination port — this is what lets a server track many simultaneous connections from different clients on the same port.

**Q: Why do dev servers often use port 8080 instead of 80?**
A: Ports below 1024 require elevated/root privileges on most operating systems; 8080 avoids that requirement during local development.

**Q: What causes an "address already in use" error?**
A: Another process has already bound that port/protocol combination — only one process can hold a given port at a time.

**Q: What's the practical difference between well-known and ephemeral ports?**
A: Well-known ports (0–1023) are reserved for standard services a client connects to; ephemeral ports are temporarily assigned by the OS to the client side of an outgoing connection and released after it closes.

## Scenario

A developer starts two local API servers and the second one crashes immediately with "EADDRINUSE." Checking `lsof -i :3000` reveals the first server never released the port — killing that process (or moving the second server to 3001) resolves the conflict.

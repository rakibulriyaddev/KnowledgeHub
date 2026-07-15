---
id: port-forwarding
title: "Port Forwarding"
created: 2026-07-15
modified: 2026-07-15
tags: [infrastructure, networking, nat]
parent: networking
children: []
status: draft
---

## Overview

Port forwarding maps an incoming connection on one address/port to a different address/port, most commonly punching through NAT so traffic from the public internet reaches a specific device on a private network. It's the mechanism that lets a single public IP expose multiple internal services.

## Key Concepts

- NAT traversal — routers rewrite a public IP:port to a private IP:port
- Static/local port forwarding — expose one internal port externally (router config, SSH `-L`)
- Remote/reverse port forwarding — expose an internal service via a remote host (SSH `-R`)
- Dynamic port forwarding — SOCKS proxy tunneling through a single forwarded port (SSH `-D`)
- UPnP/NAT-PMP — protocols letting applications request port mappings automatically

## Core Knowledge

Without port forwarding, devices behind NAT (nearly every home/office network) are unreachable from outside — the router has no rule mapping an external port to an internal IP:port, so inbound connections are dropped by default.
Static port forwarding is a persistent router rule (e.g., external `8080` → internal `192.168.1.10:80`); it's simple but exposes a fixed target continuously, which is a security liability if the internal service isn't hardened.
SSH tunnels implement the same concept in software: local forwarding (`-L`) exposes a remote service on your local machine, remote forwarding (`-R`) exposes your local service on a remote machine, dynamic forwarding (`-D`) turns SSH into a general SOCKS proxy.
UPnP lets applications (games, torrent clients) request port mappings automatically without manual router config — convenient but a known attack surface, since malicious local software can also request mappings.
Cloud environments largely replace ad-hoc port forwarding with security groups and load balancers, since cloud instances aren't behind consumer-style NAT the same way.
**Caution:** forwarding a port opens a direct path to an internal service — pair it with a firewall rule scoping source IPs, or prefer a VPN/reverse-tunnel for anything sensitive rather than leaving a raw port open to the internet.
A common failure mode: forwarding the wrong internal IP after a device's DHCP lease changes — worth pinning that device a static local IP.

## Interview Questions

**Q: Why is port forwarding needed for a device behind NAT?**
A: NAT hides private IPs behind one public IP; without an explicit forwarding rule, the router has no way to know which internal device an unsolicited inbound connection should reach, so it drops it by default.

**Q: What's the difference between SSH local and remote port forwarding?**
A: Local forwarding (`-L`) makes a remote service accessible on your local machine; remote forwarding (`-R`) makes your local service accessible from a remote machine — the tunnel direction is reversed.

**Q: Why is UPnP considered a security risk?**
A: It lets any application on the local network request port mappings automatically, which malicious software can also exploit to open unintended holes in the firewall without user awareness.

**Q: When would you use dynamic port forwarding instead of static?**
A: When you need general-purpose tunneling for many destinations through one SSH connection (a SOCKS proxy) rather than exposing one fixed service on one fixed port.

## Scenario

A developer wants to demo a locally-running web app to a remote teammate without deploying it anywhere. Running `ssh -R 80:localhost:3000 user@publichost` forwards the local port through the remote host, making the local app reachable at the public host's address — no router config or deployment needed.

---
id: port-forwarding
title: "Port Forwarding"
created: 2026-07-15
modified: 2026-07-22
tags: [infrastructure, networking, nat]
parent: networking
children: []
status: draft
---

## Overview

Port forwarding maps an incoming connection on one address/port to a different address/port. Most often it's used to punch through NAT, so traffic from the public internet can reach a specific device on a private network. It's the tool that lets one public IP show many internal services to the outside world.

## Key Concepts

- NAT traversal — routers change a public IP:port into a private IP:port
- Static/local port forwarding — show one internal port to the outside world (router setting, SSH `-L`)
- Remote/reverse port forwarding — show an internal service through a remote host (SSH `-R`)
- Dynamic port forwarding — a SOCKS proxy tunnel through one forwarded port (SSH `-D`)
- UPnP/NAT-PMP — rules that let apps ask for port mappings on their own

## Core Knowledge

Without port forwarding, devices behind NAT (almost every home/office network) can't be reached from outside — the router has no rule that maps an outside port to an inside IP:port, so incoming connections get dropped by default.
Static port forwarding is a lasting router rule (e.g., outside `8080` → inside `192.168.1.10:80`); it's simple but keeps a fixed target open all the time, which is a security risk if the inside service isn't locked down well.
SSH tunnels do the same thing in software: local forwarding (`-L`) shows a remote service on your own machine, remote forwarding (`-R`) shows your local service on a remote machine, dynamic forwarding (`-D`) turns SSH into a general SOCKS proxy.
UPnP lets apps (games, torrent clients) ask for port mappings on their own, with no manual router setup — handy, but a known weak spot, since bad local software can ask for mappings too.
Cloud setups mostly replace ad-hoc port forwarding with security groups and load balancers, since cloud machines aren't behind home-style NAT in the same way.
**Caution:** forwarding a port opens a direct path to an inside service — pair it with a firewall rule that limits source IPs, or use a VPN/reverse-tunnel instead for anything sensitive, rather than leaving a raw port open to the internet.
A common mistake: forwarding to the wrong inside IP after a device's DHCP lease changes — it helps to give that device a fixed local IP.

## Interview Questions

**Q: Why is port forwarding needed for a device behind NAT?**
A: NAT hides private IPs behind one public IP; with no clear forwarding rule, the router has no way to know which inside device an unasked-for incoming connection should reach, so it drops it by default.

**Q: What's the difference between SSH local and remote port forwarding?**
A: Local forwarding (`-L`) makes a remote service reachable on your own machine; remote forwarding (`-R`) makes your local service reachable from a remote machine — the direction is flipped.

**Q: Why is UPnP seen as a security risk?**
A: It lets any app on the local network ask for port mappings on its own, which bad software can also use to open holes in the firewall without the user knowing.

**Q: When would you use dynamic port forwarding instead of static?**
A: When you need general tunneling to many destinations through one SSH connection (a SOCKS proxy), instead of showing one fixed service on one fixed port.

## Scenario

A developer wants to show a teammate a web app running on their own machine, without putting it online anywhere. Running `ssh -R 80:localhost:3000 user@publichost` sends the local port through the remote host, making the local app reachable at the public host's address — no router setup or deployment needed.

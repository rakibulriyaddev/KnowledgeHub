---
id: ip
title: "IP - Internet Protocol"
created: 2026-07-11
modified: 2026-07-11
tags: [addressing, internet, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

An IP address is the unique number that identifies every device on the internet or a local network, playing the same role a postal address plays for a letter. Without it, data packets would have no way to find their correct destination among billions of connected devices.

## Key Concepts

- IPv4 (32-bit, ~4.3 billion addresses) vs IPv6 (128-bit, ~340 undecillion addresses)
- Public IP (internet-visible) vs Private IP (local-network only)
- Static IP (never changes) vs Dynamic IP (assigned by DHCP, changes over time)
- NAT (Network Address Translation) lets many private-IP devices share one public IP
- IP operates at OSI Layer 3 (Network); routers forward packets based on it
- Loopback address 127.0.0.1 refers to the local machine itself

## Core Knowledge

IPv4 uses a 32-bit address split into four 0-255 segments (e.g. `102.22.192.181`), which caps the address space at about 4.3 billion — no longer enough given mobile, IoT, and smart devices. IPv6, introduced in 1998, uses a 128-bit hexadecimal format (e.g. `2001:0db8:85a3:...`) providing around 340 undecillion addresses, practically unlimited, though adoption has been slow because upgrading legacy infrastructure is costly — more than half of internet traffic still runs on IPv4 decades later. Many systems now run dual-stack, supporting both simultaneously.

IP addresses split into four practical categories. Public IP is assigned by an ISP and is visible from the whole internet — a home network typically has just one. Private IP (e.g. `192.168.1.5`) is used only inside a local network and isn't directly reachable from outside. Static IP never changes and suits servers or remote-access devices where a stable, known address matters; Dynamic IP is assigned by DHCP and changes over time, which is cheaper and standard for typical home or mobile connections.

NAT (Network Address Translation) is what makes private IPs practical: a router translates many devices' private IPs into a single shared public IP so they can all reach the internet without each needing its own public address — critical given how limited and costly IPv4 addresses are.

**Caution:** a bare IP address doesn't enable hacking by itself — attackers need an actual vulnerability, and your public IP is already visible to any site you visit anyway. IP matters for other legitimate design purposes: rate limiting by IP, geo-IP routing (the basis of CDN edge selection), and blocking/whitelisting.

## Interview Questions

**Q: Why was IPv6 needed if IPv4 already provides billions of addresses?**
A: IPv4's ~4.3 billion addresses are insufficient given the explosion of mobile devices, IoT, and smart devices; IPv6's 128-bit space provides a practically unlimited number of addresses.

**Q: How can five devices at home share one public IP?**
A: The router uses NAT to translate each device's private IP into the same shared public IP for outbound traffic, and routes responses back to the correct private IP internally.

**Q: What's the difference between Static and Dynamic IP, and when would you choose each?**
A: Static IP never changes and is used for servers, VPNs, or anything requiring a stable known address; Dynamic IP is assigned by DHCP, changes over time, and is cheaper — standard for regular home or mobile connections.

## Scenario

A company wants to host a production web server that must always resolve to the same address for DNS to work reliably. They provision a Static Public IP for the server rather than a Dynamic IP, ensuring the DNS-to-IP mapping never silently breaks after a lease renewal.

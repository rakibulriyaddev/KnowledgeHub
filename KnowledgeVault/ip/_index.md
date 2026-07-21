---
id: ip
title: "IP - Internet Protocol"
created: 2026-07-11
modified: 2026-07-22
tags: [addressing, internet, infrastructure]
parent: networking
children: []
status: draft
---

## Overview

An IP address is the unique number that marks every device on the internet or a local network, playing the same role a home address plays for a letter. Without it, data packets would have no way to find the right destination among billions of connected devices.

## Key Concepts

- IPv4 (32-bit, ~4.3 billion addresses) vs IPv6 (128-bit, ~340 undecillion addresses)
- Public IP (seen from the internet) vs Private IP (seen only on the local network)
- Static IP (never changes) vs Dynamic IP (given by DHCP, changes over time)
- NAT (Network Address Translation) lets many private-IP devices share one public IP
- IP works at OSI Layer 3 (Network); routers send packets forward based on it
- Loopback address 127.0.0.1 points to the local machine itself

## Core Knowledge

IPv4 uses a 32-bit address split into four numbers from 0-255 (example, `102.22.192.181`), which caps the address space at about 4.3 billion — no longer enough given mobile, IoT, and smart devices. IPv6, brought in in 1998, uses a 128-bit format written in hex (example, `2001:0db8:85a3:...`) giving around 340 undecillion addresses, practically endless, though take-up has been slow since upgrading old infrastructure costs a lot — more than half of internet traffic still runs on IPv4 decades later. Many systems now run both at once.

IP addresses fall into four practical groups. Public IP is given by an ISP and can be seen from the whole internet — a home network usually has just one. Private IP (example, `192.168.1.5`) is used only inside a local network and can't be reached directly from outside. Static IP never changes and suits servers or remote-access devices where a fixed, known address matters; Dynamic IP is given by DHCP and changes over time, which is cheaper and standard for typical home or mobile connections.

NAT (Network Address Translation) is what makes private IPs work: a router turns many devices' private IPs into one shared public IP so they can all reach the internet without each needing its own public address — key given how limited and costly IPv4 addresses are.

**Caution:** a bare IP address alone doesn't let someone hack you — attackers need an actual weak point, and your public IP is already visible to any site you visit anyway. IP matters for other real design uses: limiting requests by IP, routing by rough location (the basis of CDN edge picking), and blocking/allowing lists.

## Interview Questions

**Q: Why was IPv6 needed if IPv4 already gives billions of addresses?**
A: IPv4's ~4.3 billion addresses aren't enough given the huge growth of mobile devices, IoT, and smart devices; IPv6's 128-bit space gives a practically endless number of addresses.

**Q: How can five devices at home share one public IP?**
A: The router uses NAT to turn each device's private IP into the same shared public IP for outgoing traffic, and sends replies back to the right private IP inside.

**Q: What's the difference between Static and Dynamic IP, and when would you pick each?**
A: Static IP never changes and is used for servers, VPNs, or anything needing a fixed known address; Dynamic IP is given by DHCP, changes over time, and is cheaper — standard for regular home or mobile connections.

## Scenario

A company wants to host a live web server that must always point to the same address for DNS to work reliably. They set up a Static Public IP for the server instead of a Dynamic IP, making sure the DNS-to-IP link never quietly breaks after a lease renews.

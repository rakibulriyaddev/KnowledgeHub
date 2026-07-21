---
id: firewall
title: "Firewall"
created: 2026-07-15
modified: 2026-07-22
tags: [infrastructure, security, networking]
parent: networking
children: []
status: draft
---

## Overview

A firewall checks and filters traffic that crosses a network boundary, allowing or blocking packets and connections based on a set of rules. It is the basic perimeter control every networked system sits behind, deciding what is even allowed to reach a server before any application code runs.

## Key Concepts

- Packet-filtering (L3/L4) — allow/deny by IP, port, protocol; stateless or stateful
- Application-layer (L7) / WAF — checks HTTP content for attack patterns (SQLi, XSS)
- Network firewall (perimeter/VPC-level) vs host-based firewall (per-machine, e.g. iptables, `ufw`)
- Security groups / NACLs — cloud-native firewall constructs (AWS, Azure, GCP)
- Default-deny posture — block everything, explicitly allow only what's needed

## Core Knowledge

Stateful firewalls track the state of a connection (established, related), so return traffic for an allowed outbound request is let through automatically. Stateless firewalls must explicitly allow both directions, which is easier to get wrong.
A firewall rule set should default-deny inbound traffic, and only open the exact ports and sources that are really needed. The most common real-world mistake is an allow rule that is too broad (for example, `0.0.0.0/0` on a database port).
Network-layer firewalls (L3/L4) filter by IP, port, and protocol, and cannot see the payload content. A Web Application Firewall (WAF) works at L7 and checks HTTP requests for known attack patterns, often placed at the reverse proxy or CDN layer.
Cloud environments split this into security groups (stateful, attached to instances) and NACLs (stateless, attached to subnets) — security groups are the everyday tool, and NACLs act as a rougher backup layer.
A firewall protects against unwanted access and network-layer attacks, but does nothing against bugs at the application layer (like SQL injection in a query it never looks at), unless it is paired with a WAF.
**Caution:** a firewall is a perimeter control, not a replacement for defense in depth — internal services should still check each other's identity and permissions (zero-trust), instead of trusting anything just because it is "inside" the firewall.
Host-based firewalls (iptables, `ufw`, Windows Firewall) add a second layer on each machine, useful even inside a network segment that is already firewalled.

## Interview Questions

**Q: What's the difference between a stateful and stateless firewall?**
A: A stateful firewall tracks connection state and automatically allows return traffic for outbound requests it permitted. A stateless firewall checks every packet on its own and needs explicit rules for both directions.

**Q: How does a WAF differ from a traditional network firewall?**
A: A network firewall filters by IP, port, and protocol at L3/L4, without seeing the payload. A WAF works at L7, checking HTTP request content for attack patterns like SQL injection or XSS.

**Q: What's the difference between AWS security groups and NACLs?**
A: Security groups are stateful and attached to instances — the main access-control tool. NACLs are stateless, attached to subnets, and act as a rougher, secondary layer.

**Q: Why is "default-deny" the recommended firewall posture?**
A: It keeps the attack surface small by only exposing what is explicitly needed, instead of relying on remembering to block everything dangerous. In a default-allow setup, a single missed deny rule can expose a service.

## Scenario

A team spins up a new database instance and, for convenience, opens its port to all inbound traffic while debugging. Within hours, automated scanners find it and break in. A firewall rule limited to just the application servers' IPs (default-deny for everything else) would have stopped this exposure completely.

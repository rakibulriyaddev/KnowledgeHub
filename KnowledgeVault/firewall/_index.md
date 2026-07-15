---
id: firewall
title: "Firewall"
created: 2026-07-15
modified: 2026-07-15
tags: [infrastructure, security, networking]
parent: networking
children: []
status: draft
---

## Overview

A firewall inspects and filters traffic crossing a network boundary, allowing or blocking packets/connections based on a rule set. It's the baseline perimeter control every networked system sits behind, deciding what's even allowed to reach a server before any application logic runs.

## Key Concepts

- Packet-filtering (L3/L4) — allow/deny by IP, port, protocol; stateless or stateful
- Application-layer (L7) / WAF — inspects HTTP payloads for attack patterns (SQLi, XSS)
- Network firewall (perimeter/VPC-level) vs host-based firewall (per-machine, e.g. iptables, `ufw`)
- Security groups / NACLs — cloud-native firewall constructs (AWS, Azure, GCP)
- Default-deny posture — block everything, explicitly allow only what's needed

## Core Knowledge

Stateful firewalls track connection state (established, related) so return traffic for an allowed outbound request is auto-permitted — stateless ones must explicitly allow both directions, which is more error-prone.
A firewall rule set should default-deny inbound and only open the specific ports/sources actually required — the most common real-world misconfiguration is an overly broad allow rule (e.g. `0.0.0.0/0` on a database port).
Network-layer firewalls (L3/L4) filter by IP/port/protocol and can't see payload content; a Web Application Firewall (WAF) operates at L7 and inspects HTTP requests for known attack signatures, often deployed at the reverse proxy/CDN layer.
Cloud environments split this into security groups (stateful, attached to instances) and NACLs (stateless, attached to subnets) — security groups are the day-to-day tool, NACLs are a coarser backstop.
A firewall protects against unauthorized access and network-layer attacks but does nothing against application-layer bugs (e.g. SQL injection in a query it's never inspected) unless paired with a WAF.
**Caution:** firewalls are a perimeter control, not a substitute for defense in depth — internal services should still authenticate/authorize each other (zero-trust) rather than trusting anything "inside" the firewall.
Host-based firewalls (iptables, `ufw`, Windows Firewall) add a second layer per machine, useful even inside an already-firewalled network segment.

## Interview Questions

**Q: What's the difference between a stateful and stateless firewall?**
A: A stateful firewall tracks connection state and auto-allows return traffic for permitted outbound requests; a stateless firewall evaluates every packet independently and needs explicit rules for both directions.

**Q: How does a WAF differ from a traditional network firewall?**
A: A network firewall filters by IP/port/protocol at L3/L4 without seeing payload; a WAF operates at L7, inspecting HTTP request content for attack patterns like SQL injection or XSS.

**Q: What's the difference between AWS security groups and NACLs?**
A: Security groups are stateful and attached to instances (the primary access-control tool); NACLs are stateless, attached to subnets, and act as a coarser secondary layer.

**Q: Why is "default-deny" the recommended firewall posture?**
A: It minimizes attack surface by only exposing what's explicitly needed, rather than relying on remembering to block everything dangerous — a single missed deny rule in a default-allow setup can expose a service.

## Scenario

A team spins up a new database instance and, for convenience, opens its port to all inbound traffic while debugging. Within hours it's found by automated scanners and compromised — a firewall rule scoped to only the application servers' IPs (default-deny elsewhere) would have prevented the exposure entirely.

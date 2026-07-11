---
title: "Domain Name System (DNS) — Q&A"
---

**Q: What does DNS stand for?**
A: Domain Name System — DNS = Domain Name System.

**Q: What is DNS's main job?**
A: Translating a domain name into an IP — DNS finds the IP address (142.250.190.46) from a domain name (google.com).

**Q: Which protocol does a DNS query usually use?**
A: UDP — DNS usually uses UDP port 53 - for speed.

**Q: Which record provides an IPv4 address?**
A: A — The A Record provides IPv4; the AAAA record provides IPv6.

**Q: What does an AAAA Record provide?**
A: IPv6 — The AAAA (four A's) Record provides an IPv6 address.

**Q: Which record points to the mail server?**
A: MX — The MX (Mail Exchange) Record gives information about the email server.

**Q: What does a CNAME Record do?**
A: Makes one domain an alias of another — CNAME creates an alias. For example, www.example.com -> example.com.

**Q: How many logical root DNS server clusters exist in the world?**
A: 13 — There are 13 root server clusters (a through m). Behind each one there are many physical servers.

**Q: The DNS resolution order is: Browser -> OS -> Resolver -> Root -> TLD -> Authoritative.**
A: True — This is indeed the correct DNS resolution flow.

**Q: What does TTL mean?**
A: Time To Live — TTL = Time To Live - how long a record stays in cache.

**Q: Which is Google's Public DNS?**
A: 8.8.8.8 — Google Public DNS: 8.8.8.8 and 8.8.4.4.

**Q: Which is Cloudflare's Public DNS?**
A: 1.1.1.1 — Cloudflare's DNS: 1.1.1.1. Focused on privacy.

**Q: A DNS change reaches everyone instantly.**
A: False — DNS propagation can take 24-48 hours because of TTL.

**Q: What is DNS Spoofing?**
A: A hacker giving a fake DNS answer to send the user to the wrong site — In DNS Spoofing/Cache Poisoning, a fake record is given to send the user to a fake site.

**Q: What does DNSSEC do?**
A: Adds a digital signature to DNS answers — DNSSEC verifies the authenticity of DNS answers using a digital signature.

**Q: You've changed a domain's IP but users are still going to the old IP. Why?**
A: The old IP is still in cache until the TTL expires — The resolver, OS, and browser caches keep the old IP until the TTL expires.

**Q: Which is an example of a TLD?**
A: .com — TLD = Top Level Domain - such as .com, .org, .bd, .net.

**Q: A Recursive Resolver is usually provided by the ISP.**
A: True — An ISP's DNS resolver is the most common. However, public resolvers from Google or Cloudflare can also be used.

**Q: How does a CDN use DNS?**
A: It provides the IP of the edge server nearest the user — A CDN's authoritative DNS looks at the user's location and provides the IP of the nearest edge server.

**Q: What is DoH?**
A: DNS over HTTPS — DoH = DNS over HTTPS - encrypts DNS queries for privacy.

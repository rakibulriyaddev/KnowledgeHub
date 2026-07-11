---
title: "Domain Name System (DNS) — Deep Dive"
---

![DNS resolution process](/vault/dns/DNS_resolution_process_diagram.jpeg)

You type `google.com` into your browser and Google's page opens right up. But the internet doesn't understand names - it only understands IP addresses! So how do you get the correct IP from `google.com`?

The answer is - **DNS**.

## What is DNS?

**DNS** means *Domain Name System*. It's a decentralized system on the internet that translates domain names (like google.com) into IP addresses (like 142.250.190.46).

**Note:** DNS is like the internet's phone book. You remember your friend's name, not their phone number. The phone book finds the number using the name. DNS works the same way.

## How does DNS work - step by step

You typed `google.com` in your browser. Let's see what happens:

1. **Browser cache:** The browser first checks its own cache to see if it has the IP for this name.
2. **OS cache:** If not found, it checks the operating system's cache.
3. **Recursive resolver:** It asks the ISP's DNS resolver.
4. **Root server:** The resolver asks a root server - "Where is `.com`?"
5. **TLD server:** The root gives the address of the .com TLD server.
6. **Authoritative server:** The .com TLD says "the authoritative server for `google.com` is at this address".
7. **Getting the IP:** The authoritative server gives the correct IP for google.com.
8. **Cache:** The answer gets cached at the resolver, OS, and browser (based on TTL).

## Types of DNS servers

### 1. Recursive Resolver
Fetches the answer from other servers on behalf of the client. This is usually done by the ISP or a public DNS (Google 8.8.8.8, Cloudflare 1.1.1.1).

### 2. Root Name Server
The top of the DNS hierarchy. There are a total of **13** logical root server clusters in the world (a.root-servers.net through m.root-servers.net). They hold information about TLD servers.

### 3. TLD Server
Top-Level Domain - such as .com, .org, .net, .bd. Each TLD has its own server that holds the authoritative server information for domains under that extension.

### 4. Authoritative Name Server
Holds the correct IP records for a specific domain. For example, google.com's authoritative server knows the IPs of www.google.com, mail.google.com.

## Important DNS record types

- **A Record:** Maps a domain name to an IPv4 address. The most commonly used.
- **AAAA Record:** Maps a domain name to an IPv6 address.
- **CNAME (Canonical Name):** Makes one domain an alias of another. For example, www.example.com -> example.com.
- **MX Record:** Points to the mail server. Which server email should go to.
- **NS Record:** Points to the authoritative name server.
- **TXT Record:** Can hold any text information (SPF, DKIM verification).
- **PTR Record:** Reverse DNS - finds the domain from an IP.
- **SOA Record:** Information about the zone's authority.

## DNS Caching and TTL

A DNS query doesn't go all the way up every time - caching makes it fast.

- **TTL (Time To Live):** Every DNS record has a TTL - how long it can be kept in cache.
- **Browser cache:** up to a few minutes.
- **OS cache:** a few hours.
- **ISP resolver cache:** based on TTL, usually a few hours to a few days.

**Note:** When you change a domain's IP, it takes some time to take effect everywhere - because of TTL. This is called *DNS propagation*.

## Real-world examples

- **Google Public DNS:** 8.8.8.8 and 8.8.4.4 - fast and free.
- **Cloudflare DNS:** 1.1.1.1 - focused on privacy.
- **OpenDNS:** Cisco's DNS - offers filtering.
- **CDN:** looks at Cloudflare DNS and routes you to the server nearest you.

## DNS security

- **DNS Spoofing:** a hacker sends a fake answer to send the user to the wrong site.
- **DNSSEC:** increases security by adding a digital signature to DNS answers.
- **DoH (DNS over HTTPS):** encrypts DNS queries.
- **DoT (DNS over TLS):** DNS encryption using TLS.

## Common misconceptions

1. **"DNS belongs only to the ISP":** No, anyone can run a DNS server.
2. **"DNS changes are instant":** No, propagation can take 24-48 hours.
3. **"localhost needs DNS too":** No, localhost (127.0.0.1) is hardcoded.

## The importance of DNS in system design

- **Geo-routing:** the same domain can give different IPs in different regions.
- **Load balancing:** round-robin DNS can provide multiple IPs.
- **Failover:** if one server goes down, redirect to another server via DNS.
- **CDN integration:** the CDN's nearest edge server is identified through DNS.

## Chapter Summary

- DNS translates domain names into IPs.
- The query flow goes Recursive resolver -> Root -> TLD -> Authoritative.
- A, AAAA, CNAME, MX, NS, TXT - important record types.
- TTL caching ensures fast responses.
- CDN, load balancing, and failover all rely on DNS.

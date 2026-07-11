---
title: "IP - Internet Protocol — Deep Dive"
---

![IP addressing](/vault/ip/ip.png)

Think about something interesting. You're sitting in Bangladesh and you search Google. How does your request reach exactly Google's server? Among billions of computers in the world, how does only your request go to the right place?

The answer is - **IP Address**.

## What is IP?

**IP** means *Internet Protocol*. And an **IP Address** is a unique number that helps identify every device separately on the internet or on a local network.

You can compare it to your home address. The postman can deliver your letter to the right place because you have a unique address. It's the same on the internet - every device has an IP Address, so that data can reach exactly the right place.

**Note:** Imagine you're sending a letter from Dhaka to Chattogram. Just as the letter carries the recipient's address and your address, an internet data packet also carries the destination IP and the source IP.

## Versions of IP: IPv4 and IPv6

### IPv4

The original internet protocol is IPv4. It uses a **32-bit** number split into four parts, each part ranging from 0 to 255.

```
Example:  102.22.192.181
         ↑    ↑    ↑    ↑
       0-255 0-255 0-255 0-255
```

With IPv4 you can create only **4.3 billion** unique addresses. That sounds like a lot, but the internet has expanded so fast - mobile, IoT, smart TVs - that it's not enough for that many devices.

### IPv6

IPv6 was introduced in 1998. It uses a **128-bit** hexadecimal format. As a result it can give around **340 undecillion** (340 x 10^36) addresses.

```
Example:  2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

That's so many that every grain of sand on earth could get its own IP.

**Note:** Even 25 years after IPv6 was introduced, more than half the world's internet traffic still runs on IPv4. The transition is slow because upgrading old systems is expensive.

## Types of IP

IP addresses can be classified in four ways:

### 1. Public IP
This is given to you by your ISP (Internet Service Provider). It's **visible from the whole internet**. Your entire home network has one Public IP.
**Example:** The IP that Banglalink or Robi gives your router.

### 2. Private IP
This is used inside your local network. Every device at home (mobile, laptop, smart TV) gets a Private IP from the router. It cannot be seen directly from the internet.
**Example:** 192.168.1.5 (for your mobile), 192.168.1.10 (for the laptop).

### 3. Static IP
This IP never changes. It's usually used for servers or important services like a company's website, remote access devices - these kinds of things. It's usually more expensive.

### 4. Dynamic IP
This IP changes over time. A DHCP (Dynamic Host Configuration Protocol) server assigns it. Most personal connections (home, mobile data) use Dynamic IP. It's cheaper and the IP can be reused.

**When to use Static IP?**
- To host a web server
- VPN or remote access
- Reliable geo-location services
- Any important service where the IP needs to be known

**When to use Dynamic IP?**
- Regular home broadband
- Mobile data
- Temporary needs
- When cost reduction is needed

## How does IP work?

When you type Facebook.com, these events happen:

1. Your browser asks **DNS**: "What's the IP of Facebook.com?"
2. DNS returns: "It's `157.240.7.35`".
3. Your request starts its journey toward that IP.
4. The internet's routers forward the packet until it reaches its destination.
5. Facebook's server sends a response, and it comes back to your IP.

## Real-world examples and uses

- **Blocking/whitelisting:** Some sites are blocked in Bangladesh - the government blocks them based on IP.
- **Geo-location:** Netflix looks at your IP to figure out which country you're in, and shows content for that country.
- **Cybersecurity:** If a hacker attacks, their IP can be identified from logs.
- **VPN:** A VPN hides your real IP and shows a different one instead.

## Common misconceptions

1. **"IP means hacking":** No. Nobody can hack you just with an IP. Hackers look for vulnerabilities.
2. **"It's dangerous if someone gets my IP":** That's overblown. Your Public IP is visible anyway - whenever you visit any website, they already know your IP.
3. **"IPv4 and IPv6 are the same":** No. Completely different formats and sizes. However, many systems today support both.

## The importance of IP in system design

As a system designer, here are the decisions you'll need to make about IP:

- **IPv6 support:** It's good to keep IPv6 support in new system designs.
- **IP-based rate limiting:** How many requests are acceptable from one IP?
- **Geo-IP routing:** Sending traffic to the nearest server based on the user's IP (the CDN concept).
- **NAT (Network Address Translation):** Many devices share one Public IP.

## Chapter Summary

- An IP Address is the unique identity of every device on the internet.
- IPv4 (32-bit) - limited, IPv6 (128-bit) - practically unlimited.
- Public IP is visible from the internet, Private IP is on the local network.
- Static IP never changes, Dynamic IP is changed by DHCP.
- IP matters in system design - for rate limiting, geo-routing, and security.

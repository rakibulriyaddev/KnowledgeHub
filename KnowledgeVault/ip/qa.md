---
title: "IP - Internet Protocol — Q&A"
---

**Q: What does IP stand for?**
A: Internet Protocol — IP means Internet Protocol. It's the rule for sending data on the internet.

**Q: How many bits does an IPv4 address use?**
A: 32 — IPv4 uses a 32-bit address split into 4 parts (0-255).

**Q: How many bits does an IPv6 address use?**
A: 128 — IPv6 uses a 128-bit address, which can support nearly unlimited devices.

**Q: Which of the following is a valid IPv4 address?**
A: 192.168.1.1 — Every part of an IPv4 address must be between 0-255, and there must be four parts.

**Q: IPv6 uses only numbers.**
A: False — IPv6 uses hexadecimal (0-9 and a-f).

**Q: What's the difference between Public IP and Private IP?**
A: Public IP is routable on the internet, Private IP is not — Public IP is accessible on the internet; Private IP only works on the local network and isn't routed on the internet.

**Q: Which of the following is a Private IP range?**
A: 192.168.1.1 — 192.168.0.0 - 192.168.255.255 is the most common Private IP range. 10.x.x.x and 172.16-31.x.x are also Private.

**Q: What's the advantage of a Static IP?**
A: The address always stays the same — A Static IP never changes, so it's ideal for servers and remote access.

**Q: What type of IP do most ISPs give to a customer's computer?**
A: Dynamic — To reduce cost and reuse the IP pool, ISPs give regular customers a Dynamic IP.

**Q: A device can have both IPv4 and IPv6 at the same time.**
A: True — This is called dual-stack. Modern operating systems support both.

**Q: What does NAT (Network Address Translation) mainly do?**
A: Translates a Private IP into a Public IP — NAT converts local devices' Private IPs into one Public IP so they can access the internet.

**Q: You've connected 5 devices at home (phone, laptop, smart TV, etc.) to the internet. How do they all access the internet using the same Public IP?**
A: The router uses NAT to share the same Public IP — The router uses NAT. Each device has a Private IP, but to the outside world, everyone communicates using the same Public IP.

**Q: Which is the loopback IP?**
A: 127.0.0.1 — 127.0.0.1 is the loopback address - it refers to your own computer. It's synonymous with localhost.

**Q: At which OSI layer does an IP address operate?**
A: Network — IP works at the Network layer (Layer 3). Its job is packet routing.

**Q: In an IPv6 address, :: (double colon) can be used to shorten consecutive zeros.**
A: True — For example, 2001:0db8:0000:0000:0000:0000:1428:57ab can be written as 2001:db8::1428:57ab.

**Q: What type of IP do CDNs (Cloudflare, Akamai) usually use for their servers?**
A: Static Public — CDNs use Static Public IP for their servers so that DNS resolution stays stable.

**Q: You want to deploy a web server. Which IP configuration is most suitable?**
A: Static Public IP — A server needs a Static Public IP - so that the DNS-to-IP mapping stays stable and users can always use the same address.

**Q: What kind of information does an IP address provide?**
A: The device's location and identity — IP mainly helps identify a device and determine where data needs to be sent.

**Q: The same Private IP cannot exist on two different networks at the same time.**
A: False — Private IPs can be reused on different local networks. There's no conflict since these aren't routed on the internet.

**Q: A company's office has 100 employees. Why isn't it practical to buy a separate Public IP from the ISP for each device?**
A: The number of IPv4 addresses is limited and expensive — IPv4 is limited and buying Public IPs is quite expensive. That's why Private IP + NAT is used so that countless devices can access the internet via the same Public IP.

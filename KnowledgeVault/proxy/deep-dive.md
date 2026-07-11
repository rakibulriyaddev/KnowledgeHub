---
title: "Proxy - The Intermediary Server — Deep Dive"
---

![Forward proxy flow](/vault/proxy/Forward_Proxy_flow_diagram.jpeg)
![Reverse proxy flow](/vault/proxy/Reverse_Proxy_flow_diagram.jpeg)

You're going to submit paperwork at a foreign embassy. Instead of going yourself - you go through an agent. The agent speaks on your behalf. That's exactly a **Forward Proxy**. Now at that same embassy - the receptionist talks to everyone first and decides which department to send them to inside. That's a **Reverse Proxy**.

## What is a Proxy?

A **Proxy** is an intermediary server that sits between the client and the destination server - forwarding requests and responses.

## Forward Proxy

A **Forward Proxy** works on behalf of the client. It hides the client.

### Uses
- **Privacy/Anonymity:** The server doesn't know the client's real IP.
- **Content filtering:** Facebook blocked at the office - filtered by a corporate proxy.
- **Geo-bypass:** Accessing content by appearing to be from another country.
- **Caching:** If everyone at the office uses Wikipedia - the proxy keeps one copy.
- **Logging:** Tracking where employees are browsing.

### Examples
- VPN - a type of forward proxy.
- School/office network filters.
- Squid - a popular open-source forward proxy.

## Reverse Proxy

A **Reverse Proxy** works on behalf of the server. It hides the server.

### Uses
- **Load balancing:** Distributing traffic across multiple backends.
- **SSL termination:** The reverse proxy handles SSL; the backend uses plain HTTP.
- **Caching:** Caching static assets (Varnish, NGINX).
- **Compression:** Gzip/Brotli at the proxy.
- **Security:** Hides the backend IP, absorbs DDoS, WAF.
- **API Gateway:** Routing in microservices.
- **A/B testing:** Sending 10% of users to a new version.

### Examples
- **NGINX:** The most popular reverse proxy.
- **HAProxy:** High-performance LB + proxy.
- **Apache Traffic Server**.
- **Cloudflare:** Global reverse proxy + CDN.
- **AWS ALB/CloudFront:** Managed reverse proxy.

## Forward vs Reverse Proxy

**Forward Proxy**
- Works on behalf of the client
- Hides the client
- Controls outbound traffic
- Use: VPN, content filter
- Server doesn't know who the real client is

**Reverse Proxy**
- Works on behalf of the server
- Hides the server
- Controls inbound traffic
- Use: LB, SSL, security
- Client doesn't know where the real server is

## Reverse Proxy vs Load Balancer

Almost every reverse proxy can also act as an LB. The difference:
- **Reverse Proxy:** Useful even with just one backend - caching, SSL, security.
- **Load Balancer:** Its main job is distributing traffic across multiple backends.
- Modern tools (NGINX) do both.

## Real-world examples

- **Cloudflare:** A global reverse proxy - sits in front of every Cloudflare-protected site.
- **NGINX in front of Node.js:** The Node app is behind it; NGINX handles SSL and static files.
- **VPN (NordVPN, ProtonVPN):** A forward proxy that hides the IP.
- **Facebook blocked on school wifi:** A forward proxy filter.

## Common misconceptions

1. **"Proxy and VPN are the same":** A VPN is a forward proxy + encryption + tunneling. A proxy just forwards.
2. **"Reverse proxy = load balancer":** No, an LB is a subset of reverse proxy features.
3. **"A proxy slows things down":** With caching and SSL termination, a proxy actually makes the system faster.

## Best Practices

- A reverse proxy is essential in modern systems - keep the backend separate from the public.
- Do SSL termination at the proxy - save backend resources.
- Enable health checks - skip failed backends.
- Logging is important - an audit trail for every request.
- Rate limiting at the proxy layer is very effective.

## Chapter Summary

- Proxy = an intermediary between client and server.
- Forward proxy acts for the client; Reverse proxy acts for the server.
- VPN is a forward proxy. NGINX/Cloudflare is a reverse proxy.
- Reverse proxy handles SSL, LB, caching, and security, all of it.
- A reverse proxy is essential in modern systems.

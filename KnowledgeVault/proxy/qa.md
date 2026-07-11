---
title: "Proxy - The Intermediary Server — Q&A"
---

**Q: What is the main role of a proxy server?**
A: Mediating between client and server — Proxy = an intermediary server.

**Q: On whose behalf does a Forward Proxy work?**
A: Client — A forward proxy reaches the server on the client's behalf; it hides the client.

**Q: On whose behalf does a Reverse Proxy work?**
A: Server — A reverse proxy works on the server's behalf - hiding the backend from the client.

**Q: A VPN is an example of a forward proxy.**
A: True — A VPN is a forward proxy + encryption + tunneling.

**Q: What type of proxy is NGINX generally?**
A: Reverse — NGINX is a widely used reverse proxy (LB, SSL termination, caching).

**Q: Facebook being blocked on school wifi - which type of proxy is that?**
A: Forward — A forward proxy filters outbound traffic.

**Q: What is Cloudflare mainly?**
A: Reverse proxy + CDN — Cloudflare is a global reverse proxy that provides CDN, DDoS protection, and WAF, all of it.

**Q: A reverse proxy doesn't work with just one backend.**
A: False — Even with one backend, a reverse proxy is valuable for SSL, caching, and security.

**Q: Where is SSL Termination done?**
A: At the reverse proxy — The reverse proxy handles SSL; the backend runs plain HTTP - better performance.

**Q: Which of these is NOT a use of a Forward Proxy?**
A: Load balancing — LB is a reverse proxy's job. A forward proxy is a client-side concern.

**Q: Your Node.js app is slow at serving static files. What would you do?**
A: Put NGINX in front to handle static files and SSL — NGINX as a reverse proxy serves static files fast; Node handles only dynamic logic.

**Q: A client's office visits Wikipedia a lot, and it's being downloaded every single time. What's the solution?**
A: Forward proxy with caching — Caching at the office network's forward proxy prevents the same content from being downloaded repeatedly.

**Q: Which of these is NOT an advantage of a reverse proxy?**
A: Hiding the user's IP — Hiding the user's IP is a forward proxy/VPN's job. A reverse proxy hides the server.

**Q: It's hard to run a modern microservice architecture without a reverse proxy.**
A: True — API gateway, LB, SSL, security - all of it is handled through a reverse proxy.

**Q: What is Squid?**
A: Open-source forward proxy — Squid is a popular open-source forward proxy + caching server.

**Q: How does a proxy help with A/B Testing?**
A: Routes a portion of users to a new version — A rule at the reverse proxy can route 10% of traffic to v2.

**Q: Is it fine to expose the backend's IP publicly?**
A: No - keep it behind a reverse proxy — Hiding the backend IP reduces DDoS and direct attacks.

**Q: What type of tool is HAProxy?**
A: Reverse proxy + LB — HAProxy is a high-performance LB and reverse proxy.

**Q: Reverse proxy and Load Balancer are nearly the same tool - there's overlap.**
A: True — NGINX, HAProxy do both jobs. LB is a subset feature of a reverse proxy.

**Q: Which type of proxy is used for anonymity?**
A: Forward (especially VPN) — A forward proxy/VPN hides the client's IP from the server.

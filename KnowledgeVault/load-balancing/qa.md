---
title: "Load Balancing — Q&A"
---

**Q: What is the main job of a Load Balancer?**
A: Distributing traffic across multiple servers — The main job of a Load Balancer is to distribute requests evenly across multiple servers.

**Q: In which algorithm does each server get a request in turn?**
A: Round Robin — In Round Robin, servers are cycled through in order: 1 -> 2 -> 3 -> 1...

**Q: Which algorithm takes server capacity into account?**
A: Weighted Round Robin — Weighted Round Robin gives more powerful servers a higher weight.

**Q: Which algorithm is good for Sticky Sessions?**
A: IP Hash — IP Hash always sends the same client to the same server.

**Q: A Layer 7 Load Balancer can see HTTP headers.**
A: True — A Layer 7 LB is application-level - it can see URL, headers, cookies, all of it.

**Q: A Layer 4 Load Balancer can do URL path-based routing.**
A: False — Layer 4 only looks at IP and port - it cannot see the URL. That's a Layer 7 job.

**Q: What type of Load Balancer is NGINX generally?**
A: Layer 7 (Application) — NGINX is primarily a Layer 7 LB, though it also supports Layer 4.

**Q: Which is AWS's Layer 7 Load Balancer?**
A: ALB — AWS Application Load Balancer (ALB) is Layer 7; Network LB (NLB) is Layer 4.

**Q: What is the job of a Health Check?**
A: Periodically checking whether a server is okay — Health checks stop traffic from being sent to unhealthy servers.

**Q: A Load Balancer can become a single point of failure.**
A: True — If there's only one LB, the whole system goes down if it fails. So an HA pair is needed.

**Q: Which of these is an example of a Hardware Load Balancer?**
A: F5 — F5, Citrix - hardware LBs. NGINX, HAProxy, Envoy are software LBs.

**Q: Your servers have different capacities (one has 16GB RAM, another 4GB). Which algorithm would you use?**
A: Weighted Round Robin — Weighted Round Robin sends more traffic to the more powerful server.

**Q: An e-commerce site keeps its shopping cart server in memory. Why must the user stay on the same server?**
A: The cart data is on that server — A sticky session is needed, otherwise the cart would be lost. The modern solution: keep session data in Redis.

**Q: Where is SSL Termination usually done?**
A: At the Load Balancer — Terminating SSL at the LB reduces the backend server's workload.

**Q: What happens in DNS Load Balancing?**
A: Multiple IPs are given to the DNS server — If DNS has multiple A records, round-robin or geo-based routing is possible.

**Q: Active health checks periodically send HTTP requests.**
A: True — Active checks periodically hit the /health endpoint.

**Q: Which algorithm is good for long-running connections (such as a database)?**
A: Least Connections — Least Connections sends traffic to whichever server currently has the fewest connections - ideal for long connections.

**Q: How would you deploy a Load Balancer for High Availability?**
A: Active-passive or Active-active pair — The LB itself must be duplicated - so it doesn't become a single point of failure.

**Q: What type of Load Balancing does Cloudflare mainly provide?**
A: DNS-based + Edge LB — Cloudflare provides DNS-based geo-routing and edge-level LB.

**Q: Scaling a large system without a Load Balancer is nearly impossible.**
A: True — A LB is essential for horizontal scaling - traffic can't be split without multiple servers.

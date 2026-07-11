---
title: "Load Balancing — Deep Dive"
---

Imagine a bank with only one cashier. Everyone has to stand in a long line. Now if there are 5 cashiers and a guide sends everyone to a different cashier - the work gets done much faster. That guide is exactly what a **Load Balancer** is.

## What is Load Balancing?

**Load Balancing** is a process where incoming traffic/requests are distributed evenly across multiple servers. The system that does this job is called a **Load Balancer**.

**Note:** Facebook receives billions of requests every day. A single server can't handle that much load. A load balancer splits requests across countless servers.

## Why is Load Balancing needed?

- **Scalability:** New servers can be added as traffic grows.
- **High Availability:** The system keeps running even if one server goes down.
- **Performance:** Response time stays low.
- **Failover:** Requests stop being sent to unhealthy servers.
- **Easier maintenance:** Others keep running while one server is being repaired.

## Load Balancing algorithms

### 1. Round Robin
Each request goes to a server in turn - server 1, 2, 3, 1, 2, 3...
- **Advantage:** Very simple.
- **Disadvantage:** Doesn't consider server capacity/current load.

### 2. Weighted Round Robin
More powerful servers are given a higher weight. For example server A (weight 3), server B (weight 1) - A gets three requests for every one B gets.

### 3. Least Connections
Requests are sent to whichever server currently has the fewest active connections.
- **Advantage:** Takes current load into account.
- **Use case:** Long-running connections (such as databases).

### 4. Least Response Time
Sent to whichever server is responding the fastest.

### 5. IP Hash
Always sends a client to the same server based on a hash of the client's IP.
- **Advantage:** Session persistence (sticky session).

### 6. Random
A server is picked at random. Simple but unpredictable.

## Layer 4 vs Layer 7 Load Balancer

**Layer 4 (Transport)**
- Routes based on IP and port
- Works at the TCP/UDP level
- Cannot see HTTP headers
- Very fast (less processing)
- Examples: HAProxy (TCP mode), AWS NLB

**Layer 7 (Application)**
- Routes based on HTTP header, URL, cookie
- Smart routing - /api -> API server, /img -> CDN
- Can do SSL termination
- A bit slower (more processing)
- Examples: NGINX, AWS ALB, Cloudflare

## Types of Load Balancer

### Hardware Load Balancer
Physical devices like F5, Citrix. Expensive but very fast. Used in large enterprises.

### Software Load Balancer
NGINX, HAProxy, Envoy - software-based. Cheap, easy to configure.

### Cloud Load Balancer
AWS ELB/ALB/NLB, GCP Load Balancer, Azure Load Balancer - cloud services.

### DNS Load Balancing
Round-robin or geo-based routing done using multiple IPs in DNS.

## Health Check

The load balancer pings the servers every few seconds to see if they're okay.

- **Active health check:** Periodically sends an HTTP request (e.g. `/health`).
- **Passive health check:** Marks a server unhealthy after seeing failed requests.
- New requests are not sent to unhealthy servers.

## Sticky Session (Session Persistence)

Always sending the same client to the same server - so session data isn't lost.

- **Example:** When an e-commerce shopping cart is kept in server memory.
- **Modern alternative:** Keeping session data in Redis removes the need for sticky sessions.

## Real-world examples

- **Facebook:** Countless load balancers around the world.
- **Netflix:** Geo-DNS + Application LB.
- **Cloudflare:** DNS LB + edge LB.
- **Banking:** Hardware LB (F5) - high security.

## Common misconceptions

1. **"One LB is enough":** No, the LB itself can become a single point of failure. Deploy active-passive or active-active.
2. **"Round Robin is always good":** No, weighted is better when server capacities differ.
3. **"Layer 7 is always better":** No, Layer 4 is faster under heavier traffic.

## Best Practices in System Design

- Always keep health checks enabled.
- Duplicate the LB itself (HA pair).
- Make servers stateless (keep session in Redis).
- Do SSL termination at the LB - reduce backend work.
- Integrate with auto-scaling.

## Chapter Summary

- A Load Balancer distributes traffic across multiple servers.
- Round Robin, Least Connections, IP Hash - common algorithms.
- Layer 4 is fast, Layer 7 is smart.
- Health checks identify unhealthy servers.
- Duplicate the LB itself for HA.

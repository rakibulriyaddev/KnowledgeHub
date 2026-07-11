---
title: "Scalability — Q&A"
---

**Q: What is the definition of Scalability?**
A: The ability to handle increased load — Scalability = maintaining performance even under increased traffic/data.

**Q: What does Vertical Scaling mean?**
A: Increasing CPU/RAM on the same server — Vertical = scale up = more resources on the same machine.

**Q: What does Horizontal Scaling mean?**
A: Adding multiple servers — Horizontal = scale out = multiple machines.

**Q: Vertical scaling has a hardware ceiling.**
A: True — No matter how much CPU/RAM you add to a single machine, it eventually hits a limit.

**Q: Which scaling type is usually preferred in the cloud?**
A: Horizontal — Cloud auto-scaling, redundancy, fault tolerance - all built for horizontal scaling.

**Q: Why is stateless architecture good for horizontal scaling?**
A: Servers become interchangeable; a user can go to any server — If state lives on the server you need sticky sessions; with stateless, any instance works.

**Q: What is the X-axis of the Scale Cube?**
A: Horizontal duplication — X-axis = multiple identical copies of the same app.

**Q: What is the Y-axis of the Scale Cube?**
A: Functional decomposition (microservices) — Y-axis = breaking into services - order, user, payment as separate services.

**Q: What is the Z-axis of the Scale Cube?**
A: Data partitioning (sharding) — Z-axis = partitioning data - splitting the DB by a hash of the user ID.

**Q: Which component usually becomes the first bottleneck?**
A: Database — Scaling the database is the hardest - so it often becomes the first bottleneck.

**Q: Your app's users grew 100x. What do you do first?**
A: Profile and find the bottleneck — Measure first. Scaling without knowing where the bottleneck is wastes money and time.

**Q: A single DB is serving very heavy reads. What's the first step?**
A: Read replica + caching — The easiest path to scaling reads - replicas and caching. Sharding is complex, needed only later.

**Q: What usually triggers auto-scaling?**
A: CPU/memory threshold or request rate — Threshold-based: add when CPU > 70%; remove when < 30%.

**Q: Premature scaling wastes cost and complexity.**
A: True — Kubernetes is overkill for an app with 100 users - measure first, scale later.

**Q: How much headroom for peak QPS is typical in capacity planning?**
A: 30%+ — A 30%+ buffer is standard - for unexpected spikes.

**Q: Why does async processing help scalability?**
A: Heavy tasks go to a background queue - fast response to the user — Sending email, transcoding video - pushed to a queue while the user gets an instant response.

**Q: Traffic to one service jumped 10x - not the others. What do you do?**
A: Scale only the hot service (microservice benefit) — Independent scaling of microservices - scale only what's needed.

**Q: How does a CDN help scalability?**
A: Offloads static assets - less load on the origin — The edge cache saves the origin server's bandwidth and CPU.

**Q: Between stateless and stateful, which is horizontal-scaling-friendly?**
A: Stateless — Stateless servers are interchangeable - any one can handle any request.

**Q: Cloud auto-scaling means worry-free scaling.**
A: False — Auto-scaling helps, but if code isn't stateless and the DB isn't scaled - auto-scaling alone can't save you.

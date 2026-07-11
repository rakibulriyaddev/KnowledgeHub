---
title: "Availability — Q&A"
---

**Q: How is availability measured?**
A: Uptime / (Uptime + Downtime) % — Availability = the percentage of uptime.

**Q: How many hours down per year does 99.9% availability mean?**
A: 8.76 hours — 99.9% = three nines = ~8.76 hours of downtime per year.

**Q: What is 99.999% availability called?**
A: Five nines — Five nines = ~5.26 minutes of downtime per year.

**Q: 100% availability is theoretically possible.**
A: False — Hardware will fail; 100% is impossible due to the limits of physics and economics.

**Q: What does Active-Active redundancy mean?**
A: Both take traffic at the same time — Both servers are active - load is distributed, and if one fails the other handles it.

**Q: What does Active-Passive redundancy mean?**
A: One active, the other standby - kicks in on failover — Passive stays in standby mode; failover happens if active fails.

**Q: A Single Point of Failure (SPOF) is unacceptable in an HA system.**
A: True — A SPOF breaks availability - it must be identified and removed.

**Q: What is the total availability of 3 components at 99.9% each in series?**
A: 99.7% — 99.9 x 99.9 x 99.9 = ~99.7%. In series, more components means lower availability.

**Q: Parallel redundancy increases availability because:**
A: If one fails, the other still serves — In parallel, failure probabilities multiply together - becoming very small.

**Q: Why multi-region deployment?**
A: Lower latency + available even if one region goes down — Geographic redundancy - the system stays up during a disaster (earthquake, fire).

**Q: Your e-commerce site is promising 99% availability. Good or bad?**
A: Bad - 3.65 days down a year = huge financial loss — 99% is very low for e-commerce. Being down during Black Friday means enormous losses.

**Q: A banking app wants to go from 99.99% to 99.999%. Impact?**
A: Cost rises 10x; needs multi-region active-active — Each extra nine brings a lot of complexity and cost.

**Q: What is Graceful Degradation?**
A: Maintaining partial functionality — If one service goes down the rest still works; the user experience doesn't break completely.

**Q: Stateless architecture helps with HA.**
A: True — Stateless servers are interchangeable - if any one fails, another can take over.

**Q: What is Chaos Engineering?**
A: Deliberately injecting failure in production — Netflix Chaos Monkey and similar tools - simulate failure to see if the system is resilient.

**Q: Difference between Reliability and Availability:**
A: Reliability = fewer failures; Availability = fast recovery — High reliability + fast recovery = high availability.

**Q: Where are health checks + auto-failover used?**
A: Load balancers and orchestrators — An LB skips unhealthy servers, K8s restarts pods - the foundation of auto-failover.

**Q: What is AWS S3's availability SLA?**
A: 99.99% — AWS S3 offers a 99.99% availability SLA (with 11 nines of durability).

**Q: Multi-AZ deployment increases availability.**
A: True — If one AZ goes down, another AZ still serves - a smaller-scale version of geographic redundancy.

**Q: Among SLA, SLO, SLI, which one is contractual with the customer?**
A: SLA — SLA = a binding agreement with the customer.

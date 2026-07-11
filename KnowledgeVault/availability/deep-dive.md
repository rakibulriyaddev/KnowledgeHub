---
title: "Availability — Deep Dive"
---

You go to withdraw cash from an ATM at 2 AM - the machine isn't working. The ATM's availability is low. Google.com, on the other hand, doesn't go down for more than a few minutes a year. This difference is the story of availability.

## What is Availability?

**Availability** = the percentage of time a system remains functional and accessible.

`Availability = Uptime / (Uptime + Downtime)`

Example: a system was down for 10 hours in a year. There are 8760 hours in a year in total.

`(8760 - 10) / 8760 = 99.886%`

## Counting the "Nines"

In the industry, availability is talked about in terms of "how many nines". Each extra nine reduces downtime by 10x.

**99% (Two nines)**
- 3.65 days down per year
- 7.2 hours per month
- Typical web app

**99.9% (Three nines)**
- 8.76 hours down per year
- 43 minutes per month
- Standard SLA target

**99.99% (Four nines)**
- 52.56 minutes per year
- 4.38 minutes per month
- Enterprise grade

**99.999% (Five nines)**
- 5.26 minutes per year
- Telecom, banking critical
- Very expensive

**Caution:** Going from 99% to 99.99% looks small on paper but costs 100x more! Achieving five-nine availability requires multi-region active-active deployment, custom hardware, and significant cost.

## Strategies for High Availability

### 1. Redundancy
A duplicate of every critical component. If one fails, the other takes over.
- **Active-Active:** Both take traffic simultaneously.
- **Active-Passive:** One is active, the other is standby. If active fails, it fails over to passive.

### 2. Failover
Automatic switch from a failed component to a healthy one. Integrated with health checks.

### 3. Replication
Data copied to multiple servers. Even if one DB fails, the replica remains.

### 4. Geographic Redundancy
Multi-region deployment. If one data center crashes (earthquake, fire, power outage) - another region serves.

### 5. Load Balancing
Health checks + traffic distribution = unhealthy servers get skipped.

### 6. Stateless Architecture
Stateless servers are interchangeable - the user doesn't feel it even if any one fails.

### 7. Graceful Degradation
Instead of going fully down - partial functionality is maintained. Example: if images don't load, text content is still visible.

### 8. Circuit Breaker
If a service fails, calls to it are stopped - preventing cascading failure.

## Series vs Parallel - the Math of Availability

When components are in series, availability multiplies. In parallel, the probability of failure multiplies.

### Series
App → DB → Cache (all must work together)

`Total = A1 x A2 x A3 = 99.9 x 99.9 x 99.9 = 99.7%`

### Parallel (Redundant)
Two servers - it's fine even if only one works.

`Failure = (1-A1) x (1-A2)`
`Total = 1 - failure`

Two 99% servers in parallel = 99.99%. The magic of redundancy.

## Real-World Examples

- **AWS S3:** 99.99% SLA, 11 nines durability.
- **Google Cloud Storage:** 99.95% SLA.
- **Banking:** 99.999% target.
- **Personal blog:** 99% is enough.

## Common Misconceptions

1. **"99% is good":** 3.65 days down a year - a disaster for e-commerce.
2. **"A single component won't fail":** Hardware will fail - you have to assume it.
3. **"100% availability is possible":** No - there are limits set by physics and economics.
4. **"Availability = Reliability":** Reliability means fewer failures; availability means recovering fast.

## Best Practices

- Identify and remove single points of failure (SPOF).
- Multi-AZ deployment at minimum, multi-region if critical.
- Automated failover - manual intervention is slow.
- Chaos engineering - test real failures (Netflix Chaos Monkey).
- Have a Disaster Recovery plan and run regular drills.
- Set a realistic SLA - do the math before promising 99.999%.

## Chapter Summary

- Availability = uptime percentage.
- 99.9% = 8.76 hours down per year.
- Each extra nine = 10x less downtime, but several times more cost.
- Redundancy + Failover + Replication = the foundation of HA.
- Series multiplies availability down, parallel reduces failure.

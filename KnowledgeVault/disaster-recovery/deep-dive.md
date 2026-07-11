---
title: "Disaster Recovery — Deep Dive"
---

In July 2022, a fire broke out at a major ISP's data center in Bangladesh. Thousands of websites were down for hours. Companies that were prepared failed over to a backup region and stayed online. The unprepared ones went face-down. That's the importance of **Disaster Recovery**.

## What Is Disaster Recovery (DR)?

**Disaster Recovery** = a pre-planned strategy that restores business continuity after a catastrophic failure (fire, flood, earthquake, region-wide outage, cyber attack).

## Disaster Types

- **Natural:** Earthquake, flood, hurricane.
- **Hardware:** Server failure, disk crash.
- **Software:** Bug, corrupted deployment.
- **Network:** ISP outage, BGP misconfiguration.
- **Human:** Accidental deletion, misconfiguration.
- **Cyber:** Ransomware, DDoS, breach.
- **Power:** Grid failure.

## RPO and RTO - the Two Key Metrics

### RPO (Recovery Point Objective)

"How much data loss is acceptable?" - the time between the last good backup and the disaster.

- RPO of 1 hour = at most 1 hour of data loss.
- RPO of 5 minutes = near-real-time backup.
- RPO of 0 = no data loss (synchronous replication).

### RTO (Recovery Time Objective)

"How quickly must the service be back up?" - from the disaster to resumed operation.

- RTO of 24 hours = back up the next day.
- RTO of 1 hour = back up within 1 hour.
- RTO of 0 = instant (active-active).

```
[Last backup]─────[DISASTER]─────[Recovered]
     ←── RPO ──→   ←── RTO ──→
     data lost       downtime
```

## DR Strategies

### 1. Backup & Restore (Cold)

- Periodic backup, off-site/cloud.
- On disaster - spin up new infrastructure, restore data.
- RPO: hours-days. RTO: hours-days.
- Cheapest. Common for SMBs.

### 2. Pilot Light

- Minimal infrastructure running at the DR site (a DB replica).
- On disaster - scale up the application servers.
- RPO: minutes. RTO: tens of minutes.
- Moderate cost.

### 3. Warm Standby

- A scaled-down copy running at the DR site.
- On disaster - scale up and fail over.
- RPO: seconds. RTO: minutes.
- Higher cost.

### 4. Hot Standby / Active-Active

- Full production load running in every region.
- On disaster - redirect traffic (DNS/load balancer).
- RPO: 0. RTO: seconds.
- Highest cost - 2× infrastructure.

## Strategy Comparison

**Backup & Restore:** Cheapest; hours-days RPO/RTO; manual recovery; small business.

**Pilot Light:** Moderate cost; tens of minutes RTO; database replica + minimal infra; medium business.

**Warm Standby:** Higher cost; minutes RTO; scaled-down running copy; critical apps.

**Active-Active:** Highest cost; seconds RTO, RPO 0; full multi-region; mission-critical.

## Backup Strategies

### 3-2-1 Rule

- 3 copies of the data.
- 2 different media types.
- 1 off-site.

### Backup Types

- **Full:** A complete data copy. Slow, large.
- **Incremental:** Changes since the last backup. Fast, chain-dependent.
- **Differential:** Changes since the last full backup. A middle ground.
- **Snapshot:** A point-in-time view (DB, filesystem).

### Best Practices

- Encrypted backups.
- Automated and tested.
- Geographic separation.
- Retention policy.
- **Test restoration** - taking a backup isn't enough.

## Multi-Region Architecture

### Active-Passive

The primary region handles traffic; the secondary stands by. On failover, DNS/LB switches over.

### Active-Active

Both regions handle traffic. Keeping stateful data in sync is challenging.

### Geo-routing

Route users to the nearest region - lower latency.

## Failover Mechanisms

- **DNS-based:** Route 53 health checks, failover routing.
- **BGP:** Anycast IP - automatic routing.
- **Application-level:** Code retries against a secondary.
- **Manual:** Operator-triggered.

## DR Testing

An untested DR plan is no DR plan at all.

- **Tabletop exercise:** A discussion-based scenario.
- **Walkthrough:** Verify the steps.
- **Simulation:** Run it in a test environment.
- **Game day:** A controlled disaster in production (Netflix Chaos Monkey).

## Real-World Examples

- **Netflix Chaos Engineering:** Injects random failures in production to verify resilience.
- **AWS Multi-Region:** Active-active across us-east and us-west.
- **Banks:** Multi-DC mandated by regulation.
- **Cloudflare:** Global anycast - a regional failure is invisible.
- **2017 AWS S3 outage:** Many services went down - multi-region became standard afterward.

## Business Continuity Plan (BCP)

DR = technical recovery. **BCP** = a broader plan covering people, communication, customer notification, and regulatory reporting.

- A communication tree.
- Status page updates.
- Customer notification.
- Regulatory reporting.
- Post-mortems.

## Common Misconceptions

1. **"Backup = DR":** A backup is data; DR is the full recovery process.
2. **"The cloud is automatically disaster-proof":** Regional outages happen; you need multi-region.
3. **"Set it up once and forget it":** Needs quarterly testing and updates.
4. **"RPO 0 is always good":** Synchronous replication comes at massive cost.

## Best Practices

- Define RPO/RTO per service criticality.
- Follow the 3-2-1 backup rule.
- Test restoration quarterly.
- Multi-region for critical services.
- Document runbooks.
- Chaos engineering - proactive testing.
- A communication plan - status page.
- Review insurance and legal aspects.

## Chapter Summary

- DR restores business continuity after catastrophic failure.
- RPO = data-loss tolerance; RTO = downtime tolerance.
- Strategies: Backup → Pilot Light → Warm → Active-Active.
- The 3-2-1 backup rule.
- An untested plan is no plan; practice chaos engineering.

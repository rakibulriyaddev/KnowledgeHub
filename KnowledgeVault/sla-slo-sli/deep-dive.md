---
title: "SLA, SLO, SLI — Deep Dive"
---

"Our service delivers 99.9% uptime" - what does that actually mean? Who is promising what to whom? How is it measured? The answers to these three questions are **SLA, SLO, SLI**.

## The Three Terms at a Glance

- **SLI (Service Level Indicator):** What is measured (e.g., availability %).
- **SLO (Service Level Objective):** The internal target (e.g., 99.95%).
- **SLA (Service Level Agreement):** The contract with the customer (e.g., 99.9% - a refund if it falls short).

## SLI - Service Level Indicator

**SLI** = a measurable metric. What gets tracked?

### Common SLIs

- **Availability:** Uptime %.
- **Latency:** Response time (P50, P95, P99).
- **Throughput:** Requests/second.
- **Error rate:** % of failed requests.
- **Durability:** Data persistence rate.

### Properties of a good SLI

- Reflects the user experience (not server CPU).
- Measurable.
- Aggregatable.

## SLO - Service Level Objective

**SLO** = a target set on top of an SLI. An internal commitment.

### Examples

- "99.95% of requests finish in <200ms."
- "99.9% availability per month."
- "Error rate <0.1%."

### Format

*"X% of [SLI] meets [threshold] over [time window]"*

## SLA - Service Level Agreement

**SLA** = a formal contract with the customer. A looser version of the SLO (with buffer built in). Violations carry financial consequences.

### Examples

- AWS S3: 99.9% availability/month - a service credit if it falls short.
- Google Cloud: 99.5% - a refund if it falls short.
- Stripe: an API uptime SLA - credits in case of breach.

**Note:** SLA < SLO. Because missing the SLO is an internal alarm; missing the SLA is a financial loss. The SLO keeps a buffer above the SLA.

## The "Nines" - Uptime Math

**99% (2 nines):** 3.65 days/year downtime; 7 hours/month; hobby project.

**99.9% (3 nines):** 8.76 hours/year; 43 minutes/month; standard SaaS.

**99.99% (4 nines):** 52 minutes/year; 4.3 minutes/month; enterprise.

**99.999% (5 nines):** 5.26 minutes/year; 26 seconds/month; telecom, banking.

## Error Budget

An SLO of 99.9% means 0.1% failure is allowed. That 0.1% is the **error budget**.

### Example

An SLO of 99.9% over 30 days = 43 minutes of downtime allowed.

### What can you do with it?

- Ship a risky feature - if budget remains.
- Maintenance/migration - allowable within budget.
- Budget exhausted = freeze new deployments, focus on reliability.

### SRE practice (Google)

The error budget balances engineering reliability against innovation.

## User-Centric SLI

Server uptime ≠ user happiness. Measure the user's actual experience:

- "Is the page loading?" (from the browser's perspective).
- "Is checkout completing?"
- "Is search returning results within 500ms?"

Synthetic monitoring + real user monitoring (RUM).

## Composite SLO

A system with multiple components:

- Frontend 99.95%
- API 99.9%
- DB 99.99%
- End-to-end multiplied: 99.95 × 99.9 × 99.99 ≈ 99.84%

The composite is always lower than any individual component. Optimize the critical path.

## Real-World Examples

- **AWS S3:** 99.99% availability, 99.999999999% durability (11 nines).
- **Google Compute Engine:** Multi-zone 99.99%.
- **Cloudflare:** Claims 100% historical uptime (with caveats).
- **Stripe API:** 99.99% with a detailed status page.

## SLO Setup Process

1. Identify the user journey (signup, checkout, search).
2. Choose the critical SLI (latency, availability).
3. Set a realistic SLO target - look at historical data.
4. Calculate the error budget.
5. Monitoring + alerting.
6. Quarterly review.

## Common Misconceptions

1. **"A higher SLO is always better":** 100% is impossible and expensive. Choose the right level.
2. **"SLA = SLO":** The SLA is a legal commitment; the SLO is an internal target.
3. **"Server uptime = SLI":** User experience matters, not the server.
4. **"A 100% SLO":** Not realistic - the opposite of the SRE error-budget concept.

## Best Practices

- Keep SLA < SLO (leave a buffer).
- Choose user-centric SLIs.
- Track P50, P95, P99 latency - averages are misleading.
- Enforce the error budget.
- Status page + post-mortems.
- Keep SLOs realistic - avoid over-promising.
- Cost-benefit analysis: 99.9% → 99.99% is a massive cost jump.

## Chapter Summary

- SLI = a measurable metric (availability, latency).
- SLO = an internal target on an SLI.
- SLA = a customer contract; stricter than the SLO, with financial consequences.
- Error budget = the SLO's "allowed failure."
- Higher nines get exponentially more expensive. Choose the right level.

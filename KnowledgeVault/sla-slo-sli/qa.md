---
title: "SLA, SLO, SLI — Q&A"
---

**Q: What is an SLI?**
A: A measurable metric (like availability %) — Service Level Indicator.

**Q: What is an SLO?**
A: An internal target set on an SLI — Service Level Objective.

**Q: What is an SLA?**
A: A formal contract with the customer - carries financial consequences — Service Level Agreement - legally binding.

**Q: What is the relationship between SLA and SLO?**
A: SLA < SLO (a buffer exists) — Missing the SLO is an internal alarm; missing the SLA is a financial loss.

**Q: How many minutes of downtime does 99.9% uptime/month allow?**
A: ~43 minutes — 99.9% x 720 hours/month allows ~43 minutes.

**Q: Yearly downtime for 99.99% (4 nines)?**
A: ~52 minutes — 4 nines = 52 min/year.

**Q: AWS S3's durability claim?**
A: 99.999999999% (11 nines) — Eleven nines - extreme data durability.

**Q: What is an error budget?**
A: The SLO's "allowed failure" - e.g., 99.9% = 0.1% budget — The tolerable amount of failure.

**Q: What happens when the error budget is exhausted?**
A: Freeze deployments, focus on reliability — SRE practice - exhausted budget means stopping risky changes.

**Q: Average is the best metric for latency.**
A: False — P95/P99 percentiles - averages hide outliers.

**Q: Which approach captures the actual user experience?**
A: Synthetic monitoring + RUM (Real User Monitoring) — Browser-side measurement.

**Q: Frontend 99.95%, API 99.9%, DB 99.99% - what's the composite SLO?**
A: ~99.84% (multiplied) — Composite is lower than any individual component; the chain is only as strong as its weakest link.

**Q: A startup targets 99% uptime. Is that cost-effective?**
A: Reasonable for an early stage — Higher nines get exponentially more expensive - 99% is fine for a startup.

**Q: Which company's concept is SRE?**
A: Google — Site Reliability Engineering - made famous by Google's book.

**Q: A 100% SLO is realistic.**
A: False — Impossible given network and dependency realities - a 100% SLO is often the wrong goal.

**Q: What happens on an SLA breach?**
A: Service credit/refund to the customer — The standard contractual remedy.

**Q: How do you make an SLO realistic?**
A: Analyze historical data - base the target on current performance — Use the past 30/90 days as a baseline.

**Q: Which is a good SLI?**
A: User-perceived latency, error rate — Reflects the user experience.

**Q: What does P99 latency mean?**
A: 99% of requests have latency below this value — Faster than 99% of requests, slower than the remaining 1%.

**Q: SLAs are usually reviewed by the legal team.**
A: True — A contract - it has financial implications.

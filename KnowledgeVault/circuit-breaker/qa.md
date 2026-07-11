---
title: "Circuit Breaker Pattern — Q&A"
---

**Q: What does the Circuit Breaker pattern prevent?**
A: Cascading failure — Blocks calls to a failed service - avoids the domino effect.

**Q: What are the three states of a Circuit Breaker?**
A: Closed, Open, Half-Open — A three-state machine.

**Q: What happens in the Closed state?**
A: Normal flow + failure tracking — Default - requests pass through, failures are counted.

**Q: What happens in the Open state?**
A: Fast-fail - no calls reach the service — Threshold crossed = circuit trips.

**Q: What happens in the Half-Open state?**
A: Limited trial requests - testing recovery — Checks whether the service has come back.

**Q: Half-open success → Closed; failure → Open.**
A: True — The trial result determines the transition.

**Q: What is cascading failure?**
A: One service fails → its caller fails → their caller fails (domino) — Failure propagation.

**Q: Which company created Hystrix?**
A: Netflix (now deprecated) — Pioneer circuit breaker library.

**Q: Modern Java replacement for Hystrix?**
A: Resilience4j — Resilience4j is the current standard.

**Q: What is a fallback?**
A: An alternate response while the circuit is open — Default value, cached data, or an error message.

**Q: The recommendation service is down. What do you do?**
A: Open the circuit + fallback (popular items) — Graceful degradation - the page keeps working.

**Q: The payment service times out occasionally. What strategy?**
A: Combine retry + timeout + circuit breaker — Multi-pattern resilience.

**Q: What is the Bulkhead pattern?**
A: Isolated resource pools - failure doesn't spread — Like a ship's compartments - flooding stays contained.

**Q: Each service should have its own separate circuit breaker.**
A: True — A single global breaker is all-or-nothing - a bad pattern.

**Q: Typical failure threshold configuration?**
A: e.g., 50% over 10 requests in 1 min — Failure rate measured over a sliding window.

**Q: Circuit breaker in a Service Mesh (Istio)?**
A: Built-in - at the sidecar level — Istio's Envoy proxy has circuit breaking built in.

**Q: What's good to add alongside retry?**
A: Exponential backoff + jitter + max retry limit — To avoid a thundering herd.

**Q: Timeout vs Circuit Breaker?**
A: Timeout is a per-call limit; circuit breaker acts across calls — Complementary patterns.

**Q: Monitoring a circuit breaker is optional.**
A: False — It can silently stay open - alerting is essential.

**Q: Which of these is an anti-pattern?**
A: Aggressive threshold (trips on a slight blip) — Too sensitive = too many trips.

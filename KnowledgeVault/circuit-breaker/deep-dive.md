---
title: "Circuit Breaker Pattern — Deep Dive"
---

When an electrical appliance in your house short-circuits, the circuit breaker trips. Power flow stops — the house doesn't catch fire. Software has the same idea: when one service fails, stop calling it. Otherwise it cascades and breaks the whole system.

## Problem: Cascading Failure

Service A → Service B → Service C. If B is slow or fails:

- A's request waits until it times out on B.
- A's thread/connection pool fills up.
- A can't accept new requests.
- A's caller fails too.
- Domino effect - the whole system goes down.

## What Is a Circuit Breaker?

**Circuit Breaker Pattern** = wrapping calls to a service so that once a failure threshold is crossed, calls are automatically stopped. It later tries periodically to check for recovery.

Popularized by Michael Nygard's book "Release It!" (2007).

## Three States

### 1. Closed (Normal)

- Requests pass through normally.
- Failure count is tracked.
- Once the threshold is crossed → Open.

### 2. Open (Tripped)

- All requests fail immediately (fast-fail).
- No calls reach the service.
- After a timeout → Half-Open.

### 3. Half-Open (Testing Recovery)

- A limited number of trial requests go through.
- On success → Closed (recovered).
- On failure → Open again.

```
CLOSED ──[failure threshold]──→ OPEN
  ↑                               │
  │                          [timeout]
[success]                         │
  │                               ↓
HALF-OPEN ←──────────────────────┘
  │
[fail]──→ OPEN
```

## Benefits

- **Fast fail:** Instant error to the user - no waiting.
- **Resource protection:** Blocks resources meant for the failed service.
- **Cascade prevention:** The caller is protected.
- **Auto-recovery:** Automatically detects when the service comes back.
- **Graceful degradation:** A fallback response is possible.

## Configuration

- **Failure threshold:** How many failures trigger opening (e.g., 50% over 10 requests).
- **Timeout duration:** Transition from open to half-open (e.g., 30 sec).
- **Success threshold:** Transition from half-open to closed.
- **Time window:** Duration over which the failure rate is measured.

## Fallback Strategies

What response should be given while the circuit is open?

- **Default value:** "Recommendations unavailable; showing popular items instead."
- **Cached response:** Last known good data.
- **Empty response:** For optional features.
- **Error message:** Honest notification to the user.
- **Alternative service:** A backup endpoint.

## Implementation

### Library Pattern

```
CircuitBreaker breaker = CircuitBreaker.builder()
  .failureRateThreshold(50)
  .waitDurationInOpenState(30s)
  .slidingWindowSize(10)
  .build();

result = breaker.execute(() ->
  paymentService.charge(amount)
);
```

### Popular Libraries

- **Resilience4j (Java):** The modern standard.
- **Hystrix (Netflix, deprecated):** The pioneer.
- **Polly (.NET):** Resilience library.
- **opossum (Node.js):** Popular.
- **Service Mesh (Istio):** Built-in circuit breaker.

## Related Patterns

### Retry

Automatically retries on failure. Combine it with the circuit breaker.

- Exponential backoff.
- Jitter.
- Max retry limit.

### Timeout

A time limit on every call. Prevents hanging.

### Bulkhead

Isolated resource pools - one service's failure won't affect another.

### Rate Limiting

Limiting inbound traffic.

## Real-World Examples

- **Netflix:** Built Hystrix - protects 1,000+ microservices.
- **Amazon:** Per-service circuit breaker is mandatory.
- **Uber:** Service-to-service circuit breakers.
- **Banking:** Payment gateway integration.

## Example - E-commerce

When the recommendation service goes down:

- Without breaker: Product page loads slowly - recommendations time out.
- With breaker: Recommendation panel shows "popular items"; the rest of the page stays fast.

Much better user experience.

## Anti-patterns

1. **Single global breaker:** Should be separate per service.
2. **Aggressive threshold:** Circuit trips on a slight blip.
3. **No fallback:** Circuit is open but the user gets an empty response.
4. **No monitoring:** Circuit silently stays open.

## Common Misconceptions

1. **"Circuit breaker = retry":** Different - retry tries again; the breaker blocks.
2. **"Always a good idea":** There's overhead on internal calls - use it for important calls.
3. **"Auto-magic":** Needs tuning - a wrong threshold makes it useless.

## Best Practices

- A separate circuit per dependency.
- Use a sliding-window failure rate.
- Design the fallback strategy thoughtfully.
- Monitoring + alerting.
- Be careful with the half-open phase.
- Combine retry + timeout + bulkhead.
- If you have a Service Mesh (Istio), use its built-in support.

## Chapter Summary

- Circuit Breaker = blocks calls to a failed service.
- Closed → Open → Half-Open - three states.
- Prevents cascading failure.
- Fallback strategy enables graceful degradation.
- Resilience4j, Hystrix - popular libraries.

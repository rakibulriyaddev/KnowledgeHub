---
title: "Case Study: Netflix — Deep Dive"
---

At peak time, Netflix uses 15-35% of the world's internet bandwidth. 200+ million subscribers, 190+ countries, billion+ hours watched every day. The engineering that handles this scale is a masterclass in system design.

## Requirements

### Functional

- Video streaming (multiple devices, qualities).
- Browse + search content.
- Personalized recommendations.
- User profile, watch history.
- Subscription, billing.
- Multi-device sync.

### Non-Functional

- Low latency, smooth playback.
- High availability (99.99%+).
- Adaptive quality.
- Global delivery.
- Massive bandwidth.

## Capacity Estimation

```
Subscribers: 250M
Concurrent viewers (peak): 50M
Avg bitrate: 4 Mbps
Total bandwidth: 50M × 4 Mbps = 200 Tbps

Storage:
Movies: 30,000+ titles
Encoded versions: 1000s per title (different bitrates, languages)
Multi-PB total
```

## Architecture Overview

```
[User Device]
  ↓
[Edge CDN - Open Connect Appliance (OCA)]
  ↓ (cache miss)
[AWS Origin]
[Microservices on AWS]
  ↓
[Storage]: S3 (master), Cassandra, MySQL
[Recommendation]: Spark, ML pipeline
[Analytics]: Kafka → S3 → Redshift
```

## Netflix Open Connect (CDN)

Netflix's own CDN - partnered with 100+ ISPs.

### Open Connect Appliance (OCA)

- Server hardware installed in the ISP's data center.
- Free for the ISP - provided by Netflix.
- Caches popular content in advance.
- A short network hop from the user.

### Why It Works

- If a Bangladeshi ISP has an OCA - Netflix content is served locally.
- Lower latency, saves the ISP's external bandwidth.
- Viewing patterns are predictable (popular shows peak at certain hours).

## Video Encoding Pipeline

To ingest a single 4K movie:

1. Master file (raw).
2. Encoded into multiple bitrates (240p, 480p, 720p, 1080p, 4K).
3. Each bitrate in multiple codecs (H.264, H.265, AV1).
4. Multiple language audio tracks.
5. Subtitles (multiple languages).
6. Each combination is a separate file → thousands of versions.
7. Encoded files pushed to the OCA.

### Adaptive Bitrate Streaming (HLS/DASH)

- Video chunks (e.g., 10-second segments).
- Each chunk available in multiple qualities.
- The player selects quality based on network conditions.
- Network is slow → quality drops automatically.

## Microservices Architecture

Netflix pioneered microservices - 700+ services.

- Account, billing, subscription.
- Catalog, metadata.
- Search, recommendation.
- Playback, encoding.
- Analytics, A/B testing.

### Open-source contributions

- **Eureka:** Service discovery.
- **Hystrix:** Circuit breaker (deprecated).
- **Zuul:** API Gateway.
- **Spinnaker:** CD platform.
- **Chaos Monkey:** Chaos engineering.

## Recommendation System

Netflix's secret sauce - 80% of viewing comes from recommendations.

### Approaches

- **Collaborative filtering:** Preferences of similar users.
- **Content-based:** Matching movie attributes (genre, actor).
- **Deep learning:** Neural networks.
- **Contextual:** Time of day, device, mood.

### Pipeline

1. User behavior logs (Kafka).
2. Batch processing (Spark) - retrain the model.
3. Real-time scoring.
4. Cache top recommendations.
5. Continuous A/B testing.

## Playback Flow

1. User clicks a movie.
2. Playback service is consulted - license check, geo-restriction.
3. Manifest file (DASH/HLS) generated - with chunk URLs.
4. Player gets the address of the nearest OCA.
5. Player downloads chunks - adaptive bitrate.
6. Buffer is maintained.
7. Watch position saved periodically.

## Cloud-Native (AWS)

Netflix is all-in on AWS:

- EC2 - compute.
- S3 - master storage.
- DynamoDB - state.
- Cassandra - viewing history (custom multi-region).
- EMR - data processing.

Multi-region active-active.

## Chaos Engineering

Netflix's Chaos Monkey + suite:

- **Chaos Monkey:** Randomly kills instances.
- **Latency Monkey:** Injects latency.
- **Chaos Kong:** Fails an entire region.
- **Goal:** Verify production resilience.

## A/B Testing

Everything gets A/B tested:

- Thumbnail images.
- Title placement.
- Recommendation algorithm.
- UI elements.

Data-driven decisions.

## Trade-offs

- Microservice complexity vs scalability.
- Encoding storage vs adaptive quality.
- Recommendation accuracy vs compute cost.
- OCA hardware cost vs ISP partnership benefit.

## Engineering Lessons

1. Own your CDN if you can.
2. Embrace failure (chaos engineering).
3. Microservice + DevOps maturity.
4. Data-driven (A/B everything).
5. Cloud-native, multi-region.

## Chapter Summary

- Netflix = Open Connect CDN + AWS microservices.
- Adaptive bitrate (HLS/DASH) - network-aware.
- 700+ microservices - mature DevOps.
- Recommendations drive 80% of viewing.
- Chaos engineering - resilience built-in.

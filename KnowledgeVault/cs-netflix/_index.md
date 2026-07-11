---
id: cs-netflix
title: "Case Study: Netflix"
created: 2026-07-11
modified: 2026-07-11
tags: [system-design, case-study, cdn, streaming, microservices]
parent: case-studies
children: []
status: draft
---

## Overview

Netflix serves 200+ million subscribers across 190+ countries and accounts for 15-35% of world internet bandwidth at peak. Its architecture is a masterclass in combining a self-built CDN with cloud-native microservices to deliver adaptive video at global scale.

## Key Concepts

- Open Connect (OCA) — Netflix's own CDN, hardware installed for free in ISP data centers to cache popular content locally.
- Adaptive bitrate streaming (HLS/DASH) — video split into chunks, each available in multiple qualities; the player switches based on network conditions.
- Massive encoding pipeline — each title is encoded into thousands of versions (bitrate × codec × language × subtitle).
- 700+ microservices on AWS, with open-source tooling (Eureka, Zuul, Spinnaker) for discovery, routing, and deployment.
- Recommendation system driving ~80% of viewing, combining collaborative filtering, content-based, and deep-learning models.
- Chaos engineering (Chaos Monkey, Chaos Kong) to continuously verify production resilience.

## Core Knowledge

Netflix's delivery backbone is Open Connect: purpose-built appliances (OCAs) placed inside 100+ ISP networks, free to the ISP, that pre-cache popular titles based on predictable regional viewing patterns. This keeps most streaming traffic a short network hop from the viewer and saves ISPs external bandwidth. On a cache miss, requests fall back to AWS origin. Video ingestion turns one master file into thousands of derived files — multiple bitrates (240p to 4K), multiple codecs (H.264, H.265, AV1), multiple audio languages, and multiple subtitle tracks — chunked into ~10-second segments for adaptive bitrate streaming, so the player can drop or raise quality as network conditions change without interrupting playback.

Everything else runs as cloud-native microservices on AWS: account/billing, catalog/metadata, search/recommendation, playback/encoding, and analytics, backed by S3 (master storage), Cassandra and DynamoDB (state and viewing history), and a Kafka-to-Redshift analytics pipeline. Netflix pioneered several open-source tools now industry-standard: Eureka (service discovery), Zuul (API gateway), Spinnaker (continuous delivery), and the deprecated Hystrix (circuit breaker). Recommendations are retrained in batch via Spark on behavioral logs from Kafka, scored in real time, cached, and continuously A/B tested alongside thumbnails, UI layout, and ranking. Resilience is verified rather than assumed: Chaos Monkey randomly kills instances, Latency Monkey injects delay, and Chaos Kong fails an entire region, all against a multi-region active-active deployment.

## Interview Questions

**Q: Why does Netflix run its own CDN instead of using a third-party one?**
A: Predictable viewing patterns (popular titles peak at known hours) make it cost-effective to pre-cache content on hardware placed directly inside ISP networks, cutting latency and saving both parties bandwidth — a trade-off only worthwhile at Netflix's scale.

**Q: How does adaptive bitrate streaming keep playback smooth on a bad connection?**
A: Video is pre-chunked into short segments available at multiple bitrates; the player continuously measures network throughput and requests the next chunk at whatever quality it can sustain without stalling.

**Q: Why encode a single movie into thousands of files?**
A: Each combination of bitrate, codec, audio language, and subtitle track is a distinct file, so adaptive streaming and global/device diversity multiply out combinatorially — a storage-for-flexibility trade-off.

## Scenario

A user in Bangladesh presses play. Because their local ISP hosts an OCA, the encoded chunks stream from that on-premise cache rather than crossing an ocean to AWS origin — the player picks chunk quality adaptively as the connection fluctuates, and the watch position is saved periodically so playback can resume on another device.

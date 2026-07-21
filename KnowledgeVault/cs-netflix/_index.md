---
id: cs-netflix
title: "Case Study: Netflix"
created: 2026-07-11
modified: 2026-07-22
tags: [system-design, case-study, cdn, streaming, microservices]
parent: case-studies
children: []
status: draft
---

## Overview

Netflix serves over 200 million subscribers in more than 190 countries, and uses 15-35% of world internet bandwidth at peak times. Its architecture is a great example of combining a CDN it built itself with cloud-native microservices to deliver adaptive video at global scale.

## Key Concepts

- Open Connect (OCA) — Netflix's own CDN; hardware placed for free in ISP data centers to store popular content locally
- Adaptive bitrate streaming (HLS/DASH) — video split into chunks, each available in multiple qualities; the player switches based on network conditions.
- Huge encoding pipeline — each title is turned into thousands of versions (bitrate x codec x language x subtitle)
- 700+ microservices on AWS, with open-source tooling (Eureka, Zuul, Spinnaker) for discovery, routing, and deployment.
- Recommendation system behind about 80% of viewing, combining collaborative filtering, content-based, and deep-learning models
- Chaos engineering (Chaos Monkey, Chaos Kong) constantly tests how strong production really is

## Core Knowledge

Netflix's delivery backbone is Open Connect: special hardware boxes (OCAs) placed inside more than 100 ISP networks, free to the ISP, that store popular titles ahead of time based on predictable regional viewing habits. This keeps most streaming traffic just a short network hop from the viewer and saves ISPs outside bandwidth. When there is a cache miss, the request falls back to the AWS origin. Video ingestion turns one master file into thousands of other files — many bitrates (240p to 4K), many codecs (H.264, H.265, AV1), many audio languages, and many subtitle tracks — cut into about 10-second pieces for adaptive bitrate streaming, so the player can lower or raise quality as the network changes without stopping playback.

Everything else runs as cloud-native microservices on AWS: account/billing, catalog/metadata, search/recommendation, playback/encoding, and analytics. These are backed by S3 (master storage), Cassandra and DynamoDB (state and viewing history), and a Kafka-to-Redshift analytics pipeline. Netflix was first to build several open-source tools that are now standard across the industry: Eureka (service discovery), Zuul (API gateway), Spinnaker (continuous delivery), and the now-retired Hystrix (circuit breaker). Recommendations are retrained in batches with Spark on behavior logs from Kafka, scored in real time, cached, and constantly A/B tested along with thumbnails, UI layout, and ranking. Netflix checks its resilience instead of just assuming it: Chaos Monkey randomly kills instances, Latency Monkey adds delay, and Chaos Kong fails a whole region — all against a deployment that is active in multiple regions at once.

## Interview Questions

**Q: Why does Netflix run its own CDN instead of using a third-party one?**
A: Predictable viewing patterns (popular titles peak at known hours) make it worthwhile to pre-cache content on hardware placed directly inside ISP networks, cutting delay and saving bandwidth for both sides — a trade-off that only makes sense at Netflix's scale.

**Q: How does adaptive bitrate streaming keep playback smooth on a bad connection?**
A: Video is cut ahead of time into short pieces available at several bitrates; the player constantly measures the network speed and asks for the next piece at whatever quality it can keep up with, without stalling.

**Q: Why encode a single movie into thousands of files?**
A: Each combination of bitrate, codec, audio language, and subtitle track is its own file, so adaptive streaming plus the many devices and regions multiply the count fast — a trade of storage for flexibility.

## Scenario

A user in Bangladesh presses play. Because their local ISP hosts an OCA, the encoded pieces stream from that local cache instead of crossing an ocean to the AWS origin. The player picks the quality of each piece as the connection changes, and the watch position is saved every so often so playback can pick up again on another device.

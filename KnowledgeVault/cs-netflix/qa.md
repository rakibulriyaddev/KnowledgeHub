---
title: "Case Study: Netflix — Q&A"
---

**Q: What is the name of Netflix's own CDN?**
A: Open Connect — OCA installed in ISP data centers.

**Q: What is an OCA?**
A: Open Connect Appliance - a cache server installed at the ISP — hardware Netflix provides free to the ISP.

**Q: What protocol is used for Adaptive Bitrate Streaming?**
A: HLS, DASH — network-aware quality switching.

**Q: What does adaptive bitrate do?**
A: Auto-adjusts quality based on network conditions — maintains smooth playback.

**Q: How many versions is a single movie encoded into?**
A: Multiple - bitrate × codec × audio language × subtitle = thousands — a massive encoding pipeline.

**Q: How many microservices does Netflix run?**
A: 700+ — a pioneer of microservices.

**Q: What is Netflix's Eureka?**
A: Service Discovery system — an open-source service registry.

**Q: What is Netflix's Hystrix?**
A: Circuit Breaker library (deprecated) — a pioneer of the resilience pattern.

**Q: What percentage of Netflix viewing is driven by recommendations?**
A: ~80% — personalization is core to engagement.

**Q: Netflix is all-in on AWS.**
A: True — cloud-native, multi-region active-active.

**Q: A user in Bangladesh is watching Netflix. Where does the movie data come from?**
A: The local ISP's OCA - nearest data source — OCA is local, faster, and saves ISP bandwidth.

**Q: A user's network becomes slow. What does the player do?**
A: Request a lower bitrate chunk - adaptive — the adaptive nature of HLS/DASH.

**Q: What does Chaos Monkey do?**
A: Randomly kills instances in production to verify resilience — a pioneer of chaos engineering.

**Q: What does Netflix A/B test?**
A: Thumbnails, titles, recommendations, UI - everything — a data-driven culture.

**Q: Netflix runs active-active across multiple regions.**
A: True — service stays available even if a region fails.

**Q: What does the recommendation pipeline use?**
A: Spark + ML pipeline + Kafka events — a batch + real-time hybrid.

**Q: What's the benefit to the ISP from hosting an OCA?**
A: Saves external bandwidth (Netflix traffic stays local) — mutually beneficial for the ISP and Netflix.

**Q: What is Netflix's Spinnaker?**
A: CD (Continuous Delivery) platform — multi-cloud deployment automation.

**Q: What does a manifest file (HLS/DASH) contain?**
A: A list of chunk URLs + quality options — playback instructions for the player.

**Q: At peak time, Netflix uses 15-35% of internet bandwidth.**
A: True — massive video delivery.

---
title: "Consistent Hashing — Q&A"
---

**Q: With naive modulo hashing, what percentage of keys remap when going from 4 → 5 servers?**
A: ~80% — Changing the modulo shifts the shard for almost every key.

**Q: With consistent hashing, how many keys remap when a server is added?**
A: K/N (much less) — Only the keys in one section of the ring - total/servers.

**Q: What data structure does consistent hashing operate on?**
A: A circular ring (hash space) — A circular ring from 0 to 2³².

**Q: In which direction is a key mapped to a server?**
A: Clockwise - to the next server — From the hash position, clockwise to the nearest server.

**Q: What is the main purpose of virtual nodes?**
A: Better load distribution + smooth failover — Giving each physical server many positions creates a uniform spread.

**Q: Without virtual nodes, consistent hashing can result in uneven distribution.**
A: True — With only a few positions, the spread isn't uniform.

**Q: Which DB uses consistent hashing?**
A: Cassandra — Core to Cassandra's key distribution.

**Q: What is AWS DynamoDB's internal sharding approach?**
A: Consistent hashing — The Dynamo paper introduced consistent hashing.

**Q: Memcached can use client-side consistent hashing.**
A: True — libketama, etc. - consistent hashing libraries built for Memcached.

**Q: What happens when a server fails?**
A: Its data goes to the next server clockwise — The keys in its range go to the next server - automatic failover.

**Q: A cluster goes from 10 → 11 servers. Naive vs Consistent - how much data moves?**
A: Naive ~91%, Consistent ~9% — Naive (modulo) moves almost everything; Consistent only moves K/N.

**Q: One server gets 5x the traffic of the others. What's the problem?**
A: Without vNodes - uneven distribution — The hash positions are uneven - use vNodes.

**Q: Which hash function is common in consistent hashing?**
A: Fast non-crypto: MurmurHash, xxHash — Speed matters - a cryptographic hash is overkill.

**Q: What is a typical replication factor?**
A: 3 — Most distributed systems use 3 replicas - a balance of durability and availability.

**Q: Consistent hashing requires a central coordinator.**
A: False — It's distributed-friendly - every node can compute it independently.

**Q: What is the downside of Rendezvous Hashing?**
A: O(N) - checks every server — For every key, it computes a hash against all N servers.

**Q: You have heterogeneous servers (different CPU, RAM). What do you do?**
A: Give the more powerful server more vNodes — Adjusting vNode count gives load proportional to capacity.

**Q: Where is Discord's chat history stored?**
A: A Cassandra cluster (consistent hashing) — Discord stores billions of messages in Cassandra.

**Q: Who introduced consistent hashing?**
A: 1997 MIT — Karger et al, MIT, 1997 - for distributed hash tables.

**Q: Implementing consistent hashing is trivial at production grade.**
A: False — vNodes, replication, failover - all complex to handle in production. Use a library.

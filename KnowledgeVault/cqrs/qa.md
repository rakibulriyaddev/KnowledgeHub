---
title: "CQRS — Q&A"
---

**Q: What does CQRS stand for?**
A: Command Query Responsibility Segregation.

**Q: What is the core idea of CQRS?**
A: Separate models for read and write — different responsibility, different model.

**Q: Which of these is part of the CQS principle?**
A: Command changes state; Query reads state — Bertrand Meyer's command-query separation.

**Q: What does the write model look like?**
A: Normalized — focused on integrity — The write side preserves data integrity.

**Q: What does the read model look like?**
A: Denormalized — optimized for queries — Fast reads, avoiding JOINs, pre-computed data.

**Q: In CQRS, the same DB can be used (light CQRS).**
A: True — Light CQRS uses separate models on the same DB; full CQRS uses separate DBs.

**Q: What is the primary benefit of CQRS?**
A: Independent scaling — read/write scale separately — In a read-heavy app, the read side can scale massively.

**Q: What is a challenge of CQRS?**
A: Eventual consistency + complexity — Sync delay plus maintaining two models.

**Q: CQRS fits well with Event Sourcing.**
A: True — A natural pair; events on the write side, projections on the read side.

**Q: Can Event Sourcing be done without CQRS?**
A: Yes — but it's less common — ES is technically possible without CQRS, but the benefit is limited.

**Q: A product catalog gets 10 million searches and 1,000 admin updates daily. Which pattern fits?**
A: CQRS — read from Elasticsearch, write to SQL — Highly skewed read-write ratio; CQRS is perfect.

**Q: A simple TODO app with 10 users. Should you use CQRS?**
A: No — overkill — CQRS overhead is wasted on a simple app.

**Q: What method is used to sync the read model?**
A: Event-driven or CDC (Change Data Capture) — Via async events or DB-level CDC.

**Q: What's the benefit of multiple read models?**
A: Different views from the same data — search, analytics, dashboard — Each view is optimized for its own need.

**Q: In CQRS, strong consistency is guaranteed everywhere.**
A: False — Typically eventually consistent; the read model lags.

**Q: What is CDC?**
A: Change Data Capture — streams DB change events — Debezium, Maxwell are popular CDC tools.

**Q: How should a read-model handler behave?**
A: Idempotent — correctly handles duplicate events too — Idempotency is needed because of at-least-once delivery.

**Q: Which read model is good for search?**
A: Elasticsearch / Solr — Elasticsearch is built for full-text search.

**Q: What does scaling look like in CQRS?**
A: Independent — read scales differently from write — Huge benefit when read-write is skewed 100:1.

**Q: It's good to apply CQRS right from the start.**
A: False — Migrate to it via refactoring; premature CQRS overhead is wasted.

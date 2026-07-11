---
title: "Message Brokers & Queues — Q&A"
---

**Q: What is the main role of a Message Broker?**
A: Async communication between producer and consumer — Decoupled async messaging middleware.

**Q: What happens in the Queue (point-to-point) pattern?**
A: One message is received by one consumer — Each message is consumed exactly once.

**Q: What happens in the Pub-Sub pattern?**
A: Every subscriber gets a copy of the message — Published to a topic; every subscriber gets the broadcast.

**Q: What category does Kafka fall into?**
A: Distributed log/stream platform — Kafka is a high-throughput distributed log.

**Q: Which protocol does RabbitMQ use?**
A: AMQP — RabbitMQ is a popular implementation of AMQP.

**Q: What is AWS's managed message queue service?**
A: SQS — SQS = Simple Queue Service.

**Q: What is Kafka's primary use case?**
A: High-throughput streaming, event log — Millions of messages/sec - the choice for streaming.

**Q: What is the job of a Dead Letter Queue?**
A: Where repeatedly failed messages go — Failed messages move to the DLQ for inspection.

**Q: Kafka messages are deleted after being processed.**
A: False — Kafka retains messages per its log retention period - replay is possible.

**Q: A RabbitMQ message is deleted once acked.**
A: True — Traditional broker - removed from the queue after ack.

**Q: What does at-least-once delivery guarantee?**
A: At least once (duplicates possible) — The most common - consumers need to be idempotent.

**Q: Where can exactly-once delivery be achieved?**
A: Via Kafka's transaction API — Kafka supports exactly-once (idempotent producer + transactions).

**Q: Order creation needs to trigger email/SMS/inventory updates. What strategy?**
A: Order created → event on a message broker → consumers process async — Respond to the user quickly; the rest happens in the background.

**Q: A real-time stock ticker - millions of events/sec. Which broker?**
A: Kafka — High-throughput streaming - exactly what Kafka is built for.

**Q: Why is consumer idempotency important?**
A: With at-least-once delivery - duplicates must process correctly — The same message arriving twice must produce the same result.

**Q: Where does Kafka guarantee ordering?**
A: Within a partition — FIFO within a single partition; no ordering guarantee across partitions.

**Q: What do you need for managing a message's schema?**
A: Avro/Protobuf - with versioning support — Schema evolution - backward-compatible serialization.

**Q: Which of these is NOT one of Kafka's strengths?**
A: Complex routing (header-based) — Complex routing is RabbitMQ's strength; Kafka uses simple topic-partitions.

**Q: A message broker can be a single point of failure - so clustering is recommended.**
A: True — In production: Kafka clusters, RabbitMQ HA pairs.

**Q: Which of these is NOT a benefit of a Message Broker?**
A: Always faster than a sync call — Async + network hops can be slower than a single sync call. But throughput is better.

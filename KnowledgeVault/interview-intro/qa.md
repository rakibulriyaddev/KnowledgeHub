---
title: "System Design Interviews - An Introduction — Q&A"
---

**Q: What is the first step of a system design interview?**
A: Clarify requirements (functional + non-functional) — without a clear scope, the design will head in the wrong direction.

**Q: What is a functional requirement?**
A: Features - what it can do — behavior, what the system does.

**Q: What is a non-functional requirement?**
A: Quality attributes - scale, latency, availability — how well the system performs.

**Q: What does capacity estimation do?**
A: Grounds the numbers in reality - DAU, QPS, storage, bandwidth — it helps you understand real-world scale.

**Q: What is Twitter's read/write ratio typically?**
A: ~100:1 (read-heavy) — most users only read; few write.

**Q: Thinking silently in an interview is good.**
A: False — communicate continuously, think aloud with the interviewer.

**Q: What is in the high-level architecture?**
A: A box-and-arrow diagram + main components — the major components and how they interact.

**Q: What happens in the deep dive?**
A: Details of a specific component - algorithm, schema, trade-offs — based on the interviewer's interest.

**Q: What are the approaches to Twitter timeline generation?**
A: Pull (lazy), Push (eager), Hybrid (celebrity-aware) — discuss the trade-offs.

**Q: Buzzwords (Kafka, Redis) are an automatic answer.**
A: False — justify why, based on the context.

**Q: The interviewer says "Design Twitter." What's the first question?**
A: "Which features are critical? What scale? What's the read/write ratio?" — scope clarification comes first.

**Q: A celebrity has 100M followers. When they tweet - injecting it into everyone's timeline is a problem?**
A: Hybrid: pull for the celebrity, push for normal users — handle hot users differently.

**Q: Is it OK to say "I don't know"?**
A: Yes - honesty is better than overconfidence — acknowledge gaps and show your reasoning approach.

**Q: What is the typical duration for "Design Twitter"?**
A: 45-60 minutes — the standard tech interview slot.

**Q: Memorizing one solution is the best strategy.**
A: False — you need to know the variations, interviewers add twists.

**Q: Why is discussing trade-offs important?**
A: Every architecture has pros and cons - it's senior engineering thinking — there's no silver bullet, it's pragmatic thinking.

**Q: What's the benefit of mock interview practice?**
A: Time management + communication + feedback — a rehearsal under real conditions.

**Q: Where can you learn about real production systems?**
A: Engineering blogs (Netflix, Uber, Airbnb) — big tech engineering blogs are a gold mine.

**Q: Which is not a common interview question?**
A: "Implement quicksort" — quicksort is a coding interview question; system design is open-ended.

**Q: DAU stands for Daily Active Users.**
A: True — a standard metric, the foundation of capacity estimation.

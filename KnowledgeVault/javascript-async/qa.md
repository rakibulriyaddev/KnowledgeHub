---
title: Interview Q&A
---

# Async / Await — Interview Q&A

### 1. Does `await` block the main thread?

No. It suspends the surrounding `async` function and yields control back to the
event loop; other work continues.

### 2. How do you run async tasks in parallel?

Start them before awaiting, or use `Promise.all`:

```js
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

### 3. What happens if you forget to `await`?

You get the Promise itself rather than its resolved value, and rejections become
unhandled.

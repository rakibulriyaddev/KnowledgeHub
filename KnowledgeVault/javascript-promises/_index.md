---
id: javascript-promises
title: Promises
created: 2026-06-10
modified: 2026-06-12
tags: [javascript, async, promises]
parent: javascript
children: []
---

# Promises

A **Promise** represents the eventual completion (or failure) of an asynchronous
operation and its resulting value.

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(1000)
  .then(() => console.log("1 second later"))
  .catch((err) => console.error(err));
```

## States

1. **pending** — initial state
2. **fulfilled** — completed successfully
3. **rejected** — failed

## Combinators

- `Promise.all` — wait for all, fail fast
- `Promise.allSettled` — wait for all, never rejects
- `Promise.race` — settle with the first to finish
- `Promise.any` — first to _fulfill_

Build on this with [async / await](/topic/javascript-async).

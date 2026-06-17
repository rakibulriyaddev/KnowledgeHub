---
id: javascript-async
title: Async / Await
created: 2026-06-01
modified: 2026-06-10
tags: [javascript, async, concurrency]
parent: javascript
children: []
---

# Async / Await

`async`/`await` is syntactic sugar over Promises that lets you write
asynchronous code that reads like synchronous code.

```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error("Request failed");
    return await res.json();
  } catch (err) {
    console.error("Could not load user:", err);
    return null;
  }
}
```

## Key ideas

- An `async` function always returns a **Promise**.
- `await` pauses the function until the awaited Promise settles.
- Wrap `await` in `try/catch` to handle rejections.

See also: [Promises](/topic/javascript-promises).

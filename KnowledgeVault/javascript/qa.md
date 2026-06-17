---
title: Interview Q&A
---

# JavaScript — Interview Q&A

### 1. What's the difference between `==` and `===`?

`==` performs type coercion before comparing; `===` compares value **and** type
without coercion. Prefer `===`.

```js
0 == "0"; // true  (coerced)
0 === "0"; // false (different types)
```

### 2. Explain `let`, `const`, and `var`.

- `var` — function-scoped, hoisted, re-assignable
- `let` — block-scoped, re-assignable
- `const` — block-scoped, **not** re-assignable (the binding, not the value)

### 3. What is a closure?

A closure is a function bundled with references to its surrounding state, giving
it access to an outer scope even after that scope has returned.

```js
function counter() {
  let count = 0;
  return () => ++count;
}

const next = counter();
next(); // 1
next(); // 2
```

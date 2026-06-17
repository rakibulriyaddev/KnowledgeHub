---
id: javascript
title: JavaScript
created: 2026-05-05
modified: 2026-06-15
tags: [programming, web, frontend, language]
parent: programming
children: [javascript-async, javascript-promises]
---

# JavaScript

**JavaScript** is a high-level, dynamically typed language that powers the
interactive web. It runs in browsers, on servers (Node.js), and almost
everywhere else.

## A quick taste

```js
// Greet every user in a list
const users = ["Ada", "Linus", "Grace"];

function greet(name) {
  return `Hello, ${name}!`;
}

for (const user of users) {
  console.log(greet(user));
}
```

## Primitive types

| Type        | Example             | Notes                        |
| ----------- | ------------------- | ---------------------------- |
| `string`    | `"hello"`           | UTF-16 text                  |
| `number`    | `42`, `3.14`        | IEEE-754 double              |
| `boolean`   | `true` / `false`    | logical values               |
| `null`      | `null`              | intentional absence          |
| `undefined` | `undefined`         | uninitialized                |
| `symbol`    | `Symbol("id")`      | unique identifiers           |
| `bigint`    | `9007199254740993n` | arbitrary-precision integers |

## Learning checklist

- [x] Variables and scope
- [x] Functions and closures
- [ ] Asynchronous programming
- [ ] The module system

Dive deeper into [async / await](/topic/javascript-async) and
[Promises](/topic/javascript-promises).

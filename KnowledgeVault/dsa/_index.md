---
id: dsa
title: "Data Structures & Algorithms"
created: 2026-07-11
modified: 2026-07-22
tags: [programming, algorithms, data-structures]
parent: null
children: []
status: draft
---

## Overview
Data Structures & Algorithms (DSA) is the study of how to organize data, and the step-by-step procedures that work on it to solve problems well. It is the topic interviewers ask about most directly, and the way of thinking behind it — complexity analysis, tradeoffs — sits underneath every other decision about performance and scale.

## Key Concepts
- Data structures — arrays, linked lists, stacks, queues, trees, graphs, hash tables, heaps
- Algorithm paradigms — brute force, divide and conquer, greedy, dynamic programming, backtracking
- Complexity analysis — Big-O/Θ/Ω for time and space, best/average/worst case
- Searching and sorting — binary search, quicksort, mergesort, heapsort and their tradeoffs
- Graph algorithms — traversal (BFS/DFS), shortest path, topological sort, union-find

## Core Knowledge
- Big-O describes how fast something grows, not how fast it actually runs — an algorithm with a lower order can still be slower on small inputs, because of constant factors
- Picking the right data structure is usually the real lever to pull — the right structure can make the algorithm almost trivial (for example, a hash map turns an O(n²) lookup into O(n))
- Trading space for time shows up everywhere — memoization, caching, and hash-based structures all use more memory to gain speed
- Amortized analysis matters — adding to a dynamic array is O(1) on average, even though it occasionally needs an O(n) resize
- Recursion vs iteration — recursive solutions are often easier to read, but risk a stack overflow and hidden extra cost; tail-call optimization is not guaranteed in most languages
- Stability and whether a sort works in-place are properties interviews often skip, but production code cares about them
- Choosing how to represent a graph (adjacency list vs matrix) changes both the memory used and the algorithm's complexity
- NP-hardness is the real-world limit — knowing a problem is NP-hard is a good reason to use a heuristic or approximation instead of trying for an exact answer

## Interview Questions
**Q:** What's the difference between time and space complexity?
**A:** Time complexity measures how runtime grows as the input gets bigger; space complexity measures how memory use grows. Both are written in a way that ignores the exact hardware.

**Q:** When would you use a hash table over a balanced BST?
**A:** Use a hash table when order does not matter — it gives average O(1) lookup and insert. Use a BST when you need sorted data or range queries, at the cost of O(log n).

**Q:** Why is quicksort often preferred over mergesort despite both being O(n log n)?
**A:** Quicksort works in-place, so it uses the cache better and has lower constant costs, though its worst case is O(n²) without a good pivot choice. Mergesort always stays at O(n log n), but needs O(n) of extra space.

**Q:** What makes a problem a good candidate for dynamic programming?
**A:** Two things: optimal substructure (the answer is built from the best answers to smaller subproblems), and overlapping subproblems (a plain recursive solution would solve the same subproblem again and again).

## Scenario
A service needs to answer "have we seen this ID before?" millions of times a second, on a dataset that keeps growing. Using a hash set instead of scanning a list turns an O(n) check into an average O(1) one. Seeing this as a choice about data structure, not about tuning an algorithm, is the DSA mindset in practice.

---
id: dsa
title: "Data Structures & Algorithms"
created: 2026-07-11
modified: 2026-07-11
tags: [programming, algorithms, data-structures]
parent: null
children: []
status: draft
---

## Overview
Data Structures & Algorithms (DSA) is the study of how to organize data and the step-by-step procedures that operate on it to solve problems efficiently. It's the foundation interviewers probe most directly, and the reasoning toolkit (complexity analysis, tradeoffs) underlies every other engineering decision about performance and scale.

## Key Concepts
- Data structures — arrays, linked lists, stacks, queues, trees, graphs, hash tables, heaps
- Algorithm paradigms — brute force, divide and conquer, greedy, dynamic programming, backtracking
- Complexity analysis — Big-O/Θ/Ω for time and space, best/average/worst case
- Searching and sorting — binary search, quicksort, mergesort, heapsort and their tradeoffs
- Graph algorithms — traversal (BFS/DFS), shortest path, topological sort, union-find

## Core Knowledge
- Big-O describes growth rate, not actual speed — a lower-order algorithm can lose to a higher-order one on small inputs due to constants
- Choice of data structure is usually the real lever — the right structure often makes the algorithm trivial (e.g. hash map turns O(n²) lookup into O(n))
- Space-time tradeoff is pervasive — memoization, caching, and hash-based structures trade memory for speed
- Amortized analysis matters — dynamic array append is O(1) amortized despite occasional O(n) resizes
- Recursion vs iteration — recursive solutions are often clearer but risk stack overflow and hidden overhead; tail-call optimization isn't guaranteed in most languages
- Stability and in-place-ness are sorting-algorithm properties interviews often skip but production code cares about
- Graph representation choice (adjacency list vs matrix) changes both memory and algorithm complexity
- NP-hardness is the practical boundary — recognizing a problem is NP-hard justifies reaching for heuristics/approximations instead of an exact solution

## Interview Questions
**Q:** What's the difference between time and space complexity?
**A:** Time complexity measures how runtime grows with input size; space complexity measures how memory usage grows — both are expressed asymptotically, independent of hardware.

**Q:** When would you use a hash table over a balanced BST?
**A:** Hash tables give average O(1) lookup/insert when order doesn't matter; BSTs give O(log n) but keep data sorted and support range queries/ordered traversal.

**Q:** Why is quicksort often preferred over mergesort despite both being O(n log n)?
**A:** Quicksort has better cache locality and lower constant factors (in-place), though worst case is O(n²) without good pivot selection; mergesort guarantees O(n log n) but needs O(n) extra space.

**Q:** What makes a problem a good candidate for dynamic programming?
**A:** Optimal substructure (solution built from optimal solutions to subproblems) plus overlapping subproblems (naive recursion recomputes the same subproblem repeatedly).

## Scenario
A service needs to answer "have we seen this ID before?" millions of times per second across a growing dataset. Reaching for a hash set instead of scanning a list turns an O(n) check into O(1) average, and recognizing this as a data-structure choice rather than an algorithm-tuning problem is the DSA mindset in practice.

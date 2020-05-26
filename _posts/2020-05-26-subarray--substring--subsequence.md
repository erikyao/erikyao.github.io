---
layout: post
title: "Subarray / Substring / Subsequence"
description: ""
category: LeetCode
tags: []
---
{% include JB/setup %}

## Subsequence

**Definition:** Let $\langle x_n \rangle$ be a sequence in a set $S$. Let $\langle n_r \rangle$ be a strictly increasing sequence of indices in $\mathbb{N}$. Then the composition $\langle x_{n_r} \rangle$ is called a **subsequence** of $\langle x_n \rangle$.

- E.g., the prime numbers $\mathbb{P}$ are a subsequence of the natural numbers $\mathbb{N}$.

描述性的定义：a subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

- E.g., $\langle A, C \rangle$ could be a subsequence of $\langle A, B, C \rangle$, but not a subarray

## Subarray

A subarray is a contiguous/consecutive subsequence of an array. 

By contiguous/consecutive, 我觉得它的意思是 sequence of indices $\langle n_r \rangle$ is a sequence of consecutive integers $\langle m, m+1, m+2, \dots \rangle$

## Substring

A substring is exactly the same thing as a subarray but in the context of strings.
---
layout: post
title: "Minimum vs Minimal w.r.t. generalized inequality"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

假定有一个 proper cone $K$，它定义了一个 generalized inequality 关系 $\preceq_K$。

注意 generalized inequality $\preceq$ 与 $\mathbb{R}$ 上的 $\leq$ 的最大的一个区别在于：

- $\mathbb{R}$ 上的 $\leq$ 是一个 linear ordering (线性序)，也就是说 $\forall x, y$，要么 $x \leq y$ 要么 $y \leq x$，总有一个成立
- $\preceq$ 可能出现 "不可比" 的情况，即 $x \npreceq y$ 但同时 $y \npreceq x$

这个区别是 minimum 与 minimal 区别的根本原因。看定义：

- 如果 $\exists x \in S: \forall y: x \preceq_K y$，我们称 $x$ 是 $S$ 的 minimum (w.r.t. $\preceq_K$，下同，省略)
- 如果 $\exists x \in S$ 使得 $\forall y \preceq_K x \Rightarrow y = x$，我们称 $x$ 是 $S$ 的 minimal element

这俩的区别在于：

- $x$ is minimum：$S$ 内所有元素皆与 $x$ "可比"，且小于等于 $x$
    - 亦即不存在与 $x$ "不可比" 的元素
- $x$ is minimal：$S$ 内所有与 $x$ "可比" 的元素皆小于等于 $x$
    - 所以可能存在与 $x$ "不可比" 的元素
- 用英语描述的话:
    - minimum 是 "I am definitely the smallest"
    - minimal 是 "Nothing is smaller than me"

性质：

- $S$ 上可能有多个 minimal，但是只可能有一个 minimum
- Minimum 必定是 minimal，反之不成立
- 对 $\mathbb{R}$ 上的 $\leq$ 而言，minimum 和 minimal 等价 (这条性质应该对 linear ordering 都有效)

[Dr. Robert Harron 在 Quora 上举了个很好的例子](https://www.quora.com/Whats-the-difference-between-minimum-and-minimal-in-mathematics/answer/Robert-Harron)：假设 $S$ 是所有大于等于 2 的整数的集合，$x \preceq y \iff x \text{ divides } y$ ($x$ 整除 $y$；$y$ 被 $x$ 整除)，那么所有的 prime number 都是 minimal，不存在 minimum
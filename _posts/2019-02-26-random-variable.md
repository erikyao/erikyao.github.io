---
layout: post
title: "Random Variable"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

主要参考：[NOTES ON PROBABILITY - Greg Lawler](https://www.math.uchicago.edu/~lawler/probnotes.pdf)

## 预备知识 (一) $\sigma$-algebra 

非常蛋疼的一个事实：$\sigma$-algebra 并不是一个严格意义上的 algebra……

**Definition:** In mathematical analysis and in probability theory, a $\sigma$-algebra on a set $S$ is a subset $\Sigma \subset 2^S$ that includes $S$ itself. It is closed under complement and countable unions.

- 因为 $S \in \Sigma$ 同时它是 closed under complement，所以 $\varnothing \in \Sigma$
- $\sigma$-algebra, $\sigma$-ring 和 $\sigma$-field 都是有关系的，但这里不表

## 预备知识 (二) Borel Set / Borel $\sigma$-algebra

> In mathematics, a Borel set is any set in a topological space that can be formed from open sets (or, equivalently, from closed sets) through the operations of countable union, countable intersection, and relative complement.

- relative complement of $A$ in $B$ 就是 $A - B$
- relative complement of $B$ in $A$ 就是 $B - A$

> For a topological space $X$, the collection of all Borel sets on $X$ forms a $\sigma$-algebra $\mathcal{B}$, known as the Borel algebra or Borel $\sigma$-algebra. The Borel $\sigma$-algebra on $X$ is the smallest $\sigma$-algebra containing all open sets (or, equivalently, all closed sets).

## 预备知识 (三) Measurable Function / Measurable Space

**Definition:** A **measurable space** is a tuple of $(S, \Sigma)$ where $S$ is a set and $\Sigma$ is a $\sigma$-algebra over $S$.

- measurable space 又称 Borel space

**Definition:** Let $(X, \Sigma_X)$ and $(Y, \Sigma_Y)$ be measurable spaces. Function $f:X \to Y$ is called a **measurable function** if $\forall E_Y \in \Sigma_Y, f^{-1}(E_Y) \in \Sigma_X$ 

- $f^{-1}$ 是 inverse function
- $f^{-1}(E_Y) = \lbrace x \in X \vert f(x) \in E_Y \rbrace$
- 这个定义相当于：$\forall E_Y \in \Sigma_Y, \exists E_X \in \Sigma_X$ 使得 $f(E_X) = E_Y$
    - 这个 $E_X$ 即 $f^{-1}(E_Y)$
- 为了强调 $f$ 是一个 measurable function，我们也可以把它写作 $f: (X, \Sigma_X) \to (Y, \Sigma_Y)$

## 预备知识 (四) Measure / Mesure Space

**Definition:** Let $(S, \Sigma)$ be a measurable space. Function $\mu: \Sigma \to \mathbb{R} \cup \lbrace -\infty, \infty \rbrace$ is called a **measure** if it satisfies the following properties:

1. **Non-negativity:** $\forall E \in \Sigma, \mu(E) \geq 0$
    - 注：存在 signed measure 可以不满足这个条件
1. **Null empty set:** $\mu(\varnothing) = 0$
1. **Countable additivity (or $\sigma$-additivity):** $\forall \text{ countable collection } \lbrace E_i \rbrace^{\infty}_{i=1}$ where $E_i \in \Sigma, \forall i$ and $E_i \cap E_j = \varnothing, \forall i, j$:

$$
\mu \left( \bigcup _ { k = 1 } ^ { \infty } E _ { k } \right) = \sum _ { k = 1 } ^ { \infty } \mu \left( E _ { k } \right)
$$

**Definition:** A **measure space** is such a triple of $(S, \Sigma, \mu)$

## 预备知识 (五) Probability Measure / Probability Space

**Definition:** Measure $\mu$ is probability measure if $\mu(S) = 1$.

- $S$ 指全集

**Definition:** A **probability space** is a measure space with a probability measure, denoted by $(\Omega, \mathcal{F}, \mathbb{P})$ where:

- $\omega \in \Omega$ is called an **outcome**
- $E \in \mathcal{F}$ is called an **event**
- $\mathbb{P}: \mathcal{F} \to [0,1]$ is a probability measure
    - $\mathbb{P}(E)$ is the probability of $E$

## 预备知识 (三)(四)(五) 总结

- measurable function $f$ 定义在 measurable space $(S, \Sigma)$ 上
- measurable function $f$ 有潜力构成一个 measure $\mu$
- measure $\mu$ + measurable space $(S, \Sigma)$ = measure space $(S, \Sigma, \mu)$
    - probability measure $\mathbb{P}$ 是特殊的 measure
    - 装备 probability measure 的 measure space 是 probability space $(\Omega, \mathcal{F}, \mathbb{P})$

## Random Variable

**Definition:** A random variable $X$ is a measurable function $X: (\Omega, \mathcal{F}) \to (\mathbb{R}, \mathcal{B})$

- 准确来说应该是 $\mathbb{R} \cup \lbrace -\infty, \infty \rbrace$ 而不仅仅是 $\mathbb{R}$
- $\mathcal{B}$ 是 $\mathbb{R}$ 上的 Borel $\sigma$-algebra

以投骰子为例 (一个骰子，仅投一次)：

- $\Omega = \lbrace 1,2,3,4,5,6 \rbrace$
- $\mathcal{F}$ 包括但不限于 $\Omega$、$\lbrace 1 \rbrace$、$\lbrace 2 \rbrace$、$\lbrace 3 \rbrace$、$\lbrace 4 \rbrace$、$\lbrace 5 \rbrace$、$\lbrace 6 \rbrace$
- 我们可以定义 $X(\lbrace 1 \rbrace) = X(\lbrace 2 \rbrace) = X(\lbrace 3 \rbrace) = X(\lbrace 4 \rbrace) = X(\lbrace 5 \rbrace) = X(\lbrace 6 \rbrace) = \frac{1}{6}$，其余的 $X(?) = 0$
    - 这么一来，$X = \mathbb{P}$，可以构成一个完全体的 probability space $(\Omega, \mathcal{F}, X)$
- 当然，也没有地方规定说一定要有 $X = \mathbb{P}$，所以说 random variable 就是一个任意的 measurable variable

写到这里，有一个很严重的问题：$\mathbb{P}(X = 3)$ 这种写法如何解释？

- 首先 $3$ 应该是 $\lbrace 3 \rbrace$ 这个 event，花括号被省略了
- $\mathbb{P}(X = 3)$ 应该可以解释为：函数值 $X(\lbrace 3 \rbrace)$ 对应的 preimage (which is an event) 的概率是多少？当 $X = \mathbb{P}$ 的时候，这就是个画蛇添足的写法，因为此时 $\mathbb{P}(X = 3) = \mathbb{P}(\lbrace 3 \rbrace)$
    - 你硬要解释 $X = 3$ 的话，可以理解为 $X^{-1} \big ( X(\lbrace 3 \rbrace) \big )$ (当然这是不严谨的，$X^{-1}(\frac{1}{6})$ 可以是任何 dice face，不一定是 $\lbrace 3 \rbrace$)
- 另外还有一个约定的写法是 $X^{-1}(B) = \lbrace X \in B \rbrace = \lbrace \omega \in \Omega : X(\omega) \in B \rbrace \in \mathcal{F}$ where $B \in \mathcal{B}$

## 2. Distribution of a random variable
---
layout: post
title: "Convex Functions / Jensen's Inequality / Jensen's Inequality on Expectations / Gibbs' Inequality / Entropy"
description: ""
category: Math
tags: [convex, entropy]
---
{% include JB/setup %}

首先明确两点：

1. Jensen's Inequality is the property of convex functions. Convex function 本身就是通过 Jensen's Inequality 定义的，它们基本就是一回事
1. 在不同的领域，对 Jensen's Inequality 做不同的展开，可以得到该特定领域的新的 inequality；所以说 Jensen's Inequality 可以看做是一个总纲
    - 基本套路是：该领域有一个 convex function，按 Jensen's Inequality 展开，得到领域内概念 A 小于概念 B

## 1. Convex Function / Jensen's Inequality

Let $X$ be a convex set in a real vector space and let $f: X \rightarrow {\mathbb{R}}$ be a function.

- Definition of convex functions
    - $f$ is called **convex** if $f$ statisfies Jensen's Inequality.
- Jensen's Inequality
    - $\forall x_{1}, x_{2} \in X, \forall t \in [0,1] :\qquad f(t x_{1} + (1-t) x_{2}) \leq t f(x_{1}) + (1-t) f(x_{2})$
- Definition of concave functions
    - $f$ is said to be **concave** if $−f$ is convex.

## 2. Jensen's Inequality on Expectations

If $X$ is a random variable and $f$ is a convex function:

$$
f(p_1 x_1 + p_2 x_2 + \dots + p_n x_n) \leq p_1 f(x_1) + p_2 f(x_2) + \dots + p_n f(x_n)
$$

LHS is essentially $f(\mathrm{E}(X))$ and RHS $\mathrm{E}(f(X))$, which together give

$$
f(\mathrm{E}(X)) \leq \mathrm{E}(f(X))
$$

## 3. Gibbs' Inequality

Let $p = \lbrace p_1, p_2, \dots, p_n \rbrace$ be the true probability distribution for $X$ and $q = \lbrace q_1, q_2, \dots, q_n \rbrace$ be another probability distribution (你可以认为一个假设的 $X$ distrbution). Construct a random variable $Y$ who follows $Y(x) = \frac{q(x)}{p(x)}$. Given $f(y) = -\log(y)$ is a convex function, we have:

$$
f(\mathrm{E}(Y)) \leq \mathrm{E}(f(Y))
$$

Therefore:

$$
\begin{aligned}
-\log \sum_{i} \big ( p_i \frac{q_i}{p_i} \big ) & \leq \sum_{i} p_i \big (-\log \frac{q_i}{p_i} \big ) \newline
-\log 1 & \leq \sum_{i} p_i \log \frac{p_i}{q_i} \newline
0 & \leq \sum_{i} p_i \log \frac{p_i}{q_i}
\end{aligned}
$$

如果我们用的是 $\log_2$ 的话，可以称 RHS 为 [**Kullback–Leibler divergence**](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence) or **relative entropy** of $p$ with respect to $q$：

$$
D_{KL}(p \Vert q) \equiv \sum_{i} p_i \log_2 \frac{p_i}{q_i} \geq 0
$$

这个式子我们称为 Gibbs' Inequality.

我们接着变形：

$$
\begin{aligned}
D_{KL}(p \Vert q) \equiv \sum_{i} p_i \log_2 \frac{p_i}{q_i} &= \sum_{i} p_i \log_2 p_i - \sum_{i} p_i \log_2 q_i \newline
                                                             &= -H(p) + H(p, q) \geq 0
\end{aligned}
$$

- $H(p)$ is the **entropy** of distribution $p$
- $H(p, q)$ is the **cross entropy** of distributions $p$ and $q$
- $H(p) \leq H(p, q) \Rightarrow$ the information entropy of a distribution $p$ is less than or equal to its cross entropy with any other distribution $q$

### Interpretations of $D_{KL}(p \Vert q)$

- In the context of **machine learning**, $D_{KL}(p \Vert q)$ is often called the **information gain** achieved if $q$ is used instead of $p$ (This is why it's also called the **relative entropy** of $p$ with respect to $q$). 
- In the context of **coding theory**, $D_{KL}(p \Vert q)$ can be construed as measuring the expected number of extra bits required to code samples from $p$ using a code optimized for $q$ rather than the code optimized for $p$.
- In the context of **Bayesian inference**, $D_{KL}(p \Vert q)$ is amount of information lost when $q$ is used to approximate $p$.
- 简单说，$D_{KL}(p \Vert q)$ 可以衡量两个 distribution $p$ 和 $q$ 的 "接近程度"
    - 如果 $p=q$，那么 $D_{KL}(p \Vert q) = 0$
    - $p$ 和 $q$ 差异越大，$D_{KL}(p \Vert q)$ 越大
---
category: Math
description: ''
tags: []
title: Ring / Ring of sets
---

我研究一下 ring 主要是因为我看到有些 measure 的定义用到了 $\delta$-ring，但是后来我决定暂时不用这个定义……

## Ring 

**Definition:** A ring is a set $R$ equipped with two binary operations $+$ and $\cdot$ satisfying the following 3 ring axioms:

1. $R$ is an abelian group under addition, meaning that:
    - **$+$ is associative:** $\forall a, b, c \in R$, $(a + b) + c = a + (b + c)$
    - **$+$ is commutative:** $\forall a, b \in R$, $a + b = b + a$
    - **$0$ is the additive identity:** $\exists 0 \in R$ such that $\forall a \in R$, $a + 0 = a$
    - **$−a$ is the additive inverse of $a$:** $\forall a \in R$, $\exists −a \in R$ such that $a + (−a) = 0$
1. $R$ is a monoid under multiplication, meaning that:
    - **$\cdot$ is associative:** $\forall a, b, c \in R$, $(a \cdot b) \cdot c = a \cdot (b \cdot c)$
    - **$1$ is the multiplicative identity:** $\exists 1 \in R$ such that $\forall a \in R$, $a \cdot 1 = a \text{ and } 1 \cdot a = a$
1. Multiplication is distributive with respect to addition, meaning that:
    - **Left distributivity:** $\forall a, b, c \in R$, $a \cdot (b + c) = (a \cdot b) + (a \cdot c)$ 
    - **Right distributivity:** $\forall a, b, c \in R$, $(b + c) \cdot a = (b \cdot a) + (c \cdot a)$

那现在我们有一个集合 $S$，我们可以在 $S$ 上定义一个 ring $R = (2^S, \bigtriangleup, \cap)$，其中：

1. $2^S$ 是 power set，即 $S$ 全部子集的集合
    - 题外话：这个写法其实有讲究。参 [When we have the power set $2^S$, does the $2$ actually mean anything?](https://math.stackexchange.com/a/1442522)
    - If $A$ and $B$ are sets, define $A^B = \lbrace f \vert f: B \to A \rbrace$
    - Define $2 = \lbrace 0, 1 \rbrace$ (or any set of 2 elements). Any $f \in \lbrace 0, 1 \rbrace^S = 2^S$ is equivalent to a subset $S_f = \lbrace s \in S \vert f(s) = 1 \rbrace$
    - 所以 $2^S$ 可以表示 $S$ 全部子集的集合
1. $\bigtriangleup$ 在这里扮演 $+$ 的角色
    - $\bigtriangleup$ 指 symmetric difference 操作 (即 XOR)，参 [Power Set of $X$ is a Ring with Symmetric Difference, and Intersection](https://math.stackexchange.com/a/1986987)
    - 操作定义：$X \bigtriangleup Y= (X-Y) \cup (Y-X) = (Y-X) \cup (X-Y) = Y \bigtriangleup X$
    - $\varnothing$ 在这里扮演 $0$ 的角色
    - $(-X) = X$，只有这样才能使 $X \bigtriangleup (-X) = X \bigtriangleup X = \varnothing$
1. $\cap$ 在这里扮演 $\cdot$ 的角色
    - $S$ 在这里扮演 $1$ 的角色

这个 ring 我们称为 Boolean Ring。

## Ring of sets / $\sigma$-ring / $\delta$-ring

非常遗憾的是，**有一系列定义于集合上的 ring 其实并不严格满足 ring 的定义** (:angry:)。按 [Ring of Sets vs Ring in Universal Algebra](https://math.stackexchange.com/questions/2000075/ring-of-sets-vs-ring-in-universal-algebra) 的讨论：

> A "ring of sets" should really be called a "distributive lattice of sets."

这个不严格的 ring of sets，或者干脆 distributive lattice of sets 的定义是：

**Definition:** In measure theory, a nonempty family of sets $\mathcal{R}$ is called a ring (of sets) if it is closed under $\cup$ and $-$. That is, the following two statements are true for all sets $A$ and $B$,

1. If $A, B \in \mathcal{R} \Rightarrow A \cup B \in \mathcal{R}$
1. If $A, B \in \mathcal{R} \Rightarrow A - B \in \mathcal{R}$

- 如果 $\cup$ 对应 $+$，那么无法为 $-$ 找到 multiplicative identity
- 如果 $-$ 对应 $+$，那么基本的 commutative 都无法成立
- 所以无论 $(\mathcal{R}, \cup, -)$ 还是 $(\mathcal{R}, -， \cup)$ 都无法构成严格的 ring

但是蛋疼的是，后续的 $\sigma$-ring 和 $\delta$-ring 都是在这个不严格的定义上引申出来的：

**Definition:** A $\sigma$-ring is a ring of sets which is closed under countable unions, i.e.

$$
\text{If } A_1, A_2, \ldots \in \mathcal R \Rightarrow \bigcup_{n=1}^\infty A_n \in \mathcal R
$$

**Definition:** A $\delta$-ring is a ring of sets which is closed under countable intersections, i.e.

$$
\text{If } A_1, A_2, \ldots \in \mathcal R \Rightarrow \bigcap_{n=1}^\infty A_n \in \mathcal R
$$
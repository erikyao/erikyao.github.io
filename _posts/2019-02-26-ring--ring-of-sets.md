---
category: Math
description: ''
tags: []
title: Ring of Sets
---

写这篇主要是因为我看到有些 measure 的定义用到了 $\delta$-ring.

# Ring of Sets

Ring 的定义可以参考 [Elementary Algebraic Structures](/math/2024/04/07/elementary-algebraic-structures#ring-rightarrow-addition-invertible-semiring-r-boldsymbol-boldsymboltimes-bar0-bar1)

非常遗憾的是，**ring of sets 其实并不严格满足 ring 的定义** (:angry:)。按 [Ring of Sets vs Ring in Universal Algebra](https://math.stackexchange.com/questions/2000075/ring-of-sets-vs-ring-in-universal-algebra) 的讨论：

> A "ring of sets" should really be called a "distributive lattice of sets."

**Definition:** In measure theory, a nonempty family of sets $\mathcal{R}$ is called a ring (of sets) if it is closed under $\cup$ and $-$. That is, $\forall$ set $A,B \in R$,

1. $A \cup B \in \mathcal{R}$
2. $A - B \in \mathcal{R}$

# Ring of sets / $\sigma$-ring / $\delta$-ring

但是蛋疼的是，后续的 $\sigma$-ring 和 $\delta$-ring 都是在这个不严格的定义上引申出来的：

**Definition:** A $\sigma$-ring is a ring of sets which is closed under countable unions, i.e.

$$
\text{If } A_1, A_2, \ldots \in \mathcal R \Rightarrow \bigcup_{n=1}^\infty A_n \in \mathcal R
$$

**Definition:** A $\delta$-ring is a ring of sets which is closed under countable intersections, i.e.

$$
\text{If } A_1, A_2, \ldots \in \mathcal R \Rightarrow \bigcap_{n=1}^\infty A_n \in \mathcal R
$$
---
title: "Order-Theoretic Definition of Lattices"
description: ""
category: Math
tags: []
toc: true
toc_sticky: true
---

参考: [https://math.hawaii.edu/~jb/math618/os2uh_17.pdf](https://math.hawaii.edu/~jb/math618/os2uh_17.pdf)

# 引子：Pre-ordering on Monoids

某些 [Elementary Algebraic Structures](/math/2024/04/07/elementary-algebraic-structures) 由其定义可以很自然地引出一些 ordering 的结构，比如 [wikipedia: Monoid](https://en.wikipedia.org/wiki/Monoid#Commutative_monoid) 说：

> Any commutative monoid is endowed with its algebraic preordering $\leq$, defined by $x \leq y$ if there exists $z$ such that $x + z = y$.

并不是说 "只有 commutative monoid 才有 pre-order"，Non-commutative 的 monoid 也可以有，见 [讨论](https://math.stackexchange.com/questions/2463279/natural-pre-order-for-non-commutative-monoids)。可能是 commutative monoid 的 pre-order 更普遍，具体的细节我们不用深究。
{: .notice--info}

# Order-Theoretic Definition of Semilattices

Poset = Partially Ordered Set. 这个简写还蛮常用的。
{: .notice--info}

**Theorem 2.1: Meet semilattices 与 Posets 等价**

(1) Meet Semilattice $(R, \wedge)$ $\Rightarrow$ Poset $(R, \leq)$

In a meet semilattice $(R, \wedge)$, define $x \leq y \iff x \wedge y = x$. Then $(R, \leq)$ is a poset  in which $\forall$ pair of elements $(x, y)$ has a greatest lower bound $\operatorname{glb}(x,y) = x \wedge y$. 

(2) Poset $(R, \leq)$ $\Rightarrow$ Join Semilattice $(R, \wedge)$

Conversely, given a poset $(R, \leq)$ in which $\forall$ pair of elements $(x, y)$ has a greatest lower bound $\operatorname{glb}(x,y)$, define $x \wedge y = \operatorname{glb}(x, y)$. Then $(R, \wedge)$ is a semilattice. $\blacksquare$

我们先来证明 (1) 中的 $(R, \leq)$ is a poset

<mark>Proof:</mark> 
(Reflexive) 
- 因为 semilattice 是 idempotent 的，所以 $x \wedge x = x$，所以 $x \leq x$

(Antisymmetric) 
- 若 $x \leq y$，则 $x \wedge y = x$
- 若 $y \leq x$，则 $y \wedge x = y$
- 若 $x \leq y$ 和 $y \leq x$ 同时成立，根据 semilattice 的 commutative 性质，我们有 $x \wedge y = y \wedge x$，相当于 $x = y$

(Transitive) 
- 若 $x \leq y$，则 $x \wedge y = x$
- 若 $y \leq z$，则 $y \wedge z = y$
- 若 $x \leq y \leq z$，根据 semilattice 的 associative 性质，我们有 $x \wedge z = (x \wedge y) \wedge z = x \wedge (y \wedge z) = x \wedge y = x$，于是 $x \leq z$

于是 $(R, \leq)$ is a poset. $\blacksquare$

同样的思路也可以证明 (2) 中的 $(R, \wedge)$ is semilattice.

**Theorem 2.2: Join semilattices 与 Posets 等价**

(1) Join Semilattice $(R, \vee)$ $\Rightarrow$ Poset $(R, \geq)$

In a meet semilattice $(R, \vee)$, define $x \geq y \iff x \vee y = x$. Then $(R, \geq)$ is a poset  in which $\forall$ pair of elements $(x, y)$ has a least upper bound $\operatorname{lub}(x,y) = x \vee y$. 

(2) Poset $(R, \geq)$ $\Rightarrow$ Join Semilattice $(R, \vee)$

Conversely, given a poset $(R, \geq)$ in which $\forall$ pair of elements $(x, y)$ has a least upper bound $\operatorname{lub}(x,y)$, define $x \vee y = \operatorname{lub}(x, y)$. Then $(R, \vee)$ is a semilattice. $\blacksquare$

# Order-Theoretic Definition of Lattices

**Theorem 2.3: Lattices 与 Posets 等价**

(1) Lattice $(R, \wedge, \vee)$ $\Rightarrow$ Poset $(R, \leq)$

In a lattice $(R, \wedge, \vee)$, define $x \leq y \iff x \wedge y = x$. Then $(R, \leq)$ is a poset in which $\forall$ pair of elements $(x, y)$ has 
- a greatest lower bound $\operatorname{glb}(x,y) = x \wedge y$, and 
- a least upper bound $\operatorname{lub}(x,y) = x \vee y$.

(2) Poset $(R, \leq)$ $\Rightarrow$ Lattice  $(R, \wedge, \vee)$

Conversely, given a poset $(R, \leq)$ in which $\forall$ pair of elements $(x, y)$ has 
- a greatest lower bound $\operatorname{glb}(x,y)$, and
- a least upper bound $\operatorname{lub}(x,y)$,

define 
- $x \wedge y = \operatorname{glb}(x, y)$, and
- $x \vee y = \operatorname{lub}(x, y)$. 

Then $(R, \wedge, \vee)$ is a lattice. $\blacksquare$

**Claim:** Given a lattice $(R, \wedge, \vee)$, $x \wedge y = x \iff x \vee y = y$

<mark>Proof:</mark> (1) $x \wedge y = x \Rightarrow x \vee y = y$

我们有 absorption law: 

$$
\begin{equation}
    \forall x, y \in R, \, x \vee (x \wedge y) = x 
    \tag{1} 
    \label{eq:1}
\end{equation}
$$

我们可以调换 $x, y$，把 absorption law 转写成：

$$
\begin{equation}
    \forall x, y \in R, \, y \vee (y \wedge x) = y 
    \tag{2} 
    \label{eq:2}
\end{equation}
$$

当 $x \wedge y = x$ 时，因为 lattice 的 commutative 性质，我们有：

$$
\begin{equation}
    x \wedge y = y \wedge x = x 
    \tag{3} 
    \label{eq:3}
\end{equation}
$$

将 $\eqref{eq:3}$ 带入 $\eqref{eq:2}$，并再次根据 commutative 性质，得到：

$$
\begin{equation}
    y \vee x = y = x \vee y 
    \tag{4}
\end{equation}
$$

所以 $x \wedge y = x \Rightarrow x \vee y = y$ 成立。

(2) $x \wedge y = x \Leftarrow x \vee y = y$ 证明类似 $\blacksquare$

结合这个 claim，我们可以看到 **Theorem 2.3** (1) 中的 "define $x \leq y \iff x \wedge y = x$" 本质是：

$$
x \leq y \iff x \wedge y = x \iff x \vee y = y
$$

也就是意味着，"用 $\wedge$ 去定义 $\leq$" 和 "用 $\vee$ 去定义 $\leq$" 是等效的。
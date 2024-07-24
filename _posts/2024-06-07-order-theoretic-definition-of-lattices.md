---
title: "Order-Theoretic Definition of Lattices (Poset == Lattice)"
description: ""
category: Math
tags: []
toc: true
toc_sticky: true
---

# 引子：Pre-ordering on Monoids

某些 [Elementary Algebraic Structures](/math/2024/04/07/elementary-algebraic-structures) 由其定义可以很自然地引出一些 ordering 的结构，比如 [wikipedia: Monoid](https://en.wikipedia.org/wiki/Monoid#Commutative_monoid) 说：

> Any commutative monoid is endowed with its algebraic preordering $\leq$, defined by $x \leq y$ if there exists $z$ such that $x + z = y$.

并不是说 "只有 commutative monoid 才有 pre-order"，Non-commutative 的 monoid 也可以有，见 [讨论](https://math.stackexchange.com/questions/2463279/natural-pre-order-for-non-commutative-monoids)。可能是 commutative monoid 的 pre-order 更普遍，具体的细节我们不用深究。
{: .notice--info}

# Order-Theoretic Definition of Semilattices

Poset = Partially Ordered Set. 这个简写还蛮常用的。
{: .notice--info}

**Theorem 2.1: Meet semilattices 与 Posets 等价**

**(1) Meet Semilattice $(S, \wedge)$ $\Rightarrow$ Poset $(S, \leq)$**

In a meet semilattice $(S, \wedge)$, define $x \leq y \iff x \wedge y = x$. Then $(S, \leq)$ is a poset  in which $\forall$ pair of elements $(x, y)$ has a greatest lower bound $\operatorname{glb}(x,y) = x \wedge y$. 

**(2) Poset $(S, \leq)$ $\Rightarrow$ Join Semilattice $(S, \wedge)$**

Conversely, given a poset $(S, \leq)$ in which $\forall$ pair of elements $(x, y)$ has a greatest lower bound $\operatorname{glb}(x,y)$, define $x \wedge y = \operatorname{glb}(x, y)$. Then $(S, \wedge)$ is a semilattice. $\blacksquare$

注意 $\operatorname{glb}(x,y) = x \wedge y$ 这个值不一定等于 $x$ 或者 $y$。考虑 **Theorem 2.1 (1)** 中 comparable vs incomparable 的情况：

- comparable: $x \leq y \iff x \wedge y = x$，于是  $\operatorname{glb}(x,y) = x$
- comparable: $y \leq x \iff x \wedge y = y$，于是  $\operatorname{glb}(x,y) = y$
- incomparable: $x \oslash y \iff x \wedge y \neq x \text{ and } x \wedge y \neq y$，于是  $\operatorname{glb}(x,y) \neq x \text{ and } \operatorname{glb}(x,y) \neq y$，更严格来说是 $\operatorname{glb}(x,y) < x \text{ and } \operatorname{glb}(x,y) < y$

我们来证明 **Theorem 2.1 (1)** 中的 $(S, \leq)$ is a poset

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

于是 $(S, \leq)$ is a poset. $\blacksquare$

同样的思路也可以证明 **Theorem 2.1 (2)** 中的 $(S, \wedge)$ is semilattice.

**Theorem 2.2: Join semilattices 与 Posets 等价**

**(1) Join Semilattice $(S, \vee)$ $\Rightarrow$ Poset $(S, \geq)$**

In a meet semilattice $(S, \vee)$, define $x \geq y \iff x \vee y = x$. Then $(S, \geq)$ is a poset  in which $\forall$ pair of elements $(x, y)$ has a least upper bound $\operatorname{lub}(x,y) = x \vee y$. 

**(2) Poset $(S, \geq)$ $\Rightarrow$ Join Semilattice $(S, \vee)$**

Conversely, given a poset $(S, \geq)$ in which $\forall$ pair of elements $(x, y)$ has a least upper bound $\operatorname{lub}(x,y)$, define $x \vee y = \operatorname{lub}(x, y)$. Then $(S, \vee)$ is a semilattice. $\blacksquare$

# Order-Theoretic Definition of Lattices

**Theorem 2.3: Lattices 与 Posets 等价**

**(1) Lattice $(S, \wedge, \vee)$ $\Rightarrow$ Poset $(S, \leq)$**

In a lattice $(S, \wedge, \vee)$, define $x \leq y \iff x \wedge y = x$. Then $(S, \leq)$ is a poset in which $\forall$ pair of elements $(x, y)$ has 
- a greatest lower bound $\operatorname{glb}(x,y) = x \wedge y$, and 
- a least upper bound $\operatorname{lub}(x,y) = x \vee y$.

**(2) Poset $(S, \leq)$ $\Rightarrow$ Lattice  $(S, \wedge, \vee)$**

Conversely, given a poset $(S, \leq)$ in which $\forall$ pair of elements $(x, y)$ has 
- a greatest lower bound $\operatorname{glb}(x,y)$, and
- a least upper bound $\operatorname{lub}(x,y)$,

define 
- $x \wedge y = \operatorname{glb}(x, y)$, and
- $x \vee y = \operatorname{lub}(x, y)$. 

Then $(S, \wedge, \vee)$ is a lattice. $\blacksquare$

**Claim:** Given a lattice $(S, \wedge, \vee)$, $x \wedge y = x \iff x \vee y = y$

<mark>Proof:</mark> (1) $x \wedge y = x \Rightarrow x \vee y = y$

我们有 absorption law: 

$$
\begin{equation}
    \forall x, y \in S, \, x \vee (x \wedge y) = x 
    \tag{1} 
    \label{eq1}
\end{equation}
$$

我们可以调换 $x, y$，把 absorption law 转写成：

$$
\begin{equation}
    \forall x, y \in S, \, y \vee (y \wedge x) = y 
    \tag{2} 
    \label{eq2}
\end{equation}
$$

当 $x \wedge y = x$ 时，因为 lattice 的 commutative 性质，我们有：

$$
\begin{equation}
    x \wedge y = y \wedge x = x 
    \tag{3} 
    \label{eq3}
\end{equation}
$$

将 $\eqref{eq3}$ 带入 $\eqref{eq2}$，并再次根据 commutative 性质，得到：

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

# 更精炼的定义

前面说 "$\forall$ pair of elements $(x, y)$ of $S$ has a greatest lower bound $\operatorname{glb}(x,y)$"，其实可以递归描述成 "$\forall$ nonempty finite subset of $S$ has a meet"，于是我们有：

**Definition 1:** A poset $S$ is a **meet-semilattice** (resp. **join-semilattice**) if $\forall$ nonempty finite subset of $S$ has a meet (resp. join).

**Definition 2:** A poset that is both a meet-semilattice and a join-semilattice is a **lattice**.

**Observation 1:** Every finite meet-semilattice (resp. join-semilattice) $S$ is bounded by $\bigwedge S$ (resp. $\bigvee S$)

**Observation 2:** Every finite lattice $S$ is bounded by $\bigwedge S$ and $\bigvee S$

**Proposition 1:** Every finite meet-semilattice (resp. join-semilattice) also bounded by $\bigvee S$ (resp. $\bigwedge S$) is a lattice.

<mark>Proof:</mark> 假设 $S$ 是一个 finite meet-semilattice also bounded by $\bigvee S$. 往证：$\forall$ pair of elements $x, y \in S$ has a join.

构造 $S_{xy} = \lbrace z \in S \mid x \leq z \text{ and } y \leq z \rbrace$. 因为 $S$ 是 finite meet-semilattice 且 $S_{xy}$ 是 $S$ 的 finite subset，所以 $S_{xy}$ has a meet $m$. 往证：$m$ is the join of $x,y$.

明显 $x$ 是 $S_{xy}$ 的一个 lower bound，由于 $m$ 是 $S_{xy}$ 的 meet, i.e. greatest lower bound，所以 $x \leq m$；同理 $y \leq m$。所以 $m$ 是 $x,y$ 的一个 upper bound。往证：$m$ is the least upper bound of $x,y$.

考虑 $x,y$ 的 $\forall$ upper bound $m'$，一定有 $m' \in S_{xy}$，且由于 $S_{xy}$ 的 meet 是 $m$，所以 $m \leq m'$，所以 $m$ is the least upper bound of $x,y$。

结论成立。$\blacksquare$

# References

> - [https://math.hawaii.edu/~jb/math618/os2uh_17.pdf](https://math.hawaii.edu/~jb/math618/os2uh_17.pdf)
> - [https://math.mit.edu/~fgotti/docs/Courses/Combinatorial Analysis/37. Intro to Lattices/Intro to Lattices.pdf](https://math.mit.edu/~fgotti/docs/Courses/Combinatorial%20Analysis/37.%20Intro%20to%20Lattices/Intro%20to%20Lattices.pdf)
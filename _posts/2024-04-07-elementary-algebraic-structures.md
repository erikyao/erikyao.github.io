---
title: "Elementary Algebraic Structures"
description: ""
category: Math
tags: []
toc: true
toc_sticky: true
---

# Overiew

$$
\begin{align}
\operatorname{Magma \, (Groupid)} \, (R, \circ) 
    &= \operatorname{Set} \, R \, \Join \, \operatorname{Op} \, \circ \newline
\operatorname{Semigroup} \, (R, \circ) 
    &= \operatorname{Magma} \, (R, \circ) \, \Join \, \text{Associativity} \newline

\newline

\operatorname{Band} \, (R, \circ) 
    &= \operatorname{Semigroup} \, (R, \circ) \, \Join \, \text{Idempotency} \newline
    &= \operatorname{Magma} \, (R, \circ) \, \Join \, \text{Associativity} \, \Join \, \text{Idempotency} \newline
\operatorname{Semilattice} \, (R, \circ) 
    &= \operatorname{Band} \, (R, \circ) \, \Join \, \text{Commutativity} \newline
    &=\operatorname{Semigroup} \, (R, \circ) \, \Join \, \text{Idempotency} \Join \, \text{Commutativity} \newline
    &=\operatorname{Magma} \, (R, \circ) \, \Join \, \text{Associativity} \, \Join \, \text{Idempotency} \Join \, \text{Commutativity} \newline

\newline

\operatorname{Monoid} \, (R, \circ, \bar{e}) 
    &= \operatorname{Semigroup} \, (R, \circ) \, \Join \, \operatorname{Identity} \, \bar{e} \newline
\operatorname{Abelian Monoid} \, (R, \circ, \bar{e}) 
    &= \operatorname{Monoid} \, (R, \circ, \bar{e}) \, \Join \, \text{Commutativity} \newline

\newline

\operatorname{Bounded Semilattice} \, (R, \circ, \bar{e}) 
    &= \operatorname{Semilattice} \, (R, \circ) \, \Join \, \operatorname{Identity} \, \bar{e} \newline
    &= \operatorname{Abelian Monoid} \, (R, \circ, \bar{e})  \, \Join \, \text{Idempotency} \newline

\newline

\operatorname{Group} \, (R, \circ, \bar{e}) 
    &= \operatorname{Monoid} \, (R, \circ, \bar{e}) \, \Join \, \text{Invertibility} \newline
\operatorname{Abelian Group} \, (R, \circ, \bar{e}) 
    &= \operatorname{Group} \, (R, \circ, \bar{e}) \, \Join \, \text{Commutativity} \newline

\newline

\operatorname{Lattice} \, (R, \boldsymbol{\vee}, \boldsymbol{\wedge})
    &\vdash \operatorname{Semilattice} \, (R, \boldsymbol{\vee}) \newline
    &\vdash \operatorname{Semilattice} \, (R, \boldsymbol{\wedge}) \newline
    &\vdash \text{<other properties>} \newline

\operatorname{Bounded \, Lattice} \, (R, \boldsymbol{\vee}, \boldsymbol{\wedge}, \bot, \top)
    &= \operatorname{Lattice} \, (R, \boldsymbol{\vee}, \boldsymbol{\wedge})  \, \Join \, \operatorname{Identity} \, \bot  \, \Join \, \operatorname{Identity} \, \top \newline
    &\vdash \operatorname{Bounded Semilattice} \, (R, \boldsymbol{\vee}, \bot) \newline
    &\vdash \operatorname{Bounded Semilattice} \, (R, \boldsymbol{\wedge}, \top) \newline
    &\vdash \text{<other properties>} \newline

\newline

\operatorname{Semiring \, (Rig)} \, (R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)
    &\vdash \operatorname{Abelian Monoid} \, (R, \boldsymbol{+}, \bar{0}) \newline
    &\vdash \operatorname{Monoid} \, (R, \boldsymbol{\times}, \bar{1}) \newline
    &\vdash \text{<other properties>} \newline
\operatorname{Ring} \, (R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)
    &= \operatorname{Semiring} \, (R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1) \, \Join \, \text{Invertibility (w.r.t. Addition)} \newline
    &\vdash \operatorname{Abelian Group} \, (R, \boldsymbol{+}, \bar{0}) \newline
    &\vdash \operatorname{Monoid} \, (R, \boldsymbol{\times}, \bar{1}) \newline 
    &\vdash \text{<other properties>} \newline
\operatorname{Field} \, (R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)
    &= \operatorname{Ring} \, (R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1) \, \Join \, \text{Non-triviality}  \, \Join \, \text{Commutativity} \newline
    & \, \, \Join \, \text{Invertibility (w.r.t. Multiplication on } R \setminus \lbrace \bar{0} \rbrace \text{)} \newline
    &\vdash \operatorname{Abelian Group} \, (R, \boldsymbol{+}, \bar{0}) \newline
    &\vdash \operatorname{Abelian Group} \, (R \setminus \lbrace \bar{0} \rbrace, \boldsymbol{\times}, \bar{1}) \newline
    &\vdash \operatorname{Abelian Monoid} \, (R, \boldsymbol{\times}, \bar{1}) \newline 
    &\vdash \text{<other properties>} \newline
\end{align}
$$

# AS with 0 Operation

## Set $\Rightarrow R$

Set is the very basic algebraic structure without any binary operation.

# AS with 1 Operation

## Magma (Groupid) $\Rightarrow (R, \circ)$

A magma (a.k.a. groupid) can be denoted by $(R, \circ)$, such that:

- $R$ is a set $R$ 
- $\circ: R \times R \to R$ is a binary operation

## Semigroup $\Rightarrow$ Associative Magma $(R, \circ)$ 

A semigroup is simply an associative magma, as:

- $\forall a, b, c \in R, (a \circ b) \circ c = a \circ (b \circ c)$

### Semigroup vs Group

结构上：
- Semigroup 是 $(R, \circ)$
- Group 是 $(R, \circ, \bar{e})$

性质上：
- Group 是 Invertible Monoid
- Monoid 是 Semigroup + Identity
- 所以 Group 一定是 Semigroup
- Semigroup 是 “没有 identity $\bar{e}$ (进而) 也没有 *inverse*” 的 Group

疑问：semigroup 连 monoid 都不如，为何挂着 group 的名字？根据 [这个帖子](https://www.physicsforums.com/threads/semigroups-exploring-the-logic-behind-the-name.248488/):
> In summary, the name "semigroup" comes from the fact that it is halfway between a "magma" (a set with a binary operation) and a "group" (a set with an associative binary operation, an identity element, and an inverse element for each element).
  
只是这个 "halfway" 离 group 离得有点远……

## Band $\Rightarrow$ Idempotent Semigroup $(R, \circ)$

A band is simply an idempotent semigroup $(R, \circ)$, such that:

- $\forall a \in R, a \circ a = a$

## Semilattice $\Rightarrow$ Commutative Band $(R, \circ)$

A semilattice is simply a commutative band $(R, \circ)$, such that:

- $\forall a,b \in R, \, a \circ b = b \circ a$

### Bounded Semilattice $\Rightarrow$ Semilattice + Identity $\Rightarrow$Idempotent Abelian Monoid $(R, \circ, \bar{e})$

A semilattice $(R, \circ)$ is bounded if $\exists$ an identity element $\bar{e} \in R$ such that:

- $\forall a \in R, \, a \circ \bar{e} = \bar{e} \circ a = a$

## Monoid $\Rightarrow$ Semigroup + Identity $\Rightarrow$ $(R, \circ, \bar{e})$

A monoid can be denoted by $(R, \circ, e)$ such that:

- $(R, \circ)$ is a semigroup
- $\bar{e} \in R$ is the identity element w.r.t. $\circ$
    - i.e. $\forall a \in R, \, a \circ \bar{e} = \bar{e} \circ a = a$

Also written as a tuple $(R, \circ)$ if we consider $\bar{e}$ associated with $\circ$ internally.

### Abelian Monoid $=$ Commutative Monoid

虽然我们有 $a \circ e = e \circ a = a$ 但这并不意味着我们的 monoid 一定是 commutative 的 (i.e. $\forall a,b$ 有 $a \circ b = b \circ a$)。如果是 commutative 的需要 explicitly 写出来。

同时 commutative monoid 也 a.k.a. abelian monoid.

## Group $\Rightarrow$ Invertible Monoid $(R, \circ, \bar{e})$

A group is a monoid with *inverse*.

假设 $(R, \circ, \bar{e})$ 是 group，我们有：

- $(R, \circ, \bar{e})$ 自然也是 monoid
- $\forall a \in R$, there $\exists b \in R$ such that $a \circ b = b \circ a = \bar{e}$
    - $b$ is the inverse of $a$, vice versa

### Inverse / Negative / Reciprocal

你可以把 *inverse* 看成是一个 unary operation，也可以理解成 “group 中的任意 element 都有一个 inverse element”：

- 如果 $\circ$ 是 addition，$a$ 的 inverse element 一般写成 $-a$
    - 你也可以理解成是 "取 negative" 操作
- 如果 $\circ$ 是 multiplication，$a$ 的 inverse element 一般写成 $a^{-1}$
    - 你也可以理解成是 "取 reciprocal" 操作

### Abelian Group $=$ Commutative Group

好理解：普通的 monoid 构建出的是普通的 group，那么 abelian monoid 构建出的就是 abelian group。

# AS with 2 Operations

## Lattice $\Rightarrow (R, \boldsymbol{\vee}, \boldsymbol{\wedge})$

A lattice is a set with two binary operations, often called $\boldsymbol{\vee}$ (**join**) and $\boldsymbol{\wedge}$ (**meet**). 

我们可以用 $(R, \boldsymbol{\vee}, \boldsymbol{\wedge})$ 表示一个 lattice，它满足：

- $(R, \boldsymbol{\vee})$ is a semilattice
    - a.k.a. the join-semilattice
- $(R, \boldsymbol{\wedge})$ is a semilattice
    - a.k.a. the meet-semilattice
- absorption laws
    - $\forall a, b \in R, \, a \vee (a \wedge b) = a$
    - $\forall a, b \in R, \, a \wedge (a \vee b) = a$

## Bounded Lattice $\Rightarrow$ Lattice + Identities $\Rightarrow  (R, \boldsymbol{\vee}, \boldsymbol{\wedge}, \bot, \top)$

我们可以用 $(R, \boldsymbol{\vee}, \boldsymbol{\wedge}, \bot, \top)$ 表示一个 bounded lattice，它满足：

- $(R, \boldsymbol{\vee}, \boldsymbol{\wedge})$ is a lattice
- $(R, \boldsymbol{\vee}, \bot)$ is a bounded semilattice
    - $\bot$ is a.k.a. **least element, minimum, or bottom**
- $(R, \boldsymbol{\wedge}, \top)$ is a bounded semilattice
    - $\top$ is a.k.a. **greatest element, maximum, or top**

## Semiring (Rig) $\Rightarrow (R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$

A semiring is a set with two binary operations, often called $\boldsymbol{+}$ (**addition**) and $\boldsymbol{\times}$ (**multiplication**). 

我们可以用 $(R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$ 表示一个 semiring，它满足：

- $(R, \boldsymbol{+}, \bar0)$ is an abelian monoid
- $(R, \boldsymbol{\times}, \bar1)$ is a monoid
- $\boldsymbol{\times}$ is distributive w.r.t. $\boldsymbol{+}$, i.e. $a \boldsymbol{\times} (b \boldsymbol{+} c) = (a \boldsymbol{\times} b) \boldsymbol{+} (a \boldsymbol{\times} c)$
- $\boldsymbol{\times}$ has the absorption/annihilation law, i.e. $\bar0 \boldsymbol{\times} a = a \boldsymbol{\times} \bar0 = \bar0$
    - $\bar0$ is the absorbing element / annihilating element / annihilator w.r.t. $\boldsymbol{\times}$

我们这里用 $\bar0$ 和 $\bar1$ 来表示 identity elements，以区分具体的数 $0$ 和 $1$
{: .notice--info}

Absorbing Element / Annihilating Element / Annihilator 这些名称都是等价的
{: .notice--info}

### Absorption / Annihilation Law: 定义还是性质？

我们在 ring 的部分可以通过其他三条定义直接推断出 absorption / annihilation law，所以对 ring 而言，这条 law 可以看做是 ring 的一个 property，而不用放到定义中去强调它。

但是对 semiring 而言，无法推断出 absorption / annihilation law，所以就只能把它写到定义中。

我个人的怀疑是先有的 ring，再有的 semiring，然后 semiring 的研究又常用到 absorption / annihilation law，于是就直接整合到 semiring 的定义中去了。

## Ring $\Rightarrow$ Addition-Invertible Semiring $(R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$

我们可以用 $(R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$ 表示一个 ring，它满足：

- $(R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$ is a semiring
    - but $(R, \boldsymbol{+}, \bar0)$ is an abelian group, instead of an abelian monoid in a semiring

### Trivial Ring (Zero Ring) $\Rightarrow$ Ring with Only 1 Element 

存在 trivial ring (a.k.a zero ring)，即只有一个元素的 ring，比如 $\{\varepsilon\}$，它的 $\bar0 = \bar1 = \varepsilon$.

**Lemma:** if $\bar0 = \bar1$ $\implies$ then $R$ is a trival ring
{: .notice--success}

### Absorption / Annihilation Law 的证明

Given a ring $(R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$, $\forall a \in R$, 有：

- 因为 $\bar0 \boldsymbol{+} \bar0 = \bar0$ (by monoid's definition on identity)
- 所以 $\bar0 \boldsymbol{\times} a = (\bar0 \boldsymbol{+} \bar0) \boldsymbol{\times} a = (\bar0 \boldsymbol{\times} a) \boldsymbol{+} (\bar0 \boldsymbol{\times} a)$
- 等式两边同时 $\boldsymbol{+}$ 加上 $(\bar0 \boldsymbol{\times} a)$ 的 *inverse*，可得 $\bar0 = \bar0 \boldsymbol{\times} a$

我们称 $\bar0$ 为 left annihilator (w.r.t. $\boldsymbol{\times}$)。

同理 $\bar0$ 也是 right annihilator (因为同样可以推出 $\forall a \in R$, 有 $\bar0 = a \boldsymbol{\times} \bar0$).

## Field $\Rightarrow$ Non-Trivial, Commutative, Almost Multiplication-Invertible Ring $(R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$

A field is a commutative ring where $\bar0 \neq \bar1$ and $\forall a \in R \setminus \\{\bar0\\}$ there is an *inverse* for $a$ w.r.t. $\boldsymbol{\times}$.

我们揉碎了说。假设用 $(R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$ 表示一个 field，它满足：

- $(R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$ 自然也是一个 commutative ring
- $(R, \boldsymbol{+}, \bar0)$ is an abelian group
  - a.k.a. the additive group within the field
- $(R, \boldsymbol{\times}, \bar1)$ is an abelian monoid
- $(R \setminus \\{\bar0\\}, \boldsymbol{\times}, \bar1)$ is an abelian group
  - a.k.a. the multiplicative group within the field
- $\boldsymbol{\times}$ is distributive w.r.t. $\boldsymbol{+}$, i.e. $a \boldsymbol{\times} (b \boldsymbol{+} c) = (a \boldsymbol{\times} b) \boldsymbol{+} (a \boldsymbol{\times} c)$
- $\bar0 \neq \bar1$
  - this requirement is by convention to exclude trivial ring
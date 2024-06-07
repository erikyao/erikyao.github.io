---
title: "Elementary Algebraic Structures"
description: ""
category: Math
tags: []
toc: true
toc_sticky: true
---

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

## Monoid $\Rightarrow$ Semigroup + Identity $\Rightarrow$ $(R, \circ, \bar{e})$

A monoid can be denoted by $(R, \circ, e)$ such that:

- $(R, \circ)$ is a semigroup
- $\bar{e} \in R$ is the identity element w.r.t. $\circ$
    - i.e. $\forall a \in R$, we have $a \circ \bar{e} = \bar{e} \circ a = a$

Also written as a tuple $(R, \circ)$ if we consider $\bar{e}$ associated with $\circ$ internally.

### Abelian Monoid $=$ Commutative Monoid

虽然我们有 $a \circ e = e \circ a = a$ 但这并不意味着我们的 monoid 一定是 commutative 的 (i.e. $\forall a,b$ 有 $a \circ b = b \circ a$)。如果是 commutative 的需要 explicitly 写出来。

同时 commutative monoid 也 a.k.a. abelian monoid.

### Pre-ordering on Monoids

[wikipedia](https://en.wikipedia.org/wiki/Monoid#Commutative_monoid) 说：

> Any commutative monoid is endowed with its algebraic preordering $\leq$, defined by $x \leq y$ if there exists $z$ such that $x + z = y$.

但并不是说 "只有 commutative monoid 才有 pre-order"。Non-commutative 的 monoid 也可以有，见[讨论](https://math.stackexchange.com/questions/2463279/natural-pre-order-for-non-commutative-monoids)。

可能是 commutative monoid 的 pre-order 更普遍，具体的细节我们不用深究。

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

## Semiring (Rig) $\Rightarrow (R, \boldsymbol{+}, \boldsymbol{\times}, \bar0, \bar1)$

A semiring is a set with two binary operations, often called $\boldsymbol{+}$ (addition) and $\boldsymbol{\times}$ (multiplication). 

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
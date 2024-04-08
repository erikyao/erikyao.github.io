---
title: "Elementary Algebraic Structures"
description: ""
category: Math
tags: []
toc: true
toc_sticky: true
---

根据 [Common algebraic structures](https://en.wikipedia.org/wiki/Algebraic_structure#Common_algebraic_structures) 归纳一下。

# Set

Set is the very basic algebraic structure without any binary operation.

# Monoid

A monoid is a set with one binary operation. 

A monoid can be written as a triple $(R, \circ, e)$ such that:

- $R$ is a set.
- $\circ: R \times R \to R$ is an associative binary operation 
    - i.e. $\forall a, b \in R$, we have $(a \circ b) \circ c = a \circ (b \circ c)$
- $e \in R$ is the identity element w.r.t. $\circ$
    - i.e. $\forall a \in R$, we have $a \circ e = e \circ a = a$

Also written as a tuple $(R, \circ)$ if we consider $e$ associated with $\circ$ internally.

## Commutative Monoid == Abelian Monoid

虽然我们有 $a \circ e = e \circ a = a$ 但这并不意味着我们的 monoid 一定是 commutative 的 (i.e. $\forall a,b$ 有 $a \circ b = b \circ a$)。如果是 commutative 的需要 explicitly 写出来。

同时 commutative monoid 也 a.k.a. abelian monoid.

## Pre-ordering on Monoids

[wikipedia](https://en.wikipedia.org/wiki/Monoid#Commutative_monoid) 说：

> Any commutative monoid is endowed with its algebraic preordering $\leq$, defined by $x \leq y$ if there exists $z$ such that $x + z = y$.

但并不是说 "只有 commutative monoid 才有 pre-order"。Non-commutative 的 monoid 也可以有，见[讨论](https://math.stackexchange.com/questions/2463279/natural-pre-order-for-non-commutative-monoids)。

可能是 commutative monoid 的 pre-order 更普遍，具体的细节我们不用深究。

# Group

A group is a monoid with *inverse*.

假设 $(R, \circ, e)$ 是 group，我们有：

- $(R, \circ, e)$ 自然也是 monoid
- $\forall a \in R$, there $\exists b \in R$ such that $a \circ b = b \circ a = e$

你可以把 *inverse* 看成是一个 unary operation，也可以理解成 “group 中的任意 element 都有一个 inverse element”：

- 如果 $\circ$ 是 addition，$a$ 的 inverse element 一般写成 $-a$
- 如果 $\circ$ 是 multiplication，$a$ 的 inverse element 一般写成 $a^{-1}$
    - 此时把 *inverse* 看成是一个 unary operation 就有点别扭

## Commutative Group == Abelian Group

好理解：普通的 monoid 构建出的是普通的 group，那么 abelian monoid 构建出的就是 abelian group。

## Magma & Semigroup

semigroup 是 “没有 $e$ (进而) 也没有 *inverse* 的” group。疑问：semigroup 连 monoid 都不如，为何挂着 group 的名字？根据[这个帖子](https://www.physicsforums.com/threads/semigroups-exploring-the-logic-behind-the-name.248488/):
> In summary, the name "semigroup" comes from the fact that it is halfway between a "magma" (a set with a binary operation) and a "group" (a set with an associative binary operation, an identity element, and an inverse element for each element).
  
只是这个 "halfway" 离 group 离得有点远……

A magma (rarely a.k.a. groupid) $(R, \circ)$ is a set $R$ with operation $\circ: R \times R \to R$ such that:

- $\forall a,b \in R$, we have $a \circ b \in R$

A semigroup is simply an associative magma, as:

- $\forall a, b, c \in R, (a \circ b) \circ c = a \circ (b \circ c)$

所以层级关系有：
```txt
     _________
    /  group  \
   /   monoid  \
  /  semigroup  \
 /     magma     \
/_______set_______\
```

# Ring

A ring is a set with two binary operations, often called $\oplus$ (addition) and $\otimes$ (multiplication). 

我们可以用 $(R, \oplus, \otimes, \bar0, \bar1)$ 表示一个 ring，它满足：

- $(R, \oplus, \bar0)$ is an abelian group
- $(R, \otimes, \bar1)$ is a monoid
- $\otimes$ is distributive w.r.t $\oplus$, i.e. $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$

我们这里用 $\bar0$ 和 $\bar1$ 来表示 identity elements，以区分具体的数 $0$ 和 $1$。

存在 trivial ring (a.k.a zero ring)，即只有一个元素的 ring，比如 $\{\varepsilon\}$，它的 $\bar0 = \bar1 = \varepsilon$.

- 这其实是一个 lemma: if $\bar0 = \bar1$ $\implies$ then $R$ is a trival ring

## Absorbing Element / Annihilating Element / Annihilator

Given a ring $(R, \oplus, \otimes, \bar0, \bar1)$, $\forall a \in R$, 有：

- 因为 $\bar0 \oplus \bar0 = \bar0$ (by monoid definition)
- 所以 $\bar0 \otimes a = (\bar0 \oplus \bar0) \otimes a = (\bar0 \otimes a) \oplus (\bar0 \otimes a)$
- 等式两边同时 $\oplus$ 加上 $(\bar0 \otimes a)$ 的 *inverse*，可得 $\bar0 = \bar0 \otimes a$

我们称 $\bar0$ 为 left annihilator (w.r.t. $\otimes$)。同理 $\bar0$ 也是 right annihilator (因为同样可以推出 $\forall a \in R$, 有 $\bar0 = a \otimes \bar0$).

## Semiring

我们可以用 $(R, \oplus, \otimes, \bar0, \bar1)$ 表示一个 semiring，它满足：

- $(R, \oplus, \bar0)$ is an abelian monoid
- $(R, \otimes, \bar1)$ is a monoid
- $\otimes$ is distributive w.r.t. $\oplus$, i.e. $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$

可见 semiring 就是没有 $\oplus$ *inverse* 的 ring (i.e. abelian monoid 与 abelian group 的区别)。

annihilator 对 semiring 依然成立。

# Field

A field is a commutative ring where $\bar0 \neq \bar1$ and $\forall a \in R \setminus \\{\bar0\\}$ there is an *inverse* for $a$ w.r.t. $\otimes$.

我们揉碎了说。假设用 $(R, \oplus, \otimes, \bar0, \bar1)$ 表示一个 field，它满足：

- $(R, \oplus, \otimes, \bar0, \bar1)$ 自然也是一个 commutative ring
- $(R, \oplus, \bar0)$ is an abelian group
  - a.k.a. the additive group within the field
- $(R, \otimes, \bar1)$ is an abelian monoid
- $(R \setminus \\{\bar0\\}, \otimes, \bar1)$ is an abelian group
  - a.k.a. the multiplicative group within the field
- $\otimes$ is distributive w.r.t. $\oplus$, i.e. $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$
- $\bar0 \neq \bar1$
  - this requirement is by convention to exclude trivial ring
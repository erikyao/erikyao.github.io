---
layout: post
title: "Homeomorphism / Open Map / Close Map / Embedding"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

## Homeomorphism

Quoted from [Wikipedia: Homeomorphism](https://en.wikipedia.org/wiki/Homeomorphism): 

A function $f:X \to Y$ between two topological spaces $(X, \tau_{X})$ and $(Y,\tau_{Y})$ is called a **homeomorphism** if it has the following properties:

- $f$ is a bijection,
- $f$ is continuous,
- and the inverse function $f^{-1}$ is continuous.

A homeomorphism is sometimes called **bicontinuous**. If such a homeomorphism exists, we say $(X, \tau_{X})$ and $(Y,\tau_{Y}）$ are **homeomorphic**. 

A self-homeomorphism is a homeomorphism of a topological space and itself. 

The homeomorphisms form an equivalence relation on the class of all topological spaces. The resulting equivalence classes are called **homeomorphism classes**.

举例：

- $f(x) = \frac{1}{a - x} + \frac{1}{b - x}$ for $a < b$ is a homeomorphism between open interval $(a, b)$ and $\mathbb{R}$.
- The graph of a differentiable function is homeomorphic to the domain of the function.
    - 假设 $f$ 是 differentiable，那么 $g(x) = (x, f(x))$ 是 homeomorphism

## Open Map / Close Map

An **open map** is a function between two topological spaces which maps open sets to open sets. That is, a function $f:X \to Y$ is open if $\forall$ open set $U \subset X$, the image $f(U)$ is open in $Y$. 

Likewise, a **closed map** is a function which maps closed sets to closed sets.

A map may be open, closed, both, or neither.

**Proposition:** A continuous bijection $f$ that is closed is also open (and vice versa). 

**[Proof](https://math.stackexchange.com/a/1339420):** Suppose $f$ is a closed, continuous bijection, and $V$ is open.

Then the $V^c$ is closed, and therefore the image $f(V^c)$ is closed, since $f$ is closed. 

But bijectivity means that $f(V^c)=(f(V))^c$. This means that $f(V)$ is open, being the complement of a closed set. Thus, $f$ is an open map as well.

The proof that an open, continuous bijection is also closed is completely analoguous. $\blacksquare$

**Proposition:** A bijective continuous map $f$ is a homeomorphism $\iff$ $f$ is open, or equivalently, is closed.

**Proof:** $f^{-1}$ must exist because $f$ is a bijection.

So equivalently we just need to prove: for a bijective continuous map $f$, its inverse $f^{-1}$ is continuous $\iff$ $f$ is open, or equivalently, is closed.

- 这里我们需要 topological space 上 continuous function 的定义：
    - A function $f:X \to Y$ between two topological spaces $(X, \tau_{X})$ and $(Y,\tau_{Y})$ is continuous if $\forall$ open set $V \subseteq Y$, the inverse image $f^{-1}(V)=\lbrace x \in X \mid f(x) \in V \rbrace \subseteq X$ is open

从这个定义来看，这个 proof 是 trivial 的。$\blacksquare$

## Embedding

Quoted from [Wikipedia: Embedding](https://en.wikipedia.org/wiki/Embedding): 

In general topology, **an embedding is a homeomorphism onto its image**.

More explicitly, an injective continuous function $f:X \to Y$ between two topological spaces $(X, \tau_{X})$ and $(Y,\tau_{Y})$ is a topological **embedding** if $f: X \to f(X)$ is a homeomorphism between $X$ and $f(X)$ (where $f(X)$ carries the subspace topology inherited from $Y$). 

- 注意：如果 $f$ 是 injective 的，那么 $f: X \to f(X)$ 必然是 surjective 的，进而必然是 bijective 的

Intuitively then, **the embedding $f:X \to Y$ lets us treat $X$ as a subspace of $Y$**.

- 我觉得这句话才是理解 embedding 的精华所在
- 因为 homeomorphism 定义了 topological space 的一种等价关系，用 $\cong$ 表示的话，我们可以写成 $X \cong f(X) \subset Y$，这个式子就可以理解为 "把 $X$ embed 到 $Y$"

**Proposition:** Every function that is injective, continuous and either open or closed is an embedding.

However there are also embeddings which are neither open nor closed. It happens if the image $f(X)$ is neither an open set nor a closed set in $Y$.

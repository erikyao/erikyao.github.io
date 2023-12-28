---
category: Algorithm
description: ''
tags: []
title: Big-O vs Little-O notation
---

参考：

- [stackoverflow: Difference between Big-O and Little-O Notation](http://stackoverflow.com/a/1364491)
- [Wolfram: Big-O Notation](http://mathworld.wolfram.com/Big-ONotation.html)
- [Wolfram: Little-O Notation](http://mathworld.wolfram.com/Little-ONotation.html)
- [Wolfram: Big-Omega Notation](http://mathworld.wolfram.com/Big-OmegaNotation.html)
- [Wolfram: Little-Omega Notation](http://mathworld.wolfram.com/Little-OmegaNotation.html)

-----

$f \in O(g)$ says, essentially:

- For _**at least one**_ choice of a constant $k > 0$, $\exists$ a constant $a$ such that the inequality $f(x) < k \cdot g(x)$ holds $\forall x > a$.

$f \in o(g)$ says, essentially:

- For _**every**_ choice of a constant $k > 0$, $\exists$ a constant $a$ such that the inequality $f(x) < k \cdot g(x)$ holds $\forall x > a$.

$f \in O(g)$ means that $f$'s asymptotic growth is no faster than $g$'s, whereas $f \in o(g)$ means that $f$'s asymptotic growth is strictly slower than $g$'s. It's like $\leq$ versus $<$.

E.g.

- $x^2 \in O(x^2)$
- $x^2 \notin o(x^2)$
- $x^2 \in o(x^3)$

Note that if $f \in o(g)$, this implies $f \in O(g)$.

Note that we can also write $f(x) = O(g(n))$ equivalently to $f(x) \in O(g(n))$, where $=$ represents "is" not "equals to".

-----

Digress: Big-Omega vs Little-Omega

- $f(n) \in O(g(n)) \iff g(n) \in \Omega(f(n))$
- $f(n) \in o(\phi(n)) \iff \phi(n) \in \omega(f(n))$
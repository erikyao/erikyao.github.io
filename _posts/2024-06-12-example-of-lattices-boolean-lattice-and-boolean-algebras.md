---
title: "Example of Lattices: Boolean Lattice (with Complemented Lattice and Boolean Algebras)"
description: ""
category: Math
tags: []
toc: true
toc_sticky: true
---

# Prerequisite: Complemented Lattice

**Definition 3.1:** Let $L$ be a bounded lattice.

1. An element $x \in L$ is said to be **complemented** (by $y$) if $\exists y \in L$ such that $x \wedge y = \bot$ and $x \vee y = \top$. 
2. We call $y$, also denoted by $x^\ast$, the **complement** of $x$. 
3. Accordingly, lattice $R$ is said to be **complemented** if $\forall x \in L$, $x$ has a complement.

**Theorem 3.3:** In a bounded, distributive lattice, every element has at most one complement.

Proof: Consider a bounded distributive lattice $L$ and elements $a,b,c \in R$. Suppose $b,c$ are both complements of $a$. We have:

$$
c = c \vee \bot = c \vee (a \wedge b) = (c \vee a) \wedge (c \vee b) = \top \wedge (c \vee b) = c \vee b,
$$

which implies $b \leq c$.

A similar argument can show that $c \leq b$. Therefore $b = c$ and there is only one complement of $a$. $\blacksquare$

# Boolean Lattices

**Definition 3.4:** A lattice $L$ is said to be **Boolean** if it is bounded, distributive, and complemented.

The most common example of a Boolean lattice is the **powerset Boolean lattice**. Given a positive integer $n$ and a set $[n] = \lbrace 1,2,\dots,n \rbrace$, the poset $B_n=(2^{[n]}, \subseteq)$ is called a **powerset boolean lattice of order $n$**.

E.g. when $n=2$, $B_2 = \big\lbrace \varnothing, \, \lbrace 1 \rbrace, \, \lbrace 2 \rbrace, \, \lbrace 1,2 \rbrace  \big\rbrace$

Some textbooks simply call $B_n$ the "Boolean lattice of order $n$".
{: .notice--info}

# Boolean Algebras

**Definition 3.6:** A **Boolean algebra** is a structure $(L, \wedge, \vee, \ast, \bot, \top)$ such that:
- $(L, \wedge, \vee, \bot, \top)$ is a Boolean lattice
- $\ast$ is the unary complement operation.

The most common example of a Boolean algebra is the **powerset Boolean algebra** such as $(B_n, \cap, \cup, \overline{}, \varnothing, [n])$

# References

> - https://arxiv.org/abs/2307.16671
> - https://moraschini.github.io/files/teaching/OLBA.pdf
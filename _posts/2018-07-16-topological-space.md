---
category: Math
description: ''
tags:
- Topology
title: Topology / Topological Space / Redefine Neighborhood, Limit Point, Interior
  Point and Exterior Point
---

## Topology / Topological Space

> Quote from [Wikibooks: Topology/Topological Spaces](https://en.wikibooks.org/wiki/Topology/Topological_Spaces)

A **topological space** is an ordered pair $(X, \tau)$, where $X$ is a set and $\tau$ is a collection of subsets of $X$, satisfying the following axioms:

- $\emptyset$ and $X$ itself $\in \tau$.
- Any (finite or infinite) union of members of $\tau$ still $\in \tau$.
- The intersection of any finite number of members of $\tau$ still $\in \tau$.

And $\tau$ is called a **topology** on $X$.

Examples:

- Given $X = \lbrace 1, 2, 3, 4 \rbrace$, $\tau = \lbrace \emptyset, X \rbrace$ is the trivial topology of $X$ (a.k.a. indiscrete topology). 
    - This is the smallest topology of $X$
- Given $X = \lbrace 1, 2, 3, 4 \rbrace$, $\tau = \lbrace \emptyset, \lbrace 2 \rbrace, \lbrace1, 2\rbrace, \lbrace2, 3\rbrace, \lbrace1, 2, 3\rbrace, X \rbrace$ forms another topology of $X$.
- Given $X = \lbrace 1, 2, 3, 4 \rbrace$, $\tau = P(X)$ (the power set of $X$) is called the discrete topology.
    - This is the largest topology of $X$
- Given $X = Z$, the set of integers, and $\tau$, the collection of all finite subsets of $Z$ plus $Z$ itself. $\tau$ is not a topology. Consider all finite sets not containing 0. They $\in \tau$, but the union of them is infinite and is not equal to $Z$ either. So this union $\notin \tau$.

This definition of a topological space **allows us to redefine open sets as well**. Our previous definitions ([Neighborhood / Open Set / Continuity / Limit Points / Closure / Interior / Exterior / Boundary](/math/2018/06/28/open-set)) required a **metric**. That is, we needed some notion of **distance** in order to define open sets. **Topological spaces have no such requirement**. In fact, the three properties given above--and them alone--are enough to define an open set. Our new definition is this:

$$
\text{The element of } \tau \text{ are called open sets}.
$$

The rules above are descriptions of how open sets behave: a collection of sets can be called open if 

- the union of an arbitrary number of open sets is open, 
- the intersection of a finite number of open sets is open, 
- and the space itself is open. (The empty set is considered open by default)

As it happens, the properties we associate with open sets, which allow us to study many topological ideas (like continuity and convergence, which were defined earlier using open sets), are encoded entirely by the three properties described above, without any need for a distance metric at all. This is in fact a very abstract definition, using only the most basic ideas of set theory (subsets, unions and intersections), and it allows enormous flexibility in what can be studied as a topological space (as well as how something can be seen as a topological space; there are many different ways a topology can be chosen on a given set). This definition is so general, in fact, that topological spaces appear naturally in virtually every branch of mathematics, and topology is considered one of the great unifying topics of mathematics.

## Redefine Neighborhood

> Quote from [Mathonline: The Open Neighbourhoods of Points in a Topological Space](http://mathonline.wikidot.com/the-open-neighbourhoods-of-points-in-a-topological-space)

**Definition:** Let $(X, \tau)$ be a topological space. A **neighbourhood** of a point $x \in X$ is a set $N$ (of course $N \subseteq X$) for which there exists an open set $O$ of $N$ such that $x \in O \subseteq N$. An **open Neighbourhood** of the point $x \in X$ is any open set $U$ in $\tau$ such that $x \in U \in \tau$.

- The term "neighbourhood" is used frequently in topology to simply mean "open neighbourhood" when distinction is not important.

**Proposition:** (Open Neighbourhood Criterion for Open Sets) Let $(X, \tau)$ be a topological space and let $U \subseteq X$. Then $U$ is open $\iff$ $\forall x \in U$ there exists an open neighbourhood $U_x$ of $x$ such that $U_x \subseteq U$.

- 注：原文是 "... is open $\iff$ $\forall x \in X$ there exists ..."，这个明显是不对的。考虑他们自己给的例子：$X=\lbrace a,b,c \rbrace, \tau=\lbrace \emptyset, \\{a\\},\\{a,b\\},X \rbrace$
    - $\lbrace a, b \rbrace \in \tau$ 是一个 open set
    - 对 $c \in X$，明显不可能有一个 neighbourhood $U_c$ 满足 $U_c \subseteq \lbrace a, b \rbrace$

**Proof:** $\Rightarrow$ Suppose that $U$ is open. Then for each $x \in U$ let $U_x = U$. Then $U_x$ is an open neighbourhood of $x$ such that $U_x \subseteq U$.

$\Leftarrow$ Suppose that for every $x \in U$ there exists an open neighbourhood $U_x$ of $x$ such that $U_x \subseteq U$. Then $U=\underset{x \in U} \cup U_x$. Since arbitrary unions of open sets are open, we see that $U$ is open. $\blacksquare$

## Redefine Limit Point

Let $(X, \tau)$ be a topological space and $A \subseteq X$. A point $x \in X$ is a limit point of $A$ if every neighbourhood of $x$ containts at least one point of $A$ different from $x$ itself.

- Openness of neighbourhood not required here

## Redefine Interior Point

Let $(X, \tau)$ be a topological space and $A \subseteq X$. A point $x \in X$ is an interior point of $A$ if $\exists$ an open set $U$ such that $x \in U \subseteq A$

- Equivalently, $x$ is an interior point of $A$ if $A$ is a neighbourhood of $x$.

## Redefine Exterior Point

Let $(X, \tau)$ be a topological space and $A \subseteq X$. A point $x \in X$ is an exterior point of $A$ if $\exists$ an open set $U$ such that $x \in U \subseteq A^c$

- Equivalently, $x$ is an exterior point of $A$ if $A^c$ is a neighbourhood of $x$.
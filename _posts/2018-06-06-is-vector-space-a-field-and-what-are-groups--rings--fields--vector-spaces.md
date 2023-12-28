---
category: Math
description: ''
tags:
- Math-Algebra
title: 'Is vector space a field? And what are: Groups / Rings / Fields / Vector Spaces?'
---

Quote from [Lecture 3, 6.S897 Algebra and Computation by Madhu Sudan, MIT](http://people.csail.mit.edu/madhu/ST12/scribe/lect03.pdf):

![](https://farm2.staticflickr.com/1752/28756417988_24bc4bca92_o_d.png)

Suppose we have a vector space $(V,+,\circ)$ where:

- $V$ is a set of vectors
- $+$ is vector addition operator: $V \times V \mapsto V$
    - E.g. $\vec a + \vec b = \vec c$
- $\circ$ is vector scaling operator: $F \times V \mapsto V$
    - E.g. $c \circ \vec v = \vec u$

**Note that**, dot product $\cdot$ and cross product $\times$ are NOT part of the vector space definition!

We don't have to follow the notation in the note above, so, taking the definition of Rings, we have

- Case 1: $(V, +)$ corresponds to $(R, +)$ and $(V, \circ)$ to $(R, \cdot)$
    - OR
- Case 2: $(V, +)$ corresponds to $(R, \cdot)$ and $(V, \circ)$ to $(R, +)$

Case 1:

- $(V, +)$ is an Abelian group. (satisfies condition 1)
- $(V, \circ)$ is NOT a monoid. (fails condition 2)

Case 2:

- $(V, \circ)$ is NOT a monoid. (fails condition 1)

So a vector space is not even a ring. Of course it cannot be a field.

A side dish of this post is that we now know $(V, +)$ is an Abelian group.
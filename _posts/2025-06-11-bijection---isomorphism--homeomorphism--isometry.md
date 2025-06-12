---
title: "Bijection -> Isomorphism / Homeomorphism / Isometry"
description: ""
category: Math
tags: []
toc: false
toc_sticky: false
---

学得有点杂，这些概念其实都有 cover，这里总结一下：

| $f: X \to Y$  |  $X$ & $Y$         |  remark                           |  explanation                                                   | 
|---------------|--------------------|-----------------------------------|----------------------------------------------------------------| 
| [bijection](/math/2018/10/06/terms-of-functions)          |  sets                                                                   |                                   |                                                                |
| [isomorphism](/math/2018/05/09/kernel)                    |  [algebra structures](/math/2024/04/07/elementary-algebraic-structures) |  structure-preserving             |  E.g. if $X$ is a field, then $Y$ must be a field              |
| [homeomorphism](/math/2018/10/07/homeomorphism-embedding) |  [topological spaces](/math/2018/07/16/topological-space)               |  topological structure-preserving |  $Y$ must preserve all topological properties that $X$ has     |
| [isometry](/math/2018/10/07/isometry)                     |  [metric spaces](/math/2018/05/09/kernel)                               |  distance-perserving              |  $\forall a,b \in X: d_Y \left( f(a), f(b) \right)= d_X(a, b)$ | 

[网友 ziggurism 的总结](https://www.reddit.com/r/math/comments/7bdyui/comment/dph9x9b/):

> - If there is a one-to-one and onto map between two sets, it is invertible, and we say it is a **bijection**. For the purposes of set theory, if there is a bijection between two sets, they may be treated as the same set.
> - If there is a one-to-one and onto algebra preserving map of groups, rings, fields, etc, whose inverse also preserves the algebraic structure, we say it is an **isomorphism**. For the purposes of group theory (ring theory, etc), if there is a isomorphism between two groups, they may be treated as the same group.
> - If there is a one-to-one and onto mapping of topological spaces which preserves the topological data, and whose inverse also preserves the topological data, we say it is a **homeomorphism**. For the purposes of topology, if there is a homeomorphism between two spaces, they may be treated as the same space.
> - If there is a one-to-one and onto mapping of metric spaces which preserves the distance relation, and whose inverse also preserves the distance relation, we say it is an **isometry**. For the purposes of metric topology, if there is an isometry between two spaces, they may be treated as the same space.

[网友 rogerl 的观点](https://math.stackexchange.com/users/27542/rogerl):

> If you are talking just about sets, with no structure, the two concepts (bijection vs isomorphism) are identical.
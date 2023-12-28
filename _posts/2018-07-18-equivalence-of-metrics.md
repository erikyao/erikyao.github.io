---
category: Math
description: ''
tags:
- Topology
title: Topology Induced by Metric / Equivalence of Metrics
---

虽然 topology 的定义已经摆脱了 metric，但是这并不妨碍我们从 topology 的角度去研究 metric，这并不存在矛盾。

打个比方，研究 topology 就好比研究 "路程长短" 这个问题，一个具体的 topology $\tau$ 就好比 "SF to LA 比 LA to SD 远" 这么一个结论，这个结论并不关心你是用 km 还是 mile 去量的距离，但是这个结论对 km 和 mile 都成立。

## Topology Induced by Metric

Let $(X,d)$ be a metric space, and let $\tau$ be the collection of all subsets of $X$ that are open in the metric space sense. $\tau$ can be called the **topology induced (or generated) by $d$**.

## Equivalence of Metrics

### Topological Equivalence

Two metrics $d_1$ and $d_2$ are said to be **topologically equivalent** if they generate the same topology on $X$. 

- The adjective "topological" is often dropped.

This is equivalent to: a subset $A\subseteq X$ is $d_1$-open $\iff$ it is $d_2$-open.

Strong equivalence is a sufficient but not necessary condition for topological equivalence, i.e. $\text{Strong Equivalence } \Rightarrow \text{ Topological Equivalence}$

### Strong Equivalence

Two metrics $d_1$ and $d_2$ are **strongly equivalent** (or vaguely **metrically equivalent**) $\iff$ there exist positive constants $\alpha$ and $\beta$ such that, for every $x,y \in X$,

$$
\alpha d_1(x,y) \leq d_2(x,y) \leq \beta d_1(x,y)
$$

#### Example

Let $x \in \mathbb{R}^n$, written out in componenet form as $x = (x_1, \dots, x_n)$. 

- The **Euclidean norm** of $x$ is $\Vert x \Vert = \sqrt{x_1^2 + \dots + x_n^2}$
- The **sup norm** of $x$ is $\vert x \vert = \underset{i}{\max} \vert x_i \vert$

Similarly we obtain the Euclidean distance $\Vert x - y \Vert$ and sup distance $\vert x - y \vert$. It can be proved that, 

$$
\vert x - y \vert \leq \Vert x - y \Vert \leq \sqrt{n} \vert x - y \vert
$$
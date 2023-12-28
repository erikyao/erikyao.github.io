---
category: Math
description: ''
tags: []
title: Infinite Cartesian Products
---

其实只是 Terence Tao 大神的定义写得稍微有一点绕，整体还是好理解的。

[Wikipedia: Sequence](https://en.wikipedia.org/wiki/Sequence)

> Formally, a sequence can be defined as a function whose domain is either the set of the natural numbers (for infinite sequences) or the set of the first n natural numbers (for a sequence of finite length $n$)

也就是说，sequence $(a_i)\_{i \in I}$ 和 function $f: I \rightarrow \lbrace a_i \mid i \in I \rbrace$ 是等价的。$f: i \mapsto a_i$ 也就是 $(a_i)\_{i \in I}$.

**Axiom 3.10** (Power set axiom). Let $X$ and $Y$ be sets. Then there exists a set, denoted $Y^X$, which consists of **all** the functions from $X$ to $Y$, thus

$$
f \in  Y^X \Rightarrow f \text{ is a function with domain } X \text{ and range } Y
$$

- 亦即 $Y^X = \lbrace f \mid f \text{ is a function with domain } X \text{ and range } Y \rbrace$
- 注意是 "以 $Y$ 为 range" 而不是 "以 $Y$ 为 codomain"

你结合上面 sequence 的结论就可以看出，$Y^X$ 其实也可看成是一个 sequence 的集合。大神 infinite Cartesian products 的定义就这么写的：

**Definition 8.4.1** (Infinite Cartesian products). Let I be an index set (possibly infinite), and for each $i \in I$ let $X_i$ be a set. We then define the Cartesian product $\underset{i \in I}{\prod} X_i$ to be the set

$$
\underset{i \in I}{\prod} X_i = \lbrace (x_i)_{i \in I} \in (\underset{j \in I}{\cup} X_j)^I \mid \forall i \in I, x_i \in X_i \rbrace
$$

这个定义是兼容 "有限笛卡尔积" 的。举个例子：$X_1 = \lbrace a_3 \rbrace, X_2 = \lbrace a_2 \rbrace, X_3 = \lbrace a_1 \rbrace$。明显 $X_1 \times X_2 \times X_3 = \lbrace (a_3, a_2, a_1) \rbrace$ 就这么一种组合。按照上面的定义：

- $I = \lbrace 1,2,3 \rbrace$
- $\underset{j \in I}{\cup} X_j = \lbrace a_1, a_2, a_3 \rbrace$
- $(\underset{j \in I}{\cup} X_j)^I$ 是所有 $f: \lbrace 1,2,3 \rbrace \rightarrow \lbrace a_1, a_2, a_3 \rbrace$ 的集合
- 条件 $\forall i \in I, x_i \in X_i$ 其实应该理解为 $\forall i \in I, f(i) \in X_i$。这样的 $f$ 只有一个，即 $f(1) = x_1 = a_3, f(2) = x_2 = a_3, f(3) = x_3 = a_1$
- 这个 $f$ 亦即 sequence $(a_3, a_2, a_1)$
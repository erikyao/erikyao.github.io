---
category: Math
description: ''
tags:
- entropy
title: Cross Entropy vs Cross Entropy Loss
---

这俩是有区别的，我一直没有注意直到我发现公式上的区别。我没有注意的原因应该是 regression 没有显式使用 cross entropy loss，而 classification 的 cross entropy loss 是对原生 cross entropy 的扩展。

假设有两个 probability distributions:

- $P = \lbrace p_1, p_2, \dots, p_n \rbrace$
    - $\sum_i p_i = 1$
- $Q = \lbrace q_1, q_2, \dots, q_n \rbrace$ 
    - $\sum_i q_i = 1$

The **cross entropy** of distribution $P$ and $Q$ is 

$$
\operatorname{H}(P, Q) = - \sum_{i} p_i \log_2 q_i
$$

但在 classification 问题下，这个 $P$ 和 $Q$ 不一定是 probability distributions，比方说 (假设 binary classification)：

- $P$ 可以是 labels，比如 $P = \lbrace 1, 1, 0 \rbrace$
- $Q$ 可以是 predictions，比如 $Q = \lbrace 0.9, 0.8, 0.4 \rbrace$
    - 也就是说 $\sum_i p_i = 1$ 和 $\sum_i q_i = 1$ 也不一定成立了

我们接着定义：

- $\overline P = \lbrace 1 - p_1, 1- p_2, \dots, 1 - p_n \rbrace$
    - 也就是反向的 labels，比如 $\overline P = \lbrace 0, 0, 1 \rbrace$
- $\overline Q = \lbrace 1 - q_1, 1- q_2, \dots, 1 - q_n \rbrace$
    - 也就是反向的 predictions，比如 $\overline Q = \lbrace 0.1, 0.2, 0.6 \rbrace$

那么 binary cross entropy loss 就可以定义为：

$$
\operatorname{L}(P, Q) = \operatorname{H}(P, Q) + \operatorname{H}(\overline P, \overline Q)
$$

这也就是常见的写法：

$$
\operatorname{Loss} = - \big( y\log(p) + (1-y)\log(1-p) \big)
$$
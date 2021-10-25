---
layout: post
title: "Hadamard Product / Diagonal Matrix / Orthogonal Matrix"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

## Hadamard Product

Hadamard product 即 element-wise product，记做 $A \odot B$；明显必须有 $\operatorname{shape}(A) = \operatorname{shape}(B) = \operatorname{shape}(A \odot B)$

## Diagonal Matrix

给定一个 vector $\mathbf{v} \in \mathbb{R}^n$，我们可以用 $\operatorname{diag}(\mathbf{v})$ 表示对角线由 $\mathbf{v}$ 确定的 $n \times n$ 对角矩阵。

对角方阵变换计算起来十分方便，比如 $\operatorname{diag}(\mathbf{v}) \mathbf{x}$ 就相当于把 $\mathbf{x}$ 每一个分量 $x_i$ 乘以 $\mathbf{v}$ 对应的分量 $v_i$。换言之：$\operatorname{diag}(\mathbf{v}) \mathbf{x} = \mathbf{v} \odot \mathbf{x}$

对角方阵可逆的条件：

$$
\forall v_i \in \mathbf{v}, v_i \neq 0 \iff \operatorname{diag}(\mathbf{v}) \text{ is invertible}
$$

且此时 $\operatorname{diag}(\mathbf{v})^{-1} = \operatorname{diag}([\frac{1}{v_1} \, \frac{1}{v_2} \, \dots \, \frac{1}{v_n}]^T)$

Diagonal matrix 可以是 non-square 的；由于 non-square matrix 必定不可逆，所以 non-square diagonal matrix 不可逆。但是计算起来仍然和对角方阵一样方便：第一步仍然是 $\mathbf{v} \odot \mathbf{x}$，如果是 "瘦长型" 矩阵，则在 $\mathbf{v} \odot \mathbf{x}$ 末尾添 0；如果是 "矮胖型"，$\mathbf{v} \odot \mathbf{x}$ 的结果要截去末尾的一些元素

## Orthogonal vectors (正交向量) / Orthonormal vectors (标准正交向量) / Orthogonal matrix (正交矩阵)

- Orthogonal vectors: $\mathbf{x}^T \mathbf{y} = 1$
- Orthonormal vectors: $\mathbf{x}^T \mathbf{y} = 1$ 且 $\Vert \mathbf{x} \Vert\_2 = \Vert \mathbf{y} \Vert\_2 = 1$
- Orthogonal matrix: 必须是一个方阵，它的 row vectors 和 column vectors 两两标准正交。亦即 $A^T A = A A^T = I$
    - 这意味着 $A^T = A^{-1}, A = (A^T)^{-1}$
        - 如果 A 还是 symmetric 的，亦即 $A = A^T$，那么就有 $A = A^T = A^{-1}$ 的奇观，此时 $A$ 有一些非常特殊的性质，可以参考 [StackExchange: What can be said about a matrix which is both symmetric and orthogonal?](https://math.stackexchange.com/questions/835829/what-can-be-said-about-a-matrix-which-is-both-symmetric-and-orthogonal)

注意：

- 正交向量是一对，但是正交矩阵是一个
- 虽然叫正交矩阵，但是它的要求是标准正交
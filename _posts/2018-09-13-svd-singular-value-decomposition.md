---
layout: post
title: "SVD: Singular Value Decomposition"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

这次我们从结论出发反推。

SVD 即任意 matrix $A$ 都可以分解为：

$$
A_{m \times n} = U_{m \times m} D_{m \times n} V_{n \times n}^T
$$

其中：

- $U_{m \times m}$ is orthogonal
    - $UU^T = I_{m \times m}$
- $D_{m \times n}$ is diagonal
    - 因为 $D$ 不一定是 square，所以不一定有 $D = D^T$
- $V_{n \times n}$ is orthogonal
    - $VV^T = I_{n \times n}$

当 $m = n$ 时，你可以把 eigen-decomposition 看成是 SVD 的特殊情况。

注意到可以有如下两式：

$$
AA^T = U  D  V^T V D^T U^T = U DD^T U^T \\
A^TA = V D^T U^T U  D  V^T = V D^TD V^V
$$

这个很像是 eigen-decomposition 啊……对的，它其实就是 eigen-decomposition！

所以我们先 eigen-decompose $AA^T$ 得到 $U$，然后 eigen-decompose $A^TA$ 得到 $V$。但是如何从 $DD^T$ 和 $D^TD$ 中确定 $D$？下面详细说。

## 1. Gram matrix

A Gram matrix of vectors $\mathbf{a}\_1, \dots, \mathbf{a}\_n$ is a matrix $G$ whose $G\_{ij} = \mathbf{a}\_i^T \mathbf{a}\_j$. 

If matrix $A\_{m \times n} = [\mathbf{a}\_1 \, \dots \, \mathbf{a}\_n]$, then $G\_{n \times n}=A^TA$

**A Gram matrix is positive definite and symmetric.**

## 2. Rank–nullity theorem 

我们在 [Kernel in Linear Algebra / Inner Product Space / Hyperplane / SVM / Kernel Function / Normed vector space / Metric Space](/math/2018/05/09/kernel) 里其实讲到了这个 Rank–nullity theorem，但是我当时还不知道它可以和 eigen-decomposition 联系起来。

假设有一个线性变换 $L: V \to W$，那么 rank-nullity theorem 说：

$$
\dim(\ker(L)) + \dim(\mathrm{im}(L)) = \dim(V)
$$

我们把 matrix $A_{m \times n}$ 看成一个线性变换 $A: \mathbb{R}^n \to \mathbb{R}^m$，那么 rank-nullity theorem 可以表示为：

$$
\operatorname{nullity}(A) + \operatorname{rank}(A) = n
$$

然后关键来了：

- The nullity is the dimension of the kernel of the matrix.
- 然后 kernel 可以看成什么？**kernel 其实就是 eigenvalue $\lambda = 0$ 的 eigenspace 呀**
- 所以 $\operatorname{rank}(A) = n - \dim(E_{\lambda=0; A})$

## 3. Rank of $AA^T$ and $A^TA$

首先一点：$\operatorname{rank}(A) = \operatorname{rank}(A^T)$。证明就不细说了，思路是：

1. $\operatorname{rank}(A) = \operatorname{ColumnRank}(A) = \operatorname{RowRank}(A)$
2. 然后 $\operatorname{ColumnRank}(A) = \operatorname{RowRank}(A^T)$。

所以必定有 $\operatorname{rank}(AA^T) = \operatorname{rank}(A^TA)$

我们可以进一步证明 $\operatorname{rank}(AA^T) = \operatorname{rank}(A^TA) = \operatorname{rank}(A)$，参考 [Prove rank $AA^T$ = rank A for any $A_{m \times n}$](https://math.stackexchange.com/a/349966)

根据 rank-nullity theorem：

$$
\operatorname{nullity}(A^TA) + \operatorname{rank}(A^TA) = n \\
\operatorname{nullity}(AA^T) + \operatorname{rank}(AA^T) = m
$$

假设 $m > n$，那么 $m - n = \operatorname{nullity}(AA^T) - \operatorname{nullity}(A^TA)$，这个值说明什么？说明针对同一个 eigenvalue $\lambda=0$，$AA^T$ 比 $A^TA$ 多了 $m-n$ 个 eigenvectors。

问题来了：

- 如果不考虑 uniqueness 的话，能否说明 $AA^T$ 比 $A^TA$ 多 $m-n$ 个值为 0 的 eigenvalues？
    - 答案是可以，但是你不能用 "针对同一个 eigenvalue $\lambda=0$，$AA^T$ 比 $A^TA$ 多了 $m-n$ 个 eigenvectors" 这个理由，因为 eigenvector 的数量是 geometric multiplicity
    - 而 eigenvalue 的数量是 algebraic multiplicity
- 那么其他 $\neq 0$ 的 eigenvalues 的情况如何？

看下一节

## 4. Sylvester's determinant identity

If $A$ and $B$ are matrices of size $m \times n$ and $n \times m$ respectively, then

$$
\det(I_{m}+AB)=\det(I_{n}+BA)
$$

我们借此研究一下 characteristic polynomial of $AA^T$:

$$
\begin{align*}
\det(\lambda I_m - AA^T) &= \lambda^{m} \det(I_m + \frac{-A}{\lambda} A^T) \\
                         &= \lambda^{m} \det(I_n + A^T \frac{-A}{\lambda}) \\
                         &= \frac{\lambda^{m}}{\lambda^{n}} \det(\lambda I_n + \lambda A^T \frac{-A}{\lambda}) \\
                         &= \lambda^{m-n} \det(\lambda I_n - A^T A)
\end{align*}
$$

Amazing！我们可以推论 (记得我们仍然在 $m > n$ 的大前提下)：

- 如果 $\lambda \neq 0$ 是 $A^T A$ ($n \times n$) 的 eigenvalue $\rightarrow$ 那它也一定是 $AA^T$ ($m \times m$) 的 eigenvalue
    - 且 algebraic multiplicity 相同
- $A^T A$ ($n \times n$) 不一定有 $\lambda=0$ 的 eigenvalue
- 假设 $A^T A$ ($n \times n$) 中 eigenvalue $\lambda=0$ 的 algebraic multiplicity 为 $m_0$ ($m_0 = 0$ 表示 no such eigenvalue) $\rightarrow$ $AA^T$ ($m \times m$) 中 eigenvalue $\lambda=0$ 的 algebraic multiplicity 为 $m_0 + m - n$
- 换言之，**$A^T A$ and $AA^T$ share the same non-zero eigenvalues!** 

## 5. SVD

我们回头看 $DD^T$ 和 $D^TD$。它俩都是 diagonal 因为 $D$ 本身是 diagonal。考虑到 

- $DD^T$ 对角线上是 $AA^T$ 的 eigenvalues (且按惯例是降序排列，下同)
- $D^TD$ 对角线上是 $A^TA$ 的 eigenvalues

所以 $DD^T$ 和 $D^TD$ 虽然维度不同，但也只是 "对角线上有 0 / 无 0" 和 "对角线上 0 多 / 0 少" 的区别。

考虑到 $D_{m \times n}$ 是 diagonal，所以它应该只需要 $A^T A$ 的 $n$ 个 eigenvalue 就可以确定了。那么它的对角线上的值到底是多少呢？

- 考虑 general 的情况，sigular value 的个数应该是 $\min(m, n)$

**考虑到 $A^T A$ 是 positive definite，所以它的 non-zero eigenvalues 必定为 positive**。所以我们定义 **singular value** $\sigma_i = \sqrt{\lambda_i}$ with $D_{ii} = \sigma_i$ and $D^TD = \operatorname{diag}(\lambda_1, \dots, \lambda_n)$ being $A^T A$'s eigenvalue matrix

然后有：

- $AA^T$ 的 eigenvectors (即 $U$ 的 columns) 称为 $A$ 的 **left singular vectors**
- $A^TA$ 的 eigenvectors (即 $V$ 的 columns) 称为 $A$ 的 **right singular vectors**

一个题外话：**Theorem**: If $\mathbf{q}$ is an eigenvector of $AA^T$, then $A^T \mathbf{q}$ is an eigenvector of $A^TA$.

**Proof:** 

$$
\begin{align}
AA^T \mathbf{q} &= \lambda \mathbf{q} \\
A^T A A^T \mathbf{q} &= A^T \lambda \mathbf{q} \\
A^T A (A^T \mathbf{q}) &= \lambda (A^T \mathbf{q}) \,\,\,\, \blacksquare
\end{align}
$$

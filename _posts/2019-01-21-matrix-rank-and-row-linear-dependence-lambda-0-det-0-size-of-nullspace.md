---
category: Math
description: ''
tags:
- Math-Algebra
title: Matrix Rank / Row Linear Dependence / λ = 0 / &#124;A&#124; = 0 / Size of Nullspace (Kernel)
---

## 1. Matrix Rank

假定我们有一个 matrix $A_{m \times n}$，我们也把它看成一个线性变换 $A: \mathbb{R}^n \to \mathbb{R}^m$。

如果我们定义：

$$
\begin{align*}
\dim(X) & = \text{the number of dimensions of space } X \\
\mathrm{im}(f) &= \text{the image of function } f \\
\operatorname{rowsp}(A) &= \text{the row space of matrix } A = \text{the span of } A \text{'s row vectors} \\
\operatorname{colsp}(A) &= \text{the column space of matrix } A = \text{the span of } A \text{'s column vectors}
\end{align*}
$$

- "span" means "the set of all possible linear combinations"

那么 $\operatorname{rank}(A)$ 有：

$$
\operatorname{rank}(A) = \dim(\operatorname{rowsp}(A)) = \dim(\operatorname{colsp}(A)) = \dim(\mathrm{im}(A))
$$

$\dim(\operatorname{rowsp}(A)) = \dim(\operatorname{colsp}(A))$ 是一个可以 [证明](https://en.wikipedia.org/wiki/Rank_(linear_algebra)#Proofs_that_column_rank_=_row_rank) 的性质，这里不展开。

这里具体说一下数量限制：

$$
\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}

\newcommand{\irow}[1]{
  \begin{smallmatrix}(#1)\end{smallmatrix}
}
$$

- $\dim(\operatorname{rowsp}(A)) \leq m$
    - 你最理想的状态就是你的 $m$ 个 rows 全部 linearly independent，那好，我直接把这个 $m$ 个 rows 全部当做 basis，那么我的 $\dim(\operatorname{rowsp}(A)) = m$
- $\dim(\operatorname{colsp}(A)) \leq n$
    - 理由同上
- $\dim(\mathrm{im}(A)) \leq m$
    - 注意 $\mathrm{im}(A) \subseteq \mathbb{R}^m$ (值域 image 是达域 codomain 的子空间，参 [Terminology Recap: Functions](http://yaoyao.codes/math/2018/10/06/terms-of-functions))
    - $\dim(\mathbb{R}^m) = m$，所以 $\dim(\mathrm{im}(A)) \leq m$
    - 你可能要问：对于任意一个 $\vec v_{n \times 1}$，有 $A \vec v = \vec w_{m \times 1}$，那么这所有的 $\vec w_{m \times 1}$ 构成的 space 为什么可能会有 dimension $\< m$?
        - 想象 3-D space 中的一个 plane，这个 plane 由一组 $\vec w_{3 \times 1}$ 构成，但是 plane 的 dimension 为 2
        - 我们把 $\vec w_i$ 写成 $\vec w_i = \icol{x_i \newline y_i \newline z_i}$，那么这所有的 $\vec w_i$ 都满足 $z_i = a x_i + b y_i$ ($a, b$ 固定；plane 的定义)
    - 换言之， $\operatorname{rank}(A)$ 表示了 image 的 "有效维数"，而 image 的表示形式仍然是高维度的 codomain 的子空间
- 综上，$\operatorname{rank}(A) = \dim(\operatorname{rowsp}(A)) = \dim(\operatorname{colsp}(A)) = \dim(\mathrm{im}(A)) \leq \min(m, n)$

## 2. Row Linear Dependence

### 2.1 如果 $m > n$

如果 $m > n$，那么 $\operatorname{rank}(A) \leq \min(m, n) = n$，换言之

$$
\dim(\operatorname{rowsp}(A)) \leq n < m
$$

**所以，你 $m$ 个 rows 张成的空间的 dimension 不足 $m$，说明你的 rows 存在 linearly dependent 的情况。**

- 这个结论和 $\operatorname{rank}(A)$ 无关

另外:

$$
\dim(\mathrm{im}(A)) \leq n < m
$$

说明 image 是 codomain 的低维度的子空间

### 2.2 如果 $m < n$

如果 $m < n$，那么 $\operatorname{rank}(A) \leq \min(m, n) = m$，换言之

$$
\dim(\operatorname{rowsp}(A)) \leq m
$$

这 $m$ 个 rows 仍然有可能 linearly independent。

**但一旦 $\operatorname{rank}(A) < m$，那么 rows 一定存在 linearly dependent 的情况。**

## 3. $\lambda = 0$ 与 $\vert A \vert = 0$

首先 eigen 和 determinant 都是只对 square matrix 才有意义。下面我们假设 $A_{n \times n}$。

从 [Eigen-decomposition](/math/2018/09/10/eigen-decomposition) 我们知道：eigenvalue 都满足：

$$
p_A(\lambda) = \vert \lambda I - A \vert = 0
$$

若 $A$ 存在一个 $\lambda = 0 \Rightarrow \vert A \vert = 0$。

根据 [Digest of Essence of Linear Algebra](/math/2016/11/17/digest-of-essence-of-linear-algebra) 的说法：$\vert A \vert = 0$ 意味着 linear transformation $A$ 有降维的作用。它的隐含意思其实是:

$$
\operatorname{rank}(A) = \dim(\mathrm{im}(A)) < n
$$

进而 $\dim(\operatorname{rowsp}(A)) = \dim(\operatorname{colsp}(A)) < n$，说明：

- $A$ 的 rows 存在 linearly depenedent 的情况
- $A$ 的 columns 也存在 linearly depenedent 的情况

那么 linearly dependent 的程度是多少呢？是 "1 个 row 可以写成其他 $n-1$ 个 row 的 linear combination" 还是 "2 个 row 可以写成其他 $n-2$ 个 row 的 linear combination"？这是有区别的。

这个程度其实就是 $n - \operatorname{rank}(A)$。

## 4. Size of Nullspace (Kernel)

回忆 rank-nullity theorem：假设有 matrix $A_{m \times n}$ 或者一个线性变换 $A: \mathbb{R}^n \to \mathbb{R}^m$，那么：

$$
\operatorname{nullity}(A) + \operatorname{rank}(A) = n
$$

- $\operatorname{nullity}(A) = \dim(\ker(A))$ 

对于 square matrix $A_{n \times n}$，假设它有一组 eigenvector $\vec v_1, \dots, \vec v_n$，它们其中：

- $\vec v_i = \vec 0$ 
    - 和 
- $\lambda_i = 0$ 对应的 $\vec v_i \neq \vec 0$

构成的子集 span 成的 space 就是 $\ker(A)$。

又因为 eigenvector 不存在 linearly independent 的情况，所以：

$$
\dim(\ker(A)) = \vert V_0 \vert \text{, where } V_0 = \lbrace \vec v_i \vert \lambda_i = 0, \vec v_i \neq \vec 0 \rbrace
$$

- $\ker(A)$ 可以直接拿 $V_0$ 做 basis

所以：

- 若 $\operatorname{rank}(A)$ 越小，$\dim(\ker(A))$ 就越大（但最大大不过 $n$）
- 亦即意味着 $\lambda_i = 0$ 对应的 $\vec v_i \neq \vec 0$ 的数量越多，$\ker(A)$ 的 basis 就越多
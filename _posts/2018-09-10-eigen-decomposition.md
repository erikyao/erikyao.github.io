---
layout: post
title: "Eigen-decomposition"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

给定方阵 $A$，如果 $\exists \lambda, \mathbf{v} \neq \mathbf{0}$ 满足 $A \mathbf{v} = \lambda \mathbf{v}$，我们称 $\lambda$ 是 $A$ 的一个 eigenvalue，$\mathbf{v}$ 是 $A$ 对应 $\lambda$ 的 eigenvector.

- 我们这里不考虑 $\mathbf{C}$ 的情况，只针对 $\mathbf{R}$  

## 1. eigenvalue/eigenvector 数量的限定

### 1.1 限定一：eigenvector $\mathbf{v} \neq \mathbf{0}$

第一个问题：为什么要求 $\mathbf{v} \neq \mathbf{0}$？如果没有这个限定的话，因为 $A \mathbf{0} = \mathbf{0}$ 必定成立，所以 $\forall \lambda \in \mathbb{R}$ 都是 eigenvalue，研究起来没有意义。

- **注意我们并没有要求 $\lambda \neq 0$**

### 1.2 限定二：只研究 unit eigenvector

第二个问题：如果 $A$ 是 $n \times n$ (意味着可能的 eigenvector $\mathbf{v}$ 都只能是 $\in \mathbf{R}^n$)，那么 $A$ 可能会有多少组 eigenvalue/eigenvector？

首先，如果 $A \mathbf{v} = \lambda \mathbf{v}$，那么 $A \frac{\mathbf{v}}{r} = \lambda \frac{\mathbf{v}}{r}$ 对任意 $r \neq 0$ 都成立，所以如果 $\mathbf{v}$ 是对应 $\lambda$ 的 eigenvector，那么任意 $\frac{\mathbf{v}}{r}$ 也是对应 $\lambda$ 的 eigenvector，换言之，$\mathbf{v}$ 直线上的任意 vector 都是对应 $\lambda$ 的 eigenvector。为了研究起来方便，我们做如下限制:

- 在谈及两个或以上的 eigenvector 时，要求它俩是 linearly independent 的。**换言之，如果 $\mathbf{v}$ 是广义上的对应 $\lambda$ 的 eigenvector，我们只取 $\mathbf{v}$ 直线上的某一个 vector 作为这个方向上 eigenvector 的总代表**
- 那这个总代表到底应该选谁？简单，**我们选 $\mathbf{v}$ 直线上的 unit vector**

### 1.3 限定三：只计入 unique 的 eigenvalue

做了这个限定后，还有一种特殊情况要考虑：两个 linearly independent 的 eigenvector $\mathbf{v}$ 和 $\mathbf{w}$ 对应相同的一个 eigenvalue $\lambda$，这种情况是可能发生的。此时 $\mathbf{v}$ 和 $\mathbf{w}$ 任意的线性组合 $\alpha \mathbf{v} + \beta \mathbf{w}$ 也是对应 $\lambda$ 的 eigenvector，研究起来也没有意义。所以我们再加一个限制：

- 只讨论 unique 的 eigenvalue。**换言之，允许一个 eigenvalue 对应多个 eigenvector，但计算 eigenvalue 的个数时，这个 eigenvalue 只算一次**

### 1.4 How many eigenvalues/eigenvectors can a general matrix have? 

对于任意的 $n \times n$ matrix $A$，可以做以下结论：

- $A$ 可以有 $0 \leq \cdot \leq n$ 个 unique 的 eigenvalue
- 如果 $A$ 有 $k$ 个 unique 的 eigenvalue，它可以有 $k \leq \cdot \leq n$ 个 linearly independent 的 eigenvector

注意：

- 同一个矩阵 $A$，如果我们限定 eigenvalue 的 field，比如说要求 $\lambda \in \mathbb{C}$ 或者 $\lambda \in \mathbb{Q}$，eigenvalue 的个数可能会有变化
    - 同理，$A$ 如果是 $\mathbb{C}$ 或是 $\mathbb{Q}$ 上的矩阵，也是可以研究 eigenvalue/eigenvector 的
- 为什么不能有 $\geq n+1$ 个 eigenvector？因为你 $\mathbf{v}\_i \in \mathbb{R}^n$ 且 linearly independent，那么你 $\mathbf{v}\_{n+1}$ 一定可以写成 $\mathbf{v}\_1, \dots, \mathbf{v}\_n$ 的线性组合（抽屉原理？），与前面的限制冲突。

### 1.5 Determine the number of eigenvalues/eigenvectors of a given matrix

那么紧接着有这么一个问题：给定一个 $A$ 是 $n \times n$，能否确定它到底有多少个 eigenvalues/eigenvectors？这个问题其实可解。

我们有：

- 视 $\lambda$ 为未知数。行列式 $p_A(\lambda) = \vert \lambda I - A \vert$ 称为 **characteristic polynomial** of $A$
- 等式 $p_A(\lambda) = 0$ 称为 **characteristic equation** of $A$
- $p_A(\lambda) = 0$ 的解 (亦即 $p_A(\lambda)$ 的 root) 即 $A$ 的 eigenvalues
    - 换言之，解的个数即 eigenvalues 的个数
    - 再换言之，此时可以把 $p_A(\lambda)$ 写成 $p_A(\lambda) = (\lambda - \lambda\_1)^{m\_1} \times \dots \times (\lambda - \lambda\_k)^{m\_k}$

涉及到 eigenvector 的数量，有：

- 我们称 eigenvalue $\lambda^{\ast}$ 具有 **algebraic multiplicity of $m$** 如果 $(\lambda - \lambda^{\ast})$ 在 $p_A(\lambda)$ 展开式中出现了 $m$ 次 (换言之 $p_A(\lambda)$ 展开式中有 $(\lambda - \lambda^{\ast})^m$)
    - 假设我们有 $k$ 个 unique 的 eigenvalue，各自的 algebraic multiplicity 为 $m\_i$，那么一定有 $\sum\_{i=1}^{k} m\_i = n$
    - 因为你 $p_A(\lambda)$ 展开式的总次数一定是 $n$
- 我们称 eigenvalue $\lambda^{\ast}$ 具有 **geometric multiplicity of $m$** 如果 $\lambda^{\ast}$ 对应 $m$ 个 linearly independent 的 eigenvector
- 对同一个 eigenvalue $\lambda^{\ast}$ 而言，它的 geometric multiplicity $\leq$ algebraic multiplicity
    - [证明在此](https://staff.imsa.edu/~fogel/LinAlg/PDF/44%20Multiplicity%20of%20Eigenvalues.pdf)
    - 这也从侧面说明，$k$ 个 unique 的 eigenvalue 不可能有 $> n$ 个 linearly independent 的 eigenvector

### 1.6 题外话：与 $\vert A \vert$ 的关系

如果 $A$ 是 $n \times n$ 且有 $k$ 个 unique eigenvalues，则说明 $p_A(\lambda) = \vert \lambda I - A \vert = (\lambda - \lambda\_1)^{m\_1} \times \dots \times (\lambda - \lambda\_k)^{m\_k}$。

令 $\lambda = 0$，得 $p_A(0) = \vert - A \vert = (- \lambda\_1)^{m\_1} \times \dots \times (- \lambda\_k)^{m\_k} = (-1)^n \prod\_{i=1}^{k} (\lambda_i)^{m_i}$

又因为 $\vert -A \vert = \vert -I A \vert = \vert -I \vert \cdot \vert A \vert = (-1)^{n} \vert A \vert$，所以 $\vert A \vert = \prod\_{i=1}^{k} (\lambda_i)^{m_i}$

- 如果 $\exists \lambda_i = 0$，则 $\vert A \vert = 0$，亦即 $A$ is a singular matrix
- 这个结果，$\vert A \vert = \prod\_{i=1}^{k} (\lambda_i)^{m_i}$，与行列式的几何意义是吻合的
    - 尤其是限定了 eigenvector 是 unit vector 后就更容易理解了 (想象一个 $n$ 维的立方体，每条边长度为 1)
    - 参 [Chapter 5 of Digest of Essence of Linear Algebra](/math/2016/11/17/digest-of-essence-of-linear-algebra)

## 2. Eigen-decomposition

当 $n \times n$ matrix $A$ 有 $n$ 个 linearly independent 的 eigenvector 时，我们定义：

- $V = [\mathbf{v}\_1 \, \dots \, \mathbf{v}\_n]$ (这是个 $n \times n$)
- $\mathbf{\lambda} = [\lambda\_1 \, \dots \, \lambda\_n]^T$ ($\lambda\_i$ 不一定 unique)

Then the eigen-decomposition of $A$ can be written as:

$$
A = V \operatorname{diag}(\mathbf{\lambda}) V^{-1}
$$

**Proof:**

$$
\begin{align*}
AV &= A [\mathbf{v}_1 \, \dots \, \mathbf{v}_n] \newline
   &= [A\mathbf{v}_1 \, \dots \, A\mathbf{v}_n] \newline
   &= [\lambda_1\mathbf{v}_1 \, \dots \, \lambda_n\mathbf{v}_n] \newline
   &= [\mathbf{v}_1 \, \dots \, \mathbf{v}_n] \operatorname{diag}(\mathbf{\lambda}) \newline
   &= V \operatorname{diag}(\mathbf{\lambda})
\end{align*}
$$

## 3. Sufficient conditions of Eigen-decomposition

亦即研究 $\text{condition } ? \Rightarrow n \times n \text{ matrix } A \text{ has } n \text{ linearly independent eigenvectors}$

https://www.quora.com/What-conditions-does-a-matrix-need-to-be-diagonalizable
http://mathworld.wolfram.com/MatrixMinimalPolynomial.html
https://en.wikipedia.org/wiki/Idempotent_matrix
https://math.stackexchange.com/questions/600745/idempotent-matrix-is-diagonalizable
https://en.wikipedia.org/wiki/Minimal_polynomial_(linear_algebra)
https://yutsumura.com/idempotent-projective-matrices-are-diagonalizable/
https://en.wikipedia.org/wiki/Cayley%E2%80%93Hamilton_theorem#Proving_the_theorem_in_general
http://mathworld.wolfram.com/DiagonalizableMatrix.html
http://www.math.harvard.edu/archive/20_spring_05/handouts/ch05_notes.pdf
http://www.math.ku.edu/~lerner/LAnotes/Chapter16.pdf
https://www.adelaide.edu.au/mathslearning/play/seminars/evalue-magic-tricks-handout.pdf
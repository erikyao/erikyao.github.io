---
category: Math
description: ''
tags: []
title: Linear Independence / Affine Independence / Non-singular Square Matrix / Definite
  Square Symmetric Matrix
---

## Linear Independence / Affine Independence

Quote from [IE418: Integer Programming by Jeff Linderoth](http://homepages.cae.wisc.edu/~linderot/classes/ie418/lecture11.pdf)

A finite collection of vectors $\mathbf{x}\_1, \dots, \mathbf{x}\_k \in \mathbb{R}^n$ is **linearly independent** if the unique solution to $\sum\_{i=1}^{k} \lambda\_i \mathbf{x}\_i = \mathbf{0}$ is $\lambda_i = 0, \forall i = 1, 2, \dots, k$. 

A finite collection of vectors $\mathbf{x}\_1, \dots, \mathbf{x}\_k \in \mathbb{R}^n$ is **affine independent** if the unique solution to $\begin{cases} \sum\_{i=1}^{k} \lambda\_i \mathbf{x}\_i = \mathbf{0} \\\\ \sum\_{i=1}^{k} \lambda\_i = 0 \end{cases}$ is $\lambda_i = 0, \forall i = 1, 2, \dots, k$.

- Linear independence implies affine independence, but not vice versa.
    - 亦即：线性不相关 $^{\Rightarrow}_{\nLeftarrow}$ 仿射不相关
    - 反过来：线性相关 $^{\nRightarrow}_{\Leftarrow}$ 仿射相关
- Affine independence is essentially a “coordinate-free” version of linear independence.
    - 这一条你要结合下面几条来考虑
- The following statements are equivalent:
    1. $\mathbf{x}\_1, \dots, \mathbf{x}\_k \in \mathbb{R}^n$ are affinely independent.
    1. $\mathbf{x}\_2 - \mathbf{x}\_1, \dots, \mathbf{x}\_k - \mathbf{x}\_1$ are linearly independent.
    1. $(\mathbf{x}\_1, 1), \dots, (\mathbf{x}\_k, 1) \in \mathbb{R}^{n+1}$ are linearly independent.
        - 这里这个升维的附加值 1 其实可以是任意实数，它的位置也不一定非要在最后，比如你统一升维成 $(99, \mathbf{x}\_1), \dots, (99, \mathbf{x}\_k) \in \mathbb{R}^{n+1}$，它也是 linearly independent 的

**Proof:**

(1) $\Rightarrow$ (2)

反证法。假设 $\mathbf{x}\_2 - \mathbf{x}\_1, \dots, \mathbf{x}\_k - \mathbf{x}\_1$ 线性相关，则 $\exists \lambda\_2, \dots, \lambda_k$ 不全为 0 使得

$$
\lambda_2 (\mathbf{x}_2 - \mathbf{x}_1) + \dots + \lambda_k (\mathbf{x}_k - \mathbf{x}_1) = \mathbf{0}
$$

亦即：

$$
-\sum_{i=2}^{k}\lambda_i \mathbf{x}_1 + \lambda_2 \mathbf{x}_2 + \dots + \lambda_k \mathbf{x}_k = \mathbf{0}
$$

因为 $\lambda\_2, \dots, \lambda_k$ 不全为 0，所以 $-\sum_{i=2}^{k}\lambda_i \neq 0$，与 $\mathbf{x}\_1, \dots, \mathbf{x}\_k \in \mathbb{R}^n$ 仿射不相关的条件矛盾

(1) $\Leftarrow$ (2)

类似

(1) $\Rightarrow$ (3)

反证法。假设 $(\mathbf{x}\_1, t), \dots, (\mathbf{x}\_k, t) \in \mathbb{R}^{n+1}$ 线性相关，则 $\exists \lambda\_1, \dots, \lambda_k$ 不全为 0 使得

$$
\lambda_1 (\mathbf{x}_1, t) + \dots + \lambda_k (\mathbf{x}_k, t) = \mathbf{0}
$$

亦即：

$$
\begin{cases} 
\sum_{i=1}^{k} \lambda_i \mathbf{x}_i = \mathbf{0} \\ \sum_{i=1}^{k} \lambda_i t = 0 
\end{cases}
$$

与 $\mathbf{x}\_1, \dots, \mathbf{x}\_k \in \mathbb{R}^n$ 仿射不相关的条件矛盾

(1) $\Leftarrow$ (3)

类似 $\blacksquare$

我们说 "Affine independence is essentially a “coordinate-free” version of linear independence" 大概也是出于 "升维" 这个场景：你在低维是 affine independent，升到高维 (升多少维没有区别，只要你按照上面 3 式的方法去升就可以) 就必定是 linearly independent，至于你升维之后的位置 (coordinate)，我可以不用管，因为它不影响你 linearly independent。

## Non-singular Square Matrix

假设有 matrix $A$。如果 $\vert A \vert = 0$，我们称 $A$ 为 singular matrix

- 中文翻译是 "奇异矩阵"。我十分不喜欢这个翻译
- 我觉得这里 singular 应该 follow [Wikipedia: Singularity](https://en.wikipedia.org/wiki/Singularity_(mathematics)) 的意思：

> In mathematics, a singularity is in general a point at which a given mathematical object is not defined, or a point of an exceptional set where it fails to be well-behaved in some particular way, such as differentiability.

- 另外注意 **singularity 是一个 general 的性质，并不要求一定是 square matrix 才行** (非 square matrix 也是有 determinant 的)
    - 我们这里限定 square matrix 是为了研究 singularity 带给 square matrix 的其他性质，如下

以下 statements 等价：

- $A$ is a non-singular square matrix
- $A$ is invertible (i.e. $A^{-1}$ 存在)
    - 非 square matrix 必定不可逆
- $A^T$ is invertible (i.e. $(A^{T})^{-1}$ 存在)
- The rows of $A$ are linearly independent
- The coloums of $A$ are linearly independent
    - 其实就是：The rows of $A^T$ are linearly independent
- $\forall \mathbf{b}$, the system $A\mathbf{x} = \mathbf{b}$ has a unique solution

为什么非 square matrix 必定不可逆？

- 因为矩阵和矩阵的逆要满足 $AA^{-1} = A^{-1}A$
    - "先正变换再逆变换" 与 "先逆变换再正变换" 应该是相同的变换效果 (最终应该都等同于 $I$)
- 但是如果是非 square matrix，假设 $A$ 是 $m \times n$，那么 $AA^{-1} = I_{m \times m}$，$A^{-1}A = I_{n \times n}$，变换效果不一样

为什么 The rows of $A$ are linearly independent？

- 如果 $A$ 的 rows 是线性相关，那么必然存在一个非零向量 $\mathbf{x} \neq \mathbf{0}$ 使得 $A \mathbf{x} = \mathbf{0}$，你这就相当于是降维了 (比如说以 $\mathbf{x}$ 为一条边的平行四边形，经过 $A$ 变换，至少会被降维成一条线段)，降维就说明 $\vert A \vert = 0$，矛盾

## Positive-definite / Positive-semidefinite / Negative-definite / Negative-semidefinite Square Symmetric Matrix

假设有 symmetric square metrix $A_{n \times n}$，如果 $\forall \mathbf{x} \neq \mathbf{0}, \mathbf{x} \in \mathbb{R}^n$:

- $\mathbf{x}^T A \mathbf{x} > 0$，我们称 $A$ 为 positive-definite
- $\mathbf{x}^T A \mathbf{x} \geq 0$，我们称 $A$ 为 positive-semidefinite
- $\mathbf{x}^T A \mathbf{x} < 0$，我们称 $A$ 为 negative-definite
- $\mathbf{x}^T A \mathbf{x} \leq 0$，我们称 $A$ 为 negative-semidefinite

注意：

- **必须是 square matrix**，否则 $\mathbf{x}A\mathbf{x}^T$ 算不出来
- **definiteness 性质并不要求一定要是 symmetric** ([例子](https://math.stackexchange.com/a/1954174))
    - 我们这里限定 symmetric square matrix 是为了研究 definiteness 给 symmetric 带来的其他性质

注意以下性质：

- 如果 $A$ 是 positive-definite，说明变换 $A$ 对任意 vector 的方向改动不超过 $\frac{\pi}{2}$
- 如果 $A$ 是 positive-definite，那么 $A$ 的所有 eigenvalues $> 0$
    - $A \mathbf{v} = \lambda \mathbf{v}$，$\lambda$ 是 eigenvalue，$\mathbf{v}$ 是 eigenvector
    - $\mathbf{v}^T A \mathbf{v} = \lambda \Vert \mathbf{v} \Vert^2 > 0$，说明 $\lambda > 0$
- $AA^T$ 必定是 positive-semidefinite；如果 $A$ 可逆，$AA^T$ 升级为 positive-definite
    - 因为 $\mathbf{x}^T AA^T \mathbf{x} = \Vert A^T \mathbf{x} \Vert^2 \geq 0$ 恒成立
    - 只有当 $A^T \mathbf{x} = \mathbf{0}$ 时才可能取等号；又因为 $\mathbf{x} \neq \mathbf{0}$，所以只有是 $A$ 会降维的时候才可能有 $A^T \mathbf{x} = \mathbf{0}$
    - 如果 $A$ 可逆，那么 $A^T$ 也可逆，对非零向量 $\mathbf{x}$ 不可能有 $A^T \mathbf{x} = \mathbf{0}$，所以 $\mathbf{x}^T AA^T \mathbf{x}$ 一定是 $>0$
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
   &= V \operatorname{diag}(\mathbf{\lambda}) \,\,\,\, \blacksquare
\end{align*}
$$

这个 linear transformation 可以这么理解：

- 先实施 $V^{-1}$ 变换，将 basis 换成 $V^{-1}$ 的 column vectors
- $\operatorname{diag}(\mathbf{\lambda})$ stretch 这个新的 basis
- 再实施 $V$ 变换将 basis 再变回来

Eigen-decomposable 的 matrix 也称为 **diagonalizable** 的。Generally 我们有：

**Definition:** $n \times n$ matrices $A$ and $B$ are said to be **similar** if there is an invertible $n \times n$ matrix $P$ such that $A = P B P^{−1}$.

**Definition:** $n \times n$ matrix $A$ is said to be **diagonalizable** if it is similar to a diagonal matrix $D$.

考虑到 diagonal matrix $D$ 计算 $D^n$ 十分方便，我们利用它来计算任意 square matrix $A$ 的 $A^n$:

$$
A^n = (P D P^{−1})^n = P D (P^{−1} P) D (P^{−1} \cdots) \cdots (\cdots P) D P^{−1} = P D^n P^{−1}
$$

## 3. Sufficient conditions of Eigen-decomposition

亦即研究 $\text{condition } ? \Rightarrow n \times n \text{ matrix } A \text{ is diagonalizable }$

### 3.1 Condition 1: $A$ has $n$ linearly independent eigenvectors

Obvious.

### 3.2 Condition 2: $A$ has $n$ unique eigenvalues

Almost obvious.

### 3.3 Condition 3: $A$ is symmetric

实际上 symmetric matrix 是 orthogonally diagonalizable，即：它不光是 diagonalizable 的，而且它的 eigenvectors 是 orthogonal 的 (如果我们进一步 normalize 每个 eigenvector 的话，得到的 $V = [\mathbf{v}_1 \, \dots \, \mathbf{v}_n]$ 会是一个 orthogonal matrix)

**Definition:** A real square matrix $A$ is **orthogonally diagonalizable** if there exist an orthogonal matrix $U$ and a diagonal matrix $D$ such that $A=UDU^{-1}$

- 注意 orthogonal matrix 有 $U^{-1} = U^T$。参 [Hadamard Product / Diagonal Matrix / Orthogonal Matrix](/math/2018/09/06/hadamard-product-diagonal-matrix-orthogonal-matrix)

**Theorem:** (The Spectral Theorem) $A$ is symmetric $\iff$ $A$ is orthogonally diagonalizable

- 叫 Spectral Theorem 是因为：特征分解 (Eigen-decomposition) 又称谱分解 (Spectral decomposition)
- **矩阵的频谱 (spectrum)** 即矩阵的 eigenvalues 的集合

这个证明异常地复杂，需要几个结论来铺垫。([参考](https://www.math.wustl.edu/~freiwald/309orthogdiag.pdf))

#### 3.3.1 Fundamental theorem of algebra

[Wikipedia: Fundamental theorem of algebra](https://en.wikipedia.org/wiki/Fundamental_theorem_of_algebra):

> The fundamental theorem of algebra states that every non-constant single-variable polynomial with complex coefficients has at least one complex root. This includes polynomials with real coefficients, since every real number is a complex number with an imaginary part equal to zero.  
> <br/>
> Equivalently (by definition), the theorem states that the field of complex numbers is algebraically closed.  
> <br/>
> The theorem is also stated as follows: every non-zero, single-variable, degree n polynomial with complex coefficients has, counted with multiplicity, exactly n complex roots. The equivalence of the two statements can be proven through the use of successive polynomial division.  
> <br/> 
> In spite of its name, there is no purely algebraic proof of the theorem, since any proof must use some form of completeness, which is not an algebraic concept. Additionally, it is not fundamental for modern algebra; its name was given at a time when algebra was synonymous with theory of equations.

#### 3.3.2 每个 symmetric real matrix 至少有一个 unique 的 real eigenvalue

根据 Fundamental theorem of algebra，$p_A(\lambda) = \vert \lambda I - A \vert = 0$ 至少有一个 complex 的解，亦即任意 matrix 至少有一个 complex 的 eigenvalue (我们在 1.4 节讲一个 general 的 matrix 可能有 $0 \leq \cdot \leq n$ 个 unique eigenvalues 是限定在了 $\mathbb{R}$)。

我们要证明，对 symmetric 而言，它所有的 complex eigenvalues 其实都是 real。

**Theorem:** If $A$ is a real matrix, then it has $n$ real eigenvalues (counted by their multiplicities; 即不考虑 uniqueness). For each eigenvalue, we can find a real eigenvector associated with it.

**Proof:** 首先说一个现象：对任意 complex vector $\mathbf{z} = [z\_1 \, \dots \, z\_n]^T \in \mathbb{C}^n$，scalar $q = \overline{\mathbf{z}}^T A \mathbf{z}$ 其实是个 real，因为 $q = \overline{q}$ 永远成立：

$$
\begin{align}
q &= \overline{\mathbf{z}}^T A \mathbf{z} \newline
  &= \mathbf{z}^T A \overline{\mathbf{z}} \, (\text{because } A \text{ is symmetric}) \newline
  &= \mathbf{z}^T \overline{A} \overline{\mathbf{z}} \, (\text{because } A \text{ is real}) \newline
  &= \overline{q}
\end{align}
$$

现在假设 $\mathbf{z} = [z\_1 \, \dots \, z\_n]^T \in \mathbb{C}^n$ 是一个 eigenvector，它的 eigenvalue 是 $\lambda$，那么：

$$
\begin{align}
\overline{\mathbf{z}}^T A \mathbf{z} &= \overline{\mathbf{z}}^T \lambda \mathbf{z} \newline
                                     &= \lambda (\overline{\mathbf{z}}^T \mathbf{z}) \newline
                                     &= \lambda \sum_{i=1}^{n} \overline{z_i} z_i \newline
                                     &= \lambda \sum_{i=1}^{n} \vert z_i \vert^2
\end{align}
$$

因为 $\overline{\mathbf{z}}^T A \mathbf{z}$ 是个 real，$\sum_{i=1}^{n} \vert z_i \vert^2$ 也是 real 且 $> 0$ (eigenvector 不能是零向量)，所以 $\lambda$ 也必定是个 real。$\blacksquare$ 

#### 3.3.3 Final Proof

**Proof:** 

(1) $\Rightarrow$

这里我们对 $A$ 的 size $n \times n$ 做归纳证明。

当 $n=1$ 时，$U = I_{1 \times 1}, D=A$，得证。

假定结论对 $(n-1) \times (n-1)$ symmetric matrix 成立。

现在有 $n \times n$ symmetric matrix $A$。从 3.2.2 得知它一定有一个 real eigenvalue $\lambda_1$，我们把它对应的 eigenvector 做 normalization 得到 unit eigenvector $\mathbf{v}_1$。从 $\mathbf{v}_1$ 出发，我们选取 $n-1$ 个向量与 $\mathbf{v}_1$ 一起构成 $\mathbb{R}^n$ 的一组合法的 basis，然后我们可以实施 [Gram-Schmidt process](http://www.math.tamu.edu/~yvorobet/MATH304-503/Lect3-07web.pdf) 得到 $\mathbb{R}^n$ 的一组 orthonormal 的 basis $\mathcal{B} = \lbrace \mathbf{v}_1, \dots, \mathbf{v}_n \rbrace$。

我们定义 change-of-coordinates matrix w.r.t. $\mathcal{B}$ 为 $P = P_{\mathcal{B}} = [\mathbf{v}_1 \, \dots \, \mathbf{v}_n]$。明显 $P$ 是 orthogonal，所以 $P^{-1} = P^T$。我们考虑 matrix $P^{-1}AP$:

- $P^{-1}AP$ is symmetric because $(P^{-1}AP)^T = (P^{T}AP)^T = P^T A^T (P^T)^T = P^T A P = P^{-1} A P$
- 它的 first column 是 $P^{-1}AP \mathbf{e}_1 = P^{-1}A \mathbf{v}_1 = P^{-1} \lambda_1 \mathbf{v}_1 = \lambda_1 \mathbf{e}_1$

所以我们可以把 $P^{-1}AP$ 写成 $P^{-1}AP = \begin{bmatrix} \lambda_1 & \mathbf{0} \\\\ \mathbf{0} & B \end{bmatrix}$ where $B$ is a $(n-1) \times (n-1)$ symmetric matrix. 根据假设，有 $B = QD'Q^{-1}$。

令 $R = \begin{bmatrix} 1 & \mathbf{0} \\\\ \mathbf{0} & Q \end{bmatrix}$。因为 $\begin{bmatrix} 1 & \mathbf{0} \\\\ \mathbf{0} & Q \end{bmatrix} \begin{bmatrix} 1 & \mathbf{0} \\\\ \mathbf{0} & Q^{-1} \end{bmatrix} = \begin{bmatrix} 1 & \mathbf{0} \\\\ \mathbf{0} & I \end{bmatrix}$，所以 $R$ 可逆且 $R^{-1} = \begin{bmatrix} 1 & \mathbf{0} \\\\ \mathbf{0} & Q^{-1} \end{bmatrix}$

再令 $U = PR$。注意 $U^T U = (PR)^T (PR) = R^T P^T P R = I$，亦即 $U$ 也是 orthogonal (参 [Hadamard Product / Diagonal Matrix / Orthogonal Matrix](/math/2018/09/06/hadamard-product-diagonal-matrix-orthogonal-matrix)；这也说明：任意 orthogonal matrices 的 dot product 也是 orthogonal)。

最终，我们有：

$$
\begin{align}
U^{-1}AU &= (PR)^{-1} A (PR) \newline
         &= R^{-1} P^{-1} A P R \newline
         &= R^{-1} \begin{bmatrix} \lambda_1 & \mathbf{0} \\ \mathbf{0} & B \end{bmatrix} R \newline
         &= \begin{bmatrix} 1 & \mathbf{0} \\ \mathbf{0} & Q^{-1} \end{bmatrix} \begin{bmatrix} \lambda_1 & \mathbf{0} \\ \mathbf{0} & B \end{bmatrix} \begin{bmatrix} 1 & \mathbf{0} \\ \mathbf{0} & Q \end{bmatrix} \newline
         &= \begin{bmatrix} \lambda_1 & \mathbf{0} \\ \mathbf{0} & Q^{-1}BQ \end{bmatrix} \newline
         &= \begin{bmatrix} \lambda_1 & \mathbf{0} \\ \mathbf{0} & D' \end{bmatrix} \newline
\end{align}
$$

亦即 $A = U D U^{-1}$ where $D = \begin{bmatrix} \lambda_1 & \mathbf{0} \\\\ \mathbf{0} & D' \end{bmatrix}$。得证。

(注：其实还有有 $A = P^{-1} \begin{bmatrix} \lambda_1 & \mathbf{0} \\\\ \mathbf{0} & B \end{bmatrix} P$，这个式子可以把 $A,B$ 直接联系起来)

(2) $\Leftarrow$

Suppose $A = UDU^{-1} = UDU^{T}$ ($U$ is orthogonal). Then:

$$
\begin{align}
A^T &= (UDU^{T})^T \newline 
    &= (U^T)^T D^T U^T \newline
    &= UDU^T \, \text{(} D \text{ is diagonal thus of course symmetric)} \newline
    &=A
\end{align}
$$

所以 $A$ 是 symmetric。$\blacksquare$

### 3.4 Condition 4: Minimal polynomial of $A$ has no repeated factors (i.e. no repeated roots)

**Definition:** A **monic polynomial** is a single-variable polynomial (that is, a univariate polynomial) in which the leading coefficient (the nonzero coefficient of highest degree) is 1. Therefore, a monic polynomial has the form 

$$
x^{n} + c_{n-1}x^{n-1} + \cdots + c_{2}x^{2} + c_{1}x + c_{0}
$$

**Definition:** A **minimal polynomial** of $x$ is a monic polynomial $m(x)$ which:

1. satisfies $m(x) = 0$ and
    - 此时也称 $m(x)$ 是 annihilating polynomial (零化多项式) for $x$
2. has the smallest possible degree (degree 即最高项的次数)

举例：

- 令 $A = I\_{2 \times 2}$，$p_A(A) = (A - 1)^2$，但由于 $A - 1\_{2 \times 2} = 0\_{2 \times 2}$，所以 minimal polynomial 只需要 $m_A(A) = A - 1$ 就可以了，不需要到 degree 2
- 令 $A = \begin{bmatrix} 1 & 1 \\\\ 0 & 1 \end{bmatrix}$，同样有 $p_A(A) = (A - 1)^2$，但只有 $(A - 1\_{2 \times 2})^2 = 0\_{2 \times 2}$ 而 $A - 1\_{2 \times 2} \neq 0\_{2 \times 2}$，所以 minimal polynomial 需要到 degree 2，即 $m_A(A) = p_A(A) = (A - 1)^2$

**Theorem:** (Cayley-Hamilton theorem) Every square matrix over a commutative ring (such as the real or complex field) satisfies its own characteristic equation. I.e Substituting matrix $A$ for $\lambda$ in $A$'s characteristic polynomial results in the zero matrix. I.e.

$$
\begin{align}
p_A(\lambda) &= \vert \lambda I_n - A_{n \times n} \vert \newline 
p_A(A)       &= 0_{n \times n}
\end{align}
$$

- 注意：实际计算时应该先把 $p_A(\lambda)$ 展开得到关于 $\lambda$ 的多项式，再将 $\lambda$ 替换成 $A$。直接去求 $\vert A I - A \vert$ 看起来有点 confusing
- When the ring is a field, Cayley–Hamilton theorem is equivalent to the statement that **the minimal polynomial of a square matrix divides its characteristic polynomial**. (即 $p_A(A)$ 可以被 $m_A(A)$ 整除)

**Proposition:** $m_A(x)$ has no repeated roots $\iff$ $A$ is diagonalizable.

证明略。([参考](http://www.mathe2.uni-bayreuth.de/stoll/lecture-notes/LinearAlgebraII.pdf))

举例：

- 令 $A = I\_{2 \times 2}$，$m_A(x) = x - 1$，只有一个 root 1，所以 $A$ is diagonalizable
- 令 $A = \begin{bmatrix} 1 & 1 \\\\ 0 & 1 \end{bmatrix}$，$m_A(x) = (x - 1)^2$，root 1 是 repeated，所以 $A$ is not diagonalizable

**Proposition:** Any idempotent matrix is diagonalizable.

**Proof:**

Idempotent matrix $A$ 满足 $A^2 = A$，即 $A(A - I) = 0$，所以潜在的 $m_A(x)$ 可能是：

- $m_A(x) = x$，或者
- $m_A(x) = x - 1$，或者
- $m_A(x) = x(x-1)$

无论哪种情况，$m_A(x)$ 都没有 repeated roots，所以 $A$ is diagonalizable. $\blacksquare$

- [另一种证明思路](https://yutsumura.com/idempotent-projective-matrices-are-diagonalizable/)

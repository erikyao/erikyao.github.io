---
layout: post
title: "Digest of Terence Tao Analysis"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

## Chapters

| Chapter | Title                                          | System                  | Tool                                                           | Side Product                                |
|---------|------------------------------------------------|-------------------------|----------------------------------------------------------------|---------------------------------------------|
| 1       | Introduction                                   |                         |                                                                |                                             |
| 2       | Starting at the beginning: the natural numbers | $\mathbb{N}$            | the Peano axioms                                               |                                             |
| 3       | Set theory                                     | set                     |                                                                |                                             |
| 4       | Integers and rationals                         | $\mathbb{Z}$            | formal differences of $\mathbb{N}$, $a-b$                      | real subtract operation $-$                 |
|         |                                                | $\mathbb{Q}$            | formal quotients of $\mathbb{Z}$, $a//b$                       | real division operation $\div$ |
| 5       | The real numbers                               | $\mathbb{R}$            | formal limit of $\mathbb{Q}$ sequence, $\operatorname{LIM}a_n$ |                                             |
| 6       | Limits of sequences                            | $\mathbb{R}$ / sequence |                                                                | real limit operation $\operatorname{lim}$   |
| 7       | Series                                         | $\mathbb{R}$ / series   | 转化成 paritial sum 的 sequence $(S_N)$，再用 limit 研究       |                                             |
| 8       | Infinite sets                                  | set                     |                                                                |                                             |
| 9       | Continuous functions on $\mathbb{R}$           | function                | 考虑 function 与 sequence 的等价性                             |                                             |

## Chapter 6 - Limits of sequences

### 6.1 Cauchy ([koʊˈʃiː]) sequence

**Definition 5.1.3** ($\epsilon$-steadiness). Let $\epsilon > 0$. A sequence $(a_n)^{\infty}_{n=m}$ is said to be **$\epsilon$-steady** $\iff$ each pair $a_j, a_k$ of sequence elements is $\epsilon$-close for every natural number $j, k$. 

**Definition 5.1.6** (Eventual ε-steadiness). Let $\epsilon > 0$. A sequence $(a_n)^{\infty}\_{n=m}$ is said to be **eventually $\epsilon$-steady** $\iff$ starting from some natural number $N \geq m$, tail sequence $(a_n)^{\infty}_{n=N}$ is $\epsilon$-close.

**Definition 6.1.3** (Cauchy sequences of reals). Let $\epsilon > 0$ be a real number. A sequence $(a_n)^{\infty}\_{n=m}$ is a **Cauchy sequence** $\iff \forall \epsilon$, it's eventually $\epsilon$-steady.

这张图有助理解：Cauchy 就是这么一种 "振幅越来越小" 的感觉：

![](https://farm1.staticflickr.com/932/42850172585_8ec7e1da33_z_d.jpg)

### 6.2 adherent point (附着点) / limit point (极限点) / isolated point (孤立点)

| System                | Concept                                                              | Definition                                                                                                                                                                                      |
|-----------------------|----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| $\mathbb{R}$ sequence | $x$ is **$\epsilon$-adherent** to $(a_n)_{n=m}^{\infty}$             | $\iff \exists i \geq m$ such that $a_i$ is $\epsilon$-close to $x$                                                                                                                              |
|                       | $x$ is **continually $\epsilon$-adherent** to $(a_n)_{n=m}^{\infty}$ | $\iff \forall N \geq m$, $x$ is $\epsilon$-adherent to $(a_n)_{n=N}^{\infty}$ (注意这个定义并不是说 $x$ is $\epsilon$-close to 任意 $a_i$; 而是 $\epsilon$-adherent to 任意 tail sequence)                                                      |
|                       | $x$ is an **adherent point** of $(a_n)_{n=m}^{\infty}$               | $\iff \forall \epsilon > 0$, $x$ is continually $\epsilon$-adherent to $(a_n)_{n=m}^{\infty}$                                                                                                   |
|                       | limit point                                                          | == adherent point                                                                                                                                                                               |
|                       | isolated point                                                       | N/A                                                                                                                                                                                             |
| $\mathbb{R}$ set      | $x$ is **$\epsilon$-adherent** to $X$                                | $\iff \exists x' \in X$ such that $x'$ is $\epsilon$-close to $x$                                                                                                                               |
|                       | **continually $\epsilon$-adherent**                                  | N/A                                                                                                                                                                                             |
|                       | $x$ is an **adherent point** of $X$                                  | $\iff \forall \epsilon > 0$, $x$ is $\epsilon$-adherent to $X$                                                                                                                                  |
|                       | $x$ is a **limit point** of $X$                                      | $\iff x$ is an adherent point of $X - \lbrace x \rbrace$                                                                                                                                        |
|                       | $x$ is an **isolated point** of $X$                                  | $\iff$ a) $x \in X$; b) $\exists \epsilon > 0$ such that $\forall x' \in X - \lbrace x \rbrace$, $\vert x - x' \vert > \epsilon$ (也就是说 $x$ is not a limit point of $X - \lbrace x \rbrace$) |

我觉得大神对 set 的附着点的阐述还是有点啰嗦；补充几点：

- 如果 $x \in X$，那么 $x$ 必然是 $X$ 的附着点，因为必然 $\exists x' = x$ such that $x' - x = 0 < \epsilon$
    - 亦即：$X$ 内的所有元素都是 $X$ 的附着点
- 我们再看一下孤立点的定义，它相当于：如果 $x$ 是 $X$ 的附着点但不是极限点，那么 $x$ 是 $X$ 的孤立点
    - 换言之：附着点要么是极限点，要么是孤立点
    - 再换言之：极限点、孤立点必然都是附着点
- **Lemma 9.1.21** 区间 (无论开闭、无论有限无限) 内的每个元素都是区间的极限点

我们也可以从 neighborhood / open set 的角度来考察附着点的定义：

- $x$ is **$\epsilon$-adherent** to $X$ $\iff$ $\phi(x, \epsilon) \cap X \neq \emptyset$
- Suppose $X$ is a subset of topological space $(\mathbb{R}, \tau)$.
    - $x$ is an **adherent point** of $X$ $\iff$ a) $x \in \mathbb{R}$; b) $\forall$ open set $S \ni x$, $S \cap X \neq \emptyset$
- 如果我们把 sequence 看做一个 set 的话，并定义 tail of sequence $(a_n)\_{n=m}^{\infty}$ after $n = N \geq m$ 为 $T((a_n)_{n=m}^{\infty}, N) = \lbrace a_i \mid N \leq i \leq \infty, i \in \mathbb{N} \rbrace$
    - $x$ is **continually $\epsilon$-adherent** to $(a_n)\_{n=m}^{\infty}$ $\iff$ $\forall N$, $\phi(x, \epsilon) \cap T((a_n)_{n=m}^{\infty}, N) \neq \emptyset$

### 6.3 convergence & limit

注意收敛与极限本身就是连体概念，"收敛到 $L$" 也就意味着 "极限为 $L$"

| System                | Concept                                                          | Definition                                                                                    |
|-----------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| $\mathbb{R}$ sequence | $(a_n)_{n=m}^{\infty}$ is **$\epsilon$-close** to $L$            | $\iff \forall i$, $a_i$ is $\epsilon$-close to $L$                                            |
|                       | $(a_n)_{n=m}^{\infty}$ is **eventually $\epsilon$-close** to $L$ | $\iff \exists N \geq m$, such that starting from $i \geq N$, $a_i$ is $\epsilon$-close to $L$ |
|                       | $(a_n)_{n=m}^{\infty}$ **converges to** $L$                      | $\iff \forall \epsilon > 0$, $(a_n)_{n=m}^{\infty}$ is eventually $\epsilon$-close to $L$     |
|                       | $\underset{n \to \infty}{\lim}a_n = L$                           | == $(a_n)_{n=m}^{\infty}$ converges to $L$                                                    |
| $\mathbb{R}$ sequence | $(a_n)\_{n=m}^{\infty}$ is **$\epsilon$-close** to $(b_n)\_{n=m}^{\infty}$            | $\iff \forall i$, $a_i$ is $\epsilon$-close to $b_i$                                            |
|                       | $(a_n)\_{n=m}^{\infty}$ is **eventually $\epsilon$-close** to $(b_n)\_{n=m}^{\infty}$ | $\iff \exists N \geq m$, such that starting from $i \geq N$, $a_i$ is $\epsilon$-close to $b_i$ |
|                       | $(a_n)\_{n=m}^{\infty}$ is **equivalent to** $(b_n)\_{n=m}^{\infty}$                  | $\iff \forall \epsilon > 0$, $(a_n)\_{n=m}^{\infty}$ is eventually $\epsilon$-close to $(b_n)\_{n=m}^{\infty}$ |
| $f: X \to \mathbb{R}$ | $f$ is **$\epsilon$-close** to $L$                                                           | $\iff \forall x \in X$, $f(x)$ is $\epsilon$-close to $L$                                  |
|                       | $x_0$ is an adherent point of $X$; $f$ is **$\epsilon$-close** to $L$ near $x_0$             | $\iff \exists \delta>0$ such that $f \vert_{\Phi(x_0, \delta)}$ is $\epsilon$-close to $L$ |
|                       | $x_0$ is an adherent point of $X$; $E \subseteq X$; $f$ **converges** to $L$ at $x_0$ in $E$ | $\iff \forall \epsilon>0$, $f \vert_E$ is **$\epsilon$-close** to $L$ near $x_0$           |
|                       | $\underset{x \to x_0; x \in E}{\lim}f(x) = L$                                                | == $f$ **converges** to $L$ at $x_0$ in $E$                                                |

对 $\mathbb{R}$ sequence：

- $(a_n)_{n=m}^{\infty}$ is **divergent** == $\underset{n \to \infty}{\lim}a_n$ is undefined
- 注意与 adherence 的区别：
    - A point is adherent to a sequence. 是个 touchpoint 的概念，有一个点 close 就可以
    - A sequence is close to a point. 这要求明显就严格了，你 sequence 的全员，或者 tail 的全员必须都要 close 才行
    - 明显 limit $L$ is a limit point

对 $f: X \to \mathbb{R}$：

- $X \in \mathbb{R}$
- $f \vert_E$ 表示缩小 $f$ 的定义域到 $E$ 上
- 对比一下，可以发现 $f$ 其实可以理解为两个 sequence，一个 sequence 由定义域的元素构成，另一个由值域的元素构成：
    - "$f$ is locally close to $L$ at $x_0$" 可以看做从值域，i.e. 所有 $f(x)$ 值中构建一个 sequence，使得所有 $\lbrace f(x) \mid x \in E \cap \Phi(x_0, \delta) \rbrace$ 的值都排在 sequence 的尾部并从这个部分起 eventually $\epsilon$-close to $L$
    - 可见这两组概念是高度统一的
- **Definition 9.3.6** 等价定义：$\underset{x \to x_0; x \in E}{\lim}f(x) = L$ $\iff$ $\forall \epsilon > 0$, $\exists \delta > 0$ such that $\forall x \in E$, if $\vert x - x_0 \vert < \delta$ then $\vert f(x) - L \vert \leq \epsilon$
    - 可以把函数收敛看做是 "定义域元素序列" 与 "值域元素序列" 联动的过程
- **Lemma 9.9.7** $(a_n)$ and $(b_n)$ are equivalent $\iff$ $\underset{n \to \infty}{\lim} (a_n - b_n) = 0$

### 6.4 boundedness

**Definition 6.1.16** (Bounded sequences). A sequence $(a_n)_{n=m}^{\infty}$ of real numbers is bounded by a real number $M>0$ $\iff \forall i$, $\vert a_i \vert \leq M$.

**Definition 9.1.22** (Bounded sets). A subset $X$ of the real line is said to be bounded if for some real number $M>0$ we have $X \subset [-M, M]$.

### 6.5 收敛 & 有界 & Cauchy (Part 1)

#### 结论一：收敛必定 Cauchy

**[Proof](https://proofwiki.org/wiki/Convergent_Sequence_is_Cauchy_Sequence):** Let $(a_n)$ be a sequence that converges to the limit $L$.

Let $\epsilon>0$. Then also $\frac{\epsilon}{2}>0$.

Because $(a_n)$ converges to $L$, we have:

$$
\exists N: \forall n>N: d(x_n,L) < \frac{\epsilon}{2}
$$

So $\forall m>N$ and $\forall n>N$, by Triangle Inequality:

$$
d(x_n,x_m) \leq d(x_n,L) + d(L,x_m) < \frac{\epsilon}{2} + \frac{\epsilon}{2} = \epsilon	
$$

Thus $(a_n)$ is a Cauchy sequence. $\blacksquare$

#### 结论二：Cauchy 必定有界

**[Proof](https://proofwiki.org/wiki/Cauchy_Sequence_is_Bounded):** Let $(a_n)$ be a Cauchy sequence.

By definition:

$$
\forall \epsilon>0: \exists N \in \mathbb{N}: \forall m,n>N: d(a_n, a_m) < \epsilon
$$

Particularly, setting $\epsilon=1$ (这里设置成任何正数都可以):

$$
\exists N_1: \forall m,n>N_1: d(a_n, a_m) < 1
$$

This also means that:

$$
\forall n \geq N_1: d(a_n, a_{N_1}) < 1
$$

To show $(a_n)$ is bounded, we can show that there exists $b$ and $K$ such that $\forall i$, $d(a_n, b) \leq K$ (thus $\vert a_i \vert \leq b + K$).

Let $K′$ be the maximum distance from $a_{N_1}$ to any of the earlier terms (before $N_1$) in the sequence. That is, 

$$
K′ = \max \lbrace d(a_1, a_{N_1}), d(a_2, a_{N_1}), \dots, d(a_{N_1 -1}, a_{N_1}) \rbrace
$$

Then:

- Each $a_n$ for $n \geq N_1$ satisfies $d(a_{N_1}, a_n) \leq 1$ ($N_1$ 之后的无限子序列有界)
- Each $a_n$ for $n \leq N_1$ satisfies $d(a_{N_1}, a_n) \leq K'$ (前 $N_1 - 1$ 项构成一个有限序列，而有限序列必定有界)

Thus, taking $b=x_{N_1}$ and $K=\max \lbrace K′,1 \rbrace$, we have shown that each $a_i$ satisfies $d(a_n, b) \leq K$.

So, $(a_n)$ is bounded. $\blacksquare$

#### 结论三：收敛必定有界（由结论一与结论二推出）

#### 结论四 & 五：有界不一定收敛；有界不一定 Cauchy

例子：

$$
a_n =\begin{cases}0 & \text{if } n \text{ is even} \\1 & \text{if } n \text{ is odd}\end{cases} 
$$

### 6.6 Subsequence (子序列)

**Definition 6.6.1** (Subsequences). Let $(a_n)\_{n=0}^{\infty}$ and $(b_n)\_{n=0}^{\infty}$ be sequences of real numbers. We say that $(b_n)$ is a subsequence of $(a_n)$ $\iff$ $\exists$ function $f: \mathbb{N} \to \mathbb{N}$ which is strictly increasing (i.e., $f(n + 1) > f(n)$, $\forall n \in \mathbb{N}$) such that $b_i = a_{f(i)}$, $\forall i \in \mathbb{N}$.

**Proposition 6.6.5** (Subsequences related to limits). 以下两命题等价：

- 序列 $(a_n)\_{n=0}^{\infty}$ 收敛到 $L$
    - $\iff$
- $(a_n)\_{n=0}^{\infty}$ 的每个子序列都收敛到 $L$

**Proposition 6.6.6** (Subsequences related to limit points). 以下两命题等价：

- 序列 $(a_n)\_{n=0}^{\infty}$ 有极限点 $L$
    - $\iff$
- 存在 $(a_n)\_{n=0}^{\infty}$ 的子序列收敛到 $L$

**Theorem 6.6.8** (Bolzano-Weierstrass theorem). 序列有界 $\Rightarrow$ 序列至少有一个子序列收敛 (亦即，序列至少有一个极限点，See Proposition 6.6.6)

### 6.7 收敛 & 有界 & Cauchy (Part 2)

#### 结论六：如果序列收敛，那么极限是序列唯一的极限点

**Proof:** 因为序列收敛（假设收敛到 $L$），那么它的所有的子序列都收敛到 $L$，从而不可能有子序列收敛到其他的值，亦即所有子序列对应的极限点都是 $L$ (See Proposition 6.6.6)，亦即 $L$ 是唯一的极限点。 $\blacksquare$

#### 结论七：有唯一极限点不一定收敛

例子：$\lbrace 1, 2, 1, 4, 1, 6, \dots 1, 2n, \dots \rbrace$ 有唯一极限点 $1$，但是它是无界的，更谈不上收敛

#### 结论八：如果序列有界且发散，则序列可以有两个不同的极限点

**[Proof](https://math.stackexchange.com/a/298828):** 序列 $(a_n)$ 有界，根据 Bolzano-Weierstrass theorem，我们可以构建一个子序列，假设收敛到 $p$。

因为 $(a_n)$ 发散，所以 $(a_n)$ 不收敛到 $p$，所以存在 $\epsilon'$，对任意 $N$，都存在 $i_N \geq N$ 使得 $\vert a_{i\_N} - p \vert > \epsilon'$。取这样所有的 $a_{i\_N}$ 构成序列 $(a_n')$，它也是 $(a_n)$ 的子序列，所以 $(a_n')$ 也有界，再根据 Bolzano-Weierstrass theorem，$(a_n')$ 有一个子序列 $(a_n'')$ 收敛到 $q$。因为 $(a_n')$ 每一项都远离 $p$，所以 $(a_n'')$ 的每一项都远离 $p$，所以 $(a_n'')$ 不可能收敛到 $p$，亦即 $q \neq p$。

又因为 $(a_n'')$ 同时也是 $(a_n)$ 的子序列，所以相当于 $(a_n)$ 有两个极限点：$p$ 和 $q$。$\blacksquare$

- $(a_n)$ 明显不可能每一项都远离 $p$ 但它的子序列 $(a_n')$ 可以做到每一项都远离 $p$，这看上去有点矛盾，但我可以举一个例子：
    - $a_n = \begin{cases}1 & \text{if } n \text{ is odd} \\\\ 2 & \text{if } n \text{ is even}\end{cases}$ 有界且发散
    - 令 $f(n) = 2n - 1$，$b_i = a_{f(i)}$，那么 $(b_n)$ 是 $(a_n)$ 的子序列，且 $(b_n)$ 全为 1，收敛到 1
    - 令 $f(n) = 2n$，$c_i = a_{f(i)}$，那么 $(c_n)$ 是 $(a_n)$ 的子序列，且 $(c_n)$ 全为 2，收敛到 2

#### 结论九：如果序列有界且极限点唯一，那么序列收敛

**Proof:** 假设 $(a_n)$ 有界且有唯一极限点 $L$，那么根据 Proposition 6.6.6，$(a_n)$ 存在子序列 $(b_n)$ 收敛到 $L$。若 $(a_n)$ 还存在子序列 $(c_n)$ 发散，根据结论八，$(c_n)$ 可以有两个极限点，换言之 $(a_n)$ 也可以有两个极限点，矛盾。所以 $(a_n)$ 所有子序列收敛，又因为极限点唯一，所以 $(a_n)$ 收敛 (根据 Proposition 6.6.5)。 $\blacksquare$

#### 结论十：Cauchy 必收敛

**[Proof](http://www.maths.qmul.ac.uk/~ig/MAS111/Cauchy%20Criterion.pdf):** 设 $(a_n)$ 是 Cauchy。根据结论二 "Cauchy 必定有界" 和 Bolzano-Weierstrass theorem "有界必有子序列收敛"，可以假设 $(a_{n\_k})$ 是一个收敛的子序列，并收敛到 $L$，即 $\underset{k \to \infty}{a_{n\_k}} = L$

现在要证明 $(a_n)$ 也收敛到 $L$。

固定一个 $\epsilon > 0$。$\exists N_1$ such that $\forall i,j \geq N_1$ we have $\vert a_i - a_j \vert < \frac{\epsilon}{2}$ (根据 Cauchy 定义)。

同时 $\exists N_2$ such that $\forall n_i \geq N_2$ we have $\vert a_{n\_i} - L \vert < \frac{\epsilon}{2}$ (根据子序列收敛)

Set $N = \max \lbrace N_1, N_2 \rbrace$. Then $\forall i \geq N$, fix a $n_j > N$ and we have

$$
\vert a_i - L \vert = \vert (a_i - a_{n_j}) + (a_{n_j} - L) \vert \leq \vert a_i - a_{n_j} \vert + \vert a_{n_j} - L \vert < \frac{\epsilon}{2} + \frac{\epsilon}{2} = \epsilon
$$

所以 $(a_n)$ 也收敛到 $L$。$\blacksquare$

#### 大总结

- 收敛 $\iff$ Cauchy $\iff$ 有界且极限点唯一（结论一、二、三、六、九、十）
- 收敛 $_{\nLeftarrow}^{\Rightarrow}$ 有界 $\Rightarrow$ 有子序列收敛 $\Rightarrow$ 存在一个对应的极限点（结论四、Bolzano-Weierstrass theorem、Proposition 6.6.6）
- 收敛 $_{\nLeftarrow}^{\Rightarrow}$ 有唯一极限点（结论七）

## Chapter 9 - Continuous functions on $\mathbb{R}$

### 9.1 $\mathbb{R}$ set: adherent point / limit point / isolated point / closure / relations to subsequences

adherent point、limit point、isolated point 的定义参 Section 6.2。需要注意的是：

- sequence 的 adherent point == limit point，但是 set 的 limit point 是 adherent point 的特殊情况
- 但是从后面的结论来看，关于 **"序列、子序列、极限点"** 的一些结论可以近似地迁移到 **"集合、集合元素构成的序列、附着点"** 上，这个对应关系希望你牢记

**Lemma 9.1.14** Let $X$ be a subset of $\mathbb{R}$, and let $L \in \mathbb{R}$ (注意并没有要求 $L \in X$). 以下两命题等价 (注意联系 Proposition 6.6.6)：

- $L$ 是 $X$ 的附着点 
    - $\iff$
- $\exists$ sequence $(a_n)$ where all $a_i \in X$，并且 $(a_n)$ 收敛到 $L$
    - 注意：考虑到序列是可以有重复元素的，所以 **"由 $X$ 元素组成的序列 $(a_n)$" 并不要求 $(a_n)$ 使用 $X$ 中的全部元素**
- 这个 lemma 简单说就是：$X$ 的附着点可以通过 $X$ 的元素的极限获得

**Definition 9.1.10** (Closure). Let $X$ be a subset of $\mathbb{R}$. The **closure** of $X$, sometimes denoted $\overline X$ is defined to be the set of all the adherent points of $X$.

- 考虑到 "所有 $x \in X$ 都是 $X$ 的附着点" (See section 6.2)，可以有 $\overline X = X \cup \lbrace l \mid l \text{ is an adherent point outside } X \rbrace$
- Elementary properties of closures:
    - $X \subseteq \overline{X}$
    - $\overline{X \cup Y} = \overline{X} \cup \overline{Y}$
    - $\overline{X \cap Y} \subseteq \overline{X} \cap \overline{Y}$
    - If $X \subseteq Y \Rightarrow$ then $\overline{X} \subseteq \overline{Y}$
- 举例：
    - $(a, b)$, $(a, b]$, $[a, b)$, $[a, b]$ 的闭包都是 $[a, b]$
    - $(a, \infty)$, $[a, \infty)$ 的闭包都是 $[a, \infty)$
    - $(-\infty, a)$, $(\infty, a]$ 的闭包都是 $(\infty, a]$
    - $\overline{\mathbb{N}} = \mathbb{N}$
    - $\overline{\mathbb{Z}} = \mathbb{Z}$
    - $\overline{\mathbb{Q}} = \mathbb{R}$ (注意 $\mathbb{Q}$ 是开集)
    - $\overline{\mathbb{R}} = \mathbb{R}$
    - $\overline{\emptyset} = \emptyset$

**Definition 9.1.15** (Closed sets). A set $X \subseteq \mathbb{R}$ is said to be **closed** if $\overline{X} = X$, i.e. $X$ contains all of its adherent points.

- 也相当于：闭集不存在 adherent point outside itself
- 所以 $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{R}$, $\emptyset$ 是闭集，$\mathbb{Q}$ 是开集

我们可以看到，现在有一条 "集合闭包 $\to$ 附着点 $\to$ 序列极限" 的证据链：

**Corollary 9.1.17** 设 $X \subseteq \mathbb{R}$:

- If $X$ is closed, then $\forall$ 由 $X$ 元素组成的收敛序列 $(a_n)$ $\Rightarrow \underset{n \to \infty}{\lim} a_n \in X$
    - > [so by closed it means that "we can't escape by limit"](https://math.stackexchange.com/a/299767)
- If $\forall$ 由 $X$ 元素组成的收敛序列 $(a_n)$ 都有 $\underset{n \to \infty}{\lim} a_n \in X$ $\Rightarrow$ $X$ is closed

**Theorem 9.1.24** (Heine-Borel theorem for the line). 设 $X \subseteq \mathbb{R}$，以下两命题等价:

- $X$ 是闭集且有界
    - $\iff$
- $\forall$ 由 $X$ 元素组成的序列 $(a_n)$，存在它的一个子序列 $(a_{n_j})$ 收敛到 $L$ 并且 $L \in X$

**[Proof](https://math.stackexchange.com/questions/659249/the-heine-borel-theorem-for-the-real-line):**

(1) $\Rightarrow$

- $X$ 有界，所以 $(a_n)$ 有界，所以存在一个子序列 $(a_{n_j})$ 收敛 (Bolzano-Weierstrass)
- 因为 $X$ 是闭集，所以 $(a_{n_j})$ 极限必然 $\in X$

(2) $\Leftarrow$

Proof by contradiction:

(2.1) 假设 $X$ 无界

Let's construct a family of sets, $A_n = \lbrace a \in X \mid \vert x \vert > n \rbrace$. Each $A_i$ is non-empty. 根据选择公理 (AC, Axiom of Choice：Given index set $I$，若 $\forall i \in I$, 集合 $X_i$ 不空，那么 $\underset{i \in I}{\prod} X_i$ 也不空)，存在序列 $(a_n)$ where $a_i \in A_i$, $\forall i$

序列 $(a_n)$ 由 $X$ 的元素构成，所以存在一个子序列 $(a_{n_j})$ 收敛到 $L \in X$。

但是 $\forall j \geq L + 1$, $\vert a_j \vert > L + 1$，所以 $L$ 不可能是 $(a_n)$ 的极限点。矛盾 (Proposition 6.6.6)

(2.2) 假设 $X$ 是开集

那么存在一个 $X$ 的附着点 $L' \notin X$，同时存在一个由 $X$ 的元素构成的序列 $(a_n)$ 收敛到 $L'$ (Lemma 9.1.14)。

因为 $(a_n)$ 收敛到 $L$，所以 $(a_n)$ 所有的子序列都收敛到 $L' \notin X$ (Proposition 6.6.5)，所以不可能存在一个子序列 $(a_{n_j})$ 收敛到 $L \in X$。矛盾。$\blacksquare$

### 9.2 Limits of functions

部分概念 See Section 6.3

**Proposition 9.3.9** Let $X \subseteq \mathbb{R}$, $f: X \to \mathbb{R}$, $E \subseteq X$, $x_0$ be an adherent point of $E$, and $L$ be a real number. 以下两命题等价：

- $\underset{x \to x_0; x \in E}{\lim}f(x) = L$
    - $\iff$
- $\forall$ 由 $E$ 元素构成并收敛到 $x_0$ 的序列 $(a_n)\_{n=0}^{\infty}$，函数值序列 $(f(a_n))\_{n=0}^{\infty}$ 收敛到 $L$

**[Proof](https://proofwiki.org/wiki/Limit_of_Function_by_Convergent_Sequences):**

(1) $\Rightarrow$

(Definition 9.3.6) $\underset{x \to x_0; x \in E}{\lim}f(x) = L$ $\iff$ $\forall \epsilon > 0$, $\exists \delta > 0$ such that $\forall x \in E$, if $\vert x - x_0 \vert < \delta$ then $\vert f(x) - L \vert \leq \epsilon$

Now suppose $(a_n)$ converges to $x_0$, so $\forall \delta: \exists N: \forall i > N: \vert a_i - x_0 \vert < \delta$.

Therefore $\forall \epsilon > 0: \exists N: \forall i > N： \vert f(a_i) - L \vert \leq \epsilon$, i.e. $\underset{n \to \infty}{\lim}f(a_n) = L$

- 注意 $\underset{n \to \infty}{\lim}f(a_n)$ 是序列极限而不是函数极限

(2) $\Leftarrow$

Proof by contradiction. Suppose $\underset{x \to x_0; x \in E}{\lim}f(x) \neq L$, then 

$$
\exists \epsilon > 0: \forall \delta > 0: \text{ if } \vert x - x_0 \vert < \delta, \text{ then } \vert f(x) - L \vert > \epsilon
$$

Construct a family of sets $S_n = \lbrace x \in E \mid \vert x - x_0 \vert < \frac{1}{n} \text{ and } \vert f(x) - L \vert > \epsilon \rbrace$

$S_i$ is non-empty for all $i \in \mathbb{N}\_{>0}$. By AC, $\exists$ a sequence $(a_n)$ such that $a_i \in S_i$ for all $i \in \mathbb{N}_{>0}$.

Obviously $(a_n)$ is a sequence of $E$ and converges to $x_0$, but sequence $(f(a_n))$ diverges from $L$ from our construction. This is our contradiction, and so the assumption does not hold. $\blacksquare$

**Corollary 9.3.10** Following Proposition 9.3.9, we have:

$$
\text{if } \underset{x \to x_0; x \in E}{\lim}f(x) = L \text{, and } \underset{n \to \infty}{\lim}a_n = x_0 (a_i \in E) \Rightarrow \text{ then } \underset{n \to \infty}{\lim} f(a_n) = L
$$

- 注：我们值考虑 $x_0$ 是 $E$ 的附着点的情况，是因为根据 Corollary 9.3.10，如果 $x_0$ 不是 $E$ 的附着点，不可能有 $\underset{n \to \infty}{\lim}a_n = x_0$ (极限是极限点，极限点必然是附着点)

**Proposition 9.3.18** (Limits are local). Let $X \subseteq \mathbb{R}$, $f: X \to \mathbb{R}$, $E \subseteq X$, $x_0$ be an adherent point of $E$, $L$ be a real number, and $\delta > 0$. Then:

$$
\underset{x \to x_0; x \in E}{\lim}f(x) = L \iff \underset{x \to x_0; x \in E \cap (x_0 - \delta, x_0 + \delta)}{\lim}f(x) = L
$$

**[Proof](http://www.math.ucla.edu/~tao/resource/general/131ah.1.03w/HW6.pdf):**

(1) $\Rightarrow$

Obviously

(2) $\Leftarrow$

Suppose that $(x_n)$ is a sequence of terms in $X$, not necessarily $\delta$-close to $x_0$, converging to $x_0$. Then by definition, $\exists M$ such that the sequence $(x_n)_{n \geq M}$ is $\delta$-close to $x_0$. Therefore, we may apply the hypothesis and conclude that $\underset{n \to \infty; n \geq M}{\lim}f(x_n) = L$. But this is the same as $\underset{n \to \infty}{\lim}f(x_n) = L$. 

Thus for any sequence $(x_n)$ converging to $x_0$, $(f(x_n))$ converges to $L$. $\blacksquare$

### 9.3 Continuous functions

**Definition 9.4.1** (Continuity). Let $X \subseteq \mathbb{R}$, $f: X \to \mathbb{R}$, $x_0 \in X$ (所以 $x_0$ 必然是 adherent point).

$f$ is **continuous** at $x_0$ $\iff$ $\underset{x \to x_0; x \in X}{\lim}f(x) = f(x_0)$

- 简单点说：连续 $\iff$ 收敛到自己的函数值本身

$f$ is **continuous** on $X$ $\iff$ $\forall x_0 \in X$, $f$ is continuous at $x_0$

**Proposition 9.4.7** (Equivalent formulations of continuity). Let $X \subseteq \mathbb{R}$, $f: X \to \mathbb{R}$, $x_0 \in X$. 以下三命题等价：

- $f$ is continuous at $x_0$
    - $\iff$
- $\forall$ 由 $X$ 元素构成并收敛到 $x_0$ 的序列 $(a_n)\_{n=0}^{\infty}$，函数值序列 $(f(a_n))\_{n=0}^{\infty}$ 收敛到 $f(x_0)$ (Proposition 9.3.9)
    - $\iff$
- $\forall \epsilon > 0$, $\exists \delta > 0$ such that $\forall x \in X$, if $\vert x - x_0 \vert < \delta$ then $\vert f(x) - L \vert \leq \epsilon$ (Definition 9.3.6)

### 9.4 Uniform continuity (一致连续性)

考虑 "定义域序列" 与 "值域序列" 联动时，这两个序列的震荡幅度。假设 $f$ 在 $x_1$, $x_2$ 两点上连续，所以 $\forall \epsilon: \exists \delta_1, \delta_2$ such that $f \vert_{x \in \Phi(x_1, \delta_1)}$ is $\epsilon$-close to $f(x_1)$, and $f \vert_{x \in \Phi(x_2, \delta_2)}$ is $\epsilon$-close to $f(x_2)$. 对同一个固定的 $\epsilon$，"值域序列" 的震荡区间 $\Phi(f(x_1), \epsilon)$ 与 $\Phi(f(x_2), \epsilon)$ 的 size 是一样大的，但是 "定义域序列" 的震荡区间 $\Phi(x_1, \delta_1)$ 和 $\Phi(x_2, \delta_2)$ 的差别可能会很大。尤其当定义域是开区间时，越靠近边缘 adherent point 时，"定义域序列" 的震荡区间的变化可能会越大。

如果对任意的 $x_1$、$x_2$，对任意固定的 $\epsilon$，我们都能有 $\delta_1 = \delta_2$，我们称 $f$ 是一致连续的。正式定义如下：

**Definition 9.9.2** (Uniform continuity). Let $X \subseteq \mathbb{R}$, $f: X \to \mathbb{R}$. 

$f$ is **uniformly continuous** $\iff \forall \epsilon: \exists$ a uniform $\delta > 0$ such that whenever $x$ and $x_0$ are $\delta$-close, $f(x)$ and $f(x_0)$ are $\epsilon$-close.

- 考虑与 "连续" 概念的 quantifier order 的区别：
    - 函数连续：$\forall x_0: \forall \epsilon: \exists \delta: \vert x - x_0 \vert < \delta \Rightarrow \vert f(x) - f(x_0) \vert < \epsilon$
    - 一致连续：$\forall \epsilon: \exists \delta: \forall x_0: \vert x - x_0 \vert < \delta \Rightarrow \vert f(x) - f(x_0) \vert < \epsilon$

**Proposition 9.9.8** Let $X \subseteq \mathbb{R}$, $f: X \to \mathbb{R}$. 以下两命题等价：

- $f$ is uniformly continuous on $X$
    - $\iff$
- $\forall$ 由 $X$ 元素构成的等价序列 $(a_n)$ 和 $(b_n)$，$(f(a_n))$ 与 $(f(b_n))$ 也等价

**Proposition 9.9.12** Let $X \subseteq \mathbb{R}$, $f: X \to \mathbb{R}$ be a uniformly continuous function. 若由 $X$ 元素构成的序列$(a_n)$ 是 Cauchy，则 $(f(a_n))$ 也是 Cauchy

**Proposition 9.9.15** Let $X \subseteq \mathbb{R}$, $f: X \to \mathbb{R}$ be a uniformly continuous function. If $E$ is a bounded subset of $X$，then $f(E)$ is also bounded.

**Proposition 9.9.16** Let $a < b$ be real numbers, $f: [a, b] \to \mathbb{R}$ be a continuous function on $[a, b]$. Then $f$ is actually uniformly continuous.

- 亦即：定义域是闭区间的连续函数必定一致连续
- 举例：$f(x) = x^2$，(1) 若定义域是 $\mathbb{R}$，则它不是一致收敛；(2) 若定义域是闭区间 $[a,b]$，则它一致收敛。

**[Proof](https://math.stackexchange.com/a/503101):** 

欲证明：$\forall \epsilon: \exists \delta$ such that $\vert x-y \vert < \delta \Rightarrow \vert x^2 - y^2 \vert < \epsilon$.

(1) Consider $\epsilon = 1$. Then $\delta$ is fixed, and let $y = x + \frac{\delta}{2}$. Therefore $\forall x$, we should have $\vert x^2 - (x+\frac{\delta}{2})^2 \vert = \vert x\delta + \frac{\delta^2}{4} \vert  < 1$. This cannot hold when $x$ is sufficiently large.

(2) $\vert x^2 - y^2 \vert = \vert x - y \vert \times \vert x + y \vert \leq \vert x - y \vert \times 2b$

$\forall \epsilon: \exists \delta = \frac{\epsilon}{2b}$ such that $\vert x-y \vert < \delta \Rightarrow \vert x^2 - y^2 \vert < \epsilon$. $\blacksquare$

### 9.5 连续、一致连续与函数映射性质

- Proposition 9.3.9：连续函数把收敛序列映射成收敛序列
- Proposition 9.9.12：一致连续函数把 Cauchy 序列映射成 Cauchy 序列
    - 这两条看上去有点奇怪，因为前面我们说 "收敛 $\iff$ Cauchy"。但是这是有前提的，这个前提就是序列要在 $\mathbb{R}$ 上. 
        - **A metric space $X$ is said to be complete if every Cauchy sequence is convergent**. $\mathbb{R}$ 是 complete 的；$\mathbb{Q}$ 是 incomplete 的
        - Cauchy 在 incomplete space 上不一定收敛. 比如 $\mathbb{Q}$ 上的一个 Cauchy 可能会收敛到一个实数上，但这个序列在 $\mathbb{Q}$ 上不收敛
    - Proposition 9.9.12 的这个描述是对 complete space 和 incomplete space 都成立的
- Proposition 9.9.8：一对等价序列，经过一致连续函数映射，得到的两个结果序列仍然等价
- Proposition 9.9.15：一致连续函数把有界集映射成有界集

### Extra Notes

- Theorem 6.4.18 (Completeness of the reals). 实数序列 Cauchy $\iff$ 收敛
    - In the language of metric spaces (see Chapter 12), Theorem 6.4.18 asserts that the real numbers are a **complete** metric space--hat they do not contain "holes" the same way the rationale do. (Certainly the rationale have lots of Cauchy sequences which do not converge to other rationale; take for instance the sequence $1,1.4,1.41,1.414,1.4142,\dots$ which converges to the irrational $\sqrt{2}$.) 
    - This property is closely related to the least upper bound property (Theorem 5.5.9), and is one of the principal characteristics which make the real numbers superior to the rational numbers for the purposes of doing analysis (taking limits, taking derivatives and integrals, finding zeroes of functions, that kind of thing), as we shall see in later chapters.
- Bolzano-Weierstrass theorem: 
    - It says that if a sequence is bounded, then eventually it has no choice but to converge in some places; it has "no room" to spread out and stop itself from acquiring limit points. It is not true for unbounded sequences; for instance, the sequence $1,2,3,\dots$ has no convergent subsequences whatsoever. 
    - In the language of topology, this means that the interval $\lbrace x \in \mathbb{R}: -Μ < x < Μ \rbrace$ is **compact**, whereas an unbounded set such as the real line $\mathbb{R}$ is not compact. The distinction between compact sets and non-compact sets will be very important in later chapters--of similar importance to the distinction between finite sets and infinite sets.
- Heine-Borel theorem for the line: 
    - In the language of metric space topology, it asserts that every subset of the real line which is closed and bounded, is also **compact**. A more general version of this theorem can be found in Theorem 12.5.7.

## Chapter 10 - Differentiation of functions (函数的微分)

**Definition 10.1.1** (Differentiability at a point). Let $X \subset \mathbb{R}$, and let $x \in X$ and also a limit point of $X$. Let $f: X \to \mathbb{R}$ be a function. If 

$$
\underset{x \to x_0; x \in X - \lbrace x_0 \rbrace}{\lim} \frac{f(x) - f(x_0)}{x - x_0} = L
$$

then we say $f$ is **differentiable at $x_0$ on $X$ with derivative $L$**, and write $f'(x_0) := L$.

If:

- the limit does not exist, or
- $x_0 \notin X$, or
- $x_0$ is not a limit point of $X$,

we leave $f'(x_0)$ undefined and say $f$ is not differentiable at $x_0$ on $X$.

注：

- We need $x_0$ to be a limit point in order for $x_0$ to be adherent to $X - \lbrace x_0 \rbrace$, otherwise the limit would automatically be undefined.
- 实际应用中 $X$ 大多为区间，区间上的所有点都是 limit point (Lemma 9.1.21)，所以一般也无需注意这个问题
- 函数可以看做是 "定义域序列" 和 "值域序列" 的联动，i.e. $(x) \vert_{x \in X}$ vs $(f(x)) \vert_{x \in X}$，那么导数就可以看做是 "定义域序列" 与 "微分序列" 的联动，i.e. $(x) \vert_{x \in X}$ vs $(\frac{f(x) - f(x_0)}{x - x_0}) \vert_{x \in X}$

**Proposition 10.1.10** (Differentiability implies continuity). 若 $f$ 在 $x_0$ 处可微，则 $f$ 在 $x_0$ 处连续

**[Proof No.1](http://www-math.mit.edu/~djk/18_01/chapter02/proof04.html):**

已知 $f$ 在 $x_0$ 处可微，则 $\underset{x \to x_0}{\lim} \frac{f(x) - f(x_0)}{x - x_0} = f'(x_0)$。考虑以下极限及变形 (参考 Proposition 9.3.14, Limit laws for functions)：

$$
\begin{align*}
\underset{x \to x_0}{\lim} \left [ f(x) - f(x_0) \right ] & = \underset{x \to x_0}{\lim} \left [ (x - x_0) \cdot \frac{f(x) - f(x_0)}{x - x_0} \right ] \newline
                                                          & = \left [ \underset{x \to x_0}{\lim}(x - x_0) \right ] \cdot \left [ \underset{x \to x_0}{\lim} \frac{f(x) - f(x_0)}{x - x_0} \right ] \newline
                                                          & = 0 \cdot f'(x_0) \newline 
                                                          & = 0
\end{align*}
$$

which implies $\underset{x \to x_0}{\lim} f(x) = f(x_0)$. $\blacksquare$

**[Proof No.2](https://math.stackexchange.com/a/269671):**

已知 $f$ 在 $x_0$ 处可微，根据 Proposition 10.1.7 (Newton's approximation) 可得：$\forall \epsilon: \exists \delta$ such that $\vert x - x_0 \vert \leq \delta \Rightarrow \left \| \frac{f(x) - f(x_0)}{x - x_0} - f'(x_0) \right \| \leq \epsilon$。

另有：

$$
\left | \frac{f(x) - f(x_0)}{x - x_0} \right |  - \left | f'(x_0) \right | \leq \left| \frac{f(x) - f(x_0)}{x - x_0} - f'(x_0) \right| \leq \epsilon
$$

所以有：$\left \| f(x) - f(x_0) \right \| \leq \vert x - x_0 \vert \cdot \left ( \epsilon + \left \| f'(x_0) \right \| \right )$

根据 Proposition 9.4.7 (Equivalent formulations of continuity)，用反证法，假设 $\exists \epsilon': \forall \delta'$ such that $\vert x - x_0 \vert \leq \delta' \Rightarrow \left \| f(x) - f(x_0) \right \| > \epsilon'$. 

取 $\delta' = \min\left(\delta, \frac{\epsilon'}{\epsilon + \left \| f'(x_0) \right \|} \right)$. 

因为 $\vert x - x_0 \vert \leq \delta' \leq \delta$，所以满足 $\left \| f(x) - f(x_0) \right \| \leq \vert x - x_0 \vert \cdot \left ( \epsilon + \left \| f'(x_0) \right \| \right ) \leq \delta' \cdot \left ( \epsilon + \left \| f'(x_0) \right \| \right )$。

又因为 $\delta' \leq \frac{\epsilon'}{\epsilon + \left \| f'(x_0) \right \|}$，所以有 $\left \| f(x) - f(x_0) \right \| \leq \frac{\epsilon'}{\epsilon + \left \| f'(x_0) \right \|} \cdot \left ( \epsilon + \left \| f'(x_0) \right \| \right ) = \epsilon'$，矛盾。$\blacksquare$

### 10.2 Local maxima, local minima, and derivatives (局部最大最小值与导数)

**Definition 10.2.1** (Local maxima and minima). Let $X \subset \mathbb{R}$, and $f: X \to \mathbb{R}$ be a function. $f$ **attains a local maximum/minimum at $x_0$** $\iff$ $\exists \delta > 0$ such that $f\vert_{x \cap (x_0 - \delta, x_0 + \delta)}$ attains a maximum/minimum at $x_0$.

- Makes sense. 你要达到局部最大最小，那一定要有一个 "局部" 才行，这个 "局部" 就是 neighborhood $\Phi(x_0, \delta)$

**Proposition 10.2.6** (Fermat's Theorem on stationary points). Let $a < b$ be real numbers, and $f: (a,b) \to \mathbb{R}$ be a function. 如果 $x_0 \in (a, b)$、$f$ 在 $x_0$ 处可微、且 $f$ 在 $x_0$ 处达到局部最大最小值 $\Rightarrow$ 那么 $f'(x_0) = 0$.

**[Proof](http://mathonline.wikidot.com/fermat-s-theorem-for-extrema):**

假设 $f$ 在 $x_0$ 处达到局部最大，那么 $f(x_0) \geq f(x)$ for all $x$ with $\vert x−x_0 \vert < \delta$. 假设 $x = x_0 + h$，$h \in (-\delta,\delta)$, 那么 $f(x_0) - f(x) \geq 0$，$x_0 - x = h$。所以：

- $\underset{h \to 0^+}{\lim} \frac{f(x_0) - f(x)}{x_0 - x} \geq 0$
- $\underset{h \to 0^-}{\lim} \frac{f(x_0) - f(x)}{x_0 - x} \leq 0$

补充知识点：

- **Definition 9.5.1** (Left and right limits):
    - **右极限** $\underset{x \to x_0^+}{\lim} f(x) := \underset{x \to x_0; x \in X \cap (x_0, \infty)}{\lim} f(x)$
    - **左极限** $\underset{x \to x_0^-}{\lim} f(x) := \underset{x \to x_0; x \in X \cap (-\infty， x_0)}{\lim} f(x)$
- 当 $\underset{x \to x_0^+}{\lim} f(x) \neq \underset{x \to x_0^-}{\lim} f(x)$ 时，我们称 $f$ 在 $x_0$ 处有一个 **jump discontinuity**
- 当 $\underset{x \to x_0^+}{\lim} f(x) = \underset{x \to x_0^-}{\lim} f(x)$ 但都 $\neq \underset{x \to x_0}{\lim} f(x)$ 时，我们称 $f$ 在 $x_0$ 处有一个 **removable discontinuity**
    - 虽然书上没有明说，但是，这都叫 discontinuity 了，说明**这两种情况下，$f$ 在 $x_0$ 处必定不连续**

因为 $f$ 在 $x_0$ 处可微，说明 $f$ 在 $x_0$ 处必定连续 (Proposition 10.1.10, Differentiability implies continuity)，所以只能有 $\underset{h \to 0^+}{\lim} \frac{f(x_0) - f(x)}{x_0 - x} = \underset{h \to 0^-}{\lim} \frac{f(x_0) - f(x)}{x_0 - x} = \underset{h \to 0}{\lim} \frac{f(x_0) - f(x)}{x_0 - x} = 0$，亦即 $f'(x_0) = 0$。

假设 $f$ 在 $x_0$ 处达到局部最小同理。$\blacksquare$

注意：

- 从证明可以看出，"$f$ 在 $x_0$ 处可微" 这个条件非常重要
- 如果定义域是开区间 $[a, b]$，命题不成立，因为最大最小值可能在端点 $a$、$b$ 处取得，但 $f'(a)$、$f'(b)$ 可以不为 0
- **逆命题不成立**
    - 这里涉及到 convex function 的问题。注意：如果 $-f$ 是 convex 的话，那么 $f$ 称为 concave。这并不构成一个 "非黑即白" 的关系。事实上存在 "既不 convex 也不 concave" 的函数，比如 $f(x) = x^3$
    - $f(x) = x^3$ 在 $x=0$ 处有 $f'(0) = 0$，但 $f(0)$ 既不是最大值也不是最小值
    - 对 convex 而言，$f'(x) = 0$ 的点是 global minimum；对 concave 而言，$f'(x) = 0$ 的点是 global maximum。(See Corollary 1 of [Theory of convex functions, A.A. Ahmadi@Princeton](http://www.princeton.edu/~amirali/Public/Teaching/ORF523/S16/ORF523_S16_Lec7_gh.pdf))

**Theorem 10.2.7** (Rolle's theorem). Let $a < b$ be real numbers, and $f: [a,b] \to \mathbb{R}$. $f$ 连续且在 $(a,b)$ 上可微. 如果 $f(a) = f(b)$ $\Rightarrow$ 那么 $\exists x \in (a,b)$ 使得 $f'(x) = 0$.

**[Proof](https://en.wikipedia.org/wiki/Rolle%27s_theorem#Proof_of_the_generalized_version):**

补充知识点：**Proposition 9.6.7** (Maximum principle, 最大值原理). 如果 $f: [a,b] \to \mathbb{R}$ 连续，那么 $\exists x_{\text{max}} \in [a, b]$ 使得 $f(x_{\text{max}})$ 达到最大值，也 $\exists x_{\text{min}} \in [a, b]$ 使得 $f(x_{\text{min}})$ 达到最小值

- 注：更准确的名字应该是 extremum principle, 极值原理

 (1) 如果最大值/最小值出现在端点 $x=a$ 或者 $x=b$，因为 $f(a) = f(b)$，所以要么存在一点 $c \in (a, b)$ 使得 $f(c)$ 达到最小值/最大值；要么 $f(x)$ 是一条水平线段，其上任意一点都有 $f'(x) = 0$
 
 (2) 如果最大值/最小值出现在一点 $c \in (a, b)$，那么根据 Proposition 10.2.6 (Fermat's Theorem on stationary points)，$f'(c) = 0$。$\blacksquare$

**Corollary 10.2.9** (Mean value theorem, 平均值定理; Rolle's theorem 的重要推论). Let $a < b$ be real numbers, and $f: [a,b] \to \mathbb{R}$. $f$ 连续且在 $(a,b)$ 上可微 $\Rightarrow$ 那么 $\exists x \in (a, b)$ 使得 $f'(x) = \frac{f(b) - f(a)}{b-a}$.

**[Proof](http://math.caltech.edu/~nets/lecture9.pdf):**

Construct $g(x) = f(x) - \frac{f(b) - f(a)}{b-a} \cdot (x - a)$. Note that $g(a) = g(b) = f(a)$. 

根据 Proposition 9.4.9 (Arithmetic preserves continuity) 和 Theorem 10.1.13 (Differential calculus) 的 sum rule (和法则)，$g(x)$ 与 $f(x)$ 一样连续且在 $(a,b)$ 上可微。根据 Rolle's theorem，$\exists c \in (a,b)$ 使得 $g'(x) = f'(x) - \frac{f(b) - f(a)}{b-a} = 0$，亦即 $f'(x) = \frac{f(b) - f(a)}{b-a}$。$\blacksquare$

**Definition 10.2.10** (Lipschitz continuous function). Let $a < b$ be real numbers, and $f: [a,b] \to \mathbb{R}$. If $\forall x,y \in [a, b]$ such that $\vert f(x) - f(y) \vert \leq M \cdot \vert x - y \vert$, we call $f$ a **Lipschitz continuous function** and $M > 0$ the **Lipschitz constant**.

**Corollary 10.2.11** (具有有界导数的函数必定 Lipschitz 连续). Let $M > 0$, $a < b$ be real numbers, and $f: [a,b] \to \mathbb{R}$. $f$ 连续、在 $(a,b)$ 上可微、且 $\forall x \in (a, b)$ 有 $\vert f'(x) \vert \leq M$ (即 $f'(x)$ 在 $(a, b)$ 上有界)，则 $f$ 是 $M$-Lipschitz 连续函数。

**Proof:** 

根据 Corollary 10.2.9 (Mean value theorem)，$\forall x,y \in [a, b]:\exists c \in (x, y)$ 使得 $f'(c) = \frac{f(x) - f(y)}{x-y}$。

又因为 $\vert f'(c) \vert \leq M$，所以 $\vert f(x) - f(y) \vert \leq M \cdot \vert x - y \vert$。$\blacksquare$

### 10.3 Monotone functions and derivatives (单调性与导数)

**Proposition 10.3.1** Let $X \subset \mathbb{R}$, and let $x \in X$ and also a limit point of $X$. Let $f: X \to \mathbb{R}$ be a function. 如果 $f$ 单调增且在 $x_0$ 可微，则 $f'(x_0) \geq 0$; 如果 $f$ 单调减且在 $x_0$ 可微，则 $f'(x_0) \leq 0$。

- 存在单调但并不总是可微的函数，比如 $f(x) =\begin{cases}x - 1 & x < 0 \\\\ x + 1 & x > 0\end{cases}$
- 严格单调增并不意味着 $f'(x_0) > 0$，比如 $f(x) = x^3, f'(0) = 0$。严格单调减同理。
    - 但是反过来，**在闭区间**上如果恒有 $f'(x) > 0$，则必定严格单调增。严格单调减同理。

**Proposition 10.3.3** Let $a < b$ be real numbers, and $f: [a,b] \to \mathbb{R}$. $f$ 在整个 $[a,b]$ 上都可微. 

- 如果 $\forall x \in [a, b]$，$f'(x) > 0$，则 $f$ 严格单调增
- 如果 $\forall x \in [a, b]$，$f'(x) < 0$，则 $f$ 严格单调减
- 如果 $\forall x \in [a, b]$，$f'(x) = 0$，则 $f$ 是常值函数

**Proof:** 对 $\forall p, q \in [a, b]$，假设 $p < q$，用 Corollary 10.2.9 (Mean value theorem) $\blacksquare$

- 注意：如果定义域不是一个闭区间的形式，那么可能存在 "处处$f'(x) > 0$，但 $f$ 并不严格单调增" 的情况
    - 注意开区间 $(a, b) \subset [a, b]$，所以如果不是闭区间而是一个开区间的话，Proposition 10.3.3 也成立
    - 但对于 "有洞" 的情况，就不好说了
        - 比如 $X = \mathbb{R} - \lbrace 0 \rbrace$，$f: X \to \mathbb{R}$ 定义为 $f(x) = \begin{cases}x + 1 & x < 0 \\\\ x - 1 & x > 0\end{cases}$，$f(-0.5) > f(0.5)$

### 10.4 L'Hopital's rule

[知乎：如何解释洛必达法则？](https://www.zhihu.com/question/28862411)

## Chapter 11 - The Riemann integral

Riemann 积分定义的是 **定积分** (**definite integral**)，即定义在固定区间上的积分。

### 11.1 Upper and lower Riemann integrals (上 Riemann 积分 / 下 Riemann 积分 / Riemann 积分)

首先复习一下 $\sup$ 和 $\inf$：

System | Concept | Definition
-------|---------|-----------
$\mathbb{R}$ set $E$ | supremum (上确界) or least upper bound (最小上界)    | $\sup(E)$
                     | infmum (下确界) or greatest lower bound (最大下界)   | $\inf(E) = -\sup(-E)$ where $-E = \lbrace -x \mid x \in E \rbrace$
$\mathbb{R}$ sequence $(a_n)\_{n=m}^{\infty}$ | supremum | $\underset{n \geq m}{\sup} a_n = \sup(A)$ where $A = \lbrace a_i \mid i \geq m \rbrace$
                                              | infmum   | $\underset{n \geq m}{\inf} a_n = \inf(A)$ where $A = \lbrace a_i \mid i \geq m \rbrace$
                                              | limsup (上极限) | $\underset{n \to \infty}{\lim\sup} \, a_n := \underset{N \geq m}{\inf} a_{N}^{+}$ where $a_{i}^{+} = \underset{n \geq i}{\sup} a_n$ (换言之，$a_{i}^{+}$ 是 $a_i$ 起尾部序列的上确界；上极限即 "尾部序列上确界序列" 的下确界)
                                              | liminf (下极限) | $\underset{n \to \infty}{\lim\inf} \, a_n := \underset{N \geq m}{\sup} a_{N}^{-}$ where $a_{i}^{-} = \underset{n \geq i}{\inf} a_n$ (换言之，$a_{i}^{-}$ 是 $a_i$ 起尾部序列的下确界；下极限即 "尾部序列下确界序列" 的上确界)

简单说几个概念和记号：

- 逐段常值函数：Piecewise Constant Functions，简写为 p.c. function
- 逐段常值积分：写作 $p.c. \int_{I} f$ (其实 $\int_{I} f == \int_{I} f(x) dx$ 是一回事)
- 设 $f: I \to \mathbb{R}$ 和 $g: I \to \mathbb{R}$：
    - 如果 $\forall x \in I: g(x) \geq f(x)$，我们称 "$g$ **majorizes** $f$" (或者称 $g$ 为 $f$ 的 "**上方控制**函数") 
    - 如果 $\forall x \in I: g(x) \leq f(x)$，我们称 "$g$ **minorizes** $f$" (或者称 $g$ 为 $f$ 的 "**下方控制**函数") 

Riemann 积分：

- 设 $f: I \to \mathbb{R}$ 是定义在有界区间 $I$ 上的有界函数
    - 令 $\overline{F}\_{p.c. \int} = \lbrace p.c. \int_I g \mid g \text { majorizes } f \text{ and } g \text { is p.c.} \rbrace$
        - **Upper Riemann integral** (**上 Riemann 积分**) $\overline{\int}\_{I} f := \inf(\overline{F}\_{p.c. \int})$
    - 令 $\underline{F}\_{p.c. \int} = \lbrace p.c. \int_I g \mid g \text { minorizes } f \text{ and } g \text { is p.c.} \rbrace$
        - **Lower Riemann integral** (**下 Riemann 积分**) $\underline{\int}\_{I} f := \sup(\underline{F}\_{p.c. \int})$
- 类似于 limsup (上极限) 和 liminf (下极限)，换言之：
    - $f$ 的上 Riemann 积分即 "f 的所有 p.c. 的上方控制函数的 p.c. 积分" 集合的下确界
    - $f$ 的下 Riemann 积分即 "f 的所有 p.c. 的下方控制函数的 p.c. 积分" 集合的上确界
- 如果 $\overline{\int}\_{I} f = \underline{\int}\_{I} f$，我们称 $f$ 在 $I$ 上 **Riemann integrable** (**Riemann 可积**)，并定义 **Riemann integral** $\int\_{I} f := \overline{\int}\_{I} f = \underline{\int}\_{I} f$
    - 如果不相等的话，我们称 "非 Riemann 可积"
- 如果 $I$ 是单点集或者 $\emptyset$，那么对一切函数 $f$ 都有 $\int_{I} f = 0$ (注意这种情况下 $f$ 也被认为是 constant 的)
- **无界函数不是 Riemann 可积的**；这种函数的积分称为 **improper integral**，需要用更高级的积分方法，比如 Lebesgue 积分来计算

Riemann 可积性的保持：假设 $I$ 是有界区间，$f: I \to \mathbb{R}$ 和 $g: I \to \mathbb{R}$ Riemann 可积，$c$ 为常数：

- 相反数函数 $(-f)$ 可积，且等于积分相反数
- 倒数函数 $(\frac{1}{f})$ 可积，且等于积分倒数。证明需要限制积分为 0 的情况，参 [Prove that $1/f$ is Riemann integrable on $[a,b]$](https://math.stackexchange.com/questions/257916/prove-that-1-f-is-riemann-integrable-on-a-b)
- 函数 $(f+g)$ 与 $(f-g)$ 均可积，且积分等于各自的积分和/差
- 函数 $(cf)$ 可积，且积分等于 $c \times \int_I f$
- 函数 $\max(f, g)(x) = \max \lbrace f(x), g(x) \rbrace$ 与 $\min(f, g)(x) = \min \lbrace f(x), g(x) \rbrace$ 均可积，证明见书上
- $f$ 的正部 (positive part) $f_+ := \max(f, 0)$ 与负部 (negative part) $f_- := \min(f, 0)$ 均可积
- 绝对值函数 $\vert f \vert = f\_+ - f\_+$ 可积
- 函数 $(f \times g)$ 可积
    - $f = f_{+} + f_{-}$
    - $g = g_{+} + g_{-}$
    - $f \times g = f_{+} g_{+} + f_{+} g_{-} + f_{-} g_{+} + f_{-} g_{-}$，四个小项都可积，所以整体可积，证明见书上

### 11.2 连续函数的 Riemann 可积性

**Theorem 11.5.1** (有界区间上的一致连续函数可积). 设 $I$ 是有界区间，$f: I \to \mathbb{R}$ 一致连续，则 $f$ Riemann 可积

考虑 Proposition 9.9.16 (闭区间上的连续函数一致连续)，我们可以有：

**Corollary 11.5.2** (闭区间上的连续函数可积). 设 $I$ 是闭区间 $[a, b]$，$f: I \to \mathbb{R}$ 连续，则 $f$ Riemann 可积

- 如果是开区间，$f$ 可能无界，也就必然不可积。比如 $f(x) = \frac{1}{x}$ 在 $(0,1)$ 上就不可积

**Proposition 11.5.3** (有界区间上的连续有界函数可积). 设 $I$ 是有界区间，$f: I \to \mathbb{R}$ 连续且有界，则 $f$ Riemann 可积

**Proposition 11.5.6** (有界区间上的逐段连续有界函数可积). 设 $I$ 是有界区间，$f: I \to \mathbb{R}$ 有界且逐段连续，则 $f$ Riemann 可积

### 11.3 连续函数的 Riemann 可积性

**Proposition 11.6.1** (闭区间上的单调函数可积). 设 $I$ 是闭区间 $[a, b]$，$f: I \to \mathbb{R}$ 单调，则 $f$ Riemann 可积

**Corollary 11.6.2** (有界区间上的有界单调函数可积). 设 $I$ 是有界区间，$f: I \to \mathbb{R}$ 单调且有界，则 $f$ Riemann 可积

### 11.4 Fundamental theorems of calculus

- 注意单词：
    - calculus 指 "微积分学"
    - differentiation 是 "微分"，联系 "导数" derivative $f'(x)$
    - integration 是 "积分"，联系 "积分" integral $\int_{I} f$

**Theorem 11.9.1** (1st Fundamental Theorem of Calculus). Let $a<b$ be real numbers. 设 $f: [a, b] \to \mathbb{R}$ Riemann 可积。$F: [a, b] \to \mathbb{R}$ 定义为：

$$
F(x) = \int_{[a, b]} f
$$

则 $F$ 连续。进而，如果 $x_0 \in [a, b]$ 且 $f$ 在 $x_0$ 处连续，则 $F$ 在 $x_0$ 处可微并且 $F'(x_0) = f(x_0)$

- 这个 $f$ 与 $F$ 的关系总是有点拎不清，举例子是最好的方法
    - 比如 $f(x) = 2x$，$F(x) = x^2 - a^2$
- 粗略地说，有 $(\int_{[0, x]} f)' = f$
    - **积分的导数等于本身**
- 若 $f$ 连续 (即在 $I$ 上处处连续)，那么 $F$ 就是处处可微，那么也就有 $F' = f$，即 $F$ 是 $f$ 的 antiderivative
    - **每个连续的 Riemann 可积函数都有 antiderivative**
        - 但是要注意：不是每个有 antiderivative 的函数都是 Riemann 可积

**Definition 11.9.3** (Antiderivatives). 设 $I$ 是有界区间，$f: I \to \mathbb{R}$, $F: I \to \mathbb{R}$. 如果 $F$ 在 $I$ 上可微且 $\forall x \in I: F'(x) = f(x)$，则称 $F$ 为 $f$ 的 **antiderivative**。

- 又是个拎不清的概念，简单说：
    - $f'$ is the derivative of $f$. (已知 $f$ 求它的导数 $f'$)
    - $f$ is the antiderivative of $f'$. (已知导数 $f'$ 反推 $f$)
    - The antiderivate of the derivative of $f$ is $f$ itself. ($f$ 的导数的反导数就是 $f$ 本身)
    - The derivative of the antiderivative of $f'$ is $f'$ itself. ($f'$ 的反导数的导数还是 $f'$)

**Theorem 11.9.4** (2nd Fundamental Theorem of Calculus). Let $a<b$ be real numbers. 设 $f: [a, b] \to \mathbb{R}$ Riemann 可积。$F: [a, b] \to \mathbb{R}$ 是 $f$ 的 antiderivative，那么：

$$
\int_{[a,b]} f = F(b) - F(a)
$$

- 拎不清拎不清！简单说就是 $\int_{[a,b]} f' = f(b) - f(a)$
    - **导数的积分等于本身的差**
- 注意 Theorem 11.9.1 讲 **积分的导数等于本身**，Theorem 11.9.4 讲 **导数的积分等于本身的差**，区别在于：
    - 求导数得到的是一个函数
    - 求积分得到的是一个值
- 结合 Theorem 11.9.1 说到的 **每个连续的 Riemann 可积函数都有 antiderivative**，可以推出：**每个连续的 Riemann 可积函数的积分都可以用它的 antiderivative 的差求得**

## Chapter 12 - Metric Spaces

### 12.1 基本定义

**Lemma 12.1.1** Let $(x_n)$ be a sequence of real numbers, and let $x$ be another real number. Then $\underset{n \to \infty}{\lim} x_n = x \iff \underset{n \to \infty}{\lim} d(x_n - x) = 0$.

现在我们想把这个收敛的概念推广，比如说使其可以应用到 complex 序列、vector 序列、matrix 序列、function 序列或者序列的序列等等。一个高效一点的方法是定义一个抽象的 space，它包括 complex space、vector space 等等这些 space，让后我们在这个抽象的 space 上一次性定义收敛的概念。这种抽象的空间，目前我们会遇到的有两类：

1. Metric spaces
1. 更 general 的 topological spaces

Metric (度量)：

- 必须满足的 [4 条性质](/math/2018/05/09/kernel) 我就不多说了
- 假设有 metric space $(X, d)$。要注意 $d$ 其实是个函数：$d: X \times X \to [0, \infty)$，它的定义域是和 $X$ 挂钩的。当你由子集 $Y \subset X$ induce 一个 subspace $(Y, d')$ 时，$d'$ 其实变成了 $d': Y \times Y \to [0, \infty)$，定义域发生了变化。虽然函数表达式没变，但是要注意 $d'$ 和 $d'$ 其实是两个函数

常见的 metric：

- Standard metric on $\mathbb{R}$: $d(x,y) := \vert x - y \vert$
- Euclidean metric (or $\ell^2$ metric): $d_{\ell^2}((x_1, \cdots, x_n),(y_1, \cdots, y_n)) := \sqrt{(x_1 - y_1)^2 + \cdots + (x_n - y_n)^2}$
    - $(\mathbb{R}^n, d_{\ell^2})$ 称为 Euclidean space
- Taxi-cab metric (or Manhattan distance, $\ell^1$ metric): $d_{\ell^1}((x_1, \cdots, x_n),(y_1, \cdots, y_n)) := \vert x_1 - y_1 \vert + \cdots + \vert x_n - y_n \vert$
    - 叫 taxi-cab 是考虑在一个网格地图内 (类似城市的 block 结构)，你只能走直线 (东南西北) 不能走斜线，所以从 $(0, 0)$ 走到 $(1, 1)$ 需要走距离 $2$ 而不是 $\sqrt{2}$
- Sup norm metric (上确界范数度量, 或者 $\ell^{\infty}$ metric): $d_{\ell^{\infty}}((x_1, \cdots, x_n),(y_1, \cdots, y_n)) := \sup \lbrace \vert x_i - y_i \vert \mid 1 \leq i \leq n \rbrace$
- Discrete metric: $d_{disc}(x, y) := \begin{cases} 0 & \text{if } x = y \\\\ 1 & \text{if } x \neq y \end{cases} $

**Proposition 12.1.18** 已知 $d_{\ell^1}$、$d_{\ell^2}$、$d_{\ell^{\infty}}$ 三者[等价](/math/2018/07/18/equivalence-of-metrics)，这意味着下述命题等价：

- $R^{n}$ 上的序列 $(x^{(k)})$ 依 $d_{\ell^1}$ 收敛到一点 $x$
    - $\iff$
- $(x^{(k)})$ 依 $d_{\ell^2}$ 收敛到 $x$
    - $\iff$
- $(x^{(k)})$ 依 $d_{\ell^{\infty}}$ 收敛到 $x$
    - $\iff$
- $n$ 个分量序列 (on $\mathbb{R}$) 收敛到 $x$ 的分量上，即下图：

vector       |   1st         | 2nd           | $\cdots$     | $n$-th      
-------------| ------------- | ------------- | ------------ | ------------ 
$x^{(1)}$    | $x_1^{(1)}$   | $x_2^{(1)}$   | $\cdots$     | $x_n^{(1)}$
$x^{(2)}$    | $x_1^{(2)}$   | $x_2^{(2)}$   | $\cdots$     | $x_n^{(2)}$
$\cdots$     | $\cdots$      | $\cdots$      | $\cdots$     | $\cdots$   
$x^{(k)}$    | $x_1^{(k)}$   | $x_2^{(k)}$   | $\cdots$     | $x_n^{(k)}$
$\downarrow$ | $\downarrow$  | $\downarrow$  | $\downarrow$ | $\downarrow$
$x$          | $x_1$         | $x_2$         | $\cdots$     | $x_n$      

可能出现 "依 $d_1$ 收敛到 $x_1$" 但是 "依 $d_2$ 收敛到 $x_2$" 或者 "依 $d_2$ 发散" 这种类似的情况，说明 **changing the metric on a space can greatly affect the nature of convergence (also called the topology) on that space**

### 12.2 Point-set topology of metric spaces

Having defined the operation of convergence on metric spaces, we now define a couple other related notions, including that of open set, closed set, interior, exterior, boundary, and adherent point. The study of such notions is known as **point-set topology** (点集拓扑).

- 讲真，我前面写了那么多 [open set](http://yaoyao.codes/math/2018/06/28/open-set)，还是大神的描述更好懂

**Definition 12.2.1** (Balls). 这个基本就是 neighborhood $\Phi(x_0, r)$，不过书上的符号更精确：

$$
B_{(X, d)}(x_0, r) := \lbrace x \in X \mid d(x, x_0) < r \rbrace
$$

**Definition 12.2.5** (Interior, exterior, boundary). 已知 metric space $(X, d)$, $E \subset X$, $x_0 \in X$:

- $x_0$ is an **interior point** of $E$ $\iff \exists r > 0: B(x_0, r) \subseteq E$
    - $int(E) = \lbrace x \mid x \text{ is an interior point of } E \rbrace$
- $x_0$ is an **exterior point** of $E$ $\iff \exists r > 0: B(x_0, r) \cap E = \emptyset$
    - $ext(E) = \lbrace x \mid x \text{ is an exterior point of } E \rbrace$
- $x_0$ is a **boundary point** of $E$ $\iff$ its either an interior point nor an exterior point of $E$
    - $\partial E = \lbrace x \mid x \text{ is a boundary point of } E \rbrace$

注意：

- 内点必定 $\in E$
- 外点必定 $\notin E$
- 边界点可能 $\in E$ 也可能 $\notin E$

**Definition 12.2.9** (Closure). 已知 metric space $(X, d)$, $E \subset X$, $x_0 \in X$. $x_0$ is an **adherent point** of $E$ $\iff \forall r > 0: B(x_0, r) \cap E \neq \emptyset$. $\overline{E} = \lbrace x \mid x \text{ is an adherent point of } E \rbrace$

**Proposition 12.2.10**. 已知 metric space $(X, d)$, $E \subset X$, $x_0 \in X$. 下列命题等价：

- $x_0$ is an adherent point of $E$
    - $\iff$
- $x_0$ is either an interior point or a boundary point of $E$
    - $\iff$
- 存在由 $E$ 中元素构成的序列 $(x_n)$ 依 $d$ 收敛到 $x_0$

**[Proof](http://mathonline.wikidot.com/adherent-points-and-convergent-sequences-in-metric-spaces):**

前面两条等价好证，我们主要看第三条。

假设 $x_0$ is an adherent point of $E$，则 $\forall r > 0: B(x_0, r) \cap E \neq \emptyset$。选择 $r = \frac{1}{n}$，构建一个 family of sets $A_n = B(x_0, \frac{1}{n}) \cap E$。已知所有 $A_n$ 非空，根据 AC，可以得到一个序列 $(x_n)$ where $x_i \in A_i$。又因为 $0 \leq d(x_0, x_i) \leq \frac{1}{n}$，所以有：

$$
0 \leq \underset{n \to \infty}{\lim} (x_0 - x_n) \leq \underset{n \to \infty}{\lim} \frac{1}{n} = 0
$$

所以 $\underset{n \to \infty}{\lim} (x_0 - x_n) = 0$。根据 Lemma 12.1.1，$(x_n)$ 收敛到 $x_0$。$\blacksquare$

注意：

- $\overline{E} = \lbrace x \mid x \text{ is an adherent point of } E \rbrace = int(E) \cup \partial E = X - ext(E)$
- **由 $E$ 中元素构成的序列 $(x_n)$ 若是依 $d$ 收敛，它一定只能收敛到一个附着点，亦即只能收敛到 $\overline{E}$ 的一个元素上**

**Definition 12.2.12** (Open and closed sets). 已知 metric space $(X, d)$, $E \subset X$：

- $E$ is **closed** $\iff E$ 包含它的所有 boundary points，亦即 $\partial E \subset E$
    - 亦即 $E = \overline E$
    - 亦即 $E$ 上所有的点都是它的 adherent points
- $E$ is **open** $\iff E$ 不包含它的 boundary points，亦即 $\partial E \cap E = \emptyset$
    - 亦即 $E \cap \overline E = E$
    - 亦即 $E = int(E)$
- 如果 $E$ 只包含部分 boundary point，则称它既不是 open 也不是 closed
- 如果 $E$ 没有 boundary point，那么它既是 open 也是 closed
    - 比如 $(X, d)$ 的 whole space $X$ 它没有 boundary point (every point in $X$ is an interior point of $X$)
    - $\emptyset$ 也没有 boundary (every point in $X$ is an exterior point of $\emptyset$)
    - 如果使用 $d_{disc}$，那么任意集合都是 open & closed
    - 所以，"不是开集" 不能推出 "一定是闭集"；"不是闭集" 也不能推出 "一定是开集"

注意：

- 结合 Proposition 12.2.10 说的：**由 $E$ 中元素构成的序列 $(x_n)$ 若是依 $d$ 收敛，它一定只能收敛到一个附着点，亦即只能收敛到 $\overline{E}$ 的一个元素上**，可以得出：
    - **由 closed set 元素构成的序列若是收敛，它一定只能收敛到这个 closed set 中的一个元素上**
        - 参 9.1
    - **由 open set 元素构成的序列若是收敛，它要么收敛到这个 open set 中的一个元素上，要么收敛到这个 open set 以外的一个 boundary point 上**

**Proposition 12.2.15** (Basic properties of open and closed sets). Let $(X, d)$ be a metric space, $E \subset X$, and $x_0 \in X$.

1. 球 $B_{(X, d)}(x_0, r) := \lbrace x \in X \mid d(x, x_0) < r \rbrace$ 是开集；闭球 $\lbrace x \in X \mid d(x, x_0) < r \rbrace$ 是闭集
1. 任何单点集 $\lbrace x_0 \rbrace$ 是闭集
1. 有限个开集的 $\cap$ 也是开集；有限个闭集的 $\cup$ 也是闭集
1. 假设有 index set $I$ (可以是有限的、可数的或者不可数的)：
    - 若 $\lbrace E_i \rbrace_{i \in I}$ 是 $X$ 上的一族开集，则 $\underset{i \in I}{\bigcup} E_i$ 也是开集
    - 若 $\lbrace E_i \rbrace_{i \in I}$ 是 $X$ 上的一族闭集，则 $\underset{i \in I}{\bigcap} E_i$ 也是闭集
1. $int(E)$ 是 $E$ 内的最大开集，i.e. $\forall V \subset E$ where $V$ is open, $V \subseteq int(E)$
1. $\overline{E}$ 是包含 $E$ 的最小闭集，i.e. $\forall V \supset E$ where $V$ is open, $V \supseteq \overline{E}$

注意：

- 开集的 infinite union 是开集；但 infinite intersection 不一定开。参 [Neighborhood / Open Set / Continuity / Limit Points / Closure / Interior / Exterior / Boundary](/math/2018/06/28/open-set)
- 闭集是反过来的：infinite intersection 继续闭；infinite union 不一定闭

### 12.3 Relative Topology (相对拓扑)

metric 的选择会影响开集、闭集的判定；同样，**ambient space** (环境空间) $X$ 的选择也会对判定有影响，比如：

- 给定 Euclidean space $(\mathbb{R}^2, d_{\ell^2})$ 和 $x$-axis 上 $(-1,1)$ 区间的集合 $E = \lbrace (x, 0) \mid -1 < x < 1 \rbrace$，$E$ 中每个点都是 boundary point，所以 $E$ 是闭集
- 令 $x$-axis 上的所有元素构成集合 $X = \lbrace (x, 0) \mid x \in \mathbb{R} \rbrace$，导出一个子空间 $(X, d_{\ell^2}\vert_{X \times X})$. $E$ 在 $X$ 上是开集 (等价于开区间 $(-1, 1)$)

注意这里还有一个非常重要的概念！

- 子空间 $(X, d_{\ell^2}\vert_{X \times X})$ 本质就是 Euclidean space 的 $x$-axis，所以它和 real line (实直线) $(\mathbb{R}, d)$ 是等价的；我们称 $(X, d_{\ell^2}\vert_{X \times X})$ 与 $(\mathbb{R}, d)$ 是 **isometric (等距同构)**

后略。

### 12.4 Cauchy sequences and complete metric spaces

**Definition 12.4.10** (Complete metric spaces). A metric space $(X, d)$ is said to be **complete** $\iff$ $\forall$ Cauchy sequence $(x_n)$ in $(X, d)$, $(x_n)$ converges in $(X, d)$.

- Complete metric spaces have some nice properties. For instance, they are **intrinsically closed**: 它们在任何其他空间上，都是 closed 
- 这很好理解，closed set 的一个特点就是其上收敛的序列一定会收敛到 closed set 内部；complete space 也是一样，收敛一定会收敛到自己内部，所以 complete space 是 closed set

**Proposition 12.4.12**. (a) Let $(X, d)$ be a metric space, and let $(Y, d \vert_{Y \times Y})$ be a subspace of $(X, d)$. If $(Y, d \vert_{Y \times Y})$ is complete, then $Y$ must be closed in $X$.

(b) Conversely, suppose that $(X, d)$ is a complete metric space, and $Y$ is a closed subset of $X$. Then the subspace $(Y, d \vert_{Y \times Y})$ is also complete.

- 一个 incomplete 的 metric space，可能在某些空间上是 closed 但在另外一些空间内就不是 closed
    - 比如 $\mathbb{Q}$ 在 $\mathbb{Q}$ 上就是 closed 的 (Definition 12.2.12 全集既 open 又 closed)
    - 但 $\mathbb{Q}$ 在 $\mathbb{R}$ 上就不是 closed 的 ($\mathbb{Q}$ 序列可能会收敛到一个 real number 上，这个实数是 $\mathbb{Q}$ 的附着点但又不可能是 $\mathbb{Q}$ 的内点，所以只能是边界点，所以 $\mathbb{Q}$ 不可能为 closed；注意这里我并没有说 $\mathbb{Q}$ 在 $\mathbb{R}$ 上是 open 的)
- 给定一个 incomplete 的 metric space $(X, d)$，都可以得到一个 **completion (完备化)** $(\overline X, \overline d)$
    - $(X, d) \subsetneq (\overline X, \overline d)$
    - $(\overline X, \overline d)$ 是 complete 的
    - $X$ 在 $\overline X$ 上不是 closed 的
    - 比如 $\mathbb{Q}$ 一个可能的 completion 就是 $\mathbb{R}$

### 12.5  Compact metric spaces

#### 12.5.1 引子

首先复习一下 real line 上的 Heine-Borel theorem：

**Theorem 9.1.24** (Heine-Borel theorem for the line). 设 $X \subseteq \mathbb{R}$，以下两命题等价:

- (a-1) $X$ 是闭集；(a-2) 且有界
    - $\iff$
- (b-1) $\forall$ 由 $X$ 元素组成的序列 $(a_n)$，存在它的一个子序列 $(a_{n_j})$ 收敛到 $L$；(b-2) 并且 $L \in X$

现在我们想把这个定理推广到一般的 metric space 上。对于一般的 metric space：

1. 针对 (a-1): 我们已经知道啥样的 space 是闭集
1. 针对 (a-2): 但是我们不知道 "有界" 在 space 上如何定义
1. 针对 (b-1): "$\forall$ 由 $X$ 元素组成的序列 $(a_n)$，存在它的一个子序列 $(a_{n_j})$ 收敛到 $L$" 这个性质太长了，我们给它起一个新名字：compactness (紧致性)
    - 注意 (b-2) "并且 $L \in X$" 这个性质并不在 compactness 的定义中

以下我们先完成两个新 definition 的任务：

**Definition 12.5.3** (Bounded sets). Let $(X, d)$ be a metric space, and let $Y \subset X$. We say that $Y$ is **bounded** $\iff \exists$ a ball $B(x, r)$ in $X$ which contains $Y$.

**Definition 12.5.1** (Compactness). A metric space $(X, d)$ is said to be **compact** $\iff$ every sequence in $(X, d)$ has at least one convergent subsequence. A subset $Y$ of a metric space $(X, d)$ is said to be compact if the subspace $(Y, d\vert_{Y \times Y} )$ is compact.

#### 12.5.2 推广 Heine-Borel theorem 到一般 metric space 并不那么简单

我们本是希望把 Heine-Borel theorem 推广到一般的 metric space 上，但是实际上情况有点复杂：

**Theorem 12.5.7** (Heine-Borel theorem). Let $(\mathbb{R}^{n}, d)$ be a Euclidean space where $d \in \lbrace d_{\ell^1}, d_{\ell^2}, d_{\ell^{\infty}} \rbrace$. Let $E \subset \mathbb{R}^{n}$. 以下两命题等价：

- (a) $E$ 是闭集且有界
    - $\iff$
- (b) $E$ 是 compact 的

注意这里的情况比较复杂是因为：

- $(a) \Rightarrow (b)$ 方向**仅对 Euclidean space 成立**
- $(a) \Leftarrow (b)$ 方向**对一般 metric space 都成立**
    - 我们对比一下这里的 (b) 和 Theorem 9.1.24 的 (b-1)、(b-2)，你会发现这里其实隐藏了一个线索：(b-1) $\Rightarrow$ (b-2)
        - 进一步推理：如果 (b-1) $\Rightarrow$ (b-2)，因为子序列收敛到极限点 (Proposition 6.6.6)，那么相当于所有的极限点都在 $X$ 内部；又因为极限是极限点 (Proposition 6.4.5)，那么相当于所有的极限都在 $X$ 内部，我们有理由怀疑 $X$ 是 complete 的！
        - 再进一步：如果 $X$ 已经是 complete 的了，那必然是 closed 的
    - 所以严格来说 Theorem 9.1.24 (Heine-Borel theorem for the line) 应该分开写成两个定理
    - 我们在 Theorem 12.5.7 这里沿这个思路先解决 (b-1) $\Rightarrow$ (b-2) 的问题

#### 12.5.3 证明 $(a) \Leftarrow (b)$ 对一般 metric space 成立

**Proposition 12.5.5**. Let $(X, d)$ be a compact metric space. Then $(X, d)$ is both complete and bounded.

**Proof:** 基本可以照搬 Theorem 9.1.24 的 $\Leftarrow$ 方向的证明 $\blacksquare$

于是顺利成章我们有：

**Corollary 12.5.6** (Compact sets are closed and bounded). Let $(X, d)$ be a metric space, and let $Y$ be a compact subset of $X$. Then $Y$ is closed and bounded. $\blacksquare$

#### 12.5.4 证明 $(a) \Rightarrow (b)$ 对 Euclidean space 成立

接着我们处理 $(a) \Rightarrow (b)$ 的部分。

首先我们看 Proposition 12.1.18 的那个图。

vector       |   1st         | 2nd           | $\cdots$     | $n$-th      
-------------| ------------- | ------------- | ------------ | ------------ 
$x^{(1)}$    | $x_1^{(1)}$   | $x_2^{(1)}$   | $\cdots$     | $x_n^{(1)}$
$x^{(2)}$    | $x_1^{(2)}$   | $x_2^{(2)}$   | $\cdots$     | $x_n^{(2)}$
$\cdots$     | $\cdots$      | $\cdots$      | $\cdots$     | $\cdots$   
$x^{(k)}$    | $x_1^{(k)}$   | $x_2^{(k)}$   | $\cdots$     | $x_n^{(k)}$
$\downarrow$ | $\downarrow$  | $\downarrow$  | $\downarrow$ | $\downarrow$
$x$          | $x_1$         | $x_2$         | $\cdots$     | $x_n$      

如果 $E \subset \mathbb{R}^n$ 是闭集且有界，那么它的每一个分量空间 $E_i \subset \mathbb{R}, i=1,2,\dots,n$ 应该也是闭集且有界的。

我们用反证法：假设 $\exists (x^{k})$ 没有子序列收敛。根据 Proposition 12.1.18，这意味着分量序列 $(x_i^{k})$ 也没有子序列收敛 (注意这里下标 $i$ 表示 “第 $i$-th 分量”；上标 $(k)$ 才是 cursor)。

但由于 $E_i \subset \mathbb{R}, i=1,2,\dots,n$ 是闭集且有界的，根据 Theorem 9.1.24 (Heine-Borel theorem for the line)， $\forall$ 由 $E_i$ 元素组成的序列都应该有一个收敛子序列，矛盾.$\blacksquare$

另外一个思路是：

1. $E$ 是闭集且有界的 $\Rightarrow$ 各个分量集合都是实数线段 (实数线段自然是闭集且有界的)
1. 证明 "实数线段" 是 compact 的
1. 在 Prodcut Topology (积空间) 领域有 **[Tychonoff's theorem](http://pi.math.cornell.edu/~kbrown/4530/tychonoff.pdf):** compact space 的笛卡尔积也是 compact 的

#### 12.5.5 为什么 $(a) \Rightarrow (b)$ 对一般 metric space 不成立

考虑 $(\mathbb{Z}, d_{disc})$。首先它是 complete 的 (序列只可能收敛到整数)；然后它是有界的 (任意两个整数的距离不超过 1，所以一个 $r=1$ 的球就可以包含 $\mathbb{Z}$)。但是序列 $1,2,3,\cdots$ 没有收敛的子序列 (你要收敛必须有 $\cdots, x, x, x, \cdots$ 这样连续相等的 tail 序列)。

这个例子也说明分析学的作用，因为这个空间完全没有办法用几何学来表示，但是不妨碍我们研究出它的性质。

#### 12.5.6 强推 Heine-Borel theorem 到一般 metric space：将条件 (a) "闭集且有界" 改成 "complete 且 totally bounded (全有界)"

**Definition 12.5.10** (Totally bounded sets; Exercise 12.5.10) A metric space $(X, d)$ is **called totally** bounded if $\forall \epsilon > 0: \exists$ a positive integer $n$ and a finite number of $n$ balls $B(x^{(1)}, \epsilon), \dots, B(x^{(n)}, \epsilon)$ which cover $X$ (i.e., $X = \bigcup_{i = 1}^{n} B(x^{(i)}, \epsilon)$. 
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

我们也可以从 neighborhood / open set 的角度来考察附着点的定义：

- $x$ is **$\epsilon$-adherent** to $X$ $\iff$ $\phi(x, \epsilon) \cap X \neq \emptyset$
- Suppose $X$ is a subset of topological space $(\mathbb{R}, \tau)$.
    - $x$ is an **adherent point** of $X$ $\iff$ a) $x \in \mathbb{R}$; b) $\forall$ open set $S \ni x$, $S \cap X \neq \emptyset$
- 如果我们把 sequence 看做一个 set 的话，并定义 tail of sequence $(a_n)\_{n=m}^{\infty}$ after $n = N \geq m$ 为 $T((a_n)_{n=m}^{\infty}, N) = \lbrace a_i \mid N \leq i \leq \infty, i \in \mathbb{N} \rbrace$
    - $x$ is **continually $\epsilon$-adherent** to $(a_n)\_{n=m}^{\infty}$ $\iff$ $\forall N$, $\phi(x, \epsilon) \cap T((a_n)_{n=m}^{\infty}, N) \neq \emptyset$

### 6.3 convergence & limit

注意收敛与极限本身就是连体概念，"收敛到 $L$" 也就意味着 "极限为 $L$"

| System                | Concept                                                              | Definition                                                                                    |
|-----------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| $\mathbb{R}$ sequence | $(a_n)_{n=m}^{\infty}$ is **$\epsilon$-close** to $L$                | $\iff \forall i$, $a_i$ is $\epsilon$-close to $L$                                            |
|                       | $(a_n)_{n=m}^{\infty}$ is **eventually $\epsilon$-close** to $L$     | $\iff \exists N \geq m$, such that starting from $i \geq N$, $a_i$ is $\epsilon$-close to $L$ |
|                       | $(a_n)_{n=m}^{\infty}$ **converges to** $L$                          | $\iff \forall \epsilon > 0$, $(a_n)_{n=m}^{\infty}$ is eventually $\epsilon$-close to $L$     |
|                       | $\underset{n \to \infty}{\lim}a_n = L$                               | == $(a_n)_{n=m}^{\infty}$ converges to $L$                                                    |

- $(a_n)_{n=m}^{\infty}$ is **divergent** == $\underset{n \to \infty}{\lim}a_n$ is undefined
- 注意与 adherence 的区别：
    - A point is adherent to a sequence. 是个 touchpoint 的概念，有一个点 close 就可以
    - A sequence is close to a point. 这要求明显就严格了，你 sequence 的全员，或者 tail 的全员必须都要 close 才行
    - 明显 limit $L$ is a limit point

### 6.4 boundedness

**Definition 6.1.16** (Bounded sequences). A sequence $(a_n)_{n=m}^{\infty}$ of real numbers is bounded by a real number $Μ>0$ $\iff \forall i$, $\vert a_i \vert < Μ$.

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

**[Proof](https://math.stackexchange.com/a/298828):** 序列 $(a_n)$ 有界，根据 Theorem 6.6.8，我们可以构建一个子序列，假设收敛到 $p$。

因为 $(a_n)$ 发散，所以 $(a_n)$ 不收敛到 $p$，所以存在 $\epsilon'$，对任意 $N$，都存在 $i_N \geq N$ 使得 $\vert a_{i\_N} - p \vert > \epsilon'$。取这样所有的 $a_{i\_N}$ 构成序列 $(a_n')$，它也是 $(a_n)$ 的子序列，所以 $(a_n')$ 也有界，再根据 Theorem 6.6.8，$(a_n')$ 有一个子序列 $(a_n'')$ 收敛到 $q$。因为 $(a_n')$ 每一项都远离 $p$，所以 $(a_n'')$ 的每一项都远离 $p$，所以 $(a_n'')$ 不可能收敛到 $p$，亦即 $q \neq p$。

又因为 $(a_n'')$ 同时也是 $(a_n)$ 的子序列，所以相当于 $(a_n)$ 有两个极限点：$p$ 和 $q$。$\blacksquare$

- $(a_n)$ 明显不可能每一项都远离 $p$ 但它的子序列 $(a_n')$ 可以做到每一项都远离 $p$，这看上去有点矛盾，但我可以举一个例子：
    - $a_n = \begin{cases}1 & \text{if } n \text{ is odd} \\\\ 2 & \text{if } n \text{ is even}\end{cases}$ 有界且发散
    - 令 $f(n) = 2n - 1$，$b_i = a_{f(i)}$，那么 $(b_n)$ 是 $(a_n)$ 的子序列，且 $(b_n)$ 全为 1，收敛到 1
    - 令 $f(n) = 2n$，$c_i = a_{f(i)}$，那么 $(c_n)$ 是 $(a_n)$ 的子序列，且 $(c_n)$ 全为 2，收敛到 2

#### 结论九：如果序列有界且极限点唯一，那么序列收敛

**Proof:** 假设 $(a_n)$ 有界且有唯一极限点 $L$，那么根据 Proposition 6.6.6，$(a_n)$ 存在子序列 $(b_n)$ 收敛到 $L$。若 $(a_n)$ 还存在子序列 $(c_n)$ 发散，根据结论八，$(c_n)$ 可以有两个极限点，换言之 $(a_n)$ 也可以有两个极限点，矛盾。所以 $(a_n)$ 所有子序列收敛，又因为极限点唯一，所以 $(a_n)$ 收敛 (根据 Proposition 6.6.5)。 $\blacksquare$

#### 结论十：Cauchy 必收敛

**[Proof](http://www.maths.qmul.ac.uk/~ig/MAS111/Cauchy%20Criterion.pdf):** 设 $(a_n)$ 是 Cauchy。根据结论二 "Cauchy 必定有界" 和 Theorem 6.6.8 "有界比有子序列收敛"，可以假设 $(a_{n\_k})$ 是一个收敛的子序列，并收敛到 $L$，即 $\underset{k \to \infty}{a_{n\_k}} = L$

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
- 收敛 $_{\nLeftarrow}^{\Rightarrow}$ 有界 $\Rightarrow$ 有子序列收敛 $\Rightarrow$ 存在一个对应的极限点（结论四、Theorem 6.6.8、Proposition 6.6.6）
- 收敛 $_{\nLeftarrow}^{\Rightarrow}$ 有唯一极限点（结论七）
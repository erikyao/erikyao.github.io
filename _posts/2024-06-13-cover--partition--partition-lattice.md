---
title: "Cover ( == Similarity) / Partition ( == Equivalence) / Partition Lattice"
description: ""
category: Math
tags: []
toc: true
toc_sticky: true
---

# References

> - https://staff.fnwi.uva.nl/d.j.n.vaneijck2/software/demo_s5/EREL.pdf
> - https://www.ellerman.org/book-draft-the-logic-of-partitions/
 
# Cover

**Definition:** Given a set $A$, a **cover** of $A$, denoted by $\kappa = \lbrace A_1, A_2, \dots, A_n \rbrace$, is a family of subsets of $A$ (i.e. $\forall A_i \subseteq A$), which satisfies:

1. $\varnothing \not\in \kappa$
    - I.e. $\forall A_i \neq \varnothing$
2. $\bigcup \kappa = A$

## Cover $\Rightarrow$ Similarity Relation

If $\kappa$ is a cover of $A$, then the relation $R \subseteq A \times A$ given by 

$$
R = \big\lbrace (x,y) \in A \times A \mid \exists A_i \in \kappa \text{ such that } x \in A_i \text{ and } y \in A_i \big\rbrace
$$

is a similarity relation.

## Cover $\Leftarrow$ Similarity Relation

If $R$ is a similarity relation on $A$, given an element $a \in A$, the **similarity class** of $a$ is defined as $[a]_{R} = \lbracea' \in A \mid a' R a \rbrace$.

Then the family of subsets of $A$, denoted by $\kappa$, given by

$$
\kappa = \lbrace [a]_R \mid a \in A \rbrace
$$

is a cover of $A$.

# Partition

**Definition:** Given a set $A$, a **partition** of $A$, denoted by $\pi = \lbrace A_1, A_2, \dots, A_n \rbrace$, is a family of subsets of $A$ (i.e. $\forall A_i \subseteq A$), which satisfies:

1. $\pi$ is a cover of $A$
2. $\forall A_i,A_j \in \pi$, $A_i \neq A_j \Longrightarrow A_i \cap A_j = \varnothing$
    - We call elements of $\pi$ **pairwise disjoint** or **mutually exclusive**
    - Furthermore, $\bigcap \pi = \varnothing$

**Definition:** The elements of $P$ are called the blocks, parts, or cells, of the partition.

## Partition $\Rightarrow$ Equivalence Relation

If $\pi = \lbrace A_1, A_2, \dots, A_n \rbrace$ is a partition on set $A$, the **relation $R$  induced by the partition $\pi$**, given by

$$
\forall x,y \in A, xRy \iff \exists A_i \in \pi \text{ such that } x \in A_i \text{ and } y \in A_i
$$

is an equivalence relation.

## Partition $\Leftarrow$ Equivalence Relation

Similarly, if $R$ is an equivalence relation on $A$, given an element $a \in A$, the **equivalence class** of $a$ is defined as $[a]_{R} = \lbracea' \in A \mid a' R a\rbrace$.

E.g. If $x =_2 y \iff x = y \pmod 2$ (where $x,y \in \mathbb{N}$), then equivalence relation $=_2$ split $\mathbb{N}$ into 2 equivalence classes, odd numbers and even numbers.

If $R$ is an equivalence relation on any non-empty set $A$, then the distinct set of equivalence classes of $R$, given by

$$
\pi = \lbrace [a]_R \mid a \in A \rbrace
$$

forms a partition on $A$.

Element $a \in A$ 的 equivalence class 一定是 partition $\pi$ 的某个 block，i.e. $\exists A_k \in \pi$ such that $[a]_{R} = A_k$

Partition $\iff$ Equivalence Relation，这也就是说 set $A$ 上的 equivalence relation $R$ 和对应的 partition $\pi$ 是等价的，所以也有教材写成 $\pi = A / R$.
{: .notice--info}

A set equipped with an equivalence relation or a partition is sometimes called a setoid, typically in type theory and proof theory.
{: .notice--info}

## Index

**Definition:** We define the **index** of equivalence relation $R$, denoted by $\\#(R)$, as the number of equivalence classes of $R$. 

**Definition:** We define the **index** of partition $\pi$, as the number of blocks in $\pi$, i.e. $\vert \pi \vert$

# Closure Properties

## Closure under Union: ✅ Similarities (Covers) ❌ Equivalences (Partitions)

以下我们把 similarity relation 简称为 similarity，把 equivalence relation 简称为 equivalence。

在 cover 和 partition 上定义 "集合的 union 操作 $\cup$ " 并不很直观，所以我们转去 relation 上定义 union 操作，毕竟 relation 本质就是 $(x,y)$ pairs 的集合。

假设有 relation $R_1, R_2$，那么 $R_1 \cup R_2 = \big\lbrace (x, y) \mid (x, y) \in R_1  \text{ or } (x, y) \in R_2 \big\rbrace$

**Proposition 1:** 
1. If $R_1, R_2$ are similarities on $A$, then $R_1 \cup R_2$ is also a similarity on $A$
    - I.e. similarities are closed under union
2. If $R_1, R_2$ are equivalences on $A$, then $R_1 \cup R_2$ is also a similarity on $A$
3. If $R_1, R_2$ are equivalences on $A$, then $R_1 \cup R_2$ is not necessarily an equivalence on $A$
    - I.e. equivalences are NOT closed under union

Proof: (1) Since $R_1$ and $R_2$ are both reflexive, then $R_1 \cup R_2$ must also be reflexive. Formally, construct $I = \lbrace (x, x) \mid x \in A \rbrace$, then $I \subseteq R_1$ and $I \subseteq R_2$, thus $I \subseteq R_1 \cup R_2$.

Since $R_1$ and $R_2$ are both symmetric, then $R_1 \cup R_2$ must also be symmetric. Formally, consider $(x,y) \in R_1 \cup R_2$. 

- If $(x,y) \in R_1$, then $(y, x) \in R_1$ by symmetry; 
- If $(x,y) \in R_2$, then $(y, x) \in R_2$ by symmetry. 

Either case we have $(y,x) \in R_1 \cup R_2$.

Therefore $R_1 \cup R_2$ is reflexive and symmetric, qualified as a similarity.

(2) Obviously, following (1)

(3) Counter example: 

$$
\begin{align}
R_1 &= \lbrace (1,1), (1,2), (2,1), (2,2), (3,3) \rbrace \newline
R_2 &= \lbrace (1,1), (2,2), (2,3), (3,2), (3,3) \rbrace \newline
R_1 \cup R_2 &= \lbrace (1,1), (1,2), (2,1), (2,2), (2,3), (3,2), (3,3) \rbrace
\end{align}
$$

Since $(3,2)$ and $(2,1)$ are $\in R_1 \cup R_2$, but $(3,1) \not\in R_1 \cup R_2$, then $R_1 \cup R_2$ is not transitive, thus not an equivalence. $\blacksquare$

这意味着我们可以通过 ”similarities 的 union“ 去定义 ”cover 的 union“，只是这两个 union 不是同样的定义。我们用 $\cup$ 表示 "集合的 union"，用 $\curlyvee$ 表示 "cover 的 union"。于是有：

$$
\kappa_1 \curlyvee \kappa_2 = \lbrace [a]_{R_1 \cup R_2} \mid a \in A \rbrace
$$

但对 partitions 而言，$\pi_1 \curlyvee \pi_2$ 不一定是 partition，但一定是 cover

## Closure under Intersection: ✅ Similarities (Covers) ✅ Equivalences (Partitions)

假设有 relation $R_1, R_2$，那么 $R_1 \cap R_2 = \big\lbrace (x, y) \mid (x, y) \in R_1  \text{ and } (x, y) \in R_2 \big\rbrace$

**Proposition 2:** 
1. Similarities are closed under intersection
2. Equivalences are closed under intersection

Proof: (1) Similar to (2)

(2) Suppose $R_1, R_2$ are equivalences.

Since $R_1$ and $R_2$ are both reflexive, then $R_1 \cap R_2$ must also be reflexive. (Follow the idea in the proof of **Proposition 1**)

Since $R_1$ and $R_2$ are both symmetric, then $R_1 \cap R_2$ must also be symmetric.  (Follow the idea in the proof of **Proposition 1**)

Since $R_1$ and $R_2$ are both transitive, then $R_1 \cap R_2$ must also be transitive. Consider $(x,y) \in R_1 \cap R_2$, and $(y,z) \in R_1 \cap R_2$, then:

1. $(x,y) \in R_1$
2. $(y,z) \in R_1$
3. $(x,y) \in R_2$
4. $(y,z) \in R_2$

Since $R_1$ is transitive, $(x,z) \in R_1$ stands (bullet $1$ and $2$); since $R_2$ is transitive, $(x,z) \in R_2$ stands (bullet $3$ and $4$). Therefore $(x,z) \in R_1 \cap R_2$, thus $R_1 \cap R_2$ is transitive.

Therefore $R_1 \cap R_2$ is reflexive, symmetric, and transitive, qualified as an equivalence. $\blacksquare$

这意味着我们可以通过 ”similarities/equivalences 的 intersection“ 去定义 ”cover/partition 的 intersection“，只是这两个 intersection 不是同样的定义。我们用 $\cap$ 表示 "集合的 intersection"，用 $\curlywedge$ 表示 "cover/partition 的 intersection"。于是有：

$$
\begin{align}
\kappa_1 \curlywedge \kappa_2 &= \lbrace [a]_{R_1 \cap R_2} \mid a \in A \rbrace \newline
\pi_1 \curlywedge \pi_2 &= \lbrace [a]_{R_1 \cap R_2} \mid a \in A \rbrace
\end{align}
$$

但我们其实还有另一种定义 $\pi_1 \curlywedge \pi_2$ 的方法，非常巧妙 (或者巧合？)：

$$
\pi_1 \curlywedge \pi_2 = \lbrace X_i \cap Y_j \mid X_i \in \pi_1, Y_j \in \pi_2, X_i \cap Y_j \neq \varnothing \rbrace
$$

我们可以看个例子：

- $A = \lbrace 1,2,3,4 \rbrace$
- $\pi_1 = \big\lbrace \lbrace 1 \rbrace, \lbrace 2,3 \rbrace, \lbrace 4 \rbrace \big\rbrace$
- $\pi_2 = \big\lbrace \lbrace 1,2 \rbrace, \lbrace 3 \rbrace, \lbrace 4 \rbrace \big\rbrace$
- $R_1 = \lbrace (1,1), (2,2), (2,3), (3,2), (3,3), (4,4) \rbrace$
- $R_2 = \lbrace (1,1), (1,2), (2,1), (2,2), (3,3), (4,4) \rbrace$
- $\pi_1 \curlywedge \pi_2 = \big\lbrace \lbrace 1 \rbrace, \lbrace 2 \rbrace, \lbrace 3 \rbrace, \lbrace 4 \rbrace \big\rbrace$
- $R_1 \cap R_2 = \lbrace (1,1), (2,2), (3,3), (4,4) \rbrace$

# Partition Lattice

## 构建 Lattice 的思路

假设 $\Pi_n = \lbrace \pi_1, \pi_2, \cdots, \pi_{B_n} \rbrace$ 为集合 $[n] = \lbrace 1, 2, \cdots, n \rbrace$ 上所有的 partition。

$\vert \Pi_n \vert = B_k$ 这个值被称为 [Bell Number](https://en.wikipedia.org/wiki/Bell_number)，它还蛮复杂的，有需要时再研究。
{: .notice--info}

我们已知的情报有：

- 可以取 $\bot = \big\lbrace \lbrace 1 \rbrace, \lbrace 2 \rbrace, \cdots, \lbrace n \rbrace \big\rbrace$ 
    - i.e. the finest partition
- 可以取 $\top = \lbrace [n] \rbrace = \big\lbrace \lbrace 1, 2, \cdots, n \rbrace \big\rbrace$
    - i.e. the coarsest partition
- 可以定义 partition 的 meet $\pi_1 \wedge \pi_2 = \pi_1 \curlywedge \pi_2$
    - see [Closure under Intersection](#closure-under-intersection--similarities-covers--equivalences-partitions)

所以即使暂时没有 join 的定义，根据 [Order-Theoretic Definition of Lattices (Poset == Lattice) > 更精炼的定义](/math/2024/06/07/order-theoretic-definition-of-lattices#%E6%9B%B4%E7%B2%BE%E7%82%BC%E7%9A%84%E5%AE%9A%E4%B9%89) 的 **Proposition 1**，我们也可以确认 $\Pi_n$ 是一个 lattice。

注意我们这里的思路：

1. 开局一个 partition 的集合 $\Pi = \lbrace \pi_1, \pi_2, \cdots, \pi_{n} \rbrace$，注意它是 finite 的
2. 若我们能定义一个 _meet_ operation $\wedge: \Pi \times \Pi \to \Pi$，那么就能定义出一个 relation $\leq$ such that $\pi_1 \leq \pi_2 \iff \pi_1 \wedge \pi_2 = \pi_1$
3. 若 relation $\leq$ 是 partial order，那么 $(\Pi, \leq)$ 就是个 poset
4. 根据 [Order-Theoretic Definition of Lattices (Poset == Lattice) > 更精炼的定义](/math/2024/06/07/order-theoretic-definition-of-lattices#%E6%9B%B4%E7%B2%BE%E7%82%BC%E7%9A%84%E5%AE%9A%E4%B9%89) 的 **Definition 1**，既然 $(\Pi, \leq)$ 是个 finite poset，那么它 $(\Pi, \wedge, \top)$ 就是个 _meet_-semilattice
5. 再根据 [Order-Theoretic Definition of Lattices (Poset == Lattice) > 更精炼的定义](/math/2024/06/07/order-theoretic-definition-of-lattices#%E6%9B%B4%E7%B2%BE%E7%82%BC%E7%9A%84%E5%AE%9A%E4%B9%89) 的 **Proposition 1**, $(\Pi, \wedge, \top, \bot)$ 也可以升级为 lattice

开拓思路：因为 partition 本质是个 equivalence，所以 partition lattice 本质也是个 equivalence lattice?
{: .notice--info}

## _meet_ 的两种定义

给定 partition lattice $\Pi$，我们定义 $\wedge := \curlywedge$，而 $\curlywedge: \Pi \times \Pi \to \Pi$ 的定义有两种：

$$
\begin{align}
\pi_1 \curlywedge \pi_2 &= \lbrace [a]_{R_1 \cap R_2} \mid a \in A \rbrace \tag{1} \newline
\pi_1 \curlywedge \pi_2 &= \lbrace X_i \cap Y_j \mid X_i \in \pi_1, Y_j \in \pi_2, X_i \cap Y_j \neq \varnothing \tag{2} \rbrace
\end{align}
$$

## "finer-than" relation $\leq$ 的两种释义

给定 partition lattice $\Pi$，我们可以定义一个 "finer-than" 的 partial order $\leq$：

$$
\pi_1 \leq \pi_2 \iff \pi_1 \wedge \pi_2 = \pi_1
$$

若 $\pi_1 \leq \pi_2$, 我们称: 

- $\pi_1$ is finer than $\pi_2$
- $\pi_2$ is coarser than $\pi_1$

同时根据 _meet_ 的第二个定义，当 $\pi_1 \leq \pi_2 \text{ , i.e. } \pi_1 \wedge \pi_2 = \pi_1$ 时，有：

$$
\forall X_i \in \pi_1, \forall Y_j \in \pi_2, X_i \cap Y_j \neq \varnothing \implies X_i \cap Y_j = X_i
$$

所以 $\leq$ 也可以定义为：

$$
\pi_1 \leq \pi_2 \iff \forall X_i \in \pi_1, \exists Y_j \in \pi_2 \text{ such that } X_i \subseteq Y_j
$$

又因为 partition 的 **pairwise disjoint** 的特性，我们可以确定 $\forall Y_j \in \pi_2$ is a union of one or more $X_i \in \pi_1$，这也意味着，index 方面有 $\vert \pi_1 \vert \geq \vert \pi_2 \vert$.

我们再回头看 _meet_ 的第一个定义，当 $\pi_1 \leq \pi_2 \text{ , i.e. } \pi_1 \wedge \pi_2 = \pi_1$ 时，我们可以推出：

$$
\forall a \in A, \,  [a]_{R_1 \cap R_2} = [a]_{R_1}
$$

它也意味着：

$$
R_1 \cap R_2 = R_1 \implies R_1 \subseteq R_2
$$

所以在 relation cardinality 方面有 $\vert R_1 \vert \leq \vert R_2 \vert$

$\leq$ 是 partial order，证明可以参考后面 [_join_ 的定义](#join-%E7%9A%84%E5%AE%9A%E4%B9%89)

## Coarsening & Refinement

词义 overloading 警告！Given a partition $\pi$, we can adjust it in opposite directions:

1. "to make $\pi$ coarser (than itself/before)"
    - 这个动作我们称为 "to coarsen $\pi$"
    - 这个 procedure 我们称为 "the coarsening of $\pi$"
    - 最后得到一个新 partition $\psi$ 满足 $\pi \leq \psi$，这个结果 $\psi$ 我们也称 "a coarsening of $\pi$"
2. "to make $\pi$ finer (than itself/before)"
    - 这个动作我们称为 "to refine $\pi$"
    - 这个 procedure 我们称为 "the refining/refinement of $\pi$"
    - 最后得到一个新 partition $\psi$ 满足 $\psi \leq \pi$，这个结果 $\psi$ 我们称 "a refinement of $\pi$"

![](https://live.staticflickr.com/65535/53788260543_6d2fb6fede_c_d.jpg)

总结下规律：

- Refining:
    - 使得 $\pi$ 往 $\bot = \big\lbrace \lbrace 1 \rbrace, \lbrace 2 \rbrace, \cdots, \lbrace n \rbrace \big\rbrace$ 靠拢
    - 使得 $\vert \pi \vert \uparrow$，意味着 equivalence class 更细碎
    - 使得 $\vert R \vert \downarrow$，意味着 equivalence 的要求更严苛 (只有特定的几个元素才有 equivalence 关系)
- Coarsening:
    - 使得 $\pi$ 往 $\top = \big\lbrace \lbrace 1, 2, \cdots, n \rbrace \big\rbrace$ 靠拢
    - 使得 $\vert \pi \vert \downarrow$，意味着 equivalence class 更融合
    - 使得 $\vert R \vert \uparrow$，意味着 equivalence 的要求更水 (大多数元素都可以有 equivalence 关系)

Closure of $R$ 一定是对 $\pi$ 的 coarsening。假定 $R$ 的某个 closure 是 $R^+$，且 $R^+$ 对应的 partition 是 $\pi^+$。因为 $R \subseteq R^+$，所以 $\vert R \vert \leq \vert R^+ \vert$，对应 $\pi \leq \pi^+$，所以说是对 $\pi$ 的 coarsening
{: .notice--info}

## _join_ 的定义

我们已知 $\pi_1 \curlyvee \pi_2$ 不一定是 partition (但一定是 cover)，所以一定是不能定义 $\vee \coloneqq \curlyvee$ 的，它连 $\vee: \Pi \times \Pi \to \Pi$ 这个最基础的要求都达不到。

但如果我们能取 $\pi_1 \curlyvee \pi_2$ 背后的 relation $R_1 \cup R_2$ 的 transitive closure，i.e. 把 $R_1 \cup R_2$ 升级为一个 equivalence，i.e. 把 $\pi_1 \curlyvee \pi_2$ 升级为一个 partition，那么这第一步的 $\vee: \Pi \times \Pi \to \Pi$ 就成功了。后续只要能证明 $\vee$ 引出的 $\leq$ 是 partial order，那么一切都会好起来的。

我们先定义几个符号：

- Given a partition $\pi = \lbrace A_1, \cdots, A_n \rbrace$ on $A$, define $\operatorname{R}(\pi) = \big\lbrace (x,y) \in A \times A \mid \exists A_i \in \pi \text{ such that } x \in A_i \text{ and } y \in A_i \big\rbrace$
    - I.e. $\operatorname{R}(\pi)$ is the backbone relation $R$ of partition $\pi$
- Transitive closure operator $\operatorname{k_{t}}: (A \times A) \to (A \times A)$
    - I.e. $\operatorname{k_{t}}$ is a relation-to-relation function
    - See [Closures of Relations 的具体算法](/math/2024/06/12/closure-math-closures-of-relations#closures-of-relations-%E7%9A%84%E5%85%B7%E4%BD%93%E7%AE%97%E6%B3%95)

我们定义：

$$
\begin{align}
\operatorname{R}(\pi_1 \vee \pi_2) &= \operatorname{k_{t}}\big( \operatorname{R}(\pi_1) \cup \operatorname{R}(\pi_2) \big) \newline
\pi_1 \vee \pi_2 &= \lbrace [a]_{\operatorname{k_{t}}\big( \operatorname{R}(\pi_1) \cup \operatorname{R}(\pi_2) \big)} \mid a \in A \rbrace \newline
\pi_1 \leq \pi_2 &\iff \pi_1 \vee \pi_2 = \pi_2
\end{align}
$$

**Claim:** The $\leq$ relation, defined by $\pi_1 \leq \pi_2 \iff \pi_1 \vee \pi_2 = \pi_2$, is a partial order.

Proof: (Reflexive) Since $\operatorname{R}(\pi)$ is an equivalence, already transitive, therefore

$$
\begin{align}
\operatorname{R}(\pi \vee \pi) 
    &= \operatorname{k_{t}}\big( \operatorname{R}(\pi) \cup \operatorname{R}(\pi) \big) \newline 
    &= \operatorname{k_{t}}\big( \operatorname{R}(\pi) \big) \newline
    &= \operatorname{R}(\pi)
\end{align}
$$

which implies $\pi \vee \pi = \pi$ and then $\pi \leq \pi$.

(Antisymmetric)

$$
\begin{align}
\pi_1 \leq \pi_2 &\implies \pi_1 \vee \pi_2 = \pi_2 \newline 
\pi_2 \leq \pi_1 &\implies \pi_2 \vee \pi_1 = \pi_1
\end{align}
$$

Since $\vee$ itself is symmetric, $\pi_1 \vee \pi_2 = \pi_2 \vee \pi_1$, therefore $\pi_1 = \pi_2$.

(Transitive)

$$
\begin{align}
\pi_1 \leq \pi_2 &\implies \pi_1 \vee \pi_2 = \pi_2 \tag{1} \label{eq1} \newline 
\pi_2 \leq \pi_3 &\implies \pi_2 \vee \pi_3 = \pi_3 \tag{2} \label{eq2}
\end{align}
$$

In $\eqref{eq2}$, replace $\pi_2$ by $\pi_1 \vee \pi_2$, and we have:

$$
\pi_1 \vee \pi_2 \vee \pi_3 = \pi_3 \tag{3} \label{eq3}
$$

Since $\vee$ itself is associative, in $\eqref{eq3}$, replace $\pi_2 \vee \pi_3$ by $\pi_3$, and we have:

$$
\pi_1 \vee \pi_3 = \pi_3 \tag{4} 
$$

Therefore $\pi_1 \leq \pi_3$. $\blacksquare$
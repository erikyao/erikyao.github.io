---
title: "Closure (Math) / Closures of Relations"
description: ""
category: Math
tags: []
toc: true
toc_sticky: true
---

# References

> - https://staff.fnwi.uva.nl/d.j.n.vaneijck2/software/demo_s5/EREL.pdf
> - https://doi.org/10.1016/B978-0-12-820656-0.00009-5
> - https://people.cs.rutgers.edu/~elgammal/classes/cs205/chapt74.pdf
> - https://en.wikipedia.org/wiki/Closure_(mathematics)
> - https://en.wikipedia.org/wiki/Relation_(mathematics)
> - https://en.wikipedia.org/wiki/Composition_of_relations


# Closure (Math)

完整的 closure 场景应该包含这么几个元素：一个全集 $\Sigma$，一个子集 $S \subseteq \Sigma$，一个 "closure operator" $f: \Sigma \to \Sigma$.

主谓宾关系上有：$S^{+} = f(S) \supseteq S$ 称为 **”$S$ 的 closure“**

一般的要求是：若 $S^{+}$ 是 $S$ 的 closure under some operations (这些 operations 可能是 $\Sigma$ 上的，或者说 $(\Sigma, \operatorname{op})$ 本身是个 Algebraic Structure)，则 $S^{+}$ is the **smallest** superset of $S$ that is **closed** under these operations. 这些 "closed under operations" 的性质也被称为 **"closure properties"**. (所以我们经常是脱离了 $S^{+} = f(S)$ 这个 closure 本体，而直接讨论某个集合 $X$ 是否有 closure properties)

除了 "closed under operations"，还有一类的要求是 "qualified as the same algebraic structure (with $\Sigma$'s)" 或者 "having some properties". 比如说：
1. 假定 $\Sigma$ 是个 group，那么 subset $S \subseteq \Sigma$ 是否同样构成 group？如果不构成，如何找到一个 smallest superset of $S$ that is a group？此时这个 smallest superset $S^+$ 就是 $S$ 的 group closure
    - 此时一般还称 $S^+$ is generated/spanned by $S$, and $S$ is the generating set of $S^+$ 
2. 假定 $\Sigma$ 是个 reflexive relation，那么 subset $S \subseteq \Sigma$ 是否同样是 reflexive？如果不是，如何找到一个 smallest superset of $S$ that is reflexive？此时这个 smallest superset $S^+$ 就是 $S$ 的 reflexivity closure

有时候 "having some property" 可以被转化成 "closed under some operation"，比如 relation 的 symmetry 和 transitivity (reflexivity 很难用 operation 来表示)

- symmetry 可以表示为一个 unary operation $\operatorname{sym}: \Sigma \times \Sigma \to \Sigma \times \Sigma$，它要求 $\forall x,y \in \Sigma, \operatorname{sym}(x,y) = (y,x)$
    - $S$ is symmetric if it is closed under $\operatorname{sym}$
- transitivity 可以表示为一个 binary operation $\operatorname{trn}: (\Sigma \times \Sigma) \times (\Sigma \times \Sigma) \to \Sigma \times \Sigma$，它要求 $\forall x,y,z \in \Sigma, \operatorname{trn}\big((x,y),(y,z)\big) = (x,z)$
    - $S$ is transitive if it is closed under $\operatorname{trn}$

# Closures of Relations

## Definitions

Following the definition of closure (Math):

- $S^{+}$ is the **reflexive closure** of $S$ if $S^{+}$ is the smallest superset of $S$ that is reflexive
- $S^{+}$ is the **symmetric closure** of $S$ if $S^{+}$ is the smallest superset of $S$ that is symmetric
- $S^{+}$ is the **transitive closure** of $S$ if $S^{+}$ is the smallest superset of $S$ that is transitive

**Proposition 2:** The transitive closure of a similarity (relation) is an equivalence (relation).

Proof: Suppose $S$ is a similarity on $A$, $S^+$ is the transitive closure of $S$.

(Reflexivity) Construct $I = \lbrace (x,x) \mid x \in A \rbrace$. Since $S$ is reflexive, $I \subseteq S$; since $S^+$ is a superset of $S$, $S \subseteq S^+$. Therefore $I \subseteq S^+$, i.e. $S^+$ is reflexive.

(Symmetry) $\forall x,y$ such that $xS^+y$, there are 2 possibilities:
1. $xSy$ originally. Since $S$ is symmetric, $ySx$, thus $yS^+x$.
2. $x\cancel{S}y$, but there is a path $x_1, \dots, x_n$ with $x_iSx_{i+1}$ and $x_1 = x, x_n=y$. This path makes $xS^+y$ stand in $S^+$ (by transitivity). Since $S$ is symmetric, there should also be a path $x_n, \dots, x_1$ with $x_{i+1}Sx_i$. Thus, $yS^+x$.

Either case, $S^+$ is symmetric.

(Transitivity) $S^+$ is transitive by definition.

Therefore, $S^+$ is an equivalence. $\blacksquare$

## Transitive Paths & Relation Composition

**Definition:** If $R \subseteq \Sigma_1 \times \Sigma_2$ and $S \subseteq \Sigma_2 \times \Sigma_3$ are two relations, then the [relative product](https://en.wikipedia.org/wiki/Composition_of_relations) $R \circ S = \lbrace (x,z) \mid \exists y \in \Sigma_2 \text{ such that } xRy \text{ and } ySz \rbrace$ is a relation $\subseteq \Sigma_1 \times \Sigma_3$.

**Definition:** Given relations $R,S,T$, then $\big( R \circ S = T \big) \equiv \big( xRySz \iff xTz \big)$ 

比较常见的情况是：没有 $S \subseteq \Sigma_2 \times \Sigma_3$ 这种 cross-domain 的 relation，都是 $S \subset \Sigma \times \Sigma$ 类型的，于是可以简写成：

$$
\begin{align}
S^2 &= S \circ S \newline
S^n &= S^{n-1} \circ S
\end{align}
$$

**Theorem:** Given a relation $S$, $\big( \exists$ a path $x_0, \dots, x_n$ of length $n$, with $x_iSx_{i+1} \big)$ $\iff$ $(x_0, x_n) \in S^n$  

Proof: (by induction)

(1) when $n=1$, since $x_0 S x_1$, and $S^1 = S$, the assertion is true.

(2) Assume the assertion is true for $n$.

Suppose there is a path $x_0, \dots, x_{n+1}$, by hypotheses:

$$
\begin{align}
x_0, \dots, x_{n} \text{ is a path of length } n &\iff (x_0,x_n) \in S^n \newline
x_n, x_{n+1} \text{ is a path of length } 1 &\iff (x_n,x_{n+1}) \in S \newline
\end{align}
$$

Therefore $(x_0, x_n) \in S^n \circ S = S^{n+1}$. The assertion is true. $\blacksquare$

## Closures of Relations 的具体算法

假定：
- reflexive closure 的 operator 为 $\operatorname{k_{r}}$
- symmetric closure 的 operator 为 $\operatorname{k_{s}}$
- transitive closure 的 operator 为 $\operatorname{k_{t}}$
- $S$ is a relation on $\Sigma$

算法上有：
- $\operatorname{k_{r}}(S) = S \cup I_{\Sigma}$, where $I_{\Sigma} = \lbrace (x,x) \mid x \in \Sigma \rbrace$ is the diagonal relation on $\Sigma$
- $\operatorname{k_{s}}(S) = S \cup S^{-1}$, where $S^{-1} = \lbrace (y,x) \mid (x,y) \in S \rbrace$ is the converse relation of $S$
- $\operatorname{k_{t}}(S) = S \cup S^2 \cup \cdots \cup S^n$ where $n = \vert \Sigma \vert$

### 为何 $\operatorname{k_{t}}(S)$ 的 $n = \vert \Sigma \vert$

**Theorem:** $S$ is transitive $\iff$ $\forall n, \, S^n \subseteq S$. 

**Definition:** The **connectivity relation** or the **star closure** of relation $S$, denoted by $S^\ast$, is given by $S^\ast = \bigcup\limits_{n=1}^{\infty} S^n$

**Theorem:** The transitive closure of $S$ is equal to $S^\ast$.

Proof: We must show that:
1. $S^\ast$ is a superset of $S$
2. $S^\ast$ is transitive
3. $S^\ast$ is the smallest superset of $S$ that is transitive

(1) $S^\ast \supseteq S$ by definition

(2) Suppose $(x,y) \in S^m$ for some $m$, and $(y,z) \in S^n$ for some $n$. Then $(x,z) \in S^{m+n}$.

Since $S^m, S^n, S^{m+n} \subseteq S^\ast$, we have $(x,y), (y,z), (x,z) \in S^\ast$. Therefore $S^\ast$ is transitive.

(3) Suppose $T$ is an arbitrary superset of $S$ that is transitive. 

Since $S \subseteq T$, then $S^2 \subseteq T^2$. Plus $T^2 \subseteq T$ itself since $T$ is transitive already. Therefore $S^2 \subseteq T$.

Similarly we can show that $\forall n, S^n \subseteq T$. Therefore $S^\ast$ is a union of $T$'s subsets, and thus $S^\ast \subseteq T$, which means $S^\ast$ is the smallest superset of $S$ that is transitive. $\blacksquare$

所以理论上来说，若按 $S^\ast$ 计算，要算到 $n \to \infty$，但在实际应用中我们明显不可能这么做。

**Theorem:** If $\vert \Sigma \vert = k$, then any path of length $>k$ in relation $S \subseteq \Sigma \times \Sigma$ must contain a cycle.

Proof: Obviously true by Pigeon Hole Principle. $\blacksquare$

Therefore $\forall n > k$, $S^n$ does not contain any $(x,y)$ pair that's already contained in $\bigcup\limits_{n=1}^{k} S^n$. 所以我们计算到 $n = \vert \Sigma \vert$ 即可。

**Corollary:** If $\vert \Sigma \vert = n$, then $\operatorname{k_{t}}(S) = S \cup S^2 \cup \cdots \cup S^n = S^\ast$

# Closure Operators

前面的 $\operatorname{k_{r}}, \operatorname{k_{s}}, \operatorname{k_{t}}$ 都是很好的 closure operator 的例子。现在我们来看下 closure operator 具体的性质。

不管 $S_i$ 是 algebraic structure 还是 relation，我们都可以组一个 poset $\mathbb{S} = \lbrace S_1, S_2, \cdots, S_n \rbrace$ with $S_i \leq S_j \iff S_i \subseteq S_j$. 或者更宽泛一点，我们认为 $\forall$ poset $(\mathbb{S}, \leq)$，都可以定义一个函数 $f: S \to S$ 满足：

1. (increasing) $\forall S \in \mathbb{S}, \, S \leq f(S)$
2. (monotonic) $S_1 \leq S_2 \iff f(S_1) \leq f(S_2)$
3. (idempotent) $f\big(f(\cdot)\big) = f(\cdot)$

这个 $f$ 就可以被视为 $S$ 上的一个 closure operator.

**Definition:** $S$ is "closed" (or having some property w.r.t. to the closure operator $f$) if $S = f(S)$
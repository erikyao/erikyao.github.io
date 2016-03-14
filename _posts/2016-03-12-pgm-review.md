---
layout: post-mathjax
title: "PGM Review"
description: ""
category: PGM
tags: [PGM-101]
---
{% include JB/setup %}

[Tree-CPD]: https://farm2.staticflickr.com/1557/25738662006_b2c13b5732_o_d.png

## Introduction and Overview (Week 1)

### Overview and Motivation

PGM is a _**declarative**_ representation that captures our understanding of what these variables are and how they interaction with each other.

"Declarative" means that the representation stands on it's own, which means we can apply different algs to one model to

- answer different questions in different contexts, or 
- answer same question in more efficient ways, or
- make different trade-offs between accuracy and computational cost.

$P(X_1,\dots,X_n)$ is the distribution over $2^n$ possible states. 一个 state 即是一组 assignments like $\lbrace X_1 = x_1, \cdots, X_n = x_n \rbrace$.

- Exponential space.

### Distibutions

A RV $I$, which has two assignments $i^0$ and $i^1$. => cardinality of $I$, i.e. $\lvert I \rvert = 2$

Suppose $\lvert D \rvert = 2$ and $\lvert G \rvert = 3$

- $P(I,D,G)$ has $\lvert I \rvert \cdot \lvert D \rvert \cdot \lvert G \rvert = 12$ states 
	- $P(I,D,G)$ table has 12 rows.
		- We need to assign 12 probabilities. 
			- We need to determine 12 _**parameters**_ for this "table model". 
			- 11 independent parameters. An independent parameter's value is not decided by other parameters.

Conditions on $G=g^1$ for $P(I,D,G)$:

- 去掉原 table 里 $G neq g^1$ 的 rows，得到一个 reducd table. This operation is called _**reduction**_。
	- reduction 之后我们得到是 $P(I,D,g^1)$，注意是 unnormalized
	- 从 $P(I,D,g^1)$ 中去掉 $G$ 列，因为我们只剩下 $G=g^1$ 的情况，不需要在 table 里画出来
- $G=g^1$ 的 rows 需要 _**normalization**_ 才能满足所有的 prob 之和为 1
- normalization 之后，我们得到的就是 $P(I,D \vert g^1)$
- 我们称 $G=g^1$ 为一个 _**context**_

_**Maginalization**_ over $I$ for $P(I,D)$:

- 如果两 rows 只有 $I$ 的 assignment 不同，则将这两 rows 的 prob 相加，合并为 1 row，消去 $I$ 列
- 操作写作 $\sum_{I} P(I,D)$，得到的即是 $P(D)$
- 亦可直接写作 $\sum_{I} P(I,D) = P(D)$
- 不需要 normalization

### Factors

factor $\phi: \text{every assignment of }(X_1,\dots,X_n) \rightarrow R$

$ scope(\phi) = \lbrace X_1,\dots,X_n \rbrace $ 

E.g. 

- $P(I,D,G)$ is a factor
- $P(I,D,g^1)$ is also a factor, however $scope(P(I,D,g^1)) = \lbrace I,D \rbrace$ because $G=g^1$ is a constant not a variable here.

_**Conditional Probability Distribution (CPD)**_:

- 我们前面 Conditions on $G=g^1$ for $P(I,D,G)$ 得到是 $P(I,D \vert g^1)$
- 而 CPD $P(I,D \vert G)$ 是要把所有的 $P(I,D \vert g^i)$，写到一张表里
	- 即针对所有关于 $G$ 的 context 做一个 table
	
Factor Product: $\phi_1(A,B) \dot \phi_2(B,C) = \phi_3(A,B,C)$，i.e. table 的乘法

- $ \phi_1(A,B) $ 需要 $\lvert A \rvert \cdot \lvert B \rvert$ 个 parameter，依此类推

Factor Maginalization: 类似 Probability Maginalization

Factor Reduction: 类似 Probability reduction

## Bayesian Network Fundamentals (Week 1)

### Semantics & Factorization

$P(X_i \vert Par_G(X_i))$: a CPD in Bayesian Network. 如果没有 parent，我们称其为 degenerate

_**Chain Rule:**_ $Joint = \prod \lbrace \text{all CPDs} \rbrace$ => product of all factors

- $P(D,I,G,S,L) = P(D) \cdot P(I) \cdot P(G \vert D,I) \cdot P(L \vert G) \cdot P(S \vert I)$
- Similarly, $P(d^0, i^1, g^3, s^1, l^1) = P(d^0) \cdot P(i^1) \cdot P(g^3 \vert d^0,i^1) \cdot P(l^1 \vert g^3) \cdot P(s^1 \vert l^1)$
- I.e. BN (graph $G$) _**represents**_ a joint distribution ($P$) via chain rule.
- 反过来我们称 Distibution $P$ _**factorizes**_ over graph $G$ if $P(X_1,\dots,X_n)=\sum_{i}P(X_i \vert Par_G(X_i))$

$\sum_L{P(L \vert G)} = 1$ <= Use this in V.E.

### Reasoning Patterns

- Causal Reasoning: $P(X_{child} \vert X_{parents})$
- Evidental Reasoning: $P(X_{parent} \vert X_{children})$
- Intercausal Reasoning: $P(X_{parent1} \vert X_{children}, X_{parent2})$

### Flow of Probabilistic Influence

When can var $X$ influence var $Y$ without any evidence?

- $X \rightarrow Y$ √
- $X \leftarrow Y$ √
- $X \rightarrow W \rightarrow Y$ √
- $X \leftarrow W \leftarrow Y$ √
- $X \leftarrow W \rightarrow Y$ √
- $X \rightarrow W \leftarrow Y$ × 
	- so-called V-structure
	- × also means "blocks the trail"

When can var $X$ influence var $Y$ with evidence about $Z$?

- $X \rightarrow Y$ √ (direct influence which does not care $Z$ at all)
- $X \leftarrow Y$ √ (direct influence which does not care $Z$ at all)
- $X \rightarrow W \rightarrow Y$ √ if $W \notin Z$; × if $W \in Z$
	- i.e. √ if $W$ is not observed; × if $W$ is observed
- $X \leftarrow W \leftarrow Y$ √ if $W \notin Z$; × if $W \in Z$
- $X \leftarrow W \rightarrow Y$ √ if $W \notin Z$; × if $W \in Z$
- $X \rightarrow W \leftarrow Y$ × if $W \text{ and all of its descendants} \notin Z$; √ if $W \text{ or one of its descendants} \in Z$

influence flow == active trail

### Conditional Independence

$X \perp Y \vert Z$ => a $X \leftarrow Z \rightarrow Y$ structure => $P(X,Y,Z) \propto \phi_1(X,Z) \cdot \phi_2(Y,Z)$

### Independencies in Bayesian Networks

If distibution $P$ factorizes over graph $G$, can we find out the independencies in $P$ from the structure of $G$?

d-separated == directionally-separated

$X$ and $Y$ are d-separated in $G$ given $Z$ if there is no active trail in $G$ between $X$ and $Y$ given $Z$.

- 写作 $d\text{-}sep_G(X,Y \vert Z)$

_**Theorem 1:**_ If distibution $P$ factorizes over graph $G$ and $d\text{-}sep_G(X,Y \vert Z)$, then $P \models X \perp Y \vert Z$

- d-separation implies independency in BN

Any node is d-separated from its non-descendants given its parents. => Any variable is independent from its non-descendants given its parents.

I-map == Independence-map

Independence Set $ I(G) = \lbrace \text{all independencies defined by d-separation in } G \rbrace $

If $P$ satisfies $I(G)$, we say $G$ is a I-map of $P$.

- All distribution satisfies $I(G) = \emptyset$

_**Theorem 2:**_ If distibution $P$ factorizes over graph $G$, then $G$ is an I-map for $P$

- 从 $G$ 本身的结构我们可以给出所有的 d-separation
- 根据 _**Theorem 1**，$P$ 可以满足所有 $G$ 定义的 d-separation 所定义的 independencies
	- 你知道了所有的 d-separation，就能得到所有的 independency，i.e. $I(G)$
	- 所以 $P$ 满足 $I(G)$
- 所以 $G$ 是 $P$ 的 I-map

=> If distibution $P$ factorizes over graph $G$, we can find out the independencies in $P$ from $G$ regardless of $P$'s parameters. 

_**Theorem 3:**_ If $G$ is an I-map for $P$, then distibution $P$ factorizes over graph $G$

### Naive Bayes

A special Bayesian Network

$C \rightarrow \forall X_i$

_**Bayes Assumption:**_ Given the class variable $C$, each observed variable, $X_i$, is independent of the other observed variables. => $X_i \perp X_j \vert C, \forall i,j$

=> $P(C, X_1, \dots, X_n) = P(C)\prod_{i=1}^{n} P(X_i \vert C)$

=> $ \frac{P(C=c^1 \vert x_1, \dots, x_n)}{P(C=c^2 \vert x_1, \dots, x_n)}=\frac{P(C=c^1)}{P(C=c^2)} \prod_{i=1}^{n} \frac{P(x_i \vert C=c^1)}{P(x_i \vert C=c^2)}$

- $\frac{P(C=c^1)}{P(C=c^2)}$: the ratio of priors 
- $\frac{P(x_i \vert C=c^1)}{P(x_i \vert C=c^2)}$: the odd ratio

Bernoulli Naive Bayes: each $X_i$ is a binary var subject to Bernoulli distribution

Multinomial Naive Bayes

Summary of Naive Bayes:

- A simple model for classification
	- Compuattionally efficient
	- Easy to construct
- Strong independence assumption
	- Effective in domains with many weakly relevant features
	- Reduces performance when many features are strongly correlated

## Structured CPDs (Week 2)

### Structured CPDs (Week 2)

Tabular Representation: 比如 $P(G \vert I,D)$，你画一张表来表示

对 $\forall G=g^i$，你都有 $\lvert I \rvert \cdot \lvert D \rvert = 4$ 个 cells

那假设你 $X_i$ 有 $k$ 个 parent，你 $ P(X_i = x_i \vert Par_G(X_i)) $ 就要有 $2^k$ 个 cells => Too large

Available alternative CPD models (representation):

- Deterministic CPDs
- Tree-structure CPDs
- Logistic CPDs and generalizations
- Noisy OR/AND
- Linear Gaussians and generalizations

Digress: Context-Specific Independence (CSI), a notion commonly used in CPD

$P \models (X \perp_c Y \vert Z,c)$ => an independent statement that only holds for particular values ($c$ here) of the conditioning variable $C$, as opposite to all values of the conditioning variable $C$.

If $X \perp_c Y \vert Z,c$:

- $ P(X,Y \vert Z,c) = P(X \vert Z,c) P(Y \vert Z,c) $
- $ P(X \vert Y,Z,c) = P(X \vert Z,c) $
- $ P(Y \vert X,Z,c) = P(X \vert Z,c) $

Why CSI arises?

考虑一个简单的模型 $X = Y_1 OR Y_2$，画出来就是 $Y1, Y2 \rightarrow X$

- $X \perp Y_1 \vert y_2^0$? ×
	- $Y_2 = false$ => $X = Y_1$
- $X \perp Y_1 \vert y_2^1$? √
	- $Y_2 = true$ => $X = true$, I don't care $Y_1$ at all
- $Y_1 \perp Y_2 \vert x^0$? √
- $Y_1 \perp Y_2 \vert x^1$? ×

### Tree-Structured CPDs

![][Tree-CPD]

$P(Y \vert X_1 \dots X_n)$

- 每一个 internal node 都是 $X_i$
- 叶子节点是具体的 $P(Y \vert x_1,\dots,x_n)$ 的值
- edge 表示 context
- 比如上图的 Node $A$ -> $a^0$ -> $(0.8, 0.2)$ 就表示 
	- $P(Y=y^0 \vert a^0) = 0.8$ 
	- $P(Y=y^1 \vert a^0) = 0.2$
	
比 Tabular CPD 节省空间的原因在于：in certain context, some of the variables don't matter (to $Y$).

Which context-specific independencies are implied by the structure of this CPD?

- $J \perp L \vert a^1,s^1$? √
- $J \perp L \vert a^1$? ×
- $J \perp L,S \vert a^0$? √
- $J \perp L \vert s^1,A$? √

Multiplexer CPD

Summary: Compact CPD representation captures CSI

### Independence of Causal Influence

Noisy OR CPD

Sigmoid CPD

### Continuous Variables

Linear Gaussian

比如我们有一个 BN: $\textbf{T}emperature \rightarrow \textbf{S}ensor$，我们可以假设 $ S \sim \mathcal{N}(T,\sigma_S^2) $

对 BN $X_1,\dots,X_k \rightarrow Y$，我们可以定义 $Y \sim \mathcal{N}(w_0 + \sum w_iX_i, \sigma^2)$

- $w_0 + \sum w_iX_i$ is a linear function of all $Y$'s parents
- $\sigma^2$ is a variance doesn't depend on $Y$'s parents at all

Conditional Linear Gaussian

BN $A, X_1,\dots,X_k \rightarrow Y$. $A$ is discrete; $X_i$ is continuous. $Y \sim \mathcal{N}(w_{a0} + \sum w_{ai} X_i, \sigma_a^2)$

- variance depends on $Y$'s discrete parent

Nonlinear Gaussians

## Markov Network Fundamentals (Week 2)

### Pairwise Markov Networks (10:59)

The undirected graphical models are typically called _**Markov networks**_, a.k.a. _**Markov random field**_.

Pairwise Markov Networks is the simplest case and then we're going to generalize it.

$A--B--C--D--A$

How do you parametrize an undirected graph? Because you no longer have the notion of CPD due to there is no variable that's conditioning in one that you conditon on 

=> So we're going to use the general notion of factor. 比如对 $A--B$，我们有一个 $\phi_1(A,B)$，这个 factor 是 local 的

- $\phi_1(A,B)$ 也称为 pairwise factor
	- $\phi_1(A,B) \not\propto P(A,B) $ 
	- $\phi_1(A,B) \not\propto P(A \vert B) $
	- $\phi_1(A,B) \not\propto P(A,B \vert C,D) $

=> 接着我们就用 product of factors, $ \tilde{P}(A,B,C,D) = \phi_1(A,B) \phi_2(B,C) \phi_3(C,D) \phi_4(D,A) $ => this is unnormalized measure

=> $ P(A,B,C,D) = \frac{1}{Z} \tilde{P}(A,B,C,D) $ => normalized measure

=> $Z$ 称为 partition function

$\Phi = \lbrace \phi_1,\phi_2,\phi_3,\phi_4 \rbrace$. $P_{\Phi}(A,B)$ 表示从 factor 集合 $\Phi$ ($\phi_1(A,B)$ in this case) 推算出来的 distribution (这里"推算"也就只是 mormalization 而已)

Pairwise Markov Network: each edge $X_i--X_j$ is associated with a factor (potential) $\phi_{ij}(X_i,X_j)$

### General Gibbs Distribution

A more general, more expressive notion than Pairwise Markov Networks

考虑一个 complete graph of 4 nodes $A,B,C,D$ (i.e. fully connected pairwise Markov Network). Questions:

- Is this fully expressive?
- Or in other words, can it represent any probability distibution over 4 RV?

Consider a fully connected pairwise Markov network over $X_1, \dots, X_n$ where each $ X_i $ has $d$ values. How many parameters does the network have? => $O(n^2 d^2)$

How many parameters are there in a general probability distribution over $N$ RV where each has $D$ values? => $O(d^n)$

$O(d^n) \gg O(n^2 d^2)$ => pairwise Markov Network cannot represent every probability distibution

=> New question: how do we increase the coverage of this undirected representation? 

=> We need to move away from Pairwise edges.

Gibbs Distribution:

- $\Phi = \lbrace \phi_1(D_1), \dots, \phi_k(D_k) \rbrace$
	- $ D_i \in 2^X $
- $ \tilde P_\Phi(X_1, \dots, X_n) = \prod_{i=1}^{k}\phi_i(D_i) $
- $ P_\Phi(X_1, \dots, X_n) = \frac{1}{Z_\Phi} \tilde{P}_\Phi (X_1, \dots, X_n) $
	- $ Z_\Phi = \sum_{X_1,\dots,X_n} \tilde P_\Phi (X_1, \dots, X_n) $

E.g. 如果 $\Phi = \lbrace \phi_1(A,B,C),\phi_2(B,C,D) \rbrace$，我们需要连接 $E_1 = \lbrace A--B,B--C,A--C \rbrace$ 和 $E_2 = \lbrace B--C,C--D,D--B \rbrace$ 这两组 edges，得到一个 induced Pairwise Markov Network 

_**Theorem:**_ Induced Markov network $H_\Phi$ has an edge $X_i--X_j$ whenever $\exists \phi_m \in \Phi$ s.t. $X_i,X_j \in Scope(\phi_m)$

$P$ _**factorizes**_ over $H$ if there exists $\Phi = \lbrace \phi_1(D_1), \dots, \phi_k(D_k) \rbrace$ such that $P = P_\Phi$

- $H$ is the induced graph for the set of factors $\Phi$

但是我们说 "One cannot read the factorization from the graph"，因为同一组 edge $E$ 可能有多种 set of factors $\Phi$ 的组合

A tail $X_1--\dots--X_n$ is active (i.e. not blocked) given $Z$ if no $X_i$ is in $Z$

### Conditional Random Fields

CRF 主要用来处理 correlated features

- Bayes Assumption 不合适
	- $X_i$ and $X_j$ are correlated to each other => redundant information if we just put all features in Bayesian Networks
- 但是我们同时也不想 add edges between $X_i$ and $X_j$ to capture correlation
	- 原因一：hard to figure out the correlation
	- 原因二：graph way too dense
- CRF 的想法是：I don't care the distribution of features. I just want to model $Y$ using the features
	- 所以我不 model $P(X,Y)$
		- 因为 $P(X,Y)$ 需要考虑 $X_i$s' correlation
	- instead I model $P(Y \vert X)$
	
CRF representation:

- Just like Gibbs Distribution: 
	- $\Phi = \lbrace \phi_1(D_1), \dots, \phi_k(D_k) \rbrace$
	- $ \tilde P_\Phi(X, Y) = \prod_{i=1}^{k}\phi_i(D_i) $
- Difference:
	- $ Z_\Phi(X) = \sum_{Y} \tilde P_\Phi (X,Y) $ <= partition function of $X$
	- $ P_\Phi(Y \vert X) = \frac{1}{Z_\Phi(X)} \tilde{P}_\Phi (X,Y) $
		- 对不同的 $x_i$，$Z_\Phi(x_i)$ 的值不同，所以 $P_\Phi(Y \vert x_i)$ 的值也不同
		- 所以说 $ P_\Phi(Y \vert X)$ is a family of condition distributions which varies by $X$
		
Q: Consider a new factor $ \phi(D) $ such that $ D \subseteq X $. What is the effect of adding this factor $\phi$ on the distribution $ P(Y \vert X $)?

A: $\phi$ multiplies both the unnormalized measure and the partition function and therefore cancels out, so $ P(Y \vert X) $ remains unchanged.

CRFs and Logistic Model: 待补充

- logistic regression is a very simple CRF

Summary:

- A CRF is parameterized the same as a Gibbs distribution, but normalized differently

### Independencies in Markov Networks

前面有所 A tail $X_1--\dots--X_n$ is active (i.e. not blocked) given $Z$ if no $X_i$ is in $Z$

与 d-separation 那一套定义类似。待补充

## Inference: Variable Elimination (Week 3)

我们在一个 model 里做 inference 也可以称作 "inferencing a model"

### Overview: Conditional Probability Queries

_**Sum-Product:**_ 比如你要求 $P(X_i)$，首先要一个 factor product 得到 joint $P(X_1,\dots,X_n)$，然后 marginalize over $\mathcal{X} \setminus \lbrace X_i \rbrace$；而 marginalize 是求和。所以合并起来就是 sum over $\mathcal{X} \setminus \lbrace X_i \rbrace$ on factor product，简称 sum-product

无论是对 BN 还是 MRF，这个 sum-product 的做法都是适用的

Evidence: reduced factors

- Query $P(Y \vert E = e) = \frac{P(Y,E=e)}{P(E=e)}$
- 集合所有的 non-queried and non-evidence 的 variables $W= \lbrace X_1, \dots, X_n \rbrace - Y - E$
- 我们可以把 query 的分子展开为 $P(Y,E=e) = \sum_{W} P(Y,W,E=e)$
	- also a sum-product
- 进一步展开分子 $P(Y,E=e) = \sum_{W} P(Y,W,E=e) = \sum_{W} \frac{1}{Z} \prod_{k} \phi_k (D_k, E=e)$
	- 所以我们只用 pick out factors that are consistent with my evidence $E=e$, which means I reduced the factors (to take into the product) by the evidence
- 可以进一步写成 $P(Y,E=e) = \sum_{W} \frac{1}{Z} \prod_{k} \phi'_k (D'_k)$

Q: Why is the expression $ \sum_W P(Y,W,e) $ hard to compute in general?

A: It may be intractable to sum over all the different values that $ W $ can take.

- 计算 $P(J,I=i,H=h)$: 把 sum-prodct 里带 $I$ 的 factor 都换成 $i$，带 $H$ 的 factor 都换成 $h$
- 计算 $P(J \vert I=i,H=h)$: 把 $P(J,I=i,H=h)$ normalize 即可

总结下：

- Query => sum-product => $P(Y \vert E = e) = \frac{P(Y,E=e)}{P(E=e)}$
- 分子 => reduced factors => $P(Y,E=e) = \sum_{W} \frac{1}{Z} \prod_{k} \phi'_k (D'_k)$
- 分母 => sum over reduced factors => $P(E=e) = \sum_{Y} P(Y,E=e)$
- 于是我们发现有一个公共的部分需要计算，那就是 $\sum_{W} \prod_{k} \phi'_k (D'_k)$

Algorithms for Conditional Probability Queries include:

- Push summations into factor product
	- E.g. variable elimination <= a special case of Dynamic Programming / exact inference
- Message passing over a graph, e.g. <= a generalization of V.E.
	- Belief propagation <= exact
	- Variational approximations <= approx
- Random sampling instantiation <= approx
	- Markov chain Monte Carlo (MCMC)
	- Importance sampling
	
### Overview: MAP Inference

Another kind of query rather than Conditional Probability Queries

MAP = Maximum a Posteriori
MAP != Max Marginal Probabilities

- Evidence: $E=e$
- Query: all other variables other than $E$, i.e. $ Y = \lbrace X_1, \dots, X_n \rbrace - E $
- Task: compute $MAP(Y \vert E=e)=\arg \max_y P(Y=y \vert E=e)$
	- Note: there might be more than one possible solutions

_**Max-Product:**_ 类似 Sum-Product，我们先算 factor product，然后再算 max

- $P(Y \vert E = e) = \frac{P(Y,E=e)}{P(E=e)}$, where $ Y = \lbrace X_1, \dots, X_n \rbrace - E $
- 我们要算 $\arg \max_y P(Y \vert E=e)$
- 分母 $P(E=e)$ is constant w.r.t $Y$
- => $\arg \max_y P(Y \vert E=e) = \arg \max_y P(Y,E=e)$
- $P(Y,E=e) = \sum_{W} \frac{1}{Z} \prod_{k} \phi'_k (D'_k)$ <= reduced factors relative to $E=e$
- Partition function $Z$ is constant w.r.t $Y$
- => $\arg \max_y P(Y \vert E=e) = \arg \max_y \prod_{k} \phi'_k (D'_k)$

Algorithms for MAP include:

- Push summations into factor product
	- E.g. variable elimination
- Message passing over a graph
	- E.g. Max-product belief propagation
- Using methods for integer programming
	- MAP is in fact a optimaiztion problem, so we can use this optimization techniques
- For certain types of networks: graph-cut methods
- Combinatorial serach

### Variable Elimination Algorithm

考虑一个 undirected model: $A--B--C--D--E$

$$
\begin{align}
	P(E) 
	& \propto \sum_D \sum_C \sum_B \sum_A \tilde P(A,B,C,D,E) \newline
	& = \sum_D \sum_C \sum_B \sum_A \phi_1(A,B) \phi_2(B,C) \phi_3(C,D) \phi_4(D,E) \newline
	& = \sum_D \sum_C \sum_B \phi_2(B,C) \phi_3(C,D) \phi_4(D,E) \sum_A \phi_1(A,B) \newline
	& = \sum_D \sum_C \sum_B \phi_2(B,C) \phi_3(C,D) \phi_4(D,E) \tau_1(B) \text{ (eliminated A)} \newline
	& = \sum_D \sum_C \phi_3(C,D) \phi_4(D,E) \sum_B \phi_2(B,C) \tau_1(B) \newline
	& = \sum_D \sum_C \phi_3(C,D) \phi_4(D,E) \tau_2(C) \text{ (eliminated B)} \newline 
\end{align}
$$

Q: Which variables do we sum over when performing Variable Elimination with evidence?

A: All except the evidence variables.

Explanation: We are trying to compute $ P(Y \vert e)=\frac{P(Y,e)}{P(e)} $ (where $ Y $ are the query variables and $ E $ are the evidence). 

- Computing the numerator involves summing out everything except for the query and evidence variables, and 
- computing the denominator requires further summing over the query variables so that the entire equation sums to 1.

So to summarize the main routine in this algorithm is called _**Eliminate-Var $Z$ from $\Phi$**_: 

$$
\begin{align}
	\Phi' &= \lbrace \phi_i \in \Phi : Z \in Scope(\phi_i) \rbrace \Leftarrow \text{ all factors that involve Z} \newline
	\psi &= \prod_{\phi_i \in \Phi'} \Leftarrow \text{ multiply them} \newline
	\tau &= \sum_Z \psi \Leftarrow \text{ sum of Z} \newline
	\Phi &:= \Phi - \Phi' + \lbrace \tau \rbrace \Leftarrow \text{ re-arrange the factors}
\end{align}
$$

VE summary:

- Reduce all factors by evidence
	- get the sum-product / max-product <= in essence, a set of factors $\Phi$
- For each non-query variable $Z$, run Eliminate-Var $Z$ from $\Phi$
- Multiply all remaining factors, normalize to get a distribution

VE works both for BN and MRF

### Complexity of Variable Elimination

Q: How many times does each entry in $\psi_i$ get added to one of the $\tau_i$ entries?

A: at most once

Explanation: We are computing a single sum over some entries in $\psi$, so each entry is involved in the sum at most once.

不懂，请重看

Summary

- Complexity of variable elimination linear in
	– size of the model (# factors, # variables)
	– size of the largest factor generated
- Size of factor is exponential in its scope
- Complexity of algorithm depends heavily on elimination ordering 

### Graph-Based Perspective on Variable Elimination

不懂，请重看

moralization: 对每一个 V-Structure 的两个 parent node，加一条 edge between them

fill edge: all variables connected to $I$ become connected directly after $I$ is elimimated (直接把 $I$ 从图中拿掉，加一条 edge 连接之前通过 $I$ 相连的两个 node，这条 edge 称为 fill edge)

Induced Graph

The induced graph $I_{\Phi,\alpha}$ over factors $\Phi$ and ordering $\alpha$:

- is an undirected graph
– $ X_i $ and $ X_j $ are connected if they appeared in the same factor in a run of the VE algorithm using $ \alpha $ as the ordering

_**Theorem:**_ Every factor produced during VE is a clique in the induced graph.

- clique: a maximal fully connected subgraph
	- by "maximal" it means you cannot add a node to this clique and keep it fully connected




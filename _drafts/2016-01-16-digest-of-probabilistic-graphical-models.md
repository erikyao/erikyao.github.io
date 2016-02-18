---
layout: post-mathjax
title: "Digest of <i>Probabilistic Graphical Models</i>"
description: ""
category: PGM
tags: [PGM-101]
---
{% include JB/setup %}

## 1. Introduction

### 1.1 Motivation

To _**reason**_: to take the available _**information**_ and reach _**conclusions**_. E.g.

- A doctor needs to take information about a patient — his symptoms, test results, personal characteristics (gender, weight) — and reach conclusions about what diseases he may have and what course of treatment to undertake. 
- A mobile robot needs to synthesize data from its sonars, cameras, and other sensors to conclude where in the environment it is and how to move so as to reach its goal without hitting anything. 
- A speech-recognition system needs to take a noisy acoustic signal and infer the words spoken that gave rise to it.

In this book, we describe a general framework that can be used to allow a computer system to answer questions of this type. In principle, one could write a special-purpose computer program for every domain one encounters and every type of question that one may wish to answer. 但是这样不够 general，总是 ad-hoc 是没有前途的。

We focus on a different approach based on the concept of a _**declarative representation**_. In this approach, we construct, within the computer, a _**model**_ of the system about which we would like to reason.

- This model encodes our knowledge of how the system works in a computerreadable form. 
- This representation can be manipulated by various algorithms that can answer questions based on the model.

The key property of a declarative representation is the _**separation of knowledge and reasoning**_. 

- The representation has its own clear semantics, separate from the algorithms that one can apply to it. 
- Thus, we can develop a general suite of algorithms that apply any model within a broad class, whether in the domain of medical diagnosis or speech recognition. 
- Conversely, we can improve our model for a specific application domain without having to modify our reasoning algorithms constantly.

_**P.S.**_ 类似 workflow 分离了流程定义和操作？

Our focus in this book is on models for complex systems that involve a significant amount of uncertainty. We are often uncertain about the true state of the system (i.e. true relationship between input and output) because

- Our observations are partial;
- Our observations are also noisy.

Because of this ubiquitous and fundamental uncertainty about the true state of world, we need to allow our reasoning system to consider different possibilities. 但是考虑全部的可能性是没有意义的 (e.g., “the patient can have any of the following 573 diseases”)。Thus, to obtain meaningful conclusions, we need 􀀀 to reason not just about what is _**possible**_, but also about what is _**probable**_. And this is why we need probability theory!

### 1.2 Structured Probabilistic Models

This book describes a general-purpose framework for constructing and using probabilistic models of complex systems. 

Complex systems are characterized by the presence of multiple interrelated aspects, many of which relate to the reasoning task. 换句话说就是：条件、input 太多；比如诊断一个病，需要做超级多的检查；如果连具体是什么病都没把握，就要做更多的检查。These domains can be characterized in terms of a set of _**random variables**_.

Our task is to reason probabilistically about the values of one or more of the variables, possibly given observations about some others. In order to do so using principled probabilistic reasoning, we need to construct a joint distribution (\\( P(Y,Z) \\)) over the space of possible assignments to some set of random variables \\( \mathcal{X} \\).

#### 1.2.1 Probabilistic Graphical Models

单单考虑 binary random variable，\\( n \\) 个 RV 就有 \\( 2\^n \\) 个 value 的组合，当 \\( n \\) 很大的时候，the problem appears completely intractable. 

This book describes the framework of probabilistic graphical models, which provides a mechanism for exploiting structure in complex distributions to describe them _**compactly**_, and in a way that allows them to be constructed and utilized _**effectively**_. 简单说就是两个目的：简洁、高效！

There is a dual perspective that one can use to interpret the structure of this graph.

- From one perspective, the graph is a compact representation of a set of _**independencies**_ that hold in the distribution.
	- \\( X \bot Y | Z \\): \\( X \\) is independent of \\( Y \\) given \\( Z \\). \\( X \\), \\( Y \\), \\( Z \\) are subsets of variables. 所以你可以有类似 \\( Y \bot Z,C | D,E \\)。
	- If \\( X \bot Y | Z \\), then \\( P(X | Z,Y) = P(X | Z) \\), which means the evidence \\( Y \\) is no longer informative in this query.
- The other perspective is that the graph defines a skeleton for compactly representing a high-dimensional distribution.
	- Rather than encode the probability of every possible assignment to all of the variables in our domain, we can “break up” the distribution into smaller _**factors**_, each over a much _**smaller space of possibilities**_. 
	- We can then define the overall joint distribution as a product of these factors.
	- 考虑前面 \\( n \\) 个 binary RV 的例子，要求 joint distribution，其实就是要画一个 \\( 2\^n \\) row 的真值表，我们称其为 "requiring \\( 2\^n - 1 \\) parameters" (知道了 \\( 2\^n -1 \\) 个概率，最后一个直接用 1 一减就可以了)。而用 factor 的话就可以减少 parameter 的量。
	
It turns out that these two perspectives — the graph as a representation of a set of independencies, and the graph as a skeleton for factorizing a distribution — are, in a deep sense, equivalent. The independence properties of the distribution are precisely what allow it to be represented compactly in a factorized form. Conversely, a particular factorization of the distribution guarantees that certain independencies hold.

#### 1.2.2 Representation, Inference, Learning

还是考虑前面 \\( n \\) 个 binary RV 的例子。In practice, variables tend to interact directly ONLY with very few others. 而 PGM 就是抓住了这一本质，不再需要计算 \\( 2\^n \\) 个概率组合。从另一个角度来说，具有 "interact directly ONLY with very few others" 这一特点的 distribution 也适合用 PGM 来表示。

而用 PGM 来 encode distribution 的好处在于：

- The type of representation provided by this framework is _**transparent**_, in that a human expert can understand and evaluate its semantics and properties. This property is important for constructing models that provide an accurate reflection of our understanding of a domain.
- The same structure often also allows the distribution to be used effectively for _**inference**_ — answering queries using the distribution as our model of the world. In particular, we provide algorithms for computing the posterior probability of some variables given evidence on others.
- Third, this framework facilitates the effective construction of these models, whether by a human expert or automatically, by _**learning**_ from data a model that provides a good approximation to our past experience.

## 2. Foundations

### 2.1 Probability Theory

When we use the word “probability” in day-to-day life, we refer to a degree of confidence that an event of an uncertain nature will occur.

Formally, we define _**events**_ by event assuming that there is an agreed-upon space of possible outcomes, which we denote by \\( \Omega \\). In addition, we assume that there is a set of measurable events \\( S \\) to which we are willing to assign probabilities.

- 这里的概念有点乱。用我自己的话说：
	- \\( S \\) 是全集
	- 如果我们把空集也看做一个 event，那么 \\( \Omega \\) 就是另一个极端的 event (可以理解为 "出现任意 outcome" 的事件)
		- 我们称空集为 _**empty event**_ \\( \varnothing \\), 然后 the _**trivial event**_ \\( \Omega \\).
		- 比如 dice，\\( \Omega = \left \\{ 1,2,3,4,5,6 \right \\} \\)
		- \\( P(\Omega) = 1 \\)
	- \\( \varnothing \in S \\) and \\( \Omega \in S \\)
	- \\( S \\) 要满足 union，即 if \\( \alpha, \beta \in S \\), then \\( \alpha \cup \beta \in S \\)
	- \\( S \\) 要满足 complementation，即 if \\( \alpha \in S \\), then \\( \Omega - \alpha \in S \\)
	
_**Interpretations for probabilities:**_

- Frequentist:
	- When we discuss concrete physical systems (for example, dice, coin flips, and card games) we can envision how these frequencies are defined.
	- The frequentist interpretation fails, however, when we consider events such as “It will rain tomorrow afternoon.” We expect it to occur exactly once. It is not clear how we define the frequencies of such events.
- An alternative interpretation views probabilities as subjective degrees of belief.
	- This description still does not resolve what exactly it means to hold a particular degree of belief. What stops a person from stating that the probability that Bush will win the election is 0.6 and the probability that he will lose is 0.8? The source of the problem is that we need to explain how subjective degrees of beliefs (something that is internal to each one of us) are reflected in our actions.
		- 比如用 expectation 来判断是否值得投资。
		
_**Conditional Probability:**_

- \\( P(\alpha | \beta) = \frac{P(\alpha \cap \beta)}{P(\beta)} \\)
- Chain Rule:
	- \\( P(\alpha \cap \beta) = P(\alpha) P(\beta | \alpha) \\)
	- \\( P(\alpha\_1 \cap \dots \cap \alpha\_k) = P(\alpha\_1) P(\alpha\_2 | \alpha\_1) P(\alpha\_3 | \alpha\_1 \cap \alpha\_2) \dots P(\alpha\_k | \alpha\_1 \cap \dots \cap \alpha\_{k-1}) \\)
- Bayes’ Rule:
	- \\( P(\alpha | \beta) = \frac{P(\beta | \alpha) P(\alpha)}{P(\beta)} \\)
		- The _**prior**_ is a probability distribution that represents your uncertainty over \\( \theta \\) before you have sampled any data and attempted to estimate it - usually denoted \\( \pi(\theta) \\).
		- The _**posterior**_ is a probability distribution representing your uncertainty over \\( \theta \\) after you have sampled data - denoted \\( \pi(\theta|X) \\). It is a conditional distribution because it conditions on the observed data.
		- \\( \pi(\theta|X) = \frac{f(X|\theta)\pi(\theta)}{\sum\_{\theta\_i}{f(X|\theta\_i)\pi(\theta\_i)}} \\) 
	- \\( P(\alpha | \beta \cap \gamma) = \frac{P(\beta | \alpha \cap \gamma) P(\alpha | \gamma)}{P(\beta | \gamma)} \\)
		- 即 \\( P(\alpha | \beta \cap \gamma) P(\beta | \gamma) = P(\beta | \alpha \cap \gamma) P(\alpha | \gamma) \\), 两边同时乘以 \\( P(\gamma) \\) 即相等。
- 简写：\\( P((X = x) \cap (Y = y)) = P(X = x, Y = y) = P(x, y) \\)

_**Marginal**_ and _**Joint Distribution:**_

- Marginal distribution of \\( X \\) is one over other random variables, denoted by \\( P(X) \\).
- Joint distribution of \\( X,Y \\) is one involving the values of the two random variables, denoted by \\( P(X,Y) \\)
- The joint distribution of two random variables has to be consistent with the marginal distribution,
in that \\( P(x) = \sum\_{y}{P(x, y)} \\).

_**Independence**_ and _**Conditional Independence:**_

- An event \\( \alpha \\) is independent of event \\( \beta \\) in \\( P \\), denoted \\( P |= (\alpha \bot \beta) \\), if and only if \\( P(\alpha \cap \beta) = P(\alpha) P(\beta) \\).
	- 我们也可以称 \\( P \\) satisfies \\( (\alpha \bot \beta) \\).
	- 此时也有 \\( P(\alpha | \beta) = P(\alpha) \\) or \\( P(\beta) = 0 \\).
- An event \\( \alpha \\) is independent of event \\( \beta \\) given event \\( \gamma \\) in \\( P \\), denoted \\( P |= (\alpha \bot \beta | \gamma) \\), if and only if \\( P(\alpha \cap \beta | \gamma) = P(\alpha | \gamma) P(\beta | \gamma) \\).
	- 我们也可以称 \\( P \\) satisfies \\( (\alpha \bot \beta | \gamma) \\).
	- 此时也有 \\( P(\alpha | \beta \cap \gamma) = P(\alpha | \gamma) \\) or \\( P(\beta \cap \gamma) = 0 \\).
	
_**Conditional Independence of Random Variables:**_

- Let \\( X, Y, Z \\) be sets of random variables. We say that \\( X \\) is conditionally independent of \\( Y \\) given \\( Z \\) in a distribution \\( P \\) if \\( P \\) satisfies \\( (X = x \bot Y = y | Z = z) \\) for all values \\( x \in Val(X) \\), \\( y \in Val(Y) \\), and \\( z \in Val(Z) \\). The variables in the set \\( Z \\) are often said to be _**observed**_. If the set \\( Z \\) is empty, then instead of writing \\( (X \bot Y | \varnothing) \\), we write \\( (X \bot Y ) \\) and say that \\( X \\) and \\( Y \\) are _**marginally independent**_.

<!-- -->

- 以下参考 [Wikipedia - Conditional independence](https://en.wikipedia.org/wiki/Conditional_independence)
- Let \\( X, Y, Z, W \\) be sets of random variables. Note: below, the comma can be read as an "AND".
- _**Symmetry:**_ 
	- \\( X \bot Y \Rightarrow Y \bot X \\)
	- \\( X \bot Y | Z \Rightarrow Y \bot X | Z \\)
- _**Decomposition:**_ 
	- \\( X \bot Y,Z \Rightarrow \text{ and } \begin{cases} X \bot Y \\\\ X \bot Z \end{cases} \\)
		- \\( \text{ and } \\) 表示两个都成立，下同。
	- \\( X \bot Y,Z | W \Rightarrow \text{ and } \begin{cases} X \bot Y | W \\\\ X \bot Z | W \end{cases} \\)
- _**Weak union:**_
	- \\( X \bot Y,Z \Rightarrow \text{ and } \begin{cases} X \bot Y | Z \\\\ X \bot Z | Y \end{cases} \\)
	- \\( X \bot Y,Z | W \Rightarrow \text{ and } \begin{cases} X \bot Y | Z,W \\\\ X \bot Z | Y,W \end{cases} \\)
- _**Contraction:**_
	- \\( \left \. \begin{align} X \bot Y | Z \\\\ X \bot Z \end{align} \right \\} \text{ and } \Rightarrow X \bot Y,Z \\)
	- \\( \left \. \begin{align} X \bot Y | Z,W \\\\ X \bot Z | W \end{align} \right \\} \text{ and } \Rightarrow X \bot Y,Z | W \\)
- _**Contraction-weak-union-decomposition:**_ Putting the above three together, we have
	- \\( \left \. \begin{align}   X \bot Y | Z \\\\   X \bot Z \end{align} \right \\} \text{ and }  \iff X \bot Y,Z  \Rightarrow \text{ and } \begin{cases}   X \bot Y | Z \\\\   X \bot Z \\\\   X \bot Z | Y \\\\   X \bot Y \\\\ \end{cases} \\) 
- _**Intersection:**_ For positive distributions, and for mutually disjoint sets \\( X, Y, Z, W \\)
	- \\( \left \. \begin{align}   X \bot Y | Z,W \\\\   X \bot Z | Y,W \end{align} \right \\} \text{ and } \Rightarrow X \bot Y,Z | W \\)
	
### P25 起暂时略过

- 2.1 Probability Theory
	- 2.1.5 Querying a Distribution
	- 2.1.6 Continuous Spaces
	- 2.1.7 Expectation and Variance
- 2.2 Graphs

## 3. The Bayesian Network Representation

### 3.1 Exploiting Independence Properties

还是考虑前面 \\( n \\) 个 binary RV 的例子。如果要画真值表，我们需要 \\( 2\^n \\) 个 parameter，但是我们也可以用类似伯努利的形式来展现，比如 \\( P(x\_1,\dots,x\_n) = \prod\_{i}{\theta\_{x\_i}} \\), 这时候我们只需要 \\( n \\) 个 parameter 了。我们称 "the space of all joint distributions specified in the factorized way above is an \\( n \\)-dimensional _**manifold**_ in \\( R\^{2\^n} \\)."

A key concept here is the notion of _**independent parameters**_ — parameters whose values are not determined by others. For example, when specifying an arbitrary multinomial distribution over a \\( k \\) dimensional space, we have \\( k − 1 \\) independent parameters: the last probability is fully determined by the first \\( k − 1 \\) ones. In the case where we have an arbitrary joint distribution over \\( n \\) binary random variables, the number of independent parameters is \\( 2\^n − 1 \\). On the other hand, the number of independent parameters for distributions represented as \\( n \\) independent binomial coin tosses is \\( n \\). _**Therefore, the two spaces of distributions cannot be the same**_.

### P48: 3.1.3 The Naive Bayes Model

### P50: 3.2 Bayesian Networks

### P54: 3.2.1.2 Reasoning Patterns

### P56: 3.2.2 Basic Independencies in Bayesian Networks

### P61: 3.2.3.1 I-map - Example 3.1

### P61: 3.2.3.2 I-Map to Factorization

### P62: Definition 3.4: How to factorize! IMPORTANT! 

chain rule for Bayesian networks!

### P63: 3.2.3.3 Factorization to I-Map

### P69: 3.3.1 D-separation

	P72: Definition 3.7
	
## 4. Undirected Graphical Models

MRFs: Markov Random Fields

- Markov networks are typically called MRFs in computer vision community

CRF: Conditional Random Field

CPD: Conditional Probability Distribution

### P104: Definition 4.1 Factor

简单说，factor 就是真值表里数据的那一栏，比如 \\( Factor(T,F) = x\_1 \\)，那么 \\( P(T,F) = \frac{x\_1}{X} \\)。但是 factor 更精确的定义是一个函数，\\( (T,F) \mapsto x\_1 \\) 只是其中的一个取值。对 factor 这个函数而言，所有可能的变量输入，比如 \\( \left \\{ (T,T),(T,F),(F,F),(F,T) \right \\} \\) 称为 factor 的 scope

### P107: Definition 4.2 Factor Product

clique: 

- /ˈklɪk/
- In the social sciences, a clique is a group of people who interact with each other more regularly and intensely than others in the same setting.

### P111: Factor reduction

比如我们把 \\( Factor(A,B,C) \\) reduce 到 \\( Factor(A,B,c\_1) \\)，我们称 reduced to the _**context**_ \\( C=c\_1 \\).

### P112: Factor reduction 的图示

其实 reduce 到某个 context，就是简单地把那个 vertex 从图里拿掉。

### 4.3 Markov Network Independencies

#### P114: Definition 4.8

Let \\( H \\) be a Markov network structure, and let \\( X\_1,\dots,X\_k \\) be a path in \\( H \\). Let \\( Z \subseteq X \\) be a set of observed variables. The path \\( X\_1,\dots,X\_k \\) is _**active**_ given \\( Z \\) if none of the \\( X\_i \\) in \\( X\_1,\dots,X\_k \\) is in \\( Z \\).

active 的概念见 P108，就是 D-separation 的那个。

#### P115: Definition 4.9: separation

简化版本的定义：We say a set of node \\( Z \\) separates \\( X \\) and \\( Y \\) in a Markov network structure \\( H \\), if there is no active path between any node \\( x \in X \\) and \\( y \in Y \\) given \\( Z \\).

#### P117: Theorem 4.3

If \\( X \\) and \\( Y \\) are not separated given \\( Z \\) in \\( H \\), then \\( X \\) and \\( Y \\) are _**dependent**_ given \\( Z \\) in some distribution \\( P \\) that factorizes over \\( H \\).

举个例子，比如 \\( X\_1 - X\_2 - X\_3 - X\_4 - X\_1 \\):

- \\( X\_1 - X\_2 \\) is active given \\( \left \\{ X\_3, X\_4 \right \\} \\)
	- \\( \Rightarrow \\) \\( X\_1 \\) and \\( X\_2 \\) is not separated by \\( \left \\{ X\_3, X\_4 \right \\} \\)
		- \\( \Rightarrow \\) \\( X\_1 \\) and \\( X\_2 \\) is dependent given \\( \left \\{ X\_3, X\_4 \right \\} \\)
			- \\( \Rightarrow \\) we don't have \\( X\_1 \bot X\_2 | X\_3, X\_4 \\)
- There is no active path between \\( X\_1 \\) and \\( X\_3 \\) given \\( \left \\{ X\_2, X\_4 \right \\} \\) because neither \\( X\_1 - X\_2 - X\_3 \\) nor \\( X\_1 - X\_4 - X\_3 \\) is active given \\( \left \\{ X\_2, X\_4 \right \\} \\).
	- \\( \Rightarrow \\) \\( X\_1 \\) and \\( X\_3 \\) is separated by \\( \left \\{ X\_2, X\_4 \right \\} \\)
		- \\( \Rightarrow \\) \\( X\_1 \\) and \\( X\_3 \\) is independent given \\( \left \\{ X\_2, X\_4 \right \\} \\)
			- \\( \Rightarrow \\) we have \\( X\_1 \bot X\_3 | X\_2, X\_4 \\)
			
#### P118 Definition 4.10

\\( X\_i \bot X\_j \mid \chi - \left \\{ X\_i,X\_j \right \\} \\) if \\( X\_i - X\_j \notin H \\).

#### P118 Definition 4.11

\\( X\_i \bot \chi - \left \\{ X\_i \right \\} - nbr(X\_i) \mid nbr(X\_i) \\).

#### P123 Definition 4.13: Factor Graph

FG:

- variable node: 圆圈
- factor node: 方块
- edge 一定是一边 variable node 一边 factor node
- factor node 的 scope 一定是它的两个 neighbor
- 这些 factor nodes 所呈现的一个 distribution，我们称其 factorizes over this FG 

### 4.5 Bayesian Networks and Markov Networks

#### P134 Definition 4.16: Moralized Graph

#### P139 

所谓 chord，就是把 graph 的 loop 想象成一个圆，连接两个不连续节点的 edge 我们成为 chord。

比如 \\( X\_1 - X\_2 - X\_3 - X\_4 \\) 这个环，我们若是加一条 \\( X\_1 - X\_3 \\) 或是 \\( X\_2 - X\_4 \\)，这条边就是 chord。

triangle 不可能有 chord，所以 chord 至少要有 4 条边的 loop 才会有。

#### P140 Definition 4.17: Clique Tree

### 4.6 Partially Directed Models

#### 4.6.1 CRF: Conditional Random Fields

P146 HMM: hidden Markov model

## 5 Local Probabilistic Models

CPT: conditional probability tables

### P164 Definition 5.2: Tree-CPD

- rooted tree
- leaf t-node / interior t-node
- leaf t-node associates with a distribution \\( P(X) \\)
- iterior t-node associates with a variable \\( Z \in parent(X) \\)
- a branch is a path from root to a leaf
- branch 上的所有 \\( Z=z\_i \\) 的 assignment 我们称为 parent context

### P175 5.4.1 The Noisy-Or Model

P185 

Let \\( P(Y | X\_1, \dots, X\_k) \\) be a noisy-or CPD. Then for each \\( i \neq j \\), \\( X\_i \\) is independent of \\( X\_j \\) given \\( Y = y\_0 \\).

### P179 Definition 5.9: logistic CPD

### P190 Definition 5.15: Conditional Linear Gaussian (CLG) CPD

### P191 Definition 5.17: Conditional Bayesian Network

The conditional random field (CRF)of section 4.6.1 is the undirected analogue of this definition.
	
## 9. Exact Inference: Variable Elimination
	
### P296: Variable Elimination

### P298: Algorithm 9.1 Sum-product variable elimination algorithm

	P299: The basic idea in the algorithm is that we sum out variables one at a time. When we sum out any variable, we multiply all the factors that mention that variable, generating a product factor.
	
	P300: Example 9.1
	
## 10. Exact Inference: Clique Trees

### P346 

Figure 10.1 Cluster tree for the VE execution in table 9.1

### P347 Running Intersection Property

Let \\( T \\) be a cluster tree over a set of factors \\( \Phi \\). We say that \\( T \\) has the _**running intersection property**_ if \\( \forall \\) variable \\( X \\) that \\( X \in C\_a \\) and \\( X \in C\_z \\), \\( X \\) also \\( \in \\) every \\( C\_i \\) that lies in the unique path between \\( C\_a \\) and \\( C\_z \\).

Let \\( T \\) be a cluster tree induced by a variable elimination algorithm over some set of factors \\( \Phi \\). Then \\( T \\) satisfies the running intersection property.

### P348 

Proposition 10.1

Definition 10.3: Clique Tree

A cluster tree that satisfies the running intersection property is called a _**clique tree**_ (sometimes also called a junction tree or a join tree). In the case of a clique tree, the clusters are also called cliques.

### P349 10.2.1.1: An Example

Figure 10.3 Two different message propagations with different root cliques in the Student clique tree

IMPORTANT!

### P356 Definition 10.4

\\( C\_i \\) is ready to transmit to a neighbor \\( C\_j \\) when \\( C\_i \\) has messages from all of its neighbors except from \\( C\_j \\).

When \\( C\_i \\) is ready to transmit to \\( C\_j \\), it can compute the message \\( \theta\_{i→j}(S\_{i,j}) \\) by multiplying its initial potential with all of its incoming messages except the one from \\( C\_j \\), and then eliminate the variables in \\( C\_i − S\_{i,j} \\). In effect, this algorithm uses yet another layer of dynamic programming to avoid recomputing the same message multiple times.

sum-product belief propagation

## 12. Particle-Based Approximate Inference

### 12.1 Forward Sampling

#### 12.1.1 Sampling from a Bayesian Network

P490 时间复杂度分析

#### 12.1.2 Analysis of Error

P490

#### 12.1.3 Conditional Probability Queries

P491

### 12.2 Likelihood Weighting and Importance Sampling

That is, when we come to sampling a node \\( X\_i \\) whose value has been observed, we simply set it to its observed value.

This process generates a weighted particle.

It turns out that LW is a special case of a very general approach called importance sampling.

### 12.3 Markov Chain Monte Carlo Methods

MCMC sampling approach generates a sequence of samples. This sequence is constructed so that, although the first sample may be generated from the prior, successive samples are generated from distributions that provably get closer and closer to the desired posterior.

A key question is, of course, how many iterations we should perform before we can collect a sample as being (almost) generated from the posterior.

P511 kernel!!

P512 公式推导

Note that standard Gibbs sampling is a special case of block Gibbs sampling, with the blocks corresponding to individual variables.

#### 12.3.5 Using a Markov Chain

P518

How do we use this chain to answer queries? A naive answer is straightforward. We run the chain using the algorithm of algorithm 12.5 until it converges to the stationary distribution (or close to it). We then collect a sample from π. We repeat this process once for each particle we want to collect. The result is a data set D consisting of independent particles, each of which is sampled (approximately) from the stationary distribution π. The analysis of section 12.1 is applicable to this setting, so we can provide tight bounds on the number of samples required to get estimators of a certain quality. Unfortunately, matters are not so straightforward, as we now discuss.
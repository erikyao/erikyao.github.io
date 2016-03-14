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

Our task is to reason probabilistically about the values of one or more of the variables, possibly given observations about some others. In order to do so using principled probabilistic reasoning, we need to construct a joint distribution ($ P(Y,Z) $) over the space of possible assignments to some set of random variables $ \mathcal{X} $.

#### 1.2.1 Probabilistic Graphical Models

单单考虑 binary random variable，$ n $ 个 RV 就有 $ 2^n $ 个 value 的组合，当 $ n $ 很大的时候，the problem appears completely intractable. 

This book describes the framework of probabilistic graphical models, which provides a mechanism for exploiting structure in complex distributions to describe them _**compactly**_, and in a way that allows them to be constructed and utilized _**effectively**_. 简单说就是两个目的：简洁、高效！

There is a dual perspective that one can use to interpret the structure of this graph.

- From one perspective, the graph is a compact representation of a set of _**independencies**_ that hold in the distribution.
	- $ X \bot Y \vert Z $: $ X $ is independent of $ Y $ given $ Z $. $ X $, $ Y $, $ Z $ are subsets of variables. 所以你可以有类似 $ Y \bot Z,C \vert D,E $。
	- If $ X \bot Y \vert Z $, then $ P(X \vert Z,Y) = P(X \vert Z) $, which means the evidence $ Y $ is no longer informative in this query.
- The other perspective is that the graph defines a skeleton for compactly representing a high-dimensional distribution.
	- Rather than encode the probability of every possible assignment to all of the variables in our domain, we can “break up” the distribution into smaller _**factors**_, each over a much _**smaller space of possibilities**_. 
	- We can then define the overall joint distribution as a product of these factors.
	- 考虑前面 $ n $ 个 binary RV 的例子，要求 joint distribution，其实就是要画一个 $ 2^n $ row 的真值表，我们称其为 "requiring $ 2^n - 1 $ parameters" (知道了 $ 2^n -1 $ 个概率，最后一个直接用 1 一减就可以了)。而用 factor 的话就可以减少 parameter 的量。
	
It turns out that these two perspectives — the graph as a representation of a set of independencies, and the graph as a skeleton for factorizing a distribution — are, in a deep sense, equivalent. The independence properties of the distribution are precisely what allow it to be represented compactly in a factorized form. Conversely, a particular factorization of the distribution guarantees that certain independencies hold.

#### 1.2.2 Representation, Inference, Learning

还是考虑前面 $ n $ 个 binary RV 的例子。In practice, variables tend to interact directly ONLY with very few others. 而 PGM 就是抓住了这一本质，不再需要计算 $ 2^n $ 个概率组合。从另一个角度来说，具有 "interact directly ONLY with very few others" 这一特点的 distribution 也适合用 PGM 来表示。

而用 PGM 来 encode distribution 的好处在于：

- The type of representation provided by this framework is _**transparent**_, in that a human expert can understand and evaluate its semantics and properties. This property is important for constructing models that provide an accurate reflection of our understanding of a domain.
- The same structure often also allows the distribution to be used effectively for _**inference**_ — answering queries using the distribution as our model of the world. In particular, we provide algorithms for computing the posterior probability of some variables given evidence on others.
- Third, this framework facilitates the effective construction of these models, whether by a human expert or automatically, by _**learning**_ from data a model that provides a good approximation to our past experience.

## 2. Foundations

### 2.1 Probability Theory

When we use the word “probability” in day-to-day life, we refer to a degree of confidence that an event of an uncertain nature will occur.

Formally, we define _**events**_ by event assuming that there is an agreed-upon space of possible outcomes, which we denote by $ \Omega $. In addition, we assume that there is a set of measurable events $ S $ to which we are willing to assign probabilities.

- 这里的概念有点乱。用我自己的话说：
	- $ S $ 是全集
	- 如果我们把空集也看做一个 event，那么 $ \Omega $ 就是另一个极端的 event (可以理解为 "出现任意 outcome" 的事件)
		- 我们称空集为 _**empty event**_ $ \varnothing $, 然后 the _**trivial event**_ $ \Omega $.
		- 比如 dice，$ \Omega = \lbrace 1,2,3,4,5,6 \rbrace $
		- $ P(\Omega) = 1 $
	- $ \varnothing \in S $ and $ \Omega \in S $
	- $ S $ 要满足 union，即 if $ \alpha, \beta \in S $, then $ \alpha \cup \beta \in S $
	- $ S $ 要满足 complementation，即 if $ \alpha \in S $, then $ \Omega - \alpha \in S $
	
_**Interpretations for probabilities:**_

- Frequentist:
	- When we discuss concrete physical systems (for example, dice, coin flips, and card games) we can envision how these frequencies are defined.
	- The frequentist interpretation fails, however, when we consider events such as “It will rain tomorrow afternoon.” We expect it to occur exactly once. It is not clear how we define the frequencies of such events.
- An alternative interpretation views probabilities as subjective degrees of belief.
	- This description still does not resolve what exactly it means to hold a particular degree of belief. What stops a person from stating that the probability that Bush will win the election is 0.6 and the probability that he will lose is 0.8? The source of the problem is that we need to explain how subjective degrees of beliefs (something that is internal to each one of us) are reflected in our actions.
		- 比如用 expectation 来判断是否值得投资。
		
_**Conditional Probability:**_

- $ P(\alpha | \beta) = \frac{P(\alpha \cap \beta)}{P(\beta)} $
- Chain Rule:
	- $ P(\alpha \cap \beta) = P(\alpha) P(\beta | \alpha) $
	- $ P(\alpha_1 \cap \dots \cap \alpha_k) = P(\alpha_1) P(\alpha_2 | \alpha_1) P(\alpha_3 | \alpha_1 \cap \alpha_2) \dots P(\alpha_k | \alpha_1 \cap \dots \cap \alpha_{k-1}) $
- Bayes’ Rule:
	- $ P(\alpha | \beta) = \frac{P(\beta | \alpha) P(\alpha)}{P(\beta)} $
		- The _**prior**_ is a probability distribution that represents your uncertainty over $ \theta $ before you have sampled any data and attempted to estimate it - usually denoted $ \pi(\theta) $.
		- The _**posterior**_ is a probability distribution representing your uncertainty over $ \theta $ after you have sampled data - denoted $ \pi(\theta|X) $. It is a conditional distribution because it conditions on the observed data.
		- $ \pi(\theta|X) = \frac{f(X|\theta)\pi(\theta)}{\sum_{\theta_i}{f(X|\theta_i)\pi(\theta_i)}} $ 
	- $ P(\alpha | \beta \cap \gamma) = \frac{P(\beta | \alpha \cap \gamma) P(\alpha | \gamma)}{P(\beta | \gamma)} $
		- 即 $ P(\alpha | \beta \cap \gamma) P(\beta | \gamma) = P(\beta | \alpha \cap \gamma) P(\alpha | \gamma) $, 两边同时乘以 $ P(\gamma) $ 即相等。
- 简写：$ P((X = x) \cap (Y = y)) = P(X = x, Y = y) = P(x, y) $

_**Marginal**_ and _**Joint Distribution:**_

- Marginal distribution of $ X $ is one over other random variables, denoted by $ P(X) $.
- Joint distribution of $ X,Y $ is one involving the values of the two random variables, denoted by $ P(X,Y) $
- The joint distribution of two random variables has to be consistent with the marginal distribution,
in that $ P(x) = \sum_{y}{P(x, y)} $.

_**Independence**_ and _**Conditional Independence:**_

- An event $ \alpha $ is independent of event $ \beta $ in $ P $, denoted $ P |= (\alpha \bot \beta) $, if and only if $ P(\alpha \cap \beta) = P(\alpha) P(\beta) $.
	- 我们也可以称 $ P $ satisfies $ (\alpha \bot \beta) $.
	- 此时也有 $ P(\alpha | \beta) = P(\alpha) $ or $ P(\beta) = 0 $.
- An event $ \alpha $ is independent of event $ \beta $ given event $ \gamma $ in $ P $, denoted $ P |= (\alpha \bot \beta | \gamma) $, if and only if $ P(\alpha \cap \beta | \gamma) = P(\alpha | \gamma) P(\beta | \gamma) $.
	- 我们也可以称 $ P $ satisfies $ (\alpha \bot \beta | \gamma) $.
	- 此时也有 $ P(\alpha | \beta \cap \gamma) = P(\alpha | \gamma) $ or $ P(\beta \cap \gamma) = 0 $.
	
_**Conditional Independence of Random Variables:**_

- Let $ X, Y, Z $ be sets of random variables. We say that $ X $ is conditionally independent of $ Y $ given $ Z $ in a distribution $ P $ if $ P $ satisfies $ (X = x \bot Y = y | Z = z) $ for all values $ x \in Val(X) $, $ y \in Val(Y) $, and $ z \in Val(Z) $. The variables in the set $ Z $ are often said to be _**observed**_. If the set $ Z $ is empty, then instead of writing $ (X \bot Y | \varnothing) $, we write $ (X \bot Y ) $ and say that $ X $ and $ Y $ are _**marginally independent**_.

<!-- -->

- 以下参考 [Wikipedia - Conditional independence](https://en.wikipedia.org/wiki/Conditional_independence)
- Let $ X, Y, Z, W $ be sets of random variables. Note: below, the comma can be read as an "AND".
- _**Symmetry:**_ 
	- $ X \bot Y \Rightarrow Y \bot X $
	- $ X \bot Y | Z \Rightarrow Y \bot X | Z $
- _**Decomposition:**_ 
	- $ X \bot Y,Z \Rightarrow \text{ and } \begin{cases} X \bot Y \\\\ X \bot Z \end{cases} $
		- $ \text{ and } $ 表示两个都成立，下同。
	- $ X \bot Y,Z | W \Rightarrow \text{ and } \begin{cases} X \bot Y | W \\\\ X \bot Z | W \end{cases} $
- _**Weak union:**_
	- $ X \bot Y,Z \Rightarrow \text{ and } \begin{cases} X \bot Y | Z \\\\ X \bot Z | Y \end{cases} $
	- $ X \bot Y,Z | W \Rightarrow \text{ and } \begin{cases} X \bot Y | Z,W \\\\ X \bot Z | Y,W \end{cases} $
- _**Contraction:**_
	- $ \left \. \begin{align} X \bot Y | Z \\\\ X \bot Z \end{align} \rbrace \text{ and } \Rightarrow X \bot Y,Z $
	- $ \left \. \begin{align} X \bot Y | Z,W \\\\ X \bot Z | W \end{align} \rbrace \text{ and } \Rightarrow X \bot Y,Z | W $
- _**Contraction-weak-union-decomposition:**_ Putting the above three together, we have
	- $ \left \. \begin{align}   X \bot Y | Z \\\\   X \bot Z \end{align} \rbrace \text{ and }  \iff X \bot Y,Z  \Rightarrow \text{ and } \begin{cases}   X \bot Y | Z \\\\   X \bot Z \\\\   X \bot Z | Y \\\\   X \bot Y \\\\ \end{cases} $ 
- _**Intersection:**_ For positive distributions, and for mutually disjoint sets $ X, Y, Z, W $
	- $ \left \. \begin{align}   X \bot Y | Z,W \\\\   X \bot Z | Y,W \end{align} \rbrace \text{ and } \Rightarrow X \bot Y,Z | W $
	
### P25 起暂时略过

- 2.1 Probability Theory
	- 2.1.5 Querying a Distribution
	- 2.1.6 Continuous Spaces
	- 2.1.7 Expectation and Variance
- 2.2 Graphs

## 3. The Bayesian Network Representation

### 3.1 Exploiting Independence Properties

还是考虑前面 $ n $ 个 binary RV 的例子。如果要画真值表，我们需要 $ 2^n $ 个 parameter，但是我们也可以用类似伯努利的形式来展现，比如 $ P(x_1,\dots,x_n) = \prod_{i}{\theta_{x_i}} $, 这时候我们只需要 $ n $ 个 parameter 了。我们称 "the space of all joint distributions specified in the factorized way above is an $ n $-dimensional _**manifold**_ in $ R^{2^n} $."

A key concept here is the notion of _**independent parameters**_ — parameters whose values are not determined by others. For example, when specifying an arbitrary multinomial distribution over a $ k $ dimensional space, we have $ k − 1 $ independent parameters: the last probability is fully determined by the first $ k − 1 $ ones. In the case where we have an arbitrary joint distribution over $ n $ binary random variables, the number of independent parameters is $ 2^n − 1 $. On the other hand, the number of independent parameters for distributions represented as $ n $ independent binomial coin tosses is $ n $. _**Therefore, the two spaces of distributions cannot be the same**_.

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

简单说，factor 就是真值表里数据的那一栏，比如 $ Factor(T,F) = x_1 $，那么 $ P(T,F) = \frac{x_1}{X} $。但是 factor 更精确的定义是一个函数，$ (T,F) \mapsto x_1 $ 只是其中的一个取值。对 factor 这个函数而言，所有可能的变量输入，比如 $ \lbrace (T,T),(T,F),(F,F),(F,T) \rbrace $ 称为 factor 的 scope

### P107: Definition 4.2 Factor Product

clique: 

- /ˈklɪk/
- In the social sciences, a clique is a group of people who interact with each other more regularly and intensely than others in the same setting.

### P111: Factor reduction

比如我们把 $ Factor(A,B,C) $ reduce 到 $ Factor(A,B,c_1) $，我们称 reduced to the _**context**_ $ C=c_1 $.

### P112: Factor reduction 的图示

其实 reduce 到某个 context，就是简单地把那个 vertex 从图里拿掉。

### 4.3 Markov Network Independencies

#### P114: Definition 4.8

Let $ H $ be a Markov network structure, and let $ X_1,\dots,X_k $ be a path in $ H $. Let $ Z \subseteq X $ be a set of observed variables. The path $ X_1,\dots,X_k $ is _**active**_ given $ Z $ if none of the $ X_i $ in $ X_1,\dots,X_k $ is in $ Z $.

active 的概念见 P108，就是 D-separation 的那个。

#### P115: Definition 4.9: separation

简化版本的定义：We say a set of node $ Z $ separates $ X $ and $ Y $ in a Markov network structure $ H $, if there is no active path between any node $ x \in X $ and $ y \in Y $ given $ Z $.

#### P117: Theorem 4.3

If $ X $ and $ Y $ are not separated given $ Z $ in $ H $, then $ X $ and $ Y $ are _**dependent**_ given $ Z $ in some distribution $ P $ that factorizes over $ H $.

举个例子，比如 $ X_1 - X_2 - X_3 - X_4 - X_1 $:

- $ X_1 - X_2 $ is active given $ \lbrace X_3, X_4 \rbrace $
	- $ \Rightarrow $ $ X_1 $ and $ X_2 $ is not separated by $ \lbrace X_3, X_4 \rbrace $
		- $ \Rightarrow $ $ X_1 $ and $ X_2 $ is dependent given $ \lbrace X_3, X_4 \rbrace $
			- $ \Rightarrow $ we don't have $ X_1 \bot X_2 | X_3, X_4 $
- There is no active path between $ X_1 $ and $ X_3 $ given $ \lbrace X_2, X_4 \rbrace $ because neither $ X_1 - X_2 - X_3 $ nor $ X_1 - X_4 - X_3 $ is active given $ \lbrace X_2, X_4 \rbrace $.
	- $ \Rightarrow $ $ X_1 $ and $ X_3 $ is separated by $ \lbrace X_2, X_4 \rbrace $
		- $ \Rightarrow $ $ X_1 $ and $ X_3 $ is independent given $ \lbrace X_2, X_4 \rbrace $
			- $ \Rightarrow $ we have $ X_1 \bot X_3 | X_2, X_4 $
			
#### P118 Definition 4.10

$ X_i \bot X_j \mid \chi - \lbrace X_i,X_j \rbrace $ if $ X_i - X_j \notin H $.

#### P118 Definition 4.11

$ X_i \bot \chi - \lbrace X_i \rbrace - nbr(X_i) \mid nbr(X_i) $.

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

比如 $ X_1 - X_2 - X_3 - X_4 $ 这个环，我们若是加一条 $ X_1 - X_3 $ 或是 $ X_2 - X_4 $，这条边就是 chord。

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
- leaf t-node associates with a distribution $ P(X) $
- iterior t-node associates with a variable $ Z \in parent(X) $
- a branch is a path from root to a leaf
- branch 上的所有 $ Z=z_i $ 的 assignment 我们称为 parent context

### P175 5.4.1 The Noisy-Or Model

P185 

Let $ P(Y | X_1, \dots, X_k) $ be a noisy-or CPD. Then for each $ i \neq j $, $ X_i $ is independent of $ X_j $ given $ Y = y_0 $.

### P179 Definition 5.9: logistic CPD

### P190 Definition 5.15: Conditional Linear Gaussian (CLG) CPD

### P191 Definition 5.17: Conditional Bayesian Network

The conditional random field (CRF)of section 4.6.1 is the undirected analogue of this definition.

## 8. The Exponential Family

global structures

- Bayesian networks 
- Markov networks

local structures 

- CPDs
- potentials

### 8.2 Exponential Families

Our discussion so far has focused on the representation of a single distribution (using, say, a Bayesian or Markov network). We now consider families of distributions. Intuitively, a family is a set of distributions that all share the same parametric form and differ only in choice of particular parameters.

We see that an exponential family is a concise representation of a class of probability distributions that share a similar functional form.

In fact, most of the parameterized distributions we encounter in probability textbooks can be represented as exponential families. This includes the Poisson distributions, exponential distributions, geometric distributions, Gamma distributions.

## 9. Exact Inference: Variable Elimination
	
### P296: Variable Elimination

### P298: Algorithm 9.1 Sum-product variable elimination algorithm

	P299: The basic idea in the algorithm is that we sum out variables one at a time. When we sum out any variable, we multiply all the factors that mention that variable, generating a product factor.
	
	P300: Example 9.1
	
## 10. Exact Inference: Clique Trees

### P346 

Figure 10.1 Cluster tree for the VE execution in table 9.1

### P347 Running Intersection Property

Let $ T $ be a cluster tree over a set of factors $ \Phi $. We say that $ T $ has the _**running intersection property**_ if $ \forall $ variable $ X $ that $ X \in C_a $ and $ X \in C_z $, $ X $ also $ \in $ every $ C_i $ that lies in the unique path between $ C_a $ and $ C_z $.

Let $ T $ be a cluster tree induced by a variable elimination algorithm over some set of factors $ \Phi $. Then $ T $ satisfies the running intersection property.

### P348 

Proposition 10.1

Definition 10.3: Clique Tree

A cluster tree that satisfies the running intersection property is called a _**clique tree**_ (sometimes also called a junction tree or a join tree). In the case of a clique tree, the clusters are also called cliques.

### P349 10.2.1.1: An Example

Figure 10.3 Two different message propagations with different root cliques in the Student clique tree

IMPORTANT!

### P356 Definition 10.4

$ C_i $ is ready to transmit to a neighbor $ C_j $ when $ C_i $ has messages from all of its neighbors except from $ C_j $.

When $ C_i $ is ready to transmit to $ C_j $, it can compute the message $ \theta_{i→j}(S_{i,j}) $ by multiplying its initial potential with all of its incoming messages except the one from $ C_j $, and then eliminate the variables in $ C_i − S_{i,j} $. In effect, this algorithm uses yet another layer of dynamic programming to avoid recomputing the same message multiple times.

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

That is, when we come to sampling a node $ X_i $ whose value has been observed, we simply set it to its observed value.

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

## 16. Learning Graphical Models: Overview

### 16.1 Motivation

In most of our discussions so far, our starting point has been a given graphical model. For example, in our discussions of conditional independencies and of inference, we assumed that the model — structure as well as parameters — was part of the input.

There are two approaches to the task of acquiring a model: 

- The first is to construct the network by hand, typically with the help of an expert.
- The second is to use data to learn a model of the distribution.
	- a.k.a _**model learning**_
	
P698 公式符号定义，IID

### 16.2 Goals of Learning

Our ideal solution is to return a model M~ that precisely captures the distribution P* from which our data were sampled. Unfortunately, this goal is not generally achievable, because of computational reasons and (more importantly) because a limited data set provides only a rough approximation of the true underlying distribution. 

In practice, the amount of data we have is rarely sufficient to obtain an accurate representation of a high-dimensional distribution involving many variables. Thus, we have to select M~ so as to construct the “best” approximation to M*. The notion of “best” depends on our goals. Different models will generally embody different trade-offs.

One approximate model may be better according to one performance metric but worse according to another. Therefore, to guide our development of learning algorithms, we must define the goals of our learning task and the corresponding metrics by which different results will be evaluated.

#### 16.2.1 Density Estimation

- expected log-likelihood
- likelihood of the data D, given a model M, i.e. $ P(D : M) $
- log-loss 

A graphical model can be used to answer a range of probabilistic inference queries. In this setting, we can formulate our learning goal as one of density estimation: constructing a model M~ such that P~ is “close” to the generating distribution P*.

How do we evaluate the quality of an approximation M~? One commonly used option is to use the relative entropy distance measure. Recall that this measure is zero when P~= P* and positive otherwise. Intuitively, it measures the extent of the compression loss (in bits) of using P~ rather than P*.

_**Problem:**_ we don't know P*. Otherwise we don't have to learn.
_**Solution:**_ expected log-likelihood. 简单理解就是计算 “p~ 与 p* 的差距”，如果 p~1 到 p* 的差距比 p~2 到 p* 的差距小，我们认为 p~1 是一个较好的 estimation.
	- 公式见 P699
	- 优点：Expected log-likelihood encodes our preference for models that assign high probability to instances sampled from P*. Intuitively, the higher the probability that M~ gives to points sampled from the true distribution, the more reflective it is of this distribution. 
	- 缺点：Although we can use the log-likelihood as a metric for comparing one learned model to another, we cannot evaluate a particular M ˜ in how close it is to the unknown optimum.
	
More generally, in our discussion of learning we will be interested in the likelihood of the data D, given a model M, which is $ P(D : M) $, or for convenience using the log-likelihood $ l(D : M) = \log P(D : M) $.

It is also customary to consider the negated form of the log-likelihood, called the log-loss. The log-loss reflects our cost (in bits) per instance of using the model P~. The log-loss is an example of a loss function. A loss function loss(ξ : M) measures the loss that a model M makes on a particular instance ξ. When instances are sampled from some distribution P* , our goal is to find a model that minimizes the expected loss, or the _**risk**_.

#### 16.2.2 Specific Prediction Tasks

P700 

classification

P701 

classification error == 0/1 loss

Hamming loss, instead of using the indicator function I{h(x) != y}, counts the number of variables Y in which h(x) differs from the ground truth y.

confidence of the prediction: conditional likelihood or conditional log-likelihood

#### 16.2.3 Knowledge Discovery

We may hope that an examination of the learned model can reveal some important properties of the domain: what are the direct and indirect dependencies, what characterizes the nature of the dependencies (for example, positive or negative correlation), and so forth.

### 16.3 Learning as Optimization

In many of the cases, we defined a numerical criterion — a loss function — that we would like to optimize. This perspective suggests that the learning task should be viewed as an optimization problem: we have a _**hypothesis space**_, that is, a set of candidate models, and an _**objective function**_, a criterion for quantifying our preference for different models.

#### 16.3.1 Empirical Risk and Overfitting

P703 empirical distribution (大数法则，趋近真实分布 P*，但是大数法则很难满足，所以经常有 overfitting)

Now, assume that we have a distribution over a probability space defined by 100 binary random variables, for a total of 2^100 possible joint assignments. If our data set D contains 1000 instances (most likely distinct from each other), the empirical distribution will give probability 0.001 to each of the assignments that appear in D, and probability 0 to all 2^100 − 1000 other assignments. While this example is obviously extreme, the phenomenon is quite general.

empirical risk == the loss on our training data

我们总在说 overfitting，但其实它的逻辑是 overfit the learned model to the training data

However, our goal is to answer queries about examples that were not in our training set. Thus, for example, in our medical diagnosis example, the patients to which the learned network will be applied are new patients, not the ones on whose data the network was trained. In our image-segmentation example, the model will be applied to new (unsegmented) images, not the (segmented) images on which the model was trained. Thus, it is critical that the network _**generalize**_ to perform well on unseen data.

If our hypothesis space is very limited, even with unlimited data, we may be unable to capture our true target distribution P*, and thereby remain with a suboptimal model. This type of limitation in a hypothesis space introduced inherent error in the result of the learning procedure, which is called _**bias**_, since the learning procedure is limited in how close it can approximate the target distribution.

Conversely, if we select a hypothesis space that is highly expressive, we are more likely to be able to represent correctly the target distribution P*. However, given a small data set, we may not have the ability to select the “right” model among the large number of models in the hypothesis space, many of which may provide equal or perhaps even better loss on our limited (and thereby unrepresentative) training set D. Intuitively, when we have a rich hypothesis space and limited number of samples, small random fluctuations in the choice of D can radically change the properties of the selected model, often resulting in models that have little relationship to P*. As a result, the learning procedure will suffer from a high _**variance**_ — running it on multiple data sets from the same P* will lead to highly variable results.

把 P* 想象成平面上的一个点，hypothesis space 是一个平面图形，data set 表示可以涂色的范围。如果我们的 hypothesis space 包含了 P* 而且 data set 刚好可以 train 到 P*，我们认为 data set 的涂色范围覆盖了 P*:

- 如果 hypothesis space 太小，可能你的平面图形都没有包含到 P*，此时不管怎么涂，都不可能涂到 P*。这种因为 hypothesis space 本身的局限性导致的 error，就是 bias
- 那么我们搞个大大的 hypothesis space 是不是就好了呢？也不一定，你的 data set 是有限的，所以在一个超大的 hypothesis space 里，data set A 可能只能涂左上角（此时你的最优 model 就是左上角离 P* 最近的那个），data set B 可能只能涂右下角（此时你的最优 model 就是右下角离 P* 最近的那个），随便换一组 data set，得到的 model 差距就会很大。这样的 error 就是 variance

解决 overfitting 的两大途径：

- With limited data, the error introduced by variance may be larger than the potential error introduced by bias. 所以我们 restrict hypothesis space 是一个可以考虑的折衷方案
- 途径二是 to change our training objective so as to incorporate a soft preference for simpler models. Thus, our learning objective will usually incorporate competing components: some components will tend to move us toward models that fit well with our observed data; others will provide _**regularization**_ that prevents us from taking the specifics of the data to extremes.

How to evaluate the performance of a given model, or a set of models, on unseen data?

- holdout testing
	- D = D_train + D_test
	- Because D_test is also sampled from P*, it provides us with an empirical estimate of the risk. Importantly, however, because D_test is disjoint from D_train, we are measuring our loss using instances that were unseen during the training, and not on ones for which we optimized our performance. Thus, this approach provides us with an unbiased estimate of the performance on new instances.
	- Naturally, the training set performance will be better, but if the difference is very large, we are probably overfitting to the training data and may want to consider a less expressive model class, or some other method for discouraging overfitting.
- cross validation == repeating rounds of holdout testing
	- Holdout testing poses a dilemma. To get better estimates of our performance, we want to increase the size of the test set. Such an increase, however, decreases the size of the training set, which results in degradation of quality of the learned model. When we have ample training data, we can find reasonable compromises between these two considerations. When we have few training samples, there is no good compromise, since decreasing either the training or the test set has large ramifications either on the quality of the learned model or the ability to evaluate it.
	- An alternative solution is to attempt to use available data for both training and testing. Put simply, to repeat rounds of holdout testing. A commonly used procedure is k-fold cross-validation.
	- 进一步发展成 training set、test set 和 validation set

"Goodness of Fit" tests: After learning the parameters, we have a hypothesis about a distribution that generated the data. Now we can ask whether the data behave as though they were sampled from this distribution. To do this, we compare properties (比如 mean 和 variance？) of the training data set to properties of simulated data sets of the same size that we generate according to the learned distribution. If the training data behave in a manner that deviates significantly from what we observed in the majority of the simulations, we have reason to believe that the data were not generated from the learned distribution.

P709 PAC-bounds

#### 16.3.2 Discriminative versus Generative Training

In the previous discussion, we implicitly assumed that our goal is to get the learned model M~ to be a good approximation to P*. However, as we discussed in section 16.2.2, we often know in advance that we want the model to perform well on a particular task, such as predicting Y from X. The training regime that we described would aim to get M~ close to the overall joint distribution P(Y,X). This type of objective is known as _**generative training**_, because we are training the model to generate all of the variables, both the ones that we care to predict and the features that we use for the prediction. Alternatively, we can train the model _**discriminatively**_, where our goal is to get P~(Y|X) to be close to P*(Y|X). The same model class can be trained in these two different ways, producing different results.

As the simplest example, consider a simple “star” Markov network structure with a single target variable Y connected by edges to each of a set of features X1, . . . , Xn. If we train the model generatively, we are learning a naive Markov model, which, because the network is singly connected, is equivalent to a naive Bayes model. On the other hand, we can train the same network structure discriminatively, to obtain a good fit to P*(Y | X1, . . . , Xn). In this case, as we showed in example 4.20, we are learning a model that is a logistic regression model for Y given its features.

- Generatively learned models can still be used for specific prediction tasks.
- Discriminative training is usually performed in the context of undirected models. In this setting, we are essentially training a _**conditional random field (CRF)**_, as in section 4.6.1: a model that directly encodes a conditional distribution P(Y|X).

Trade-offs between generative and discriminative training:

- Generally speaking, generative models have a higher bias — they make more assumptions about the form of the distribution.
	- 但是从另外一个角度来说，hypothesis space 比较小，有助于防止 overfitting
- Discriminative models make fewer assumptions, they will tend to be less affected by incorrect model assumptions and will often outperform the generatively trained models for larger data sets

P711 Example 16.2 optical character recognition: 256 pixels as features, recognize the letter (A-Z)

- generative model: naive Bayes (or Markov)
	- 26 models, one for each letter
	- 256 parameter
- discriminative model: logistic regression
	- jointly optimizing all of the approximately 26 × 256 parameters of the multinomial logit distribution, a much higher-dimensional estimation problem
- Thus, for sparse data, the naive Bayes model may often perform better.
- However, even in this simple setting, the independence assumption made by the naive Bayes model — that pixels are independent given the image label — is clearly false. Thus, as we get enough data to fit the logistic model reasonably well, we would expect it to perform better.

### 16.4 Learning Tasks

The input of a learning procedure is:

- Some prior knowledge or constraints about M~
- A set D of data instances {d[1], . . . , d[M]}, which are independent and identically distributed (IID) samples from P*.

The output is: 

- A model M~, which may include the structure, the parameters, or both.

There are many variants of this fairly abstract learning problem; roughly speaking, they vary
along three axes:

- Axis 1: output
	- The problem formulation, i.e. the type of graphical model we are trying to learn, depends on our output. E.g. shall we learn a Bayesian network or a Markov network? (Model Constraints)
- Axis 2&3: input
	- The constraints that we are given about M~ (Model Constraints)
	- The extent to which the data in our training set are fully observed (Data Observability)
	
#### 16.4.1 Model Constraints

Question: to what extent does our input constrain the hypothesis space, i.e. the class of models that we are allowed to consider as possible outputs of our learning algorithm.

Possible situations:

- At one extreme, we may be given a graph structure, and we have to learn only (some of) the parameters.
- We may not know the structure, and we have to learn both parameters and structure from the data.
- Even worse, we may not even know the complete set of variables over which the distribution P* is defined. In other words, we may only observe some subset of the variables in the domain and possibly be unaware of others.

The less prior knowledge we are given, the larger the hypothesis space, and the more possibilities we need to consider when selecting a model.

As we discussed in section 16.3.1, the complexity of the hypothesis space defines several important trade-offs. 

- Statistical trade-off:
	- If we restrict the hypothesis space too much, it may be unable to represent P* adequately. 
	- Conversely, if we leave it too flexible, our chances increase of finding a model within the hypothesis space that accidentally has high score but is a poor fit to P*. 
- Computational trade-off: 
	- In many cases (although not always), the richer the hypothesis space, the more difficult the search to find a high-scoring model.
	
#### 16.4.2 Data Observability

Possible situations:

- _**Complete Data:**_ The data are complete, or fully observed, so that each of our training instances d[m] is a full instantiation to all of the variables in X*.
- _**Incomplete Data:**_ The data are incomplete, or partially observed, so that, in each training instance, some variables are not observed.
- _**Hidden Variable:**_ The data contain hidden variable whose value is never observed in any training instance.

When data are unobserved, we must hypothesize possible values for these variables. The greater the extent to which data are missing, the less we are able to hypothesize reliably values for the missing entries.

P713 mixture distribution

P714 Figure 16.1 Introducing a hidden variable in the network can actually greatly simplify the structure!

#### 16.4.3 Taxonomy of Learning Tasks

- For a known structure, parameter estimation is a numerical optimization problem 
	- For a fixed structure and complete data, the optimization problem is convex
- When the structure is not given, the problem of structure selection is also formulated as a convex optimization problem, where different network structures are given a score, and we aim to find the network whose score is highest.
- The problem of dealing with incomplete data is much more significant. Here, the multiple hypotheses regarding the values of the unobserved variables give rise to a combinatorial range of different alternative models, and induce a nonconvex, multimodal optimization problem even in parameter space. The known algorithms generally work by iteratively using the current parameters to fill in values for the missing data, and then using the completion to reestimate the model parameters. This process requires multiple calls to inference as a subroutine, making this process expensive for large networks. The case where the structure is not known is even harder, since we need to combine a discrete search over network structure with nonconvex optimization over parameter space.

## 17. Parameter Estimation

In this chapter, we discuss the problem of estimating parameters for a Bayesian network. We assume that the network structure is fixed and that our data set D consists of fully observed instances of the network variables: D = {ξ[1], . . . , ξ[M]}.

two main approaches:

- maximum likelihood estimation
- Bayesian approaches

### 17.1 Maximum Likelihood Estimation

#### 17.1.1 The Thumbtack Example

P719 

MLE: maximum likelihood estimator

log-likelihood

confidence interval

#### 17.1.2 The Maximum Likelihood Principle

We then consider how to apply it to the task of learning the parameters of a Bayesian network.

P720 符号定义

parametric model: P(ξ:θ), i.e. given a particular set of parameter values θ and an instance ξ of X, the model assigns a probability (or density) to ξ

parameter space: Θ, 合法的 θ 的取值范围，比如 toss coin 的 Θ = {head, tail} = {0,1}

Example 17.1: multinomial model 的表示法

Example 17.2： Gaussian model

P721

likelihood function: L(θ : D) = \prod_{m} P(ξ[m] : θ)

sufficient statistic

sufficient statistic for multinomial model

sufficient statistic for Gaussian model

P722

Maximum Likelihood Estimation: Given a data set D, choose parameters ˆθ that satisfy L(ˆθ : D) = max L(θ : D), θ∈Θ.

### 17.2 MLE for Bayesian Networks

It turns out that the structure of the Bayesian network allows us to reduce the parameter estimation problem to a set of unrelated problems, each of which can be addressed using the techniques of the previous section

#### 17.2.1 A Simple Example

一个超简单的例子，X → Y。

P723 符号定义。

Parameter 包括：

- P(X=1) P(X=0)
- P(Y=1|X=1) P(Y=1|X=0) P(Y=0|X=1) P(Y=0|X=0)
- 改用 θ 表示

Each training instance is a tuple <x[m], y[m]> that describes a particular assignment to X and Y

L(θ : D) = \prod^{M}_{m=1} P(x[m], y[m] : θ) 
		= \prod^{M}_{m=1} P(x[m] : θ) P(y[m] | x[m] : θ)
		= {prod^{M}_{m=1} P(x[m] : θ)} {prod^{M}_{m=1} P(y[m] | x[m] : θ)}

That is, the likelihood decomposes into two separate terms, one for each variable. Moreover, each of these terms is a local likelihood function that measures how well the variable is predicted given its parents.

P724 likelihood decomposability

Thus, we can find the maximum likelihood parameters in this CPD by simply counting how many times each of the possible assignments of X and Y appears in the training data. 所以用 Identity 函数就可以了。

#### 17.2.2 Global Likelihood Decomposition

更 general 一点，写成 P(X|Par(X)) 的形式 

#### 17.2.3 Table-CPDs

Based on the preceding discussion, we know that the likelihood of a Bayesian network decomposes into local terms that depend on the parameterization of CPDs. The choice of parameters determines how we can maximize each of the local likelihood functions. We now consider what is perhaps the simplest parameterization of the CPD: a table-CPD.

P726 data fragmentation and overfitting

P727 Naive Bayes Classifier

#### 17.2.4 Gaussian Bayesian Networks *

Global Likelihood Decomposition 仍然适用，只是后面小步骤的计算方法有点变化

P730

Nonparametric Models: where a (conditional) distribution is not defined to be in some particular parametric class with a fixed number of parameters, but rather the complexity of the representation is allowed to grow as we get more data instances. 意思是我们没有假设 CPD 是什么分布然后再去估计参数，而是直接根据 dataset 的值去计算 CPD，比如用 kernel density estimation

kernel density estimation (很有用！)

#### 17.2.5 Maximum Likelihood Estimation as M-Projection *

### 17.3 Bayesian Parameter Estimation

#### 17.3.1 The Thumbtack Example Revisited

Although the MLE approach seems plausible, it can be overly simplistic in many cases. Assume again that we perform the thumbtack experiment and get 3 heads out of 10. It may be quite reasonable to conclude that the parameter θ is 0.3. But what if we do the same experiment with a standard coin, and we also get 3 heads? We would be much less likely to jump to the conclusion that the parameter of the coin is 0.3. Why? Because we have a lot more experience with tossing coins, so we have a lot more prior knowledge about their behavior. Note that we do not want our prior knowledge to be an absolute guide, but rather a reasonable starting assumption that allows us to counterbalance our current set of 10 tosses, under the assumption that they may not be typical. However, if we observe 1,000,000 tosses of the coin, of which 300,000 came out heads, then we may be more willing to conclude that this is a trick coin, one whose parameter is closer to 0.3.

Maximum likelihood allows us to make neither of these distinctions: between a thumbtack and a coin, and between 10 tosses and 1,000,000 tosses of the coin. There is, however, another approach, the one recommended by Bayesian statistics.

##### 17.3.1.1 Joint Probabilistic Model

In this approach, we encode our prior knowledge about θ with a probability distribution; this distribution represents how likely we are a priori to believe the different choices of parameters. Once we quantify our knowledge (or lack thereof) about possible values of θ, we can create a joint distribution over the parameter θ and the data cases that we are about to observe X[1], . . . , X[M]. This joint distribution captures our assumptions about the experiment.

简单说就是从 P(ξ[m] : θ) 变成了 P(ξ[m] | θ)

P(θ) 称为 prior distribution (over θ)

P(θ | x[1], . . . , x[M]) = P(x[1], . . . , x[M] | θ) P(θ) / P(x[1], . . . , x[M]) 称为 posterior distribution (over θ) 

We see that the posterior is (proportional to) a product of the likelihood and the prior.

##### 17.3.1.2 Prediction

Instead of selecting from the posterior a single value for the parameter θ, we use it, in its entirety, for predicting the probability over the next toss.

We introduce the value of the next coin toss x[M + 1] to our network. We can then compute the probability over x[M + 1] given the observations of the first M tosses.

Bayesian estimator 计算方法见 P735

Clearly, as the number of samples grows, the Bayesian estimator and the MLE estimator converge to the same value.

P735 Laplace’s correction 

##### 17.3.1.3 Priors

P735 Beta distribution, Beta hyperparameters, Gamma function

P737

If the prior is a Beta distribution, then the posterior distribution, that is, the prior conditioned on the evidence, is also a Beta distribution. In this case, we say that the Beta  distribution is conjugate to the Bernoulli likelihood function (see definition 17.4).

Suppose we observe 3 heads in 10 tosses:

- Prior 1: Beta(1,1) => P(X[11]=1) = (3+1) / (10+1+1) = 1/3
- Prior 2: Beta(10,10) => P(X[11]=1) = (3+10) / (10+10+10) = 13/30 => better prediction

#### 17.3.2 Priors and Posteriors

We now turn to examine in more detail the Bayesian approach to dealing with unknown parameters. We start with a discussion of the general principle and deal with the case of Bayesian networks in the next section.

P737 point estimate and belief

P737 marginal likelihood

P738

Since the posterior is a product of the prior and the likelihood, it seems natural to require that the prior also have a form similar to the likelihood. One such prior is the Dirichlet distribution. If we use a Dirichlet prior, then the posterior is also Dirichlet.

P739

Definition 17.4 conjugate prior

Dirichlet priors are conjugate to the multinomial model

We can easily update our beliefs about θ after observing a set of instances D. This update process results in a posterior that combines our prior knowledge and our observations

- We can use the posterior to determine properties of the model at hand. For example, to assess our beliefs that a coin we experimented with is biased toward heads, we might compute the posterior probability that θ > t for some threshold t, say 0.6.
- Another use of the posterior is to predict the probability of future examples.

Proposition 17.4 Let P(θ) be a Dirichlet distribution with hyperparameters α1, . . . , αk, and α = \sum_{j} αj, then E[θk] = αk / α.

P740

Dirichlet hyperparameters are often called pseudo-counts.

equivalent sample size

mean prediction

improper prior

The difference between the Bayesian estimate and the MLE estimate arises when M is not too large, and α is not close to 0. In these situations, the Bayesian estimate is “biased” toward the prior probability θ', where θ' = {θ_k : k = 1, . . . , K} is a distribution describing the mean prediction of our prior.

P741 Figure 17.5  Example 17.7

This smoothing effect results in more robust estimates when we do not have enough data to reach definite conclusions. In general, it is a bad idea to have extreme estimates (ones where some of the parameters are close to 0), since these might assign too small probability to new instances we later observe. In particular, as we already discussed, probability estimates that are actually 0 are dangerous, since no amount of evidence can change them. Thus, if we are unsure about our estimates, it is better to bias them away from extreme estimates. The MLE estimate, on the other hand, often assigns probability 0 to values that were not observed in the training data

### 17.4 Bayesian Parameter Estimation in Bayesian Networks

We now turn to Bayesian estimation in the context of a Bayesian network.

#### 17.4.1 Parameter Independence and Global Decomposition

##### 17.4.1.1 A Simple Example

In addition, the network structure in figure 17.7 embodies the assumption that the priors for the individual parameters variables are a priori independent. That is, we believe that knowing the value of one parameter tells us nothing about another. 我们称 prior P(θ) 满足 global parameter independence.

- This assumption may not be suitable for all domains.

If we accept global parameter independence, we can conclude that complete data d-separates the parameters for different CPDs. 

θ_X → X[m] → Y [m] ← θ_{Y|X}

=> so that the observation of x[m] blocks the path. Thus, if these two parameter variables are independent a priori, they are also independent a posteriori

=> P(θ_X, θ_{Y|X} | D) = P(θ_X | D) P(θ_{Y|X} | D)

This is the analogous result to the likelihood decomposition for MLE estimation of section 17.2.2.

##### 17.4.1.2 General Networks

P744 marginal likelihood

As we discussed in section 17.2, we can decompose the likelihood into local likelihoods. => 公式1

Moreover, if we assume that we have global parameter independence. => 公式2

Combining these two decompositions, we see that => 公式3，P(X|Par(X)) 的形式 

##### 17.4.1.3 Prediction

#### 17.4.3 Priors for Bayesian Network Learning

#### 17.4.4 MAP Estimation *

MAP: maximum a posteriori estimation. Here, we search for parameters that maximize the posterior probability

P752 Box 17.D — Concept: Representation Independence

### 17.6 Generalization Analysis *

## 19 Partially Observed Data

### 19.1 Foundations

#### 19.1.1 Likelihood of Data and Observation Models

P851 

observability variable: $ O_X $, which tells us whether we observed the value of X
observability model

我们可以把 missing $ Y $ 转移为 introducing $ O_X $

#### 19.1.2 Decoupling of Observation Mechanism

P853 MCAR: Missing Completely At Random

P854 MAR: Missing At Random

#### 19.1.3 The Likelihood Function

Under the assumption of MAR, we can continue to use the likelihood function in the same roles.

#### 19.1.4 Identifiability

Another issue that arises in the context of missing data is our ability to identify uniquely a model from the data. 

P861 

identifiable variable
identifiable model

In other words, a model is identifiable if each choice of parameters implies a different distribution over the observed variables

Nonidentifiability implies that there are parameter settings that are indistinguishable given the data, and therefore cannot be identified from the data. 

- Usually this is a sign that the parameterization is redundant with respect to the actual observations. 
- Another source of nonidentifiability arises in from hidden variables
	- This type of unidentifiability exists in any model where we have hidden variables we never observe

P862 

locally identifiable variable
locally identifiable model

In other words, a model is locally identifiable if each choice of parameters defines a distribution that is different than the distribution of neighboring parameterization in a sufficiently small neighborhood. 

- This definition implies that, from a local perspective, the model is identifiable.

### 19.2 Parameter Estimation

As with complete data, we consider two approaches to estimation, 

- maximum likelihood estimation (MLE), and 
- Bayesian estimation

P862 IMPORTANT!

MLE for incomplete data:

- As we discussed, in the presence of incomplete data, the likelihood does not decompose. 
- And so the problem requires optimizing a highly nonlinear and multimodal function over a high-dimensional space (one consisting of parameter assignments to all CPDs). 
- There are two main classes of methods for performing this optimization:
	- a generic nonconvex optimization algorithm, such as gradient ascent; and 
	- expectation maximization, a more specialized approach for optimizing likelihood functions 

#### 19.2.1 Gradient Ascent

P863 概率的偏导计算

#### 19.2.1.2 An Example

P865 一个例题

#### 19.2.1.3 Gradient Ascent Algorithm

### 19.2.2 Expectation Maximization (EM)

#### 19.2.2.1 Intuition

P869 data imputation

The problem with data imputation is that the procedure we use for filling in the missing values introduces a bias that will be reflected in the parameters we learn。

- For example, if we fill all missing values with false, then our estimate will be skewed toward higher (conditional) probability of false. 
- Similarly, if we use a randomized procedure for filling in values, then the probabilities we estimate will be skewed toward the distribution from which we sample missing values. 
- Moreover, when we consider learning with hidden variables, it is clear that an imputation procedure will not help us. The values we fill in for the hidden variable are conditionally independent from the values of the other variables, and thus, using the imputed values, we will not learn any dependencies between the hidden variable and the other variables in the network.

A different approach to filling in data takes the perspective that, when learning with missing data, we are actually trying to solve two problems at once: learning the parameters, and hypothesizing values for the unobserved variables in each of the data cases. Each of these tasks is fairly easy when we have the solution to the other. Given complete data, we have the statistics, and we can estimate parameters using the MLE formulas we discussed in chapter 17. Conversely, given a choice of parameters, we can use probabilistic inference to hypothesize the likely values (or the distribution over possible values) for unobserved variables. Unfortunately, because we have neither, the problem is difficult. 

The EM algorithm solves this “chicken and egg” problem using a bootstrap approach. The EM algorithm solves this “chicken and egg” problem using a bootstrap approach. We start out with some arbitrary starting point. This can be either a choice of parameters, or some initial assignment to the hidden variables; these assignments can be either random, or selected using some heuristic approach. Assuming, for concreteness, that we begin with a parameter assignment, the algorithm then repeats two steps. First, we use our current parameters to complete the data, using probabilistic inference. We then treat the completed data as if it were observed and learn a new set of parameters

#### 19.2.2.2 An Example

P870 一个例题

#### 19.2.2.3 The EM Algorithm for Bayesian Networks

P874 General Exponential Family

#### 19.2.2.4 Bayesian Clustering Using EM

The Bayesian clustering paradigm views this task as a learning problem with a single hidden variable C that denotes the category or class from which an instance comes.

class-conditional distribution $ P(x|c) $

Overall, this approach views the data as coming from a mixture distribution and attempts to use the hidden variable to separate out the mixture into its components

#### 19.2.2.5 Theoretical Foundations *

公式演算

#### 19.2.2.6 Hard-Assignment EM

P885 Box 19.B — Case Study: EM in Practice.

### 19.2.3 Comparison: Gradient Ascent versus EM

- Both algorithms are _**local**_ in nature. 
	- At each iteration they maintain a “current” set of parameters, and use these to find the next set. 
- Moreover, both perform some version of greedy optimization based on the current point. 
	- Gradient ascent attempts to progress in the steepest direction from the current point.
	- EM performs a greedy step in improving its target function given the local parameters.
- Finally, both algorithms provide a guarantee to converge to local maxima (or, more precisely, to stationary points where the gradient is 0).

更多内容见书上

P888 Box 19.C — Skill: Practical Considerations in Parameter Learning 

IMPORTANT!

- Local Maxima
- Stopping Criteria
- Accelerating Convergence

P892 Box 19.D — Case Study: EM for Robot Mapping

### 19.2.4 Approximate Inference *

## 19.3 Bayesian Learning with Incomplete Data *

### 19.3.1 Overview

P898 MAP estimation

### 19.3.2 MCMC Sampling

MCMC sampling 在 12.3 讲的，这里只是讲用来处理 incomplete data 的用法

#### 19.3.2.1 Gibbs Sampling

One of the simplest MCMC strategies for complex multivariable chains is Gibbs sampling.

P900 

Gamma distribution
Gamma -> Dirichlet

If U ~ Unif([0 : 1]), then −lnU ~ Gamma(1, 1)

#### 19.3.2.2 Collapsed MCMC

#### 19.3.3 Variational Bayesian Learning

### 19.4 Structure Learning

（等看过 18 章再回头看）

### 19.5 Learning Models with Hidden Variables

- When should we consider introducing a hidden variable? 
- Where in the network should we connect it? 
- How many values should we allow it to have?

#### 19.5.1 Information Content of Hidden Variables

#### 19.5.2 Determining the Cardinality

##### 19.5.2.1 Model Selection for Cardinality

P928 model selection

##### 19.5.2.2 Dirichlet Processes

P928 Bayesian model averaging

#### 19.5.3 Introducing Hidden Variables

P931 

hierarchical organization
overlapping organization

## 20 Learning Undirected Models

### 20.1 Overview

### 20.2 The Likelihood Function

In this section, we discuss the form of the likelihood function for Markov networks, its properties, and their computational implications.

#### 20.2.1 An Example

P944 A simple example: A-B-C

P945 公式推导

Z is the _**parition function**_ that ensures that the distribution sums up to one

Thus, lnZ(θ) is a function of both φ1 and φ2. As a consequence, it _**couples**_ the two potentials in the likelihood function.

In the case of Bayesian networks, we could estimate each conditional distribution independently of the other ones. Here, however, when we change one of the potentials, say φ1, the partition function changes, possibly changing the value of φ2 that maximizes −lnZ(θ). Indeed, as illustrated in figure 20.1, the log-likelihood function in our simple example shows clear dependencies between the two potentials.

#### 20.2.2 Form of the Likelihood Function

P946 a more general description of the likelihood function

#### 20.2.3 Properties of the Likelihood Function

P947 lnZ(θ) is convex => proof

its complement (−lnZ(θ)) is concave

The sum of a linear function and a concave function is concave => The Markov Network log-likelihood function is concave

- This result implies that the log-likelihood is unimodal and therefore has no local optima. It does not, however, imply the uniqueness of the global optimum.
- There is a unique globally optimal value for the log-likelihood function, but not necessarily a unique solution.
	- In general, because the function is concave, we are guaranteed that there is a convex region of continuous global optima.

### 20.3 Maximum (Conditional) Likelihood Parameter Estimation

#### 20.3.1 Maximum Likelihood Estimation

P949 gradient 公式推导

moment matching

Unfortunately, although the function is concave, there is no analytical form for 􀀀 its maximum. Thus, we must resort to iterative methods that search for the global optimum. Most commonly used are the gradient ascent methods reviewed in appendix A.5.2, which iteratively take steps in parameter space to improve the objective

an exact formula for the gradient: the difference between the feature’s empirical count in the data and its expected count relative to our current parameterization θ

- However, this discussion ignores one important aspect: the computation of the expected counts.
- A full inference step is required at every iteration of the gradient ascent procedure.
	- Because inference is almost always costly in time and space, the computational cost of parameter estimation in Markov networks is usually high, sometimes prohibitively so. 
	- In section 20.5 we return to this issue, considering the use of approximate methods that reduce the computational burden.

In practice, standard gradient ascent is not a particularly good algorithm, both because of its slow convergence rate and because of its sensitivity to the step size. 

- Much faster convergence is obtained with second-order methods, which utilize the Hessian to provide a quadratic approximation to the function。
- To compute the Hessian, we must compute the joint expectation of two features, a task that is often computationally infeasible. Currently, one commonly used solution is the L-BFGS algorithm, a gradient-based algorithm that uses line search to avoid computing the Hessian (see appendix A.5.2 for some background)

#### 20.3.2 Conditionally Trained Models

As we discussed in section 16.3.2, we often want to use a Markov network to perform a particular inference task, where we have a known set of observed variables, or features, X, and a predetermined set of variables, Y , that we want to query. In this case, we may prefer to discriminative use discriminative training, where we train the network as a conditional random field (CRF) that  encodes a conditional distribution P(Y | X).

P951 CRF log-conditional-likelihood 公式

Each of the terms ln P(y[1, . . . , M] | x[1, . . . , M], θ) is a log-likelihood of a Markov network model with a different set of factors — the factors in the original network, reduced by the observation x[1, . . . , M] — and its own partition function. Each term is thereby a concave function, and because the sum of concave functions is concave, we conclude:

> The log conditional likelihood of equation (20.6) is a concave function

- As for corollary 20.1, this result implies that the function has a global optimum and no local optima, but not that the global optimum is unique

Whereas in the unconditional case, each gradient step required only a single execution of inference, when training a CRF, we must (in general) execute inference for every single data case, conditioning on x[m].

Discriminative training can be particularly beneficial in cases where the domain of X is very large or even infinite.

P952 Box 20.A — Concept: Generative and Discriminative Models for Sequence Labeling

IMPORTANT! 很好的一个例子

HMM vs MEMM vs CRF

- In cases where we have many correlated features, discriminative models are probably better; but, if only limited data are available, the stronger bias of the generative model may dominate and allow learning with fewer samples. Among the discriminative models, MEMMs should probably be avoided in cases where many transitions are close to deterministic. In many cases, CRFs are likely to be a safer choice, but the computational cost may be prohibitive for large data sets

#### 20.3.3 Learning with Missing Data

(Skip)

#### 20.3.4 Maximum Entropy and Maximum Likelihood *

We now return to the case of basic maximum likelihood estimation, in order to derive an alternative formulation that provides significant insight. In particular, we now use theorem 20.1 to relate maximum likelihood estimation in log-linear models to another important class or problems examined in statistics: the problem of finding the distribution of maximum entropy subject to a set of constraints.

Maximum Entropy 和 Maximum Likelihood 的解其实是一样的，我们可以认为这两个问题是 duality

### 20.4 Parameter Priors and Regularization

As we discussed in chapter 17, maximum likelihood estimation (MLE) is prone to overfitting to the training data. As for Bayesian networks, we can reduce the effect of overfitting by introducing a prior distribution P(θ) over the model parameters. It is not generally feasible in Markov networks. However, we can aim to perform MAP estimation — to find the parameters MAP estimation that maximize P(θ) P(D|θ).

#### 20.4.1 Local Priors

P958 Gaussian => L2-regularization

P959 Laplacian distribution => L1-regularization

Recall from our discussion in section 17.3 that a prior often serves to pull the distribution toward an “uninformed” one, smoothing out fluctuations in the data

In the Gaussian case, the penalty grows quadratically with the parameter magnitude, implying that an increase in magnitude in a large parameter is penalized more than a similar increase in a small parameter. For example, an increase in θi from 0 to 0.1 is penalized less than an increase from 3 to 3.1

In the Laplacian case, the penalty is linear in the parameter magnitude, so that the penalty growth is invariant over the entire range of parameter values. In the quadratic case, as the parameters get close to 0, the effect of the
penalty diminishes. Hence, the models that optimize the penalized likelihood tend to have many
small weights.

The models learned with an L1 penalty tend to be much sparser than those learned with an L2 penalty, with many parameter weights achieving a value of 0. From a structural perspective, this effect gives rise to models with fewer edges and sparser potentials, which are potentially much more tractable

Importantly, both the L1 and L2 regularization terms are concave. 

Moreover, the introduction of these penalty terms serves to reduce or even eliminate multiple (equivalent) optima that arise when the parameterization of the network is redundant.

- The penalty term drives the parameters toward zero, giving rise to the unique optimum θ = 0. 
- Although one can still construct examples where multiple optima occur, they are very rare in practice.

A prior is simply a reflection of our beliefs.

#### 20.4.2 Global Priors

### 20.5 Learning with Approximate Inference

In many real-life applications the structure of the network does not allow for exact computation of these terms.

The simplest approach for learning in intractable networks is to apply the learning procedure (say, conjugate gradient ascent) using an approximate inference procedure to compute the required queries about the distribution P_θ.

In particular, nonconvergence of the inference method, or convergence to approximate answers, can lead to inaccurate and even oscillating estimates of the gradient, potentially harming convergence of the overall learning algorithm. This type of situation can arise both in particle-based methods (say MCMC sampling) and in global algorithms such as belief propagation. In this section, we describe several methods that better integrate the inference into the learning outer loop in order to reduce problems such as this.

A second approach for dealing with inference-induced costs is to come up with alternative (possibly approximate) objective functions whose optimization does not require (as much) inference. => 20.6

Approximately optimizing the likelihood objective by using an approximate inference algorithm to compute the gradient can often be reformulated as exactly optimizing an approximate objective.

Importantly, while we describe the methods in this section relative to the plain likelihood objective, they apply almost without change to the generalizations and extensions we describe in this chapter: conditional Markov networks; parameter priors and regularization; structure learning; and learning with missing data.

#### 20.5.1 Belief Propagation

##### 20.5.1.1 Pseudo-moment Matching

##### 20.5.1.2 Belief Propagation and Entropy Approximations *

##### 20.5.1.3 Sampling-Based Learning *

P966 importance sampling => 12.2.2

How do we use this approximation? One possible strategy is to iterate between two steps. In one we run a sampling procedure, such as MCMC, to generate samples from the current parameter set θ_t. Then in the second iteration we use some gradient procedure to find θ_{t+1} that improve the approximate log-likelihood based on these samples. We can then regenerate samples and repeat the process. As the samples are regenerated from a new distribution, we can hope that they are generated from a distribution not too far from the one we are currently optimizing, maintaining a reasonable approximation.

#### 20.5.2 MAP-Based Learning *

ξMAP(θ) = argmaxξ P(ξ | θ) is the MAP assignment given the current set of parameters θ. This approach is also called Viterbi training.

P968 Box 20.B — Case Study: CRFs for Protein Structure Prediction







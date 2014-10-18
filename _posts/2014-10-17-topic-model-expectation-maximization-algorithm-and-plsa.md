---
layout: post-mathjax
title: "Topic Model, Expectation-Maximization Algorithm and PLSA"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

我这篇本来只想科普下 EM 的，查资料的过程中看到 Topic Model 和 PLSA，就顺便扯进来了。

总结自：

* wikipedia
* [EM(expectation maximization)理解以及推导过程](http://blog.csdn.net/hxxiaopei/article/details/7612068)
* [（EM算法）The EM Algorithm](http://www.cnblogs.com/jerrylead/archive/2011/04/06/2006936.html)
* [[学习笔记]学习主题模型(Topic Model)和PLSA(probabilistic latent semantic analysis)](http://blog.csdn.net/hxxiaopei/article/details/7617838)
* [Probabilistic Latent Semantic Analysis](http://www.inf.ed.ac.uk/teaching/courses/dme/studpres0809/damianou_pavlopoulos.pdf)

-----

## 1. Latent Variables

* latent: [ˈleɪtnt], Existing but concealed or inactive
	* He has a latent talent for acting that he hasn't had a chance to express yet
	* &lt;a latent infection&gt;
	
In statistics, latent variables (or _hidden variables_), as opposed to _observable variables_), are variables that are not directly observed but are rather inferred (through a mathematical model) from other variables that are observed (directly measured). Mathematical models that aim to explain observed variables in terms of latent variables are called _latent variable models_.  

Sometimes latent variables correspond to aspects of physical reality, which could in principle be measured, but may not be for practical reasons. In this situation, the term **hidden variables** is commonly used (reflecting the fact that the variables are "really there", but hidden). Other times, latent variables correspond to abstract concepts, like categories, behavioral or mental states, or data structures. The terms **hypothetical variables** or **hypothetical constructs** may be used in these situations.

One advantage of using latent variables is that it reduces the dimensionality of data. A large number of observable variables can be aggregated in a model to represent an underlying concept, making it easier to understand the data. At the same time, latent variables link observable ("sub-symbolic") data in the real world to symbolic data in the modeled world.

## 2. Topic Model

举个例子：

* 富士苹果真好，赶快买。
* 苹果四代真好，赶快买。

从 corpus 上来看，两者非常相似，但是事实上，这两个句子从语义上来讲，没有任何关系，我们可以说，前者的 topic 是 "水果"，后者的 topic 是 "手机"。

究竟什么是 topic？接下来参考 baidu 搜索研发部官方博客中对语义主题的定义： 

> 主题就是一个概念、一个方面。它表现为一系列相关的词，能够代表这个主题。比如如果是 "阿里巴巴" 主题，那么 "马云" "电子商务" 等词会很高的频率出现，而设计到 "腾讯" 主题，那么"马化腾" "QQ" 等词会以较高的频率出现。  
> <br/>
> 如果用数学来描述一下的话，主题就是词汇表上词语的条件概率分布，与主题越密切相关的词，条件概率 \\( p(w|z) \\) (表示在给定主题 \\( z \\) 的情况下词语 \\( w \\) 出现的概率) 越大。  
> <br/>
> 主题就像一个桶，装了出现频率很高的词语，这些词语和主题有很强的相关性，或者说这些词语定义了这个主题。同时，一个词语，可能来自于这个桶，也可能来自那个桶，比如 "电子商务" 可以来自 "阿里巴巴" 主题，也可以来自 "京东" 主题，所以一段文字往往包含多个主题，也就是说，一段文字不只有一个主题。

而 Topic Model 要解决的就是 "如何得出 topic" 这一问题。

我们定义：

* \\( d \\) 表示 document
* \\( w \\) 表示 word
* \\( z \\) 表示 topic
* \\( P(w|d) \\) 表示词语 \\( w \\) 在文档 \\( d \\) 中出现的概率
* \\( P(w|z) \\) 表示在给定主题 \\( z \\) 的情况下词语 \\( w \\) 出现的概率（topic model 的计算目标）
* \\( P(z|d) \\) 表示文档 \\( d \\) 中每个主题 \\( z \\) 出现的概率

于是有：

$$
	P(w|d) = \sum\_z{P(w|z)\,P(z|d)}
$$

Topic Model 的一种，PLSA (Probabilistic Latent Semantic Analysis)，就是使用的 EM 算法来算的 \\( P(w|z) \\)。下面我们先介绍 EM 算法。

## 3. Expectation-Maximization Algorithm

In statistics, an expectation–maximization (EM) algorithm is an iterative method for finding maximum likelihood or maximum a posteriori (MAP) estimates of parameters in statistical models, where the model depends on unobserved latent variables. 

The EM iteration alternates between performing an expectation (_E_) step, which creates a function for the expectation of the log-likelihood evaluated using the current estimate for the parameters, and a maximization (_M_) step, which computes parameters maximizing the expected log-likelihood found on the E step. These parameter-estimates are then used to determine the distribution of the latent variables in the next E step.

### 3.1 Mathematical Proof

给定一个 data set，observed data 是 \\( X \\)，一般我们用 maximum likelihood 来 estimate 模型参数，有

$$ 
	\ell(\theta) = \sum\_{i}{\ln P(x\^{(i)}|\theta)} \\\\
	\theta = \arg \max\_{\theta} \ell(\theta)
$$

然后我们对 \\( \ell(\theta) \\) 求导，采用牛顿法或者梯度下降法来求解参数。

如果模型中存在一个 latent variable \\( Z \\) (比如 topic)，则

$$
	P(X|\theta) = \sum\_{Z}{P(X,Z|\theta)} \\\\
	\ell(\theta) = \sum\_{i}{\ln \sum\_{j}{P(x\^{(i)},z\^{(j)}|\theta)}}
$$

注意这里用了 joint distribution，一般有 \\( \sum\_{i}{\sum\_{j}{P(X =x\^{(i)} \text{ and } Y = y\^{(j)})}} = 1 \\)。

此时如果还是采用 maximum likelihood estimate，对 \\( \ell(\theta) \\) 求导，则无法获取其解析形式，不能直接获取其结果。

此时可以用 EM 算法来解。概括来说，EM 利用了 jessen 不等式以及 convex 函数的性质，求 \\( \ell(\theta) \\) 的下界，通过求下界的极大值，得到模型参数，所以 EM 并不能获取全局最优解，而是局部最优。

#### 3.1.1 变形

假设 \\( Q(Z) \\) 是 \\( Z \\) 的某种分布，满足 \\( \sum\_{j}{Q(z\^{j})} = 1, \, Q(z\^{j} \geq 0 \\)。如果 \\( Z \\) 是连续性的，那么 \\( Q(Z) \\) 是概率密度函数，需要将求和符号换做积分符号）。比如要将班上学生聚类，假设 \\( Z \\) 是身高，那么就是连续的高斯分布；如果 \\( Z \\) 是男女，那么就是伯努利分布了。

$$
\begin{equation}
	\ell(\theta) = \sum\_{i}{\ln \sum\_{j}{Q(z\^{(j)})  \frac{P(x\^{(i)},z\^{(j)}|\theta)}{Q(z\^{(j)})}}} 
\end{equation} 
$$

回忆一下，设 \\( Y = g(X) \\)：

* 若 \\( X \\) 离散，\\( P(X = x\_k) = p\_k \\)，则 \\( E[Y] = E[g(X)] = \sum\_k{g(x\_k)p\_k} \\)
* 若 \\( X \\) 连续，概率密度为 \\( f(x) \\)，则 \\( E[Y] = E[g(X)] = \int\_{-\infty}^{\infty} g(x)\,f(x)\,dx \\)

这里 \\( Q(z\^{(j)}) \\) 就是 \\( p\_j \\)，然后那一大坨分数就是 \\( g(x\_j) \\)。所以我们有

$$
\begin{equation}
	\ell(\theta) = \sum\_{i}{\ln E \left \[ \frac{P(x\^{(i)},Z | \theta)}{Q(Z)} \right \]}
\end{equation} 
$$

#### 3.1.2 Jensen's Inequality

* For any concave function \\( f \\), \\( E[f(X)] \leq f(E[X]) \\)
	* 注意老外的 concave function (凹函数) 是开口向下的，也叫 concave downwards，比如 \\( y = -x\^2 \\)
* For any convex function \\( f \\), \\( E[f(X)] \geq f(E[X]) \\)
	* convex function 是凸函数，是开口向上的，比如 \\( y = x\^2 \\)
	
#### 3.1.3 Proof

这里 \\( f \\) 是 \\( \ln \\)，是 concave function，所以有 

$$
\begin{aligned}
	\ell(\theta) 
	&= \sum\_{i}{\ln E \left \[ \frac{P(x\^{(i)},Z | \theta)}{Q(Z)} \right \]} \\\\
	&\geq \sum\_{i}{E \left \[ \ln \frac{P(x\^{(i)},Z | \theta)}{Q(Z)} \right \]} \\\\
	&= \sum\_{i}{\sum\_{j}{Q(z\^{(j)}) \ln \frac{P(x\^{(i)},z\^{(j)}|\theta)}{Q(z\^{(j)})}}}
\end{aligned} 
$$

这个过程可以看作是对 \\( \ell(\theta) \\) 求了下界。我们可以从这个下界出发来迭代，所以 min 下界就是 Jensen's Inequality 等号成立的时候，此时有 

$$
	\frac{P(x\^{(i)},z\^{(j)}|\theta)}{Q(z\^{(j)})} = c
$$

其中 \\( c \\) 为常数。又因为 \\( \sum\_j{Q(z\^{(j)})} = 1 \\)，所以 \\( \sum\_j{P(x\^{(i)},z\^{(j)}|\theta)} = c \\)。进而有

$$
\begin{aligned}
	Q(z\^{(j)})
	&= \frac{P(x\^{(i)},z\^{(j)}|\theta)}{c} \\\\
	&= \frac{P(x\^{(i)},z\^{(j)}|\theta)}{\sum\_j{P(x\^{(i)},z\^{(j)}|\theta)}} \\\\
	&= \frac{P(x\^{(i)},z\^{(j)}|\theta)}{P(x\^{(i)}|\theta)} \\\\
	&= P(z\^{(j)}|x\^{(i)}, \theta)
\end{aligned} 
$$

### 3.2 Algorithm

repeat until convergence:

* (Step _E_) for every \\( j \\), computer \\( Q(z\^{(j)}) := P(z\^{(j)}|x\^{(i)}, \theta) \\) 
* (Step _M_) computer \\( \theta := \arg \max\_{\theta} \sum\_{i}{\sum\_{j}{Q(z\^{(j)}) \ln \frac{P(x\^{(i)},z\^{(j)}|\theta)}{Q(z\^{(j)})}}} \\)

## 4. PLSA

### 4.1 Some Basis

这一节来自这个 [Probabilistic Latent Semantic Analysis 讲义](http://www.inf.ed.ac.uk/teaching/courses/dme/studpres0809/damianou_pavlopoulos.pdf)。主要是科普一下，算是个题外话。

一般地，我们有

$$
	P(d,w) = P(d) P(w|d)
$$

我们称 **Joint Probability** \\( P(d,w) \\) (我觉得可以理解为 \\( P(d \cap w) \\)) shows the probability of a word \\( w \\) to be inside a document \\( d \\).

前面已经有

$$
	P(w|d) = \sum\_z{P(w|z)\,P(z|d)}
$$

这个式子我们称为 **Word Distributions** \\( P(w|d) \\) are combinations of the **factors** \\( P(w|z) \\) and the **mixing weights** \\( P(z|d) \\).

* \\( p(w|d) \\) 又被称为 Multinomial Mixtures (好像发现了什么不得了的东西……有空再研究)

我们可以做一下变形：

$$
\begin{aligned}
	P(d,w) 
	&= P(d) P(w|d) \\\\
	&= P(d) \sum\_z{P(w|z)\,P(z|d)} \\\\
	&= \sum\_z{P(w|z) \cdot P(d)P(z|d)} \\\\
	&= \sum\_z{P(w|z) \cdot P(d,z)} \\\\
	&= \sum\_z{P(w|z) \cdot P(z)P(d|z)}
\end{aligned} 
$$

### 4.2 Algorithm

$$
\begin{aligned}
	\ell(\theta) 
	&= \sum\_{i}{\sum\_{j}{n(d\_i, w\_j) \ln P(w\_j | d\_i)}} \\\\
	&= \sum\_{i}{\sum\_{j}{n(d\_i, w\_j) \ln P(w\_j | z\_k) P(z\_k | d\_i)}} \\\\
	&\geq \sum\_{i}{\sum\_{j}{n(d\_i, w\_j)}} \sum\_{k}{Q(z\_k|d\_i,w\_j) \ln P(w\_j | z\_k) P(z\_k | d\_i)}
\end{aligned} 
$$

注意这里 \\( P(w\_j | z\_k) \\) 被视为一个 parameter，是 \\( \theta \\) 的一部分。因为这里涉及到了 \\( w \\) 和 \\( d \\) 二维，所以 EM 的计算也有两次，有点类似二维的偏微分的感觉。具体就不展开了，需要深入研究的时候再说。

---
layout: post-mathjax
title: "Naive Bayes classifier"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

首先感谢 [张洋](http://leoo2sk.cnblogs.com/) 先生的这篇 [算法杂货铺——分类算法之朴素贝叶斯分类(Naive Bayesian classification)](http://www.cnblogs.com/leoo2sk/archive/2010/09/17/naive-bayesian-classifier.html)，写的非常清楚明白。本文以此为基础做些总结。

Bayes Classifier 在 ISL 里零零散散提到一些，不正式写一下总觉得有点不痛快。

-----

## 1. Bayes classifier

首先要说的是 Naive Bayes classifier 只是 Bayes classifier 的一种。Bayes classifier 的 [定义](http://en.wikipedia.org/wiki/Bayes_classifier) 其实很简单：

$$
\begin{equation}
	C\^{\text{Bayes}}(x) = \underset{k = \{1,2,\dots, K\}}{\operatorname{argmax}} \operatorname{P}(Y=y\_k \mid X=x\^{(i)})
\end{equation}
$$

在这个大框架下，Bayes classifier 衍生出了很多种，比如：

* Naive Bayes classifier
* Tree Augmented Naive Bayes classifier (TAN)
* Bayesian network Augmented Naive Bayes classifier (BAN)
* General Bayesian Network (GBN)

我们这里只讨论 Naive Bayes classifier。

## 2. Naive Bayes classifier

按 [张洋](http://leoo2sk.cnblogs.com/) 先生的文章，Bayes classifier 的定义可以这么写：

* 设 \\( x\^{(i)} = \\{ x\^{(i)}\_1,x\^{(i)}\_2,\cdots,x\^{(i)}\_n \\} \\)为一个 test point，\\( x\^{(i)}\_j \\) 表示 \\( x\^{(i)} \\) 的 \\( j\^{th} \\) feature 的值。
* class (label) 集合 \\( C = \\{ y\_1,y\_2,\cdots,y\_K \\} \\)
* 我们把 \\( Pr(Y=y\_k \mid X=x\^{(i)}) \\) 简写成 \\( Pr(y\_k | x\^{(i)}) \\)
* 如果 \\( k' = \underset{k = \{1,2,\dots, K\}}{\operatorname{argmax}} \operatorname{P}(y\_k | x\^{(i)}) \\)，则把 \\( x\^{(i)} \\) 归到 \\( y\_{k'} \\) 对应的 class 下

根据 Bayes' rule，有：

$$
\begin{equation}
	Pr(y\_k | x\^{(i)}) = \frac{Pr(x\^{(i)} | y\_k) Pr(y\_k)}{Pr(x\^{(i)})}
\end{equation}
$$
      
对 \\( x\^{(i)} \\) 本身而言，\\( Pr(x\^{(i)}) \\) 是不变的，于是问题转化成求 \\( \underset{k = \{1,2,\dots, K\}}{\operatorname{argmax}} Pr(x\^{(i)} | y\_k) Pr(y\_k) \\)。

假设 feature 之间互相独立，我们可以有：

$$
\begin{equation}
	Pr(x\^{(i)} | y\_k) = Pr(x\^{(i)}\_1 | y\_k) Pr(x\^{(i)}\_2 | y\_k) \cdots Pr(x\^{(i)}\_n | y\_k) = \prod\_{j=1}\^{n}{Pr(x\^{(i)}\_j | y\_k)}
\end{equation}
$$

于是问题转化成求 \\( \underset{k = \{1,2,\dots, K\}}{\operatorname{argmax}} Pr(y\_k) \prod\_{j=1}\^{n}{Pr(x\^{(i)}\_j | y\_k)} \\)。

于是 Naive Bayes classifier 可以定义为

$$
\begin{equation}
	C\^{\text{Naive Bayes}}(x) = \underset{k = \{1,2,\dots, K\}}{\operatorname{argmax}} Pr(y\_k) \prod\_{j=1}\^{n}{Pr(x\^{(i)}\_j | y\_k)}
\end{equation}
$$

## 3. Parameter Estimation and Event Models

\\( Pr(Y=y\_k) \\) 比较好估计，直接计算统计数据就好了，即 \\( Pr(Y=y\_k) = \frac{\text{# of samples labled } y\_k}{\text{total # of samples}} \\)。由于 Naive Bayes classifier 是一种典型的用到大量样本的方法，所以这么搞没问题。

\\( Pr(x\^{(i)}\_j | y\_k) \\) 就麻烦一点，根据 [Naive Bayes classifier - wikipedia](http://en.wikipedia.org/wiki/Naive_Bayes_classifier) 的说法：

> ... one must assume a distribution for the features from the training set. The assumptions on distributions of features are called the **event model** of the Naive Bayes classifier.

* for continuous features:
	* Gaussian event model
	* 统计所有 label 为 \\( y\_k \\) 的 sample 的 feature \\( j \\) 的值，得到 variance \\( \sigma\^2\_{jk} \\) 和 mean \\( \mu\_{jk} \\)，进而得到一个高斯分布，把 \\( x\^{(i)}\_j \\) 的值带进去计算即可得到概率
* for discrete features
	* multinomial event model
	* Bernoulli event model
	* 非常常用的两种 event model，具体自己看 wiki。如果需要深入研究，wiki 后面附了文章专门讨论这两种 event model 在 document classification 应用上的优劣。
	
## 4. 样本修正

另一个需要讨论的问题就是当 \\( Pr(x\^{(i)}\_j | y\_k) \\) 怎么办。对 continuous feature 来说这个问题很难出现；但对 discrete features 而言，当某个 class 下某个 feature 的某个取值没有出现时，就会产生这种现象，这会影响 classifier 的 performance。为了解决这个问题，我们引入 Laplace 校准，它的思想非常简单，就是对所有的 feature 值的统计量都加 1，这样如果 sample 数量充分大时，并不会对结果产生影响，并且解决了上述概率为 0 的尴尬局面。

## 5. Example

原文和 wiki 都有，不好理解的时候看看例子就清楚了。
---
layout: post
title: "Introduction to Linear Discriminant Analysis"
description: ""
category: Machine-Learning
tags: [ML-101, LDA]
---
{% include JB/setup %}

参考自 [Multi-label Linear Discriminant Analysis](http://link.springer.com/chapter/10.1007/978-3-642-15567-3_10)

-----

Linear discriminant analysis (LDA) is a well-known method for dimensionality reduction.

Given a data set with $ n $ samples $ \lbrace x^{(i)}, y^{(i)} \rbrace^n_{i=1} $ and $ K $ classes, where $ x^{(i)} \in \mathbb{R}^p $ and $ y^{(i)} \in \lbrace0, 1\rbrace^K $ ($ K $ 维的 0-1 vector). $ y^{(i)}_k = 1 $ if $ x^{(i)} $ belongs to the $k$^th class, and 0 otherwise.

Let input data be partitioned into $ K $ groups as $ \lbrace \pi_k \rbrace^K_{k=1} $, where $ \pi_k $ denotes the group of the $k$^th class with $ n_k $ data points. Classical LDA deals with single-label problems, where data partitions are mutually exclusive, i.e., $ \pi_i \cap \pi_j = \varnothing $ if $ i \neq j $, and $ \sum^{K}_{k=1} n_k = n $.

We write $ X = [ x^{(1)},\cdots,x^{(n)} ]^T $ and

$$
	Y = [y^{(1)},\cdots,y^{(n)}]^T = [y_{(1)},\cdots,y_{(K)}]
$$

where $ y_{(k)} \in \{0, 1\}^n $ is the class-wise label indication vector for the $k^{th}$ class.

简单理一下：

* \# of features = $ p $
* \# of samples = $ n $
* $ x^{(i)} $ is a $ p \times 1 $ vector
* $ X $ is a $ n \times p $ matrix
* $ y^{(i)} $ is a $ K \times 1 $ vector
* $ y_{(i)} $ is a $ n \times 1 $ vector
* $ Y $ is a $ n \times K $ matrix

Classical LDA seeks a linear transformation $ G \in \mathbb{R}^{p \times r} $ that maps $ x^{(i)} $ in the high $p$-dimensional space to $ q^{(i)} \in \mathbb{R}^{r} $ in a lower $r$-dimensional ($r < p $) space by $ q^{(i)} = G^T x^{(i)} $. In classical LDA, the _**between-class**_, _**within-class**_, and _**total-class**_ _scatter matrices_ are defined as follows:

$$
\begin{align}
	S_b &= \sum_{k=1}^{K}{n_k(m_k - m)(m_k - m)^T} \newline
	S_w &= \sum_{k=1}^{K}{\sum_{x^{(i)} \in \pi_k}{(x^{(i)} - m_k)(x^{(i)} - m_k)^T}} \newline
	S_t &= \sum_{i=1}^{n}{(x^{(i)} - m)(x^{(i)} - m)^T}
\end{align}
$$

where $ m_k = \frac{1}{n_k} \sum_{x^{(i)} \in \pi_k}{x^{(i)}} $ is the class mean (class centroid) of the $k$^th class, $ m = \frac{1}{n} \sum_{i=1}^{n}{x^{(i)}} $ is the global mean (global centroid), and $ S_t = S_b + S_w $.

The optimal $ G $ is chosen such that the _**between-class**_ distance is maximize whilst the _**within-class**_ distance is minimized in the low-dimensional projected space, which leads to the standard LDA optimization objective as follows:

$$
\begin{align}
	J &= tr \left ( \frac{G^T S_b G}{G^T S_w G} \right ) \newline
	G^* &= \underset{G}{\operatorname{argmax}} J
\end{align}
$$

-----

In linear algebra, the trace (迹) of an $ n \times n $ square matrix $ A $ is defined to be the sum of the elements on the main diagonal (the diagonal from the upper left to the lower right) of $ A $, i.e.,

$$
	\operatorname{tr}(A) = a_{11} + a_{22} + \dots + a_{nn} = \sum_{i=1}^{n} a_{ii}
$$

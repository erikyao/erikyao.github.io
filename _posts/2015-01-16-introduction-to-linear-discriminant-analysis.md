---
layout: post-mathjax
title: "Introduction to Linear Discriminant Analysis"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

参考自 [Multi-label Linear Discriminant Analysis](http://link.springer.com/chapter/10.1007/978-3-642-15567-3_10)

-----

Linear discriminant analysis (LDA) is a well-known method for dimensionality reduction.

Given a data set with \\( n \\) samples \\( \\{ x\^{(i)}, y\^{(i)} \\}\^n\_{i=1} \\) and \\( K \\) classes, where \\( x\^{(i)} \in R\^p \\) and \\( y\^{(i)} \in \\{0, 1\\}\^K \\) (\\( K \\) 维的 0-1 vector). \\( y\^{(i)}\_k = 1 \\) if \\( x\^{(i)} \\) belongs to the \\(k\\)^th class, and 0 otherwise. 

Let input data be partitioned into \\( K \\) groups as \\( \\{\pi\_k\\}\^K\_{k=1} \\), where \\( \pi\_k \\) denotes the group of the \\(k\\)^th class with \\( n\_k \\) data points.

We write \\( X = \[ x\^{(1)},\cdots,x\^{(n)} \]\^T \\) and

$$
Y = [y\^{(1)},\cdots,y\^{(n)}]\^T = [y\_{(1)},\cdots,y\_{(K)}]
$$

where \\( y\_{(k)} \in \\{0, 1\\}\^n \\) is the class-wise label indication vector for the \\(k\\)^th class.

简单理一下：

* \# of features = \\( p \\)
* \# of samples = \\( n \\)
* \\( x\^{(i)} \\) is a \\( p \times 1 \\) vector
* \\( X \\) is a \\( n \times p \\) matrix
* \\( y\^{(i)} \\) is a \\( K \times 1 \\) vector
* \\( y\_{(i)} \\) is a \\( n \times 1 \\) vector
* \\( Y \\) is a \\( n \times K \\) matrix

Classical LDA seeks a linear transformation \\( G \in R\^{p \times r} \\) that maps \\( x\^{(i)} \\) in the high \\(p\\)-dimensional space to \\( q\^{(i)} \in R\^{r} \\) in a lower \\(r\\)-dimensional (\\(r < q \\)) space by \\( q\^{(i)} = G\^T x\^{(i)} \\). In classical LDA, the _**between-class**_, _**within-class**_, and _**total-class**_ _scatter matrices_ are defined as follows:

$$
\begin{aligned}
	S\_b &= \sum\_{k=1}\^{K}{n\_k(m\_k - m)(m\_k - m)\^T} \\\\
	S\_w &= \sum\_{k=1}\^{K}{\sum\_{x\^{(i)} \in \pi\_k}{(x\^{(i)} - m\_k)(x\^{(i)} - m\_k)\^T}} \\\\
	S\_t &= \sum\_{i=1}\^{n}{(x\^{(i)} - m)(x\^{(i)} - m)\^T}
\end{aligned}
$$

where \\( m\_k = \frac{1}{n\_k} \sum\_{x\^{(i)} \in \pi\_k}{x\^{(i)}} \\) is the class mean (class centroid) of the \\(k\\)^th class, \\( m = \frac{1}{n} \sum\_{i=1}\^{n}{x\^{(i)}} \\) is the global mean (global centroid), and \\( S\_t = S\_b + S\_w \\). 

The optimal \\( G \\) is chosen such that the _**between-class**_ distance is maximize whilst the _**within-class**_ distance is minimized in the low-dimensional projected space, which leads to the standard LDA optimization objective as follows:

$$
\begin{aligned}
	J &= tr \left \( \frac{G\^T S\_b G}{G\^T S\_w G} \right \) \\\\
	G\^* &= \underset{G}{\operatorname{argmax}} J
\end{aligned}
$$

-----

In linear algebra, the trace (迹) of an \\( n \times n \\) square matrix \\( A \\) is defined to be the sum of the elements on the main diagonal (the diagonal from the upper left to the lower right) of \\( A \\), i.e.,

$$
	\operatorname{tr}(A) = a\_{11} + a\_{22} + \dots + a\_{nn} = \sum\_{i=1}\^{n} a\_{ii}
$$

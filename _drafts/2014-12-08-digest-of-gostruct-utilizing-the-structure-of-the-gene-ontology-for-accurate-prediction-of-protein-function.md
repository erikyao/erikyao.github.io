---
layout: post-mathjax
title: "Digest of <i>GOstruct: utilizing the structure of the Gene Ontology for accurate prediction of protein function</i>"
description: ""
category: Machine-Learning
tags: [ML-101, BioInformatics-101, Paper]
---
{% include JB/setup %}

原文 [GOstruct: utilizing the structure of the Gene Ontology for accurate prediction of protein function](http://www.lifesciencessociety.org/csb2009/pdf/050Sokolov.pdf)

-----

## 0. ABSTRACT

> Most of today's machine learning approaches reduce the problem to a collection of binary classification problems: whether a protein performs a particular function, sometimes with a post-processing step to combine the binary outputs. We propose a method that directly predicts a full functional annotation of a protein by modeling the structure of the Gene Ontology hierarchy in the framework of kernel methods for structured-output spaces.

说得很清楚了，我们不玩多重 0-1 classification 了，我们要一次到位~

## 1. INTRODUCTION

> Transfer of annotation methods have several shortcomings: transfer of mul- tiple GO keywords between proteins is not always ap- propriate, e.g. in the case of multi-domain proteins, and they fail to exploit the underlying hierarchical structure of the annotation space.

<!-- -->

> (多重 0-1 classification) leave it to the user to combine the output of classifiers trained to recognize the different possible functions and decide which of the annotations to accept. To automate the task, several predictors employ Bayesian networks or logistic regres- sion to infer the most likely set of annotations in a top-down fashion.

然后介绍了一些已有的 automate 的成果，然后提出：In this paper we take a different approach。

其实这个就是我们之前说过的 Multiclass classification 问题，不过我们自己都是 one-vs-one 或者 one-vs-all 来做，作者说的是：转成一个 hierarchical multi-label classification problem，然后 construct a single classifier that learns to predict a
set of GO terms，我们来看看他是咋做的。

他们将会使用 Structured SVM。或者更 generally 来讲是 making structured prediction。

## 2. METHODS

我们中根遍历 GO hierarchy，得到一个节点序列 \\( (node_1, node_2, \cdots, node_k) \\)，我们按照这个顺序做一个 label vector \\( y = (y_1, y_2, \cdots, y_k) \\)，如果 protein 有 GO term \\( Gt_i \\)，我们就把 \\( y_i \\) 以及 \\( node_i \\) 的所有父节点对应的 \\( y_j \\) 都标为 1。其余的位置上都是 0。这样就得到了一个 0-1 vector，这就是我们的 outcome。 

> Our focus in this work will be on predicting GO terms for each namespace separately.

也就是说 \\( y \\) 是区分 namespace 分别构造的。

### 2.1. Measuring performance

讨论了半天，最终决定使用 \\( F_1 \\) score。

假设 \\( y \\) 是真实值，\\( \hat{y} \\) 是预测值，则有

$$
\begin{aligned}
	Recall(y, \hat{y}) &= \frac{y\^T \hat{y}}{y\^T y} \\\\
	Precision(y, \hat{y}) &= \frac{y\^T \hat{y}}{\hat{y}\^T \hat{y}} \\\\
	F\_1(y, \hat{y}) &= \frac{2 \, y\^T \hat{y}}{y\^T y + \hat{y}\^T \hat{y}}
\end{aligned}
$$ 

注意 Ng 的课上说过，只要出现 inner product 的地方都可以用 kernel，所以我们这里可以定一个 linear kernel \\( K(y, \hat{y}) \\)，这样就有：

$$
\begin{aligned}
	F\_1(y, \hat{y}) = \frac{2 \, K(y, \hat{y})}{K(y, y) + K(\hat{y}, \hat{y})}
\end{aligned}
$$ 

这样做的好处是，万一以后 \\( y \\) 与 \\( \hat{y} \\) 有新的计算方式，我们替换一下 kernel 就好了，其余的框架可以不动。

然后我们定义一下 kernel loss, following the \\( F_1 \\)-loss:

$$
\begin{aligned}
	\Delta_{ker}(y, \hat{y}) = 1 - F\_1(y, \hat{y})
\end{aligned}
$$

We used the kernel loss to measure accuracy in our experiments.

### 2.2. GOstruct: GO term prediction as a structured outputs problem

上来是一大段 kernel 的科普。因为是 0-1 classifier，所以 Lagrange duality 变形后得到的 \\( w \\) 里没写乘以 \\( y\^{(i)} \\)。

We turn to structured output learning. In this setting the discriminant function becomes a function \\( f(x, y) \\) of both inputs and labels, and can be thought of as measuring the compatibility of the input \\( x \\) with the output \\( y \\). 类似地，有：

$$
\begin{aligned}
	f(x, y) = w\^T \phi(x,y)
\end{aligned}
$$

中间又是 Lagrange duality 变换，这里就不啰嗦了，直接上 kernel:

$$
\begin{aligned}
	K((x,y),(x',y')) = K\_{X}(x,x') K\_{Y}(y,y')
\end{aligned}
$$

For the output-space kernel, \\( K_Y \\), we use a linear kernel in all of our experiments; the input- space kernel \\( K_X \\) is described separately for each experiment.

#### 2.2.1. Inference

以我们 training example 的 output space 为基础，做了两个更小范围的 output space，且看后面怎么用……

-----

后面的内容统一说一下：

input 的构造方法是 empirical kernel map (`3.1`)。具体说来就是：对每一个 protein \\( x\_i \\)， 与手头数据库（经过筛选的）里的每一个 protein \\( x_j \\) 都求一遍 BLAST 相似度，构成一个 vector。

然后本文提出了 4 个算法：

* standard perceptron
* 改良式 perceptron，同步 update 时使用了 kernel loss
* n-slack SVM (就是 soft margin，但是有些 normalize 的选择)
* 1-slack SVM

然后 4 个算法，3 个 output space，3 个name space，全方位立体交叉比较。

作者重点提到了改良式 perceptron，因为 performance 不差，而且实现简单。


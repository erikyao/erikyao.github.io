---
layout: post-mathjax
title: "A Little on Topic Model"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结自：

* [[学习笔记]学习主题模型(Topic Model)和PLSA(probabilistic latent semantic analysis)](http://blog.csdn.net/hxxiaopei/article/details/7617838)
* [Probabilistic Latent Semantic Analysis](http://www.inf.ed.ac.uk/teaching/courses/dme/studpres0809/damianou_pavlopoulos.pdf)

-----

## 1. Topic Model

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
* \\( P(w|z) \\) 表示在给定主题 \\( z \\) 的情况下词语 \\( w \\) 出现的概率
* \\( P(z|d) \\) 表示文档 \\( d \\) 中每个主题 \\( z \\) 出现的概率

于是有：

$$
	P(w|d) = \sum\_z{P(w|z)\,P(z|d)}
$$

所谓 Topic Model 就是利用大量已知的 \\( P(w|d) \\) 来训练 \\( P(z|d) \\) 以及 \\( P(w|z) \\)。

Topic Model 的一种，PLSA (Probabilistic Latent Semantic Analysis)，是使用的 EM 算法来算的。下面我们简单介绍下 PLSA，详细的内容请结合 EM 算法再深入研究。

## 2. PLSA

### 2.1 Some Basis

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
\begin{align}
	P(d,w) 
	&= P(d) P(w|d) \\\\
	&= P(d) \sum\_z{P(w|z)\,P(z|d)} \\\\
	&= \sum\_z{P(w|z) \cdot P(d)P(z|d)} \\\\
	&= \sum\_z{P(w|z) \cdot P(d,z)} \\\\
	&= \sum\_z{P(w|z) \cdot P(z)P(d|z)}
\end{align} 
$$

### 2.2 Algorithm

$$
\begin{align}
	\ell(\theta) 
	&= \sum\_{i}{\sum\_{j}{n(d\_i, w\_j) \ln P(w\_j | d\_i)}} \\\\
	&= \sum\_{i}{\sum\_{j}{n(d\_i, w\_j) \ln P(w\_j | z\_k) P(z\_k | d\_i)}} \\\\
	&\geq \sum\_{i}{\sum\_{j}{n(d\_i, w\_j)}} \sum\_{k}{Q(z\_k|d\_i,w\_j) \ln P(w\_j | z\_k) P(z\_k | d\_i)}
\end{align} 
$$

注意这里 \\( P(w\_j | z\_k) \\) 被视为一个 parameter，是 \\( \theta \\) 的一部分。因为这里涉及到了 \\( w \\) 和 \\( d \\) 二维，所以 EM 的计算也有两次，有点类似二维的偏微分的感觉。具体就不展开了，需要深入研究的时候再说。

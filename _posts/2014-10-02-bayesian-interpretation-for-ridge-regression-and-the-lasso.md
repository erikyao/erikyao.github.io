---
layout: post-mathjax
title: "Bayesian Interpretation for Ridge Regression and the Lasso"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}



总结自 Bayesian Interpretation for Ridge Regression and the Lasso, Section 6.2.2 The Lasso, An Introduction to Statistical Learning.

水略深所以单独开一篇。

------

## 1. 啥是 Bayes

### 1.1. Dictionary

* Bayes: [ˈbeɪz]
* a priori: [ˌɑpriˈɔri], from Latin a priori ("former"), literally "from the former".
	* (logic) Based on hypothesis rather than experiment
		* 翻译成 "先验的" 应该是指 before experiment 的意思
		* A priori knowledge or justification is independent of experience (for example "All bachelors are unmarried"). 有一种 "显而易见，无需证明" 的感觉。
	* Presumed without analysis
		* One assumes, a priori, that a parent would be better at dealing with problems, 想当然地
* a posteriori: [ˌɑpɒsteriˈɔ:rɪ] or [ˌeɪpɒsteriˈɔ:raɪ], from Latin a posteriori ("latter"), literally "from the latter".
	*  Relating to or derived by reasoning from observed facts; Empirical
		* A posteriori knowledge or justification is dependent on experience or empirical evidence (for example "Some bachelors I have met are very happy").
		* What Locke calls "knowledge" they have called "a priori knowledge"; what he calls "opinion" or "belief" they have called "a posteriori" or "empirical knowledge".
* prior: [ˈpraɪə(r)]
* posterior: [pɒˈstɪəriə(r)]

### 1.2. 绝好的科普文

这篇 [数学之美番外篇：平凡而又神奇的贝叶斯方法](http://blog.csdn.net/pongba/article/details/2958094) 写得不能更好。在此摘录个贝叶斯方法的历史：

> 所谓的贝叶斯方法源于他生前为解决一个 "逆概率" 问题写的一篇文章，而这篇文章是在他死后才由他的一位朋友 Richard Price 发表出来的。在贝叶斯写这篇文章之前，人们已经能够计算 "正向概率"，如 "假设袋子里面有N个白球，M个黑球，你伸手进去摸一把，摸出黑球的概率是多大"。而一个自然而然的问题是反过来："如果我们事先并不知道袋子里面黑白球的比例，而是闭着眼睛摸出一个（或好几个）球，观察这些取出来的球的颜色之后，那么我们可以就此对袋子里面的黑白球的比例作出什么样的推测"。这个问题，就是所谓的逆概率问题。

### 1.3 Bayes' theorem 的变形

不禁想吐槽一下，在 [Conditional Probability](http://erikyao.github.io/math/2014/09/08/conditional-probability/) 里你就没有发现能把 \\( P(B|A) = \frac{P(B \cap A)}{P(A)} \\) 用到贝叶斯公式里么……

我们只变化贝叶斯公式的分母部分：

$$
\begin{align}
	P(B|A) 
	&= \frac{P(A|B)P(B)}{P(A|B)P(B) + P(A|B\^c)P(B\^c)} \\\\
	&= \frac{P(A|B)P(B)}{P(A \cap B) + P(A \cap B\^c)} \\\\
	&= \frac{P(A|B)P(B)}{P(A)}
	\tag{1.1}
\end{align} 
$$

还是以摸球为例：

* B: 袋子里黑白球的比例是 blah blah blah
* A：在不知道袋子里面黑白球比例的情况下，摸了 xxx 个球，yyy 个白的，zzz 个黑的

再根据这篇 [Understand Bayes Theorem (prior/likelihood/posterior/evidence)](http://www.lichun.cc/blog/2013/07/understand-bayes-theorem-prior-likelihood-posterior-evidence/)，有：

* \\( p(B|A) \\) is **posterior** (probablity) distribution
	* the probablity of \\( B \\) posterior to (after) the observation of \\( A \\)
	* 注意我们这里不说 \\( p(B|A) \\) 是 posterior probablity。因为严格说来 \\( p(B|A) \\) 是一个分布律，是一个概率函数，从定义上说 是一个分布，而不是一个具体的概率值。当然你理解成一个概率值也无可厚非。prior 同。
* \\( p(A|B) \\) is **likelihood**
	* reversely, when \\( B \\) happened, how likely will \\( A \\) happen?
	* 从 1.4 来看，似乎不能直接叫 likelihood，待调查
* \\( p(B) \\) is **prior** (probablity) distribution
	* prior to (before) any observation, what is the chance of \\( B \\)?
* \\( p(A) \\) is the probablity of **evidence**
	* \\( A \\) 是已经发生的，是事实，是我们推测 \\( B \\) 的 evidence
	
如果忽略掉 evidence 的话（它是个常数），我们可以得到：

$$
\begin{equation}
	posterior \propto prior \times likelihood
	\tag{1.2}
\end{equation} 
$$

\\( \propto \\) 读作 is proportional to 或 varies as。

\\( y \propto x \\) simply means that \\( y = kx \\) for some constant \\( k \\). (符号解释摘自 [List of mathematical symbols](http://en.wikipedia.org/wiki/List_of_mathematical_symbols))

### 1.4 在 regression 中的应用

根据这篇 [Likelihood Function Confusions](http://voteview.com/Likelihood_Function_Confusions.pdf) 讲义，一种常见的形式如：

* \\( Y \\): the observed data
* \\( \theta \\): the parameters
* \\( P(Y|\theta) \\): the joint distribution of the sample, which is proportional to the likelihood function
* \\( P(\theta) \\): the prior distribution of the parameters

## 2. Bayesian Interpretation for Ridge Regression and the Lasso

书上的写法有一点奇怪。按照 [Bayesian Interpretations of Regularization](http://www.mit.edu/~9.520/spring09/Classes/class15-bayes.pdf) 这篇讲义的说法：

* \\( p(Y|X,\beta) \\) is the joint distribution over outputs \\( Y \\) given inputs \\( X \\) and the parameters \\( \beta \\).
* The likelihood of any fixed parameter vector \\( \beta \\) is \\( L(\beta|X) = p(Y|X,\beta) \\)

剩下的部分直接看 P226 好了。[Bayesian Interpretations of Regularization](http://www.mit.edu/~9.520/spring09/Classes/class15-bayes.pdf) 这篇讲义上有些推导过程，很有帮助。
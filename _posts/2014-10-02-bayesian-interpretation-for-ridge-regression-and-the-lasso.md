---
layout: post
title: "Bayesian Interpretation for Ridge Regression and the Lasso + Exercise 7"
description: ""
category: Machine-Learning
tags: [ML-101, Bayes]
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

不禁想吐槽一下，在 [Conditional Probability](/math/2014/09/08/conditional-probability) 里你就没有发现能把 $ P(B \vert A) = \frac{P(B \cap A)}{P(A)} $ 用到贝叶斯公式里么……

我们只变化贝叶斯公式的分母部分：

$$
\begin{align}
	P(B \vert A) 
	&= \frac{P(A \vert B)P(B)}{P(A \vert B)P(B) + P(A \vert B^c)P(B^c)} \newline
	&= \frac{P(A \vert B)P(B)}{P(A \cap B) + P(A \cap B^c)} \newline
	&= \frac{P(A \vert B)P(B)}{P(A)}
	\tag{1.1}
\end{align} 
$$

还是以摸球为例：

* $B$: 袋子里黑白球的比例是 blah blah blah
* $A$: 在不知道袋子里面黑白球比例的情况下，摸了 xxx 个球，yyy 个白的，zzz 个黑的

再根据这篇 [Understand Bayes Theorem (prior/likelihood/posterior/evidence)](http://www.lichun.cc/blog/2013/07/understand-bayes-theorem-prior-likelihood-posterior-evidence)，有：

* $ p(B \vert A) $ is **posterior** (probablity) distribution
	* the probablity of $ B $ posterior to (after) the observation of $ A $
	* 注意我们这里不说 $ p(B \vert A) $ 是 posterior probablity。因为严格说来 $ p(B \vert A) $ 是一个分布律，是一个概率函数，从定义上说是一个分布，而不是一个具体的概率值。当然你理解成一个概率值也无可厚非。prior 同。
* $ p(A \vert B) $ is **likelihood**
	* reversely, when $ B $ happened, how likely will $ A $ happen?
	* 从 1.4 来看，似乎不能直接叫 likelihood，待调查
* $ p(B) $ is **prior** (probablity) distribution
	* prior to (before) any observation, what is the chance of $ B $?
* $ p(A) $ is the probablity of **evidence**
	* $ A $ 是已经发生的，是事实，是我们推测 $ B $ 的 evidence
	
如果忽略掉 evidence 的话（它是个常数），我们可以得到：

$$
\begin{equation}
	posterior \propto prior \times likelihood
	\tag{1.2}
\end{equation} 
$$

$ \propto $ 读作 is proportional to 或 varies as。

$ y \propto x $ simply means that $ y = kx $ for some constant $ k $. (符号解释摘自 [List of mathematical symbols](http://en.wikipedia.org/wiki/List_of_mathematical_symbols))

### 1.4 在 regression 中的应用

根据这篇 [Likelihood Function Confusions](http://voteview.com/Likelihood_Function_Confusions.pdf) 讲义，一种常见的形式如：

* $ Y $: the observed data
* $ \theta $: the parameters
* $ P(Y \vert \theta) $: the joint distribution of the sample, which is proportional to the likelihood function
* $ P(\theta) $: the prior distribution of the parameters

## 2. Bayesian Interpretation for Ridge Regression and the Lasso

书上的写法有一点奇怪。按照 [Bayesian Interpretations of Regularization](http://www.mit.edu/~9.520/spring09/Classes/class15-bayes.pdf) 这篇讲义的说法：

* $ p(Y \vert X,\beta) $ is the joint distribution over outputs $ Y $ given inputs $ X $ and the parameters $ \beta $.
* The likelihood of any fixed parameter vector $ \beta $ is $ L(\beta \vert X) = p(Y \vert X,\beta) $

剩下的部分直接看 P226 好了。[Bayesian Interpretations of Regularization](http://www.mit.edu/~9.520/spring09/Classes/class15-bayes.pdf) 这篇讲义上有些推导过程，很有帮助。

## 3. Exercise 7

We will now derive the Bayesian connection to the lasso and ridge regression discussed in Section 6.2.2.

### (a) Question

Suppose that $ y_i = \beta_0 + \sum_{j=1}^{p}{x_{ij} \beta_j} + \epsilon_i $ where $ \epsilon_1, \cdots, \epsilon_n $ are independent and identically distributed from a $ N(0, \sigma^2) $ distribution. Write out the likelihood for the data.

### (a) Answer

The likelihood for the data is:

$$
\begin{align} 
	L(\theta \vert \beta) 
	&= p(\beta \vert \theta) \newline 
	&= p(\beta_1 \vert \theta) \times \cdots \times p(\beta_n \vert \theta) \newline 
	&= \prod_{i = 1}^{n} p(\beta_i \vert \theta) \newline
	&= \prod_{i = 1}^{n} \frac{ 1 }{ \sigma \sqrt{2\pi} } \exp \left(- \frac{ \left | Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right | ^2}{ 2\sigma^2 } \right) \newline 
	&= \left( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right)^n \exp \left(- \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left | Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right | ^2 \right) 
\end{align} 
$$

### (b) Question

Assume the following prior for $ \beta $: $ \beta_1, \cdots, \beta_p $ are independent and identically distributed according to a double-exponential distribution with mean 0 and common scale parameter $ b $: i.e. $ p(\beta) = \frac{1}{2b} exp(− \frac{\lvert \beta \rvert }{b}) $. Write out the posterior for $ \beta $ in this setting.

### (b) Answer

The posterior with double exponential (Laplace Distribution) with mean 0 and common scale parameter $ b $, i.e. $ p(\beta) = \frac{1}{2b}\exp(- \lvert \beta \rvert / b) $ is:

$$
	f(\beta \vert X, Y) \propto f(Y \vert X, \beta) \, p(\beta \vert X) = f(Y \vert X, \beta) \, p(\beta)
$$

Substituting our values from (a) and our density function gives us:

$$
\begin{align} 
	&f(Y \vert X, \beta) \, p(\beta) \newline
	&= \left( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right)^n \exp \left( - \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left | Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right |^2 \right) \left( \frac{ 1 }{ 2b } \exp(- \frac{\lvert \beta \rvert}{b}) \right) \newline 
	&= \left( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right)^n \left( \frac{ 1 }{ 2b } \right) \exp \left( - \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left | Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right |^2 - \frac{ \lvert \beta \rvert }{ b } \right) 
\end{align} 
$$

### (c) Question

Argue that the lasso estimate is the mode for $ \beta $ under this posterior distribution.

### (c) Answer

Showing that the Lasso estimate for $ \beta $ is the mode under this posterior distribution is the same thing as showing that the most likely value for $ \beta $ is given by the lasso solution with a certain $ \lambda $.

We can do this by taking our likelihood and posterior and showing that it can be reduced to the canonical Lasso Equation 6.7 from the book.

Let's start by simplifying it by taking the logarithm of both sides:

$$
\begin{align} 
	&\log \left ( f(Y \vert X, \beta) \, p(\beta) \right ) \newline 
	&= \log \left [ \left ( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right )^n \left ( \frac{ 1 }{ 2b } \right ) \exp \left ( - \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left | Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right |^2 - \frac{ \lvert \beta \rvert }{ b } \right ) \right ] \newline 
	&= \log \left [ \left ( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right )^n \left ( \frac{ 1 }{ 2b } \right ) \right ] - \left( \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left | Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right |^2 + \frac{ \lvert \beta \rvert }{ b } \right) 
\end{align} 
$$

We want to maximize the posterior, this means: 

$$
\begin{align} 
	& \arg \max_\beta \, f(\beta \vert X, Y) \newline
	&= \arg \max_\beta \, \log \left[ \left( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right)^n \left( \frac{ 1 }{ 2b } \right) \right] - \left( \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left | Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right |^2 + \frac{ \lvert \beta \rvert }{ b } \right) 
\end{align} 
$$

Since we are taking the difference of two values, the maximum of this value is the equivalent to taking the difference of the second value in terms of $ \beta $. This results in:

$$
\begin{align} 
	&= \arg \min_\beta \, \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 + \frac{ \lvert \beta \rvert }{ b } \newline 
	&= \arg \min_\beta \, \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 + \frac{ 1 }{ b } \sum_{j = 1}^{p} \lvert \beta_j \rvert \newline 
	&= \arg \min_\beta \, \frac{ 1 }{ 2\sigma^2 } \left( \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 + \frac{ 2\sigma^2 }{ b } \sum_{j = 1}^{p} \lvert \beta_j \rvert \right)
\end{align} 
$$

By letting $ \lambda = \frac{2\sigma^2}{b} $, we can see that we end up with:

$$
\begin{align} 
	&= \arg \min_\beta \, \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 + \lambda \sum_{j = 1}^{p} \lvert \beta_j \rvert \newline 
	&= \arg \min_\beta \, \text{RSS} + \lambda \sum_{j = 1}^{p} \lvert \beta_j \rvert 
\end{align} 
$$

which we know is the Lasso from Equation 6.7 in the book. Thus we know that when the posterior comes from a Laplace distribution with mean zero and common scale parameter $ b $, the mode for $ \beta $ is given by the Lasso solution when $ \lambda = \frac{2\sigma^2}{b} $.

### (d) Question

Now assume the following prior for $ \beta $: $ \beta_1, \cdots, \beta_p $ are independent and identically distributed according to a normal distribution with mean zero and variance $ c $. Write out the posterior for $ \beta $ in this setting.

### (d) Answer

The posterior distributed according to Normal distribution with mean 0 and variance $ c $ is:

$$
\begin{align} 
	f(\beta \vert X, Y) \propto f(Y \vert X, \beta) \, p(\beta \vert X) = f(Y \vert X, \beta) \, p(\beta) 
\end{align} 
$$

Our probability distribution function then becomes: 

$$
\begin{align} 
	p(\beta) 
	&= \prod_{i = 1}^{p} p(\beta_i) \newline
	&= \prod_{i = 1}^{p} \frac{ 1 }{ \sqrt{ 2c\pi } } \exp \left( - \frac{ \beta_i^2 }{ 2c } \right) \newline
	&= \left( \frac{ 1 }{ \sqrt{ 2c\pi } } \right)^p \exp \left( - \frac{ 1 }{ 2c } \sum_{i = 1}^{p} \beta_i^2 \right) 
\end{align} 
$$

Substituting our values from (a) and our density function gives us:

$$
\begin{align} 
	&f(Y \vert X, \beta) \, p(\beta) \newline
	&= \left( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right)^n \exp \left( - \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 \right) \left( \frac{ 1 }{ \sqrt{ 2c\pi } } \right)^p \exp \left( - \frac{ 1 }{ 2c } \sum_{i = 1}^{p} \beta_i^2 \right) \newline 
	&= \left( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right)^n \left( \frac{ 1 }{ \sqrt{ 2c\pi } } \right)^p \exp \left( - \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 - \frac{ 1 }{ 2c } \sum_{i = 1}^{p} \beta_i^2 \right) 
\end{align} 
$$

### (e) Question

Argue that the ridge regression estimate is both the mode and the mean for $ \beta $ under this posterior distribution.

### (e) Answer

Like from part (c), showing that the Ridge Regression estimate for $ \beta $ is the mode and mean under this posterior distribution is the same thing as showing that the most likely value for $ \beta $ is given by the lasso solution with a certain $ \lambda $.

We can do this by taking our likelihood and posterior and showing that it can be reduced to the canonical Ridge Regression Equation 6.5 from the book.

Once again, we can take the logarithm of both sides to simplify it:

$$
\begin{align} 
	&\log \left ( f(Y \vert X, \beta) \, p(\beta) \right ) \newline
	&= \left ( \frac{1}{ \sigma \sqrt{2\pi} } \right )^n \left ( \frac{ 1 }{ \sqrt{ 2c\pi } } \right )^p \exp \left ( - \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left [ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right ]^2 - \frac{ 1 }{ 2c } \sum_{i = 1}^{p} \beta_i^2 \right ) \newline 
	&= \log \left [ \left ( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right )^n \left ( \frac{ 1 }{ \sqrt{ 2c\pi } } \right )^p \right ] - \left ( \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right ]^2 + \frac{ 1 }{ 2c } \sum_{i = 1}^{p} \beta_i^2 \right ) 
\end{align} 
$$

We want to maximize the posterior, this means: 

$$
\begin{align} 
	& \arg \max_\beta \, f(\beta \vert X, Y) \newline
	&= \arg \max_\beta \, \log \left[ \left( \frac{ 1 }{ \sigma \sqrt{2\pi} } \right)^n \left( \frac{ 1 }{ \sqrt{ 2c\pi } } \right)^p \right] - \left( \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 + \frac{ 1 }{ 2c } \sum_{i = 1}^{p} \beta_i^2 \right) 
\end{align}
$$

Since we are taking the difference of two values, the maximum of this value is the equivalent to taking the difference of the second value in terms of $ \beta $. This results in:

$$
\begin{align} 
	&= \arg \min_\beta \, \left( \frac{ 1 }{ 2\sigma^2 } \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 + \frac{ 1 }{ 2c } \sum_{i = 1}^{p} \beta_i^2 \right) \newline 
	&= \arg \min_\beta \, \left( \frac{ 1 }{ 2\sigma^2 } \right) \left( \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 + \frac{ \sigma^2 }{ c } \sum_{i = 1}^{p} \beta_i^2 \right) 
\end{align} 
$$

By letting $ \lambda = \frac{\sigma^2}{c} $, we end up with:

$$
\begin{align} 
	&= \arg \min_\beta \, \left( \frac{ 1 }{ 2\sigma^2 } \right) \left( \sum_{i = 1}^{n} \left[ Y_i - (\beta_0 + \sum_{j = 1}^{p} \beta_j X_{ij}) \right]^2 + \lambda \sum_{i = 1}^{p} \beta_i^2 \right) \newline 
	&= \arg \min_\beta \, \text{RSS} + \lambda \sum_{i = 1}^{p} \beta_i^2 
\end{align} 
$$

which we know is the Ridge Regression from Equation 6.5 in the book. Thus we know that when the posterior comes from a normal distribution with mean zero and variance $ c $, the mode for $ \beta $ is given by the Ridge Regression solution when $ \lambda = \frac{\sigma^2}{c} $. Since the posterior is Gaussian, we also know that it is the posterior mean.
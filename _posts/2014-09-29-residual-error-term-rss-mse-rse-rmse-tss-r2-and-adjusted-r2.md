---
layout: post-mathjax
title: "Residual, Error Term, RSS, MSE, RSE (RMSE), TSS, R<sup>2</sup> and Adjusted R<sup>2</sup>"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结一下这几个概念，实在有点乱。

-----

## 1. Residual vs Error Term

首先我们还是搬出我们的三层 Relationship 关系：

* (i) the unknown true relationship, $$ Y = f(X) + \epsilon $$
	* (ii) we make some assumptions about the $$ f(X) $$, e.g. $$ f(X) $$ is linear.
		* (iii) because we cannot get the exact parameters of $$ f(X) $$, we can only estimate the coefficients of this assumed relationship, based on the training data. Then we get $$ \hat Y = \hat{f}(X) $$
		
Error Term $$ \epsilon $$:

* $$ \epsilon = Y - f(X) $$
* 严格来说是 "真实 $$ Y $$ 值" 和 "真实 Relationship 的预测值" 之间的差值，你拿个 sample 或者 training data set 是算不出来的（因为真实 Relationship 你不知道）
* 是 (i) 内部的问题，和 (ii) (iii) 无关

Residual $$ e $$:

* $$ e = Y - \hat Y = Y - \hat{f}(X) $$
* 严格来说是 "observed $$ Y $$" 与 "fitted (predicted) $$ Y $$" 之间的差距。简单说就是你 data set 里的 $$ Y $$ 和你模型预测出来的 $$ Y $$ 值的差，training error 和 test error 说的就是这，它是真实可测的。
* 可以看做是 (i) 和 (iii) 之间的问题

[What is the difference between the stochastic error term and the residual?](http://www.answers.com/Q/What_is_the_difference_between_the_stochastic_error_term_and_the_residual) 这里的水友总结得还不错：

> ..... Error term is theoretical concept that can never be observed, but the residual is a real-world value that is calculated for each observation every time a regression is run. The residual can be thought of as an estimate of the error term, and $$ \epsilon $$ could have been denoted by $$ \hat e $$.

感觉其实就是 population mean 和 sample mean 的关系。

## 2. RSS 是万恶之源

### 2.1 RSS 其实就是 $$ J(\theta) $$

We define the **Residual Sum of Squares (RSS)** as

$$
\begin{equation}
	RSS = \sum_{i=1}^{n}{e_i^2} = \sum_{i=1}^{n}{(y_i - \hat{f}(x_i))^2}
	\tag{2.1}
\end{equation}
$$

The least squares approach chooses coefficients that minimize the RSS. 所以说 RSS 它其实就是 $$ J(\theta) $$！

### 2.2 $$ MSE = \frac{1}{n} RSS $$?

我们在 Statistical Learning 的 [2.1 Measuring the Quality of Fit](/machine-learning/2014/09/20/isl-statistical-learning#Measuring-the-Quality-of-Fit) 有说：In the regression setting, the most commonly-used measure is the **Mean Squared Error (MSE)**

$$
\begin{equation}
	MSE = \frac{1}{n} \sum_{i=1}^{n}{(y_i - \hat{f}(x_i))^2}
	\tag{2.2}
	\label{eq2.2}
\end{equation}
$$

很快有细心的水友 [发现](http://stats.stackexchange.com/questions/73540/mean-squared-error-and-residual-sum-of-squares)：咦？这样岂不是有 $$ MSE = \frac{1}{n} RSS $$ 么？

后面有两位热心水友回答：

1. wiki 的 [Errors and residuals in statistics](http://en.wikipedia.org/wiki/Errors_and_residuals_in_statistics#Regressions) 说：In regression analysis, the term MSE is sometimes used to refer to the unbiased estimate of error variance: the RSS divided by the degrees of freedom.
2. Usually, when you encounter a MSE in actual empirical work, it is not $$ \frac{RSS}{N} $$ but $$ \frac{RSS}{N-K} $$ where $$ K $$ is the number (including the intercept) of right-hand-side variables in some regression model.

所以这个关系只能说是大致成立，要根据具体的 model 来定，你有这个印象就行。下面你很快能看到一个使用 $$ \frac{RSS}{N-K} $$ 的地方。

### 2.3 Training MSE 是一种 Training Error，Test MSE 是一种 Test Error

training error 并没有具体的定义，在 linear regression 里可以是 squared error $$ (y_i - \hat{f}(x_i))^2 $$ 形式，也可以是 absolute error $$ \lvert y_i - \hat{f}(x_i) \rvert $$ 形式（参这个 [Cross Validation 讲义](http://math.arizona.edu/~hzhang/math574m/2015Lect14_CV.pdf)）。Ng 的课上是直接把 $$ J(\theta) $$ 当做 training error，在 sample size $$ n $$ 一定的情况下也没什么不妥。在 logistic regression 里估计应该是用 error rate 之类的了。

Training MSE 其实还是个挺常用的 Training Error。你在看到 MSE 前面加了 "Training" 修饰的时候要反应过来这说的应该是 Training Error 的问题（比如 "overfitting 导致 low training MSE" 这样的陈述），但是不要把这个两个概念等同起来。

### 2.4 RSE 和 RMSE 是一回事

这篇 [Correlation and Regression 的讲义](http://www.pitt.edu/~upjecon/MCG/STAT/Correlation.and.Regression.pdf) 里说：

> **RSE**, **Residual Standard Rrror**, is the phrase in R language which means RMSE. 

也就是说：

$$
	RSE = RMSE
$$

又因为：

* MSE: Mean Squared Error
* **RMSE**: **Root Mean Squared Error**

所以显而易见

$$
\begin{equation}
	RMSE = \sqrt{MSE}
	\tag{2.3}
\end{equation}
$$

如果按 $$ (\ref{eq2.2}) $$ 的定义，那么 

$$
\begin{equation}
	RMSE = \sqrt{MSE} = \sqrt{\frac{1}{n} RSS}
	\tag{2.4}
\end{equation}
$$

但是 [书上](http://erikyao.github.io/machine-learning/2014/09/21/isl-linear-regression-part-1#RSE) simple linear regression 里用的却是 

$$
\begin{equation}
	RSE = \sqrt{\frac{1}{n-2} RSS}
	\tag{2.5}
\end{equation}
$$

可见这里 MSE 用了 $$ \frac{RSS}{N-K} $$ 的形式。

## 3. TSS 不是 RSS 那一伙儿的

**TSS**, **total sum of squares**, is defined as

$$
\begin{equation}
	TSS = \sum_{i=1}^{n}{(y_i - \bar y)^2}
	\tag{3.1}
\end{equation}
$$

where $$ \bar y $$ is the sample mean. 

TSS 也是个在 sample 上计算的值。

## 4. $$R^2$$ and Adjusted $$R^2$$

$$
\begin{equation}
	R^2 = 1 - \frac{RSS}{TSS}
	\tag{4.1}
\end{equation}
$$

$$
\begin{equation}
	\text{Adjusted } R^2 = 1 - \frac{RSS/(n-d-1)}{TSS/(n-1)} = 1 - \frac{n-1}{n-d-1} \frac{RSS}{TSS}
	\tag{4.2}
\end{equation} 
$$

## 5. Chain Reaction

当趋向 overfitting 时（比如 predictor 增多，模型变 flexible 时）：

* RSS ↓
	* MSE ↓
	* RMSE ↓ RSE ↓
* TSS →
* $$R^2$$ ↑
* Adjusted $$R^2$$ 不好说（这正是 adjustment 的体现）
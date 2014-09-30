---
layout: post-mathjax
title: "Machine-Learning: Linear Model Selection and Regularization - Part 1"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结自 Chapter 6, An Introduction to Statistical Learning.

-----

## 目录

### 0. [Overview](#Overview)

### 1. [Subset Selection](#SS)

- [1.1 Best Subset Selection](#BSS)
- [1.2 Stepwise Selection](#SwS)
	- [1.2.1 Forward Stepwise Selection](#FSwS)
	- [1.2.2 Backward Stepwise Selection](#BSwS)
	- [1.2.3 Hybrid Approaches](#HSwS)
- [1.3 Choosing the Optimal Model](#Choosing-the-Optimal-Model)
	- [1.3.1 \\( C\_p \\), AIC, BIC, and Adjusted R^2](#adjusted-statistic)
	- [1.3.2 Validation and Cross-Validation](#Validation-and-CV)

### 2. [Shrinkage Methods](#Shrinkage)

- [2.1 Ridge Regression](#RidgeR)
- [2.2 The Lasso](#Lasso)
- [2.3 Selecting the Tuning Parameter](#Select-lambda)

-----

## <a name="Overview"></a>0. Overview

In the regression setting, the standard linear model

$$
\begin{equation}
	Y = \beta\_0 + \beta\_1 X\_1 + \cdots + \beta\_p X\_p
	\tag{1.1}
	\label{eq1.1}
\end{equation} 
$$

is commonly used to describe the relationship.

In the chapters that follow, we consider some approaches for extending the linear model framework.

* In Chapter 7 we generalize \\( (\ref{eq1.1}) \\) in order to accommodate non-linear, but still additive, relationships.
* In Chapter 8 we consider even more general non-linear models.

However, the linear model has distinct advantages in terms of inference and, on real-world problems, is often surprisingly competitive in relation to non-linear methods. Hence, before moving to the non-linear world, we discuss in this chapter some ways in which the simple linear model can be improved, by replacing plain least squares fitting with some alternative fitting procedures.

As we will see, alternative fitting procedures can yield better _prediction accuracy_ and _model interpretability_.

* Prediction Accuracy: 
	* If \\( n \gg p\\), the least squares estimates tend to also have low variance, and hence will perform well on test observations.
	* However, if \\( n \\) is not much larger than \\( p \\), then there can be a lot of variability in the least squares fit, resulting in overfitting and consequently poor predictions.
	* Even worse, when \\( n < p\\), least squares cannot be used.
	* By **constraining** or **shrinking** the estimated coefficients, we can often substantially reduce the variance at the cost of a negligible increase in bias. This can lead to substantial improvements in the prediction accuracy.
* Model Interpretability:
	* It is often the case that some of the variables used in a multiple regression model are in fact not associated with the response. These _irrelevant_ variables leads to unnecessary complexity in the resulting model.
	* Now least squares is extremely unlikely to yield any coefficient estimates that are exactly zero for the potential irrelevant variables.
	* In this chapter, we see some approaches for automatically performing **feature selection** or **variable selection** to exclude irrelevant variables from a multiple regression model.
	
In this chapter, we discuss three important alternatives.

* Subset Selection: identifying a subset of the \\( p \\) predictors that we believe to be related to the response.
* Shrinkage:
	* fitting a model involving all \\( p \\) predictors. However, the estimated coefficients are shrunken towards zero relative to the least squares estimates. This shrinkage (also known as **regularization**) has the effect of reducing variance.
	* Depending on what type of shrinkage is performed, some of the coefficients may be estimated to be exactly zero. Hence, shrinkage methods can also perform variable selection.
* Dimension Reduction: 
	* projecting the \\( p \\) predictors into a \\( M \\)-dimensional subspace, where \\( M < p \\)
	* by computing M different linear combinations, or projections, of the variables
	* 说得这么玄乎其实就是 PCA
	
## <a name="SS"></a>1. Subset Selection

这里说的其实就是 Linear Regression - Part 1 那篇的 [2.4 Question 2: How to Decide on Important Variables? Or, do all the predictors help to explain \\( Y \\), or is only a subset of the predictors useful?](http://localhost:4000/machine-learning/2014/09/21/machine-learning-linear-regression-part-1/#Mlr-Q2)

### <a name="BSS"></a>1.1 Best Subset Selection

简单说就是试遍 \\( p \\) 个 predictor 的所有组合，从中选取 best model fit。

具体的 algorithm 是：

1. Let \\( M_0 \\) denote the **null** model, which contains no predictors. 
	* This model simply predicts the sample mean for each observation.
2. For \\( k = 1, 2, \cdots, p \\):
	* Fit all \\( \left \( \begin{array}{c} n \\\\ k \end{array} \right \) \\) models that contain exactly \\( k \\) predictors.
	* Pick the best among these \\( \left \( \begin{array}{c} n \\\\ k \end{array} \right \) \\) models, and call it \\( M_k \\).
		* Here "best" is defined as having the smallest RSS, or equivalently largest R^2.
3. Select the best model from \\( M\_0, \cdots, M\_p \\), using cross-validated prediction error, \\( C\_p \\), AIC, BIC, or adjusted R^2.

一共会 try 2^p 个 model。

感觉是不是有点像多路排序算法？而且我还看到了使用 MapReduce 的可能……

为什么 Step 3 不继续用 RSS 或者 R^2? 

* Because the RSS of these \\( p + 1 \\) models decreases monotonically, and the R^2 increases monotonically, as the number of features included in the models increases. Therefore, if we use these statistics to select the best model, then we will always end up with a model involving all of the variables.
* More generally, a low RSS or a high R^2 indicates a model with a low training error, whereas we wish to choose a model that has a low test error.

Although we have presented best subset selection here for least squares regression, the same ideas apply to other types of models, such as logistic regression. In the case of logistic regression, instead of ordering models by RSS in Step 2, we instead use the **deviance**, a measure that plays the role of RSS for a broader class of models. The deviance is -2 times the maximized log-likelihood; the smaller the deviance, the better the fit.

Best subset selection becomes computationally infeasible for values of p greater than around 40.
	* There are computational shortcuts — so called branch-and-bound techniques — for eliminating some choices, but they have their limitations as \\( p \\) gets large. 
	* They also only work for least squares linear regression.
	
### <a name="SwS"></a>1.2 Stepwise Selection

我们称这个搜索空间是 model space。相比 Best Subset Selection 而言，Stepwise Selection performs a **guided** search over model space, and so the **effective** model space will be greatly smaller when \\( p \\) is large.

#### <a name="FSwS"></a>1.2.1 Forward Stepwise Selection

The Forward Stepwise Selection algorithm goes here:

1. Let \\( M_0 \\) denote the **null** model, which contains no predictors. 
2. For \\( k = 1, 2, \cdots, p-1 \\):
	* Fit all \\( p-k \\) models that that augment ([ɔ:gˈment], =increase) the predictors in \\( M_k \\) with one additional predictor.
	* Pick the best among these \\( p-k \\) models, and call it \\( M\_{k+1} \\).
		* Here "best" is defined as having the smallest RSS, or equivalently largest R^2.
3. Select the best model from \\( M\_0, \cdots, M\_p \\), using cross-validated prediction error, \\( C\_p \\), AIC, BIC, or adjusted R^2.

一共会 try \\( \frac{p(p + 1)}{2} + 1 \\) 个 model。

相比 Best Subset Selection 而言，Forward Stepwise Selection 最大的优势是计算量小了很多。缺点是可能最后的 model 不太准，尤其是 "最优的 model 实际并不包含 \\( k=1 \\) 时的 predictor" 这样的情况。具体见 P208。

Forward stepwise selection can be applied even in the high-dimensional setting where \\( n < p \\); however, in this case, it is possible to construct submodels \\( M\_0, \cdots, M\_{n-1} \\) only.

#### <a name="BSwS"></a>1.2.2 Backward Stepwise Selection

The Backward Stepwise Selection algorithm goes here:

1. Let \\( M_p \\) denote the **full** model, which contains all \\( p \\) predictors. 
2. For \\( k = p, p-1, \cdots, 1 \\):
	* Fit all \\( k \\) models that contain all but one of the predictors in \\( M_k \\), for a total of \\( k − 1 \\) predictors.
	* Pick the best among these \\( k \\) models, and call it \\( M\_{k-1} \\).
		* Here "best" is defined as having the smallest RSS, or equivalently largest R^2.
3. Select the best model from \\( M\_0, \cdots, M\_p \\), using cross-validated prediction error, \\( C\_p \\), AIC, BIC, or adjusted R^2.

一共会 try \\( \frac{p(p + 1)}{2} + 1 \\) 个 model。

Also like forward stepwise selection, backward stepwise selection is not guaranteed to yield the best model.

Differently, backward stepwise selection requires \\( n>p \\) (so that the full model can be fit).

#### <a name="HSwS"></a>1.2.3 Hybrid Approaches

* Variables are added to the model sequentially, in analogy to forward selection. 
* However, after adding each new variable, the method may also remove any variables that no longer provide an improvement in the model fit. 
* Such an approach attempts to more closely mimic best subset selection while retaining the computational advantages.

### <a name="Choosing-the-Optimal-Model"></a>1.3 Choosing the Optimal Model

前面已经说过：

> …… a low RSS or a high R^2 indicates a model with a low training error, whereas we wish to choose a model that has a low test error.

所以我们在 Subset Selection 的 Step 3 没有用 RSS 和 R^2。

这其实反映了另外一个问题：我们要用 test error 做标准来选 model，那么该如何 estimate test error 呢？（已知直接估计 training error = test error 是明显不妥的）There are two common approaches:

* Indirectly estimate test error by making an **adjustment** to the training error to account for the bias due to overfitting
	* 也就是下面要说的、Subset Selection 的 Step 3 里用到的 \\( C\_p \\), AIC, BIC, or adjusted R^2
* Directly estimate the test error using either a validation set approach or a CV approach.

### <a name="adjusted-statistic"></a>1.3.1 \\( C\_p \\), AIC, BIC, and Adjusted R^2

We show in Chapter 2 that the training set MSE is generally an underestimate of the test MSE. (Recall that \\( MSE = RSS/n \\).) This is because when we fit a model to the training data using least squares, we specifically estimate the regression coefficients such that the training RSS (but not the test RSS) is as small as possible. In particular, the training error will decrease as more variables are included in the model, but the test error may not. Therefore, training set RSS and training set R^2 cannot be used to select from among a set of models with different numbers of variables.

However, a number of techniques for adjusting the training error are available, which can be used to select among a set of models with different numbers of variables. We introduce 4 such approaches here:

* \\( C\_p \\)
* Akaike information criterion (AIC)
	* criterion, [kraɪˈtɪəriən], a standard on which a judgment or decision may be based
* Bayesian information criterion (BIC)
* adjusted R^2

For a fitted least squares model containing \\( d \\) predictors, the \\( C\_p \\) estimate of test MSE is computed using the equation

$$
\begin{equation}
	C\_p = \frac{1}{n} (RSS + 2d\hat{\sigma}\^2)
	\tag{1.2}
\end{equation} 
$$

where \\( \hat{\sigma}\^2 \\) is an estimate of \\( \sigma\^2 \\), the variance of the error \\( \epsilon \\) in \\( (\ref{eq1.1}) \\). The MSE from the full model is often used to estimate \\( \sigma\^2 \\) (参 Statistical Learning [章节 2.2 The Bias-Variance Trade-Off 的公式 (2.2)](http://erikyao.github.io/machine-learning/2014/09/20/machine-learning-statistical-learning/#mjx-eqn-eq2.2)。full model 下 training MSE 应该很小，所以能贴近 \\( \sigma\^2 \\)，i.e. \\( Var(\epsilon) \\)，i.e. the irreducible error).

Essentially, the \\( C\_p \\) statistic adds a penalty of \\( 2d\hat{\sigma}\^2 \\) to the training RSS in order to adjust for the fact that the training error tends to underestimate the test error. Clearly, the penalty increases as the number of predictors in the model increases; this is intended to adjust for the corresponding decrease in training RSS.

Beyond the scope of this book, one can show that if \\( \hat{\sigma}\^2 \\) is an unbiased estimate of \\( \sigma\^2 \\), then \\( C\_p \\) is an unbiased estimate of test MSE. As a consequence, the \\( C\_p \\) statistic tends to take on a small value for models with a low test error.

The AIC criterion is defined for a large class of models fit by maximum likelihood. In the case of the model \\( (\ref{eq1.1}) \\) with Gaussian errors, maximum likelihood and least squares are the same thing. In this case AIC is given by

$$
\begin{equation}
	AIC = \frac{1}{n \hat{\sigma}\^2} (RSS + 2d\hat{\sigma}\^2)
	\tag{1.3}
\end{equation} 
$$

where, for simplicity, we have omitted an additive constant. Hence for least squares models, \\( C\_p \\) and AIC are proportional (成比例的) to each other。

BIC is derived from a Bayesian point of view. For the least squares model with d predictors, the BIC is, up to irrelevant constants, given by

$$
\begin{equation}
	BIC = \frac{1}{n} (RSS + log(n)d\hat{\sigma}\^2)
	\tag{1.4}
\end{equation} 
$$

Notice that BIC replaces the \\( 2d\hat{\sigma}\^2 \\) used by Cp with \\( log(n)d\hat{\sigma}\^2 \\) term, where \\( n \\) is the number of observations. Since \\( log(n) > 2 \\) for any \\( n > 7 \\), the BIC statistic generally places a heavier penalty on models with many variables, and hence may results in the selection of smaller models than \\( C\_p \\).

Recall from Chapter 3 that

$$
\begin{equation}
	R\^2 = 1 - \frac{RSS}{TSS} \\\\
	TSS = \sum{(y\_i − \bar y)\^2}
\end{equation} 
$$

Since RSS always decreases as more variables are added to the model, the R^2 always increases as more variables are added. For a least squares model with \\( d \\) variables, the adjusted R^2 statistic is calculated as

$$
\begin{equation}
	\text{Adjusted } R\^2 = 1 - \frac{RSS/(n-d-1)}{TSS/(n-1)}
	\tag{1.5}
\end{equation} 
$$

Unlike \\( C\_p \\), AIC, and BIC, for which a small value indicates a model with a low test error, a large value of adjusted R^2 indicates a model with a small test error. Maximizing the adjusted R^2 is equivalent to minimizing \\( RSS/(n−d−1) \\).While RSS always decreases as the number of variables in the model increases, \\( RSS/(n−d−1) \\) may increase or decrease, due to the presence of \\( d \\) in the denominator.

### <a name="Validation-and-CV"></a>1.3.2 Validation and Cross-Validation

This procedure has an advantage relative to \\( C_p \\), AIC, BIC, and adjusted R^2, in that it provides a direct estimate of the test error, and makes fewer assumptions about the true underlying model.

不管是用 AIC、BIC 这些指标还是用 CV 来测，都有可能遇到多个模型 more or less equally good 的情况。此时可以用 one-standard-error rule: 

* We first calculate the \\( sd \\) of the estimated test MSE for each model size. 
* And then select the smallest model for which the estimated test error is within one \\( sd \\) of the lowest point on the curve. 
* The rationale here is that if a set of models appear equally good, then we might as well choose the simplest model — that is, the model with the smallest number of predictors.

## <a name="Shrinkage"></a>2. Shrinkage Methods

Shrinkage is a technique that **constrains** or **regularizes** the coefficient estimates, or equivalently, that **shrinks** the coefficient estimates towards zero which can significantly reduce model variance.  

The two best-known shrinkage methods are:

* ridge regression
* the lasso

### <a name="RidgeR"></a>2.1 Ridge Regression

其实就是 Ng 课上的 Regression with Regularization，只不过 Ng 没有取这么多名字。

没有 regularization 时，\\( J(\theta) = RSS \\)，带 regularization 了就是 \\( J(\theta) = RSS + \lambda \sum\_{j=1}\^{p}{\beta\_j\^2} \\)。所谓 Ridge Regression 就是 estimates coefficient that minimize 这个新的 \\( J(\theta) \\)。

Note:

* \\( \lambda \sum\_{j=1}\^{p}{\beta\_j\^2} \\) is called a **shrinkage penalty**, which becomes small when \\( \beta\_1, \cdots, \beta\_n \\) are close to 0, and so it has the effect of shrinking the estimates of \\( \beta \\)s towards 0.
	* shrinkage penalty is not applied to the intercept \\( \beta\_0 \\), because we do not want to — it is simply a measure of the mean value of the response when \\( X=0 \\)
* \\( \lambda \ge 0 \\) is a **tuning parameter**. As \\( \lambda \to \infty \\), the impact of the shrinkage penalty grows, and the ridge regression coefficient estimates will approach 0 more closely.
	* When \\( \lambda \\) is extremely large, then all of the ridge coefficient estimates are basically zero; this corresponds to the null model that contains no predictors.
	* Selecting a good value for \\( \lambda \\) is critical. We can use CV to do this.
	
P216 做了个 application，然后做了个测量。注意测量时用了 \\( \ell\_2 \\) norm 的概念（很简单，一眼就明白）。

P217 讨论了 \\( X \\) scale 的变化（比如长度 unit 从 m 变成 cm）对 shrinkage penalty 的影响，最终得到的结论是：It is best to standardize the predictors **before** applying ridge regression.

P218 讨论了 Why Does Ridge Regression Improve Over Least Squares? 其实很简单：

* Ridge Regression shrinks the estimates of \\( \beta \\)s towards 0
	* => simpler, less flexible model
		* => less overfitting; more underfitting
			* => lower variance; higher bias

Hence, ridge regression works best in situations where the least squares estimates have high variance.

### <a name="Lasso"></a>2.2 The Lasso

Ridge regression does have one obvious disadvantage that, unlike subset selection, ridge regression will include all \\( p \\) predictors in the final model because the shrinkage penalty does shrink all of the coefficients towards zero but it will not set any of them exactly to zero (unless \\( \lambda = \infty \\)). This may not be a problem for prediction accuracy, but it can create a challenge in model interpretation when \\( p \\) is quite large

The lasso is a relatively recent alternative to ridge regression that overcomes this disadvantage, which has \\( J(\theta) = RSS + \lambda \sum\_{j=1}\^{p}{|\beta\_j|} \\)

* The ridge penalty is an \\( \ell\_2 \\) penalty.
* The lasso penalty is an \\( \ell\_1 \\) penalty.

The \\( \ell\_1 \\) penalty has the effect of forcing some of the coefficient estimates to be exactly equal to zero when the tuning parameter \\( \lambda \\) is sufficiently large. Hence, much like best subset selection, the lasso performs variable selection.

As a result, models generated from the lasso are generally much easier to interpret than those produced by ridge regression. We say that the lasso yields **sparse** models — that is, models that involve only a subset of the variables.

P220 介绍了 Another Formulation for Ridge Regression and the Lasso，其实就是引入了一个 budget \\( s \\)，它的值是随 \\( \lambda \\) 变化的。然后可以把条件 "\\( \text{minimize } \left \\{ J(\theta) = RSS + \lambda \sum\_{j=1}\^{p}{|\beta\_j|} \right \\} \\)" 写成

$$
\begin{equation}
	\text{minimize } \left \\{ J(\theta) = RSS \right \\} \text{ subject to } \sum\_{j=1}\^{p}{|\beta\_j|} \leq s 
\end{equation} 
$$

后面那个 subject to 的条件和 budget 可以自由变化，表示各种 regression 方法。

P222 的 FIGURE 6.7. 从几何学的角度解释了为什么 lasso 会驱使某些 coefficient 为 0，值得一看。

P223 起是 Comparing the Lasso and Ridge Regression，提到说：The lasso implicitly assumes that a number of the coefficients truly equal zero. 所以 performance 的好坏还是得看 true relationship 具体是什么情况。但是 true relationship 是不可知的，所以我们实际的做法还是用 CV 来测试。粗略地来说，lasso 也是降 variance 升 bias，然后 interpretability 肯定是要好过 ridge。

P224-225 写的是 A Simple Special Case for Ridge Regression and the Lasso。用了一个理想化的例子，不得不说设计的非常精彩。最终得到的一个感性的认识是：Ridge regression more or less shrinks every dimension of the data by the same proportion, whereas the lasso more or less shrinks all coefficients toward zero by a similar amount, and sufficiently small coefficients are shrunken all the way to zero.

P226 是 Bayesian Interpretation for Ridge Regression and the Lasso，我会单独开一篇来科普一下。

### <a name="Select-lambda"></a>2.3 Selecting the Tuning Parameter

P227。主要说的是用 CV 来选 \\( \lambda \\)（但是选完之后要 re-fit 一下）。举了两个例子，告诉我们 CV 测量得来的几种图应该怎么分析，值得一看（尤其是 FIGURE 6.13）。
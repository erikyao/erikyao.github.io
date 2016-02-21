---
layout: post-mathjax
title: "ISL: Linear Regression - Part 1"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结自 Chapter 3, An Introduction to Statistical Learning.

-----

## 目录
  
### 0. [Overview](#Overview)

### 1. [Simple Linear Regression](#Simple-Linear-Regression)
  
- [1.1 Model](#Slr-Model)   
- [1.2 Estimating the Coefficients](#Estimating-the-Coefficients) 
	- [1.2.1 Residual and RSS](#Residual-and-RSS)
	- [1.2.2 $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$](#beta0-and-beta1)
- [1.3 Assessing the Accuracy of the Coefficient Estimates](#Assessing-the-Accuracy-of-the-Coefficient-Estimates)
	- [1.3.1 True Relationship](#True-Relationship)
	- [1.3.2 Estimate Basis](#Estimate-Basis)
		- [Unbiased Estimate](#Unbiased-Estimate)
		- [How far off will a single estimate $$ \hat \mu $$ be?](#Standard-Error)
	- [1.3.3 From $$ \hat \mu $$ to $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$](#mu-to-beta)
		- [Population Regression Line and Least Squares Line](#PRL-and-LSL)
		- [Analogy](#Analogy)
	- [1.3.4 Accuracy Measurements for $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$](#Accuracy-Measurements-for-beta)
		- [They are unbiased](#beta-are-unbiased)
		- [Their Standard Error](#Standard-Error-of-beta)
		- [Their 95% CI](#CI-of-beta)
		- [Hypothesis Tests on the Coefficients (t-statistic and t-test)](#Hypothesis-Tests-on-beta)
- [1.4 Assessing the Accuracy of the Model](#Assessing the-Accuracy-of-the-Model)
	- [1.4.1 RSE: Residual Standard Error](#RSE)
	- [1.4.2 R^2 Statistic](#R-squared)

### 2. [Multiple Linear Regression](#Multiple-Linear-Regression)

- [2.1 Model](#Mlr-Model)
- [2.2 Estimating the Coefficients](#Estimating-the-mlr-Coefficients)
- [2.3 Question 1: Is There a Relationship Between the Response and Predictors? Or, among $$ \hat{\beta}_1, \cdots, \hat{\beta}_p $$, is there at least one $$ \hat{\beta}_i \neq 0 $$? (F-statistic and F-test)](#Mlr-Q1)
- [2.4 Question 2: How to Decide on Important Variables? Or, do all the predictors help to explain $$ Y $$, or is only a subset of the predictors useful?](#Mlr-Q2)
- [2.5 Question 3: How to Measure the Model Fit? Or, how well does the model fit the data?](#Mlr-Q3)
- [2.6 Question 4: How accurate is our prediction?](#Mlr-Q4)
	- [2.6.1 CI for $$ \hat Y $$](#CI-for-hat-Y)
		- [Population Regression Plane and Least Squares Plane](#PRP-and-LSP)
	- [2.6.2 Model Bias](#Model-Bias)
	- [2.6.3 Prediction Intervals](#Prediction-Intervals)
		
-----

## <a name="Overview"></a>0. Overview

Linear Regression is a **supervised** learning approach, especially useful for **predicting** a **quantitative** response.  

It serves to answer these questions:

1. Is there a relationship, between $$ X $$ and $$ Y $$?
2. How strong is the relationship?
3. Which $$ x_i $$'s contribute to $$ Y $$?
4. How accurately can we estimate the effect of each $$ x_i $$ on $$ Y $$?
5. How accurately can we predict future $$ Y $$?
6. Is the relationship linear?
	* 非常好的一个问题，回归问题本质
7. Is there synergy among $$ x_i $$'s?
	* Perhaps spending $50,000 on $$ x_a $$ and $50,000 on $$ x_b $$ results in more sales $$ Y $$ than allocating $100,000 to either individually. In marketing, this is known as a _synergy_ ([ˈsɪnədʒi], 协同) effect, while in statistics it is called an _interaction_ effect.
	
## <a name="Simple-Linear-Regression"></a>1. Simple Linear Regression

### <a name="Slr-Model"></a>1.1 Model

The simplicity of the method lies in the fact that it predicts a quantitative response $$ Y $$ on a **single predictor** $$ X $$. It assumes that there is approximately a linear relationship between $$ X $$ and $$ Y $$, as:

$$
\begin{equation}
	Y \approx \beta_0 + \beta_1 X
	\tag{1.1}
\end{equation} 
$$

We can describe this relationship as "regressing $$ Y $$ onto $$ X $$". Together, $$ \beta_0 $$ and $$ \beta_1 $$ are known as the model coefficients or parameters. Once we have used our training data to produce estimates $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$ for the model coefficients, we can predict 

$$
\begin{equation}
	\hat y = \hat{\beta}_0 + \hat{\beta}_1 x
	\tag{1.2}
\end{equation} 
$$

where $$ \hat y $$ indicates a prediction of $$ Y $$ on the basis of $$ X = x $$. Here we use a hat symbol, ˆ , to denote the estimated value for an unknown parameter or coefficient, or to denote the predicted value of the response.

We also assume that the true relationship between $$ X $$ and $$ Y $$ takes the form $$ Y = f(X) + \epsilon $$ for some unknown function $$ f $$, where $$ \epsilon $$ is a random error term with $$ mean(\epsilon) = 0 $$. If $$ f $$ is to be approximated by a linear function, then we can write this relationship as

$$
\begin{equation}
	Y = \beta_0 + \beta_1 X + \epsilon
	\tag{1.3}
	\label{eq1.3}
\end{equation} 
$$

The error term $$ \epsilon $$ is a catch-all for what we miss with this simple model: the true relationship is probably not linear, there may be other variables that cause variation in $$ Y $$, and there may be measurement error. We typically assume that the error term is independent of $$ X $$.  

这个 error term $$ \epsilon $$ 有点物理上 "测量误差" 的感觉。我们做 estimate 就像是在 "估读"。

### <a name="Estimating-the-Coefficients"></a>1.2 Estimating the Coefficients

We want to find an intercept $$ \hat{\beta}_0 $$ and a slope $$ \hat{\beta}_1 $$ such that the resulting line is as **close** as possible to the n training data points.

There are a number of ways of measuring **closeness**. However, by far the most common approach involves minimizing the _least squares_ criterion.  

Before introducing the _least squares_ approach, let's meet residual first.  

#### <a name="Residual-and-RSS"></a>1.2.1 Residual and RSS
 
Let $$ \hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1 x_i $$ be the prediction for $$ Y $$ based on the i^th value of $$ X $$.  

Then $$ e_i = y_i − \hat{y_i} $$ represents the i^th **residual** — this is the difference between the i^th observed response value and the i^th response value that is predicted by our linear model. 

We define the **residual sum of squares** (RSS) as

$$
\begin{align}
	RSS 
	&= e_1^2 + e_2^2 + \cdots + e_n^2 \\
	&= (y_1 - \hat{\beta}_0 - \hat{\beta}_1 x_1)^2 + \cdots + (y_n - \hat{\beta}_0 - \hat{\beta}_1 x_n)^2
	\tag{1.4}
\end{align}
$$

#### <a name="beta0-and-beta1"></a>1.2.2 $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$

The least squares approach chooses $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$ to minimize the RSS, which are

$$
\begin{align}
	\hat{\beta}_1 
	&= \frac{\sum_{i=1}^{n}{(x_i - \bar x)(y_i - \bar y)}}{\sum_{i=1}^{n}{(x_i - \bar x)^2}} \\
	\hat{\beta}_0 
	&= \bar y - \hat{\beta}_1 \bar x
	\tag{1.5}
	\label{eq1.5}
\end{align}
$$

where $$ \bar y \equiv \frac{1}{n} \sum_{i=1}^{n}{y_i} $$ and $$ \bar x \equiv \frac{1}{n} \sum_{i=1}^{n}{x_i} $$ are the sample means.  

In other words, $$ (\ref{eq1.5}) $$ defines the **least squares coefficient estimates** for simple linear regression.

### <a name="Assessing-the-Accuracy-of-the-Coefficient-Estimates"></a>1.3 Assessing the Accuracy of the Coefficient Estimates

#### <a name="True-Relationship"></a>1.3.1 True Relationship

注意这里有三个 Relationship 层次：

* (i) the unknown true relationship, $$ Y = f(X) + \epsilon $$
	* (ii) we assume the relationship is linear, $$ Y = \beta_0 + \beta_1 X + \epsilon $$
		* (iii) we estimate the coefficients of this assumed linear relationship, based on the training data, $$ \hat Y = \hat{\beta}_0 + \hat{\beta}_1 X $$
		
或者你可以把 (i)~(ii) 和 (ii)~(iii) 都看做 "true relationship ~ estimate" 的关系。  

Assessing the Accuracy of the Coefficient Estimates，那肯定是 层次(ii) 和 层次(iii) 之间的问题。

#### <a name="Estimate-Basis"></a>1.3.2 Estimate Basis

Using information from a sample to estimate characteristics of a large population is a standard statistical approach.  

For example, suppose that we are interested in knowing the population mean $$ \mu $$ of some random variable $$ Y $$. Unfortunately, $$ \mu $$ is unknown, but we do have access to n observations from $$ Y $$, which we can write as $$ y_1, \cdots, y_n $$, and which we can use to estimate $$ \mu $$. A reasonable estimate is $$ \hat \mu = \bar y $$, where $$ \bar y = \frac{1}{n} \sum_{i=1}^{n}{y_i} $$ is the sample mean. The sample mean and the population mean are different, but in general the sample mean will provide a good estimate of the population mean.  

##### <a name="Unbiased-Estimate"></a>Unbiased Estimate

If we use the sample mean $$ \hat \mu $$ to estimate $$ \mu $$, this estimate is **unbiased**, in the sense that on average, we expect $$ \hat \mu $$ to equal $$ \mu $$. It means that on the basis of one particular set of observations $$ y_1, \cdots, y_n $$, $$ \hat \mu $$ might overestimate $$ \mu $$, and on the basis of another set of observations, $$ \hat \mu $$ might underestimate $$ \mu $$. But if we could average a huge number of estimates of $$ \mu $$ obtained from a huge number of sets of observations, then this average would exactly equal $$ \mu $$. Hence, an unbiased estimator does not **systematically** over- or under-estimate the true parameter.

##### <a name="Standard-Error"></a>How far off will a single estimate $$ \hat \mu $$ be?

We have established that the average of $$ \hat \mu $$'s over many data sets will be very close to $$ \mu $$, but that a single estimate $$ \hat \mu $$ may be a substantial underestimate or overestimate of $$ \mu $$. How far off will $$ \hat \mu $$ be? In general, we answer this question by computing the **standard error** of $$ \hat \mu $$, as

$$
\begin{equation}
	Var(\hat \mu) = SE(\hat \mu)^2 = \frac{\sigma^2}{n}
	\tag{1.6}
\end{equation} 
$$

where $$ \sigma $$ is the standard deviation of the realizations $$ y_i $$ of Y (In probability and statistics, an observed valuea is also known as a realization, so you can refer "realizations" just to "a data set").

Roughly speaking, the standard error tells us the average amount that this estimate $$ \hat \mu $$ differs from the actual value of $$ \mu $$ (Central Limit Theorem, $$ \hat \mu \to \sim \mbox{N}(\mu, \frac{\sigma^2}{n}) $$). It also tells us how this deviation shrinks with n — the more observations we have, the smaller the standard error of $$ \hat \mu $$.

#### <a name="mu-to-beta"></a>1.3.3 From $$ \hat \mu $$ to $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$

$$ \hat \mu $$ 是 sample mean，同时也是 estimate for population mean。类比一下，$$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$ 是 estimates for the model coefficients，那应该也可以叫做 "sample model coefficients"。从这个意义上来说，sample 和 training data set 也是同一层次的概念。

##### <a name="PRL-and-LSL"></a>Population Regression Line and Least Squares Line

The model given by $$ (\ref{eq1.3}) $$ defines the _population regression line_, which is the best linear approximation to the true relationship between $$ X $$ and $$ Y $$.  

The least squares regression coefficient estimates $$ (\ref{eq1.5}) $$ characterize the _least squares line_.

##### <a name="Analogy"></a>Analogy

| OO                           | XX                         | 
|------------------------------|----------------------------|
| population                   | population regression line |
| sample                       | least squares line         |
| population mean $$ \mu $$  | population regression line coefficient $$ \beta_0 $$ and $$ \beta_1 $$ |
| sample mean $$ \hat \mu $$ | least squares regression coefficient estimates $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$ |

#### <a name="Accuracy-Measurements-for-beta"></a>1.3.4 Accuracy Measurements for $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$

##### <a name="beta-are-unbiased"></a>They are unbiased

The property of unbiasedness holds for the least squares coefficient estimates given by $$ (\ref{eq1.5}) $$ as well: if we estimate $$ \beta_0 $$ and $$ \beta_1 $$ on the basis of a particular data set, then our estimates won't be exactly equal to $$ \beta_0 $$ and $$ \beta_1 $$. But if we could average the estimates obtained over a huge number of data sets, then the average of these estimates would be spot on.

##### <a name="Standard-Error-of-beta"></a>Their Standard Error

In a similar vein, we can measure how close $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$ are to the true values $$ \beta_0 $$ and $$ \beta_1 $$, by computing the standard errors

$$
\begin{align}
	SE(\hat{\beta}_0) 
	&= \sigma^2 \left [ \frac{1}{n} + \frac{\bar x^2}{\sum_{i=1}^{n}{(x_i - \bar x)^2}} \right ] \\
	SE(\hat{\beta}_1) 
	&= \frac{\sigma^2}{\sum_{i=1}^{n}{(x_i - \bar x)^2}}
	\tag{1.7}
	\label{eq1.7}
\end{align}
$$

where $$ \sigma^2 = Var(\epsilon) $$

Notes:

* In general, $$ \sigma^2 $$ is not known, but can be estimated from the data. This estimate is known as the **residual standard error**, and is given by the formula $$ RSE = \sqrt{RSS/(n − 2)} $$. 
	* Strictly speaking, when $$ \sigma^2 $$ is estimated from the data, we should write $$ \hat{SE}(\hat{\beta}_1) $$ to indicate that an estimate has been made, but for simplicity of notation we will drop this extra "hat".
* For $$ (\ref{eq1.7}) $$ to be strictly valid, we need to assume that the errors $$ \epsilon_i $$ for each observation are uncorrelated with common variance $$ \sigma^2 $$. This is clearly not true in least squares fit, but the formula still turns out to be a good approximation.
* When $$ x_i $$'s are more spread out, $$ SE(\hat{\beta}_1) $$ is smaller; intuitively we have more leverage to estimate a slope when this is the case. (我觉得这里的意思是 $$ x_i $$'s 越分散，我们对 slope 的 accuracy 的 confidence 就越大)
* When $$ \bar x = 0 $$, $$ SE(\hat{\beta}_0) = SE(\hat{\mu}) $$ and $$ \hat{\beta}_0 = \bar y $$.

##### <a name="CI-of-beta"></a>Their 95% CI

According to Central Limit Theorem, the 95% confidence intervals for $$ \beta_0 $$ and $$ \beta_1 $$ approximately take the form

$$
\begin{align}
	\hat{\beta}_0
	&\pm 2 \cdot SE(\hat{\beta}_0) \\
	\hat{\beta}_1
	&\pm 2 \cdot SE(\hat{\beta}_1)
\end{align}
$$

A 95% confidence interval is defined as a range of values such that with 95% probability, the range will contain the true unknown value of the parameter.

##### <a name="Hypothesis-Tests-on-beta"></a>Hypothesis Tests on the Coefficients (t-statistic and t-test)

The most common hypothesis test involves testing the _null hypothesis_ of

$$
	H_0 \text{ : There is no relationship between } X \text{ and } Y
$$

versus the _alternative hypothesis_

$$
	H_a \text{ : There is some relationship between } X \text{ and } Y
$$

Mathematically, this corresponds to testing

$$
	H_0 \text{ : } \beta_1 = 0
$$

versus

$$
	H_a \text{ : } \beta_1 \neq 0
$$

To test the null hypothesis, we need to determine whether $$ \hat{\beta}_1 $$, our estimate for $$ \beta_1 $$, is sufficiently far from 0 that we can be confident that $$ \beta_1 $$ is non-zero.  

How far is far enough? This depends on the accuracy of $$ \hat{\beta}_1 $$ — that is, it depends on $$ SE(\hat{\beta}_1) $$. If $$ SE(\hat{\beta}_1) $$ is small, then even relatively small values of $$ \hat{\beta}_1 $$ may provide strong evidence that $$ \beta_1 \neq 0 $$. In contrast, if $$ SE(\hat{\beta}_1) $$ is large, then $$ \hat{\beta}_1 $$ must be large in absolute value in order for us to reject the null hypothesis. 

In practice, we compute a t-statistic, given by

$$
\begin{equation}
	t = \frac{\hat{\beta}_1 - 0}{SE(\hat{\beta}_1)}
	\tag{1.8}
\end{equation}
$$

which measures the number of standard deviations that $$ \hat{\beta}_1 $$ is away from 0.

当 $$ \beta_1 = 0 $$ 时，$$ \beta_1 $$ 的 $$ \mu = 0 $$，这个 t-statistic 正好满足 $$ \frac{\bar x - \mu}{SE(\bar x)} $$ 的形式，所以我们从一个单纯的 t-statistic 升级为 t-stastistic following a t-distribution，然后我们这个 Hypothesis Test 就成了名正言顺的 t-test。

题外话：此时这个 t-statistic 满足的是 degree of freedom (df) 为 n-2 的 t-distribution。见 [t-statistic - Definition](http://en.wikipedia.org/wiki/T-statistic#Definition): 

> ... (n − k) degrees of freedom, where n is the number of observations, and k is the number of regressors (including the intercept).

We reject the null hypothesis — that is, we declare a relationship to exist between $$ X $$ and $$ Y $$ — if the p-value, which indicates the probabilities of seeing such t-statistic if $$ H_0 $$ is true, is small enough. Typical p-value cutoffs for rejecting the null hypothesis are 5% or 1%. If p-value is below 5% or 1%, we can conclude that $$ \beta_1 \neq 0 $$.

### <a name="Assessing the-Accuracy-of-the-Model"></a>1.4 Assessing the Accuracy of the Model

和 [1.3 Assessing the Accuracy of the Coefficient Estimates](#Assessing-the-Accuracy-of-the-Coefficient-Estimates) 一样，这里讨论的仍然是  层次(ii) 和 层次(iii) 之间的关系，还没有涉及到 层次(i) 的 true relationship。  

稍有点不同的是，[1.3 Assessing the Accuracy of the Coefficient Estimates](#Assessing-the-Accuracy-of-the-Coefficient-Estimates) 讨论的是单个的 Accuracy of $$ \hat{\beta}_0 $$ and $$ \hat{\beta}_1 $$。这里讨论的是整个 Model 的 Accuracy (against the sample)。

好，下面开始正文。  

Once we have rejected the null hypothesis $$ \beta_1 = 0 $$ in favor of the alternative hypothesis $$ \beta_1 \neq 0 $$, it is natural to want to quantify **the extent to which the model fits the data**. The quality of a linear regression fit is typically assessed using two related quantities: the residual standard error (RSE) and the R^2 statistic.

#### <a name="RSE"></a>1.4.1 RSE: Residual Standard Error

Recall from the model $$ (\ref{eq1.3}) $$ that associated with each observation is an error term $$ \epsilon_i $$. Due to the presence of the error terms, even if we knew the true regression line (i.e. even if $$ \beta_0 $$ and $$ \beta_1 $$ were known), we would not be able to perfectly predict $$ Y $$ from $$ X $$.

The RSE is an estimate of the standard deviation of $$ \epsilon $$ (already mentioned in [Their Standard Error](#Standard-Error-of-beta)). Roughly speaking, it is the average amount that the response will deviate from the true regression line.

$$
\begin{equation}
	RSE = \sqrt{\frac{1}{n-2} RSS} = \sqrt{\frac{1}{n-2} \sum_{i=1}^{n}{(y_i − \hat{y_i})^2}}
	\tag{1.9}
\end{equation}
$$

This means, if the model were correct and the true values of the unknown coefficients $$ \beta_0 $$ and $$ \beta_1 $$ were known exactly, any prediction of $$ Y $$ on $$ X $$ would still be off by about $$ RSE $$ units on average. The percentage error would be $$ \frac{RSE}{mean(Y)} $$. Whether or not this is an acceptable prediction error depends on the problem context.

The RSE is considered a measure of the lack of fit of the model $$ (\ref{eq1.3}) $$ to data, i.e. if underfitting, RSE may be quite large.  

#### <a name="R-squared"></a>1.4.2 R^2 Statistic

The RSE provides an absolute measure of lack of fit of the model $$ (\ref{eq1.3}) $$ to the data. But since it is measured in the units of Y , it is not always clear what constitutes a good RSE.

The R2 statistic provides an alternative measure of fit. It takes the form of a proportion — the proportion of variance explained by the model — and so it always takes on a value between 0 and 1, and is independent of the scale of $$ Y $$(有点像 PCA 的 95% variance retained 的概念).

$$
\begin{equation}
	R^2 = \frac{TSS - RSS}{TSS} = 1 - \frac{RSS}{TSS}
	\tag{1.10}
\end{equation}
$$

where $$ TSS = \sum{(y_i - \bar y)^2} $$ is the **total sum of squares**.  

注意下 acronym ['ækrənɪm]

* RSS: Residual Sum of Squares
* RSE: Residual Standard Error
* TSS: Total Sum of Squares

Notes:

* TSS measures the total variance in the response $$ Y $$, and can be thought of as the amount of variability inherent in the response $$ Y $$ before the regression is performed. 
* In contrast, RSS measures the amount of variability that is left unexplained after performing the regression. 
* Hence, TSS−RSS measures the amount of variability in the response that is explained by performing the regression, and R^2 measures the proportion of variability in $$ Y $$ that can be explained using $$ X $$.
* An R^2 near 0 indicates that the regression did not explain much of the variability in the response; this might occur because the linear model is wrong, or the inherent error $$ Var(\epsilon) $$ is high, or both

Though a proportion, it can still be challenging to determine what is a good R^2 value, and in general, this will depend on the application. For instance, in certain problems in physics, we may know that the data truly comes from a linear model with a small residual error. In this case, we would expect to see an R^2 value that is extremely close to 1, and a substantially smaller R^2 value might indicate a serious problem with the experiment in which the data were generated. On the other hand, in typical applications in biology, psychology, marketing, and other domains, the linear model $$ (\ref{eq1.3}) $$ is at best an extremely rough approximation to the data, and residual errors due to other unmeasured factors are often very large. In this setting, we would expect only a very small proportion of the variance in the response to be explained by the predictor, and an R^2 value well below 0.1 might be more realistic.

Only in simple linear regression setting, $$ R^2 = Cor(X, Y)^2 $$.  

## <a name="Multiple-Linear-Regression"></a>2. Multiple Linear Regression

### <a name="Mlr-Model"></a>2.1 Model

$$
\begin{equation}
	Y = \beta_0 + \beta_1 X_1 + \cdot + \beta_p X_p + \epsilon
	\tag{2.1}
	\label{eq2.1}
\end{equation} 
$$

We interpret $$ \beta_j $$ as the average effect on $$ Y $$ of a one unit increase in j^th predictor, $$ X_j $$, holding all other predictors fixed.

### <a name="Estimating-the-mlr-Coefficients"></a>2.2 Estimating the Coefficients

The regression coefficients $$ \beta_0, \beta_1, \cdots, \beta_p $$ in $$ (\ref{eq2.1}) $$ are unknown, and must be estimated. Given estimates $$ \hat{\beta}_0, \hat{\beta}_1, \cdots, \hat{\beta}_p $$, we can make predictions using the formula

$$
\begin{equation}
	\hat Y = \hat{\beta}_0 + \hat{\beta}_1 X_1 + \cdots + \hat{\beta}_p X_p
	\tag{2.2}
\end{equation} 
$$

The parameters are estimated using the same least squares approach. We choose $$ \hat{\beta}_0, \hat{\beta}_1, \cdots, \hat{\beta}_p $$ to minimize the sum of squared residuals

$$
\begin{align}
	RSS 
	&= \sum_{i=1}^{n}{(y_i - \hat{y}_i)^2} \\
	&= \sum_{i=1}^{n}{(y_i - \hat{\beta}_0 - \hat{\beta}_1 x_{i1} - \cdots - \hat{\beta}_p x_{ip})^2}
	\tag{2.3}
\end{align}
$$

The values $$ \hat{\beta}_0, \hat{\beta}_1, \cdots, \hat{\beta}_p $$ are known as the multiple least squares regression coefficient estimates.

### <a name="Mlr-Q1"></a>2.3 Question 1: Is There a Relationship Between the Response and Predictors? Or, among $$ \hat{\beta}_1, \cdots, \hat{\beta}_p $$, is there at least one $$ \hat{\beta}_i \neq 0 $$? (F-statistic and F-test)

We test the null hypothesis,

$$
	H_0 \text{ : } \beta_1 = \beta_2 = \cdots = \beta_p = 0
$$

versus the alternative

$$
	H_a \text{ : at least one } \beta_j \text{ is non-zero}
$$

我们做一个 F-statistic 来 perform hypothesis test

$$
\begin{equation}
	F = \frac{(TSS-RSS)/p}{RSS/(n-p-1)}
	\tag{2.4}
\end{equation} 
$$

If the linear model assumptions are correct, we would have

$$
\begin{equation}
	E[RSS/(n-p-1)] = \sigma^2
	\tag{2.5}
\end{equation} 
$$

If $$ H_0 $$ is true, we would have

$$
\begin{equation}
	E[(TSS-RSS)/p] = \sigma^2
	\tag{2.6}
\end{equation} 
$$

Hence, when there is no relationship between the response and predictors, one would expect the F-statistic to take on a value close to 1. On the other hand, if $$ H_a $$ is true, then $$ E[(TSS-RSS)/p] > \sigma^2 $$, so we expect F to be greater than 1.  

However, what if the F-statistic had been closer to 1? How large does the F-statistic need to be before we can reject $$ H_0 $$ and conclude that there is a relationship? It turns out that the answer depends on the values of $$ n $$ and $$ p $$. When $$ n $$ is large, an F-statistic that is just a little larger than 1 might still provide evidence against H0. In contrast, a larger F-statistic is needed to reject $$ H_0 $$ if $$ n $$ is small.   

When $$ H_0 $$ is true and the errors $$ \epsilon_i $$ have a normal distribution, the F-statistic follows an F-distribution. Even if the errors are not normally-distributed, the F-statistic approximately follows an F-distribution provided that the sample size $$ n $$ is large.  

For any given value of $$ n $$ and $$ p $$, we can compute the p-value associated with the F-statistic using F-distribution. Based on this p-value, we can determine whether or not to reject $$ H_0 $$.   

与 t-test 的 p-value 一样：

* p-value 趋近于 0，表示 tends to reject $$ H_0 $$, i.e. 至少存在一个 $$ \beta_i \neq 0 $$, i.e. there is a relationship between the response and predictors
* p-value 很大，表示 tends to accept $$ H_0 $$, i.e. 所有的 $$ \beta_i = 0 $$, i.e. there is no relationship between the response and predictors

If $$ p > n $$ then there are more coefficients $$ \beta_i $$ to estimate than observations from which to estimate them. In this case we cannot even fit the multiple linear regression model using least squares, so the F-statistic cannot be used.  

P77 提到一个重要的观点，不用使用 t-statistic and p-value for each individual predictor 来代替 F-statistic and its p-value, in Multiple Linear Regression setting.  

### <a name="Mlr-Q2"></a>2.4 Question 2: How to Decide on Important Variables? Or, do all the predictors help to explain $$ Y $$, or is only a subset of the predictors useful?

As discussed in the previous section, the first step in a multiple regression analysis is to compute the F-statistic and to examine the associated p-value. If we conclude on the basis of that p-value that at least one of the predictors is related to the response, then it is natural to wonder: which ones?  

P78 再次提出，individual p-values 在 $$ p $$ is large 时不可靠，需要谨慎使用。  

The task of determining which predictors are associated with the response, in order to fit a single model involving only those predictors, is referred to as **variable selection**.

选择方法：

* $$ 2^p $$ 种 predictor 组合一个一个的试
* 以 "RSS 越低越好" 为标准，逐步改进，达到某个指标（比如 RSS 低于某个值或者最多改进 n 次）后停止：
	* Forward selection: We begin with the null model — a model that contains an intercept  only but no predictors. Then try $$ p $$ simple linear regressions and pick the one with the lowest RSS. Then try two-variable models...
	* Backward selection. We start with all variables in the model, and remove the variable with the largest p-value — that is, the variable that is the least statistically significant. This procedure continues until a stopping rule is reached. For instance, we may stop when all remaining variables have a p-value below some threshold.
	* Mixed selection: We start with no variables in the model, and as with forward selection, we add the variable that provides the best fit. If at any point the p-value for one of the variables in the model rises above a certain threshold, then we remove that variable from the model. We continue to perform these forward and backward steps until all variables in the model have a sufficiently low p-value, and all variables outside the model would have a large p-value if added to the model.
	
Notes:

* $$ p > n $$ 时，forward selection 是一个有效的处理手段（forward selection 对 $$ p $$ and $$ n $$ 没有什么要求）
* $$ p > n $$ 时，无法使用 backward selection. 
* Forward selection is a greedy approach, and might include variables early that later become redundant. Mixed selection can remedy this.
	
其他的 statistics that can be used to judge the quality of a model include

* Mallow’s $$ C_p $$ 
* Akaike information criterion (AIC)
* Bayesian information criterion (BIC)
* Adjusted $$ R^2 $$

### <a name="Mlr-Q3"></a>2.5 Question 3: How to Measure the Model Fit? Or, how well does the model fit the data?

Recall that in simple linear regression setting, $$ R^2 = Cor(X, Y)^2 $$. While in multiple linear regression setting, it turns out $$ R^2 = Cor(Y, \hat Y)^2 $$. In fact one property of the fitted linear model is that it maximizes this correlation among all possible linear models.  

R^2 will always increase when more variables are added to the model, even if those variables are only weakly associated with the response. This is due to the fact that adding another variable to the least squares equations must allow us to fit the training data (though not necessarily the testing data) more accurately. Thus, the R^2 statistic, which is also computed on the training data, must increase. Therefore just a tiny increase in R^2 may provides additional evidence that this predictor can be dropped from the model.  

In addition to looking at the RSE and R^2 statistics just discussed, it can be useful to plot the data. 书中提到了观测到 synergy 现象的例子：

> In particular, the linear model seems to overestimate `sales` for instances in which most of the advertising money was spent exclusively on either `TV` or `radio`. It underestimates `sales` for instances where the budget was split between the two media. This pronounced non-linear pattern cannot be modeled accurately using linear regression. It suggests a _synergy_ or _interaction_ effect between the advertising media, whereby combining the media together results in a bigger boost to sales than using any single medium.

### <a name="Mlr-Q4"></a>2.6 Question 4: How accurate is our prediction?

#### <a name="CI-for-hat-Y"></a>2.6.1 CI for $$ \hat Y $$

The coefficient estimates $$ \hat{\beta}_0, \hat{\beta}_1, \cdots, \hat{\beta}_p $$ are estimates for $$ \beta_0, \beta_1, \cdots, \beta_p $$. That is, <a name="PRP-and-LSP"></a>the _least squares plane_

$$
\begin{equation}
	\hat Y = \hat{\beta}_0 + \hat{\beta}_1 X_1 + \cdots + \hat{\beta}_p X_p
\end{equation} 
$$

is only an estimate for the _true population regression plane_

$$
\begin{equation}
	f(X) = \beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p
\end{equation} 
$$

which is part of the true relationship

$$
\begin{equation}
	Y = f(X) + \epsilon
\end{equation} 
$$

The inaccuracy in the coefficient estimates is related to the reducible error and we can compute a confidence interval in order to determine how close $$ \hat Y $$ will be to $$ f(X) $$. We interpret the 95% CI of $$ \hat Y $$ to mean that, with 95% in probablity the interval will contain the true value of $$ f(X) $$.  

#### <a name="Model-Bias"></a>2.6.2 Model Bias

In practice assuming a linear model for f(X) is almost always an approximation of reality, so there is an additional source of potentially reducible error which we call **model bias**.  

这里我们不讨论 model bias, operate as if the linear model were correct.

#### <a name="Prediction-Intervals"></a>2.6.3 Prediction Intervals

Even if we knew the true values of the paramters, the response value cannot be predicted perfectly because of the random error $$ \epsilon $$. We referred to this as the irreducible error. 
How much will $$ Y $$ vary from $$ \hat Y $$? We use **prediction intervals** to answer this question. Prediction intervals are always wider than confidence intervals, because they incorporate both the error in the estimate for f(X) (the reducible error) and the uncertainty as to how much an individual point will differ from the population regression plane (the irreducible error).
	
We interpret the 95% PI of $$ \hat Y $$ to mean that, with 95% in probablity the interval will contain the true value of $$ Y $$.  


---
layout: post-mathjax
title: "Machine-Learning: Linear Regression - Part 2"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结自 Chapter 3, An Introduction to Statistical Learning.

-----

## 目录
  

### 3. [Other Considerations in the Regression Model](#Other-Considerations-in-the-Regression-Model)
  
- [3.1 Qualitative Predictors](#Qualitative-Predictors)   
	- [3.1.1 Qualitative predictors with only 2 levels](#2-Level-Qualitative)
		- [baseline 渐进法](#baseline-way)
		- [mean 中心法](#mean-way)
	- [3.1.2 Qualitative predictors with more than 2 levels](#Multi-Level-Qualitative)
- [3.2 Extensions of the Linear Model](#Extensions-of-the-Linear-Model)
	- [3.2.1 Removing the Additive Assumption by Adding Interaction Term](#Removing-the-Additive-Assumption)
		- [Interaction Term](#Interaction-Term)
		- [Main Effect and Hierarchical Principle](#Main-Effect-and-Hierarchical-Principle)
		- [Interaction Term with Qualitative Predictors](#Interaction-Term-with-Qualitative-Predictors)
	- [3.2.2 Non-linear Relationships](#Non-linear-Relationships)
- [3.3 Potential Problems](#Potential-Problems)
	- [3.3.1. Non-linearity of the Response-Predictor Relationships](#Non-linearity)
	- [3.3.2. Correlation of Error Terms](#Correlation-of-Error-Terms)
	- [3.3.3 Non-constant Variance of Error Terms](#Non-constant-Variance-of-Error-Terms)
	- [3.3.4 Outliers](#Outliers)
	- [3.3.5 High Leverage Points (leverage-statistic)](#High-Leverage-Points)
	- [3.3.6 Collinearity (共线性) (VIF)](#Collinearity)
	
### 4. [The Marketing Plan](#The-Marketing-Plan)

### 5. [Comparison of Linear Regression with K-Nearest Neighbors](#LR-vs-KNN)

### 6. [Lab: Linear Regression](#Lab)

- 6.1 Libraries
- [6.2 Simple Linear Regression](#Lab-SLR) 
- [6.3 Multiple Linear Regression](#Lab-MLR)
- [6.4 Interaction Terms](#Lab-IT)
- [6.5 Non-linear Transformations of the Predictors](#Lab-Non-Linear-Trans)
- [6.6 Qualitative Predictors](#Lab-QP)
- [6.7 Writing Functions](#Lab-Writing-Functions)
	
-----
	
## <a name="Other-Considerations-in-the-Regression-Model"></a>3. Other Considerations in the Regression Model

### <a name="Qualitative-Predictors"></a>3.1 Qualitative Predictors

qualitative 就是 categorical，与 R 的 factor 是一个概念。

#### <a name="2-Level-Qualitative"></a>3.1.1 Qualitative predictors with only 2 levels

对于 qualitative predictors with only 2 levels 而言，构造 dummy variable 有两种方法：

* baseline 渐进法
* mean 中心法

##### <a name="baseline-way"></a>baseline 渐进法

baseline 渐进法比如：

$$
	x_i = \left \\{ 
	\begin{matrix}
		& 1 & \text{if ith person is female} \\\\
		& 0 & \text{if ith person is male}
	\end{matrix} 
	\right.
	\tag{3.1}
$$

$$
	y_i = \beta_0 + \beta_i x_i + \epsilon_i = \left \\{ 
	\begin{matrix}
		& \beta_0 + \beta_i + \epsilon_i & \text{if ith person is female} \\\\
		& \beta_0 + \epsilon_i & \text{if ith person is male}
	\end{matrix} 
	\right.
	\tag{3.2}
$$

The level with no dummy variable — male in this example — is known as the **baseline**.

Now \\( \beta_0 \\) can be interpreted as the average response among males, \\( \beta_0 + \beta_1 \\) as the average response among females, and \\( \beta_1 \\) as the average difference in response between females and males.

##### <a name="mean-way"></a>mean 中心法

mean 中心法比如：

$$
	x_i = \left \\{ 
	\begin{matrix}
		& 1 & \text{if ith person is female} \\\\
		& -1 & \text{if ith person is male}
	\end{matrix} 
	\right.
	\tag{3.3}
$$

$$
	y_i = \beta_0 + \beta_i x_i + \epsilon_i = \left \\{ 
	\begin{matrix}
		& \beta_0 + \beta_i + \epsilon_i & \text{if ith person is female} \\\\
		& \beta_0 - \beta_i + \epsilon_i & \text{if ith person is male}
	\end{matrix} 
	\right.
	\tag{3.4}
$$

Now \\( \beta_0 \\) can be interpreted as the overall average response (ignoring the gender effect), and \\( \beta_1 \\) is the amount that females are above the average and males are below the average.

这两种方法没有本质的区别，除了 the way they are interpreted.

#### <a name="Multi-Level-Qualitative"></a>3.1.2 Qualitative predictors with more than 2 levels

对于 qualitative predictors with more than 2 levels，一般用 baseline 渐进法。这样 there will always be one fewer dummy variable than the number of levels.

比如对 `ethnicity = {Asian, Caucasian, African American}` 我们构造两个 dummy variable (其实就是一种编码的方式，还可以联系下 hierarchy cluster，有点像)

$$
	x_{i1} = \left \\{ 
	\begin{matrix}
		& 1 & \text{if ith person is Asian} \\\\
		& 0 & \text{if ith person is not Asian}
	\end{matrix} 
	\right.
	\tag{3.5}
$$

$$
	x_{i2} = \left \\{ 
	\begin{matrix}
		& 1 & \text{if ith person is Caucasian} \\\\
		& 0 & \text{if ith person is not Caucasian}
	\end{matrix} 
	\right.
	\tag{3.6}
$$

然后我们的 response 就是

$$
\begin{align}
	y_i 
	& = \beta_0 + \beta\_{i1} x\_{i1} + \beta\_{i2} x\_{i2} + \epsilon_i \\\\
	& = \left \\{ 
	\begin{matrix}
		& \beta\_0 + \beta\_{i1} + \epsilon\_i & \text{if ith person is Asian} \\\\
		& \beta\_0 + \beta\_{i2} + \epsilon\_i & \text{if ith person is Caucasian} \\\\
		& \beta\_0 + \epsilon\_i & \text{if ith person is African American}
	\end{matrix} 
	\right.
	\tag{3.7}
\end{align}
$$

The level `African American` now is the baseline. \\( \beta_0 \\) can be interpreted as the average response for `African Americans`, \\( \beta\_{i1} \\) can be interpreted as the difference of `(Asian - African American)` in the average response, and \\( \beta\_{i2} \\) can be interpreted as the difference of `(Caucasian - African American)`

### <a name="Extensions-of-the-Linear-Model"></a>3.2 Extensions of the Linear Model

The standard linear regression model makes several highly restrictive assumptions that are often violated in practice.

* The **additive assumption** means that the effect of changes in a predictor \\( X_i \\) on the response \\( Y \\) is independent of the values of the other predictors
	* 意思是 \\( X_i \\) 的改变只反映在 \\( Y \\) 上，\\( X_i \\) 的改变对其他的 \\( X_j \\) 没有影响
	* 也就是说没有体现出 _synergy_ or _interaction_ effect
* The **linear assumption** states that the change in the response \\( Y \\) due to a one-unit change in \\( X_i \\) is constant, regardless of the value of \\( X_i \\)

#### <a name="Removing-the-Additive-Assumption"></a>3.2.1 Removing the Additive Assumption by Adding Interaction Term

##### <a name="Interaction-Term"></a>Interaction Term

P88 举了个很好的例子 for _synergy_

> For example, suppose that we are interested in studying the productivity of a factory. We wish to predict the number of `units` produced on the basis of the number of production `lines` and the total number of `workers`. It seems likely that the effect of increasing the number of production lines will depend on the number of workers, since if no workers are available to operate the lines, then increasing the number of lines will not increase production. This suggests that it would be appropriate to include an interaction term between `lines` and `workers` in a linear model to predict `units`.

所谓的 Interaction Term 就是指 \\( X\_i \cdot X\_j \\). This results in the model

$$
\begin{equation}
	Y = \beta\_0 + \beta\_1 X\_1 + \beta\_2 X\_2 + \beta\_3 X\_1 X\_2 + \epsilon
	\tag{3.8}
\end{equation} 
$$

It can be rewritten as

$$
\begin{align}
	Y 
	& = \beta\_0 + (\beta\_1 + \beta\_3 X\_2) X\_1 + \beta\_2 X\_2 + \epsilon \\\\
	& = \beta\_0 + \hat{\beta}\_1 X\_1 + \beta\_2 X\_2 + \epsilon
	\tag{3.9}
\end{align}
$$

Since \\( \hat{\beta}\_1 \\) changes with \\( X_2 \\), the effect of \\( X_1 \\) on \\( Y \\) is no longer constant: adjusting \\( X_2 \\) will change the impact of \\( X_1 \\) on Y.

We can interpret \\( \beta\_3 \\) as the increase in the effectiveness of \\( X_1 \\) for a one unit increase in \\( X_2 \\) (or vice-versa). 

##### <a name="Main-Effect-and-Hierarchical-Principle"></a>Main Effect and Hierarchical Principle

我们把 \\( \beta\_0 + \beta\_1 X\_1 + \cdots + \beta\_n X\_n \\) 这样不包含 Interaction Term 的部分（或者这部分所代表的 relationship）称为 **Main Effect**。

It is sometimes the case that an interaction term has a very small p-value, but the associated main effects do not. The **hierarchical principle** states that if we include an interaction in a model, we should also include the main effects, even if the p-values associated with their coefficients are not significant. 这主要出于两个方面的考虑：

* 没有了 main effect，interaction term 的意义就不完整了
* 而且就算是 main effect 的 coefficients are not significant，它们在 prediction 时也不会造成什么影响（计算出来都接近于零）

##### <a name="Interaction-Term-with-Qualitative-Predictors"></a>Interaction Term with Qualitative Predictors

The concept of interactions applies just as well to qualitative variables, or to a combination of quantitative and qualitative variables. In fact, an interaction between a qualitative variable and a quantitative variable has a particularly nice interpretation.

比如一个 binary 的 factor

$$
	X_2 = \left \\{ 
	\begin{matrix}
		& 1 & \text{True} \\\\
		& 0 & \text{False}
	\end{matrix} 
	\right.
$$

与 \\( X_1 \\) 做 interaction

$$
\begin{align}
	\hat Y 
	& = \beta_0 + \beta\_1 X\_1 + \beta\_2 X\_2 + \beta\_3 X\_1 X\_2 \\\\
	& = \left \\{ 
	\begin{matrix}
		& \beta\_0 + \beta\_1 X\_1 + \beta\_2 + \beta\_3 X\_1 & \text{True} \\\\
		& \beta\_0 + \beta\_1 X\_1 + 0 & \text{False} 
	\end{matrix} 
	\right. \\\\
	& = \left \\{ 
	\begin{matrix}
		& (\beta\_0 + \beta\_2) + (\beta\_1 + \beta\_3) X\_1 & \text{True} \\\\
		& \beta\_0 + \beta\_1 X\_1 & \text{False} 
	\end{matrix}
	\right.
\end{align}
$$

这样在 \\( X_2 \\) 的两种情况下，\\( X_1 \\) 的 slope 和 intercept 都是不同的，体现了两种不同的变化模式。如果不做 interaction 的话画出来的是两条平行线（slope 相同），忽略了 \\( X_2 \\) 对 \\( X_1 \\) 的 slope 的影响。

#### <a name="Non-linear-Relationships"></a>3.2.2 Non-linear Relationships

前脚提到 interaction term，后面马上就接 polynomial regression 实在是太默契了。  

注意 polynomial regression is an approach extending the linear model to **accommodate** non-linear relationships，比如 quadratic

$$
\begin{equation}
	Y \approx \beta\_0 + \beta\_1 X + \beta\_2 X\^2 + \epsilon
	\tag{3.10}
\end{equation} 
$$

But it is still a linear model! Because we can treat \\ X_1 = X \\ and \\( X_2 = X\^2 \\)

### <a name="Potential-Problems"></a>3.3 Potential Problems

书上说的很简略，我也不详细摘录了。做到 "有印象" 就好了，暂不深究。

#### <a name="Non-linearity"></a>3.3.1. Non-linearity of the Response-Predictor Relationships

说的就是 true relationship 是否是 linear 的问题。

Residual plots are a useful graphical tool for identifying non-linearity (of the sample?).

* For simple linear regression model, we can plot the residuals, \\( e\_i = y\_i − \hat{y}\_i \\), versus the predictor \\( x_i \\)
* For multiple linear regression model, plot \\( e\_i \\), versus the predicted (a.k.a fitted) values \\( \hat{y}\_i \\)

A smooth of U-shape provides a strong indication of non-linearity in the data.

If the residual plot indicates that there are non-linear associations in the data, then a simple approach is to use non-linear transformations of the predictors, such as \\( logX \\), \\( \sqrt{X} \\), and \\( X\^2 \\), in the regression model. 

具体见 P92。

#### <a name="Correlation-of-Error-Terms"></a>3.3.2. Correlation of Error Terms

An important assumption of the linear regression model is that the error
terms, \\( \epsilon\_1, \epsilon\_2, \cdots, \epsilon\_n \\), are uncorrelated.

If in fact there is correlation among the error terms, then the estimated standard errors will tend to underestimate the true standard errors. As a result, 

* Confidence and prediction intervals will be narrower than they should be.
	* 95% CI may in reality have a much lower probability than 0.95 of containing the true value of the parameter
* p-values associated with the model will be lower than they should be.

As an extreme example, suppose we accidentally doubled our data, leading to observations and error terms identical in pairs. If we ignored this, our standard error calculations would be as if we had a sample of size \\( 2n \\), when in fact we have only \\( n \\) samples. Our estimated parameters would be the same for the \\( 2n \\) samples as for the \\( n \\) samples, but the confidence intervals would be narrower by a factor of \\( sqrt{2} \\)!

correlation of error terms 在 time series 里比较常见. If we plot the residuals from our model versus time, 一个常见的 correlation of error terms 的特征是：连续的 positive residuals 或者 negative residuals。

具体见 P94。

#### <a name="Non-constant-Variance-of-Error-Terms"></a>3.3.3 Non-constant Variance of Error Terms

Another important assumption of the linear regression model is that the error terms have a constant variance, \\( Var(\epsilon\_i) = \sigma\^2 \\). The standard errors, confidence intervals, and hypothesis tests associated with the linear model rely upon this assumption.

Unfortunately, it is often the case that the variances of the error terms are non-constant. For instance, the variances of the error terms may increase with the value of the response. One can identify non-constant variances in the errors, or **heteroscedasticity** ([hetərəʊskədæs'tɪsətɪ], 异方差性), from the presence of a funnel ([ˈfʌnl], 漏斗) shape (漏斗横放的效果，越往右开口越大) in residual plot. 

When faced with this problem, one possible solution is to transform the response Y using a concave ([kɒnˈkeɪv], 凹面, 凹的) function such as \\( logY \\) or \\( \sqrt{Y} \\). Such a transformation results in a greater amount of shrinkage of the larger responses, leading to a reduction in heteroscedasticity.

具体见 P96。

还有个 weighted least squares 我不是很懂，待查。

#### <a name="Outliers"></a>3.3.4 Outliers

An outlier is a point for which \\( y_i \\) is far from the value predicted by the model.

outlier 对 RSE、R^2 这些指标的计算都有很大影响。Residual plots can be used to identify outliers. But in practice, it can be difficult to decide how large a residual needs to be before we consider the point to be an outlier. To address this problem, instead of plotting the residuals, we can plot the **studentized residuals**, computed by dividing each residual \\( \epsilon_i \\) by its estimated standard error. Observations whose studentized residuals are greater than 3 in absolute value are possible outliers.

If we believe that an outlier has occurred due to an error in data collection or recording, then one solution is to simply remove the observation. However, care should be taken, since an outlier may instead indicate a deficiency with the model, such as a missing predictor.

具体见 P97。

#### <a name="High-Leverage-Points"></a>3.3.5 High Leverage Points (leverage-statistic)

首先 leverage 是 "杠杆" 的意思，可以引申成 "influence or power used to achieve a desired result". 在 statistics 领域的 [解释](http://onlinestatbook.com/2/regression/influential.html) 是：

> The leverage of an observation is based on how much the observation's value on the predictor variable differs from the mean of the predictor variable. The greater an observation's leverage, the more potential it has to be an influential observation. For example, an observation with a value equal to the mean on the predictor variable has no influence on the slope of the regression line regardless of its value on the criterion variable.

与 outlier 不同，移除 outlier 对 slope 和 intercept 是没有影响的，而移除 high leverage point 明显会影响 slope 和 intercept。我们需要检测 high leverage point 因为这些点上的偏差会极大地影响整个 least squared line。 

为此，我们提出 leverage-statistic 来计算各个点的 leverage，详见 P98，这里不详述了。

P99 还提到一个点可以同时是 outlier 和 high leverage point，这种情况非常复杂，需要慎重处理。

#### <a name="Collinearity"></a>3.3.6 Collinearity (共线性) (VIF)

Collinearity refers to the situation in which two or more predictor variables  are closely related to one another. If two preditors are very highly correlated with each other, we say that they are **collinear**.

P100 的 RSS contour 就是 Ng 的 lecture 里的 \\( J(\theta) \\) contour。如果 two preditors are collinear，contour 就会很扁，会影响 Gradient Desent 的准确度（一个小的 step 可能造成很大的变化）。

P101 还提到了 collinearity 对 t-statistic 的影响（进而影响 t-test 和 p-value）。

A simple way to detect collinearity is to look at the correlation matrix of the predictors (PCA 里的那个是 covariance matrix). An element of this matrix that is large in absolute value indicates a pair of highly correlated variables, and therefore a collinearity problem in the data

R 里还有一种方法是用 Scatterplot Matrices

<pre class="prettyprint linenums">
college = read.csv("./ISL/College.csv")
pairs(college[,1:10])
</pre>

Unfortunately, not all collinearity problems can be detected by inspection of the correlation matrix: it is possible for collinearity to exist between three or more variables even if no pair of variables has a particularly high correlation. We call this situation **multicollinearity** (多重共线性).

Instead of inspecting the correlation matrix, a better way to assess multicollinearity is to compute the **variance inflation factor** (VIF).

公式和释义见 P101-102。

When faced with the problem of collinearity, there are two simple solutions:

* The first is to drop one of the problematic variables from the regression. This can usually be done without much compromise to the regression fit.
* The second solution is to combine the collinear variables together into a single predictor. E.g. take the average of standardized versions of them.

## <a name="The-Marketing-Plan"></a>4. The Marketing Plan

P102 起，正式回答了开篇 7 问。没啥新内容，可以学习下答题的角度和方式。

1. Is there a relationship, between \\( X \\) and \\( Y \\)?
	* fit a regression model
	* t-test or F-test, with p-value
2. How strong is the relationship?
	* R^2 statistic records the percentage of variability in the response that is explained by the predictors.
	* RSE estimates the standard deviation of the response from the population regression line
3. Which \\( x_i \\)'s contribute to \\( Y \\)?
	* p-value
4. How accurately can we estimate the effect of each \\( x_i \\) on \\( Y \\)?
	* SE of coefficients
	* CI of coefficients
	* Use VIF to check collinearity. 
5. How accurately can we predict future \\( Y \\)?
	* PI
	* CI for \\( \hat Y \\)
6. Is the relationship linear?
	* Residual plots can be used in order to identify non-linearity.
	* methods to accommodate non-linear relationships
7. Is there synergy among \\( x_i \\)'s?
	* try interaction term
	
## <a name="LR-vs-KNN"></a>5. Comparison of Linear Regression with K-Nearest Neighbors

P104

注意这里我们是把 KNN classifier 扩展成了 KNN regression，基本思想不变，计算方法变了一点。KNN regression 是一个 non-parametric method。

The parametric approach will outperform the nonparametric approach if the parametric form that has been selected is close to the true form of \\( f \\). 这句话是没错，不过说了也和没说差不多……

But in reality, even when the true relationship is highly non-linear, KNN may still provide inferior results to linear regression, especially for large \\( p \\) (i.e. high dimension predictors). The reason lies in the fact that spreading limited observations (e.g. 100) over higher (e.g. p = 20) dimensions results in a phenomenon in which a given observation has no nearby neighbors — this is the so-called **curse of dimensionality**.

As a general rule, parametric methods will tend to outperform non-parametric approaches when there is a small number of observations per predictor.

这一节 comparison 的设计和作图都值得学习，很有 paper 范儿。

## <a name="Lab"></a>6. Lab: Linear Regression

P109

已经熟练掌握的内容就不记录了。

### <a name="Lab-SLR"></a>6.2 Simple Linear Regression

	> library(MASS)
	
	> fix(Boston)
	> names(Boston)
	
	> lm.fit = lm(medv~lstat, data=Boston)
	
If we type `lm.fit`, some basic information about the model is output. For more detailed information, we use `summary(lm.fit)`. This gives us p-values and standard errors for the coefficients, as well as the R^2 statistic and F-statistic for the model.

We can use the `names()` function in order to find out what other pieces of information are stored in `lm.fit`. Although we can extract these quantities by name — e.g. `lm.fit$coefficients` — it is safer to use the extractor functions like `coef()` to access them.

	> names(lm.fit)
	[1] "coefficients" "residuals " "effects "
	[4] "rank" "fitted.values " "assign"
	[7] "qr" "df.residual" "xlevels "
	[10] "call" "terms" "model"
	
	> coef(lm.fit)
	(Intercept) lstat
		  34.55 -0.95
		  
In order to obtain a confidence interval for the coefficient estimates, we can use the `confint()` command.

	> confint(lm.fit)
				2.5 % 97.5 %
	(Intercept) 33.45 35.659
	lstat 		-1.03 -0.874
	
The `predict()` function can be used to produce 95% confidence intervals and 95% prediction intervals for the prediction of `medv` for a given value of `lstat`.	
	
	> predict(lm.fit, data.frame(lstat=(c(5 ,10 ,15))), interval="confidence")
		fit   lwr   upr
	1 29.80 29.01 30.60
	2 25.05 24.47 25.63
	3 20.30 19.73 20.87
	
	> predict (lm.fit, data.frame(lstat=(c(5 ,10 ,15))), interval="prediction")
		fit    lwr   upr
	1 29.80 17.566 42.04
	2 25.05 12.828 37.28
	3 20.30  8.078 32.53
	
We will now plot medv and lstat along with the least squares regression line using the `plot()` and `abline()` functions.

	> plot(Boston$lstat, Boston$medv)
	> abline(lm.fit)
	
The `lwd=3` parameter causes the width of the regression line to be increased by a factor of 3.

注意 `abline(lm.fit)` 只是画出了 least squares line，而 `plot(lm.fit)` 是连续画出 4 张图，所以我们一般是：

	> par(mfrow = c(2,2))
	> plot(lm.fit)

一般的记法是这样的：如果 y-axis 是 foo 值，x-axis 是 bar 值，我们称为 plot foo versus bar，这个图也可以叫 foo versus bar。这样 `plot(lm.fit)` 连续画的 4 张图就是：

* Residuals vs Fitted (i.e. Fitted values; i.e the predicted values)
* Standardized Residuals vs Theoretical Quantiles, a.k.a Normal Q-Q
* \\( \sqrt{|Standardized Residuals|} \\) vs Fitted, a.k.a Scale-Location
* Standardized Residuals vs Leverage

Alternatively, we can compute the residuals from a linear regression fit using the `residuals()` function. The function `rstudent()` will return the studentized residuals, and we can use this function to plot the residuals against the fitted values.

	> plot(predict(lm.fit), residuals(lm.fit))
	> plot(predict(lm.fit), rstudent(lm.fit))
	
On the basis of the residual plots, there is some evidence of non-linearity. Leverage statistics can be computed for any number of predictors using the `hatvalues()` function.

	> plot(hatvalues(lm.fit))
	> which.max(hatvalues(lm.fit))
	375 ## it tells us which observation has the largest leverage statistic
	
### <a name="Lab-MLR"></a>6.3 Multiple Linear Regression

	> lm.fit = lm(medv~lstat+age, data=Boston)
	> summary(lm.fit)
	
	> lm.fit = lm(medv~., data=Boston)
	> summary(lm.fit)
	
What if we would like to perform a regression using all of the variables but one? For example, in the above regression output, `age` has a high p-value. So we may wish to run a regression excluding this predictor. Use `-age` in the formula, as

	> lm.fit1 = lm(medv~.-age, data=Boston)
	> summary(lm.fit1)
	
Alternatively, the `update()` function can be used.

	> lm.fit1 = update(lm.fit, ~.-age)
	
We can access the individual components of a summary object by name (type ?summary.lm to see what is available), e.g.

* `summary(lm.fit)$r.sq` for R^2 statistic
* `summary(lm.fit)$sigma` for RSE

The `vif()` function, part of the `car` package, can be used to compute variance inflation factors.

	> library (car)
	> vif(lm.fit)
		crim    zn indus  chas   nox    rm   age
		1.79  2.30  3.99  1.07  4.39  1.93  3.10
		 dis   rad   tax  ptratio black lstat
		3.96  7.48  9.01     1.80  1.35  2.94
		
还有在 [6.2 Simple Linear Regression](#Lab-SLR) 里能用的这里也能用。

### <a name="Lab-IT"></a>6.4 Interaction Terms

It is easy to include interaction terms in a linear model using the `lm()` function. The syntax `lstat:black` tells R to include an interaction term between `lstat` and `black`. The syntax `lstat*age` simultaneously includes `lstat`, `age`, and the interaction term `lstat:age` as predictors; it is a shorthand for `lstat+age+lstat:age`.

	> summary(lm(medv~lstat*age, data=Boston))
	
### <a name="Lab-Non-Linear-Trans"></a>6.5 Non-linear Transformations of the Predictors

Given a predictor X, we can create a predictor X^2 using `I(X^2)`. The function `I()` is needed since the `^` has a special meaning in a formula; wrapping with `I()` allows the standard usage in R, which is to raise X to the power 2. We now perform a regression of medv onto `lstat` and `lstat^2`.

	> lm.fit2 = lm(medv~lstat+I(lstat^2))
	> summary(lm.fit2)
	
The near-zero p-value associated with the quadratic term suggests that it leads to an improved model. We use the `anova()` function to further quantify the extent to which the quadratic fit is superior to the linear fit.

	> lm.fit = lm(medv~lstat, data=Boston)
	> lm.fit2 = lm(medv~lstat+I(lstat^2), data=Boston)
	> anova(lm.fit, lm.fit2) ## Analysis of Variance
	
The `anova()` function performs a hypothesis test comparing the two models. 

* The null hypothesis is that the two models fit the data equally well.
* The alternative hypothesis is that the full model is superior. 

Here the F-statistic is 135 and the associated p-value is virtually zero. This provides very clear evidence that the model containing the predictors `lstat` and `lstat^2` is far superior to the model that only contains the predictor `lstat`. 

This is not surprising, since earlier we saw evidence for non-linearity in the relationship between `medv` and `lstat`. If we type

	> par(mfrow=c(2,2))
	> plot(lm.fit2)
	
then we see that when the `lstat^2` term is included in the model, there is little discernible pattern in the residuals.

For even higher order polynomials, a better approach is `poly()` function. E.g. the following command produces a fifth-order polynomial fit:

	> lm.fit5 = lm(medv~poly(lstat,5), data=Boston)

根据 [Quadratic models with R. The use of poly(..) and I(..) functions (R-language) 的这个答案](http://stats.stackexchange.com/a/66282)，有：

* `poly()` 默认是 return orthogonal polynomials
* `poly(lstat,5)` ≠ `lstat+I(lstat^2)+I(lstat^3)+I(lstat^4)+I(lstat^5)`
* 最好理解的 polynomial 是 raw polynomial，代码是 `poly(lstat,5,raw=TRUE)`
* `poly(lstat,5,raw=TRUE)` = `lstat+I(lstat^2)+I(lstat^3)+I(lstat^4)+I(lstat^5)`

`summary (lm.fit5)` suggests that including additional polynomial terms, up to fifth order, leads to an improvement in the model fit! However, further investigation of the data reveals that no polynomial terms beyond fifth order have significant p-values in a regression fit.

We can also give a try of log transformation.

	> summary(lm(medv~log(rm), data=Boston))
	
### <a name="Lab-QP"></a>6.6 Qualitative Predictors

	> library(ISLR)
	> fix(Carseats)
	> names(Carseats)
	
We will attempt to predict `Sales` (child car seat sales). 

There is a qualitative predictors `Shelveloc`, an indicator of the quality of the shelving location — that is, the space within a store in which the car seat is displayed — at each location. The predictor `Shelveloc` takes on three possible values, _Bad_, _Medium_, and _Good_.

Given a qualitative variable such as `Shelveloc`, R generates dummy variables automatically. Below we fit a multiple regression model that includes some interaction terms.

	> lm.fit = lm(Sales~.+Income:Advertising+Price:Age, data=Carseats)
	> summary(lm.fit)
	
从 `summary(lm.fit)` 可以看出 R 创建了 `ShelveLocGood` 和 `ShelveLocMedium` 这两个 dummy variable，它们的设计值是：

	> contrasts(Carseats$ShelveLoc)
		   Good Medium
	Bad       0      0
	Good      1      0
	Medium    0      1

### <a name="Lab-Writing-Functions"></a>6.7 Writing Functions

	> LoadLibraries=function() {
	+ library(ISLR)
	+ library(MASS)
	+ print("The libraries have been loaded.")
	+ }
	

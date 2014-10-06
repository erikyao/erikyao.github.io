---
layout: post-mathjax
title: "Machine Learning: Moving Beyond Linearity"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结自 Chapter 7, An Introduction to Statistical Learning.

-----

## 目录

### 0. [Overview](#Overview)

### 1. [Polynomial Regression](#PolyR)

### 2. [Step Functions](#Step-Functions)

### 3. [Basis Functions](#Basis-Functions)

### 4. [Regression Splines](#Regression-Splines)

- [4.1 Piecewise Polynomials](#Piecewise-Polynomials)
- [4.2 Constraints and Splines](#Constraints-and-Splines)
- [4.3 The Spline Basis Representation](#Spline-Basis-Rep)
- [4.4 Choosing the Number and Locations of the Knots](#Choosing-Knots)
- [4.5 Comparison to Polynomial Regression](#Comparison-to-PolyR)

### 5. [Smoothing Splines](#Smoothing-Splines)

- [5.1 An Overview of Smoothing Splines](#SS-Overview)
- [5.2 Choosing the Smoothing Parameter \\( \lambda \\)](#Choose-S-Parameter)

### 6. [Local Regression](#Local-Regression)

### 7. [Generalized Additive Models](#GAMs)

- [7.1 GAMs for Regression Problems](#GAMs-Reg)
- [7.2 GAMs for Classification Problems](#GAMs-Class)

### 8. [Lab: Non-linear Modeling](#Lab)

- [8.1 Polynomial Regression and Step Functions](#Lab-PolyR-SF)
- [8.2 Splines](#Lab-Splines)
- [8.3 GAMs](#Lab-GAMs)
	
-----

## <a name="Overview"></a>0. Overview

Methods in this chapter:

* **Polynomial regression**. For example, a cubic regression uses three variables, \\( X \\), \\( X\^2 \\), and \\( X\^3 \\), as predictors.
* **Step functions** cut the range of a variable into \\( K \\) distinct regions in order to produce a qualitative variable. This has the effect of fitting a piecewise constant function.
* **Regression splines** are more flexible than polynomials and step functions, and in fact are an extension of the two. 
	* They involve dividing the range of \\( X \\) into \\( K \\) distinct regions. Within each region, a polynomial function is fit to the data. 
	* However, these polynomials are constrained so that they join smoothly at the region boundaries, or **knots**. Provided that the interval is divided into enough regions, this can produce an extremely flexible fit. 
* **Smoothing splines** are similar to regression splines, but arise in a slightly different situation. Smoothing splines result from minimizing a RSS criterion subject to a smoothness penalty.
* **Local regression** is similar to splines, but differs in an important way. The regions are allowed to overlap, and indeed they do so in a very smooth way. 
* **Generalized additive models** allow us to extend the methods above to deal with multiple predictors.

## <a name="PolyR"></a>1. Polynomial Regression

Polynomial function goes 

$$
\begin{equation}
	y\_i = \beta\_0 + \beta\_1 x\_i + \beta\_2 x\_i\^2 + \beta\_3 x\_i\^3 + \cdots + \beta\_d x\_i\^d + \epsilon\_i
	\tag{1.1}
\end{equation} 
$$

where \\( \epsilon\_i \\) is the error term.

Notice that the coefficients can be easily estimated using least squares linear regression. 

Generally speaking, it is unusual to use \\( d \\) greater than 3 or 4 because for large values of \\( d \\), the polynomial curve can become overly flexible and can take on some very strange shapes. This is especially true near the boundary of the \\( X \\) variable. 

P268

## <a name="Step-Functions"></a>2. Step Functions

简单说就是把 \\( X \\) 分段，我们称为 break the range of \\( X \\) into **bins**。分段的结果是多个 dummy variable (binary factor)，我们以这多个 dummy variable 为 predictor 来 regression。

具体见 P268-270

## <a name="Basis-Functions"></a>3. Basis Functions

Polynomial and piecewise-constant regression (i.e. Step Functions) models are in fact special cases of a basis function approach. The idea is to have at hand a family of functions or transformations, \\( b\_1(X), b\_2(X), \cdots, b\_K(X) \\), that can be applied to a variable \\( X \\). Then we fit the model

$$
\begin{equation}
	y\_i = \beta\_0 + \beta\_1 b\_1(x\_i) + \beta\_2 b\_2(x\_i) + \beta\_3 b\_3(x\_i) + \cdots + \beta\_K b\_K(x\_i) + \epsilon\_i
	\tag{3.1}
	\label{eq3.1}
\end{equation} 
$$	

Note that the basis functions \\( b\_1(), b\_2(), \cdots, b\_K() \\) are fixed and known. In other words, we choose the functions ahead of time.

We can think of \\( (\ref{eq3.1}) \\) as a standard linear model with predictors \\( b\_1(x\_i), b\_2(x\_i), \cdots, b\_K(x\_i) \\). Hence, we can use least squares to estimate the unknown regression coefficients. Importantly, this means that all of the inference tools for linear models that are discussed in Chapter 3, such as standard errors for the coefficient estimates and F-statistics for the model’s overall significance, are available in this setting.

Many alternatives for \\( b\_1(), b\_2(), \cdots, b\_K() \\) are possible. For instance, we can use wavelets or Fourier series to construct basis functions. In the next section, we investigate a very common choice for a basis function: regression splines.

## <a name="Regression-Splines"></a>4. Regression Splines

### <a name="Piecewise-Polynomials"></a>4.1 Piecewise Polynomials

举个例子就很好懂了：

$$
\begin{equation}
	y\_i = 
	\begin{cases}
		\beta\_{01} + \beta\_{11} x\_i + \beta\_{21} x\_i\^2 + \beta\_{31} x\_i\^3 + \epsilon\_i & \text{if } x\_i < c \\\\ 
		\beta\_{02} + \beta\_{12} x\_i + \beta\_{22} x\_i\^2 + \beta\_{32} x\_i\^3 + \epsilon\_i & \text{if } x\_i \geq c
	\end{cases} 
\end{equation} 
$$	

The points where the coefficients change are called knots, in this case, \\( c \\).

Using more knots leads to a more flexible piecewise polynomial. In general, if we place \\( K \\) different knots throughout the range of \\( X \\), then we will end up fitting \\( K + 1 \\) different polynomials. And cubic polynomial is not necessary here, for example, we can instead fit piecewise linear functions.

### <a name="Constraints-and-Splines"></a>4.2 Constraints and Splines

The curve of piecewise polynomials may be discontinuous, which is a sign of overfitting. To remedy this problem, we can fit a piecewise polynomial under a **constraint** that the fitted curve must be continuous. In other
words, there cannot be a jump when \\( X = c \\).

P272 举的例子实际施加了三个 constraint：

* the piecewise polynomials is continuous at \\( X = c \\) 
* the 1^st derivatives (一阶导数) of the piecewise polynomials are continuous at \\( X = c \\) 
* the 2^nd derivatives (二阶导数) of the piecewise polynomials are continuous at \\( X = c \\) 
* （具体怎么施加 constraint 书上没有说）

这么做可以降低 degree of freedom：

* 原来有 2x4 = 8 个 parameters，所以 df = 8
* 加了 3 个限制，于是 df = 8-3 = 5
* （df 的计算原理我还没懂……）

这了一来得到的 curve 就是 **cubic spline**。Cubic splines are popular because most human eyes cannot detect the discontinuity at the knots. 

In general, a cubic spline with \\( K \\) knots uses a total of \\( 4 + K \\) degrees of freedom.

More generally, a degree-\\( d \\) spline is that it is a piecewise degree-\\( d \\) polynomial, with continuity in derivatives up to degree \\( d - 1\\) at each knot. 这句话我给翻译一下：

* 我们起手有一个 \\( d \\) 阶的 piecewise polynomial（knot 的数量和划分在这里没有限制）
* 如果在所有的 knot 上，这个 piecewise polynomial 本身连续，而且其 1 阶、2 阶、……、\\( d-1 \\) 阶导数都连续，则我们可以称这个 \\( d \\) 阶的 piecewise polynomial 为一个 \\( d \\) 阶的 spline

### <a name="Spline-Basis-Rep"></a>4.3 The Spline Basis Representation

Generally, a cubic spline with \\( K \\) knots can be modeled as

$$
\begin{equation}
	y\_i = \beta\_0 + \beta\_1 b\_1(x\_i) + \beta\_2 b\_2(x\_i) + \cdots + \beta\_{K+3} b\_{K+3}(x\_i) + \epsilon\_i
	\tag{4.1}
\end{equation} 
$$	

To be specific, a more direct way to represent a cubic spline is to start off with a basis for a cubic polynomial — namely, \\( x, x\^2, x\^3 \\) — and then add one **truncated power basis** function per knot. A truncated power basis function is defined as

$$
\begin{equation}
	h(x, \xi) = (x - \xi)\_{+}\^3 = 
	\begin{cases}
		(x - \xi)\^3 & \text{if } x > \xi \\\\ 
		0 & \text{otherwise}
	\end{cases} 
	\tag{4.2}
\end{equation} 
$$	

where \\( \xi \\) is the knot. One can show that adding a term of the form \\( \beta\_4 h(x, \xi) \\) to a cubic polynomial will lead to a discontinuity in only the 3^rd derivative at \\( \xi \\); the function will remain continuous, with continuous 1^st and 2^nd derivatives, at each of the knots.

Now the cubic spline with \\( K \\) knots can be written as

$$
\begin{aligned}
	Y = 
	& \beta\_0 + \beta\_1 X + \beta\_2 X\^2 + \beta\_3 X\^3 + \\\\
	& \beta\_4 h(X, \xi\_1) + \cdots + \beta\_{K+3} h(X, \xi\_K) + \epsilon
	\tag{4.3}
\end{aligned} 
$$	

with \\( K+4 \\) degrees of freedom. 

A **natural spline** is a regression spline with additional boundary constraints: the function is required to be linear at the boundary (in the region where X is smaller than the smallest knot, or larger than the largest knot). This additional constraint means that natural splines generally produce more stable estimates at the boundaries.

### <a name="Choosing-Knots"></a>4.4 Choosing the Number and Locations of the Knots

One option is to place more knots in places where we feel the function might vary most rapidly, and to place fewer knots where it seems more stable. While this option can work well, in practice it is common to place knots in a uniform fashion. One way to do this is to specify the desired degrees of freedom, and then have the software automatically place the corresponding number of knots at uniform **quantiles** of the data. E.g. for a cubic spline with 4 degrees of freedom, 25^th, 50^th and 75^th quantiles may be used as knots.

How many knots should we use, or equivalently how many degrees of freedom should our spline contain? One option is to try out different numbers of knots and see which produces the best looking curve, often with the help of cross-validation.

### <a name="Comparison-to-PolyR"></a>4.5 Comparison to Polynomial Regression

P276

## <a name="Smoothing-Splines"></a>5. Smoothing Splines

### <a name="SS-Overview"></a>5.1 An Overview of Smoothing Splines

首先提出了 smooth 的意义：我们想要的是 min RSS，但其实定义一个非常扭曲的分段函数 g，让所有的 \\( x_i \\) 都有 \\( g(x\_i) = y\_i \\) 可以很容易让 RSS = 0，但这种极端 overfitting 没有任何实用价值。于是我们提出了一个新的要求：What we really want is a function g that makes RSS small, but that is also **smooth**.

How might we ensure that g is smooth? There are a number of ways to do this. A natural approach is to find the function g that minimizes

$$
\begin{equation}
	\sum\_{i=1}\^n {(y\_i - g(x\_i))\^2} + \lambda \int {g''(t)\^2 \, dt}
	\tag{5.1}
	\label{eq5.1}
\end{equation} 
$$	

where \\( \lambda \\) is a nonnegative **tuning parameter**. The function g that minimizes \\( (\ref{eq5.1}) \\) is known as a **smoothing spline**.

* \\( \sum\_{i=1}\^n {(y\_i - g(x\_i))\^2} \\) is a **loss funtion**
* \\( \lambda \int {g''(t)\^2 \, dt} \\) is a **penalty term*8

Broadly speaking, the 2^nd derivative of a function is a measure of its **roughness**: it is large in absolute value if \\( g(t) \\) is very wiggly near \\( t \\), and it is close to zero otherwise. (E.g. The 2^nd derivative of a straight line, which is perfectly smooth, is zero.)

If g is very smooth, then \\( g'(t) \\) will be close to constant and \\( \int {g''(t)\^2 \, dt} \\) will take on a small value. Therefore, the penalty term encourages g to be smooth. The larger the value of \\( \lambda \\), the smoother g will be.

When \\( \lambda = 0 \\), then the penalty term has no effect, and so the function g will be very jumpy and will exactly interpolate (穿插) the training observations. When \\( \lambda \to \infty \\), g will be perfectly smooth — it will just be a straight line that passes as closely as possible to the training points.

The function g that minimizes \\( (\ref{eq5.1}) \\) can be shown to have some special properties:

* It is a piecewise cubic polynomial with knots at the unique values of \\( x\_1, \cdots, x\_n \\),
* and has continuous 1^st and 2^nd derivatives at each knot.
* Furthermore, it is linear in the region outside of the extreme knots.
* In other words, the function g that minimizes \\( (\ref{eq5.1}) \\) is a natural cubic spline with knots at \\( x\_1, \cdots, x\_n \\).

### <a name="Choose-S-Parameter"></a>5.2 Choosing the Smoothing Parameter \\( \lambda \\)

The tuning parameter \\( \lambda \\) controls the roughness of the smoothing spline, and hence the **effective degrees of freedom**. It is possible to show that as \\( \lambda \\) increases from 0 to \\( \infty \\), the effective degrees of freedom, which we write \\( df\_{\lambda} \\) decrease from \\( n \\) to 2.

Usually, degrees of freedom refer to the number of free parameters, such as the number of coefficients fit in a polynomial or cubic spline. Although a smoothing spline has \\( n \\) parameters and hence \\( n \\) nominal degrees of freedom, these \\( n \\) parameters are heavily constrained or shrunk down.

The definition of effective degrees of freedom is somewhat technical. We can write

$$
\begin{equation}
	\hat{g}\_{\lambda} = S\_{\lambda} y
	\tag{5.2}
\end{equation} 
$$	

where \\( \hat{g}\_{\lambda} \\) is a \\( n \\)-vector containing the fitted values of the smoothing spline at the training points \\( x\_1, \cdots, x\_n \\), for a particular choice of \\( \lambda \\) (你可以把 \\( \hat{g} \\) 理解成 \\( \hat{y} \\)). \\( S\_{\lambda} \\) is a \\( n \times n \\) matrix. Then the effective degrees of freedom is defined to be

$$
\begin{equation}
	df\_{\lambda} = \sum\_{i=1}\^{n} {S\_{\lambda}}\_{ii}
	\tag{5.3}
\end{equation} 
$$	

the sum of the diagonal elements of the matrix \\( S\_{\lambda} \\).

In fitting a smoothing spline, we do not need to select the number or location of the knots — there will be a knot at each training observation, \\( x\_1, \cdots, x\_n \\). Instead, we have another problem: we need to choose the value of \\( \lambda \\). It should come as no surprise that one possible solution to this problem is cross-validation.

It turns out that the LOOCV error can be computed very efficiently for smoothing splines, with essentially the same cost as computing a single fit, using the following formula:

$$
\begin{equation}
	RSS\_{cv}(\lambda) = \sum\_{i=1}\^{n} { \left \( y\_i - \hat{g}\_{\lambda}\^{(-i)}(x\_i) \right \)}\^2 = \sum\_{i=1}\^{n}{\left \[ \frac{y\_i - \hat{g}\_{\lambda}(x\_i)}{1-{S\_{\lambda}}\_{ii}} \right \]\^2}
	\tag{5.4}
\end{equation} 
$$	

The notation \\( \hat{g}\_{\lambda}\^{(-i)}(x\_i) \\) indicates the fitted value for this smoothing spline evaluated at \\( x_i \\), where the fit uses all of the training observations except for the i^th observation \\( (x\_i, y\_i) \\).

This formula is quite similar to the one we met in Chapter 5

$$
\begin{equation}
	CV\_{(n)} = \frac{1}{n} \sum\_{i=1}\^{n}{\left \( \frac{y\_i - \hat{y}\_i}{1 - h\_i} \right \)\^2 }
\end{equation} 
$$

A model with less effective degrees of freedom is considered as a simpler model, which is in general better unless the data provides evidence in support of a more complex model.

## <a name="Local-Regression"></a>6. Local Regression

Local regression is a different approach for fitting flexible non-linear functions, which involves computing the fit at a target point \\( x_0 \\) using only the nearby training observations.

简单说一下，这个和 KNN 很像。

首先你有 \\( n \\) 个 training 点，这时来了个 test point \\( x_0 \\) 要预测。先选定一个 \\( k \\) 值，表示 "\\( x_0 \\) 周围最近的 \\( k \\) 个 training point 划为 neighborhood"，然后这个 fraction \\( s = \frac{k}{n} \\) 我们称为 span。接着给这 \\( k \\) 个 neighbor 赋一个 weight \\( K\_{i0} = K(x\_i, x\_0) \\)，越近的点 weight 越大。然后在这 \\( k \\) 个点上（或者你把 neighborhood 之外的点统一按 weight = 0 处理，这样在所有 \\( n \\) 个点上实施也是一样的）跑一个 weighted least squares regression，也就是 find \\( \hat{\beta}\_0 \\) and \\( \hat{\beta}\_1 \\) that minimize

$$
\begin{equation}
	\sum\_{i=1}\^{n}{K\_{i0} (y\_i - \beta\_0 - \beta\_1 x\_i)\^2}
	\tag{6.1}
\end{equation} 
$$

然后就有 \\( \hat{y}\_0 = \hat{\beta}\_0 + \hat{\beta}\_1 x\_0 \\)

注意几个问题：

* 如果确定 span 的大小？还是老办法，用 CV 来试。
* 如何确定 weight 的分配？能否用其他的 method，比如 quadratic regression 来代替 weighted least squares regression？这些都是实际应用中需要考虑的问题。
* One very useful generalization involves fitting a multiple linear regression model that is global in some variables, but local in another, such as time. Such **varying coefficient models** are a useful way of adapting a model to the most recently gathered data.
* 和 KNN 一样，neighborhood 可以是立体的、多维的，但同样也面临 curse of dimensionality 的问题，超过 4 维时就很容易 perform poorly

## <a name="GAMs"></a>7. Generalized Additive Models

GAMs is a general framework for：

* extending a standard linear model by allowing non-linear functions of each of the variables
* maintaining additivity at the same time

### <a name="GAMs-Reg"></a>7.1 GAMs for Regression Problems

与 \\( (\ref{eq3.1}) \\) 的 Basic Functiion 的形式很像。

A natural way to extend the multiple linear regression model 

$$
\begin{equation}
	y\_i = \beta\_0 + \beta\_1 x\_{i1} + \beta\_2 x\_{i2} + \cdots + \beta\_{p} x\_{ip} + \epsilon\_i
\end{equation} 
$$

in order to allow for non-linear relationships between each feature and the response is to replace each linear component \\( \beta\_{j} x\_{ij} \\) with a (smooth) nonlinear function \\( f\_{j}(x\_{ij}) \\). We would then write the model as 

$$
\begin{equation}
	y\_i = \beta\_0 + f\_{1}(x\_{i1}) + f\_{2}(x\_{i2}) + \cdots + f\_{p}(x\_{ip}) + \epsilon\_i
	\tag{7.1}
\end{equation} 
$$

This is an example of a GAM.

It is called an additive model because we calculate a separate \\( f_j \\) for each \\( X_j \\), and then add together all of their contributions.

Pros and Cons of GAMs 在 P285。

Because the model is additive, we can still examine the effect of each \\( X_j \\) on \\( Y \\) individually while holding all of the other variables fixed. Hence if we are interested in inference, GAMs provide a useful representation. 很简单的一个变换，比如我们有 \\( X\_1, X\_2, X\_3 \\)，我们把 \\( r\_i = y\_i - f\_1(x\_{i1}) - f\_2(x\_{i2}) \\) 称为 \\( X\_3 \\) 的 i^th **partial residual**，这个就可以直接作为 \\( f\_3(x\_{i3}) \\) 的 response 来调 \\( f\_3 \\) 的 model。

For fully general models, we have to look for even more flexible approaches such as randomforests and boosting. GAMs provide a useful compromise between linear and fully nonparametric models.

### <a name="GAMs-Class"></a>7.2 GAMs for Classification Problems

P286

其实和 "把 logistic regression 从 Simple 扩展到 Multiple" 的思路一样，我们把 logit \\( \log \left \( \frac{p(X)}{1-p(X)} \right \) = \beta\_0 + \cdots \\) 右边的部分变成 GAMs 就可以了。

## <a name="Lab"></a>8. Lab: Non-linear Modeling

### <a name="Lab-PolyR-SF"></a>8.1 Polynomial Regression and Step Functions

We now examine how Figure 7.1 was produced. 

	> library(ISLR)
	
	## orthogonal polynomials
	> fit = lm(wage~poly(age,4), data=Wage)
	> coef(summary(fit))
	
	## raw polynomials
	## though the choice of raw polynomials affects the coefficient estimates, it does not affect the fitted values obtained.
	> fit2 = lm(wage~poly(age,4,raw=T), data=Wage)
	> coef(summary(fit2))

There are several other equivalent ways of fitting this model.

	> fit2a = lm(wage~age+I(age^2)+I(age^3)+I(age^4), data=Wage)
	## is same as
	> fit2b = lm(wage~cbind(age, age^2, age^3, age^4), data=Wage)
	
We now create a grid of values for `age` at which we want predictions, and then call the generic `predict()` function, specifying that we want standard errors as well.

	> agelims = range(age)
	> age.grid = seq(from=agelims[1], to=agelims[2])
	> preds = predict(fit, newdata=list(age=age.grid), se=TRUE)
	> se.bands = cbind(preds$fit+2*preds$se.fit, preds$fit-2*preds$se.fit)
	
Finally, we plot the data and add the fit from the degree-4 polynomial.

	> par(mfrow=c(1,2), mar=c(4.5,4.5,1,1), oma=c(0,0,4,0))
	> plot(age, wage, xlim=agelims, cex=.5, col="darkgrey")
	> title("Degree-4 Polynomial", outer=T)
	> lines(age.grid, preds$fit, lwd=2, col="blue")
	> matlines(age.grid, se.bands, lwd=1, col="blue", lty=3)
	
Here the `mar` and `oma` arguments to `par()` allow us to control the margins of the plot.

The fitted values obtained in either orthogonal or raw polynomial are identical:

	> preds2 = predict(fit2, newdata=list(age=age.grid), se=TRUE)
	> max(abs(preds$fit - preds2$fit))
	[1] 7.39e-13
	
In performing a polynomial regression we must decide on the degree of the polynomial to use. One way to do this is by using hypothesis tests. We now fit models ranging from linear to a degree-5 polynomial and seek to determine the simplest model which is sufficient to explain the relationship. We use the `anova()` function, which performs an **analysis of variance** (ANOVA, using an F-test) in order to test 

* \\( h\_0 \\): a model \\( M_1 \\) is sufficient to explain the data
* \\( h\_a \\): a more complex model \\( M_2 \\) is required

In order to use the `anova()` function, \\( M_1 \\) and \\( M_2 \\) must be **nested** models: the predictors in \\( M_1 \\) must be a subset of the predictors in \\( M_2 \\).

	> fit.1 = lm(wage~age, data=Wage)
	> fit.2 = lm(wage~poly(age,2), data=Wage)
	> fit.3 = lm(wage~poly(age,3), data=Wage)
	> fit.4 = lm(wage~poly(age,4), data=Wage)
	> fit.5 = lm(wage~poly(age,5), data=Wage)
	> anova(fit.1, fit.2, fit.3, fit.4, fit.5)
	......
	Model 4: wage ~ poly(age , 4)
	Model 5: wage ~ poly(age , 5)
	  Res.Df     RSS Df  Sum of Sq       F Pr(>F)
	1 	2998 5022216
	2 	2997 4793430  1     228786  143.59 <2e-16 ***
	3 	2996 4777674  1 	 15756    9.89 0.0017 **
	......
	
The p-value comparing the linear `Model 1` to the quadratic `Model 2` is essentially zero, indicating that a linear fit is not sufficient. Similarly the p-value comparing the quadratic `Model 2` to the cubic `Model 3` is very low, so the quadratic fit is also insufficient. The p-value comparing the cubic and degree-4 polynomials, `Model 3` and `Model 4`, is approximately 5% while the degree-5 polynomial `Model 5` seems unnecessary because its p-value is 0.37. Hence, either a cubic or a quartic polynomial appear to provide a reasonable fit to the data, but lower- or higher-order models are not justified.

Instead of using the `anova()` function, we could have obtained these p-values more succinctly ([sək'sɪŋktlɪ], 简便地) by exploiting the fact that `poly()` creates orthogonal polynomials.

	> coef(summary(fit.5))
				  Estimate Std. Error   t value Pr(>|t|)
	(Intercept)     111.70     0.7288  153.2780 0.000e+00
	poly(age,5)1    447.07    39.9161   11.2002 1.491e-28
	......
	
Notice that the p-values are the same, and in fact the square of the t-statistics are equal to the F-statistics from the `anova()` function.

However, the ANOVA method works whether or not we used orthogonal polynomials; it also works when we have other terms in the model as well. For example, we can use `anova()` to compare these three models:

	> fit.1 = lm(wage~education+age, data=Wage)
	> fit.2 = lm(wage~education+poly(age,2), data=Wage)
	> fit.3 = lm(wage~education+poly(age,3), data=Wage)
	> anova(fit.1, fit.2, fit.3)
	
As an alternative to using hypothesis tests and ANOVA, we could choose the polynomial degree using cross-validation (we do not discuss CV here).

Next we consider the task of predicting whether an individual earns more than $250,000 per year.

	> fit = glm(I(wage>250)~poly(age,4), data=Wage, family=binomial)
	
Note that we again use the wrapper `I()` to create this binary response variable on the fly.

However, calculating the confidence intervals is slightly more involved than in the linear regression case. The default prediction type for a `glm()` model is `type="link"`, which means we get predictions for the logit:

$$
\begin{equation}
	\log \left \( \frac{Pr(Y=1|X)}{1-Pr(Y=1|X)} \right \) = X \beta
\end{equation} 
$$

and the predictions, standard errors etc. given are of the form \\( X \hat{\beta} \\).

In order to obtain confidence intervals for \\( Pr(Y = 1|X) \\), we use the transformation

$$
\begin{equation}
	Pr(Y = 1|X) = \frac{\exp(X \beta)}{1+\exp(X \beta)}
\end{equation} 
$$

<!-- -->

	> pfit = exp(preds$fit)/(1+exp(preds$fit))
	> se.bands.logit = cbind(preds$fit+2*preds$se.fit, preds$fit -2*preds$se.fit)
	> se.bands = exp(se.bands.logit)/(1+exp(se.bands.logit))
	 
Note that we could have directly computed the probabilities by selecting the `type="response"` option in the `predict()` function.

	> preds = predict(fit, newdata=list(age=age.grid), type="response", se=T)

However, the corresponding confidence intervals would not have been sensible because we would end up with negative probabilities!

Finally, the right-hand plot from Figure 7.1 was made as follows:

	> plot(age, I(wage>250), xlim=agelims, type="n", ylim=c(0,.2))
	## jitter: 原意是抖动、振动(比如粒子)、振荡(比如股市)，这里指 add a small amount of noise to a numeric vector
	> points(jitter(age), I((wage>250)/5), cex=.5, pch="|", col="darkgrey")
	> lines(age.grid, pfit, lwd=2, col="blue")
	> matlines(age.grid, se.bands, lwd=1, col="blue", lty=3)

We used the `jitter()` function to jitter the `age` values a bit so that observations with the same `age` value do not cover each other up. This is often called a **rug plot**.

In order to fit a step function, we use the `cut()` function.

	> fit = lm(wage~cut(age,4), data=Wage)
	> coef(summary(fit))
	
### <a name="Lab-Splines"></a>8.2 Splines

The `bs()` function generates the entire matrix of basis functions for splines with the specified set of knots. By default, cubic splines are produced.

	> library(splines )
	> fit = lm(wage~bs(age,knots=c(25,40,60)), data=Wage)
	> pred = predict(fit, newdata=list(age=age.grid), se=T)
	> plot(age, wage, col="gray")
	> lines(age.grid, pred$fit, lwd=2)
	> lines(age.grid, pred$fit+2*pred$se, lty="dashed")
	> lines(age.grid, pred$fit-2*pred$se, lty="dashed")
	
We could also use the `df` option to produce a spline with knots at uniform quantiles of the data.

	> dim(bs(age,knots=c(25,40,60)))
	[1] 3000 6
	## 3 knots + cubic = 6. intercept not included
	> dim(bs(age,df=6))
	[1] 3000 6
	> attr(bs(age,df=6), "knots")
	25% 50% 75%
	33.8 42.0 51.0
	
The function `bs()` also has a `degree` argument. By default, `degree=3` produces a cubic spline.

In order to instead fit a natural spline, we use the `ns()` function.

	> fit2 = lm(wage~ns(age,df=4), data=Wage)
	> pred2 = predict(fit2, newdata=list(age=age.grid), se=T)
	> lines(age.grid, pred2$fit, col="red", lwd=2)
	
As with the `bs()` function, we could instead specify the knots directly using the `knots` option.

In order to fit a smoothing spline, we use the `smooth.spline()` function. Figure 7.8 was produced with the following code:

	> plot(age, wage, xlim=agelims, cex=.5, col="darkgrey")
	> title("Smoothing Spline")
	> fit = smooth.spline(age, wage, df=16)
	> fit2 = smooth.spline(age, wage, cv=TRUE)
	> fit2$df
	[1] 6.8
	> lines(fit, col="red", lwd=2)
	> lines(fit2, col="blue", lwd=2)
	> legend("topright", legend=c("16 DF","6.8 DF"), col=c("red","blue"), lty=1, lwd=2, cex=.8)
	
In order to perform local regression, we use the `loess()` function.

	> plot(age, wage, xlim=agelims, cex=.5, col="darkgrey")
	> title("Local Regression")
	> fit = loess(wage~age,span=.2, data=Wage)
	> fit2 = loess(wage~age,span=.5, data=Wage)
	> lines(age.grid, predict(fit, data.frame(age=age.grid)), col="red", lwd=2)
	> lines(age.grid, predict(fit2, data.frame(age=age.grid)), col="blue", lwd=2)
	> legend("topright", legend=c("Span=0.2","Span=0.5"), col=c("red","blue"), lty=1, lwd=2, cex=.8)
	
The `locfit` library can also be used for fitting local regression models in R.

### <a name="Lab-GAMs"></a>8.3 GAMs

We now fit a GAM to predict `wage` using natural spline functions of `year` and `age`, treating `education` as a qualitative predictor. We can simply do this using the `lm()` function.

	> gam1 = lm(wage~ns(year,4)+ns(age,5)+education, data=Wage)

We now fit the model using smoothing splines rather than natural splines. Because `smooth.spline()` cannot be expressed in terms of basis functions in `lm()`, we will need to use the `gam` library in R.

The `s()` function from `gam` library, is used to indicate that we would like to use a smoothing spline.

	> library(gam)
	> gam.m3 = gam(wage~s(year,4)+s(age,5)+education, data=Wage)
	
In order to produce Figure 7.12, we simply call the `plot()` function:

	> par(mfrow=c(1,3))
	> plot(gam.m3, se=TRUE, col="blue")
	
The generic `plot()` function recognizes that `gam.m3` is an object of class `gam`, and invokes the appropriate `plot.gam()` method. Conveniently, even though `gam1` is not of class `gam` but rather of class `lm`, we can still use `plot.gam()` on it. Figure 7.11 was produced using the following expression:

	> plot.gam(gam1, se=TRUE, col="red")
	
In these plots, the function of `year` looks rather linear. We can perform a series of ANOVA tests in order to determine which of these three models is best: 

* a GAM that excludes year (\\( M_1 \\))
* a GAM that uses a linear function of `year` (\\( M_2 \\))
* a GAM that uses a spline function of `year` (\\( M_3 \\)).

<!-- -->

	> gam.m1 = gam(wage~s(age,5)+education, data=Wage)
	> gam.m2 = gam(wage~year+s(age,5)+education, data=Wage)
	> anova(gam.m1, gam.m2, gam.m3, test="F")
	
We find that there is compelling evidence that a GAM with a linear function of `year` is better than a GAM that does not include `year` at all (p-value=0.00014). However, there is no evidence that a non-linear function of `year` is needed (p-value=0.349). In other words, based on the results of this ANOVA, \\( M_2 \\) is preferred.

We can also use p-value in `summary()` to determine whether the spline is necessary to fit the model.

	> summary(gam.m3)
	
Here we make predictions on the training set.

	> preds = predict(gam.m2, newdata=Wage)
	
We can also use local regression fits as building blocks in a GAM, using the `lo()` function.

	> gam.lo = gam(wage~s(year,df=4)+lo(age,span=0.7)+education , data=Wage)
	> plot.gam(gam.lo, se=TRUE, col="green")
	
We can also use the `lo()` function to create interactions before calling the `gam()` function. For example,

	> gam.lo.i = gam(wage~lo(year, age, span=0.5)+education, data=Wage)

We can plot the resulting two-dimensional surface if we first install the `akima` package.

	> library(akima)
	> plot(gam.lo.i)
	
In order to fit a logistic regression GAM, we once again use the `I()` function in constructing the binary response variable, and set `family=binomial`.

	> gam.lr = gam(I(wage>250)~year+s(age,df=5)+education, family=binomial, data=Wage)
	> par(mfrow=c(1,3))
	> plot(gam.lr, se=T, col="green")
	
It is easy to see that there are no high earners in the `<HS` category using command `table(education, I(wage >250))`. Hence, we fit a logistic regression GAM using all but this category. This provides more sensible results.

	> gam.lr.s = gam(I(wage>250)~year+s(age,df=5)+education, family=binomial, data=Wage, subset=(education!="1. < HS Grad"))
	> par(mfrow=c(1,3))
	> plot(gam.lr, se=T, col="green")

---
layout: post-mathjax
title: "Expectation Operator Rules, Covariance and Standard Error of the Mean"
description: ""
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

## 1. Expectation Operator Rules

$$
\begin{align}
  \operatorname{E}[aX]    &= a \operatorname{E}[X] \\\\
  \operatorname{E}[X + c] &=   \operatorname{E}[X] + c \\\\
  \operatorname{E}[X + Y] &=   \operatorname{E}[X] + \operatorname{E}[Y], \text{X and Y may be independent or not} \\\\
  \operatorname{E}[XY]    &= \operatorname{E}[X] * \operatorname{E}[X], \text{only if X and Y are independent}
\end{align}
$$

Here proves the last rule:  

Suppose the joint pdf of _**X**_ and _**Y**_ is \\( j(x,y) \\), then 

$$
\operatorname{E}[XY] = \iint xy \, j(x,y)\,\mathrm{d}x\,\mathrm{d}y
$$

If _**X**_ and _**Y**_ are independent, then by definition \\( j(x,y) = f(x)g(y) \\) where _**f**_ and _**g**_ are the marginal PDFs for _**X**_ and _**Y**_. Then 

$$
\begin{align}
  \operatorname{E}[XY]
    &= \iint xy \,j(x,y)\,\mathrm{d}x\,\mathrm{d}y = \iint x y f(x) g(y)\,\mathrm{d}y\,\mathrm{d}x \\\\
    &= \left[\int x\*f(x)\,\mathrm{d}x\right]\left[\int y\*g(y)\,\mathrm{d}y\right] = \operatorname{E}[X]\operatorname{E}[Y]
\end{align}
$$

## 2. Covariance Again

$$
\begin{align}
	Cov(X,Y)
	&= \operatorname{E}\left[\left(X - \operatorname{E}\left[X\right]\right) \left(Y - \operatorname{E}\left[Y\right]\right)\right] \\\\
	&= \operatorname{E}\left[X Y - X \operatorname{E}\left[Y\right] - \operatorname{E}\left[X\right] Y + \operatorname{E}\left[X\right] \operatorname{E}\left[Y\right]\right] \\\\
	&= \operatorname{E}\left[X Y\right] - \operatorname{E}\left[X\right] \operatorname{E}\left[Y\right] - \operatorname{E}\left[X\right] \operatorname{E}\left[Y\right] + \operatorname{E}\left[X\right] \operatorname{E}\left[Y\right] \\\\
	&= \operatorname{E}\left[X Y\right] - \operatorname{E}\left[X\right] \operatorname{E}\left[Y\right] \\\\
	&= \frac{\sum_{i=1}\^{n}(x_i - \bar{x})(y_i - \bar{y})}{n-1}
\end{align}
$$

If _**X**_ and _**Y**_ are independent, \\( Cov(X, Y) = 0 \\)

## 3. Standard Error of the Mean

If \\( X_1, X_2 , \ldots, X_n \\) are n independent observations from a population that has a mean \\( \mu \\) and standard deviation \\( \sigma \\), \\( \bar{X} = \frac{1}{n} \sum\_n {x_i} \\) is itself a random variable, and satisfy 

* \\( E[\bar{X}] = \mu \\)
* \\( Var(\bar{X}) = \frac{\sigma\^2}{n} \\)

The standard error of the mean (SEM) is the standard deviation of the sample-mean's estimate of a population mean, i.e. 

$$
	\text{SE}_\bar{x}\ = \sqrt{Var(\bar{X})} = \frac{\sigma}{\sqrt{n}}
$$

## 4. Proof of \\( Var(\bar{X}) = \frac{\sigma\^2}{n} \\)

### 4.1 Proof I

Suppose \\( T = (X_1 + X_2 + \cdots + X_n) \\), then 

$$
\begin{align}
	Var(T) &= E[T\^2] - E[T]\^2 = Var(X_1 + X_2 + \cdots + X_n) = n\*Var(X) = n\sigma\^2 \\\\
	Var(\bar{X}) 
	&= Var(\frac{T}{n}) = E[(\frac{T}{n})\^2] - E[\frac{T}{n}]\^2 \\\\
	&= \frac{1}{n\^2}(E[T\^2] - E[T]\^2) = \frac{1}{n\^2}\*n\sigma\^2 = \frac{\sigma\^2}{n}
\end{align}
$$

### 4.2 Proof II

Suppose \\( T = (X_1 + X_2 + \cdots + X_n) \\), then 

$$
\begin{align}
	E[T\^2] 
		&= E \left \[ \sum\_{i=1}\^{n}(X\_i\^2) + \sum\_{i,j=1,...,n}\^{i \neq j}(X\_i \* X_j) \right \] \\\\
		&= nE[X\^2] + (n\^2-n)E[X]\^2, \text{for} X_i, X_j \, \text{are independent}, E[X\_i \* X_j] = E[X\_i]\*E[X_j] \\\\
		&= nE[X\^2] + (n\^2-n)\mu\^2 \\\\
	\because E[X\^2] 
		&= \sigma\^2 + E[X]\^2 \\\\ 
		&= \sigma\^2 + \mu\^2 \\\\
	\therefore E[T\^2] 
		&= n\sigma\^2 + n\mu\^2 + (n\^2-n)\mu\^2 \\\\
		&= n\sigma\^2 + n\^2\mu\^2 \\\\
	\therefore Var(\bar{X}) 
		&= \frac{1}{n\^2}(E[T\^2] - E[T]\^2) \\\\
		&= \frac{1}{n\^2}(n\sigma\^2 + n\^2\mu\^2 - n\^2\mu\^2) \\\\
		&= \frac{\sigma\^2}{n}
\end{align}
$$
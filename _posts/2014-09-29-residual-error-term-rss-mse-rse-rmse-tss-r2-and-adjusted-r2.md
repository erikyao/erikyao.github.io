---
layout: post
title: "RSS, MSE, RMSE, RSE, TSS, R<sup>2</sup> and Adjusted R<sup>2</sup>"
description: ""
category: Machine-Learning
tags: []
---
{% include JB/setup %}

This post is written by courtesy of:

- [Panna Pan](https://disqus.com/by/panna_pan/)
- [R - Confused on Residual Terminology](https://stats.stackexchange.com/a/111003)

以下假设 sample 有 $m$ 个 examples。

## The _Residual Sum of Squares_ (RSS) is the sum of the squared residuals

以下三个概念等价 (我无话可说)：

- RSS: Residual Sum of Squares
- SSR: Sum of Squared Residuals
- SSE: Sum of Squared Errors

$$
RSS = \sum_{i=1}^{m}{e_i^2} = \sum_{i=1}^{m}{(y_i - \hat{f}(x_i))^2}
$$

## The _Mean Squared Error_ (MSE) is the mean of RSS

$$
MSE = \frac{RSS}{m} 
$$

## The _Root Mean Squared Error_ (RMSE) is the square root of MSE

$$
RMSE = \sqrt{MSE} = \sqrt{\frac{RSS}{m}}
$$

## The _Residual Standard Error_ (RSE) is the square root of $\frac{RSS}{\text{degrees of freedom}}$

$$
RSE = \sqrt \frac{RSS}{m - p - 1}
$$

where 

- $p$ is the number of predictors
	- i.e. $p+1$ is the number of right-hand-side variables, including the intercept, in a regression model
- $m-p-1$ denotes the **degrees of freedom**.

## The _Total Sum of Squares_ (TSS) is related with variance and not a metric on regression models

$$
TSS = \sum_{i=1}^{m}{(y_i - \bar y)^2}
$$

where $\bar y$ is the sample mean. 

Further we have $Var = \frac{TSS}{m - 1}$

## $R^2$ and Adjusted $R^2$

$$
\begin{align}
				 & R^2 = 1 - \frac{RSS}{TSS} \newline
\text{Adjusted } & R^2 = 1 - \frac{RSS/(m-p-1)}{TSS/(m-1)} = 1 - \frac{m-1}{m-p-1} \frac{RSS}{TSS}
\end{align}
$$

## Chain Reaction

当趋向 overfitting 时（比如 predictor 增多，模型变 flexible 时）：

* RSS ↓
	* MSE ↓
	* RMSE ↓ 
	* 如果是 predicator 增多，那么 RSE 无法断定是上升还是下降
* TSS →
* $R^2$ ↑
* Adjusted $R^2$ 不好说（这正是 adjustment 的体现）
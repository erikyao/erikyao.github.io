---
layout: post-mathjax
title: "Covariance and Correlation"
description: "协方差与相关系数"
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

## 0. Symbols

* \\( Var(X) \\): variance (\\( \sigma\^2 \\)) of X
* \\( \bar{x} \\): (emprical) mean (\\( \mu \\)) of X
* \\( \bar{y} \\): (emprical) mean (\\( \mu \\)) of Y
* \\( s_x \\): (emprical) standard deviation (\\( \sigma \\)) of X
* \\( s_y \\): (emprical) standard deviation (\\( \sigma \\)) of Y
* \\( r_{x,y} \\): or \\( r \\) abbreviated; (sample) correlations of X with Y (\\( Cor(X, Y) \\)) 

## 1. Covariance

-> \\( Cov(X,Y) = \frac{\sum_{i=1}\^{n}(x_i - \bar{x})(y_i - \bar{y})}{n-1} \\) <-
<!-- -->
-> (Divided by n-1 to keep the statistic unbiased) <-

Specially, \\( Cov(X, X) = Var(X) \\).  

Positive covariance values suggest that when one measurement is above the mean the other will probably also be above the mean, and vice versa. Negative covariances suggest that when one variable is above its mean, the other is below its mean. And covariances near zero suggest that the two variables vary independently of each other.

## 2. Correlation

-> \\( Cor(X,Y) = \frac{Cov(X,Y)}{s_x s_y}  \\)<-

Specially, \\( Cor(X, X) = 1 \\). 

Covariances tend to be hard to interpret, so we often use correlation instead. The correlation has the nice property that it is always between -1 and +1, with -1 being a perfect negative linear correlation, +1 being a perfect positive linear correlation and 0 indicating that X and Y are uncorrelated.

Technically, independence implies zero correlation, but the reverse is **not necessarily true**.

When we have many quantitative variables the most common non-graphical EDA technique is to calculate all of the pairwise covariances and/or correlations and assemble them into a matrix.

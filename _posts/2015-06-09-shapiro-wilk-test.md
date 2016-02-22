---
layout: post-mathjax
title: "Shapiro-Wilk Test for Normality"
description: "To test whether the sample come from a normally distributed population"
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

总结自：

- [Wikipedia: Shapiro–Wilk test](http://en.wikipedia.org/wiki/Shapiro%E2%80%93Wilk_test)
- [Perform a Shapiro-Wilk Normality Test](http://stackoverflow.com/questions/15427692/perform-a-shapiro-wilk-normality-test)

<!-- -->

- Shapiro: [ʃəˈpirəu]
- normality: [nɔ:ˈmæləti]

-----

Given a sample $ x_1, \cdots, x_n $, 

- $ H_0 $: the sample come from a normally distributed population
- $ H_a $: the sample does not come from a normally distributed population
- The test statistic is: $ W = \frac{\left(\sum_{i=1}^n a_i x_{(i)}\right)^2}{\sum_{i=1}^n (x_i-\overline{x})^2} $, where
	- $ x_{(i)} $ is the $ i^{th} $ order statistic, i.e., the $ i^{th} $-smallest number in the sample;
	- $ \overline{x} = \left( x_1 + \cdots + x_n \right) / n $ is the sample mean;
	- the constants $ a_i $ are given by $ (a_1,\dots,a_n) = {m^{\mathsf{T}} V^{-1} \over (m^{\mathsf{T}} V^{-1}V^{-1}m)^{1/2}} $ where
		- $ m = (m_1,\dots,m_n)^{\mathsf{T}} $,
		- and $ m_1,\ldots,m_n $ are the expected values of the order statistics of independent and identically distributed random variables sampled from the standard normal distribution, 
		- and $ V $ is the covariance matrix of those order statistics. 
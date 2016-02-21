---
layout: post-mathjax
title: "t-tests introduction"
description: ""
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

参考资料：

- [Wikipedia: Student's t-test](https://en.wikipedia.org/wiki/Student's_t-test)
- [statwing: T-Test (Independent Samples)](http://docs.statwing.com/examples-and-definitions/t-test)
- [lærd: Independent T-Test for Two Samples](https://statistics.laerd.com/statistical-guides/independent-t-test-statistical-guide.php)
- [lærd: Dependent T-Test for Paired Samples (cont...)](https://statistics.laerd.com/statistical-guides/dependent-t-test-statistical-guide-3.php)

-----

## 0. Types

A t-test is a statistical hypothesis test in which the test statistic follows a Student's t distribution if the null hypothesis is supported. 实际应用却有 4 大类：

- One-sample t-test
- Slope of a regression line
- Independent two-sample t-test
- Dependent t-test for paired samples

我们这里一不讲 assumption，二不深入计算方法，只介绍 hypotheses，知道这几种 t-tests 测的是什么内容就足够了。

## 1. One-sample t-test

Giving a sample, we test

- $$ H_0 $$: the underlying population mean is equal to a specified value $$ \mu_0 $$
- $$ H_a $$: the underlying population mean is not equal to a specified value $$ \mu_0 $$

We use the statistic

$$
	t = \frac{\overline{x} - \mu_0}{s/\sqrt{n}} 
$$

where $$ \overline{x} $$ is the sample mean, $$ s $$ is the sample standard deviation of the sample and $$ n $$ is the sample size. The degrees of freedom used in this test are $$ n − 1 $$. 

Although the parent population does not need to be normally distributed, the distribution of the population of sample means, $$ \overline {x} $$, is assumed to be normal. By the central limit theorem, if the sampling of the parent population is independent then the sample means will be approximately normal. (The degree of approximation will depend on how close the parent population is to a normal distribution and the sample size, $$ n $$.)

## 2. Slope of a regression line

Suppose one is fitting the model

$$
	Y = \alpha + \beta x + \varepsilon
$$
	
where $$ x $$ is known, $$ \alpha $$ and $$ \beta $$ are unknown, and $$ \varepsilon $$ is a normally distributed random variable with mean 0 and unknown variance $$ \sigma^2 $$, and $$ Y $$ is the outcome of interest. 

We want to test

- $$ H_0 $$: the slope $$ \beta $$ is equal to some specified value $$ \beta_0 $$ 
- $$ H_a $$: the slope $$ \beta $$ is not equal to some specified value $$ \beta_0 $$ 

$$ \beta_0 $$ is often taken to be 0, in which case the null hypothesis is that $$ x $$ and $$ y $$ are independent.

## 3. Independent two-sample t-test

- $$ H_0 $$: $$ \mu_1 = \mu_2 $$ (The population means from the two unrelated (i.e. independent) groups are equal.)
- $$ H_a $$: $$ \mu_1 \neq \mu_2 $$ (The population means from the two unrelated (i.e. independent) groups are not equal.)

计算方法根据以下指标有所不同：

- Equal sample sizes, equal variance
- Equal or unequal sample sizes, equal variance
- Equal or unequal sample sizes, unequal variances (Welch's t-test)

## 4. Dependent t-test for paired samples

This test is used when the samples are dependent; that is, 

- when there is only one sample that has been tested twice (repeated measures) or 
- when there are two samples that have been matched or "paired" (比如犯罪率调查，一张大表里有 "青年犯罪人数" 和 "中年犯罪人数"，它们不是独立的，所以可以看做是两个 sample，我们可以用 dependent t-test 调查 "那个年龄段平均犯罪率更高" 这样的问题).

<!-- -->

- $$ H_0 $$: $$ \mu_1 = \mu_2 $$ (The population means from the two related (i.e. dependent) groups are equal.)
- $$ H_a $$: $$ \mu_1 \neq \mu_2 $$ (The population means from the two related (i.e. dependent) groups are not equal.)
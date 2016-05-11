---
layout: post
title: "Statistic, Statistical Hypothesis Test(ing), Test Statistic, t-test and p-value"
description: ""
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

总结自：

* [Statistic - Wikipedia](http://en.wikipedia.org/wiki/Statistic)
* [Statistical hypothesis testing - Wikipedia](http://en.wikipedia.org/wiki/Statistical_hypothesis_testing)
* [Test Statistic - Wikipedia](http://en.wikipedia.org/wiki/Test_statistic)
* [Student's t-test - Wikipedia](http://en.wikipedia.org/wiki/Student%27s_t-test)
* [Statistics Tutorial: P-Values and T-Tables](http://www.gla.ac.uk/sums/users/jdbmcdonald/PrePost_TTest/pandt1.html)

-----

## 目录
  
1. [Statistic](#Statistic)
2. [Statistical Hypothesis Test(ing)](#Statistical-Hypothesis-Test)
3. [Test Statistic](#Test-Statistic)
4. [t-test](#t-test)
5. [p-value](#p-value)

-----

## <a name="Statistic"></a>1. Statistic

### 1.1 Definition

A **statistic**, is a single measure of some attribute of a sample (e.g. sample mean). It is calculated by applying a function to the values of the sample.  

More formally, statistical theory defines a statistic as a function of a sample where the function itself is independent of the sample's distribution; that is, the function can be stated before realization of the data. The term statistic is used both for the function and for the value of the function on a given sample.  

A statistic is distinct from a **statistical parameter**, which is not computable because often the population is much too large to examine and measure all its items. 

* A statistic is an observable random variable, computed on a sample.
* A parameter is a generally unobservable quantity describing a property of a statistical population, which can only be computed exactly if the entire population can be observed without error.

However, a statistic, when used to estimate a population parameter, is called an **estimator**. For instance, the sample mean is a statistic that estimates the population mean, which is a parameter.  

### 1.2 Types

When a statistic (a function) is being used for a specific purpose, it may be referred to by a name indicating its purpose: 

* in **descriptive statistics**, a **descriptive statistic** is used to describe the data; 
* in **estimation theory**, an **estimator** is used to estimate a parameter of the distribution (population); 
* in **statistical hypothesis testing**, a **test statistic** is used to test a hypothesis, e.g.
	* t statistics
	* chi-squared statistics
	* f statistics
	
### 1.3 Statistical Properties

Important potential properties of statistics include 

* completeness
* consistency
* sufficiency
* unbiasedness
* minimum mean square error
* low variance
* robustness
* computational convenience

## <a name="Statistical-Hypothesis-Test"></a>2. Statistical Hypothesis Test(ing)

A statistical hypothesis test is a method of statistical inference. In statistics, a result is called **statistically significant** if it has been predicted as unlikely to have occurred by chance alone, according to a pre-determined threshold probability, the significance level.  

Statistical hypothesis testing is sometimes called **confirmatory data analysis**, in contrast to EDA, which may not have pre-specified hypotheses.  

简单说，Statistical hypothesis testing 就是指 

1. 提出 $ H_0 $, $ H_a $
2. 建立 test statistic
3. 计算是否应该 reject hypothesis

这么一套流程和方法。

## <a name="Test-Statistic"></a>3. Test Statistic

A test statistic is a statistic used in statistical hypothesis testing.

## <a name="t-test"></a>4. t-test

A t-test is a statistical hypothesis test in which the test statistic follows a Student's t distribution if the null hypothesis is supported.

## <a name="p-value"></a>5. p-value

以 t-test 为例。  

在使用 t-test 时，如果 we assume $ H_0 $ is true，然后我们用的是一个 t-statistic following a Student's t distribution，这时，我们手头上不是有一个 sample 嘛，我们用这个 sample 来算一下这个 t-statistic 的具体值，称为 t-value.  

然后 p-value 就可以用来 answers this question: If my null hypothesis were true, what is the probability of getting a t-value at least as big as mine?  

也就是 $ \text{p-value} = P(\text{t-statistic} \geq \lvert \text{t-value} \rvert \mid H_0 = true) $. Obviously, the lower this value is, the less likely it is that you would find a difference like yours by chance.  

结合分位数的概念来看，当 p-value 越小时，t-value 越靠近 tail，说明在 $ H_0 = true $ 时取到这个 sample 对应的 t-value 的几率越小，于是我们越有信心来 reject $ H_0 $。

一般我们会给 p-value 取个阈值，常用的是 0.05，当 p-value < 0.05 时我们判定 reject $ H_0 $。这个阈值我们称为 Significance Level。

---
layout: post
title: "ISL: Classification - Conceptual Exercises"
description: ""
category: Machine-Learning
tags: []
---
{% include JB/setup %}

Exercises of Chapter 4, An Introduction to Statistical Learning.

Thanks to [An Introduction to Statistical Learning Unofficial Solutions](http://blog.princehonest.com/stat-learning).

主要是摸摸思路，学习下论证目标的转换手法。

-----
-----

## Exercise 2 

(P139) It was stated in the text that classifying an observation to the class for which (4.12) is largest is equivalent to classifying an observation to the class for which (4.13) is largest. Prove that this is the case. In other words, under the assumption that the observations in the kth class are drawn from a $ N(\mu_k, \sigma^2) $ distribution, the Bayes's classifier assigns an observation to the class for which the discriminant function is maximized. 

-----

**Assuming** that $ f_k(x) $ is normal, the probability that an observation $ x $ is in class $ k $ is given by 

$$
	p_k(x) = \frac {\pi_k \frac {1} {\sqrt{2 \pi} \sigma} \exp(- \frac {1} {2 \sigma^2} (x - \mu_k)^2) } {\sum { \pi_l \frac {1} {\sqrt{2 \pi} \sigma} \exp(- \frac {1} {2 \sigma^2} (x - \mu_l)^2) }} 
$$

while the discriminant function is given by 

$$
	\delta_k(x) = x \frac {\mu_k} {\sigma^2} - \frac {\mu_k^2} {2 \sigma^2} + \log(\pi_k) 
$$

**Claim:** Maximizing $ p_k(x) $ is equivalent to maximizing $ \delta_k(x) $.

**Proof:**

Let $ x $ remain fixed and observe that we are maximizing over the parameter $ k $. Suppose that $ \delta_k(x) \geq \delta_i(x) $. We will show that $ f_k(x) \geq f_i(x) $.

From our assumption we have 

$$
	x \frac {\mu_k} {\sigma^2} - \frac {\mu_k^2} {2 \sigma^2} + \log(\pi_k) \geq x \frac {\mu_i} {\sigma^2} - \frac {\mu_i^2} {2 \sigma^2} + \log(\pi_i)
$$

Exponentiation is a monotonically increasing function, so the following inequality holds 

$$
	\pi_k \exp (x \frac {\mu_k} {\sigma^2} - \frac {\mu_k^2} {2 \sigma^2}) \geq \pi_i \exp (x \frac {\mu_i} {\sigma^2} - \frac {\mu_i^2} {2 \sigma^2})
$$

Multipy this inequality by the positive constant 

$$
	c = \frac { \frac {1} {\sqrt{2 \pi} \sigma} \exp(- \frac {1} {2 \sigma^2} x^2) } {\sum { \pi_l \frac {1} {\sqrt{2 \pi} \sigma} \exp(- \frac {1} {2 \sigma^2} (x - \mu_l)^2) }} 
$$

and we have that 

$$
	\frac {\pi_k \frac {1} {\sqrt{2 \pi} \sigma} \exp(- \frac {1} {2 \sigma^2} (x - \mu_k)^2) } {\sum { \pi_l \frac {1} {\sqrt{2 \pi} \sigma} \exp(- \frac {1} {2 \sigma^2} (x - \mu_l)^2) }} \geq \frac {\pi_i \frac {1} {\sqrt{2 \pi} \sigma} \exp(- \frac {1} {2 \sigma^2} (x - \mu_i)^2) } {\sum { \pi_l \frac {1} {\sqrt{2 \pi} \sigma} \exp(- \frac {1} {2 \sigma^2} (x - \mu_l)^2) }} 
$$

or equivalently, $ p_k(x) \geq p_i(x) $. 

Reversing these steps also holds, so we have that maximizing $ \delta_k $ is equivalent to maximizing $ p_k $.

-----

## Exercise 3 

This problem relates to the QDA model, in which the observations within each class are drawn from a normal distribution with a class-specific mean vector and a class-specific covariance matrix. We consider the simple case where $ p = 1 $; i.e. there is only one feature.

Suppose that we have $ K $ classes, and that if an observation belongs to the k^th class then $ X $ comes from a one-dimensional normal distribution, $ X \sim N(\mu_k, \sigma^2 _k) $. Recall that the density function for the one-dimensional normal distribution is given in (4.11). Prove that in this case, the Bayes’ classifier is not linear. Argue that it is in fact quadratic. 

Hint: For this problem, you should follow the arguments laid out in Section 4.4.2, but without making the assumption that $ \sigma^2_1 = \cdots = \sigma^2_k $.

-----

这个题目的关键是如何理解 "the Bayes' classifier is not linear"。其实书上有说，但是太分散了，我总结一下。

首先，根据 P37，Bayes' classifier 所做的就是：如果 $ p_k(X) $ 是 $ max(p_1(X), \cdots, p_K(X)) $，我们就把 $ X $ 归为 $ k $ 类。所以对 Bayes' classifier 而言，$ X $ 值是固定的，它更像是一个关于 $ k $ 的函数。 

但是对单个的 $ p_k(X) $ 而言，它是写成 $ X $ 的函数的，这一点很容易造成混淆。

所以 P139 从 $ p_k(X) $ 到 discriminant function $ \delta_k(X) $ 的推导，i.e. 从 (4.12) 到 (4.13) 的推导，实际说的是：求一个 $ k $ 使 $ p_k(X) = max(p_1(X), \cdots, p_K(X)) $ 等同于求一个 $ k $ 使 $ \delta_k(X) = max(\delta_1(X), \cdots, \delta_K(X)) $。

再根据 P141，我们可以得出说 "A Bayes' classifier is linear" 的逻辑其实是：The Bayes' classifier, a function of $ k $, is linear because its discriminant function for a certain class $ k $, $ \delta_k(X) $, is a linear function of $ X $. 非常非常的绕。

这也提醒我们在遇到 max 的时候要自问一下是 "max among what?"。

至于这道题的思路，hint 已经说得很清楚了，还是以 P139 的 (4.11) 起手，只是不能用 $ \sigma^2_1 = \cdots = \sigma^2_k $ 来得出 (4.12)，需要自己算出来一个新的 $ p_k(X) $，然后再推导到一个新的 $ \delta_k(X) $，证明这个 $ \delta_k(X) $ 是 quadratic of $ X $。

-----

## Exercise 4 

When the number of features $ p $ is large, there tends to be a deterioration in the performance of KNN and other **local** approaches that perform prediction using only observations that are near the test observation for which a prediction must be made. This phenomenon is known as the **curse of dimensionality**, and it ties into the fact that curse non-parametric approaches often perform poorly when $ p $ is large. We will now investigate this curse.

小题目略。

-----

这个题从几何学的角度分析了这个 phenomenon。

When $ p = 1 $, we assume that $ X $ is uniformly (evenly) distributed on [0, 1]. For a certain $ x $, we use $ [x-0.05, x+0.05] $ as its neighborhood. So about 10% of the observations will be used to make the prediction.

When $ p = 2 $, we assume that $ X_1 $ and $ X_2 $ are uniformly (evenly) distributed on [0, 1]. Now only 1% of the observations will be used to make the prediction.

随着 $p$ 增大，neighborhood 的比例越来越小，所以就越来越不准。

-----

## Exercise 8

Suppose that we take a data set, divide it into equally-sized training and test sets, and then try out two different classification procedures. First we use logistic regression and get an error rate of 20% on the training data and 30% on the test data. Next we use 1-nearest neighbors (i.e. $ K = 1 $) and get an average error rate (averaged over both test and training data sets) of 18%. Based on these results, which method should we prefer to use for classification of new observations? Why?

-----

这里其实耍了个诈。

For KNN with $ K=1 $, the training error rate is **definitely 0%** because for any training observation (inputted as test observation), its nearest neighbor will be itself. So, KNN has a test error rate of 36% > 30%.
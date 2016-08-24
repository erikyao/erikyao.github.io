---
layout: post
title: "ML Terminology"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

## confusion matrix $\subset$ contingency table

confusion matrix 常见的是 TP vs FP vs TN vs FN counts，但并不是说只能是 2 $\times$ 2，我还可以是 Actual $A_1,\dots,A_n$ vs Predicted $P_1,\dots,P_n$ 这样的 $n \times n$ table。

contingency table 即一般意上的 2-variable 的统计用表（表头斜线分开，列是 variable 1 的取值，行是 variable 2 的取值），有 marginal total 和 grand total 这些概念。

## Null Accuracy = 1 - Null Error Rate

**Null Error Rate** is how often you would be wrong if you always predicted the majority class, i.e. == $\frac{N_{total} - N_{major}}{N_{total}} = 1 - \frac{N_{major}}{N_{total}}$.

Therefore, the coined term **Null Accuracy** == $\frac{N_{major}}{N_{total}}$

## Out-of-bag (OOB) Error

**OOB error**, a.k.a. **OOB estimate**, is the mean prediction error on each training sample $x_i$, using only the trees that did not have $x_i$ in their bootstrap sample.

也就是说，我们在 bootstrap sampling 的时候，bag 的 data point 拿来 grow a tree 了，out of bag 的 data point 拿来测试，得到的 mean error 就是 OOB error。注意这里 out of bag 的 data point 并不是 validation set，因为 bootstrap sampling 是在 training set 上做的。

OOB error is a valid estimate of the test error for the bagged model. With the number of tree (also the number of bootstrap samples), $B$, sufficiently large, OOB error is virtually equivalent to leave-one-out cross-validation error.

The OOB approach for estimating the test error is particularly convenient when performing bagging on large data sets for which cross-validation would be computationally onerous ([ˈɒnərəs], burdensome).

## ROC is insensitive to class distribution changes

参考自 [Quora: Why is AUC (Area under ROC) insensitive to class distribution changes?](https://www.quora.com/Why-is-AUC-Area-under-ROC-insensitive-to-class-distribution-changes)

这里的 intuitive 应该是：

- 如果把 positive 的 examples 复制一份，那么对这些新的 examples 的 prediction 不变，那么 TP 翻倍，FN 翻倍，true positive rate = $\frac{TP}{TP + FN}$ 保持不变，false negative rate 我们没动
- 如果把 negative 的 examples 复制一份，那么对这些新的 examples 的 prediction 不变，那么 TN 翻倍，FP 翻倍，false positive rate = $\frac{FP}{TN + FP}$ 保持不变，true negative rate 我们没动

如果你想像成 “把部分 positive 改成 negative” 或者 vice versa，这个情况就复杂了，因为你不知道 prediction 会怎么变。

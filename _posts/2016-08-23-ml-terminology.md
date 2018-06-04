---
layout: post
title: "ML Terminology"
description: ""
category: Machine-Learning
tags: []
---
{% include JB/setup %}

## Confusion matrix $\subset$ Contingency table

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

## Oversampling vs Undersampling

Either is used to adjust the class distribution of a data set (i.e. the ratio between the different classes/categories represented).

- Oversampling : you duplicate the observations of the minority class to obtain a balanced dataset.
    - Risk of over-fitting
- Undersampling : you drop observations of the majority class to obtain a balanced dataset.
    - Wasting data

当然也有把 undersample 叫 downsample、把 oversample 叫 upsample 的，比如这篇 note：[How to apply Machine Learning](http://www.cs.cmu.edu/~16831-f14/notes/F11/16831_lecture23_ss1.pdf)。

## Resampling

简单说就是做多次（re-）sample，然后在用这多个 sample 的 statistics（比如取 sample means 的 average）来 estimate 总体的 statistics（比如总体的 mean）。

我们最熟悉的 bootstrap sampling 就是一种具体的 resampling 测略。注意我们的目的是用 sample statistics 来 estimate 总体的 statistics，所以从这个角度来说，cross validation（比如 K-fold）也是 resampling 策略。

## Subsampling

Subsampling 和 bootstrap sampling 一样，也是一种 resampling 的策略，它与 bootstrap sampling 的区别在于：

1. The resample size is smaller than the sample size.
1. Resampling is done without replacement.

## Cross Validation vs Grid Search

这个帖子 [understanding python xgboost cv](http://stackoverflow.com/a/34483222) 说得好：

> Cross-validation is used for estimating the performance of **ONE** set of parameters on unseen data.  
> <!-- -->  
> Grid-search evaluates a model with varying parameters to find the best possible combination of these.  

我们平时总说，“用 cross validation 来 tune parameter”，这个 intuitive 是非常不好的。cross validation 往大了说就是个 resampling 策略，好处是让你的 estimate 更可信更科学，但是到 parameter tuning 这一块，cross validation 是不会自动帮你挑出 optimal 的一套 parameter 的，因为 cross validation 只能告诉你 “parameter set $A$ 得出的 estimate 是 $e_A$，parameter set $B$ 得出的 estimate 是 $e_B$” 这类的信息，你至少需要写一个 for loop 来尝试所有的 parameter 组合（对每一个 parameter 的组合再使用 cross validation），然后挑出 optimal 的 parameter 组合。

cross validation 是不会帮你写这个 “for loop 再挑 optimal” 的 framework 的，但是有人会，它就是 grid search。

在 XGBoost 的 python 版本里，`cv` method 你只能传一套参数给它，grid search 是交给 scikit-learn 来做的，比如：

```python
cv_params = {
    'num_boost_round': 100,
    'eta': 0.05,
    'max_depth': 6,
    'subsample': 0.9,
    'colsample_bytree': 0.9
} # 这是一套固定的参数

gs_param = {
    'num_boost_round': [100, 250, 500],
    'eta': [0.05, 0.1, 0.3],
    'max_depth': [6, 9, 12],
    'subsample': [0.9, 1.0],
    'colsample_bytree': [0.9, 1.0]
}
```

grid search 会根据 `gs_param` 自动衍生出 $3 \times 3 \times 3 \times 2 \times 2 = 108$ 套参数，然后自动帮你跑 108 遍 cross validation（当然你也可以设置不用 cross validation）来挑出 optimal 的一套。

所以相比 “用 cross validation 来 tune parameter”，更好理解的说法应该是 “用 grid search 来 tune parameter；为了使 estimate 更准确，请在 grid search 的过程中使用 cross validation”。
 
## Bias vs Variance

Nice summary from [On Over-fitting in Model Selection and Subsequent Selection Bias in Performance Evaluation](http://dl.acm.org/citation.cfm?id=1756006.1859921):

>  ...bias, represents the difference between the expected value of the estimator and the unknown value of the true generalization error...variance, reflects the variability of the estimator around its expected value due to the sampling of the data $D$ on which it is evaluated. 

Another nice post on these 2 concepts is [Understanding the Bias-Variance Tradeoff](http://scott.fortmann-roe.com/docs/BiasVariance.html).

上课的时候为啥不能讲得这么明白……

最后记得 $\text{Error} = \text{Bias} + \text{Variance}$。
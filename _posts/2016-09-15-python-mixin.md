---
layout: post
title: "Python: Mixin"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

首先 a Mixin is class to be mixed-in，它在 python 里起到的作用类似于 interface 或者 abstract class，但是又有点微小的差别，我们来看个例子：

```python
class TransformerMixin(object):
    """Mixin class for all transformers in scikit-learn."""

    def fit_transform(self, X, y=None, **fit_params):
        """Fit to data, then transform it.
        Fits transformer to X and y with optional parameters fit_params
        and returns a transformed version of X.
        Parameters
        ----------
        X : numpy array of shape [n_samples, n_features]
            Training set.
        y : numpy array of shape [n_samples]
            Target values.
        Returns
        -------
        X_new : numpy array of shape [n_samples, n_features_new]
            Transformed array.
        """
        # non-optimized default implementation; override when a better
        # method is possible for a given clustering algorithm
        if y is None:
            # fit method of arity 1 (unsupervised transformation)
            return self.fit(X, **fit_params).transform(X)
        else:
            # fit method of arity 2 (supervised transformation)
            return self.fit(X, y, **fit_params).transform(X)
```

这是 scikit-learn 的 [`TransformerMixin`](http://scikit-learn.org/stable/modules/generated/sklearn.base.TransformerMixin.html)。理论上，你若是要自定义一个 Transformer，理应继承这个 Mixin（当然，你自己凭空造一个也是可以的）。

我们明显可以看到：

1. `fit_transform()` 方法有实现，所以它不是一个纯的 interface
2. 用到了 `fit()` 方法和 `transform()` 方法，但是这两个方法没有实现就罢了，连定义也没有，所以 Mixin 可以提供 "隐式的 interface 约定"，即没有强制要求你实现某个方法但如果你不实现就会有麻烦

所以 Mixin 你简单理解为是一种松散的 interface + abstract class 混合体就好了。
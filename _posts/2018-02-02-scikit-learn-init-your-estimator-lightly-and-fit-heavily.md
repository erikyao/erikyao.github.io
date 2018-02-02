---
layout: post
title: "scikit-learn: init your estimator lightly and fit heavily"
description: ""
category: sklearn
tags: [cross-validation]
---
{% include JB/setup %}

If you run `cross_validate(n_jobs > 1)` with your own estimator, pay attention that your estimator will be copied per job.

[sklearn.model_selection.cross_validate()](https://github.com/scikit-learn/scikit-learn/blob/a24c8b464d094d2c468a16ea9f8bf8d42d949f84/sklearn/model_selection/_validation.py#L203)

```python
scores = parallel(
        delayed(_fit_and_score)(
            clone(estimator), X, y, scorers, train, test, verbose, None,
            fit_params, return_train_score=return_train_score,
            return_times=True)
        for train, test in cv.split(X, y, groups))
```

[sklearn.base.copy()](https://github.com/scikit-learn/scikit-learn/blob/a24c8b464d094d2c468a16ea9f8bf8d42d949f84/sklearn/base.py#L30):

```python
estimator_type = type(estimator)
if estimator_type in (list, tuple, set, frozenset):
    return estimator_type([clone(e, safe=safe) for e in estimator])
elif not hasattr(estimator, 'get_params'):
    if not safe:
        return copy.deepcopy(estimator)

# Serveral lines omitted

new_object_params = estimator.get_params(deep=False)
for name, param in six.iteritems(new_object_params):
    new_object_params[name] = clone(param, safe=False)
```

[sklearn.base.get_params()](https://github.com/scikit-learn/scikit-learn/blob/a24c8b464d094d2c468a16ea9f8bf8d42d949f84/sklearn/base.py#L187)

```python
init = getattr(cls.__init__, 'deprecated_original', cls.__init__)
```

So basically what you list in your estimator's `__init__` signature will be DEEP copied. Once I initialized my estimator with a 6GB matrix and run `cross_validate(n_jobs = 10)`...My workstation exploded that day.

If possible, put all those heavy parameters to your `fit` method. Afterall, we can call `cross_validate(n_jobs > 1, fit_params=kwargs)`.
---
layout: post
title: "Python: Generator Expressions"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

其实 [Digest of Fluent Python](/python/2016/09/16/digest-of-fluent-python#14-6-Sentence-Take-5-A-Generator-Expression) 里有讲，只是我实在是太不习惯它的用法了：

> Generator expressions are syntactic sugar: they can always be replaced by generator functions, but sometimes are more convenient.  
> <br/>
> Syntax Tip: When a generator expression is passed as the single argument to a function or constructor, you don’t need to write its parentheses.  

绝大多数情况下，generator expression 是要带括号的，比如 `(i * 5 for i in range(1, 5))`，它返回一个 generator，相当于 `yield from range(1, 5)`。只有当 generator expression 用作 argument 时可以不带。所以看到 `func(i for i in xxx)` 这种形式要注意参数其实是个 generator（所以必然是个 iterable），而且它只算一个 argument，不要想到 [unpack](/python/2016/09/25/python-starred-expression) 那边去了。

这也可以帮助记忆 “Python 不存在 tuple comprehension 这种东西”。下面这个 workaround 其实是调用 `tuple` 构造器，传了一个 generator expression 给它：

```python
>>> tuple(i for i in [1, 2, 3])
(1, 2, 3)
```

看多了就习惯了，比如 [PEP 289 -- Generator Expressions](https://www.python.org/dev/peps/pep-0289/) 上的例子（看着还是有点别扭）：

```python
# For instance, the following summation code will build a full list of squares in memory, iterate over those values, and, when the reference is no longer needed, delete the list:
sum([x*x for x in range(10)])

# Memory is conserved by using a generator expression instead:
sum(x*x for x in range(10))
```

[`joblib.Parallel`](https://github.com/scikit-learn/scikit-learn/blob/master/sklearn/externals/joblib/parallel.py#L272) 里的一个用法是：

```python
scores = parallel(
    delayed(_fit_and_score)(
        clone(estimator), X, y, scorers, train, test, verbose, None,
        fit_params, return_train_score=return_train_score,
        return_times=True, return_estimator=True, error_score=-1)
    for train, test in cv.split(X, y, groups))
```

这里 [`delayed`](https://github.com/scikit-learn/scikit-learn/blob/master/sklearn/externals/joblib/parallel.py#L169) 其实是个 decorator，整体上看来，它的作用相当于：

```python
def delayed(func)(*args, **kwargs):
    return func, args, kwargs
```

所以 `delayed(func)(*args, **kwargs) for train, test in cv.split()` 本质是一个 generator expression，它相当于：

```python
def gen():
    for train, test in cv.split():
        yield func, args, kwargs
```

然后 `parallel.__call__(iterable)` 来接收这个 generator，把每一组 `(func, args, kwargs)` dispatch 出去，让子进程或者子线程去处理。
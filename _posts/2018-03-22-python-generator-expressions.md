---
layout: post
title: "Python: Generator Expressions / joblib.Parallel"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

其实 [Digest of Fluent Python](/python/2016/09/16/digest-of-fluent-python#14-6-Sentence-Take-5-A-Generator-Expression) 里有讲，只是我实在是太不习惯它的用法了：

> Generator expressions are syntactic sugar: they can always be replaced by generator functions, but sometimes are more convenient.  
> <br/>
> Syntax Tip: When a generator expression is passed as the single argument to a function or constructor, you don’t need to write its parentheses.  

## 1. Generator Expression and Parentheses

绝大多数情况下，generator expression 是要带括号的，比如 `(i * 5 for i in range(1, 5))`，它返回一个 generator，相当于 `yield from range(1, 5)`。

当 generator expression 用作 function 的 **唯一** argument 时，可以不带括号。[Guido van Rossum: Disallow ambiguous syntax `f(x for x in [1],)`](https://mail.python.org/pipermail/python-dev/2017-November/150486.html) 有曰：

> Initially generator expressions always had to be written inside parentheses, as documented in [PEP 289](https://www.python.org/dev/peps/pep-0289/). The additional parenthesis could be omitted on calls with only one argument, because in this case the generator expression already is written inside parentheses.
 
所以看到 `func(i for i in xxx)` 这种形式要注意：

- 这个函数其实只有一个参数
- 这个参数其实是个 generator
- 不要想到 [unpack](/python/2016/09/25/python-starred-expression) 那边去了

比如 [PEP 289 -- Generator Expressions](https://www.python.org/dev/peps/pep-0289/) 上的例子：

```python
# For instance, the following summation code will build a full list of squares in memory, iterate over those values, and, when the reference is no longer needed, delete the list:
sum([x*x for x in range(10)])  # OK

# Memory is conserved by using a generator expression instead:
sum(x*x for x in range(10))  # OK
```

这也可以帮助记忆 “Python 不存在 tuple comprehension 这种东西”。下面这个 workaround 其实是调用 `tuple` 构造器，传了一个 generator expression 给它：

```python
>>> tuple(i for i in [1, 2, 3])
(1, 2, 3)
```

## 2. SyntaxError: Generator expression must be parenthesized

但当 generator expression 不是 function 的唯一 argument 时，它必须带括号，否则会报 `SyntaxError: Generator expression must be parenthesized`。比如：

```python
sum([x for x in range(10)], default = 0)  # OK

sum(x for x in range(10), default = 0)  # SyntaxError
```

题外话：这个 `default` 还是很有用的，它的作用是当前面的 generator 为空时让 `sum` 能返回一个默认值

## 3. `joblib.Parallel`

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
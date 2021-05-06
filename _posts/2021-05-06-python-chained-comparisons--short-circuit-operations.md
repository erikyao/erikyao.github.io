---
layout: post
title: "Python: chained comparisons / short-circuit operations"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

我本来只想记录下 short-circuit operations，但是 chained comparisons 我很少写，这里一并记录下。

## 1. Chained Comparisons

From [The Python Language Reference >> 6.10. Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons):

> Formally, if `a, b, c, …, y, z` are expressions and `op1, op2, …, opN` are comparison operators, then `a op1 b op2 c ... y opN z` is equivalent to `(a op1 b) and (b op2 c) and ... (y opN z)`, except that each expression is evaluated **at most once**.

## 2. Short-circuit Operations

有三类场景，但本质是一样的。

### 2.1 Short-circuit Boolean Operations

`x or y`，`x and y` 以及 `not x` 在语法上等价于：

```python
def (x or y):
    # if x:
    #     return x
    # else:
    #     return y

    return x if x else y

def (x and y):
    # if x:
    #     return y
    # else:
    #     return x

    return y if x else x

def (not x):
    # if x:
    #     return False
    # else:
    #     return True

    return False if x else True
```

这里一定要注意：

- 只有 `not` 一定是返回 bool `True/False` 的
- **`and` 和 `or` 返回的是 `x`, `y` 而不是 `bool(x)`, `bool(y)`**
  - 这是我长久以来的误解

这使得 `and` 和 `or` 有一种特殊的 assignment 的作用，比如：

```python
def __init__(self, lst):
    self.lst = lst or []  # 如果 bool(lst) == False，则初始化为 []；否则初始化为 lst
```

### 2.2 Short-circuit `all()` and `any()`

这个好理解，因为 `all()` 语法上等价于：

```python
def all(iterable):
    for element in iterable:
        if not element:
            return False
    return True
```

`any()` 语法上等价于：

```python
def any(iterable):
    for element in iterable:
        if element:
            return True
    return False
```

### 2.3 Short-circuit Chained Comparisons

python 的 comparisons (`<`, `>`, `==`, `>=`, `<=`, `!=`, `is [not]`, `[not] in`) 一定返回 bool `True/False`

然后联系：

1. chained comparisons 是 chained `and` operations
2. each expression is evaluated **at most once**

就能很简单地判断 short-circuit 的场景，比如：

```python
>>> def zero():
...     print("Calling zero()")
...     return 0
... 

>>> def one():
...     print("Calling one()")
...     return 1
...

>>> 2 > one() > 0  # one() is evaluated only once
Calling one()  
True

>>> zero() > 2 > one()  # one() is short-circuited
Calling zero()  
False
```

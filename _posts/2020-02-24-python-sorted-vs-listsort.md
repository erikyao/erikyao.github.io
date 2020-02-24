---
layout: post
title: "Python: <i>sorted()</i> vs <i>list.sort()</i>"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

Table of Contents:

<!-- TOC -->

- [Summary](#summary)
- [Recipe 1: How to sort dict entries by keys?](#recipe-1-how-to-sort-dict-entries-by-keys)
- [Recipe 2: How to sort a list of custom objects?](#recipe-2-how-to-sort-a-list-of-custom-objects)

<!-- /TOC -->

## Summary

其实这两个函数的区别看 `help` 就能看出很多：

```python
>>> # Python 3.5.2
>>> help(sorted)
Help on built-in function sorted in module builtins:

sorted(iterable, key=None, reverse=False)
    Return a new list containing all items from the iterable in ascending order.
    
    A custom key function can be supplied to customise the sort order, and the
    reverse flag can be set to request the result in descending order.
```

```python
>>> # Python 3.5.2
>>> help(list.sort)
Help on method_descriptor:

sort(...)
    L.sort(key=None, reverse=False) -> None -- stable sort *IN PLACE*
```

- `sorted()` 的意思更像是 `sorted_list_from(x)`
    - 它可以用在任意的 iterable 上，比如：
        - string
        - tuple
            - 虽然 tuple 是 immutable 的，但 `sorted()` 又不是 in-place 操作，所以无妨
        - dict
            - **返回的是 sorted keys**
        - generator
    - **返回值一定是个新 list**
- `sort()` 竟然是 `list` 类型**专属**的 method，有点出乎我的意料
    - 它是 in-place 操作
    - 号称是 stable 的但是我没有研究它具体是怎么实现的

这两个函数的 `key` 参数的用法是一样的，都应该是一个 function，表示用 `key(x1) < key(x2)` 而不是 `x1 < x2` 的关系来决定 `x1, x2` 的顺序。`key = None` 是应该是默认使用 `x1.__lt__(x2)`

## Recipe 1: How to sort dict entries by keys?

这个 topic 有点微妙，因为我们一直强调的是 "`dict` 并不能保证 `key` 的 insertion order"，但这一点随着 python 的发展在发生变化。根据 [Eugene Yarmash](https://stackoverflow.com/a/40007169):

- Python 3.7+
    - In Python [3.7.0](https://docs.python.org/3.7/whatsnew/3.7.html) the insertion-order preservation nature of [`dict`](https://docs.python.org/3.7/library/stdtypes.html#typesmapping) objects [has been declared](https://mail.python.org/pipermail/python-dev/2017-December/151283.html) to be an official part of the Python language spec. Therefore, you can depend on it.
- Python 3.6 (CPython)
    - As of Python 3.6, for the CPython implementation of Python, dictionaries [maintain insertion order](https://docs.python.org/3.6/whatsnew/3.6.html#new-dict-implementation) by default. This is considered an implementation detail though; you should still use [`collections.OrderedDict`](https://docs.python.org/3/library/collections.html#collections.OrderedDict) if you want insertion ordering that's guaranteed across other implementations of Python.
- Python >=2.7 and <3.6
    - Use the [`collections.OrderedDict`](https://docs.python.org/3/library/collections.html#collections.OrderedDict) class when you need a `dict` that remembers the order of items inserted.

所以需要根据你使用的版本来决定你是该用 `dict` 还是 `OrderedDict`:

```python
# Python 3.5.2

x = {"cranberry": 99, "durian": 0, "apple":2, "banana": 3}

sorted_x = OrderedDict((key, x[key]) for key in sorted(x))
    # OR
sorted_x = OrderedDict(sorted(x.items()))  # Better!
```

注意 `OrderedDict` 的 `__str__` 和 `__repr__` 打印出来的 representation 和普通的 `dict` 不一样

```python
>>> x
{'apple': 2, 'banana': 3, 'cranberry': 99, 'durian': 0}
>>> sorted_x
OrderedDict([('apple', 2), ('banana', 3), ('cranberry', 99), ('durian', 0)])
```

## Recipe 2: How to sort a list of custom objects?

如果你有可以通用的 `__lt__(self, other)` 逻辑，可以去实现 `__lt__(self, other)`。但要注意不要专门为了某一个特定的 sorting 的需求去写 `__lt__(self, other)`。

```python
class Student:
    def __init__(self, name, grade, age):
        self.name = name
        self.grade = grade
    
    def __lt__(self, other):
        return self.grade < other.grade  # Is this always the case? 
```

更 general 的、不那么 invasive 的写法是用 `key` 参数:

```python
sorted(student_objects, key=lambda student: student.grade)

from operator import itemgetter, attrgetter

sorted(student_tuples, key=itemgetter(1))
sorted(student_objects, key=attrgetter('grade'))
```
---
layout: post
title: "Python: <i>enumerate()</i>"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

## 1. `enumerate(start=0)`

注意这个 optinal 的 `start` 参数，表示 `enumerate` yield 出来的 index 的起始值，比如：

```python
In [1]: list(enumerate(["foo", "bar", "baz"], start=100))
Out[1]: [(100, 'foo'), (101, 'bar'), (102, 'baz')]                                           
```

这一点在你 `enumerate` slice 的时候很好用。一个常见的错误：比如你要 `enumerate(array[i:])`，你可能会默认了 yield 出的 index 会从 `i` 开始，但其实并不会。为了实现你这个目的，可以用 `enumerate(array[i:], start=i)`，比如：

```python
In [3]: array = [None, 100, 200, 300]

In [7]: list(enumerate(array[1:]))
Out[7]: [(0, 100), (1, 200), (2, 300)]  # 这个 indexing 可能不是你想要的效果

In [5]: list(enumerate(array[1:], start=1)
Out[5]: [(1, 100), (2, 200), (3, 300)]
```

## 2. `enumerate` 与 `reversed`

就是要注意下 $f_{enum} \circ f_{rev}$ 与 $f_{rev} \circ f_{enum}$ 的区别：

```python
In [12]: list(enumerate(reversed(['a', 'b', 'c']))) 
Out[12]: [(0, 'c'), (1, 'b'), (2, 'a')]

In [14]: list(reversed(enumerate(['a', 'b', 'c']))) 
---------------------------------------------------------------------------
TypeError                                 Traceback (most recent call last)
<ipython-input-14-c6f1fa656095> in <module>
----> 1 list(reversed(enumerate(['a', 'b', 'c'])))

TypeError: 'enumerate' object is not reversible

In [15]: list(reversed(list(enumerate(['a', 'b', 'c']))))
Out[15]: [(2, 'c'), (1, 'b'), (0, 'a')]
```
---
layout: post
title: "Python: Iterating a file by every 2 lines"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

一个有点鸡贼的方法：

```python
import itertools

with open(path) as f:
    for line_1, line_2 in itertools.zip_longest(*[f]*2):
        process(line_1)
        process(line_2)
```

首先 `f` 是个 iterator，我们有 `iter(f) == f`，所以 `[f]*2` 可以理解这样：

```python
f = iter(that_file)
[f] * 2 = [f, f] != [iter(that_file), iter(that_file)]
```

注意，"把一个 iterator 引用两次" 和 "create 两个 iterator" 是完全不同的两个概念。

然后 `*[f]*2` 就是 unpack 了。

根据 [zip 的实现](/python/2016/09/29/python-zip)，这个方法相当于在不断地 yield `(next(f), next(f))` 这样一个 tuple，直到 `next(f)` `raise StopIteration()`。

- 当文件有偶数行时，新一轮 yield 的第一个 `next` 操作，i.e. `(next(f), ...)` 会 `raise StopIteration()`
- 当文件有偶数行时，新一轮 yield 的第二个 `next` 操作，i.e. `(..., next(f))` 会 `raise StopIteration()`
    - 由于是 `zip_longest()`，所以我们会得到一个 `(last_line, fillvalue=None)`
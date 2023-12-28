---
category: Python
description: ''
tags: []
title: 'Python: <i>except</i>'
---

简单说一下。`except` 可以接一个 tuple 表示捕捉多种类型的异常，也可以不带任何参数表示捕捉 everything（当然这是一个 anti-pattern）。

以下写法都是合法的，注意 `as` 的位置：

```python
>>> try:
...     1 / 0
... except:
...     raise
... 
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
ZeroDivisionError: division by zero
```

```python
try:
    1 / 0
except (ValueError, ZeroDivisionError) as e:
    print(type(e))

# Output: <class 'ZeroDivisionError'>
```

另外不存在 `except as e` 和 `except (Exception1, Exception2 as ex2)` 这样的写法！
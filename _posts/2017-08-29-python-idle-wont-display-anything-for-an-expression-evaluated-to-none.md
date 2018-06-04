---
layout: post
title: "Python: IDLE won't display anything for an expression evaluated to None"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

This is trivial but sometimes misleading.

```python
>>> 1
1
>>> 2
2
>>> 'Foo'
'Foo'
>>> None  # Nothing displayed on the next line
>>> b = None
>>> b  # Nothing displayed on the next line
```

Most misleading when a generator yields a `None`--it does yield something, just not displayed:

```python
>>> def gen_none():
...     yield None
... 
>>> g = gen_none()
>>> next(g)  
>>> # Did it yield a value?
```

However, 

```python
>>> str(None)
'None'
>>> repr(None)
'None'
>>> print(None)
None
```

Jupyter notebooks behave the same way. See [Stack Overflow: Display None values in IPython](https://stackoverflow.com/a/18083138)。
---
title: "Python Language Services: `keyword` Module"
description: ""
category: Compiler
tags: []
toc: false
toc_sticky: false
---

- Docs: [`keyword` — Testing for Python keywords](https://docs.python.org/3/library/keyword.html)
- Source Code: [cpython/Lib/keyword.py](https://github.com/python/cpython/blob/3.13/Lib/keyword.py)

```python
__all__ = ["iskeyword", "issoftkeyword", "kwlist", "softkwlist"]

kwlist = [
    'False',
    'None',
    'True',
    # ......
    'yield'
]

softkwlist = [
    '_',
    'case',
    'match',
    'type'
]

iskeyword = frozenset(kwlist).__contains__
issoftkeyword = frozenset(softkwlist).__contains__
```

Python 的 tokenizer 会把 keyword, 比方说 `if` 直接识别成 `TokenInfo(type=NAME, string="if")`, 并不会涉及 `keyword` 这个 module.

Docs 上直接说了：

> This module allows a Python program to determine if a string is a [keyword](https://docs.python.org/3/reference/lexical_analysis.html#keywords) or [soft keyword](https://docs.python.org/3/reference/lexical_analysis.html#soft-keywords).

> ... but this distinction is done at the parser level, not when tokenizing.
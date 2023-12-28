---
category: Python
description: ''
tags: []
title: 'Python 3: Keyword-Only Arguments'
---

参 _Effective Python Item 21: Enforce Clarity with Keyword-Only Arguments_ 和 [PEP 3102 -- Keyword-Only Arguments](https://www.python.org/dev/peps/pep-3102/)。

语法 `foo(a, b, *, x, y)` 可以强制你给 `x`、`y` 传参数时必须传 keyword arguments，i.e. 必须是 `foo(1, 2, x=3, y=4)` 而不能是 `foo(1, 2, 3, 4)`。The `*` symbol in the argument list indicates the end of positional arguments and the beginning of keyword-only arguments.
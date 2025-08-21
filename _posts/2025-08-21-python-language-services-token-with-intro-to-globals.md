---
title: "Python Language Services: `token` module (with intro to `globals()`)"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 1. Python `token` module

Source Code: [cpython/Lib/token.py](https://github.com/python/cpython/blob/3.13/Lib/token.py).

它的源头是 [cpython/Grammar/Tokens](https://github.com/python/cpython/blob/3.13/Grammar/Tokens) (这是个文本文件)，然后通过 [cpython/Tools/build/generate_token.py](https://github.com/python/cpython/blob/3.13/Tools/build/generate_token.py) 的 `make_py(infile="Grammar/Tokens", outfile='Lib/token.py')` 生成而来的。

还是蛮经典的 constants 写法，也用了 int values 上的一些小 tricks:

```python
__all__ = ['tok_name', 'ISTERMINAL', 'ISNONTERMINAL', 'ISEOF',
           'EXACT_TOKEN_TYPES']

ENDMARKER = 0
NAME = 1
NUMBER = 2
STRING = 3
# ......
COMMENT = 62
NL = 63
# These aren't used by the C tokenizer but are needed for tokenize.py
ERRORTOKEN = 64
ENCODING = 65
N_TOKENS = 66
# Special definitions for cooperation with parser
NT_OFFSET = 256

tok_name = {value: name
            for name, value in globals().items()
            if isinstance(value, int) and not name.startswith('_')}
__all__.extend(tok_name.values())

EXACT_TOKEN_TYPES = {
    '!': EXCLAMATION,
    '!=': NOTEQUAL,
    '%': PERCENT,
    # ......
}

def ISTERMINAL(x):
    return x < NT_OFFSET

def ISNONTERMINAL(x):
    return x >= NT_OFFSET

def ISEOF(x):
    return x == ENDMARKER
```

# 2. `globals()` 的用法

`tok_name` 用到了 `globals()`. [文档](https://docs.python.org/3/library/functions.html#globals)有写：

> Return the dictionary implementing the current module namespace. For code within functions, this is set when the function is defined and remains the same regardless of where the function is called.

这个 "current" 可能有点 misleading. 我觉得更准确的描述应该是 "`globals()` returns 其所在 module namespace 的 `__dict__`". 举个例子：

```python
# src/ModuleX.py

import sys

module_globals = globals()
# sys.modules[__name__] refers to the current module (like a `this` at module level)
module___dict__ = sys.modules[__name__].__dict__

def module_globals_func():
    return globals()
```

```python
# tests/test_ModuleX.py
import unittest

from src.ModuleX import module_globals, module___dict__, module_globals_func

class MyTestCase(unittest.TestCase):
    def test_something(self):
        self.assertIs(module_globals, module___dict__)        # 📌 1️⃣
        self.assertIs(module_globals, module_globals_func())  # 📌 2️⃣

        self.assertIsNot(module_globals, globals())           # 📌 3️⃣

if __name__ == '__main__':
    unittest.main()
```

Remarks:

- 📌 1️⃣: `globals()` 等价于 `__dict__` at module level
- 📌 2️⃣: 即使是被 imported，`module_globals_func()` 调用的 `globals()` 仍然是 `ModuleX` 的
- 📌 3️⃣: imported `ModuleX`'s `globals()` is not the same with current module's `globals()`

你也可以理解成 `globals()` 的 evaluation 需要提供一个 namespace 给它 ([来源](https://discuss.python.org/t/where-is-the-globals/18642/3)):

```python
eval("globals()", ModuleX.__dict__)  # 等价于在 ModuleX 的 namespace 内调用 globals()
```

- 在 `MyTestCase` 中调用 `module_globals_func()` 自然要 refer 函数自己的 module namespace，所以就回溯到了 `ModuleX`
- 而在 `MyTestCase` 中直接调用 `globals()` 相当于是默认为当前的 module namespace
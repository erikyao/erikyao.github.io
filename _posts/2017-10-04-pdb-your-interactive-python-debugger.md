---
layout: post
title: "pdb: Your interactive python debugger"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

_Effective Python Item 57: Consider Interactive Debugging with pdb_

先看例子：

```python
>>> def func():
...     a = 1
...     b = 2
...     import pdb; pdb.set_trace()  # ①
...     c = 3
...     return 4
... 
>>> func()
> <stdin>(5)func()
(Pdb) bt  # ②
  <stdin>(1)<module>()
> <stdin>(5)func()
(Pdb) p(a)  # ③
1
(Pdb) p(b)  # ③
2
(Pdb) whatis(a)
<class 'int'>
```

- ① Call `pdb.set_trace()` to enter the debugger at the calling stack frame. It is useful to hard-code a breakpoint at a given point in a program.
    - debugger console 下的 `b(reak)` 命令是用来动态创建 breakpoint 的
    - 这里写成一行是方便你注释掉用的（一般你不会在 console 里定义函数，肯定是从你自己的 module 里 import 进来的，所以这里是方便你在你自己的 module 里注释掉）
- ② 进入 debugger console
- ③ 检查 local variables

进入 debugger console 之后，有这些 commands 可以用（完整的说明请参考 [Python Documentation: 27.3.1. Debugger Commands](https://docs.python.org/3/library/pdb.html#debugger-commands)）:

- `bt`: Print the traceback of the current execution call stack. 
- `u` or `up`: Move your scope up the function call stack to the caller of the current function. This allows you to inspect the local variables in higher levels of the call stack.
- `d` or `down`: Move your scope back down the function call stack one level.
- `p(expression)`: Evaluate `expression` in the current context and print its value.
    - `print()` can also be used, but is not a debugger command—this executes the Python `print()` function.
- `pp(expression)`: Like the `p` command, except using `pprint` to print
- `whatis(expression)`: Print the type of `expression`
- `s` or `step`: Execute the current line, stop at the first possible occasion (either in a function that is called or on the next line in the current function).
- `n` or `next`: Execute the current line, stop at the next line.
    - If the current line includes calling a function, the debugger will not stop until the called function has returned.
- `c` or `continue`: Continue execution until the next breakpoint.
- `r` or `return`: Continue execution until the current function returns.
- `q` or `quit`: Quit from the debugger. The program being executed is aborted.
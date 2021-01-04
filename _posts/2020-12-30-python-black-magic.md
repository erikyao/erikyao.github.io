---
layout: post
title: "《Python黑魔法手册》摘抄"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

## ToC

- [2.14 把模块当做脚本来执行 7 种方法及原理 (`python -m`)](#214-把模块当做脚本来执行-7-种方法及原理-python--m)
- [3.6 海象运算符的三种用法 (`:=`)](#36-海象运算符的三种用法-)
- [3.8 Python 转义的五种表示法](#38-python-转义的五种表示法)
- [3.10 装饰器的六种写法 (decorator)](#310-装饰器的六种写法-decorator)
- [4.2 深入理解描述符 (descriptor)](#42-深入理解描述符-descriptor)
- [4.3 神奇的元类编程](#43-神奇的元类编程)
- [5.3 单行实现 for 死循环如何写 + 5.6 如何流式读取数G超大文件 (`iter(callable, sentinel)`)](#53-单行实现-for-死循环如何写--56-如何流式读取数g超大文件-itercallable-sentinel)
- [5.4 如何关闭异常自动关联上下文 (`raise e2 from e1`)](#54-如何关闭异常自动关联上下文-raise-e2-from-e1)
- [5.7 实现类似 defer 的延迟调用 + 5.11 在程序退出前执行代码的技巧](#57-实现类似-defer-的延迟调用--511-在程序退出前执行代码的技巧)
- [5.14 单分派泛函数如何写 (`@singledispatch`)](#514-单分派泛函数如何写-singledispatch)
- [5.20 让你晕头转向的 else 用法](#520-让你晕头转向的-else-用法)
- [5.24 对齐字符串的两种方法](#524-对齐字符串的两种方法)
- [7.1 远程登陆服务器的最佳利器 (`paramiko` 库)](#71-远程登陆服务器的最佳利器-paramiko-库)
- [7.2 代码 BUG 变得酷炫的利器 (`pretty-errors` 库)](#72-代码-bug-变得酷炫的利器-pretty-errors-库)
- [7.4 规整字符串提取数据的神器 (`parse` 库)](#74-规整字符串提取数据的神器-parse-库)
- [7.5 一行代码让代码运行速度提高100倍 (`numba` & `jit`)](#75-一行代码让代码运行速度提高100倍-numba--jit)
- [7.6 新一代的调试神器：`PySnooper`](#76-新一代的调试神器pysnooper)

-----

感谢作者[王炳明](http://magic.iswbm.com/zh/latest/aboutme.html)写了这么多内容。这本《[Python黑魔法手册](http://magic.iswbm.com/zh/latest/index.html)》语言平实，举例得当。虽然前面有些简单的 "黑魔法" 我看来也就是 "茴香豆的四种写法"，但后面高级的、有趣的内容也不少，这里摘一摘。

## 2.14 把模块当做脚本来执行 7 种方法及原理 (`python -m`)

[Source](http://magic.iswbm.com/zh/latest/c02/c02_14.html)

介绍了 `python -m` 的机制

## 3.6 海象运算符的三种用法 (`:=`)

[Source](http://magic.iswbm.com/zh/latest/c03/c03_06.html)

介绍了 python 3.8 引入的 `:=`

## 3.8 Python 转义的五种表示法

[Source](http://magic.iswbm.com/zh/latest/c03/c03_08.html)

其实我在意的是那个 "垂直定位符"，感觉会是格式化输出的神器……

## 3.10 装饰器的六种写法 (decorator)

[Source](http://magic.iswbm.com/zh/latest/c03/c03_10.html)

很好的复习材料

## 4.2 深入理解描述符 (descriptor)

[Source](http://magic.iswbm.com/zh/latest/c04/c04_02.html)

不光介绍了 descriptor，还研究了下如何用 descriptor 实现 `@property`、`@classmethod`、`@staticmethod`

## 4.3 神奇的元类编程

[Source](http://magic.iswbm.com/zh/latest/c04/c04_03.html)

很好的复习材料

## 5.3 单行实现 for 死循环如何写 + 5.6 如何流式读取数G超大文件 (`iter(callable, sentinel)`)

[Source 5.3](http://magic.iswbm.com/zh/latest/c05/c05_03.html) + [Source 5.6](http://magic.iswbm.com/zh/latest/c05/c05_06.html)

`iter()` 的完全体：`iter(object[, sentinel])`，参考 [Built-in Functions: iter](https://docs.python.org/3/library/functions.html#iter):

- 不带 `sentinel` 参数时：
  - 要求 `object` 要么实现 iteration protocol (i.e. `__iter__()`)，要么实现 sequence protocol (i.e. `__getitem__()`)
  - 否则 `TypeError`
- 带 `sentinel` 参数时：
  - 要求 `object` 是一个 callable
  - iterator 运行至 `object() == sentinel` 为止

因为 `int()` 一定返回 `0`，所以 `iter(int, 1)` 就是个 infinite 的 `0` generator

## 5.4 如何关闭异常自动关联上下文 (`raise e2 from e1`)

[Source](http://magic.iswbm.com/zh/latest/c05/c05_04.html)

方便你控制 exception stack

## 5.7 实现类似 defer 的延迟调用 + 5.11 在程序退出前执行代码的技巧

[Source 5.7](http://magic.iswbm.com/zh/latest/c05/c05_07.html) + [Source 5.11](http://magic.iswbm.com/zh/latest/c05/c05_11.html)

register 一个 hook/callback 在 context manager 退出后执行：

```python
# magic0507.py
import contextlib

def callback():
    print('Goodbye!')

with contextlib.ExitStack() as stack:
    stack.callback(callback)
    print("Hello!")
```

```bash
user@host % python3 magic0507.py
Hello!
Goodbye!
```

register 一个 hook/callback 在 script 退出后执行：

```python
# magic0511.py
import atexit

@atexit.register
def run_on_exit():
    print("Goodbye!")

1/0
```

```bash
user@host % python3 magic0511.py
Traceback (most recent call last):
  File "magic0511.py", line 7, in <module>
    1/0
ZeroDivisionError: division by zero
Goodbye!
```

## 5.14 单分派泛函数如何写 (`@singledispatch`)

[Source](http://magic.iswbm.com/zh/latest/c05/c05_14.html)

这个问题在 [Single Dispatch in Java and Python](/java/2021/01/03/single-dispatch-in-java-and-python) 讲得很详细了。下面搬个例子：

```python
from functools import singledispatch

# 有点 abstract function 的意思；感觉不应该实现任何具体的逻辑
@singledispatch
def foo(x):  
    print('Received x={} of {}'.format(x, type(x)))

# 注意你是做为 `foo` 的 polymorphic function，所以是 `@foo.register`
@foo.register(int)
def _(x):
    print('Received an integer x={}'.format(x))

@foo.register(str)
def _(x):
    print('Received a string x="{}"'.format(x))

foo(None)
foo(42)
foo("Fourty Two")

# Output:
    # Received x=None of <class 'NoneType'>
    # Received an integer x=42
    # Received a string x="Fourty Two"
```

原文的例子也很有说服力。

## 5.20 让你晕头转向的 else 用法

[Source](http://magic.iswbm.com/zh/latest/c05/c05_20.html)

就 Python 还有 `for-else` 的用法……

## 5.24 对齐字符串的两种方法

[Source](http://magic.iswbm.com/zh/latest/c05/c05_24.html)

格式化输出利器

## 7.1 远程登陆服务器的最佳利器 (`paramiko` 库)

[Source](http://magic.iswbm.com/zh/latest/c07/c07_01.html)

## 7.2 代码 BUG 变得酷炫的利器 (`pretty-errors` 库)

[Source](http://magic.iswbm.com/zh/latest/c07/c07_02.html)

## 7.4 规整字符串提取数据的神器 (`parse` 库)

[Source](http://magic.iswbm.com/zh/latest/c07/c07_04.html)

## 7.5 一行代码让代码运行速度提高100倍 (`numba` & `jit`)

[Source](http://magic.iswbm.com/zh/latest/c07/c07_05.html)

这个坑就有点深了，有空再研究吧

## 7.6 新一代的调试神器：`PySnooper`

[Source](http://magic.iswbm.com/zh/latest/c07/c07_06.html)

调试这块的技术也的确需要升级了，有空深入研究一下
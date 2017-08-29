---
layout: post
title: "Python: <i>with</i>-statement / variable scope in <i>with</i>-statement"
description: ""
category: 
tags: []
---
{% include JB/setup %}

## `with`-statement

首先上例子：

```python
>>> class Foo():
...     def __enter__(self):
...             print("Foo.__enter__()")
...             return self
...     def __exit__(self, exc_type, exc_value, traceback):
...             print("Foo.__exit__()")
... 
>>> with Foo() as f:
...     print("Inside with")
... 
Foo.__enter__()
Inside with
Foo.__exit__()
```

- context manager 的 protocol 是：
    - `__enter__`
    - `__exit__`
- 实现了这个 protocol 的对象我们称为 context manager object
    - 上面例子中，`Foo()` constructor 返回的对象就是 context manager
- `with` 开始执行时，先执行 `context_manager.__enter__()`
- `with` 全部执行完时，最后执行 `contetx_manager.__exit__()`
- `as f` 的意思是：`f` 接收 `context_manager.__enter__()` 的返回值
    - i.e. `f = context_manager.__enter__()`

要注意的一点：`f` 并不一定是 context manager，只是一般的 context manager 的 `__enter__` 都会 `return self`，这时才有 `f` 等同于 context manager。这也牵扯出另外一个问题：`with` 最后执行的是 `context_manager.__exit__()` 而不是 `f.__exit__()`。我们举一个 `__enter__` 没有 `return self` 的例子：

```python
>>> class Foo():
... def __enter__(self):
...     print("Foo.__enter__()")
...     return "Test"
... def __exit__(self, exc_type, exc_value, traceback):
...     print("Foo.__exit__()")
...   
>>> with Foo() as f:
...     print(f)
...     print("Exiting from with")
Foo.__enter__()
Test
Exiting from with
Foo.__exit__()
```

所以 `with` 中使用 constructor 其实是隐式地将新创建的对象保存到了一个 `context_manager` 变量：

```python
with Foo() as f:
    bar()

# ----- IS EQUIVALENT TO ----- #

try: 
    context_manager = Foo()
    f = context_manager.__enter__()
    bar()
finally:
    context_manager.__exit__()
```

你不用 constructor 也是可以的，任何能 evaluate 成一个实现了 context manager protocol 的对象的语句放 `with` 后面都是可以的；不要 `as` 也是可以的：

```python
>>> f = Foo()
>>> with f:
...     print("Inside with")
... 
Foo.__enter__()
Inside with
Foo.__exit__()

# ----- IS EQUIVALENT TO ----- #

f = Foo()
try: 
    context_manager = f
    context_manager.__enter__()  # 没有 as 就没有接收 `__enter__()` 的返回值
    print("Inside with")
finally:
    context_manager.__exit__()
```

## Variable scope in `with`-statement"

和 `if`-statement 一样，`with` 同样不构成 scope，所以以下两种看上去是 `with` 内部的变量在 `with` 外部是一样可以访问到的：

- `as f` 中的 `f`
- 在 `with` 内部新创建的 variable

你结合 `with` 的 equivalence 的 `try-finally` 代码就可以知道，你的 `as f` 的 `f` 和内部创建的 variable 都是在 `try` 内部创建的（对的，`try` 也不构成 scope）。

```python
>>> try:
...     a = 5
... finally:
...     pass
... 
>>> a
5
```

你最爱犯的一个 pattern 是：在 `with` 内部处理 `file.readlines()` 的返回值。

```python
with open(fname) as f:
    lines = f.readlines()
    process(lines)
    further_process()

# ----- BETTER PRACTICE ----- #

with open(fname) as f:
    lines = f.readlines()

process(lines)  # Don't be afraid! `lines` is accessible here!
further_process()
```

你已经把所有的行都读出来了，file 就可以关掉了，file 就算直接被 GC 了也不会影响你的 `lines`，写那么长的一个 `with` 真的很烦，再嵌几个 if、for 之类的，可读性直线下降。Python 真的没有 Java 那么严格，Java 基本是一个 `{ ... }` 或者一个缩进就算 scope，写 Python 时你需要 relax。 

## Supplement： `__exit__(exc_type, exc_value, traceback)` explained

看这个函数签名，联系 [Python: raise / 3 key elements of an exception](/python/2017/08/28/python-raise-3-key-elements-of-an-exception)，我们可以推测 `sys.exc_info()` 一定在 `with` 的展开逻辑中与 `__exit__` 连用了。根据 [PEP 343 -- The "with" Statement](https://www.python.org/dev/peps/pep-0343/#id38)，`with` 的展开逻辑如下：

```python
with VAR = EXPR:
    BLOCK

# ----- IS EQUIVALENT TO ----- #

mgr = (EXPR)
exit = type(mgr).__exit__  # Not calling it yet
value = type(mgr).__enter__(mgr)
exc = True
try:
    try:
        VAR = value  # Only if "as VAR" is present
        BLOCK
    except:
        # The exceptional case is handled here
        exc = False
        if not exit(mgr, *sys.exc_info()):
            raise
        # The exception is swallowed if exit() returns true
finally:
    # The normal and non-local-goto cases are handled here
    if exc:
        exit(mgr, None, None, None)
```
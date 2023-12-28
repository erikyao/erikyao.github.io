---
category: Python
description: ''
tags: []
title: 'Python: <i>raise</i> / 3 key elements of an exception'
---

## 1. `raise`-statement in Python 2

形式定义是 `raise [arg1[, arg2[, arg3]]]`，分这么几种情况：

### 1.1 `raise` nothing（也就是 `raise` 后面什么都不接）

- In this case, `raise` statement re-raises the last exception that was active in the current scope. 
- If no exception is active in the current scope, a `TypeError` exception is raised indicating that this is an error.
    - If running under IDLE, a `Queue.Empty` exception is raised instead.

所谓 "last exception that was active in the current scope"，大概的场景是：

```python
try:
    # do something dangerous
except SomeException as e:  # 即使你没有 `as e`，`raise` 也是可以定位到你当前的 exception instance
    raise 
    # ----- IS EQUIVALENT TO ----- #
    # raise e
```

此外，这个当前 scope 下 active 的 exception 可以通过 `sys.exc_info()` 来获取。这个函数返回一个 tuple，`(exc_type, exc_value, tb_obj)`，也就是我们的异常三要素。

如果 `raise` 后面有参数，它一定会 evaluate 出一个 `(exc_type, exc_value, tb_obj)`，空缺的值用 `None` 填充。

- 注意形式定义里的 `arg3` 即是 `tb_obj`（一个 built-in 类型 `Traceback` 的对象）
    - 它的作用是 be substituted as the place where the exception occurre instead of the current location
    - 如果你 `arg3` 不是 `Traceback` 类型，系统会抛一个 `TypeError`
- `(arg1, arg2)` 并不严格对应 `(exc_type, exc_value)`，因为 `raise` 语法的性质导致（所以我不喜欢 python 2！）
    - 而且我一直以为 `exc_value` 指 error msg，其实不是的，它本质一定是一个 exception instance

### 1.2 `raise arg1`

单独抛出一个 exception instance `e`，此时 `(exc_type, exc_value) == (type(e), e)`。

`tb_obj` 在异常发生时系统会自动创建一个给你，所以我估计是很少会需要去自己管理这个对象，所以这里我们也忽略这个对象的值。

```python
import sys

ve = ValueError()

try:
    raise ve
except ValueError: 
    print(sys.exc_info())

# Output: (<type 'exceptions.ValueError'>, ValueError(), <traceback object at 0x7fb8d03d97a0>)
```

```python
import sys
    
ve = ValueError("1 != 2")

try:
    raise ve
except ValueError: 
    print(sys.exc_info())

# Output: (<type 'exceptions.ValueError'>, ValueError('1 != 2',), <traceback object at 0x7fb8d03d97a0>)
```

### 1.3 `raise arg1, arg2`

涉及到异常类型继承关系时，这一句的 evaluation 有点微妙。

#### 用法一： `raise exc_type, constructor_param` 或者 `raise exc_type, (constructor_params...)`

此时 `exc_type = arg1`；`arg2` 可以是单个值或是一个 tuple，用来传递给 `exc_type` 的 constructor，从而 `exc_value = arg1(arg2)`

```python
import sys

try:
    raise ValueError, "1 != 2"
except ValueError: 
    print(sys.exc_info())

# Output: (<type 'exceptions.ValueError'>, ValueError('1 != 2',), <traceback object at 0x7fb8d03d9758>)

try:
    raise ValueError, ('1', '!=', '2')
except ValueError: 
    print(sys.exc_info())

# Output: (<type 'exceptions.ValueError'>, ValueError('1', '!=', '2'), <traceback object at 0x7fb8d03d9a28>)
```

#### 用法二： `raise exc_type, exc_value`

此时 `exc_type = arg1`；如果 `isinstance（arg2, arg1) == True`，则 `exc_value = arg2`，否则 fall back 到用法一。

```python
import sys

class MyValueError(ValueError):
    pass

class MyIOError():
    pass

try:
    raise ValueError, MyValueError()
except ValueError: 
    print(sys.exc_info())

# Output: (<class '__main__.MyValueError'>, MyValueError(), <traceback object at 0x7fb8d03d9b90>)
    
try:
    raise ValueError, MyIOError()
except ValueError: 
    print(sys.exc_info())

# Output: (<type 'exceptions.ValueError'>, ValueError(<__main__.MyIOError instance at 0x7fb8d03d98c0>,), <traceback object at 0x7fb8d03d95a8>)
```

## 2. `raise`-statement in Python 3

形式定义是 `raise [arg1 [from arg2]]`，而且在没有参数对应 `tb_obj`，这是因为 python 3 的 exception 自带 setter `__traceback__()`，而且是 `return self`，所以可以这么连写：

```python
raise Exception("foo occurred").with_traceback(tb_obj) [from Xxx]
```

### 2.1 `raise` nothing

基本等同于 python 2 的情况，不同之处在于：

- If no exception is active in the current scope, a `RuntimeError` exception is raised indicating that this is an error.
    - python 2 是抛 `TypeError`

### 2.2 `raise arg1`

`arg1` must be either a subclass or an instance of `BaseException`. 

- If it is a class, `exc_type = arg1` and `exc_value = arg1()` (一定是使用无参 constructor).
- If it is an instance, `exc_type = type(arg1)` and `exc_value = arg1`

### 2.3 `raise arg1 from arg2`

The `from` clause is used for exception chaining: if given, `arg2` must be another exception class or instance, which will then be attached to the raised exception as the `__cause__` attribute (which is writable). If the raised exception is not handled, both exceptions will be printed:

```python
>>> try:
...     print(1 / 0)
... except Exception as exc:
...     raise RuntimeError("Something bad happened") from exc
...
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
ZeroDivisionError: division by zero

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
RuntimeError: Something bad happened
```

A similar mechanism works implicitly if an exception is raised inside an `except` or a `finally` clause: the previous exception is then attached as the new exception’s `__context__` attribute:

```python
>>> try:
...     print(1 / 0)
... except:
...     raise RuntimeError("Something bad happened")
...
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
ZeroDivisionError: division by zero

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
RuntimeError: Something bad happened
```

Exception chaining can be explicitly suppressed by specifying `from None`:

```python
>>> try:
...     print(1 / 0)
... except:
...     raise RuntimeError("Something bad happened") from None
...
Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
RuntimeError: Something bad happened
```
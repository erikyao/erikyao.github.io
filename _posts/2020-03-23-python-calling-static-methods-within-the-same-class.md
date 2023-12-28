---
category: Python
description: ''
tags: []
title: 'Python: calling static methods within the same class / recursive static methods'
---

假设我们有一个 `class Test`，有一个 `@staticmethod foo`：

```python
class Test:
    @staticmethod
    def foo():
        print("foo")
```

那么对于下面三种情况：

1. `class Test` 有一个 member method 要 call `foo`
2. `class Test` 有一个 `@classmethod` 要 call `foo`
3. `class Test` 有一个 `@staticmethod` 要 call `foo`

我们应该怎么写代码？

## 1. When a member method calls `@staticmethod foo`

用 `self.foo()`、`self.__class__.foo()` 或者 class 全称 `Test.foo()` 都可以：

```python
class Test:
    @staticmethod
    def foo():
        print("foo")

    def bar(self):
        self.foo()

    def baz(self):
        self.__class__.foo()

    def qux(self):
        Test.foo()

t = Test()
t.bar()  # Output: foo
t.baz()  # Output: foo
t.qux()  # Output: foo
```

## 2. When a `@classmethod` calls `@staticmethod foo`

依葫芦画瓢，此时用 `cls.foo()` 或者 class 全称调用都行：

```python
class Test:
    @staticmethod
    def foo():
        print("foo")

    @classmethod
    def bar(cls):
        cls.foo()  

    @classmethod
    def baz(cls):
        Test.foo() 

Test.bar()  # Output: foo                   
Test.baz()  # Output: foo
```

## 3. When another `@staticmethod` calls `@staticmethod foo`

这种情况下，你既没有 `self` 也没有 `cls`，所以你此时**只能**用 class 全称去调用。**不用前缀直接调用是非法的：**

```python
class Test:
    @staticmethod
    def foo():
        print("foo")

    @staticmethod
    def bar():
        foo()  # WRONG 

    @staticmethod
    def baz():
        Test.foo()  # OK

Test.bar()  # NameError: name 'foo' is not defined                       
Test.baz()  # Output: foo
```

总结一下就是：

1. 有 handle (`self` 或 `cls`) 就用 handle
2. 没有 handle 就用 class 全称

然后，由于 `@staticmethod` calls `@staticmethod` 的这套规则**对 `@staticmethod` 的递归调用一样适用**，然后我个人不太喜欢用 class 全称，所以下面这样的写法我就觉得别扭：

```python
from functools import lru_cache

class Fibonacci:
    @staticmethod
    @lru_cache(maxsize=32)
    def generate(n):
        """
        Generate the n-th element in the Fibonacci sequence. n starts from 0
        """
        if n == 0: 
            return 0
        elif n == 1: 
            return 1
        else: 
            return Fibonacci.generate(n-1) + Fibonacci.generate(n-2)

Fibonacci.generate(5)  # Output: 5
```

感觉这种情况下用 `@classmethod` 做递归写起来会更好看一点：

```python
from functools import lru_cache

class Fibonacci:
    @classmethod
    @lru_cache(maxsize=32)
    def generate(cls, n):
        """
        Generate the n-th element in the Fibonacci sequence. n starts from 0
        """
        if n == 0: 
            return 0
        elif n == 1: 
            return 1
        else: 
            return cls.generate(n-1) + cls.generate(n-2)
        
Fibonacci.generate(5)  # Output: 5
```
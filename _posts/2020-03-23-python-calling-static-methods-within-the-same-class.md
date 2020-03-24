---
layout: post
title: "Python: calling static methods within the same class"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

假设我们有一个 `class Test`，有一个 `@staticmethod foo`：

```python
class Test:
    @staticmethod
    def foo():
        print("foo")
```

那么对于下面三种情况：

- `class Test` 有一个 member method 要 call `foo`
- `class Test` 有一个 `@staticmethod` 要 call `foo`
- `class Test` 有一个 `@classmethod` 要 call `foo`

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

## 2. When another `@staticmethod` calls `@staticmethod foo`

这种情况有点微妙，因为你既没有 `self` 也没有 `cls`，所以你必须要用 class 全称去调用。**不用前缀直接调用是非法的：**

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

## 3. When a `@classmethod` calls `@staticmethod foo`

综合前面两种情况可以推断，此时用 `cls.foo()` 或者 class 全称调用都行：

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
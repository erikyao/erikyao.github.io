---
layout: post
title: "Python: Referencing and assignment in inner functions"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

这一篇的内容在 [Digest of Fluent Python: 7.4 Variable Scope Rules](/python/2016/09/16/digest-of-fluent-python#7-4-Variable-Scope-Rules) 和 [Python: Variable scope in if-statement](/python/2017/08/18/python-variable-scope-in-if-statement) 都有讲到，但是 _Effective Python_ 的 _Item 15: Know How Closures Interact with Variable Scope_ 讲得特别好，特摘录如下。

-----

When you _**reference**_ a variable in an expression, the Python interpreter will traverse the scope to resolve the reference in this order:

1. The current function's scope
2. Any enclosing scopes (like other containing functions)
3. The scope of the module that contains the code (also called the **global** scope)
4. The built-in scope (that contains functions like `len` and `str`)

If none of these places have a defined variable with the referenced name, then a `NameError` exception is raised.

_**Assigning a value to a variable works differently**_. If the variable is already defined in the current scope, then it will just take on the new value. If the variable doesn't exist in the current scope, then _**Python treats the assignment as a variable definition**_. The scope of the newly defined variable is the function that contains the assignment.

-----

看三个例子：

```python
def foo_1():
    found = False
    
    def bar():
        found = True
        
    bar()
    print(found)
    
foo_1()

# Output: False
```

```python
def foo_2():
    found = False
    
    def bar():
        nonlocal found
        found = True
        
    bar()
    print(found)
    
foo_2()

# Output: True
```

```python
def foo_3():
    found = [False]
    
    def bar():
        found[0] = True
        
    bar()
    print(found[0])
    
foo_3()

# Output: True
```

- `foo_1` 里的 `bar` 的 `found = True` 是一句 assignment，但是 `found` 在 `bar` 的 scope 下找不到，所以变成了 variable definition，相当于内部外部各有一个 `found`，你内部的 `found` 的赋值不会影响到外部的值。
- `foo_2` 这是最常见的解决 `foo_1` 问题的写法，用 `nonlocal`，告诉 interpreter 不要在 `bar` 的 scope 下去找 `found`。这么一来内外 reference 到的都是同一个 `found`。
- `foo_3` 是 python 2 里 `nonlocal` 的 workaround，因为 python 2 里并没有 `nonlocal`。它的巧妙之处在于 `found[0] = True` 这句并不是对 `found` 的赋值。所以这里内外都是 reference 到同一个 `found`，相当于是改变了 `found` 的内部状态，但是并没有 assign 一个新对象给 `found`。
    - 同理可知，你在 inner function 里修改外部对象的状态也不算是 assignment，比如下面的 `foo_4`。

```python
class Found:
    def __init__(self, boolean):
        self.value = boolean
        
def foo_4():
    found = Found(False)
    
    def bar():
        found.value = True
        
    bar()
    print(found.value)
    
foo_4()

# Output: True
```
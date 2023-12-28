---
category: Python
description: ''
tags: []
title: 'Python: Diamond Inheritance and <i>super</i>'
---

参 _Effective Python Item 25: Initialize Parent Classes with super_。

Diamond Inheritance 就是 [C++: Virtual Inheritance](/c++/2015/04/24/cpp-virtual-inheritance) 里的 dread diamond，但是 Python 是允许你直接用这个继承结构的，不需要任何关键字来修饰，不像 C++ 里你不用 `virtual` 就会出错。

一个不使用 `super` 的例子：

```python
class A:
    def __init__(self):
        self.value = 1
        print("A Initialized!")
        
class B(A):
    def __init__(self):
        A.__init__(self)  # ①
        self.value += 2
    
class C(A):
    def __init__(self):
        A.__init__(self)  # ①
        self.value *= 2

class D(B, C):
    def __init__(self):
        B.__init__(self)  # ②
        C.__init__(self)  # ②
    
d = D()
print(d.value)
print(D.__mro__)

# Output:
"""
A Initialized!
A Initialized!
2
(<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)
"""
```

- ① 这里要么是显式调用 `A.__init__(self)` 或是直接 `super().__init__()`，否则你没有 `.value` 的定义，后面 `+= 2` 和 `*= 2` 的操作会报错
    - 如果你是直接赋一个新值给 `.value`，比如 `self.value = 2`，则可以不调用父类的 `__init__`
    - `A.__init__(self)` 是类似 `@classmethod` 的调用方式，`super().__init__()` 是 member function 的调用方式，因为 `super()` 返回的是一个 proxy object 而不是一个类
- ② 这里还是显式调用，它的逻辑十分直白，就是字面意义（后面你会看到用 `super()` 会是多么的绕）：
    1. `D self = D.__new__()`
    2. `B.__init__(self)`
        - `A.__init__(self); self.value += 2` $\Rightarrow$ `self.value` 先赋值为 1，然后 +2，最后等于 3
    3. `C.__init__(self)`   
        - `A.__init__(self); self.value *= 2` $\Rightarrow$ `self.value` 先赋值为 1（原值 3 被覆盖掉），然后 *2，最后等于 2 

我们可以看到，父类 `A` 被显式初始化了两次，而且 `B.__init__(self)` 对 `.value` 的赋值完全没有任何意义。我们若只想让 `A` 初始化一次，就得使用 `super()`:

```python
class A:
    def __init__(self):
        print("A Init Started!")
        self.value = 1
        print("A Init Ended!")
        
class B(A):
    def __init__(self):
        print("B Init Started!")
        super().__init__()
        self.value += 2
        print("B Init Ended!")
    
class C(A):
    def __init__(self):
        print("C Init Started!")
        super().__init__()
        self.value *= 2
        print("C Init Ended!")

class D(B, C):
    def __init__(self):
        super().__init__()
    
d = D()
print(d.value)
print(D.__mro__)

# Output:
"""
B Init Started!
C Init Started!
A Init Started!
A Init Ended!
C Init Ended!
B Init Ended!
4
(<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)
"""
```

有点反常的是，最终的 `.value` 是 `1 * 2 + 2 = 4` 而不是 `(1 + 2) * 2 = 6`。这里要深入讨论下 `super()` 的意义和执行顺序：

- 首先要明确一点，你在 `D` 内调用 `super()`，它的完整形态是 `super(D, self)`
- 二来，根据 [StackOverflow: Multiple inheritance in python3 with different signatures](https://stackoverflow.com/a/26927718) 的说法：_The first argument to `super()` tells it what class to **skip** when looking for the next method to use!_ 所以在 `D` 内调用 `super()`，展开成 `super(D, self)`，它的实际意义是：在 `D.__mro__` 里找到第一个不是 `D` 的 class，也就是 `B`，然后返回一个 proxy object，大概等同于 `(B, self)`。这么一来，`super().__init__()` 实际调用的是 `B.__init__(self)`！
- 顺藤摸瓜，`B.__init__(self)` 又调用了 `super(B, self)`，此时仍然是在 `D.__mro__` 里找，第一个不是 `B` 的 class，是 `C`，所以接着调用 `C.__init__(self)`

所以整个的执行顺序大约可以表示为：

```python
D self = D.__new__()

# D.__mro__ = (<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)

D.__init__(self) = {
    super(D, self).__init__ == proxy(B, self).__init__() == B.__init__(self) {
        print("B Init Started!")

        super(B, self).__init__() == proxy(C, self).__init__() == C.__init__(self) {
            print("C Init Started!")
            
            super(C, self).__init__() == proxy(A, self).__init__() == A.__init__(self) {
                print("A Init Started!")
                
                self.value = 1
                
                print("A Init Ended!")
            }
            
            self.value *= 2
            print("C Init Ended!")
        }

        self.value += 2
        print("B Init Ended!")
    }
}
```

非常 counter-intuitive 的两点：

- `B` 调用 `super()` 实际找到的是 `C`，但是 `C` 又不是 `B` 的父类
- 在 `B` 和 `C` 的 `__init__` 中，你完全可以先给 `.value` 赋个值再调用 `super().__init__()`，不像 Java 里要求 `super()` constructor 一定要出现在第一行
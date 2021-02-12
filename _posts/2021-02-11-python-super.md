---
layout: post
title: "Python: super()"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

`super()` 实在是有点复杂，所以它的 [doc](https://docs.python.org/3/library/functions.html#super) 的信息量看起来就很有限。

根据参数的数量和类型，`super()` 可以有以下 4 种情况，每种情况都能说上一段：

- 无参 `super()`
- 一参 `super(T)`
- 二参 `super(T, obj)`
- 二参 `super(T, S)`

本文使用的是 Python 版本是：

```text
Python 3.8.2 (default, Dec 21 2020, 15:06:04) 
[Clang 12.0.0 (clang-1200.0.32.29)] on darwin
```

## ToC

- [无参形式 `super()`](#无参形式-super)
- [二参形式 `super(T, obj)`](#二参形式-supert-obj)
  - [`super(T, obj)` 如何查找 `T` 的父类？](#supert-obj-如何查找-t-的父类)
  - [为何能找到 sibling class？](#为何能找到-sibling-class)
- [二参形式 `super(T, S)`](#二参形式-supert-s)
- [一参形式 `super(T)`](#一参形式-supert)
- [Method invocation from a super object](#method-invocation-from-a-super-object)

## 无参形式 `super()`

注意 [doc](https://docs.python.org/3/library/functions.html#super) 上的 specification 是 `super([type[, object-or-type]])`，并不是 ~~`super(type=None, object-or-type=None)`~~.

`super()` 的意义有 [PEP 3135 -- New Super](https://www.python.org/dev/peps/pep-3135/) 专门来定义：

> The new syntax: 
> <br/>  
> `super()`
> <br/>  
> is equivalent to:
> <br/>  
> `super(__class__, <firstarg>)`

那这个 `__class__` 是什么？我觉得 [PEP 3135 -- New Super](https://www.python.org/dev/peps/pep-3135/) 并没有说得很清楚，详细的描述应该是在 [The Python Language Reference >> 3.3.3.6. Creating the class object](https://docs.python.org/3/reference/datamodel.html#creating-the-class-object):

> `__class__` is an implicit closure reference created by the compiler if any methods in a class body refer to either `__class__` or `super`. This allows the zero argument form of `super()` to correctly identify the class being defined based on lexical scoping, while the class or instance that was used to make the current call is identified based on the first argument passed to the method.

注意这里我们讲的不是 `self.__class__`，虽然这个属性也的确存在：

```python
class Test:
    def print_class(self):
        print(__class__)  # Exists. This is what we are talking about 
        print(self.__class__)  # also exists
```

`__class__` 出现在 class method 外部就是 not defined 的状态，所以也说明无参的 `super()` 只能出现在 class 的 method 内。

- 这个 "class method 外部" 包括：
    1. 在 class 内，但不在 method 内
    2. 不在 class 内

然后这个 `<firstarg>` 就是指 class method 的第一个参数，i.e. 要么是 `self` 要么是 `cls`。于是基本上就相当于：

```python
class Base:
    @classmethod
    def foo(cls):
        print("Base.foo(cls)")
    
    def bar(self):
        print("Base.bar(self)")

class Ext(Base):
    @classmethod
    def test_foo(cls):
        super().foo()
        # Equivalent to
        super(Ext, cls).foo()

    def test_bar(self):
        super().bar()
        # Equivalent to
        super(Ext, self).bar()
```

所以无参的 `super()` 本质是个二参的形式，我们接着讲二参

## 二参形式 `super(T, obj)`

回头看 [doc](https://docs.python.org/3/library/functions.html#super):

> `super([type[, object-or-type]])`
> <br/>  
> Return a proxy object that delegates method calls to a parent or sibling class of `type`

信息量很大。疑问：

1. `super` 是一种类型么？`super()` 是一个 constructor 么？
2. 具体怎么 delegate? 
3. 为什么会有 sibling class？

关于疑问 1，我不太能确定，但 `super()` 的确是返回了一个 "super object".

疑问 2 可以参考 [Martijn Pieters >> How can I use super() with one argument in python](https://stackoverflow.com/a/30190341):

> the `super()` object stores both the class (first argument) and `self` (second argument) to bind with, and the type of the `self` argument as the attributes `__thisclass__`, `__self__` and `__self_class__` respectively.

所以 `super(T, obj)` 相当于是这么一个 super object:

```java
SuperObject(T, obj) {
    this.__thisclass__ = T
    this.__self__ = obj
    this.__self_class__ = type(obj)
}
```

那与其用 delegate 这个词的逻辑，我觉得把 super object 理解成一个 adapter 更容易。先不考虑 sibling class 的话，`super(T, obj).bar()` 的机制就是：

1. 通过 `T` 和 `type(obj).mro()` 找到 `T` 的父类 `U`
2. 调用 `U.bar(obj)`

简单说就是 "父类的方法体配上子类的调用对象"。

注意这个 "查找 `T` 的父类 `U`" 的机制是动态的，即：就算你有 `so = super(T, obj)`，你每次调用 `so.xxx()` 它都会即时去找 `T` 的父类 (如果是静态的话那 super object 完全可以用一个类似 `__thisclass__` 的 field 把这个父类存起来)。这个动态查找的机制可以应对 runtime 发生的 inheritance hierarchy 的变化。

### `super(T, obj)` 如何查找 `T` 的父类？

简单来说就是 `type(obj).mro()` 返回一个 MRO 的 path，然后找到这条 path 上 `T` 之后的一个节点。

MRO 指 Method Resolution Order，我觉得可以简单理解成 inheritance hierarchy。比如一个单向链式继承关系：`C` 继承 `B`、`B` 继承 `A`，那么 `C.mro()` 就是：

```text
C -> B -> A -> object
```

- `C.mro()` 一定会包含 `C` 为起点
- 终点一定是 `object`

Guido van Rossum 大人曾经写过一个 `super()` 的逻辑实现 (对实际的 method lookup 机制无参考意义)，在 [Unifying types and classes in Python 2.2 >> Cooperative methods and "super"](https://www.python.org/download/releases/2.2.3/descrintro/#cooperation)，改一改大概是这个意思：

```python
def ___:
    # ...

    mro = iter(self.__self_class__.__mro__)  # i.e. type(obj).mro()

    for cls in mro:
        if cls is self.__thisclass__:  # i.e. T
            break

    # Note: mro is an iterator, so the second loop
    # picks up where the first one left off!
    for cls in mro:  # i.e. next class after T
        if attr in cls.__dict__:
            x = cls.__dict__[attr]
            if hasattr(x, "__get__"):
                x = x.__get__(self.__self__)
            return x

    raise AttributeError, attr
```

[`super(T, obj)` 的 specification](https://docs.python.org/3/library/functions.html#super) 要求必须满足 `isinstance(obj, T)`，所以：

1. 要么 `type(obj) is T`
2. 要么 `type(obj)` 是 `T` 的子类

所以 `type(obj).mro()` 一定会包含 `T`，最极限的情况就是 `type(obj).mro()` 的起点为 `T`。如果 `type(obj).mro()` 不包含 `T`，则报错。

总结一下 `super(T, obj)` 这两个参数的作用：

1. `T`: 提供 MRO 搜索的起点
2. `obj`: 
    - 提供 MRO 搜索路径，结合 `T` 确定父类 `U`
    - 本身作为父类方法体的调用对象，e.g. in `U.bar(obj)`

多重继承下的 MRO 可能会很复杂 (like a graph)，python 目前使用的是 C3 linearization 这个 algorithm 来确定 MRO，具体可以参见 [C3 linearization >> Example demonstrated in Python 3](https://en.wikipedia.org/wiki/C3_linearization#Example_demonstrated_in_Python_3).

一个常用的 rule 是：如果有 `Z(K1, K2, ...)`，那么一般是 `Z -> K1 -> K2 -> ...`，**和括号里的 inheritance list 的顺序一致**。

### 为何能找到 sibling class？

现在我们来回答疑问 3。假定有一个 diamond inheritance：

```text
  A
 / \
B   C
 \ /
  D
```

且 `D` 的 inheritance 顺序是 `D(B, C)`，那么 `D.mro()` 就是 `D -> B -> C -> A -> object`，进而 `super(B, D())` 就会找到 `B` 的 sibling class `C` 而不是父类 `A`.

- 注意 `super(C, D())` 并不会找到 `C` 的 sibling class

关键还是要看 MRO.

## 二参形式 `super(T, S)`

和二参形式 `super(T, obj)` 类似，只不过一个是调用父类 (或 sibling class) 的 member method，一个是调用父类 (或 sibling class) 的 class method.

[`super(T, S)` 的 specification](https://docs.python.org/3/library/functions.html#super) 要求必须满足 `issubclass(S, T)`，所以：

1. 要么 `S is T`
2. 要么 `S` 是 `T` 的子类

所以 `S.mro()` 一定包含 `T`.

总结一下 `super(T, S)` 这两个参数的作用：

1. `T`: 提供 MRO 搜索的起点
2. `S`: 
    - 提供 MRO 搜索路径，结合 `T` 确定父类 `U`
    - 本身作为父类 class method 的调用对象，e.g. in `U.foo(S)`

## 一参形式 `super(T)`

所以 `super(T)` 相当于是这么一个 super object:

```java
SuperObject(T) {
    this.__thisclass__ = T
    this.__self__ = None
    this.__self_class__ = None
}
```

[specification](https://docs.python.org/3/library/functions.html#super) 称其为 unbound super object，感觉就是没有 bind `obj` 或者 `S`.

还是这篇 [Martijn Pieters >> How can I use super() with one argument in python](https://stackoverflow.com/a/30190341) 提到：`SuperObject(T).__get__(obj, S)` 可以回填 `__self__` 和 `__self_class__` 这两个 field，使他重新变成一个 bound super object。

这个 `__get__` 是 descriptor 的一部分，所以 super object 也是一种 descriptor？这个问题有点大，这里暂时不研究。

这个一参形式的 super object 有啥用我暂时也想不出，后续再研究。

## Method invocation from a super object

按 [Python 3.9.1 Descriptor HowTo Guide >> Invocation from super](https://docs.python.org/3/howto/descriptor.html#invocation-from-super) 的说法：

> The logic for super’s dotted lookup is in the `__getattribute__()` method for object returned by `super()`.

但从我 3.8.2 的试验来看，`so.xxx` 的解析不像是通过 `so.__getattribute__("xxx")` 实现的，而像是找的 `super.__getattribute__(so, "xxx")`:

```python
class U:
    def bar(self):
        pass

class T(U):
    def bar(self):
        pass

so = super(T, T())

print(so.bar)                             # U.bar
print(so.__getattribute__("bar"))         # T.bar
print(super.__getattribute__(so, "bar"))  # U.bar

# Output:
#   <bound method U.bar of <__main__.T object at 0x108985640>>
#   <bound method T.bar of <__main__.T object at 0x108985640>>
#   <bound method U.bar of <__main__.T object at 0x108985640>>
```

这个细节上的差异非常迷惑……按理来说 `so.__getattribute__("xxx")` 和 `super.__getattribute__(so, "xxx")` 这两者应该是等价的……我现在怀疑 `so.__getattribute__("xxx")` 走的是 [`object.__getattribute__()` 的逻辑](https://docs.python.org/3/howto/descriptor.html#invocation-from-an-instance)……not very sure about this...

那具体的实现过程按 [Python 3.9.1 Descriptor HowTo Guide >> Invocation from super](https://docs.python.org/3/howto/descriptor.html#invocation-from-super) 的说法是：

> A dotted lookup such as `super(A, obj).m` searches `obj.__class__.__mro__` for the base class `B` immediately following `A` and then returns `B.__dict__['m'].__get__(obj, A)`. If not a descriptor, `m` is returned unchanged.
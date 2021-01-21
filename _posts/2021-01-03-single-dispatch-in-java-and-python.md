---
layout: post
title: "Single Dispatch in Java and Python"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

## ToC

- [1. 基本概念](#1-基本概念)
- [2. Java 的 Single Dispatch 与多态](#2-java-的-single-dispatch-与多态)
- [3. Java 的 Single Dispatch 与 Override、Overload、Static Binding、Dynamic Binding](#3-java-的-single-dispatch-与-overrideoverloadstatic-bindingdynamic-binding)
- [4. Python 对 method 的 Single Dispatch](#4-python-对-method-的-single-dispatch)
- [5. Python 对 function 的 Single Dispatch](#5-python-对-function-的-single-dispatch)
- [6. 模拟实现 Double Dispatch](#6-模拟实现-double-dispatch)
- [7. 更多讨论](#7-更多讨论)

## 1. 基本概念

dispatch 是个相对高一级别的概念，可以很好地统一多态、override、overload、static binding、dynamic binding 这些概念。

Java 里的 "[多态](/java/2009/03/27/polymorphism)" 一般指 object/reference 的形态，但其实我们也可以说 function/method 是 polymorphic 的。那么 "如何从 polymophic 的多个 function/method 中确定具体调用的是哪一个" 这个机制我们就称作 **dispatch**。一般有：

- **static dispatch:** 其实就是 function/method 的 static binding，**在 compiler time 执行**
- **dynamic dispatch:** 其实就是 function/method 的 dynamic binding，**在 runtime 执行**
  - **single dispatch:** 这个简写也简得太厉害了，其实是 dynamic dispatch on a single parameter
  - **double dispatch:** 依此类推就是 dynamic dispatch on double parameters (算是 multiple dispatch 的特殊形式)
  - **multiple dispatch:** dynamic dispatch on multiple parameters

那具体 "dynamic dispatch on a single parameter" 是啥意思？其实是指 "根据 single parameter 的 type 来确定具体调用的是哪一个 polymophic function/method"，需要注意的是：**这个 single parameter 包括 implicit 的 `this` (Python 里就是 `self`)**。换句话说，如果一门语言只支持到 single dispatch，那么我们说在这门语言里 "A function/method is polymorphic on the type of one parameter (including the implicit `this`)"。

- 已知 Java 和 C++ 都是只支持到 single dispatch
  - 因为 Python 是 dynamic typed，所以 Python 不存在 Java 的 `Base b = new Ext();` 这样的典型的 method 的 single dispatch 的应用场景，但是仍然可以有 `for ref in [Base(), Ext()]` 这样的 single dispatch 场景
    - 注意与 duck typing 区分
  - Python 需要一点 extra effort 才能实现 function 的 single dispatch (后面详述)
- 支持 multiple dispatch 的语言有：C#、Groovy、Common Lisp、Julia 等

## 2. Java 的 Single Dispatch 与多态

我们说 Java 只支持到 single dispatch，按 Python 的方式比较好理解。举个例子：假设有 `Base b = new Ext();`，然后我们调用 `b.foo(...)`，如果需要 single dispatch 的话，这里相当于是 Python 的 `foo(b, ...)` (`b` 相当于 `self`)，于是按多态的逻辑，`b` 实际 reference 的 object 的类型决定了具体是调用 `Base.foo(...)` 还是 `Ext.foo(...)`。换言之，Java 支持 object/reference 的多态，其实就是支持了 method 的 single dispatch

## 3. Java 的 Single Dispatch 与 Override、Overload、Static Binding、Dynamic Binding

我在 [多态](/java/2009/03/27/polymorphism) 和 [有关向下转型的必要性和动态绑定的细节](/java/2009/03/27/more-on-downcast-and-dynamic-binding) 两篇里其实有讲，但是没有归纳，这里归纳一下：

- `b.field`、`b.privateMethod()`、`b.finalMethod()`、`b.staticMethod()`、`b.overloadMethod()` 都是 static binding
- 其余的所有的方法调用，包括 `b.overrideMethod()`，都是 dynamic binding
  - 那么这个 dynamic binding 的判定依据就是 single dispatch
    - 那在 Java 就是具体体现在 object/reference 的多态上

这里的 `b.overloadMethod()` 我要强调一下：这里还要求 `Ext` 的子类 (`Base` 的孙子辈类) 没有 override 这个 `overloadMethod()`；其实也就是要求 `overloadMethod()` 的 signature 在整个 `Base` class hierarchy 中是 unique 的。这其实是为了方便 JVM 做 binding 而设计的，因为从上面的归纳来看，JVM 做 binding 有这么个趋势：

- 先 compiler time 尽全力做 static binding
- 实在做不了 static binding 的，再 runtime 做 dynamic biding

这个从设计的角度应该很好理解。

- 那如果一个重载方法 (overloading method) 的 signature 在整个 class hierarchy 中是唯一的，那 compiler 可以根据 signature 直接判断是具体调用的哪个类的 method
  - 不需要看 `b` reference 的对象的类型，亦即不需要走多态，也就不需要 single dispatch
- 但是对覆写方法 (overriding method)，通过 signature 是无法确定确定具体调用哪个类的 method
  - 所以就只能等到 runtime 走 dynamic binding/single dispatch

## 4. Python 对 method 的 Single Dispatch

Python 的 method 的 single dispatch 和 Java 基本一致，除了没有典型的多态的场景。举例：

```python
class Base:
    def foo(self):
        print("Calling Base.foo()")
        
class Ext(Base):
    def foo(self):
        print("Calling Ext.foo()")
        
for ref in [Base(), Ext()]:
    ref.foo()

# Output:
    # Calling Base.foo()
    # Calling Ext.foo()
```

## 5. Python 对 function 的 Single Dispatch

脱离了多态场景之后，function 的 single dispatch 我确实是没怎么见过。感谢 [Python 黑魔法手册 >> 5.14 单分派泛函数如何写？](http://magic.iswbm.com/zh/latest/c05/c05_14.html) 的教程，更详细的内容也可以参考 [PEP 443 -- Single-dispatch generic functions](https://www.python.org/dev/peps/pep-0443/)。下面举个例子：

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

## 6. 模拟实现 Double Dispatch

这个其实在 [C++ double dispatch: 函数参数并不支持多态](/c++/2015/04/26/cpp-double-dispatch) 和 [PPP: Visitor Pattern](http://yaoyao.codes/java/2014/06/24/digest-of-agile-software-development-ppp#ch28) 有讲，暂时不重复了。

## 7. 更多讨论

如果想从 compiled code 研究 Java 的 Single Dispatch 的实现，可以参考：

- [Naresh Joshi's answer to _Static Vs. Dynamic Binding in Java_](https://stackoverflow.com/a/54252812)
- [Method Invocation and Return](https://www.artima.com/underthehood/invocation.html)

至于 Multiple Dispatch 的好处，我觉得 [John Gould on _Julia (programming language): What are the advantages of multiple dispatch?_](https://www.quora.com/Julia-programming-language-What-are-the-advantages-of-multiple-dispatch/answer/John-Gould-6) 里说得很好：

> Multiple dispatch can be used to implement things like subject oriented programming and context oriented programming. It's main advantage is that it can, like object oriented programming, avoid the use of explicit control flow statements like case or switch statements. It also introduces some problems. The main type theoretic problem for an object-oriented language is to avoid "method not understood" errors. Multiple dispatch languages also have to avoid this error, but also have to avoid "method ambiguous" errors.

这个 "subject oriented programming" 的说法非常棒！
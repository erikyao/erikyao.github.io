---
category: Compiler
description: ''
tags:
- Closure
title: Variable / Bound Variable / Free Variable / Scope / Closure
toc: true
toc_sticky: true
---

## 1. Name Binding / Name Resolution / Variable / Indentifier / Value / Reference

长久以来我都有个错误的认识就是，比如说有 `int a = 42`，那么我会说 "`a` is a variable"。但其实深究起来这里面涉及的概念有很多：

首先 **variable** 应该建模成 storage location (i.e. 一段内存)。以下摘自 [Wikipedia: Variable (computer science)](https://en.wikipedia.org/wiki/Variable_(computer_science)):

> In computer programming, a **variable** or **scalar** is a storage location (identified by a memory address) paired with an associated *symbolic name*, which contains some known or unknown quantity of information referred to as a *value*.

这么一来就有个问题：`int a = 42` 这一句里，那个部分才是 variable？答案是：都不是！

- 这个 `a` 是 **identifier** (即上文的 *symbolic name*) of variable
- `42` 是 variable 的 **value**。

从所有权的角度来说：

- identifier 应该不算是 variable 的一部分 (因为 `a` 又可以 bind 到别的 variable 上)
- 可以说 variable contains value
  - 但我倾向于把 value 看做是 variable 的 state

在更宽泛的层次上，我们有这么两个概念：

- **Name Binding:** 指 "把 identifier 和 language entity 两者 associate 起来" 这个动作
  - language entity 包括：
    - Variable
    - Type
    - Class
    - Function
    - Package
    - Code 等等
- **Name Resolution:** 指 "根据 identifier 定位到具体的 entity 上" 的机制
  - 也有叫 lookup 的

另外需要注意的是：**虽然我们这两个概念都涉及到了 name，但我们并没有用 "name" 这个单词来定义什么概念** ("identifier" 应该包含了广义的 name 的意义)。

我们再回头看一下 `int a = 42` 这句，它其实做了很多的事情：

1. Declare a variable 并初始化 value 为 `42`
2. 生成一个 identifier `a`
3. 做 name binding：将 `a` bind 到这个 variable

后续任意用到 `a` 的地方 (重新赋值除外)，都是在做 name resolution。

另外还有个常见的概念是 **reference**，它的用法是：

- 如果一个 identifier 和一个 entity 完成了 name binding，我们可以说 "the identifier references to the entity"，比如说 "Identifier `a` references to the variable of value `42`"
- 如果 entity 是 object，那么它的 identifier 也可以叫做 reference (overloaded 语义是有点烦)

一个还算 ok 的比喻是把 identifier 看做是 tag/label: 

![](https://live.staticflickr.com/65535/50688235407_e4f855ee18_q_d.jpg)

做了个动画来总结下上述的概念：

![](https://s8.gifyu.com/images/2020-12-05-variable--bound-variable--free-variable--scope--closure.name_binding_resolution.gif)

## 2. Bound Variable / Free Variable / Scope

先设定讨论的场景：假设有这么一个函数：

```python
y = ...

def f(x):
    return x + y
```

按 SICP 的说法：

- formal parameter (形参) 的 name (这里是 `x`；formal parameter 也是个 variable，所以这里的 name 就是 identifier) 对 function `f` 的定义是没有影响的；换言之，the sematic meaning of function `f` is independent of the name of its formal paramaters
  - **在 function `f` 的 definition 的范围内**，把 `x` 替换成其他的 name，对 `f` 的 functionality 不会有任何的影响
- 我们从 formal parameter 扩展到任意的 variable：我们称具有上述特点的 variable 称为 function `f` 的 **bound variable**，说 function `f` binds the variable to `f`'s definition
  - 这不是一个好的定义，但目前我们先姑且这么着
  - **注意 bound variable 和 name binding 这两个概念的 bind 不是一回事**
- 反之，如果 variable 不是 function `f` 的 bound variable，我们称其为 function `f` 的 **free variable**
- 如上面的 `f`，`x` (所 reference 到的 variable) 就是 bound variable，`y` (所 reference 到的 variable) 是 free variable (在 `f` definition 内替换 `y` 是会改变 `f` 的语义的)

这俩概念先放下，我们看下 scope：

- **注意 scope 是关于 identifier 的概念**，即我们讨论的是 scope of identifiers，不是 scope of variables
- 假设有一个 identifier `x`，那么 scope of `x` 即 the region of program text where the binding of `x` (to some language entity) is active 

[OpenDSA - Programming Languages - 3.3 Free and Bound Variables](https://opendsa.cs.vt.edu/ODSA/Books/PL/html/FreeBoundVariables.html) 补充了很多细节：

- `def f(x)` 中的 `(x)` 应该视作是个 declaration
- **Each variable declaration defines a scope for that variable**
- function body 内的 occurrence of `x` 称作 use of the variable
  - 注意此时还没有涉及 name resolution 
- 如果 use of the variable appears within its scope of declaration，我们称 variable is bound to the scope，同时称这个 scope 为 the binding occurrence of the variable
  - 注意这里用了 scope of declaration 这个词，其实应该就是指 declaration 出现的 top scope，不包含 sub scopes

这么一来，**function 的 bound variable (的 identifier)，它的 bound scope 就是 function 本身**，无需讨论。但是对 function 而言，它需要知道 free variable (的 identifier) 的 scope，这就引出了 lexical scope/dynamic scope 的讨论。

需要注意的是：

- lexical scoping 和 dynamic scoping 是针对 general 的 variable (的 identifier) 的 scoping 规则，研究它们并不需要讨论 bound variable 和 free variable
- 只是因为 lexical scoping 和 dynamic scoping 的区别在 function 的 free variable (的 identifier) 上面体现得最明显，所以我们一般会先介绍 free variable 和 bound varible
- 再次声明，研究 scoping 不需要讨论 bound variable 和 free variable；bound variable 和 free variable 只是 scoping 的应用场景

最后，我觉得 bound variable 和 free variable 的定义应该可以跳脱出 function，比如 script 内的 gloabl variable 应该可以视作是 bound to the script，你 import 进来的 variable 应该就是 free variable。

## 3. Lexical Scope / Lexical Scoping / Dynamic Scope / Dynamic Scoping

首先说下 scoping 这个单词。仍然是 overloaded 词义，是真的烦：

- scope 做及物动词
  - 一般指 _to assess or investigate (sth)_
  - 只有一个很少见的引申义是 _to set or limit the scope (of sth)_ (参 [LEXICO - scope](https://www.lexico.com/en/definition/scope))
- 这么一来 scope 的主谓宾逻辑就是：_(sb) scopes an identifier to, well, a scope_. 
  - 对 lexical scope 而言，这里的 _sb_ 是 lexical analyzer
  - 对 dynamic scope 而言，姑且认为它的 _sb_ 是 runtime
- 比如我们可以说 The lexical analyzer scopes identifier `x` to function `f`
  - 等价于说 Identifier `x` is scoped to function `f`
  - 等价于说 The scope of identifier `x` is function `f`
- 进一步我们可以说这整个编程语言是 lexically/statically/dynamically scoped，或者说这个编程语言使用的是 lexical/static/dynamic scoping
  - scoping 指 the practices of setting the scopes of sth

先看 lexical scoping。回忆 compiler 的工作过程：

- program 被当做一个 text string 传给 tokenizer，解析出 tokens
  - tokenizer 可以视为 lexical analyzer 的一部分，也可以认为是独立的
- tokens 传给 lexical analyzer (a.k.a. scanner)，生成 symbol table
  - 如果在 lexical analysis 过程中确定了 scope，称我们生成了 scoped symbol table
- symbol table 传给 syntax analyzer (a.k.a. parser)，生成 abstract syntax tree (AST)
- 后续还有 semantic analyzer、code generator etc.

那所谓 lexical scope，我觉得并不是指 "scope 是 lexical 的" (因为这个词简直没法翻译：词法域？scope 是词法的？)，而是指 **"scope 是 lexical analyzer 确定的"**。然后，如果 language 使用的是 lexical scoping，那它的 scopes 是不受 runtime 影响的，也就是说，**scope 被 lexical analyzer 确定了之后，它就不会改了**，所以也称是 static scope。

可以简单认为，lexical scoping 会为每个 scope 生成一张 symbol table，然后组织成 tree (top scope 做 root，sub scope 做 child) (不同的语言可能具体的实现不同，这里描述成 tree 仅做参考)。有点类似 java 的 inner class 的感觉，即 function (或者其他的 expression) 在 runtime 在它自己的 scope 内找不到 identifier 的话 (进而无法做 name resolution)，那么就会向上去 top scope (一般会用 "enclosing scope" 这个词) 找 (如果还找不到就去上上层，直到 root scope)，但不会去 sibling scope 和 sub scope 去找。

具体的一个实现可以参考 [Let’s Build A Simple Interpreter. Part 14: Nested Scopes and a Source-to-Source Compiler](https://ruslanspivak.com/lsbasi-part14/)，这个系列针对的是 perl 语言。借用三张图给点直观的感受：

![](https://live.staticflickr.com/65535/50689079887_a2ed29b601_w_d.jpg)
![](https://live.staticflickr.com/65535/50688250988_6928e7dd7b_w_d.jpg)
![](https://live.staticflickr.com/65535/50689079827_14a037dedf_w_d.jpg)

再看 dynamic scoping：binding of a name is given by the most recent declaration encountered during run-time。具体看下面这个例子 (python 是 lexical scoping，bash 是 dynamic scoping；注意 bash 的 `local` 关键字)：

```python
>>> y = 100
>>> def f(x): return x + y
... 
>>> def g(x): y = 500; return f(x)
... 
>>> f(42)
142
>>> g(42)
142
>>> y
100
```

```bash
bash-3.2$ y=100
bash-3.2$ f() { echo $(($1 + y)); }
bash-3.2$ g() { local y=500; f $1; }
bash-3.2$ f 42
142
bash-3.2$ g 42
542
bash-3.2$ echo $y
100
```

那至于 dynamic scoping 具体怎么实现，这篇 [Dynamic scoping in Lua](https://leafo.net/guides/dynamic-scoping-in-lua.html):

> Each time a new function is executed, a new scope is pushed onto the stack

我觉得这是个 practical 的实现模型，即每次执行 function，都会重新计算一个新的 scope。另外说句题外话：这篇 [Dynamic scoping in Lua](https://leafo.net/guides/dynamic-scoping-in-lua.html) 我还是要批判一番，因为：

- Lua 并没有 dynamic scoping，它是个 proper lexical scoping 的语言
- 这篇讲的其实是 how to implement dynamic scoping in Lua
  - 我 TM！

另外还要注意，Lua 好像和 bash 一样，如果不加 `local` 关键字，默认都是 global。所以下面这段看起来好像是 dynamic scoping，但其实是因为修改了 global `y`；你在 `g(x)` 里用 `local y = 500`，那么它的 bahavior 和上面 python 的例子是一样的。

```lua
y = 100

function f(x)
  return x + y
end

function g(x)
  y = 500
  return f(x)
end

print(f(42))  # 142
print(g(42))  # 542
print(y)      # 500
```

最后借 [CS 360 - Programming Languages - Day 13 - Dynamic Scope, Closure Idioms](http://www.cs.rhodes.edu/~kirlinp/courses/proglang/f17/lectures/360-lect13-slides.pdf) 的总结一用:

- In lexical (static) scoping, if a function `f` references a non-local variable `x`, the 
language will look for `x` in the environment **where `f` was defined**.
- In dynamic scoping, if a function `f` references a non-local variable `x`, the 
language will look for `x` in the environment **where `f` was called**.
    - If it's not found, will look in the environment that called the function that 
called `f` (and so on).

## 4. 题外话：Execution Context of Javascript

按 [Understanding Execution Context and Execution Stack in Javascript](https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0) 的说法：

> Simply put, an execution context is an abstract concept of an environment where the Javascript code is evaluated and executed. Whenever any code is run in JavaScript, it’s run inside an execution context.

对 Javascript function 而言：

> **Functional Execution Context —** Every time a function is invoked, a brand new execution context is created for that function. Each function has its own execution context, but it’s created when the function is invoked or called. There can be any number of function execution contexts.

比如这段代码：

```javascript
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();
console.log('Inside Global Execution Context');
```

Execution context stack for the above code:

![](https://live.staticflickr.com/65535/50690508586_03fa25543a_c_d.jpg)

看起来有点像 dynamic scoping，但这个概念和 scope 是不一样的，按 [Understanding Scope and Context in JavaScript](http://ryanmorr.com/understanding-scope-and-context-in-javascript)：

> The first important thing to clear up is that context and scope are not the same...
> <br/>  
> Every function invocation has both a scope and a context associated with it. Fundamentally, scope is function-based while context is object-based. In other words, scope pertains to the variable access of a function when it is invoked and is unique to each invocation. Context is always the value of the `this` keyword which is a reference to the object that “owns” the currently executing code.

## 5. Closure

关于 closure 具体长什么样子，我觉得看我自己的 [Digest of Fluent Python - 5.6 Function Introspection - Function Closure](http://yaoyao.codes/python/2016/09/16/digest-of-fluent-python#Function-Closure) 就好了：

```python
def print_msg(msg):
    '''This is the outer enclosing function'''

    def printer():
        '''This is the nested function'''
        print(msg)

    return printer

print_hello = print_msg("Hello")
print_hello()  # Output: Hello

>>> print_hello.__closure__
>>> (<cell at 0x000001B2408F6C78: str object at 0x000001B240A34110>,)

>>> import inspect
>>> inspect.getclosurevars(print_hello)
>>> ClosureVars(nonlocals={'msg': 'Hello'}, globals={}, builtins={'print': <built-in function print>}, unbound=set())
```

但到这个时候，我们已经可以理解 [Wikipedia: Closure (computer programming)](https://en.wikipedia.org/wiki/Closure_(computer_programming)) 上的这句:

> In programming languages, a **closure**, also **lexical closure** or **function closure**, is a technique for implementing lexically scoped name binding in a language with first-class functions. Operationally, a closure is a record storing a function together with an environment.

可以用 OOP 的思想来理解一下：你要把普通的 function 做成 first-class function，那相当于要把一个普通的 function 包装成一个 `Function` class 的 object。从 class design 的角度来看，把 free variable 组合到 `Function` class 内部是最简单的，这就成了 closure。

- 需要注意的是：closure 包含 function 本身 (从 OOP 的角度来看也应是如此)，上面 `inspect.getclosurevars()` 返回的只是 closure 内 variable 的情况

从这个 OOP 的角度来说，我觉得可以直接把 closure 理解成一个 `Function` class。R 里面 closure 就直接成了 a type of functions (参我的 [R: dive into types - 4.深入 function types](http://yaoyao.codes/r/2018/11/30/r-dive-into-types#4-深入-function-types)；现在看来这篇也有点 out of date 了):

```r
> typeof(str)
[1] "closure"
> typeof(`+`)
[1] "builtin"
> typeof(return)
[1] "special"
```

另外在 Advanced R 1st edition 里讲的 ~~"Closures are functions written by functions"~~ 现在看来就是 BS (参我的 [Digest of Advanced R](http://yaoyao.codes/r/2015/07/08/digest-of-advanced-r#7-2-Closures)；2nd edition 已经没有这么讲了)。
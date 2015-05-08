---
layout: post
title: "C++: <i>=default</i> &amp; <i>=delete</i>"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

参考：

- [What does “default” mean after a class' function declaration?](http://stackoverflow.com/a/6502854)
- [Explicitly Defaulted and Deleted Functions](https://msdn.microsoft.com/en-us/library/dn457344.aspx)
- [Explicitly defaulted and deleted special member functions](http://en.wikipedia.org/wiki/C%2B%2B11#Explicitly_defaulted_and_deleted_special_member_functions)

-----

`=default` 和 `=delete` 一般用在函数声明处，`=default` 也可以在 class 外部定义 member function 时使用：

- `=default` means that you want to use the compiler-generated version of that function, so you don't need to specify a body.
- `=delete` specifies that you don't want the compiler to generate that function automatically.

所谓 "compiler-generated version" 包括默认构造器（Synthesized Default Constructor）、默认 copy-constructor、默认 `operator=` 等（其实还有 C++11 才有的 move constructor 和 move `operator=`，遇到的时候再讨论）：

<pre class="prettyprint linenums">
struct SomeType {
    SomeType() = default; // The default constructor is explicitly stated.
    SomeType(OtherType value);
};

struct NonCopyable {
    NonCopyable() = default;
    NonCopyable(const NonCopyable&) = delete;
    NonCopyable & operator=(const NonCopyable&) = delete;
};

struct NoInt {
    void f(double i);
    void f(int) = delete;
};

struct OnlyDouble {
    void f(double d);
    template&lt;class T&gt; void f(T) = delete; // Generalized form to disallow calling f() with any type other than double
};
</pre>
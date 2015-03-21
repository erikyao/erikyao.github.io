---
layout: post
title: "C++: The multiple-declaration problem"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

比如很多的 lib 都有 #include `<iostream>`，我引用这些库，再加上我自己可能也要用 `<iostream>`，所以实际上你暗地里不知道已经 #include 了多少次 `<iostream>`。那么这样做有什么后果呢？

The compiler considers the redeclaration of a structure (this includes both `struct`s and `class`es) to be an error. In fact, both C and C++ allow you to redeclare a function, as long as the two declarations match, but neither will allow the redeclaration of a structure. In C++ this rule is especially important because if the compiler allowed you to redeclare a structure and the two declarations differed, which one would it use?

那我们怎么解决这个问题呢？很简单，在 header 里 #define 一个 "inclusion flag" 就好了，比如：

<pre class="prettyprint linenums">
//: C04:Simple.h
// Simple header that prevents re-definition
#ifndef SIMPLE_H
#define SIMPLE_H
struct Simple {
	int i,j,k;
	initialize() { i = j = k = 0; }
};
#endif // SIMPLE_H //
</pre>

第一次 #include，declare 成功；第二次再 #include，因为 `SIMPLE_H` 已经 #define 了，`#ifndef SIMPLE_H` 直接判为 false，直接 pass。

这个 inclusion flag 直接和 header 的名字相关，所以基本不会重复。
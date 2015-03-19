---
layout: post
title: "C++: sizeof is an operator"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

`sizeof` tells you #byte used by any particular variable. It can also give the size of a data type (with no variable name).

By definition, the size of any type of `char` (`signed`, `unsigned` or plain) is always 1, regardless of whether the underlying storage for a `char` is actually 1 byte (我不清楚什么平台下 `char` 会占 2 bytes；也不明白为什么要规定 `char` 的 size 一定要是 1，即使它占 2 bytes). For all other types, the result is the size in bytes.

Note that `sizeof` is an operator, not a function. If you apply it to a type, it must be used with the parentheses, but if you apply it to a variable you can use it without parentheses.

<pre class="prettyprint linenums">
s = sizeof(int); // OK
// s = sizeof int; // Error

int i;
s = sizeof(i); // OK
s = sizeof i; // OK
</pre>

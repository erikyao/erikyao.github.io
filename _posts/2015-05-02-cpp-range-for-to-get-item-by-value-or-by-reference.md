---
layout: post
title: "C++ range for: To get item by value or by reference?"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

range for 就是 java 的 for each loop，C++ 里有三种形式：

<pre class="prettyprint linenums">
std::vector<MyClass> vec;

for (auto x : vec) { ... }
for (auto &x : vec) { ... }
for (auto const &x : vec) { ... }
</pre>

这三种形式是有区别的，尤其是 `for (auto x : vec)`，它其实会调用 copy constructor，将 vec 的元素 copy 一份给你，所以你操作 `x` 的时候就是在操作 copy，vec 的元素本身并没有改变。

[C++11 range based loop: get item by value or reference to const](http://stackoverflow.com/a/15176127) 总结得非常好：

- Choose `auto x` when you want to work with copies.
- Choose `auto &x` when you want to work with original items and may modify them.
- Choose `auto const &x` when you want to work with original items and will not modify them.
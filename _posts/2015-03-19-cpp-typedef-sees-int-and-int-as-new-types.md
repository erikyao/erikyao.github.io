---
layout: post
title: "C++: typedef sees <i>int*</i> and <i>int&</i> as new types"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

长久以来我就有这么一种理解：`int *` 其实可以做一种新类型。因为在函数的参数列表里，你把 `int *` 看做是一种新类型明显更容易理解些。但是我又不得不注意以下这个事实：

* `int* pa, pb;` 并没有声明两个 pointer，而是一个 pointer 和一个 int

这里要看做 int (\*pa), pb; 而不是 (int\*) pa, pb;。所以我不好直接把 `int*` 当做一个新类型，平时也一直写作 `int *pa;` 而不是 `int* pa;`（是的，这个写法的选择对我来说是个很重要的事情）。

但是 _Thinking in C++_ 的 `typedef` 又明目张胆地说了：

<pre class="prettyprint linenums">
typedef int* IntPtr;
IntPtr x, y; // both x and y are now of type int*
</pre>

我们来看看 `typedef` 的效果：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

typedef int* IntPtr;
typedef int& IntRef;

int main() {
	int i = 0;
	int *pa, pb; // 1 pointer, 1 int
	
	pa = &i;
	// pb = &i; // ERROR
	
	// (int*) pa, pb; // ERROR
	// int *pa, *pb; // 2 pointers
	IntPtr ipa, ipb; // 2 pointers
	
	ipa = &i;
	ipb = &i; // OK
	
	int &ra = i, rb = i; // 1 ref, 1 int
	IntRef ira = i, irb = i; // 2 refs
}
</pre>

这么看来，把 `int*` 做新类型是对的，是 `int* pa, pb;` 这一句本身太特殊……或者，我已经不想再讨论这个问题了，前面 dereference 的概念我就看出来了，C/C++ 就是有很多东西不能提供给你一个统一的方式去理解。

`int&` 同理。
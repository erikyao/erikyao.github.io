---
layout: post
title: "C++: using struct like a class"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

整个第四章的中心应该是安利 class，所以一上来说了 C lib 这里不好那里不好。然后改进的切入点就是 "why not make functions members of structs?"，于是就有了这样 struct 的新用法（部分代码省略）：

<pre class="prettyprint linenums">
//: C04:CppLib.h
// C-like library converted to C++
struct Stash {
	int size; // Size of each space
	int quantity; // Number of storage spaces
	int next; // Next empty space
	// Dynamically allocated array of bytes:
	unsigned char* storage;
	
	// Functions!
	void initialize(int size);
	void cleanup();
	
	// 注意：你在 header 里直接写函数的实现也是可以的：
	/*
		void initialize(int size) {
			...
		}
	*/
};
</pre>

<pre class="prettyprint linenums">
//: C04:CppLib.cpp
// C library converted to C++
// Declare structure and functions:
#include "CppLib.h"
#include &lt;iostream&gt;

using namespace std;

void Stash::initialize(int size) {
	this->size = size; // 这里 this 是 pointer，不像 java 是 ref
	quantity = 0;
	storage = 0;
	next = 0;
}

void Stash::cleanup() {
	if(storage != 0) {
		cout &lt;&lt; "freeing storage" &lt;&lt; endl;
		delete []storage;
	}
}
</pre>

1. 不需要 `typedef`，声明变量时也不需要写全称 `struct Stash s;`，直接写 `Stash s;` 就好了（当然 C++ 下写全称也不会判错）
	* 而且不需要 `new`。`Stash s;` 就像 `int i;` 一样有效，然后可以紧接着 `s.cleanup();` 调用函数
	* 如果你 `new` 了，得到的还是个指针，这时调用函数反而要写 `s->cleanup();`
1. 现在调用可以直接 `s.cleanup();` 了，不像原来 `cleanup(&s);`
1. 可以直接在 struct 内部写函数的实现（直接 declare + define）
1. 如果要分离函数声明和实现，那么在 cpp 文件里的写法要用 `::`，变成 `void Stash::initialize(int size) { ... }`
	* `::`: scope resolution operator
	* 注意在 cpp 文件里，你看不到 field 名，但是可以像 Java 一样直接用。我们也不是每时每刻都在写 `this.foo = xxx;`。
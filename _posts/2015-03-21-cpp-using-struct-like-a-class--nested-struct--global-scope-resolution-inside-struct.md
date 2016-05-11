---
layout: post
title: "C++: Using struct like a class / Nested struct / Global scope resolution inside struct"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

## Using `struct` like a class

整个第四章的中心应该是安利 class，所以一上来说了 C lib 这里不好那里不好。然后改进的切入点就是 "why not make functions members of structs?"，于是就有了这样 struct 的新用法（部分代码省略）：

```cpp
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
```

```cpp
//: C04:CppLib.cpp
// C library converted to C++
// Declare structure and functions:
#include "CppLib.h"
#include <iostream>

using namespace std;

void Stash::initialize(int size) {
	this->size = size; // 这里 this 是 pointer，不像 java 是 ref
	quantity = 0;
	storage = 0;
	next = 0;
}

void Stash::cleanup() {
	if(storage != 0) {
		cout << "freeing storage" << endl;
		delete []storage;
	}
}
```

1. 不需要 `typedef`，声明变量时也不需要写全称 `struct Stash s;`，直接写 `Stash s;` 就好了（当然 C++ 下写全称也不会判错）
	* 而且不需要 `new`。`Stash s;` 就像 `int i;` 一样有效，然后可以紧接着 `s.cleanup();` 调用函数
	* 如果你 `new` 了，得到的还是个指针，这时调用函数反而要写 `s->cleanup();`
1. 现在调用可以直接 `s.cleanup();` 了，不像原来 `cleanup(&s);`
1. 可以直接在 struct 内部写函数的实现（直接 declare + define）
1. 如果要分离函数声明和实现，那么在 cpp 文件里的写法要用 `::`，变成 `void Stash::initialize(int size) { ... }`
	* `::`: scope resolution operator
	* 注意在 cpp 文件里，你看不到 field 名，但是可以像 Java 一样直接用。我们也不是每时每刻都在写 `this.foo = xxx;`。
	* 这样分一个 header 一个 cpp，也是一种 "接口与实现的分离"
	
_~~~~~~~~~~ 2015-05-15 更新 ~~~~~~~~~~_

- struct 的 member 默认是 public
	- class member 默认是 private
- struct 也可以继承，而且默认是 public 继承
	- class 继承默认是 private 继承
	
_~~~~~~~~~~ 2015-05-15 更新完毕 ~~~~~~~~~~_
	
## Nested struct

```cpp
#ifndef STACK_H
#define STACK_H

struct Stack {
	struct Link {
		void* data;
		Link* next;
		void initialize(void* dat, Link* nxt);
	}* head;
	
	void initialize();
	void push(void* dat);
	void* peek();
	void* pop();
	void cleanup();
};

#endif // STACK_H
```

注意实现的写法：

```cpp
// using an additional level of scope resolution
void Stack::Link::initialize(void* dat, Link* nxt) {
	data = dat;
	next = nxt;
}

void Stack::initialize() { head = 0; }

void Stack::push(void* dat) {
	Link* newLink = new Link; // 直接使用 Nested struct，不需要什么特殊的写法
	newLink->initialize(dat, head);
	head = newLink;
}

...
```

## Global scope resolution inside struct

主要的目的是想在 struct 内部访问到 global 的同名 function 或者 variable，注意写法：

```cpp
int a;
void f() {} // do nothing

struct S {
	int a;
	void f();
};

void S::f() {
	::f(); // call the global f()
	::a++; // increase the global a
	f(); // call this->f(), i.e. the function itself
	a++; // increase this->a;
}
```

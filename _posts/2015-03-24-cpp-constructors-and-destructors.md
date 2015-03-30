---
layout: post
title: "C++: constructors and destructors"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

## Digress: class defaults to private, whereas struct defaults to public

struct member 默认是 public（其实很好记，因为我们最常见的 struct 就是啥也不写，也不会考虑是不是 private）。The following struct declarations are identical:

<pre class="prettyprint linenums">
struct A {
	int i;
	char j;
	float f;
	void func();
};

void A::func() {}

struct B {
public:
	int i;
	char j;
	float f;
	void func();
};

void B::func() {}
</pre>

`class` is identical to the `struct` keyword in absolutely every way except one: `class` defaults to private, whereas `struct` defaults to public.

## Constructors and destructors

<pre class="prettyprint linenums">
class X {
	int i;
public:
	X(); 	// Constructor
	X(int); // Constructor
};

void f() {
	X a; // 不需要 new，这样 declare 就直接 call 了 constructor
	X b(12); // 调用带参 constructor。这个语法有点奇怪，习惯了就好
}
</pre>

Both the constructor and destructor are very unusual types of functions: they have no return value. This is distinctly different from a `void` return value, in which the function returns nothing but you still have the option to make it something else.

<pre class="prettyprint linenums">
class Y {
public:
	~Y(); // Destructor
};
</pre>

* The destructor never has any arguments because destruction never needs any options.
* The destructor is called automatically by the compiler when the object goes out of scope.

一个完整的例子：

<pre class="prettyprint linenums">
//: C06:Constructor1.cpp
// Constructors & destructors
#include &lt;iostream&gt;
using namespace std;

class Tree {
	int height;
public:
	Tree(int initialHeight); 	// Constructor
	~Tree(); 					// Destructor
	void grow(int years);
	void printsize();
};

Tree::Tree(int initialHeight) {
	height = initialHeight;
}

Tree::~Tree() {
	cout &lt;&lt; "inside Tree destructor" &lt;&lt; endl;
	printsize();
}

void Tree::grow(int years) {
	height += years;
}

void Tree::printsize() {
	cout &lt;&lt; "Tree height is " &lt;&lt; height &lt;&lt; endl;
}

int main() {
	cout &lt;&lt; "before opening brace" &lt;&lt; endl;
	{
		Tree t(12);
		cout &lt;&lt; "after Tree creation" &lt;&lt; endl;
		t.printsize();
		t.grow(4);
		cout &lt;&lt; "before closing brace" &lt;&lt; endl;
	}
	cout &lt;&lt; "after closing brace" &lt;&lt; endl;
} 

// output:
/* 
	before opening brace
	after Tree creation
	Tree height is 12
	before closing brace
	inside Tree destructor
	Tree height is 16
	after closing brace
*/
</pre>

## Default constructors

和 java 一样，你一个 constructor 都不写，编译器就自动给你加一个无参的（但是不要指望它会给你做什么初始化工作），这时 `Tree t;` 这样 declare 一下其实就是调用了这样一个无参的默认构造器。

一旦你自己写了一个 constructor（即使是有参的），这个默认的无参 constructor 就会消失。除非你再写一个无参的 construct，否则 `Tree t;` 这样的 declare 就是 ERROR
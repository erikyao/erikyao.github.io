---
layout: post
title: "C++: friend"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

## Friend

What if you want to explicitly grant access to a function that isn’t a member of the current structure? This is accomplished by declaring that function a `friend` _**inside**_ the structure (struct or class) declaration. (反过来说，If a function is a friend, it means that it
isn’t a member of the current structure.)

在 struct 或者 class 内部，把**外部的** function、struct 或者 class 声明为 `friend`，表示这些 function、struct 或者 class 可以访问我的所有 member 和 function（也就是把 private 和 protected 开放给这些 function、struct 或者 class）。举个例子：

<pre class="prettyprint linenums">
// Declaration (incomplete type specification):
struct X;

struct Y {
	void f(X*);
};

struct X { // Definition
private:
	int i;
public:
	void initialize();
	friend void g(X*, int);	// Global friend
	friend void Y::f(X*);	// Struct member friend
	friend struct Z;		// Entire struct is a friend
	friend void h();		// Global friend with no X* passed in
};

void X::initialize() {
	i = 0;
}

void g(X* x, int i) {
	x->i = i; 	// g 是 X 的 friend，所以可以访问 x->i
}

void Y::f(X* x) {
	x->i = 47;	// 同理 Y::f 是 X 的 friend，所以可以访问 x->i
}

struct Z {
private:
	int j;
public:
	void initialize();
	void g(X* x);
};

void Z::initialize() {
	j = 99;
}

void Z::g(X* x) {
	x->i += j;	// 同理 Z 是 X 的 friend，所以可以访问 x->i
}

void h() {
	X x;
	x.i = 100;	// h 是 X 的 friend，不需要传入 X*，自己搞一个 X 也可以访问 x->i
}

int main() {
	X x;
	Z z;
	z.g(&x);
}
</pre>

第一行 `struct X;` 这个 declare 其实是个蛮搞笑的事情：`Y::f(X*)` 要用到 X，所以 X 要先定义；然后 X 的 `friend void Y::f(X*);` 又要求先定义 Y，死锁了。于是先 declare X，再 define Y，再 define X。我觉得这应该是编译器自己处理的事情，要人为干预实在是不够 cool。

## Nested friends

Making a structure nested doesn’t automatically give it access to private members. To accomplish this, you must follow a particular form: first, declare (without defining) the nested structure, then declare it as a friend, and finally define the structure.

<pre class="prettyprint linenums">
const int sz = 20;

struct Holder {
private:
	int a[sz];
public:
	void initialize();
	struct Pointer;		// step1: declare Pointer
	friend Pointer;		// step2: make Pointer a friend
	struct Pointer {	// step3: define Pointer
	private:
		Holder* h;
		int* p;
	public:
		void initialize(Holder* h);
		// Move around in the array:
		void next();
		void previous();
		void top();
		void end();
		// Access values:
		int read();
		void set(int i);
	};
};
</pre>

这语法要求好恶心……


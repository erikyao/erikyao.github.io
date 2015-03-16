---
layout: post
title: "C++: pass-by-value / pass-by-pointer / pass-by-reference"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

老生常谈。整理自 _Thinking in C++_。

-----

## 1. pass-by-value

Ordinarily, when you pass an argument to a function, a _**copy**_ of that argument is made inside the function. This is referred to as **pass-by-value**.

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

void f(int a) {
	cout << "Inside function, before `a = 5`, a==" << a << endl; 
	a = 5;
	cout << "Inside function, after `a = 5`, a==" << a << endl; 
}
int main() {
	int a = 47;
	cout << "Outside function, before function, a==" << a << endl; 
	f(a);
	cout << "Outside function, after function, a==" << a << endl; 
}

// output:
/* 
	Outside function, before function, a==47
	Inside function, before `a = 5`, a==47
	Inside function, after `a = 5`, a==5
	Outside function, after function, a==47
*/
</pre>
	
In `f()`, `a` is a **local variable**, so it exists only for the duration of the function call to `f()`. Because it’s a function argument, the value of a is initialized by the arguments that are passed when the function is called. 从下面这个程序来看，`f()` 里面也是获取不到 `main()` 里的 `a` 的地址的。

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

void f(int a) {
	cout << "Inside function, &a==" << &a << endl;
}
int main() {
	int a = 47;
	f(a);
	cout << "In `main()`, &a==" << &a << endl;
}

// output:
/*  
	Inside function, &a==0x22fe20
	In `main()`, &a==0x22fe4c
*/
</pre>

## 2. pass-by-pointer

那我们想要改变 `main()` 里 `a` 的值该怎么办？最直接的办法就是把 `&a` 传给 `f()`，任你怎么 copy，我都是直接访问 `main()` 里 `a`。

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

void f(int *pa) {
	cout << "Inside function, before `*pa = 5`, a==" << *pa << endl; 
	*pa = 5;
	cout << "Inside function, after `*pa = 5`, a==" << *pa << endl; 
}

int main() {
	int a = 47;
	cout << "Outside function, before function, a==" << a << endl; 
	f(&a);
	cout << "Outside function, after function, a==" << a << endl; 
}

// output:
/*
	Outside function, before function, a==47
	Inside function, before `*pa = 5`, a==47
	Inside function, after `*pa = 5`, a==5
	Outside function, after function, a==5
*/
</pre>

这个时候也很容易想到这样一个问题：这个 pointer 有被 copy 吗？我们再做个试验：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;
void f(int *pa) {
	cout << "Inside function, pa==" << pa << endl;
	cout << "Inside function, &pa==" << &pa << endl;
}
int main() {
	int a = 47;
	int *pa = &a;
	f(pa);
	cout << "In `main()`, pa==" << pa << endl;
	cout << "In `main()`, &pa==" << &pa << endl;
}

// output: 
/* 
	Inside function, pa==0x22fe3c
	Inside function, &pa==0x22fe10
	In `main()`, pa==0x22fe3c
	In `main()`, &pa==0x22fe30
*/
</pre>

可见这个 pointer `pa` 也是被 copy 了一份。所以 <font color="red">pass-by-pointer 本质上也是 pass-by-value，只是这个 value 是个 pointer 而使得情况变得特殊</font>。

另外，`&pa` 这是取 pointer 的 address，没啥奇怪的；但是你不能写 `&(&a)`，编译不通过。

## 3. pass-by-reference

比如 `f(int& ra)` 这个函数声明：“我接受参数的方式是 **pass-by-reference**”。从代码上看，pass-by-reference 和 pass-by-value 的调用代码是一样的，但是直接用 `ra = 5` 可以实现 `*pa = 5` 的效果。

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

void f(int &ra) {
	cout << "Inside function, &ra==" << &ra << endl;
	cout << "Inside function, before `ra = 5`, ra==" << ra << endl;
	ra = 5;
	cout << "Inside function, after `ra = 5`, ra==" << ra << endl;
}

int main() {
	int a = 47;
	cout << "In `main()`, &a==" << &a << endl;
	cout << "In `main()`, before function, a==" << a << endl; 
	f(a);
	cout << "In `main()`, after function, a==" << a << endl; 
}

// output:
/*
	In `main()`, &a==0x22fe3c
	In `main()`, before function, a==47
	Inside function, &ra==0x22fe3c
	Inside function, before `ra = 5`, ra==47
	Inside function, after `ra = 5`, ra==5
	In `main()`, after function, a==5
*/
</pre>

The difference between references and pointers is that calling a function that takes references is cleaner, syntactically, than calling a function that takes pointers. 其实你想象成 `StringBuffer` 这样的可变类型就好了。

但是要注意的是，pass-by-reference 并没有 copy 参数。
---
layout: post
title: "C++: Aggregate initialization"
description: ""
category: C++
tags: [Cpp-101, const]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

array、struct、class 这三个都是 aggregate，所以它们都可以用 `xxx = {...}` 这种形式来赋值。

## array initialization

最常见的形式：

<pre class="prettyprint linenums">
int a[5] = { 1, 2, 3, 4, 5 };
</pre>

我们称上式为 "initialize a[5] with 5 initializers"。But what happens if you give fewer initializers? 

<pre class="prettyprint linenums">
int b[6] = {1}; // i.e. { 1, 0, 0, 0, 0, 0 }
</pre>

Here, the compiler will use the first initializer for the first array element, and then use zero for all the elements without initializers. Notice this initialization behavior doesn’t occur if you define an array without a list of initializers. 

So the expression `int b[6] = {0};` is a succinct way to initialize an array to zero.

A second shorthand for arrays is **automatic counting**, in which you let the compiler determine the size of the array based on the number of initializers:

<pre class="prettyprint linenums">
int c[] = { 1, 2, 3, 4 }; // 编译器会自觉把 c[] 判定为 c[4]
</pre>

But how do you determine the size of this array? Use `sizeof c / sizeof *c` (size of the entire array divided by the size of the first element).

<pre class="prettyprint linenums">
for(int i = 0; i < sizeof c / sizeof *c; i++)
	c[i]++;
</pre>

## struct 和 class 也一样，但是不能有 private

和 array 的形式是一样的：

<pre class="prettyprint linenums">
struct X {
	int i;
	float f;
	char c;
};

X x1 = { 1, 2.2, 'c' };
</pre>

有 private 就不行：

<pre class="prettyprint linenums">
struct S1 {
public:
	int i;
private:
	int j;
};

struct S2 {
	int i;
	int j;
};

int main(int argc, char* argv[]) {
	// S1 s1 = {1,2}; 	// ERROR
	// S1 s1 = {1};		// ERROR
	S2 s2 = {1,2};		// OK
}
</pre>

有 constructor 的时候还是用 constructor 吧，毕竟这是正途。constructor 本身也可以用在 aggregate initialization 之中，比如：

<pre class="prettyprint linenums">
struct Y {
	int i;

	Y(int a);
};

Y y1[] = { Y(1), Y(2), Y(3) };
</pre>

## constant aggregates 初始化之后要注意

In constant aggregates, `const` means “a piece of storage that cannot be changed.” However, the value cannot be used at compile time because the compiler is not required to know the contents of the storage at compile time.

<pre class="prettyprint linenums">
//: C08:Constag.cpp
// Constants and aggregates
const int i[] = { 1, 2, 3, 4 };
float f[i[3]]; 			// ERROR. 这里还是 compile time 

struct S { int i, j; };
const S s[] = { { 1, 2 }, { 3, 4 } };
double d[s[1].j];		// ERROR. 这里还是 compile time 

int main() {
	float f[i[3]];		// OK. 这里是 runtime 
	double d[s[1].j];	// OK. 这里是 runtime 
	
	// If you created a variable of a primitive type or an object inside a function, you created it at runtime
}
</pre>
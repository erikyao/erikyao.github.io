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

```cpp
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
```

`class` is identical to the `struct` keyword in absolutely every way except one: `class` defaults to private, whereas `struct` defaults to public.

## Constructors and destructors

```cpp
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
```

Both the constructor and destructor are very unusual types of functions: they have no return value. This is distinctly different from a `void` return value, in which the function returns nothing but you still have the option to make it something else.

```cpp
class Y {
public:
	~Y(); // Destructor
};
```

* The destructor never has any arguments because destruction never needs any options.
* The destructor is called automatically by the compiler when the object goes out of scope.
	- **Note**: The destructor is not run when a reference or a pointer to an object goes out of scope.

一个完整的例子：

```cpp
//: C06:Constructor1.cpp
// Constructors & destructors
#include <iostream>
using namespace std;

class Tree {
    int height;
public:
    Tree(int initialHeight);    		
    Tree(int initialHeight, int times);	
    ~Tree();                    		
    void grow(int years);
    void printsize();
};

// 最常见的形式
Tree::Tree(int initialHeight) { 
    height = initialHeight;
}

// OR
// constructor initializer list 形式
Tree::Tree(int initialHeight) : height(initialHeight) {
    // nothing here
}

// constructor initializer list calling another constructor
Tree::Tree(int initialHeight, int times) : Tree(initialHeight) { 
    height *= times;
}

Tree::~Tree() {
	cout << "inside Tree destructor" << endl;
	printsize();
}

void Tree::grow(int years) {
	height += years;
}

void Tree::printsize() {
	cout << "Tree height is " << height << endl;
}

int main() {
	cout << "before opening brace" << endl;
	{
		Tree t(12);
		cout << "after Tree creation" << endl;
		t.printsize();
		t.grow(4);
		cout << "before closing brace" << endl;
	}
	cout << "after closing brace" << endl;
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
```

更多关于 constructor initializer list 的说明见 [C++: const object / const member & const member function / mutable](/c++/2015/03/29/cpp-const-object--const-member--const-member-function--mutable)。

## Default constructors

和 java 一样，你一个 constructor 都不写，编译器就自动给你加一个无参的（但是不要指望它会给你做什么初始化工作），这时 `Tree t;` 这样 declare 一下其实就是调用了这样一个无参的默认构造器。

一旦你自己写了一个 constructor（即使是有参的），这个默认的无参 constructor 就会消失。除非你再写一个无参的 construct，否则 `Tree t;` 这样的 declare 就是 ERROR

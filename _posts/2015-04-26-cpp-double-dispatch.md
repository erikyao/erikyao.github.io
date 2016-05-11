---
layout: post
title: "C++ double dispatch: 函数参数并不支持多态"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：

- [Double Dispatch Example](http://c2.com/cgi/wiki?DoubleDispatchExample)
- [Polymorphism by function parameter](http://stackoverflow.com/questions/2169460/polymorphism-by-function-parameter)
- [Single, Double And Multiple Dispatch](http://ifacethoughts.net/2006/07/29/single-double-and-multiple-dispatch)

-----

## 事情的起因：函数参数并不支持多态

```cpp
#include <iostream>
using namespace std;

class Base {

};

class Ext : public Base {

};

class Printer {
public:
	static void print(const Base* pb) {
		cout << "Base" << endl;
	}
	
	static void print(const Ext* pe) {
		cout << "Ext" << endl;
	}
};

int main() {
	Base* pb = new Ext;
	
	Printer::print(pb);
}

// output: 
/*
	Base
*/
```

从输出结果来看，函数的参数并没有执行多态机制，这是因为：

> ... function overloading lookups in C++ are done at compile-time.

而多态是 runtime 的技术。也就是说，在多态执行之前，执行哪个重载方法就已经决定好了，而此时是没有多态信息的，所以就只能通过函数签名来判断，进而就表现为 “函数参数不支持多态”。

## oBase.func() 这里的多态就是 single dispatch

简单说，多态就是 dispatch，是从一个 Base 对象 dispatch 到一个具体的 Ext 对象。而 C++ 和 java 的多态只有在对象调用方法的时候，i.e. `oBase.func();` 这个时候才有。换言之，C++ 和 java 只支持 single dispatch。

## oBase.func(oBase) 这样连续两个多态就叫 double dispatch

但是因为函数参数并不支持多态，所以 double dispatch 在 C++ 中是不被直接支持的。

## 可以曲线救国实现 double dispatch

若要强行实现 double dispatch 的，可以稍微绕一下，最简单的写法就是：

```cpp
class FooExtA : public FooBase {
public:
	int fooUponBar(BarBase& bar) {
		return bar.barUponFoo(this); // call reversely; dispatch again
	}
}

class BarExtA : public BarBase {
public:
	int barUponFoo(FooExtA& fooA) {
		return 1; 
	}
	int barUponFoo(FooExtB& fooB) {
		return 2; 
	}
}
```

我们用 `bar.reverseFunc(foo);` 来实现 `foo.func(bar);` 相当于把多态的 single dispatch 执行了两次，进而就成了 double dispatch。

但是要注意：

- `FooBase` 和 `BarBase` 可以是同一个类，也可以不是
- 不管你怎么绕，最后终究是要写具体的 `BarExtY::reverseFunc(FooExtX)` 的
	- 如果 `FooBase` 有 m 个子类，`BarBase` 有 n 个子类，那么每个 `BarExtY` 都要写 m 个 `BarExtY::reverseFunc(FooExtX)`，一共就会有 m×n 个类似的方法
	- 如果 `FooBase` 和 `BarBase` 是同一个类，那你就要写 `FooExtX::reverseFunc(FooExtY)`，一共就会有 m×m 个类似的方法
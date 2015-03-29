---
layout: post
title: "C++: const object / const member & const member function / mutable"
description: ""
category: C++
tags: [Cpp-101, const]
---
{% include JB/setup %}

整理自：

* _Thinking in C++_
* [MSDN: Constant Member Functions](https://msdn.microsoft.com/zh-cn/library/6ke686zh.aspx)
* [MSDN: Mutable Data Members (C++)](https://msdn.microsoft.com/en-us/library/4h2h0ktk.aspx)

-----

## 目录

- [1. const object](#const-object)
- [2. const member](#const-member)
	- [2.1 Non-static const member (runtime constant)](#runtime-const-member)
	- [2.2 static const member (compile-time constant)](#compile-time-const-member)
- [3. const member function](#const-member-function)
	- [3.1 武学正统](#const-member-function-definition)
	- [3.2 旁门左道：mutable member](#mutable-member)
- [4. 总结](#summary)
	
-----

## <a name="const-object"></a>1. const object

NO **non-static** data member of the const object can be changed during the object’s lifetime. 用 java 的话说就是 "const 对象的状态不可变"。

<pre class="prettyprint linenums">
class X {
public: 
	int i;
	static int si;
	
	X(int i);
};

int X::si = 1;

X::X(int i) {
	this->i = i;
}

int main() {
	const X cx(1);
	cx.i = 2;	// ERROR. assignment of member 'X::i' in read-only object
	cx.si = 2;	// OK
}
</pre>

## <a name="const-member"></a>2. const member

### <a name="runtime-const-member"></a>2.1 Non-static const member (runtime constant)

Const member means “This member is constant for the lifetime of the object.” However, each different object may contain a different value for that constant.

When you create an ordinary (non-static) `const` inside a class, you CANNOT give it an initial value. This initialization must occur in the constructor (constructor 意味着 runtime), but in a special place in the constructor called **constructor initializer list**.

我们来感受一下 constructor initializer list 迷の语法：

<pre class="prettyprint linenums">
class T {
private:
	const int f;
	const int b;
	int bz;
public:
	T(int baz); // constructor 里不初始化 const member 是不行的  
	T(int foo, int bar);
	T(int foo, int bar, int baz);
};

T::T(int baz) {
	bz = baz;
	// ERROR. uninitialized member 'T::f' with 'const' type 'const int' 
	// ERROR. uninitialized member 'T::b' with 'const' type 'const int'
}

/***** constructor initializer list 来啦 *****/
T::T(int foo, int bar) : f(foo), b(bar) { // 逗号分隔 
	/* nothing here */ 
}

T::T(int foo, int bar, int baz) : f(foo), b(bar) { // 正常人都会把 non-const member 写下面 
	bz = baz;
}

T::T(int foo, int bar, int baz) : f(foo), b(bar), bz(baz) { // 但是其实 non-const member 也可以这么搞 
	/* nothing here */ 
}

int main() {
	int i(5); 	// 我就是 int i = 5; 
				// int i = 5; 就是我 
}
</pre>

注释说得够清楚了，就不啰嗦了。

### <a name="compile-time-const-member"></a>2.2 static const member (compile-time constant)

Static const member means “there’s only one instance of the member, regardless of how many objects of the class are created”.

You must provide the initializer at the point of definition of the static const member. 这个其实是 static 的要求。也正因为如此，static const member 应该是在 compile time 就可以分配内存，所以也称为 compile-time constant。

简单举个例子：

<pre class="prettyprint linenums">
class StringStack {
private:
	static const int size = 100;
};
</pre>

## <a name="const-member-function"></a>3. const member function

### <a name="const-member-function-definition"></a>3.1 武学正统

* A member function that is not specifically declared `const` is treated as one that will modify data members in an object, and the compiler will not allow you to call it for a const object.
* Declaring a member function with the `const` keyword specifies that the function is a "read-only" function that does not modify the object for which it is called. 声明为 const 的 member function 编译器就允许 const object 来 call。
	* 但是并没有说 non-const object 就只能 call non-const member function
	* 简单说就是这样：

-> ![](https://g277tq.bn1304.livefilestore.com/y2pfxAAcZSE1AlgCcltA6PFKYYjVi7dxYatEvBxNcybRTPCqUFgHHyI8x2dQJ_1MAhJ4avArJp2iGKez8D3rvBaxKRRgRigsxYIJyBCSmDIbpEAZWJF6DIJu9ulZEYeNfDQKiBahRtvQYGCP1o5SQPi3w/const-function.png?psid=1) <-

A const member function 
	
* CANNOT modify any non-static data members 
* CANNOT call any non-const member functions
	
注意下 const member function 迷の语法： 
	
<pre class="prettyprint linenums">
class T {
private:
	const int f;
	int b;
	
	static int bz = 5;			// ERROR. ISO C++ forbids in-class initialization of non-const static member 'T::bz'
	static const int bz = 5;	// OK
	
	static int qx;				// OK
public:
	T(int foo, int bar);
	void setB(int bar);
	int getB() const;
	int getBad() const;
};

int T::qx = 0;	// initialize the non-const static member

T::T(int foo, int bar) : f(foo) {
	b = bar;
}

void T::setB(int bar) {
	b = bar;
}

int T::getB() const {
	return b;
}

int T::getBad() const {
	T::qx = 256;	// OK. const member function CAN modify static member
	T::bz = 77;		// ERROR. assignment of read-only variable 'T::bz'
	
	b = 512; 		// ERROR. const member function CANNOT modify any non-static data member
	setB(1024); 	// ERROR. const member function CANNOT call any non-const member function
	
	return getB(); 	// OK. const member function CAN call other const member function
}

int main() {
	T t(1,2);
	const T ct(3,4);
	
	t.setB(0); 	// OK. non-const object calls non-const member function 
	t.getB(); 	// OK. non-const object calls const member function
	ct.setB(0); // ERROR. const object calls non-const member function
	ct.getB(); 	// OK. const object call const member function
	
	return 0;
}
</pre>

需要注意的一点是：

* static member 如果想在 class 内部初始化的话，就必须定义成 static const member 并初始化，否则编译会报错
	* 比如上面 `static int bz = 5;` 这句会报错
* 或者在 class 内部声明一个 static member 但是不初始化，出了 class 再赋值
	* 比如上面单独的一句 `int T::qx = 0;` 
	* 如果是分 .h 和 .cpp，那就是 .h 里的 class 不初始化，.cpp 写 class 实现的时候再赋值
* const member function 可以修改 non-const static member
	* 从这个角度也说明：修改 static member 不算修改 object 的状态，毕竟 static member 可以看做是 class 所有，不计入 object 的状态内

### <a name="mutable-member"></a>3.2 旁门左道：mutable member

上一节说道：A const member function CANNOT modify any non-static data members，那对一般的 non-static + non-const 的 common member 而言，可以开一个后门使其被 const member 修改，这个后门就是 `mutable`.

* 其实还有一个方法可以使 common member 被 const member 修改：因为 const member function 内的 `this` 指针实际是一个 const pointer，我们可以用 `const_cast` 把 this 去 const，然后直接访问 common member 并修改。写出来就是 `(const_cast<T*>(this))->i = 47;`。这个招式实在是太暴力了，为我武林正派人士所不齿。

This keyword `mutable` can only be applied to non-static and non-const data members of a class. If a data member is declared `mutable`, then it is legal to assign a value to this data member from a const member function. 这也意味着 mutable member 的变化并不会被视为违反 const object 的行为；换句话说，mutable member 不计入 object 的状态。

<pre class="prettyprint linenums">
class X {
public: 
	int i;
	static int si;
	mutable int ti;
	
	X(int i, int ti);
	void setTi(int newTi) const;
};

int X::si = 1;

X::X(int i, int ti) {
	this->i = i;
	this->ti = ti; 
}

void X::setTi(int newTi) const {
	ti = newTi; // OK. const member function can modify mutable member
}

int main() {
	const X cx(1,1);
	//cx.i = 2;	// ERROR. assignment of member 'X::i' in read-only object
	cx.si = 2;	// OK
	cx.ti = 2;
	cx.setTi(3);
}
</pre>

## <a name="summary"></a>4. 总结

const object:

* static member 不计入 object 状态
* mutable member 不计入 object 状态
* const object 的状态不可改

const member function：

* 如果 const member function 需要调用其他 member function 的话，只能调用其他的 const member function
* const member 你自然是改不动的
* static member 可以修改（反正不影响 object 状态）
	* const 的 static member 因为是 const 所以无法修改
* mutable member 可以修改（反正不影响 object 状态）
* 其他的 member（剩下的只有 non-static + non-const + non-mutable 这种三无 member）都无法修改（因为都计入了 object 状态）
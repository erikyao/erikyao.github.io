---
layout: post
title: "C++: Temporary Objects, are you Rvalues?"
description: ""
category: C++
tags: [Cpp-101, const]
---
{% include JB/setup %}

问题源自：_Thinking in C++_

-----

书上的例子我稍微改了下：

<pre class="prettyprint linenums">
//: C08:ConstReturnValues.cpp
// Constant return by value
// Result cannot be used as an lvalue
class X {
	int i;
public:
	X(int ii = 0);
	void modify();
};

X::X(int ii) { i = ii; }

void X::modify() { i++; }

X f5() {
	return X();
}

void f7(X& x) {
	x.modify();
}

void f8(X* px) {
	px->modify();
}

void f9(X x) {
	x.modify();
}

void f10(X& x) { /* do nothing */ }
void f11(const X& x) { /* do nothing */ }

int main() {
	/***** TEST 1 *****/
	f5() = X(1); 	// OK. non-const return value
	f5().modify(); 	// OK
	
	/***** TEST 2 *****/
	f7(f5()); 		// ERROR. invalid initialization of non-const reference of type 'X&' from an rvalue of type 'X'
	f8(&f5());		// ERROR. taking address of temporary
	f9(f5());		// OK
	
	/***** TEST 3 *****/
	X x = f5();
	f7(x);			// OK
	f8(&x);			// OK
	f9(x);			// OK
	
	/***** TEST 4 *****/
    f10(f5());		// ERROR. invalid initialization of non-const reference of type 'X&' from an rvalue of type 'X'
    f11(f5());		// OK
}
</pre>

对比 TEST 2 和 TEST 3，你是不是有种撞了鬼的感觉……

书上说这是因为 temporary object，大致的意思我列举一下：

* Sometimes, during the evaluation of an expression, the compiler must create temporary objects (a.k.a temporaries). 这个 sometimes 用得有点微妙
* Temporary objects are automatically `const`.
* Somehow, you cannot take the address of a temporary object.
	* <del>尽管 `f7()` 是 pass-by-reference，但是 pass-by-reference 实际上也要对参数做取址操作。</del>
	* <del>看到过一种说法：C++ 的 reference 实际上是由 pointer 实现的，它本质上是一种语法糖。这么看来确实不假。</del>
* 除此之外，temporary object 和一般的 object 没有其他的什么区别。

-> _~~~~~~~~~~ 2015-03-26 晚些时候更新 ~~~~~~~~~~_ <-

TEST 4 是我后来加的，是不是又瞎了狗眼了！总结下：

* 我相信对 temporary object 还是不能做取址操作的，但 `f7(f5());` 和 `f10(f5());` 编译出错并不是因为 "pass-by-reference 实际上也要对参数做取址操作"，而是因为 temporary object 是 const，<del>而且有点像是个 const reference (从错误信息 "invalid initialization of non-const reference of type 'X&' from an rvalue of type 'X'" 反推出来)</del>
* <del>[因为不能把 `const T*` 实参传给一个 `T*` 形参](/c++/2015/03/26/cpp-const-pointer#rules)，所以 `f7(f5());` 和 `f10(f5());` 出错是因为它们无法接收身为 const 的 temporary object</del>

书上最后还补了一句：把函数设计成接收 <del>const reference</del>，i.e. `bar(const T*)` 这种形式是 best practice。 

-> _~~~~~~~~~~ 2015-03-26 晚些时候更新结束 ~~~~~~~~~~_ <-

-> _~~~~~~~~~~ 2015-03-28 更新 ~~~~~~~~~~_ <-

（2015-03-26 的更新，思路是对的，细节写错了，于是今天我重写一下）

TEST 4 是我后来加的，是不是又瞎了狗眼了！总结下：

* 我相信对 temporary object 还是不能做取址操作的，但 `f7(f5());` 和 `f10(f5());` 编译出错并不是因为 "pass-by-reference 实际上也要对参数做取址操作"，而是因为 temporary object 是 const
* [不能把 `const T` 或者 `const T&` 实参传给一个 `T&` 形参](/c++/2015/03/28/cpp-const-reference/#rules)，所以 `f7(f5());` 和 `f10(f5());` 出错是因为 `f7(X& x)` 和 `f10(X& x)` 无法接收身为 const 的 temporary object
	* 至于 temporary object 是 `const X` 还是 `const X&`，这里已经不重要了，反正这两者都不能被 `f7(X& x)` 和 `f10(X& x)` 接收

书上最后还补了一句：把函数设计成接收 reference to const，i.e. `bar(const T*)` 这种形式是 best practice。The efficiency savings can be substantial for such a simple habit: to pass an argument by value requires a constructor and destructor call, but if you’re not going to modify the argument then passing by const reference only needs an address pushed on the stack.

-> _~~~~~~~~~~ 2015-03-28 更新结束 ~~~~~~~~~~_ <-

我最开始的想法是：能不能理解为 "函数 return 的都是 rvalue"？因为从我调查的结果看，这个 temporary object 的特性也确实有点像 rvalue：

* [error: invalid initialization of non-const reference of type ‘int&’ from an rvalue of type ‘int’](http://stackoverflow.com/a/8294009) 说：
	* C++03 3.10/1 says: "Every expression is either an lvalue or an rvalue." It's important to remember that lvalueness versus rvalueness is a property of expressions, not of objects.
	* Lvalues name objects that persist beyond a single expression. For example, `obj`, `*ptr`, `ptr[index]`, and `++x` are all lvalues.
	* Rvalues are temporaries that evaporate at the end of the full-expression in which they live ("at the semicolon"). For example, `1729`, `x + y`, `std::string("meow")`, and `x++` are all rvalues.
	* The address-of operator requires that its "operand shall be an lvalue". If we could take the address of one expression, the expression is an lvalue, otherwise it's an rvalue.
		* 这个其实好理解，比如 `int i = 3;`，从来只见 `&i`，没见过 `&3`（而且编译会报错）
* [c++: function lvalue or rvalue](http://stackoverflow.com/a/13854976) 说：
	* L-Values are locations; R-Values are actual values.
	
不过从 `f5() = X(1);` 这个奇葩的写法来看，把 temporary object 理解为 rvalue 似乎又有点不妥……不过从 "Rvalues are temporaries" 这句来看，两者确实有共性，可以互相协助理解。

最形象的解释，还是这篇 [Temporary objects - when are they created, how do you recognise them in code?](http://stackoverflow.com/a/10898291)：

-> _~~~~~~~~~~ 以下部分为摘抄 ~~~~~~~~~~_ <-

The one catch, is that you can invoke a method on a temporary: so X(1).modify() is fine but f7(X(1)) is not.

As for where the temporary is created, this is the compiler job. The rules of the language precise that the temporary should only survive until the end of the current full-expression (and no longer) which is important for temporary instances of classes whose destructor has a side-effect.

Therefore, the following statement `X(1).modify();` can be fully translated to:

<pre class="prettyprint linenums">
{
    X __0(1);
    __0.modify();
} // automatic cleanup of __0
</pre>

With that in mind, we can attack `f5() = X(1);`. We have two temporaries here, and an assignment. Both arguments of the assignment must be fully evaluated before the assignment is called, but the order is not precise. One possible translation is:

<pre class="prettyprint linenums">
{
    X __0(f5());
    X __1(1);
    __0.operator=(__1);
} // the other translation is swapping the order in which __0 and __1 are initialized
</pre>

And the key to it working is that `__0.operator=(__1)` is a method invocation, and methods can be invoked on temporaries :)

-> _~~~~~~~~~~ 摘抄结束 ~~~~~~~~~~_ <-

最后注意，我们说是 temporary object，其实对 primitive 类型也是成立的。知道你会往这个方向想，我就做了个 int 的版本，请放心食用：

<pre class="prettyprint linenums">
int b5() {
	return 5;
}

void b7(int& i) {
	i++;
}

void b8(int* pi) {
	(*pi)++;
}

void b9(int i) {
	i++;
}

int main() {
	b7(b5()); 	// ERROR. invalid initialization of non-const reference of type 'int&' from an rvalue of type 'int'
	b8(&b5()); 	// ERROR. lvalue required as unary '&' operand
	b9(b5());	// OK
}
</pre>
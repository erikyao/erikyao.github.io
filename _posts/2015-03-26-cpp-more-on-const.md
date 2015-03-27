---
layout: post
title: "C++: More on const"
description: ""
category: C++
tags: [Cpp-101, const]
---
{% include JB/setup %}

整理自 _Thinking in C++_

-----
	
## 1. Const assignment & Character array literals
	
前面 (C++: Const Pointer)[/c++/2010/09/26/cpp-const-pointer/#rules] 有讲：

* 不能把 `const T*` 赋值给一个 `T*`
	* 反过来把 `T*` 赋值给一个 `const T*` 是可以的
* 不能把 `const T*` 实参传给一个 `T*` 形参
	* 反过来把 `T*` 实参传给一个 `const T*` 形参是可以的
* `T* const` 除了 const 特性外，与 `T*` 性质是一样的（同上述 4 条）
	
However, you can always use a cast to force such an assignment, but this is bad programming practice because you are then breaking the constness of the object, along with any safety promised by the const.

<pre class="prettyprint linenums">
//: C08:PointerAssignment.cpp
const int e = 2;
int* w = (int*)&e; 	// Legal but bad practice

int main() {}
</pre>

另外 "不能把 `const T*` 赋值给一个 `T*`" 有一个例外就是 `char* cp = "howdy";`：

* With `char* cp = "howdy";`, a character array literal (“howdy” in this case) is created by the compiler as a constant character array, and the result of the quoted character array is its starting address in memory.
* However, if you try to change the values in a character array literal, the behavior is undefined, although it will probably work on many machines.
* If you want to be able to modify the string, put it in an array: `char cp[] = "howdy";`（这和上式有个毛的区别！）

## 2. Constant function arguments & return values

* If you are passing objects by value, specifying const has no meaning to the client (it means that the passed argument cannot be modified inside the function, which is guaranteed by pass-by-value even without `const`).
* If you are returning an object of a user-defined type by value as a const, it means the returned value cannot be modified.
* If you are passing and returning addresses, const is a promise that the destination of the address will not be changed.

### 2.1 Passing const value

<pre class="prettyprint linenums">
void f1(const int i) {
	i++; // Illegal -- compile-time error
}
</pre>

因为是 pass-by-value，所以 copy 也是 const，自然不能修改。但是如果你的初衷只是 "保证原参数不变" 的话，用 const 只能说是 paranoid；如果函数编写者的期望是 "把参数 copy 设置成 const 避免错误的赋值"，那其实可以这么写：

<pre class="prettyprint linenums">
void f2(int i) {
	const int& cri = i; // cri: reference to a const int. 你理解为 "cri 本身就是个 const int" 似乎更简单一些
	cri++; 				// Illegal -- compile-time error
}
</pre>

### 2.2 Returning const value

For built-in types, it doesn’t matter whether you return a const value, so you should avoid confusing the client programmer and leave off the const when returning a built-in type by value.

<pre class="prettyprint linenums">
//: C08:Constval.cpp
// Returning consts by value has no meaning for built-in types
int f3() { return 1; }
const int f4() { return 1; }

int main() {
	const int j = f3(); // Works fine
	int k = f4(); 		// But this works fine too!
} 
</pre>

我觉得你理解成常数就好了，比如 3，你 `const int j = 3;` 和 `int k = 3;` 看上去一点问题都没有。

Returning a const value becomes important when you’re dealing with user-defined types. If a function returns a const class object, the return value of that function cannot be an lvalue (that is, it cannot be assigned to or otherwise modified). For example:

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

const X f6() {
	return X();
}

int main() {
	//! f6() = X(1);	// CANNOT be assigned to
	//! f6().modify();	// CANNOT be modified
}
</pre>


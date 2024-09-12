---
category: C++
description: ''
tags:
- const
- pointer
title: 'C++: const function arguments & return values'
---

整理自 _Thinking in C++_

-----

# Overview

* If you are passing objects by value, specifying `const` has no meaning to the client (it means that the passed argument cannot be modified inside the function, which is guaranteed by pass-by-value even without `const`).
* If you are returning an object of a user-defined type by value as a `const`, it means the returned value cannot be modified.
* If you are passing and returning addresses, `const` is a promise that the destination of the address will not be changed.

# Passing const value

```cpp
void f1(const int i) {
	i++; // Illegal -- compile-time error
}
```

因为是 pass-by-value，所以 copy 也是 `const`，自然不能修改。但是如果你的初衷只是 "保证原参数不变" 的话，用 `const` 只能说是 paranoid；如果函数编写者的期望是 "把参数 copy 设置成 `const` 避免错误的赋值"，那其实可以这么写：

```cpp
void f2(int i) {
	const int& cri = i; // cri: reference to a const int. 你理解为 "cri 本身就是个 const int" 似乎更简单一些
	cri++; 				// Illegal -- compile-time error
}
```

# Returning const value

For built-in types, it doesn’t matter whether you return a `const` value, so you should avoid confusing the client programmer and leave off the `const` when returning a built-in type by value.

```cpp
//: C08:Constval.cpp
// Returning consts by value has no meaning for built-in types
int f3() { return 1; }
const int f4() { return 1; }

int main() {
	const int j = f3(); // Works fine
	int k = f4(); 		// But this works fine too!
} 
```

我觉得你理解成常数就好了，比如 3，你 `const int j = 3;` 和 `int k = 3;` 看上去一点问题都没有。

Returning a const value becomes important when you’re dealing with user-defined types. If a function returns a const class object, the return value of that function cannot be an $\texttt{lvalue}$ (that is, it cannot be assigned to or otherwise modified). For example:

```cpp
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
```
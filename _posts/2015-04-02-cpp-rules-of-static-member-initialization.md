---
category: C++
description: ''
tags:
- const
title: 'C++: Rules of static member initialization'
---

整理自：_Thinking in C++_

-----

```cpp
class X {
private:
	int i;
public: 
	X(int i);
}; 

X::X(int i) {
	this->i = i;
}

class T {
private:	
	static int foo = 5;					// ERROR. ISO C++ forbids in-class initialization of non-const static member 'T::foo'
	static int foo2;					// OK
	
	const static int bar = 5;			// OK
	const static int bar2;				// OK
	
	const static int baz[] = {1,2,3}; 	// ERROR. invalid in-class initialization of static data member of non-integral type 'const int []'
	const static int baz2[]; 			// OK
	
	const static X qux(1);				// ERROR. expected ',' or '...' before numeric constant
										// 这个 error 信息我不是很懂…… 
	const static X qux2; 				// OK
};

int T::foo2 = 0;				// initialize the non-const static member
const int T::bar2 = 0;			// initialize the const static member
								// 这里 const 必须要带上
const int T::baz2[] = {1,2,3}; 	// non-integral type 的 const static 的初始化必须放到 class 外边 
const X T::qux2(1);				// const static 的对象的初始化也要放到 class 外 

int main() {
	return 1;
}
```

* non-const static member 不允许在 class 内初始化
* const static member 可以在 class 内初始化，但仅限于 integral types
	* 至于哪些是 integral types，请看 [MSDN: Fundamental Types (C++)](https://msdn.microsoft.com/en-us/library/cc953fe1.aspx)。大体上 char、bool、int、long 这几个都是
	* integral type 的数组不算 integral type
	* class 自然不算 integral type
	* 所以这些统统放到 class 外初始化，注意初始化的语句要加 const
* 我觉得这个规定有点蛋疼，凭什么就给 integral type 网开一面……	

另外需要特别注意的是：nested class 可以有 static member，但是 local class (function 内部定义的 class) 不能有 static member：

```cpp
// Nested class CAN have static data members:
class Outer {
	class Inner {
		static int i; // OK
	};
};

int Outer::Inner::i = 47;

// Local class cannot have static data members:
void f() {
	class Local {
	public:
		static int i; // ERROR
		// How would you define i?
	} x;
}
```

有点囧但是又很有道理的一个解释是：local class 外部无法初始化 static member……
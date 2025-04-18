---
category: C++
description: ''
tags:
- const
- RTII
title: 'C++ explicit cast operator: static_cast / const_cast / reinterpret_cast /
  dynamic_cast'
---

整理自 _Thinking in C++_ 和 [MSDN: Casting Operators](https://msdn.microsoft.com/en-us/library/5f6c9f8h.aspx)。

-----

## 0. Overview

C++ 中，下列的 cast 形式都是合法的：

```cpp
int main() {
	float f = 42.0f;

	int a = (int)f;               // C-style
	int b = int(f);               // C++ constructor
	int c = static_cast<int>(f);  // C++-style
}
```

推荐使用的是第三种形式，即 explicit cast operator，有：

- `static_cast`
- `const_cast`
- `reinterpret_cast`
- `dynamic_cast` 

那明明 `(int)f` 就可以搞定的事，我为啥要 `static_cast<int>(f)` 搞这么复杂？事实证明，C++ 也不是吃饱了撑着才搞这些，是有目的的。感谢 [独酌逸醉](http://www.cnblogs.com/chinazhangjie) 的这篇 [C++ 类型转换运算符 (Type Conversion Operators)](http://www.cnblogs.com/chinazhangjie/archive/2010/08/19/1803051.html)，解释得很清楚：

> 这些操作符取代了以往小圆括号所代表的旧式转型，能够清楚阐明转型的目的。小圆括号转型可替换 `dynamic_cast` 之外的其他三种转型，也因此你运用它时，你无法明确显示用它的确切理由。  
> <br/>
> 这些新式转型操作符给了编译器更多的信息，让编译器清楚知道转型的理由，并在转型失败时释出一份错误报告[^1]。

[^1]: "错误报告" 应该是指 [`bad_cast` Exception](https://msdn.microsoft.com/en-us/library/82f1eehz.aspx) 这样的异常。

这 4 个 explicit cast operator 的 spec 很有点复杂，具体可以看 [这份总结](https://stackoverflow.com/a/332086/11640888)，或者我们只用记一些 rules of thumb by [Fred Larson & Mateen Ulhaq](https://stackoverflow.com/a/332070/11640888):

* `static_cast`:
	* For “well-behaved” and “reasonably well-behaved” casts
		* E.g. 最常见的 ordinary type conversions
* `const_cast`: 
	* For casting away (i.e. cancel) `const`/`volatile`. 
	* Avoid this unless you are stuck using a `const`-incorrect API.
* `reinterpret_cast`:
	* For low-level reinterpreting of bit patterns. 
		* E.g. converting a pointer to another pointer type. (i.e. 不同 type 的 pointer 互转)
		* E.g. converting an integral type to another pointer type and vice versa. (`int` 类与各种 type 的 pointer 互转)
	* Use with extreme caution.
* `dynamic_cast`:
	* For converting pointers/references within an inheritance hierarchy (i.e. for polymorphic types)
	* Relies on RTTI, has a run-time performance penalty.
	
下面举几个例子。

## 1. `static_cast`

```cpp
void func(int) {}

int main() {
	int i = 0x7fff; // Max pos value = 32767
	long l;
	float f;
	
	/*
	  (1) Typical castless conversions:
	*/
	l = i;
	f = i;
	// Also works:
	l = static_cast<long>(i);
	f = static_cast<float>(i);
	
	/*
	  (2) Narrowing conversions:
	*/
	i = l; // May lose digits
	i = f; // May lose info
	// Says "I know," eliminates warnings:
	i = static_cast<int>(l);
	i = static_cast<int>(f);
	char c = static_cast<char>(i);
	
	/*
	  (3) Forcing a conversion from void*: 
	*/
	void* vp = &i;
	// Old way produces a dangerous conversion:
	float* fp = (float*)vp;
	// The new way is equally dangerous:
	fp = static_cast<float*>(vp);
	
	/* 
	  (4) Implicit type conversions, normally performed by the compiler:
	*/
	double d = 0.0;
	int x = d; // Automatic type conversion
	x = static_cast<int>(d); // More explicit
	func(d); // Automatic type conversion
	func(static_cast<int>(d)); // More explicit
}
```

## 2. `const_cast`

```cpp
int main() {
	const int i = 0;
	int* j = (int*)&i; // Deprecated form
	j = const_cast<int*>(&i); // Preferred
	
	// Can't do simultaneous additional casting:
	// long* l = const_cast<long*>(&i); // Error
	
	volatile int k = 0;
	int* u = const_cast<int*>(&k);
}
```

## 3. `reinterpret_cast`

```cpp
#include <iostream>
using namespace std;

const int sz = 100;
struct X { int a[sz]; };
void print(X* x) {
	for(int i = 0; i < sz; i++)
	cout << x->a[i] << ' ';
	cout << endl << "--------------------" << endl;
}

int main() {
	X x;
	print(&x);
	
	int* xp = reinterpret_cast<int*>(&x);
	for(int* i = xp; i < xp + sz; i++)
		*i = 0;
		
	// Can't use xp as an X* at this point unless you cast it back:
	print(reinterpret_cast<X*>(xp));
	
	// In this example, you can also just use the original identifier:
	print(&x);
}
```

```cpp
#include <iostream>
using namespace std;

// Returns a hash code based on an address
unsigned short Hash( void *p ) {
   unsigned int val = reinterpret_cast<unsigned int>( p );
   return ( unsigned short )( val ^ (val >> 16));
}

int main() {
   int a[20];
   for ( int i = 0; i < 20; i++ )
      cout << Hash( a + i ) << endl;
}
```

## 4. `dynamic_cast`

```cpp
#include <iostream>
using namespace std;

class Pet {
public:
    virtual ~Pet() {}
};

class Dog : public Pet {};

class Cat : public Pet {};

int main() {
    Pet* b = new Cat; // Upcast
	
	// Try to cast it to Dog*:
    Dog* d1 = dynamic_cast<Dog*>(b);
	
	// Try to cast it to Cat*:
    Cat* d2 = dynamic_cast<Cat*>(b);
    
	cout << "d1 = " << d1 << endl; // d1 = 0; 地址为 0 表示转型失败 
    cout << "d2 = " << d2 << endl; // d2 = 0x2f7f40
}
```

可以配合 `#include <typeinfo>` 的 `typeid` 操作符使用：

```cpp
#include <typeinfo>

int main() {
	Circle c;
	
	Shape* s = &c; // Upcast
	Circle* cp = 0;
	Square* sp = 0;
	
	if(typeid(s) == typeid(cp)) // C++ RTTI
		cp = static_cast<Circle*>(s);
	else if(typeid(s) == typeid(sp))
		sp = static_cast<Square*>(s);
}
```
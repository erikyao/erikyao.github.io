---
layout: post
title: "C++: constexpr"
description: ""
category: C++
tags: [const, C++11]
---
{% include JB/setup %}

整理自: 

- _C++ Primer, 5th Edition_
- [Difference between `constexpr` and `const`](http://stackoverflow.com/questions/14116003/difference-between-constexpr-and-const)
- [Constexpr - Generalized Constant Expressions in C++11](http://www.cprogramming.com/c++11/c++11-compile-time-processing-with-constexpr.html)
- [constexpr specifier (since C++11)](http://en.cppreference.com/w/cpp/language/constexpr)
- [const vs constexpr on variables](http://stackoverflow.com/questions/13346879/const-vs-constexpr-on-variables)

-----

## 1. What is Const Expression?

A constant expression is an expression whose value cannot change and that can be evaluated at compile time. 

- A literal is a constant expression. 
- A const object that is initialized from a constant expression is also a constant expression.

```cpp
const int max_files = 20; 			// YES. 20 is a const expression; max_files is const and initialized from 20
const int limit = max_files + 1; 	// YES. max_files is a const expression; limit is const and initialized from max_files
int staff_size = 27; 				// NO. Because staff_size is not const
const int sz = get_size(); 			// DEPENDS on whether get_size() is a const expression
```

## 2. constexpr function

我觉得 constexpr 的主要用途就是可以使函数变成 const expression。比如上面那个 `get_size()`，如果我们在函数定义前加一个 constexpr，那么它就可以变成一个 constexpr，从而 `sz` 也就变成了 constexpr。

- 第一个作用：可以尽早在 compile time 确定 `sz` 的值，不用等到 runtime 再确定，因为等到 runtime 再确定是会出问题的，比如 `sz` 是 array size，你要运行到初始化的时候才能确定它的值，那在此之前你使用这个值就会出问题
- 第二个作用：你要用 const expression 的地方可以直接用这个 `get_size()` 来定了，最常见的还是 array size

举几个例子，一看就懂：

```cpp
constexpr int multiply (int x, int y) {
    return x * y;
}
 
// the compiler may evaluate this at compile time
const int val = multiply( 10, 10 );
```

```cpp
constexpr int getDefaultArraySize (int multiplier) {
    return 10 * multiplier;
}
 
int my_array[getDefaultArraySize(3)];
```

```cpp
template <int N>
class list { 

};

constexpr int sqr1(int arg) { 
	return arg*arg; 
}

int sqr2(int arg) { 
	return arg*arg; 
}

int main() {
  const int X = 2;

  list<sqr1(X)> mylist1; // OK. sqr1 is constexpr
  list<sqr2(X)> mylist2; // ERROR. sqr2 is not constexpr

  return 0;
}
```

当然，也不是说你可以把任何函数都变成 constexpr，限制可是有很多的，具体参 [constexpr specifier (since C++11)](http://en.cppreference.com/w/cpp/language/constexpr)。

有一点比较直接，也比较好记，那就是：A constexpr specifier used in an function declaration implies inline.

## 3. constexpr variable

A constexpr specifier used in an object declaration implies const.

粗略来说 const 和 constexpr variable 看不出有啥区别，但是 [const vs constexpr on variables](http://stackoverflow.com/questions/13346879/const-vs-constexpr-on-variables) 提到 constexpr variable 是强制 compile time const，而 const 可能是 runtime const。我估计和编译器实现有关，遇到具体问题再讨论。这里仅举几个例子：

```cpp
constexpr int mf = 20; 			// YES. Because 20 is a constant expression
constexpr int limit = mf + 1; 	// YES. Because mf + 1 is a constant expression
constexpr int sz = size(); 		// DEPENDS on whether size() is a const expression

const int *p = nullptr; 		// p is a pointer to const
constexpr int *q = nullptr; 	// q is a const pointer
constexpr int i = 42; 			// i is a const int
constexpr const int *r = &i; 	// r is a constant pointer to const
```

---
category: C++
description: ''
tags:
- C++11
- const
title: 'C++ Type Specifiers: auto / decltype'
---

整理自 _C++ Primer, 5th Edition_

-----

- top-level const: Indicates that a pointer or a reference itself is a const.
- low-level const: Indicates a pointer or reference to a const object.

## auto

When it is impossible to determine the type of an expression (or just because you're lazy), we can let the compiler figure out the type for us by using the `auto` type specifier.

`auto` tells the compiler to deduce the type from the initializer. By implication, a variable that uses auto as its type specifier must have an initializer:

```cpp
auto item = val1 + val2; // type determined by val1 + val2
```

As with any other type specifier, we can define multiple variables using `auto`. Because a declaration can involve only a single base type, the initializers for all the variables in the declaration must have types that are consistent with each other:

```cpp
auto i = 0, *p = &i; 	// OK. i is int and p is a pointer to int
auto sz = 0, pi = 3.14; // ERROR. inconsistent types for sz and pi
```

`auto` ignores top-level consts, but low-level consts are kept:

```cpp
const int ci = i, &cr = ci;

auto b = ci; 	// b is an int (top-level const in ci is dropped)
auto c = cr; 	// c is an int (cr is an alias for ci whose const is top-level)
auto d = &i; 	// d is an int*(& of an int object is int*)
auto e = &ci; 	// e is const int*(& of a const object is low-level const)
```

If we want the deduced type to have a top-level const, we must say so explicitly:

```cpp
const auto f = ci; // deduced type of ci is int; f has type const int
```

两个常见的用法是：

```cpp
string line;

auto len = line.size(); // len has type string::size_type

for (auto c : line) { // for every char in line
	...
}
```

## decltype

`decltype` returns the type of its operand. The compiler analyzes the expression to determine its type but does not evaluate the expression:

```cpp
decltype(f()) sum; 	// OK. sum has whatever type f() returns, while f() is not executed.

int i = 42, *p = &i, &r = i;
decltype(r + 0) b; 	// OK. addition yields an int; b is an (uninitialized) int
decltype(*p) c; 	// ERROR. c is int& and must be initialized
```

注意 *p 的 type 其实是 int& 而不是 int。

`decltype` will keep the top-level const:

```cpp
const int ci = 0, &cj = ci;

decltype(ci) x = 0;	// OK. x is a const int
decltype(cj) y = x; // OK. y is a const int& and is bound to x
decltype(cj) z;		// ERROR. z is a const int& and must be initialized
```

When we apply `decltype` to a variable without any parentheses, we get the type of that variable. If we wrap the variable’s name in one or more sets of parentheses, the compiler will evaluate the operand as an expression and as a result, `decltype` on such an expression yields a reference:

```cpp
int i = 47;

decltype((i)) d;	// ERROR. d is int& and must be initialized
decltype(i) e;		// OK. e is an (uninitialized) int
```
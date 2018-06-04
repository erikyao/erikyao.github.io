---
layout: post
title: "C++ Explicit Operators"
description: ""
category: C++
tags: []
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

These are keywords for bitwise and logical operators. Non-U.S. programmers without keyboard characters like `&`, `|`, `^`, and so on, were forced to use C’s horrible [trigraphs](http://en.wikipedia.org/wiki/Digraphs_and_trigraphs) (比如 `??-` 表示 `~`；无法想象当时的形势是如何的恶劣以至会设计成这样……), which were not only annoying to type, but obscure when reading. This is repaired in C++ with additional keywords:

<!--
Keyword, Meaning
`and`, `&&` (logical AND)
`or`, `||` (logical OR)
`not`, `!` (logical NOT)
`not_eq`, `!=` (logical not-equivalent)
`bitand`, `&` (bitwise AND)
`and_eq`, `&=` (bitwise AND-assignment)
`bitor`, `|` (bitwise OR)
`or_eq`, `|=` (bitwise OR-assignment)
`xor`, `^` (bitwise XOR exclusive OR)
`xor_eq`, `^=` (bitwise XOR-assignment)
`compl`, `~` (ones complement)
-->

| Keyword  | Meaning                         |
|----------|---------------------------------|
| `and`    | `&&` (logical AND)              |
| `or`     | `||` (logical OR)               |
| `not`    | `!` (logical NOT)               |
| `not_eq` | `!=` (logical not-equivalent)   |
| `bitand` | `&` (bitwise AND)               |
| `and_eq` | `&=` (bitwise AND-assignment)   |
| `bitor`  | `|` (bitwise OR)                |
| `or_eq`  | `|=` (bitwise OR-assignment)    |
| `xor`    | `^` (bitwise XOR, exclusive OR) |
| `xor_eq` | `^=` (bitwise XOR-assignment)   |
| `compl`  | `~` (ones complement)           |

举个例子：

```cpp
#include <iostream>
using namespace std;

int main() {
	bool a = true, b = false;
	
	cout << (a and b); // output: 0
	
	// 注意结合律，下式实际是 (cout << a) and b;
	// 然后 cout 的 && 操作符应该是重载了 
	// cout << a and b; // output: 1
}
```

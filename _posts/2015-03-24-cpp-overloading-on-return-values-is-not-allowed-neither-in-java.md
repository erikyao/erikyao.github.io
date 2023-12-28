---
category: C++
description: ''
tags: []
title: 'C++: Overloading on return values is NOT allowed (neither in java)'
---

整理自 _Thinking in C++_。

-----

```cpp
void f();
// int f(); // ERROR
```

If overloading on return values was permitted, how can the compiler distinguish which call is meant in `int x = f( );`? Possibly worse is the difficulty the reader has in knowing which function call is meant. Overloading solely on return value is a bit too subtle, and thus isn’t allowed in C++.

注意 Java 里也是不允许的（虽然我从来没有遇到过需要考虑这个问题的场景）。
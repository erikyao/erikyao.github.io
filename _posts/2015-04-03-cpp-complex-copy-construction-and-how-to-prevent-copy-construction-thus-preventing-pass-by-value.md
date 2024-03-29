---
category: C++
description: ''
tags:
- copy-constructor
title: 'C++: Complex copy-construction & How to prevent copy-construction (thus preventing
  pass-by-value)'
---

整理自：_Thinking in C++_

-----

## Complex copy-construction

这里说的 complex，意思是包含 object 的 object。比如：

```cpp
class T {
	...
};

class V {
private: 
	T t;
	...
};

int main() {
	T t;
	V v(t);
}
```

那么在 copy `v` 的时候，`t` 的 copy 由谁来负责呢？其实不用担心，`v` 的 copy-constructor 会自动调用 `t` 的 copy-constructor，形成 copy-constructor 的 chain。

## Preventing copy-construction

There’s a simple technique for preventing pass-by-value: declare a private copy-constructor.

```cpp
class T {
	T(const T&); // Prevent copy-construction
};
```

No definition is necessary because it never gets called, unless one of your member functions or a friend function needs to perform a pass-by-value.
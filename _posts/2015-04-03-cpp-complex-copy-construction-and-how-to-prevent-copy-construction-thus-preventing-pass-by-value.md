---
layout: post
title: "C++: Complex copy-construction and How to prevent copy-construction (thus preventing pass by value)"
description: ""
category: C++
tags: [Cpp-101, copy-constructor]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

## Complex copy-construction

这里说的 complex，意思是包含 object 的 object。比如：

<pre class="prettyprint linenums">
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
</pre>

那么在 copy `v` 的时候，`t` 的 copy 由谁来负责呢？其实不用担心，`v` 的 copy-constructor 会自动调用 `t` 的 copy-constructor，形成 copy-constructor 的 chain。

## Preventing copy-construction

There’s a simple technique for preventing pass-by-value: declare a private copy-constructor.

<pre class="prettyprint linenums">
class T {
	T(const T&); // Prevent copy-construction
};
</pre>

No definition is necessary because it never gets called, unless one of your member functions or a friend function needs to perform a pass-by-value. 
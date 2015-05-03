---
layout: post
title: "C++: initializer_list"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

总结自：

- [std::initializer_list](http://www.cplusplus.com/reference/initializer_list/initializer_list/)
- [Variable number of arguments in C++?](http://stackoverflow.com/questions/1657883/variable-number-of-arguments-in-c)

-----

首先它是一个 template，然后它是在 std 空间下，头文件是 `#include <initializer_list>`，但是在用的时候好像并不需要写这句 #include。

Objects of `initializer_list` are automatically constructed by the compiler from initialization list declarations, which is a list of comma-separated elements enclosed in braces:

<pre class="prettyprint linenums">
auto il = { 10, 20, 30 };  // il is an initializer_list 

for (auto i : { 1, 2, 3, 4, 5 })
	std::cout << i << "\n";
</pre>

Constructors taking only one argument of `initializer_list` are a special kind of constructor, called initializer-list constructor. 它的语法有点奇怪，我们称为 list initialization：

<pre class="prettyprint linenums">
struct myclass {
	myclass(int,int) { ... }
	myclass(initializer_list<int>) { ... }
};

myclass foo{10,20};  // calls initializer_list constructor
myclass bar(10,20);  // calls (int,int) constructor 
</pre>

然后你会发现 `initializer_list` 其实是个挺好的 variable argument list 可变参数列表的 solution，比 `func(...)` 简单多了：

<pre class="prettyprint linenums">
template &lt;class T&gt;
void func(std::initializer_list&lt;T&gt; list) {
    for(T elem : list) {
        std::cout &lt;&lt; elem &lt;&lt; std::endl ;
    }
}

int main() {
	func({10, 20, 30, 40}) ;
    func({"Hello", "World"}) ;
}
</pre>
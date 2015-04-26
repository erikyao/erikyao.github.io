---
layout: post
title: "C++: <i>static</i> inside functions"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

总结自：

- [What is the lifetime of a static variable in a C++ function?](http://stackoverflow.com/questions/246564/what-is-the-lifetime-of-a-static-variable-in-a-c-function)
- [Static variables in class methods]()

-----

如果在 global function 或是 member function 内部定义一个 static 的话，这个 static 只有在第一次函数调用后才会有定义。

如果第二次再调用这个 function 的话：

> Compilers typically use a hidden flag variable to indicate if the local statics have already been initialized, and this flag is checked on every entry to the function.

local static 的初始化在 C++98 中并不是 thread-safe 的，C++11 requires that static initialization be thread safe.

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

class A {
public:
   void foo() {
      static int i = 0;
      cout &lt;&lt; i++ &lt;&lt; endl;;
   }
};

int main() {
	A o1, o2, o3;
	
	o1.foo(); // output: 0
	o2.foo(); // output: 1
	o3.foo(); // output: 2
	o1.foo(); // output: 3
	
	cout &lt;&lt; A::i &lt;&lt; endl; // ERROR. 'i' is not a member of 'A'
}
</pre>

需要注意的是，local static 本质上还是个 local，它并不会变成 global static 或是 class member。除非你 `return i;`，否则其他地方都访问不到这个 `i`。
---
layout: post
title: "C++: Virtual Inheritance"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：

- [In C++, what is a virtual base class?](http://stackoverflow.com/questions/21558/in-c-what-is-a-virtual-base-class)
- [FAQ: What is the “dreaded diamond”?](https://isocpp.org/wiki/faq/multiple-inheritance#mi-diamond)
- [FAQ: Where in a hierarchy should I use virtual inheritance?](https://isocpp.org/wiki/faq/multiple-inheritance#virtual-inheritance-where)

-----

Virtual Inheritance 是专门用于解决 dreaded ([ˈdredɪd], I dread = I fear, dreaded 就是 "可怕的") diamond 问题的。那啥是 dread diamond 呢？我们来画个图：

	  A
	 / \
	B   C
	 \ /
	  D
	  
这时对象 D 里就有两个基类 A 对象，在访问基类 A 的方法或是 field 时就会出错，因为编译器不知道到底要访问哪一个基类 A 对象的方法或是 field。

解决的方法是在 B、C 上使用 Virtual Inheritance：

<pre class="prettyprint linenums">
class A { public: void Foo() {} };
class B : virtual public A {};		// VI
class C : virtual public A {};		// VI
class D : public B, public C {};

D d;
d.Foo(); // no longer ambiguous
</pre>

对，你没有看错，是在 B、C 的继承上加了个 virtual 关键字，根本不需要处理 D。而这个 virtual 对 B、C 的实现没有任何影响，该咋写咋写。换言之，你必须知道 D 会存在才需要对 B、C 使用 Virtual Inheritance，要是没有 D 的话根本就不用管。

从内部实现原理的角度来说，我们可以认为：B、C 并没有实际包含一个基类 A 对象，而是只包含了一个 A\*。这样对 D 而言，包含两个 A\* 并不会引起什么歧义。
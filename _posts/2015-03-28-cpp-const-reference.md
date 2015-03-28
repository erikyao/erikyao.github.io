---
layout: post
title: "C++: Const Reference"
description: ""
category: C++
tags: [Cpp-101, const]
---
{% include JB/setup %}

整理自 _Thinking in C++_

-----

## 1. Seriously, there is NO const reference.

我们按照 const pointer 那一套的逻辑来嘛，大家讲道理嘛……

<pre class="prettyprint linenums">
class T {};

int main() {  
	T t1, t2;
	const T ct;
	
	T* pt = &t1;		//  pt: pointer to T
	const T* pct = &ct; // pct: pointer to const T
	T* const cpt = &t2; // cpt: const pointer to T

	T& rt = t1;			//  rt: reference to T
	const T& rct = ct;  // rct: reference to const T
	T& const crt = t2;  // ERROR. 'const' qualifiers cannot be applied to 'T&' 
						// Ops! So there is NO const reference!
}
</pre>

但是好像到处都在用 "const reference"。更有甚者，编译器报错会用 "non-const reference" 这个词，比如 "invalid initialization of non-const reference of type 'X&' from an rvalue of type 'X'"。其实说的都是 reference to const，你明白就好。

但是我决定不妥协！在自己的文章里坚持不用 const reference 这个词！（其实我也有队友，比如写这篇 [[C++]寧以pass-by-reference-to-const取代pass-by-value](http://frank6831.pixnet.net/blog/post/128782097-%5Bc%2B%2B%5D%E5%AF%A7%E4%BB%A5pass-by-reference-to-const%E5%8F%96%E4%BB%A3pass-by-value) 的台湾朋友）

## 2. 理解 reference 与 object 的强绑定关系

<pre class="prettyprint linenums">
#include &lt;iostream&gt;

using namespace std;

class T {
public:
	int i;
	void modify();
	T(int i);
};

T::T(int i) {
	this->i = i;
}

void T::modify() {
	i++;
}

int main() {
	T t1(1), t2(2);
	
	T& rt = t1;
	rt = t2; // 等价于 t1 = t2；并不是将 rt 绑定到 t2，rt 仍然绑定 t1 
	
	// 这个时候 rt 绑定 t1；t1 == t2 
	cout &lt;&lt; t1.i &lt;&lt; endl; // 2
	cout &lt;&lt; t2.i &lt;&lt; endl;  // 2
	cout &lt;&lt; rt.i &lt;&lt; endl;   // 2
	
	// rt 修改，t1 跟着变化，不影响 t2
	rt.modify();
	cout &lt;&lt; t1.i &lt;&lt; endl; // 3
	cout &lt;&lt; t2.i &lt;&lt; endl;  // 2
	cout &lt;&lt; rt.i &lt;&lt; endl;   // 3
	
	// t1 修改，rt 跟着变化，还是不影响 t2
	t1.modify();
	cout &lt;&lt; t1.i &lt;&lt; endl; // 4
	cout &lt;&lt; t2.i &lt;&lt; endl;  // 2
	cout &lt;&lt; rt.i &lt;&lt; endl;   // 4
}
</pre>

* reference 在 declare 的时候是要求直接初始化的（`T& rt = t1;`），这一初始化就直接绑定 object 了，之后你再用 `=` 赋值（`rt = t2;`）也改变不了这个绑定关系，而是直接等价于 object 之间的赋值（i.e. 等价于 `t1 = t2;`）。
* 所以 reference 和 pointer 在行为上有本质的不同：pointer 可以到处乱改到处乱指；而 reference 一旦绑定 object 之后就直接等价于 object 了
	* <del>如果我们接受了 "reference 等价于 object" 的话，那么就可以认为 `foo(T t)` 和 `foo(T& rt)` 其实是接收相同的参数类型，只有 pass-by-value 和 pass-by-reference 的区别</del>
	* 同理，研究 `const T` 的行为也就等价于研究 `cont T&` 的行为
	
另外还看到过一个奇怪的言论，说 `T& const crt = t2;` 报错是因为 "reference 天生是 const"。这里 const 指的就是这种强绑定关系。不过鉴于 const reference 已经够歧义了，再说 "reference 天生是 const" 完全就是在添乱。这里必须表扬一下 [wikipedia - const (computer programming)](http://en.wikipedia.org/wiki/Const_(computer_programming)#C.2B.2B_convention)，用 "redundant" 这个词就合适得多：

> A declaration of a `const` reference is redundant since references can never be made to refer to another object.

<pre class="prettyprint linenums">
int & const constRef = i; // Error the "const" is redundant
</pre> 
	
## 3. <a name="rules"></a>大实验

<pre class="prettyprint linenums">
class T {};

int main() {
	T t;
	const T ct;
	
	T& rt = t; 
	const T& rct = ct; 
	
	/***** 注意以下 4 个 CASE 不能同时执行 *****/
	/***** 每次只能执行一个 *****/
	
	/***** CASE 1 *****/
	t = ct; 	// OK
	rt = ct;	// OK
				// object = const-object 可以，reference = const-object 自然也可以 
	
	/***** CASE 2 *****/
	t = rct; 	// OK
	rt = rct; 	// OK
				// object = reference-to-const 可以，reference = reference-to-const 自然也可以 
	
	/***** CASE 3 *****/
	ct = t; 	// ERROE. passing 'const T' as 'this' argument of 'T& T::operator=(const T&)' discards qualifiers
	rct = t; 	// ERROE. passing 'const T' as 'this' argument of 'T& T::operator=(const T&)' discards qualifiers
				// const-object = object 不行，reference-to-const = object 自然也不行 
	
	/***** CASE 4 *****/
	ct = rt; 	// ERROE. passing 'const T' as 'this' argument of 'T& T::operator=(const T&)' discards qualifiers
	rct = rt; 	// ERROE. passing 'const T' as 'this' argument of 'T& T::operator=(const T&)' discards qualifiers
				// const-object = reference 不行，reference-to-const = reference 自然也不行 
}	
</pre>

* 可以把一个 `const T` 或者 `const T&` 赋值给一个 `T` 或者 `T&`
	* 反过来把 `T` 或者 `T&` 赋值给一个 `const T` 或者 `const T&` 就不行
	* 这一点和 [C++: Const Pointer](/c++/2010/09/26/cpp-const-pointer/#rules) 是相反的

<pre class="prettyprint linenums">
class T { };

void foo(T& rt) { /* do nothing */ }
void bar(const T& rct) { /* do nothing */ }
void baz(T t) { /* do nothing */ }
void qux(const T t) { /* do nothing */ }

int main() {
	T t;
	const T ct;
	
	T& rt = t;			
	const T& rct = ct; 
	
	foo(t); 	// OK
	foo(rt);	// OK
	foo(ct);	// ERROR. invalid initialization of reference of type 'T&' from expression of type 'const T'
	foo(rct);	// ERROR. invalid initialization of reference of type 'T&' from expression of type 'const T'
	
	bar(t); 	// OK
	bar(rt);	// OK
	bar(ct);	// OK
	bar(rct);	// OK
	
	baz(t); 	// OK
	baz(rt);	// OK
	baz(ct);	// OK
	baz(rct);	// OK
	
	qux(t); 	// OK
	qux(rt);	// OK
	qux(ct);	// OK
	qux(rct);	// OK
}
</pre>

* 不能把 `const T` 或者 `const T&` 实参传给一个 `T&` 形参
	* 除此之外没有其他禁忌
	* 这一点和 [C++: Const Pointer](/c++/2010/09/26/cpp-const-pointer/#rules) 没有太大相关性
* 试验结果有点出乎我意料，因为 `foo(T& rt)` 和 `baz(T t)` 并不只有 pass-by-value vs. pass-by-reference 这一个区别
	
<pre class="prettyprint linenums">
class T {
public:
	int i;
	void modify();
	T(int i);
};

T::T(int i) {
	this->i = i;
}

void T::modify() {
	i++;
}

int main() {
	T t(1);
    const T ct(3);
    
    const T& rct1 = ct;
    const T& rct2 = t;	
    
    t.modify();		// OK
    ct.modify();	// ERROR. passing 'const T' as 'this' argument of 'void T::modify()' discards qualifiers
    rct1.modify();	// ERROR. passing 'const T' as 'this' argument of 'void T::modify()' discards qualifiers
    				// const-object.modify() 不可以，reference-to-const.modify() 自然也不可以 
    rct2.modify();	// ERROR. passing 'const T' as 'this' argument of 'void T::modify()' discards qualifiers
    				// 虽然 object.modify() 可以，可 reference-to-const 不允许修改 
}
</pre>

* `const T` 本身的值不能改
* 即使你是把一个 `T&`（t）赋给一个 `const T&`（rct2），你也不能通过这个 `const T&` 去修改它的值，虽然你可以用 `T*` 直接去修改（t.modify();）
	* 由此看来，`const T&` 其实是一种契约精神！（说不能改就不能改）
	* 这一点和 [C++: Const Pointer](/c++/2010/09/26/cpp-const-pointer/#rules) 是相同的









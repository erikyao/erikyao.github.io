---
layout: post
title: "C++: Const Pointer"
description: ""
category: C++
tags: [Cpp-101, const]
---
{% include JB/setup %}

在 2010-09-26 原作基础上修改。日期改到 2015-03-26 使本文进入 C++ 文章群落，方便查阅。

-----

## 1. pointer to const

首先确定一点，int const i; 与 const int i; 是一样的，都是定义一个只读的 int i。 
 
所以 int const \*p; 与 const int \*p; 也是一样的，都是定义一个只读的 int \*p。我们称这样的 p 为 pointer to const

* `const int *p;`: Starting from the identifier, we read “p is a pointer, which points to a const int.” 
* `int const *p;`: p is an ordinary pointer to an int that is const

但是，不管是 int const \*p; 还是 const int \*p;，这里有几点需要注意：

<pre class="prettyprint linenums">
#include &lt;stdio.h&gt;  
  
int main() {  
	int i1 = 30;  
	int i2 = 40;  
	const int *p = &i1;  
	  
	p = &i2; 			// OK
	i2 = 80;  
	printf("%d\n", *p); // output: 80  
	  
	*p = 100; 			// ERROR. assignment of read-only location '*p'
}
</pre>

* 首先是 \*p 只读，并不是 p 只读，所以 p 的值是可以改的（p = &i2;）
* 第二，&i1 只是一个 int \*，所以把一个int \* 赋值给 const int \* 是可以的（const int \*p = &i1;）
* 第三，p = &i2; 之后，对 &i2 这块地址的访问就有两种方式，一是非 const 的 i2，二是 const 的 \*p，所以可以有 i2 = 80;，而不能有 \*p = 100;

## 2. const pointer

int \* const p; 是定义了一个只读的 p，所以假如有 int \* const p = &i1; 之后，就不能再有 p = &i2;了。但是 \*p 的值是可以随便改的。我们称这样的 p 为 const pointer

* `int * const p = &i1;`: p is a pointer, which is const, that points to an int

## 3. const pointer to const

const int \* const p; 就是说 p 和 \*p 都是只读的，结合 1、2 即可得它的特性。

## 4. <a name="rules"></a>大实验

<pre class="prettyprint linenums">
class T { };
  
int main() {  
	T t1, t2;
	const T ct;
	
	T* pt = &t1;		//  pt: pointer to T
	const T* pct = &ct; // pct: pointer to const T
	T* const cpt = &t2; // cpt: const pointer to T
	
	pt = pct; 	// ERROR. invalid conversion from 'const T*' to 'T*' 
	pt = cpt; 	// OK
	
	pct = pt; 	// OK
	pct = cpt; 	// OK
	
	// 因为是 const 所以无法二次赋值
	cpt = pt;	// ERROR. assignment of read-only variable 'cpt'
	cpt = pct;	// ERROR. assignment of read-only variable 'cpt'
}
</pre>

<pre class="prettyprint linenums">
class T { };

int main() {
	T t;
	const T ct;
	
	T* pt = &t;			//  pt: pointer to T
	const T* pct = &ct; // pct: pointer to const T
	
						// cpt: const pointer to T
	T* const cpt = pt;	// OK
	T* const cpt = pct; // ERROR. invalid conversion from 'const T*' to 'T*'
}
</pre>

<pre class="prettyprint linenums">
class T { };

void foo(T* pt) { /* do nothing */ }
void bar(const T* pct) { /* do nothing */ }
void baz(T* const cpt) { /* do nothing */ }

int main() {
	T t1, t2;
	const T ct;
	
	T* pt = &t1;		//  pt: pointer to T
	const T* pct = &ct; // pct: pointer to const T
	T* const cpt = &t2; // cpt: const pointer to T
	
	foo(pct); 	// ERROR. invalid conversion from 'const T*' to 'T*'
	foo(cpt);	// OK
	
	bar(pt); 	// OK
	bar(cpt);	// OK
	
	baz(pt);	// OK
	baz(pct);	// ERROR. invalid conversion from 'const T*' to 'T*'
}
</pre>

* 不能把 `const T*` 赋值给一个 `T*`
	* 反过来把 `T*` 赋值给一个 `const T*` 是可以的
	* 这一点和 [C++: Const Reference](/c++/2015/03/28/cpp-const-reference#rules) 是相反的
* 不能把 `const T*` 实参传给一个 `T*` 形参
	* 反过来把 `T*` 实参传给一个 `const T*` 形参是可以的
	* 这一点和 [C++: Const Reference](/c++/2015/03/28/cpp-const-reference#rules) 是类似的
* `T* const` 除了 const 特性外，与 `T*` 性质是一样的（同上述 4 条）

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
    
    const T* pct1 = &ct;
    const T* pct2 = &t;	
    
    t.modify();		// OK
    ct.modify();	// ERROR. passing 'const T' as 'this' argument of 'void T::modify()' discards qualifiers
    pct1->modify();	// ERROR. passing 'const T' as 'this' argument of 'void T::modify()' discards qualifiers
    pct2->modify();	// ERROR. passing 'const T' as 'this' argument of 'void T::modify()' discards qualifiers
}
</pre>

* `const T` 本身的值不能改
* 即使你是把一个 `T*`（&t）赋给一个 `const T*`（pct2），你也不能通过这个 `const T*` 去修改它的值，虽然你可以用 `T*` 直接去修改（t.modify();）
	* 由此看来，`const T*` 其实是一种契约精神！（说不能改就不能改）
	* 这一点和 [C++: Const Reference](/c++/2015/03/28/cpp-const-reference#rules) 是相同的
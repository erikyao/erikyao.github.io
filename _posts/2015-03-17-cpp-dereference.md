---
layout: post
title: "C++: dereference"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：

* [1]<a name="ref1"></a> _Thinking in C++_。
* [2]<a name="ref2"></a> [Pointers](http://www.cplusplus.com/doc/tutorial/pointers)
* [3]<a name="ref3"></a> [dereference的一种新译法：用引](http://hax.iteye.com/blog/159332)
* [4]<a name="ref4"></a> [C++ pointers – reference and dereference operators](http://www.codingunit.com/cplusplus-tutorial-pointers-reference-and-dereference-operators)
* [5]<a name="ref5"></a> [Pointer Basics](http://cslibrary.stanford.edu/106)

其实 dereference 是个很简单的概念，只是这个单词的逻辑意义有点难搞，加上 reference 这个概念又来搅和……

-----

## 0. Glossary

* `&`: Address-of operator; can be read simply as "address of"
	* `&foo` returns the address of `foo` 
* `*`: Dereference operator; can be read as "value pointed to by"
	* `*bar` returns the data pointed by `bar`

<!-- -->

* reference^([1]): 英语单词本义
* reference^([2]): 专指 C++ reference (类型) 

An example of address-of operator:

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

int dog, cat;

void f(int pet) {
	cout &lt;&lt; "pet id number: " &lt;&lt; pet &lt;&lt; endl;
}

int main() {
	int i, j;
	
	cout &lt;&lt; "f(): " &lt;&lt; &f &lt;&lt; endl; // address of the function
	
	cout &lt;&lt; "dog: " &lt;&lt; &dog &lt;&lt; endl;
	cout &lt;&lt; "cat: " &lt;&lt; &cat &lt;&lt; endl;

	cout &lt;&lt; "i: " &lt;&lt; &i &lt;&lt; endl;
	cout &lt;&lt; "j: " &lt;&lt; &j &lt;&lt; endl;
}

// output:
/* 
	f(): 1
	dog: 0x49b030
	cat: 0x49b034
	i: 0x22fe4c
	j: 0x22fe48
*/
</pre>

To define a pointer:

<pre class="prettyprint linenums">
int a = 47;
int *ipa = &a;
</pre>

To access a variable through a pointer, you **dereference** the pointer using the same operator that you used to define it, like this:

<pre class="prettyprint linenums">
*ipa = 100;
</pre>

Now a contains the value 100 instead of 47.

Reference^([2]) 的例子见 [C++: pass-by-value / pass-by-pointer / pass-by-reference](/c++/2015/03/16/cpp-pass-by-value--pass-by-pointer--pass-by-reference)

## 1. dereference 第一种解读

首先要肯定的是：pointer 也是一种 reference^([1])，比如我们可以造句：

* The play is full of references to the political events of those days.
* A pointer stores a reference to some data. (参 [[5]](#ref5))

第二，dereference 和 reference^([2]) 没有直接关系。顺便说一句：把 reference^([2]) 理解为 alias 也是一个不错的选择。

第三，de- 理解为 "解除"，比如：

* deice: 除冰
* deactivate

这么一来，dereference 就可以这么理解：

1. pointer 是一种 reference^([1])，是一种间接访问
1. dereference 就是 "解除间接访问"，也就是直接访问 pointer 所指向的 data

另外注意英语的用法是 "to dereference the pointer"，或者进一步说 "dereferencing a pointer to an `int` yields an `int`"，我们就不要再造一个 "to reference the data" 的概念了，越搞越麻烦。

## 2. dereference 第二种解读

根据 [[3]](#ref3) 的理解，把 reference^([1]) 和 dereference 都看做 noun，于是有：

* pointer is a reference to data
* data is a dereference to pointer

de- 确实也有 reversal 的意思（"解除" 也可以理解为 "逆操作" 啊），不过这个解读我觉得有点绕，还不好解释 dereference 的 verb（解释成 to get the dereference to sth？）

另外看到 [[3]](#ref3) 这篇文章让我确信：中文版，呵呵……

## 3. dereference 第三种解读

根据 [[4]](#ref4)，`&` 也可以称作 reference operator，这个命名有两大好处：

1. 如果我们把 pointer 看做一种 reference^([1])，那么 `&` 就是统一了涉及 reference^([1]) 和 reference^([2]) 的两种用法，称其为 reference operator 再合适不过
	* `&foo` returns a pointer (reference^([1])) to `foo` 
	* `int &foo = bar;` defines a reference^([2]) named `foo`
1. 在 reference^([1]), i.e. pointer 的意义上，`&` 和 `*` 的确是反操作，如果 `&` 叫 reference operator，那么 `*` 自然就叫 dereference operator

画个表阐述下：

![](https://farm6.staticflickr.com/5733/23812247862_f7c2503510_o_d.png)

红蓝 CP，表示 "反操作" 关系的同时也表示这三个操作其实是联系非常紧密的；而 reference^([2]) 的 `int &ra = a;` 操作和这三个并没有太大关系，用灰色表示不相关。
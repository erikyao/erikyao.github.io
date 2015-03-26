---
layout: post
title: "Const Pointer"
description: ""
category: C
tags: [C-101]
---
{% include JB/setup %}

## （1）

首先确定一点，int const i; 与 const int i; 是一样的，都是定义一个只读的 int i。 

## （2）
 
所以 int const \*p; 与 const int \*p; 也是一样的，都是定义一个只读的 int \*p。英语表述更清楚，称为 pointer to const

* `const int *p;`: Starting from the identifier, we read “p is a pointer, which points to a const int.” 
* `int const *p;`: p is an ordinary pointer to an int that is const

但是，不管是 int const \*p; 还是 const int \*p;，这里有几点需要注意：

<pre class="prettyprint linenums">
#include &lt;stdio.h&gt;  
  
int main()   
{  
	int i1 = 30;  
	int i2 = 40;  
	const int *p = &i1;  
	  
	p = &i2; // no problem  
	i2 = 80;  
	printf("%d\n", *p); // output: 80  
	  
	// *p = 100; // error: assignment of read-only location  
	  
	return 0;  
} </pre>

* 首先是 \*p 只读，并不是 p 只读，所以 p 的值是可以改的（p = &i2;）
* 第二，&i1 只是一个 int \*，所以把一个int \* 赋值给 const int \* 是可以的（const int \*p = &i1;）
* 第三，p = &i2; 之后，对 &i2 这块地址的访问就有两种方式，一是非 const 的 i2，二是 const 的 \*p，所以可以有 i2 = 80;，而不能有 \*p = 100;

## （3）

int \* const p; 是定义了一个只读的 p，所以假如有 int \* const p = &i1; 之后，就不能再有 p = &i2;了。但是 \*p 的值是可以随便改的。我们称这样的 p 为 const pointer

* `int * const p = &i1;`: p is a pointer, which is const, that points to an int

## （4）

把一个 const int \* 赋值给 int \* 也是可以的：

<pre class="prettyprint linenums">
#include &lt;stdio.h&gt;  
  
int main()   
{     
	const int ci = 200;  
	int *p3 = &ci;  
	  
	*p3 = 250;  
	printf("%d\n", *p3); // output: 250  
	  
	return 0;  
} </pre>

这样其实是可以去修改一个 const int 的……  

## （5）

const int \* const p; 就是说 p 和 \*p 都是只读的，结合（2）、（3）即可得它的特性。
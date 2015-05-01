---
layout: post
title: "C++: Null Pointer"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

整理自 _C++ Primer, 5th Edition_

-----

There are several ways to obtain a null pointer:

<pre class="prettyprint linenums">
int *p1 = nullptr;	// OK. equivalent to int *p1 = 0;
int *p2 = 0;		// OK.

// must #include &lt;cstdlib&gt;
int *p3 = NULL;		// OK. equivalent to int *p3 = 0;

int zero = 0;
p3 = zero;			// ERROR. cannot assign an int to a pointer
</pre>

- The most direct approach is to initialize the pointer using the literal `nullptr`, which was introduced by C++11. 
- Alternatively, we can initialize a pointer to the literal 0.
- Older programs sometimes use a preprocessor variable named `NULL`, which the `cstdlib` header defines as 0.
- It is illegal to assign an int variable to a pointer, even if the variable’s value happens to be 0.
---
layout: post
title: "C++: There are void pointers but no void references"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

If you state that a pointer is a `void *`, it means that any type of address at all can be assigned to that pointer (whereas if you have an `int *`, you can assign only the address of an `int` variable to that pointer). For example:

<pre class="prettyprint linenums">
void *vp;
char c;
int i;

// The address of ANY type can be assigned to a void pointer:
vp = &c;
vp = &i;
</pre>

Once you assign to a `void *` you lose any information about what type it is. This means that before you can use the pointer, you must cast it to the correct type:

<pre class="prettyprint linenums">
int i = 99;
void *vp = &i;

// CANNOT dereference a void pointer:
// *vp = 3; // Compile-time error
// MUST cast back to int before dereferencing:
*((int*)vp) = 3; // OK
</pre>
	
In general, `void` pointers should be avoided, and used only in rare special cases.

You CANNOT have a `void` reference.
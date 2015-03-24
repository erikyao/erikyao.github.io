---
layout: post
title: "C++: new & delete"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

When you create a variable on the stack at compile-time, the storage for that variable is automatically created and freed by the compiler. The compiler knows exactly how much storage is needed, and it knows the lifetime of the variables because of scoping. With dynamic memory allocation (i.e. `new`), however, the compiler doesn’t know how much storage you’re going to need, and it doesn’t know the lifetime of that storage. That is, the storage doesn’t get cleaned up automatically. (So we need `delete`.)

A `new` expression returns a **pointer** to an object of the exact type that you asked for. So if you say `new Type`, you get back a pointer to a `Type`. 

* If you say `new int`, you get back a pointer to an `int`. 
* If you want a new `unsigned char` array, you get back a pointer to the first element of that array.
	* `unsigned char* b = new unsigned char[5];`
	
`delete` 直接用于变量名，比如：

<pre class="prettyprint linenums">
int *pi = new int;
delete pi;
</pre>

There’s a special syntax when you’re deleting an array. It’s as if you must remind the compiler that this pointer is not just pointing to one object, but to an array of objects:

* `delete[] myArray;`
	* 写成 `delete []myArray;` 也可以
* Every use of `new` should be balanced by a `delete`, and every use of `new[]` should be balanced by a `delete[]`.



---
layout: post
title: "C++: new &amp; delete"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

Where is the data for an object and how is the lifetime of that object controlled? Different programming languages use different philosophies here. <font color="red">C++ takes the approach that control of efficiency is the most important issue, so it gives the programmer a choice.</font>

## (stack + static storage) vs. heap

* For maximum runtime speed, the storage and lifetime can be determined while the program is being written, by placing the objects on the **stack** or in **static storage**. 
	* The stack is an area in memory that is used directly by the microprocessor to store data during program execution. 
		* Variables on the stack are sometimes called **automatic** or **scoped** variables. 
	* The static storage area is simply a fixed patch of memory that is allocated before the program begins to run.
* The second approach is to create objects dynamically in a pool of memory called the **heap**. In this approach you don’t know until runtime how many objects you need, what their lifetime is, or what their exact type is. Those decisions are made at the spur of the moment while the program is running.
	* This is done by `new` and `delete` keyword.
	* A.k.a dynamic memory allocation
	
Because the storage is managed dynamically at runtime, the amount of time required to allocate storage on the heap is significantly longer than the time to create storage on the stack. (Creating storage on the stack is often a single microprocessor instruction to move the stack pointer down, and another to move it back up.) The dynamic approach makes the generally logical assumption that objects tend to be complicated, so the extra overhead of finding storage and releasing that storage will not have an important impact on the creation of an object. In addition, the greater flexibility is essential to solve general programming problems.

## new & delete

A `new` expression returns a **pointer** to an object of the exact type that you asked for. So if you say `new Type`, you get back a pointer to a `Type`. 

* If you say `new int`, you get back a pointer to an `int`. 
* If you want a new `unsigned char` array, you get back a pointer to the first element of that array.
	* `unsigned char* b = new unsigned char[5];`
	
If you create an object on the stack or in static storage, the compiler determines how long the object lasts and can automatically destroy it (如果是 object 就 automatically 调用析构函数 `~Foo()`). However, if you create it on the heap via `new`, the compiler has no knowledge of its lifetime. In C++, the programmer must determine programmatically when to destroy the object, and then perform the destruction using the `delete` keyword.
	
`delete` 直接用于变量名，比如：

<pre class="prettyprint linenums">
int *pi = new int;
delete pi;
</pre>

There’s a special syntax when you’re deleting an array. It’s as if you must remind the compiler that this pointer is not just pointing to one object, but to an array of objects:

* `delete[] myArray;`
	* 写成 `delete []myArray;` 也可以
* Every use of `new` should be balanced by a `delete`, and every use of `new[]` should be balanced by a `delete[]`.



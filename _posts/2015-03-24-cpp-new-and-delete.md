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
	
`delete` 直接用于指针变量，比如：

```cpp
int *pi = new int;
delete pi;
```

If the pointer you’re deleting is zero, nothing will happen. For this reason, people often recommend setting a pointer to zero immediately after you delete it, to prevent deleting it twice.

Deleting `void*` is probably a bug. 从功能上来说，delete 一个 `void*` 还是可以释放内存的，但是因为是 `void*`，`delete` 不知道它的类型信息，所以就无法调用相应的 destructor。如果 `void*` 指向的是一片原始内存（比如 `int[]`）倒还好；若是恰巧 `void*` 指向的是一个 object，这个 object 的 destructor 中还有 `delete` 语句，那这个 `delete` 就执行不到了，久而久之就是 memory leak 了。所以 delete 一个 `void*` 一定要慎重。

### Deleting an array 

There’s a special syntax when you’re deleting an array. It’s as if you must remind the compiler that this pointer is not just pointing to one object, but to an array of objects:

* `delete[] myArray;`
	* 写成 `delete []myArray;` 也可以
	* The empty brackets tell the compiler to generate code that fetches the number of objects in the array, stored somewhere when the array is created, and calls the destructor for that many array objects. This is actually an improved syntax from the earlier form, which you may still occasionally see in old code: `delete [100]myArray;`
* Every use of `new` should be balanced by a `delete`, and every use of `new[]` should be balanced by a `delete[]`.



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

```cpp
void *vp;
char c;
int i;

// The address of ANY type can be assigned to a void pointer:
vp = &c;
vp = &i;
```

Once you assign to a `void *` you lose any information about what type it is. This means that before you can use the pointer, you must cast it to the correct type:

```cpp
int i = 99;
void *vp = &i;

// CANNOT dereference a void pointer:
// *vp = 3; // Compile-time error
// MUST cast back to int before dereferencing:
*((int*)vp) = 3; // OK
```

There’s one last item to mention. In C, you could assign a `void*` to any other pointer. But in C++, this is not allowed because of stricter type check.

```cpp
int i = 10;
void* vp = &i; // OK in both C and C++
int* ip = vp; // ONLY acceptable in C
```
	
In general, `void` pointers should be avoided, and used only in rare special cases.

You CANNOT have a `void` reference.
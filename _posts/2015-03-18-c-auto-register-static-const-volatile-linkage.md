---
layout: post
title: "C: auto / register / static / const / volatile / linkage"
description: ""
category: C
tags: [C-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

首先分大类：

* Global variables
* Local variables
	* `auto`
	* `register`
	* `static`
	* `extern` (前文已介绍，本篇不涉及)
* Constants
	* `const`
	* `volatile` (暂时放这里，后续会深入)
	
本文按这个框架走。最后顺带说一下 linkage。

-----

## 1. Global variables

Global variables are defined outside all function bodies and are available to all parts of the program (even code in other files). Global variables are unaffected by scopes and are always available (i.e., the lifetime of a global variable lasts until the program ends). If the existence of a global variable in one file is declared using the `extern` keyword in another file, the data is available for use by the second file.

## 2. Local variables

### 2.1 auto

Local variables occur within a scope; they are “local” to a function. They are often called **automatic** variables because they automatically come into being when the scope is entered and automatically go away when the scope closes. The keyword `auto` makes this explicit, but local variables _**default**_ to `auto` so it is never necessary to declare something as an `auto`.

### 2.2 register

A register variable is a type of local variable. The `register` keyword tells the compiler “Make accesses to this variable as fast as possible.” Increasing the access speed is implementation dependent, but, as the name suggests, it is often done by placing the variable in a register. There is no guarantee that the variable will be placed in a register or even that the access speed will increase. It is a hint to the compiler.

* You cannot take or compute the address of a register variable. 
* A register variable can be declared only within a block (you cannot have global or static register variables). 
* You can use a register variable as a formal argument in a function (i.e., in the argument list).

### 2.3 static

Static variables are extant throughout the life of a program. 其实 Global 也可以做到这一点，但是 static variable 的一个好处是我们可以把它设置为 local（这样就和 `auto` 的行为不一样了），使其 unavailable outside the scope of the function，限定 scope 以减少事端……

When `static` is applied to a function name or to a variable that is outside of all functions, it means “This name is unavailable outside of this file.” The function name or variable is local to the file (其他的文件用 `extern` 也 declare 不到); we say it has **file scope**.

## 3. Constants

### 3.1 #define

比如 `#define PI 3.14159`。缺点有：

* No type checking is performed on the name `PI`. 
* You can’t take the address of `PI` (so you can’t pass a pointer or a reference to `PI`). 
* `PI` cannot be a variable of a user-defined type. 
* The meaning of `PI` lasts from the point it is defined to the end of the file; the preprocessor doesn’t recognize scoping.

### 3.2 const

A `const` has a scope, just like a regular variable, so you can “hide” a const inside a function and be sure that the name will not affect the rest of the program.

In C++, a const must always have an initialization value (in C, this is not true).

You can add suffixes to force the type of floating-point number: `f` or `F` forces a `float`, `L` or `l` forces a `long double`; otherwise the number will be a `double`.

### 3.3 volatile

Whereas the qualifier `const` tells the compiler “This never changes” (which allows the compiler to perform extra optimizations), the qualifier `volatile` tells the compiler “You never know when this will change,” and prevents the compiler from performing any optimizations based on the stability of that variable. Use this keyword when you read some value outside the control of your code, such as a register in a piece of communication hardware. A volatile variable is **always** read whenever its value is required, even if it was just read the line before. 

A special case of some storage being “outside the control of your code” is in a multithreaded program. If you’re watching a particular flag that is modified by another thread or process, that flag should be volatile so the compiler doesn’t make the assumption that it can optimize away multiple reads of the flag.

## 4. Linkage

In an executing program, an identifier is represented by storage in memory that holds a variable or a compiled function body. Linkage describes how identifiers can or can not refer to the same entity throughout the whole program or one single translation unit.

* linkage: the manner or style of being linked

There are two types of linkage: 

* internal linkage
* external linkage

Internal linkage means that storage is created to represent the identifier only for the file being compiled. Other files may use the same identifier name with internal linkage, or for a global variable, and no conflicts will be found by the linker – separate storage is created for each identifier. Internal linkage is specified by the keyword `static` in C and C++.

External linkage means that a single piece of storage is created to represent the identifier for all files being compiled. The storage is created once, and the linker must resolve all other references to that storage. Global variables and function names have external linkage. These are accessed from other files by declaring them with the keyword `extern`. Variables defined outside all functions (with the exception of `const` in C++) and function definitions _**default**_ to external linkage. You can specifically force them to have internal linkage using the `static` keyword. You can explicitly state that an identifier has external linkage by defining it with the `extern` keyword. 

Automatic (local) variables exist only temporarily, on the stack, while a function is being called. The linker doesn’t know about automatic variables, and so these have no linkage.
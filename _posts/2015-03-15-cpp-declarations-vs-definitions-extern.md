---
category: C++
description: ''
tags: []
title: 'C++: declarations vs. definitions / extern'
---

整理自 _Thinking in C++_。

-----

To create a program with multiple files, functions in one file must access functions and data in other files. When compiling a file, the C or C++ compiler must know about the functions and data in the other files, in particular their names and proper usage. This process of “telling the compiler” the names of external functions and data and what they should look like is called **declaration**. Once you declare a function or variable, the compiler knows how to check to make sure it is used properly.

## 1. Declarations vs. definitions

* A declaration introduces a name –- an identifier –- to the compiler. It tells the compiler “This function or this variable exists somewhere, and here is what it should look like.” 
	* `int func1(int length, int width);`
* A definition, on the other hand, says: “Make this variable here” or “Make this function here.” It allocates storage for the name.
	* `int func1(int length, int width) { ... }`

You can declare a variable or a function in many different places, but there must be only one definition in C and C++ (this is sometimes called the ODR: one-definition rule).

A definition can also be a declaration. If the compiler hasn’t seen the name `x` before and you define `int x;`, the compiler sees the name as a declaration and allocates storage for it all at once.

## 2. Variable declaration syntax

By inference, a variable declaration might be a type followed by a name. For example: `int a;` could declare the variable `a` as an integer, using the logic above. Here’s the conflict: there is enough information in the code above for the compiler to create space for an integer called `a`, and that’s what happens. 

To resolve this dilemma, a keyword was necessary for C and C++ to say “This is only a declaration; it’s defined elsewhere.” The keyword is `extern`. It can mean the definition is external to the file, or that the definition occurs later in the file, like this:

```cpp
extern int a;
```
	
`extern` can also apply to function declarations, but it makes no difference. These two declarations are equivalent:

```cpp
extern int func1(int length, int width);
int func1(int length, int width); // equivalent
```

_2015-03-25 更新：_

[MSDN: Using extern to Specify Linkage](https://msdn.microsoft.com/en-us/library/0603949d.aspx) 曰：

> The `extern` keyword declares a variable or function and specifies that it has external linkage (its name is visible from files other than the one in which it's defined). When modifying a variable, `extern` specifies that the variable has static duration (it is allocated when the program begins and deallocated when the program ends). The variable or function may be defined in another source file, or later in the same file.

所以 “This is only a declaration; it’s defined elsewhere.” 只是 `extern` 的功能之一。更多内容请参 [extern: forcing const into external linkage](/c++/2015/03/18/cpp-auto-register-static-const-volatile-linkage-scope#extern).
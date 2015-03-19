---
layout: post
title: "C: declarations vs. definitions / extern"
description: ""
category: C
tags: [C-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

To create a program with multiple files, functions in one file must access functions and data in other files. When compiling a file, the C or C++ compiler must know about the functions and data in the other files, in particular their names and proper usage. This process of “telling the compiler” the names of external functions and data and what they should look like is called **declaration**. Once you declare a function or variable, the compiler knows how to check to make sure it is used properly.

## 1. Declarations vs. definitions

* A declaration introduces a name–-an identifier–-to the compiler. It tells the compiler “This function or this variable exists somewhere, and here is what it should look like.” 
	* `int func1(int length, int width);`
* A definition, on the other hand, says: “Make this variable here” or “Make this function here.” It allocates storage for the name.
	* `int func1(int length, int width) { ... }`

You can declare a variable or a function in many different places, but there must be only one definition in C and C++ (this is sometimes called the ODR: one-definition rule).

A definition can also be a declaration. If the compiler hasn’t seen the name `x` before and you define `int x;`, the compiler sees the name as a declaration and allocates storage for it all at once.

## 2. Variable declaration syntax

By inference, a variable declaration might be a type followed by a name. For example: `int a;` could declare the variable a as an integer, using the logic above. Here’s the conflict: there is enough information in the code above for the compiler to create space for an integer called a, and that’s what happens. 

To resolve this dilemma, a keyword was necessary for C and C++ to say “This is only a declaration; it’s defined elsewhere.” The keyword is `extern`. It can mean the definition is external to the file, or that the definition occurs later in the file, like this:

<pre class="prettyprint linenums">
extern int a;
</pre>
	
`extern` can also apply to function declarations, but it makes no difference. These two declarations are equivalent:

<pre class="prettyprint linenums">
extern int func1(int length, int width);
int func1(int length, int width); // equivalent
</pre>
	
虽然对 function declaration 是多于的，我觉得都加上 `extern` 更统一一点。
---
layout: post
title: "The compilation process"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

## 1. The general process of language translation

	source code -> interpreter/compiler -> machine instructions
	
### 1.1 Interpreters

An interpreter translates source code into activities (which may comprise groups of machine instructions) and immediately executes those activities. BASIC, for example, has been a popular interpreted language. Traditional BASIC interpreters translate and execute one line at a time, and then forget that the line has been translated. This makes them slow, since they must re-translate any repeated code. BASIC has also been compiled, for speed. More modern interpreters, such as those for the Python language, translate the entire program into an intermediate language that is then executed by a much faster interpreter. (The boundary between compilers and interpreters can tend to become a bit fuzzy, especially with Python, which has many of the features and power of a compiled language but the quick turnaround of an interpreted language.)

### 1.2 Compilers

A compiler translates source code directly into assembly language or machine instructions. The eventual end product is a file or files containing machine code.

Some languages (such as C) are designed to allow pieces of a program to be compiled independently. These pieces are eventually combined into a final executable program by a tool called the **linker**. This process is called **separate compilation** (declaration 和 library 就是实现 separate compilation 的重要手段).

Compiler debugging features have improved significantly over time. Modern compilers can insert information about the source code into the executable program. This information is used by powerful source-level debuggers to show exactly what is happening in a program by tracing its progress through the source code.

Some compilers tackle the compilation-speed problem by performing in-memory compilation. Most compilers work with files, reading and writing them in each step of the compilation process. In-memory compilers keep the compiler program in RAM. For small programs, this can seem as responsive as an interpreter.

## 2. The compilation process

### 2.1 Step 1: preprocessor

Some languages (C and C++, in particular) start compilation by running a **preprocessor** on the source code. The preprocessor is a simple program that replaces patterns in the source code with other patterns the programmer has defined (using preprocessor directives). Preprocessor directives are used to save typing and to increase the readability of the code. (Later in the book, you’ll learn how the design of C++ is meant to discourage much of the use of the preprocessor, since it can cause subtle bugs.) The pre-processed code is often written to an intermediate file.

### 2.2 Step 2: compiler

Compilers usually do their work in two passes. 

* The first pass **parses** the pre-processed code. The compiler breaks the source code into small units and organizes it into a structure called a tree. In the expression `A + B` the elements `A`, `+` and `B` are leaves on the parse tree. 
	* A global optimizer is sometimes used between the first and second passes to produce smaller, faster code.
* In the second pass, the **code generator** walks through the parse tree and generates either assembly language code or machine code for the nodes of the tree. The end result in both cases is an object module (a file that typically has an extension of .o or .obj). 
	* A peephole (窥视孔, 猫眼) optimizer is sometimes used in the second pass to look for pieces of code containing redundant assembly-language statements.
	
### 2.3 Step 3: linker
	
The **linker** combines a list of object modules into an executable program that can be loaded and run by the operating system.

* When a function in one object module makes a reference to a function or variable in another object module, the linker resolves these references; it makes sure that all the external functions and data you claimed existed during compilation do exist.
* The linker also adds a special object module to perform start-up activities.
* The linker can search through special files called libraries in order to resolve all its references. 
	* A library contains a collection of object modules in a single file. 
	* A library is created and maintained by a program called a librarian.
	
### 2.4 Digression: Static type checking

The compiler performs type checking during the first pass. Type checking tests for the proper use of arguments in functions and prevents many kinds of programming errors. Since type checking occurs during compilation instead of when the program is running, it is called **static type checking**.

Some object-oriented languages (notably Java) perform some type checking at runtime (**dynamic type checking**).
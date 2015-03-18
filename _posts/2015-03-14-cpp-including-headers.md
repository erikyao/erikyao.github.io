---
layout: post
title: "C++: Including headers"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

## Including headers

A **header file** is a file containing the external declarations for a library.

The `#include` preprocessor directive tells the preprocessor to open the named header file and insert its contents where the `#include` statement appears.

<pre class="prettyprint linenums">
#include &lt;header&gt; // search in some systematic paths
#include "local.h" // typically search relative to the current directory. If not found, reprocessed as &lt;local.h&gt;
</pre>

The libraries that have been inherited from C are still available with the traditional ‘.h’ extension. However, you can also use them with the more modern C++ include style by prepending a “c” before the name. Thus:

<pre class="prettyprint linenums">
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
</pre>

become:

<pre class="prettyprint linenums">
#include &lt;cstdio&gt;
#include &lt;cstdlib&gt;
</pre>

And so on, for all the Standard C headers. This provides a nice distinction to the reader indicating when you’re using C versus C++ libraries.

## How the linker searches a library

When you make an external reference to a function or variable in C or C++, the linker, upon encountering this reference, can do one of two things. If it has not already encountered the definition for the function or variable, it adds the identifier to its list of “unresolved references.” If the linker has already encountered the definition, the reference is resolved.

If the linker cannot find the definition in the list of object modules, it searches the libraries. Libraries have some sort of indexing so the linker doesn’t need to look through all the object modules in the library–-it just looks in the index. When the linker finds a definition in a library, the entire object module, not just the function definition, is linked into the executable program.

If you want to minimize executable program size, you might consider putting a single function in each source code file when you build your own libraries. This requires more editing3, but it can be helpful to the user.

## Secret additions linked in

When a C or C++ executable program is created, certain items are secretly linked in. One of these is the startup module, which contains initialization routines that must be run any time a C or C++ program begins to execute. These routines set up the stack and initialize certain variables in the program.

Because the standard library is always searched, you can use anything in that library by simply including the appropriate header file in your program; you don’t have to tell it to search the standard library.

If you are using an add-on library, you must explicitly add the library name to the list of files handed to the linker. 类似 java 自带的 lib 和 classpath 中新加的 jar。
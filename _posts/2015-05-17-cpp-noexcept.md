---
layout: post
title: "C++: noexcept"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

整理自 _C++ Primer, 5th Edition_

-----

## 1. noexcept == throw()

<pre class="prettyprint linenums">
void recoup(int) noexcept;	// recoup doesn't throw
void recoup(int) throw();	// equivalent declaration
</pre>

## 2. Violating the Exception Specification

It is important to understand that the compiler does not check the noexcept specification at compile time.

<pre class="prettyprint linenums">
// this function will compile, even though it clearly violates its exception specification
void f() noexcept {
	throw exception(); // violates the exception specification
}
</pre>

But if a `noexcept` function does throw, `terminate` is called to exit the program.

## 3. Arguments to the noexcept Specification

<pre class="prettyprint linenums">
void recoup(int) noexcept(true);	// recoup won't throw
void alloc(int) noexcept(false);	// alloc can throw
</pre>

## 4. The noexcept Operator

<pre class="prettyprint linenums">
noexcept(e) 

// Is true if all the functions called by e have non-throwing specifications and e itself does not contain a throw. 
// Otherwise, returns false.
</pre>

We can use the `noexcept` operator to form an exception specifier as follows:

<pre class="prettyprint linenums">
void f() noexcept(noexcept(g()));
</pre>

相当于就是 "You throw. I throw." 

## 5. Exception Specifications for Copy Control Members

When the compiler synthesizes the copy-control members, it generates an exception specification for the synthesized member. 

- If all the corresponding operation for all the members and base classes promise not to throw, then the synthesized member is `noexcept`.
- If any function invoked by the synthesized member can throw, then the synthesized member is `noexcept(false)`.
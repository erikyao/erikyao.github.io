---
layout: post
title: "C++: The Rule of Three/Five"
description: ""
category: C++
tags: [Cpp-101, C++11, copy-constructor]
---
{% include JB/setup %}

整理自 _C++ Primer, 5th Edition_

-----

There 5 (only 3 before C++11) basic operations to control copies of class objects: 

- copy constructor
- copy-assignment operator
- destructor. Moreover
- (C++11) move constructor
- (C++11) move-assignment operator

Ordinarily these 5 operations should be thought of as a unit. In general, it is unusual to need one without needing to define them all.

One rule of thumb to use when you decide whether a class needs to define its own versions of these 5 operations is to decide first whether the class needs a destructor: 

- Often, the need for a destructor is more obvious than the need for the copy constructor or assignment operator. 
- If the class needs a destructor, it almost surely needs a copy constructor and copy-assignment operator as well.
	- Virtual destructors are an important exception because a base class almost always needs a destructor.
		- 我们说 "need a destructor" 是指确实需要 free 掉某些资源；virtual destructor 是多态的要求，算是语言特性，在这个场合下要注意区分。
	- A second rule of thumb: Classes that need copy need assignment, and vice versa.
	
-----
	
For some classes, the compiler defines these synthesized members as `=delete` (参 [C++: =default & =delete](/c++/2015/05/03/cpp-default--delete/)):

- The synthesized destructor is defined as `=delete` 
	- if the class has a member whose own destructor is `=delete` or is inaccessible (e.g., private).
- The synthesized copy constructor is defined as `=delete` 
	- if the class has a member whose own copy constructor is `=delete` or inaccessible,
	- or if the class has a member with a `=delete` or inaccessible destructor.
- The synthesized copy-assignment operator is defined as `=delete` 
	- if a member has a `=delete` or inaccessible copy-assignment operator, 
	- or if the class has a const or reference member.
- The synthesized default constructor is defined as `=delete` 
	- if the class has a member with a `=delete` or inaccessible destructor, 
	- or has a reference member that does not have an in-class initializer (in-class initializer 其实就是指在 class 内部直接 define member 的语句，比如 `class Foo { int i = 47; }`),
	- or has a const member whose type does not explicitly define a default constructor and that member does not have an in-class initializer.
	
In essence, these rules mean that if a class has a data member that cannot be default constructed, copied, assigned, or destroyed, then the corresponding member will be a `=delete` function.

----- 

In order to define these 5 operations, we first have to decide what copying an object of our type will mean. In general, we have two choices: 1) We can define the copy operations to make the class behave like a value or 2) like a pointer.

- Classes that behave like values have their own state. When we copy a valuelike object, the copy and the original are independent of each other. Changes made to the copy have no effect on the original, and vice versa.
- Classes that act like pointers (e.g. [Smart Pointers](/c++/2015/05/07/cpp11-smart-pointer-auto_ptr-is-deprecated-use-unique_ptr-instead-here-also-comes-shared_ptr-and-weak_ptr/)) share state. When we copy objects of such classes, the copy and the original use the same underlying data. Changes made to the copy also change the original, and vice versa.
	- 这个时候你可能需要参考 [C++ overloading `operator=`: shallow copy vs. deep copy / reference counting / copy on write](/c++/2015/04/04/cpp-overloading--shallow-copy-vs-deep-copy--reference-counting--copy-on-write/)


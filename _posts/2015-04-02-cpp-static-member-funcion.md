---
layout: post
title: "C++: static member funcion"
description: ""
category: C++
tags: []
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

和 java 的 static method 基本一致。

- A static member function is designed to be conceptually associated with the class as a whole.
- A static member function cannot access ordinary data members, only static data members. 
- A static member function can call only other static member functions. 
- Normally, the address of the current object (`this`) is quietly passed in when any member function is called, but a static member has no `this`, which is the reason it cannot access ordinary members or call ordinary member function.
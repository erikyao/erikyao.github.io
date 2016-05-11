---
layout: post
title: "C++: Default function arguments & Placeholder arguments"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

## Default arguments

如果是 declare + define 一气呵成，那就这么写：

```cpp
int foo(int a, int b = 0) {
	return a+b;
}
```

如果是先 declare 再 define，那么只需要在 declaration 里写 default arguments；definition 里不用写（写了还算错）。加个注释会是个很好的习惯：

```cpp
int bar(int a, int b = 0);

int bar(int a, int b /* = 0 */) {
	return a+b;
}
```

There are two rules you must be aware of when using default arguments. 

* First, only trailing arguments may be defaulted. That is, you can’t have a default argument followed by a non-default argument. 
* Second, once you start using default arguments in a particular function call, all the subsequent arguments in that function’s argument list must be defaulted (this follows from the first rule).

## Placeholder arguments

我们知道，declare function 时可以不写参数名，比如：

```cpp
int foo(int, int);
```

Digress：和 Default arguments 一起用就更微妙了。比如：

```cpp
int foo(int, int = 0);
```

其实这还不是重点。重点是：definition 里也可以不写参数名！我们称这样的参数为 placeholder arguments，比如：

```cpp
int foo(int a, int) {
	...
}
```

* Placeholder arguments 不像 default arguments 那样有顺序上的附加要求，参数列表里随便哪个位置上都可以设置 placeholder
* Placeholder arguments 不能在函数体中使用
	* 没名字自然无法使用
	* 要能使用就不叫 placeholder 了
* The idea is that you might want to change the function definition to use the placeholder later, without changing all the code where the function is called. 
	* Of course, you can accomplish the same thing by using a named argument, but if you define the argument for the function body without using it, most compilers will give you a warning message, assuming you’ve made a logical error. 
	* By intentionally leaving the argument name out, you suppress this warning.
	
An especially important use of default arguments is when you start out with a function with a set of arguments, and after it’s been used for a while you discover you need to add arguments. By defaulting all the new arguments, you ensure that all client code using the previous interface is not disturbed.
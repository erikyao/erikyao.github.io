---
category: C++
description: ''
tags:
- C++11
title: C++ Lambda Expression
---

整理自：

- _C++ Primer, 5th Edition_
- [What is a lambda expression in C++11?](http://stackoverflow.com/questions/7627098/what-is-a-lambda-expression-in-c11)
- [Understanding Lambda-Capture](https://software.intel.com/sites/products/documentation/doclib/iss/2013/compiler/cpp-lin/GUID-835983D0-9779-422E-B339-0205358CAACC.htm)
- [Lambda functions (since C++11)](http://en.cppreference.com/w/cpp/language/lambda)

-----

## Intro

我们在 [C++: function object](/c++/2015/04/21/cpp-function-object) 里已经见识过了 function object 了。而实际上可以称为 callable expression 的技术有 4 种：

- function
- function pointer
- function object
- lambda expression

而 lambda expression 简单来说可以理解为 anonymous function object，不仅写起来比较简单（有时候为了个小功能而去单独写个 function object 也是蛮蛋疼的），而且功能上也强大了不少。它的形式是（完全体有点复杂，参 [Lambda functions (since C++11)](http://en.cppreference.com/w/cpp/language/lambda)）：

```cpp
[capture-list] (parameter-list) -> returnType { function-body }
[capture-list] (parameter-list) { function-body }	// Only if returnType can be deduced from return statements
[capture-list] { function-body } 					// If parameter-list is void, you can omit the parenthese
```

`-> returnType` 就是 [C++: 6 things you must know about functions](/c++/2015/05/03/cpp-things-you-must-know-about-functions) 里提到的 Trailing Return Type。不写的话，编译器会根据 return 语句来推断 returnType。By default, if a lambda body contains any statements other than a return（这句的意思是：如果 body 除了 return 外还包含了其他的语句）, that lambda is assumed to return void.

`capture-list` defines what from the outside of the lambda should be available inside the function body and how. It can be either:

1. empty: `[]`
1. a value: `[x]`
1. a reference: `[&x]`
1. any variable currently in scope by reference: `[&]`
1. same as 3, but by value: `[=]`
1. mixed form:
	- one by value and another by reference: `[x, &y]`
	- all by reference except `y` by value: `[&,y]`
	- all by value except `x` by reference: `[=,&x]`
	- etc.
	
我们照搬 [C++: function object](/c++/2015/04/21/cpp-function-object) 里 `gt15` 的例子，用 1) function, 2) function object, 3) standard function object, 4) lambda 这四种方法实现，对比下效果：

```cpp
#include <algorithm>
#include <cstddef>
#include <functional>
#include <iostream>
#include <iterator>
using namespace std;

bool gt15(int x) {
    return x > 15;
}

class Gt {
    int than;
public:
    Gt(int than) : than(than) {}
    bool operator()(int x) { // 注意语法 
        return x > than;
    }
};
 
int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
    /***** a) by function *****/
    remove_copy_if(a, a + SIZE,
                   ostream_iterator<int>(cout, "\n"),
                   gt15); // output: 10
    
	/***** b) by function object *****/ 
	// You can also make an object first and pass it in
		// Gt gt15(15);
    remove_copy_if(a, a + SIZE,
                   ostream_iterator<int>(cout, "\n"),
                   Gt(15)); // output: 10
    
    /***** c) by standard function object *****/ 
    remove_copy_if(a, a + SIZE,
                   ostream_iterator<int>(cout, "\n"),
                   bind2nd(greater<int>(), 15)); // output: 10
    
    /***** d) by lambda expression *****/ 
    // You can also make an object first and pass it in
    /*
		auto gt15 = [](const int& x) {
			return x > 15;
		};
	*/
    remove_copy_if(a, a + SIZE,
				   ostream_iterator<int>(cout, "\n"),
                   [](const int& x) {
					   return x > 15;
				   }); // output: 10
}
```

## Returning lambdas

另外 We can also [return a lambda from a function](http://stackoverflow.com/a/4727021). Just use `std::function`, to which lambda functions are convertible, as ReturnType:

```cpp
std::function<int (int)> retFun() {
    return [](int x) { return x; };
}
```

## Mutable Lambdas

By default, a lambda may not change the value of a variable that it captures by value. If we want to be able to change the value of a captured variable, we must follow the parameter list with the keyword `mutable`. Lambdas that are mutable may not omit the parameter list:

```cpp
void fcn3() {
	size_t v1 = 42; // local variable
	
	// 注意此时 v1 的值已经 copy 进来了，所以下面 v1 = 0 并不会影响 j == 43
	// 如果这里是 [&v1]，那么就会有 j == 1
	auto f = [v1] () mutable { return ++v1; };
	
	v1 = 0;
	auto j = f(); // j is 43
}
```
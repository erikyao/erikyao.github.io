---
category: C++
description: ''
tags:
- C++11
title: 'C++: 6 things you must know about functions'
toc: true
toc_sticky: true
---

整理自 _C++ Primer, 5th Edition_ & _Thinking in C++_

-----

## Never Return a Reference or Pointer to a Local Object

这个其实挺好懂的，但是要注意：在返回 string reference 的时候 return string literal 也是会出问题的：

```cpp
#include <string>
#include <iostream>
using namespace std;

const string& foo() {
	return "foo"; // WARNING. returning reference to temporary
}

const string bar() {
	return "bar"; // OK
}

int main() {
	cout << foo() << endl;
	cout << bar() << endl;
}
```

因为 string literal 本质上是个 const char[] 或者说是个 const char*，你要返回 string，首先是要把 string literal 转成 string，这会产生一个 temporary：

- 如果你是 return string，那 temporary 就占 return value placeholder；
- 如果是 return string reference，那这个 temporary 的 reference 就占 return value placeholder，但是 temporary 会被销毁。

return value placeholder 请参见 [C++: Copy-constructor and the return value on the stack](/c++/2015/04/02/cpp-copy-constructor-and-the-return-value-on-the-stack) 

## Reference Returns Are Lvalues

Calls to functions that return references are lvalues; other return types yield rvalues. 

```cpp
#include <string>
#include <iostream>
using namespace std;

char& getAt(string &str, string::size_type ix) {
    return str[ix]; // boundary check omitted here
}

int main() {
    string s("abcd");
    
	getAt(s, 0) = 'A';	// 有点毁三观……
    cout << s << endl;	// output: Abcd
    
	return 0;
}
```

因为是 lvalue 所以才敢这么用啊~

## List Initializing the Return Value

有的类，比如 vector，可以用 list initialization，所以你在 return vector 的函数里可以 return initializer_list：

```cpp
vector<string> process() {
	return {"functionX", "okay"};
}
```

## Using a Trailing Return Type

In general, the new keyword `auto` in C++11 indicates that the type of the expression (in this case the return type of a function) should be inferred from the result of what occurs after the `->`.

```cpp
// func takes an int argument and returns a pointer to an array of 10 ints
auto func(int i) -> int(*)[10];

// OR
auto func(int i) -> int(*)[10] {
	...
}
```

是不是比 `int (*func(int i))[10];` 来得清楚多了……

另外 trailing return type 也可以用在 template function 中，还可以结合 `decltype` 和 typename：

```cpp
// a trailing return lets us declare the return type after the parameter list is seen
template <typename It>
auto fcn(It beg, It end) -> decltype(*beg) {
	// process the range
	return *beg; // return a reference to an element from the range
}
```

## Return from main

The standard for `main()` is to return an int, but Standard C++ states that if there is no return statement inside `main()`, the compiler will automatically generate a `return 0;`.

## Empty argument list

If you have an empty argument list, you can declare it as `func();` in C++, which tells the compiler there are exactly zero arguments. You should be aware that this only means an empty argument list in C++. In C it means “an indeterminate number of arguments (which is a “hole” in C since it disables type checking in that case). 

The second solution is `func(void);`, which means an empty argument list in both C and C++.
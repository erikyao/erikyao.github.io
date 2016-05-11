---
layout: post
title: "C++: inline function"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_

-----

## 1. Why inline function?

P415~420 讲的是函数式 #define 有 efficiency 的优势，同时有很多缺陷；而 inline function 是为了弥补这些缺陷同时保留 efficiency 的优势。

函数式 #define 的 efficiency 的优势体现在：

* 直接由 preprocessor 做文本替换，不存在 compiler 的 function call overhead。这些 overhead 包括：
	* pushing arguments
	* making an assembly-language `CALL`
	* returning arguments
	* performing an assembly-language `RETURN`
	
函数式 #define 的缺陷是：

* 非常容易出错，比如复杂参数代入后的优先级问题，`i++` 这样的有 side effect 的参数代入后会被执行多次
* The preprocessor has no permission to access class member data. This means preprocessor macros cannot be used as class member functions.

Inline function, which is a true function in every sense. Any behavior you expect from an ordinary function, you get from an inline function. The only difference is that an inline function is expanded in place, like a preprocessor macro, so the overhead of the function call is eliminated. Thus, you should (almost) never use macro functions, only inline functions.

## 2. How inline function?

Any member function _**defined**_ within a class body, a.k.a _in situ_ function, is _**automatically**_ `inline`. 

如果 member function 的 declaration 和 definition 是分开的，只在 declaration 处声明 inline 是无效的，必须在 definition 处声明 inline 才有效。而且 best practice 是只在 definition 处写 inline，declaration 处不用写：

```cpp
class Foo {
public:
	void method();  		// Best practice: Don't put the inline keyword here
	// ...
};

inline void Foo::method() { // Best practice: Put the inline keyword here
  // ...
}
```

具体的解释见 [FAQ: With inline member functions that are defined outside the class, is it best to put the inline keyword next to the declaration within the class body, next to the definition outside the class body, or both?](http://isocpp.org/wiki/faq/inline-functions#where-to-put-inline-keyword)。大致的意思就是：inline 作为实现的技术细节不需要暴露在 class declaration 中。

另外要注意 Inline functions should normally be put in header files，所以文件结构就变成了：

* .h: class declaration + inline member function 实现
* .cpp: 其他 non-inline member function 实现

如果是一个 non-member function 要做成 inline，最好的做法是直接在 .h 中写上 inline 并直接 define。具体见 [FAQ: How do you tell the compiler to make a non-member function inline?](http://isocpp.org/wiki/faq/inline-functions#inline-nonmember-fns)。

If all your functions are inlined, using the library becomes quite simple because there’s no linking necessary. However, inlining a big function will cause that code to be duplicated everywhere the function is called, producing code bloat that may mitigate ([ˈmɪtɪgeɪt], To reduce, lessen, or decrease) the speed benefit. The only reliable course of action is to experiment to discover the effects of inlining on your program with your compiler.

## 3. Access functions

One of the most important uses of inlines inside classes is the access function. 

Access function 说白了就是 getter 和 setter，C++ 界也有叫 accessors 和 mutators 的。举个例子：

```cpp
class Access {
	int i;
public:
	int read() const { return i; } // 直接在 class 内部定义的 function 默认是 inline
	void set(int ii) { i = ii; }
};

int main() {
	Access A;
	A.set(100);
	int x = A.read();
}
```

## 4. Inlines and the compiler

To understand when inlining is effective, it’s helpful to know what the compiler does when it encounters an inline. As with any function, the compiler holds the **function type** (that is, the function prototype including the name and argument types, in combination with the function return value) in its symbol table. In addition, when the compiler sees that the inline’s function type and the function body parses without error, the code for the function body is also brought into the symbol table. Whether the code is stored in source form, compiled assembly instructions, or some other representation is up to the compiler.

When you make a call to an inline function, the compiler first ensures that the call can be correctly made. That is, all the argument types must either be the exact types in the function’s argument list, or the compiler must be able to make a type conversion to the proper types and the return value must be the correct type (or convertible to the correct type) in the destination expression. This, of course, is exactly what the compiler does for any function and is markedly different from what the preprocessor does because the preprocessor cannot check types or make conversions.

If all the function type information fits the context of the call, then the inline code is substituted directly for the function call, eliminating the call overhead and allowing for further optimizations by the compiler. Also, if the inline is a member function, the address of the object (`this`) is put in the appropriate place(s), which of course is another action the preprocessor is unable to perform.

### Limitations

There are two situations in which the compiler cannot perform inlining. In these cases, it simply reverts to the ordinary form of a function by taking the inline definition and creating storage for the function just as it does for a non-inline. If it must do this in multiple translation units (which would normally cause a multiple definition error), the linker is told to ignore the multiple definitions.

The compiler cannot perform inlining if the function is too complicated. This depends upon the particular compiler, but at the point most compilers give up, the inline probably wouldn’t gain you any efficiency. In general, any sort of looping is considered too complicated to expand as an inline, and if you think about it, looping probably entails much more time inside the function than what is required for the function call overhead.

The compiler also cannot perform inlining if the address of the function is taken implicitly or explicitly. If the compiler must produce an address, then it will allocate storage for the function code and use the resulting address.

It is important to understand that an inline is just a suggestion to the compiler; the compiler is not forced to inline anything at all. A good compiler will inline small, simple functions while intelligently ignoring inlines that are too complicated.

### Forwarding a reference to another function in an inline function is OK

```cpp
class Forward {
	int i;
public:
	Forward() : i(0) {}
	
	// Call to undeclared function:
	int f() const { return g() + 1; }

	int g() const { return i; }
};

int main() {
	Forward frwd;
	frwd.f();
}
```

In `f()`, a call is made to `g()` (这里 `g()` 是否是 inline 并不影响), although `g()` has not yet been declared. This works because the language definition states that no inline functions in a class shall be evaluated until the closing brace of the class declaration.

### constructors 和 destructors 设计成 inline 不一定好

具体情况具体分析。当 constructor 和 destructor 比较复杂的时候，比如子类 constructor 包含了父类对象初始化时，设计成 inline 并不是个好主意。
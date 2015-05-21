---
layout: post
title: "C++ Exception Handling / auto_ptr"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volume 2_

-----

## 目录

- [1. Throwing](#throw)
- [2. Catching all](#catch-all)
- [3. Re-throwing](#re-throw)
- [4. When an exception is never caught](#never-caught)
- [5. Exceptions during construction](#construction-exception)
	- [`auto_ptr`](#auto_ptr)
- [6. Function-level try-blocks](#try-function)
- [7. Standard exceptions](#standard-exception)
- [8. Declaring a throw](#exception-specification)
- [9. Exception safety](#exception-safety)

-----

There are two basic models in exception-handling theory: termination and resumption. 

* C++ and Java both support termination, which means there’s no way to automatically resume execution at the point where the exception occurred.
* Using resumption semantics means that the exception handler is expected to do something to rectify the situation, and then the faulting code is automatically retried, presuming success the second time.

## <a name="throw"></a>1. Throwing 

You can use any type (including built-in types) as an exception when you throw, but usually you’ll create special classes for throwing exceptions.

而对应的 catch 也可以用 primitive type，比如：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

void oz() {
    throw 47; // throwing an int as an exception
}

int main() {
    try {
        oz();
    } catch(int) { // catching an int exception 
        cout &lt;&lt; "Something wrong..." &lt;&lt; endl;
    }
}
</pre>

## <a name="catch-all"></a>2. Catching all
	
如果想像 Java 的 `catch(Exception e)` 一样来抓所有的 exception，C++ 需要写成 `catch (...)`：

<pre class="prettyprint linenums">
catch(...) {
	// catch any type of exception
}
</pre>

The ellipsis ([ɪˈlɪpsɪs], (语法结构上的)省略) gives you no possibility to have an argument, so you can’t know anything about the exception or its type. It’s a “catch-all.” Such a catch clause is often used to clean up some resources and then re-throw the exception.

## <a name="re-throw"></a>3. Re-throwing

You re-throw an exception by using `throw` with no argument inside a handler:

<pre class="prettyprint linenums">
catch(...) {
	// Deallocate your resource here, and then re-throw
	throw;
}
</pre>

In addition, everything about the exception object is preserved, so the handler at the higher context that catches the specific exception type can extract any information the object may contain.

## <a name="never-caught"></a>4. When an exception is never caught

If no handler at any level catches the exception, the special library function `terminate()` (declared in the `<exception>` header) is automatically called. By default, `terminate()` calls the Standard C library function `abort()`, which abruptly exits the program. 

You can install your own `terminate()` function using the standard `set_terminate()` function, which returns a pointer to the `terminate()` function you are replacing (which will be the default library version the first time you call it), so you can restore it later if you want. Your custom `terminate()` must take no arguments and have a void return value. In addition, any `terminate()` function you install must not throw an exception.

书上还有一种写法要注意下：在 destructor 中 throw 一个 exception 是不可能被 catch 到的，所以会直接到 `terminate()` 手上。所以 destructor 中必须是不能 throw 的。

## <a name="construction-exception"></a>5. Exceptions during construction

If an exception is thrown inside a constructor, the associated destructor will not be called for that object. 对这个 object 而言，这并不是内存泄露，因为这个 object 并没有被创建成功。

但是如果这个 object 的 constructor 内有 new，就需要仔细考虑一下了：

- (1) 如果 `T` 的 constructor 内有一个 `new A`，但是抛了异常（不管是系统的 `bad_alloc` 或者是 `A` 自己的 `operator new` 抛的异常）
	- 这对 `A` 而言不是系统泄露（因为没有创建成功）
	- 对 `T` 而言也不是系统泄露（因为也没有创建成功）
- (2) 如果 `T` 的 constructor 内 `new A` 成功，紧接着一个 `new B` 抛了异常而 `T` 的 constructor 内没有 catch
	- 这对 `B` 而言不是系统泄露（因为没有创建成功）
	- 对 `T` 而言也不是系统泄露（因为也没有创建成功）
	- 但是 `A` 没有人回收（因为一般 delete 是写在 `T` 的 destructor，而这时 destructor 不会执行），对 `A` 而言就是系统泄露

为了避免状况 (2)，有两种方法可以使用：

- `T` 的 constructor 内 catch `B` 的异常，然后 delete 已经分配的 `A` 
- 对 `A` 和 `B` 单独再建两个 class `ResA` 和 `ResB`
	- `new A` 写在 `ResA` 的 constructor 里，`delete A` 写在 `ResA` 的 destructor 里
	- `new B` 写在 `ResB` 的 constructor 里，`delete B` 写在 `ResB` 的 destructor 里
	- 其实就是把 `A`、`B` 的 `new`、`delete` 封装成了 `ResA`、`ResB` 的生命周期 
		- Using this approach, each allocation becomes atomic, by virtue of being part of the lifetime of a local object. 
		- 这么做的原因是 local object 是可以被 [**stack unwinding**](https://msdn.microsoft.com/en-us/library/hh254939.aspx) 过程回收的，而指针无法被 stack unwinding 回收.
			- In the C++ exception mechanism, control moves from the `throw` statement to the first `catch` statement that can handle the thrown type. When the `catch` statement is reached, all of the automatic variables that are in scope between the `throw` and `catch` statements are destroyed in a process that is known as stack unwinding.
			- 再次考虑状况 (2)：如果 `T` 的 constructor 内 `ResA` 创建成功，紧接着创建 `ResB` 时抛了异常而 `T` 的 constructor 内没有 catch。这时只要 `T` 的 constructor 外有 catch，就进入 stack unwinding 
				- 这对 `ResB` 而言不是系统泄露（因为没有创建成功）
				- 对 `T` 而言也不是系统泄露（因为也没有创建成功）
				- `ResA` 被 stack unwinding 销毁，不存在系统泄露。
				- 这整个过程完全不依赖 `T` 的 destructor
		- This technique is called _Resource Acquisition Is Initialization_ (**RAII** for short)
	- `ResA` 和 `ResB` 可以用 template 来写
	
### <a name="auto_ptr"></a>auto_ptr

`auto_ptr` 是 `#include <memory>` 自带的 RAII wrapper for pointers. `auto_ptr<A>` 就相当于上面的 `ResA`。

The `auto_ptr` class template also overloads the pointer operators `*` and `->` to forward these operations to the original pointer the `auto_ptr` object is holding. So you can use the `auto_ptr` object as if it were a raw pointer.

_~~~~~~~~~~ 2015-05-21 补充；来自 Item 13, Effective C++ ~~~~~~~~~~_

Because an `auto_ptr` automatically deletes what it points to when the `auto_ptr` is destroyed, it’s important that there never be more than one `auto_ptr` pointing to an object. If there were, the object would be deleted more than once, and that would put your program on the fast track to undefined behavior. To prevent such problems, `auto_ptr`s have an unusual characteristic: copying them (via copy constructor or copy assignment operator) sets them to null, and the copying pointer assumes sole ownership of the resource!

<pre class="prettyprint linenums">
std::auto_ptr&lt;Investment&gt; pInv1(createInvestment()); 
std::auto_ptr&lt;Investment&gt; pInv2(pInv1); // pInv2 now points to the object; pInv1 is now null
pInv1 = pInv2; 							// now pInv1 points to the object, and pInv2 is null
</pre>

STL containers require that their contents exhibit “normal” copying behavior, so containers of `auto_ptr` aren’t allowed.

_~~~~~~~~~~ 2015-05-21 补充完毕 ~~~~~~~~~~_

## <a name="try-function"></a>6. Function-level try-blocks

所谓 function–level try-block，就是把整个 function body 当做 try-block。那 try 写在哪儿？写在 function name 和 `{` 中间：

<pre class="prettyprint linenums">
int main() try {
	throw "main";
} catch(const char* msg) {
	cout << msg << endl;
	return 1;
}
</pre>

简直是奇行种……C++ also allows function-level try blocks for any function.

注意书上还有一种写法是把 try 写在 constructor initializer list 前面：

<pre class="prettyprint linenums">
Ext(int i) try : Base(i) { // Base 的 constructor 可能抛异常
	// Ext construction goes here
} catch(BaseException&) {
	throw ExtException("Base constructor fails");;
}
</pre>

## <a name="standard-exception"></a>7. Standard exceptions

- All standard exception classes derive ultimately from the class `exception`, defined in the header `<exception>`.
- The two main derived classes are `logic_error` and `runtime_error`, which are found in `<stdexcept>` (which itself includes `<exception>`). 
	- The class `logic_error` represents errors in programming logic (which could presumably be detected by inspection)
		- such as passing an invalid argument. 
	- `runtime_error`s are those that occur as the result of unforeseen forces (which can presumably be detected only when the program executes) 
		- such as hardware failure or memory exhaustion. 
		- divide-by-zero 在 C++ 中并不是一个 `runtime_error`
- Both `runtime_error` and `logic_error` provide a constructor that takes a `std::string` argument so that you can store a message in the exception object and extract it later with `exception::what()`.
- `std::exception` does not provide a constructor that takes a `std::string` argument, so you’ll usually derive your exception classes from either `runtime_error` or `logic_error`.
	- The iostream exception class `ios::failure` is derived from `exception`.

| extends logic_error | Usage      |
|---------------------|------------|
| domain_error        | Reports violations of a precondition. |
| invalid_argument    | Indicates an invalid function argument. |
| length_error        | Indicates an attempt to produce an object whose length is greater than or equal to `npos` (the largest representable value of context’s size type, usually `std::size_t`). |
| out_of_range        | Reports an out-of-range argument. |
| bad_cast            | Thrown for executing an invalid `dynamic_cast` expression in RTTI. |
| bad_typeid          | Reports a null pointer `p` in an expression `typeid(*p)`. |

| extends runtime_error | Usage                                  |
|-----------------------|----------------------------------------|
| range_error           | Reports violation of a postcondition.  |
| overflow_error        | Reports an arithmetic overflow.        |
| bad_alloc             | Reports a failure to allocate storage. |

## <a name="exception-specification"></a>8. Declaring a throw

标准用词是 exception specification，懂了就好。注意语法：

<pre class="prettyprint linenums">
// 注意是 throw 不是 throws
void f() throw(FooException, BarException, BazException); // 可能抛出三种异常

void f();				// 可能抛出任何异常

void f() throw();		// 不会抛出任何异常

void f() throw(...);	// ERROR. no such syntax
</pre>

If your exception specification claims you’re going to throw a certain set of exceptions and then you throw something that isn’t in that set, the special function `unexpected()` is called. The default `unexpected()` calls the `terminate()` function. 你也可以用 ` set_unexpected()` 自己注册一个，语法和 `set_terminate()` 是同一个系列的。

Since exception specifications are logically part of a function’s declaration, they too must remain consistent across an inheritance hierarchy.

- A derived class must not add any other exception types to base's specification list.
- You can, however, specify fewer exceptions or none at all.
- You can also specify `ExtException` for `Ext` if there is `BaseException` for `Base`. (可以理解为协变类型)

## <a name="exception-safety"></a>9. Exception safety

书上举了个例子：Standard C++ Library 的 `stack`，`pop()` 是个 void 函数。To retrieve the top value, call `top()` before you call `pop()`. 为什么要这么设计？直接把 `pop()` 设计为 int 不好吗？比如：

<pre class="prettyprint linenums">
template&lt;class T&gt; T stack&lt;T&gt;::pop() {
	if(top == 0)
		throw logic_error("stack underflow");
	else
		return data[--top]; // If an exception was thrown here...
}
</pre>

What happens if the copy constructor that is called for the return value in the last line throws an exception when the value is returned? The popped element is not returned because of the exception, and yet `top` has already been decremented, so the top element you wanted is lost forever! 

The problem is that this function attempts to do two things at once: (1) return a value, and (2) change the state of the stack. It is better to separate these two actions into two separate member functions, which is exactly what the standard stack class does. (In other words, follow the design practice of cohesion—every function should do one thing well.) Exception-safe code leaves objects in a consistent state and does not leak resources.

另外还有一个概念叫 exception neutral，指不吞 exception。一个设计良好的 lib 应该同时具备 exception safe 和 exception neutral 这两个特性。


---
layout: post
title: "C++: overloading <i>new</i> &amp; <i>delete</i>"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

## 1. Intro

When you create a new-expression such as `new T`, two things occur: 

* First, storage is allocated using `operator new`, 
* then the constructor is called.

In a delete-expression such as `delete pt;`: 

* The destructor is called, 
* then storage is deallocated using the `operator delete`. 

The constructor and destructor calls are never under your control, but you can overload the storage allocation parts of `new` and `delete`.

When you overload `operator new`, you also replace the behavior when it runs out of memory, so you must decide what to do in your `operator new`: return zero, write a loop to call the newhandler and retry allocation, or (typically) throw a `bad_alloc` exception.

### Digress: set_new_handler()

当 `new` 申请不到内存的时候，其实是会执行一个叫做 new_handler 的 function，这是一个无参的 void 函数，默认的行为是 throw 一个 exception。我们可以用 `#include <new>` 的 set_new_handler() 函数来设置一个新的 new_handler，只要这个 new_handler 是一个无参的 void 函数就行。看例子：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
#include &lt;cstdlib&gt;
#include &lt;new&gt;
using namespace std;

int count = 0;

void out_of_memory() {
    cerr &lt;&lt; "memory exhausted after " &lt;&lt; count
         &lt;&lt; " allocations!" &lt;&lt; endl;
    exit(1);
}

// DANGEROUS. Better try it on a virtual machine
int main() {
    set_new_handler(out_of_memory);
    while(1) {
        count++;
        new int[1000]; // Exhausts memory
    }
}
</pre>

The behavior of the new_handler is tied to `operator new`, so if you overload `operator new`, the new_handler will not be called by default. If you still want the new_handler to be called you’ll have to write the code to do so inside your overloaded `operator new`.

## 2. Overloading global new & delete

* The overloaded `new` takes an argument of `size_t`,
	- and return a `void*`.
The `operator delete` takes an argument of `void*`, 
	- and returns a `void`.
	
下面给个没有啥实际意义的例子，主要是演示怎么写：
	
<pre class="prettyprint linenums">
#include &lt;cstdio&gt;
#include &lt;cstdlib&gt;

void* operator new(size_t sz) {
    printf("operator new: %d Bytes\n", sz);
    
	void* m = malloc(sz);
    if(!m) {
    	puts("out of memory");
	}
    return m;
}

void operator delete(void* m) {
    puts("operator delete");
    free(m);
}
</pre>

若真是因为原来的 `new` 和 `delete` 不能满足需求而重载，得是多复杂的场景、得是有多牛 X 的技术……想象一下大神说：C++ 这个不太好，我自己造一个语言好了……大概就是这样的感觉……

Notice that `printf()` and `puts()` are used rather than `iostream`. This is because when an `iostream` object is created, it calls `new` to allocate memory--it'a deadlock.

## 3. Overloading new & delete for a class

Although you don’t have to explicitly say `static`, when you overload `new` and `delete` for a class, you’re creating `static` member functions.

例子见书上 P620

## 4. Overloading new & delete for arrays

重载 `operator new[]` 和 `operator delete[]`，语法和前面一样，只是 `operator new[]` 的参数 `(size_t size)` 是 size of the entire array。

例子见书上 P624

## 5. Placement new

首先声明一点：placement new 并不是指传 additional parameter 给 new，而是利用 new 可以接受 additional parameter 这个特性来实现 construct an object on memory that's already allocated，i.e. 用 already allocated memory 来 replace new 出来的 memory。
 
new 接收 additional parameter 的语法是：

<pre class="prettyprint linenums">
T::operator new(size_t, ...) {
	...
}

T* pt = new(...) X(1024);
</pre>

有啥新添的参数，在 new object 的时候全部加到 new 的括号里。

关于 placement new，可以参阅：

- [深入探究 C++ 的 new/delete 操作符](http://kelvinh.github.io/blog/2014/04/19/research-on-operator-new-and-delete)
- [What uses are there for “placement new”?](http://stackoverflow.com/questions/222557/what-uses-are-there-for-placement-new)
- [FAQ: What is “placement new” and why would I use it?](http://isocpp.org/wiki/faq/dtors#placement-new)
	- [FAQ: Is there a placement delete?](http://isocpp.org/wiki/faq/dtors#placement-delete)
	
注意销毁 placement new 出来的对象需要显示调用 destructor `pt->T::~T();`，也只有这里会这么用。详情请看书或者看上述的参考链接。
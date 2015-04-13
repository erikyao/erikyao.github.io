---
layout: post
title: "C++: Introduction to Templates"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

The container no longer holds a generic base class called `Object`, but instead it holds an unspecified parameter. When you use a template, the parameter is substituted by the compiler, much like the old macro approach, but cleaner and easier to use.

## 1. Basic template syntax

The `template` keyword tells the compiler that the class definition that follows will manipulate one or more unspecified types. At the time the actual class code is generated from the template, those types must be specified so that the compiler can substitute them.

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

template&lt;class T&gt; // T is the substitution parameter
class Array {
    enum { size = 100 };
    T A[size];
public:
    T& operator[](int index) {
        // omit boundary checking here 
        return A[index];
    }
};

int main() {
    Array&lt;int&gt; ia; // 这个语句的作用我们称为 template instantiation; ia 我们称为 generated class
    Array&lt;float&gt; fa; // Template arguments are not restricted to class types; you can also use built-in types.
    
    for(int i = 0; i < 20; i++) {
        ia[i] = i * i;
        fa[i] = float(i) * 1.414;
    }
    
    for(int j = 0; j < 20; j++)
        cout &lt;&lt; j &lt;&lt; ": " &lt;&lt; ia[j]
             &lt;&lt; ", " &lt;&lt; fa[j] &lt;&lt; endl;
}
</pre>

直观看上去和 generic 还是有点区别的：generic 是一套代码接受多种 class；template 是给每个 class 都生成一套代码。

另外要注意的是 template 可以直接假设 `T` 有某些 member 或者 member function（虽然我觉得没有什么规约一下实在有点不踏实；参见 [C++ templates that accept only certain types](http://stackoverflow.com/questions/874298/c-templates-that-accept-only-certain-types) 的讨论）。比如我可以假设 `T` 有 `foo` member 和 `bar()` member function，我在 template 的实现中就可以直接用 `xxx = foo;` 和 `bar();`，而且不需要像 `this->foo` 或者 `T::bar()` 这样写任何前缀，可以什么都不加地直接用。

## 2. Non-inline function definitions in templates

如果要把函数实现写到 template class 外部，需要注意下额外的语法元素：

<pre class="prettyprint linenums">
template&lt;class T&gt;
class Array {
    enum { size = 100 };
    T A[size];
public:
    T& operator[](int index);
};

template&lt;class T&gt; // 函数实现也要把 template 这一句带上
T& Array&lt;T&gt;::operator[](int index) { // template class 名是 Array&lt;T&gt;
    // omit boundary checking here
    return A[index];
}
</pre>

Any reference to a template’s class name must be accompanied by its template argument list, as in `Array<T>::operator[]`.

## 3. Better put template definition in headers 

Even if you create non-inline function definitions, you’ll usually want to put all declarations and definitions for a template into a header file. This may seem to violate the normal header file rule of “Don’t put in anything that allocates storage,” (which prevents multiple definition errors at link time), but template definitions are special. Anything preceded by `template<...>` means the compiler won’t allocate storage for it at that point, but will instead wait until it’s told to (by a template instantiation). So you’ll almost always put the entire template declaration and definition in the header file, for ease of use.

There are times when you may need to place the template definitions in a separate cpp file to satisfy special needs (for example, forcing template instantiations to exist in only a single Windows dll file). Most compilers have some mechanism to allow this; you’ll have to investigate your particular compiler’s documentation to use it.

## 4. Non-type template parameters

除了类型参数以外，template 还可以有其他的参数。The values of these arguments then become compile-time constants for that particular instantiation of the template. 比如：

<pre class="prettyprint linenums">
template&lt;class T, int size = 100&gt;
class Array {
    T array[size];
public:
    T& operator[](int index) {
        // omit boundary checking here
        return array[index];
    }
    int length() const {
        return size;
    }
};
</pre>

1. 不管是 type parameter 还是 non-type parameter，都可以有 default value，也可以都没有 default value
1. A non-type template-parameter shall be one of the following (optionally cv-qualified) types:
	- integral or enumeration type,
	- pointer to object or pointer to function,
	- lvalue reference to object or lvalue reference to function,
	- pointer to member,
	- std::nullptr_t.
1. const 和 volatile 合称 cv-qualifier；cv-qualified 的意思是 either const or volatile, or both

## 5. Function templates

换汤不换药，function templates create new functions based on type parameters. 比如：

<pre class="prettyprint linenums">
template&lt;class T&gt;
void drawAll(T start, T end) { // assume T is an iterator 
	while(start != end) {
		(*start)->draw();
		start++;
	}
}
</pre>

The function template `drawAll()` can be thought of as an **(generic) algorithm**, and this is what most of the function templates in the Standard C++ Library are called.
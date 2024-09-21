---
category: C++
description: ''
tags:
- template
title: 'C++: Introduction to Templates'
toc: true
toc_sticky: true
---

整理自：_Thinking in C++, Volume 1 & Volume 2_

-----

The container no longer holds a generic base class called `Object`, but instead it holds an unspecified parameter. When you use a template, the parameter is substituted by the compiler, much like the old macro approach, but cleaner and easier to use.

## 1. Basic template syntax

The `template` keyword tells the compiler that the class definition that follows will manipulate one or more unspecified types. At the time the actual class code is generated from the template, those types must be specified so that the compiler can substitute them.

```cpp
#include <iostream>
using namespace std;

template<class T> // T is the substitution parameter
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
    Array<int> ia; // 这个语句的作用我们称为 template instantiation; ia 我们称为 generated class
    Array<float> fa; // Template arguments are not restricted to class types; you can also use built-in types.
    
    for(int i = 0; i < 20; i++) {
        ia[i] = i * i;
        fa[i] = float(i) * 1.414;
    }
    
    for(int j = 0; j < 20; j++)
        cout << j << ": " << ia[j]
             << ", " << fa[j] << endl;
}
```

直观看上去和 generic 还是有点区别的：generic 是一套代码接受多种 class；template 是给每个 class 都生成一套代码。

另外要注意的是 template 可以直接假设 `T` 有某些 member 或者 member function（虽然我觉得没有什么规约一下实在有点不踏实；参见 [C++ templates that accept only certain types](http://stackoverflow.com/questions/874298/c-templates-that-accept-only-certain-types) 的讨论）。比如我可以假设 `T` 有 `operator<`，我在 template 的实现中就可以直接写 `t1 < t2`，如果某个具体 `T` 没有 `operator<`，运行时是会报错的，但是在编译 template 的时候并不会报错。

_~~~~~~~~~~ 2015-05-16 补充；来自 C++ Primer, 5th Edition ~~~~~~~~~~_

Under C++11, we can make a template type parameter a `friend`:

```cpp
template <typename Type> class Bar {
	friend Type; // grants access to the type used to instantiate Bar
	...
};
```

_~~~~~~~~~~ 2015-05-16 补充完毕 ~~~~~~~~~~_

## 2. Non-inline function definitions in templates

如果要把函数实现写到 template class 外部，需要注意下额外的语法元素：

```cpp
template<class T>
class Array {
    enum { size = 100 };
    T A[size];
public:
    T& operator[](int index);
};

template<class T> // 函数实现也要把 template 这一句带上
T& Array<T>::operator[](int index) { // template class 名是 Array<T>
    // omit boundary checking here
    return A[index];
}
```

Any reference to a template’s class name must be accompanied by its template argument list, as in `Array<T>::operator[]`.

## 3. Better put template definition in headers 

Even if you create non-inline function definitions, you’ll usually want to put all declarations and definitions for a template into a header file. This may seem to violate the normal header file rule of “Don’t put in anything that allocates storage,” (which prevents multiple definition errors at link time), but template definitions are special. Anything preceded by `template<...>` means the compiler won’t allocate storage for it at that point, but will instead wait until it’s told to (by a template instantiation). So you’ll almost always put the entire template declaration and definition in the header file, for ease of use.

There are times when you may need to place the template definitions in a separate `.cpp` file to satisfy special needs (for example, forcing template instantiations to exist in only a single Windows dll file). Most compilers have some mechanism to allow this; you’ll have to investigate your particular compiler’s documentation to use it.

## 4. Non-type template parameters

除了类型参数以外，template 还可以有其他的参数，比如：

```cpp
template<class T, int size = 100>
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
```

1. 不管是 type parameter 还是 non-type parameter，都可以有 default value，也可以都没有 default value。
	- 但是 You can provide default arguments only for class templates, but not function templates.
	- Once you introduce a default argument, all the subsequent template parameters must also have defaults.
1. You must provide a compile-time constant value for the non-type parameter. 比如上面的 `size`，你写 `int i = 100; Stack<MyType, i> stack;` 是不行的，因为 `i` 是变量；如果是 `const int i = 100;` 就可以。
1. 可以只有 non-type parameter 而没有 type parameter，比如 `std::bitset` 就是如此。
1. A non-type template-parameter shall be one of the following (optionally **cv-qualified**) types:
	- integral or enumeration type,
	- pointer to object or pointer to function,
	- _lvalue_ reference to object or _lvalue_ reference to function,
	- pointer to member,
	- `std::nullptr_t`.
1. `const` 和 `volatile` 合称 **cv-qualifier**
    - cv-qualified 的意思是 either const or volatile, or both

## 5. Function templates

换汤不换药，function templates create new functions based on type parameters. 比如：

```cpp
template<class T>
void drawAll(T start, T end) { // assume T is an iterator 
	while(start != end) {
		(*start)->draw();
		start++;
	}
}
```

The function template `drawAll()` can be thought of as an **(generic) algorithm**, and this is what most of the function templates in the Standard C++ Library are called.

Although you cannot use default template arguments in function templates, you can use template parameters as default arguments to normal functions: 

```cpp
#include <iostream>
using namespace std;

template<class T> 
T accumulate(T begin, T end, T init = T()) {
    while(begin != end)
        init += begin++;
    return init;
}
int main() {
    cout << accumulate(1, 10) << endl; // output: 45
	cout << accumulate<int>(1, 10) << endl; // 其实这才是标准写法，上面是省略写法
	// 这种根据 function 参数推断 type parameter 的做法我们称为 deduction
}
```

注意有 `int() == 0`；然后 type parameter 是可以做 returnType 的。

### Function template overloading

```cpp
#include <cstring>
#include <iostream>
using std::strcmp;
using std::cout;
using std::endl;

template<typename T> const T& min(const T& a, const T& b) {
    return (a < b) ? a : b;
}

const char* min(const char* a, const char* b) {
    return (strcmp(a, b) < 0) ? a : b;
}

double min(double x, double y) {
    return (x < y) ? x : y;
}

int main() {
    const char *s2 = "say \"Ni-!\"", *s1 = "knights who";
    cout << min(1, 2) << endl; 		// 1: 1 (template)
    cout << min(1.0, 2.0) << endl; 	// 2: 1 (double)
    cout << min(1, 2.0) << endl; 	// 3: 1 (double)
    cout << min(s1, s2) << endl; 	// 4: knights who (const char*)
    cout << min<>(s1, s2) << endl; 	// 5: say "Ni-!" (template)
}
```

注意最后第 5 句我们强制使用了 template，但是我们的参数类型是 `char *`，所以并不是比较的字符串，而是比较的地址，所以可能与 4 的结果不一致。

另外我们没有直接用 `using namespace std;` 是为了避免引入 `std::min()` 来影响这个例子。

## 6. Template template parameters

注意下语法就好：

```cpp
template<class T>
class Array { ... }

// 这里 U 并不用得上，所以可以省略
// 而且要注意，即使你写了 U，U 也不是 Container 的参数
template<class T, template<class /* U */> class Seq>
class Container { 
	Seq<T> seq;
	...
}

int main() {
	Container<int, Array> container;
}

///// ~~~~~ //////

template<class T, int N>
class Array { ... }

// 这里参数 int M 其实不是必须的，完全是为了演示方便而设置的
template<class T, int N, template<class, int> class Seq>
class Container {
	Seq<T, N> seq;
	...
}

int main() {
	Container<int, 10, Array> container;
}

///// ~~~~~ //////

template<class T, int N = 10> // A default argument
class Array { ... }

template<class T, template<class, int = 10> class Seq>
class Container {
	Seq<T> seq; // Default used
}

int main() {
	Container<int, Array> container;
}
```

## 7. Member Templates

注意语法：

```cpp
template<class T> class Outer {
public:
    template<class R> class Inner {
    public:
        void f();
    };
};

template<class T> template<class R>
void Outer<T>::Inner<R>::f() {
    cout << "Outer == " << typeid(T).name() << endl;
    cout << "Inner == " << typeid(R).name() << endl;
    cout << "Full Inner == " << typeid(*this).name() << endl;
}

int main() {
    Outer<int>::Inner<bool> inner;
    inner.f();
}

// output: 
/*
	Outer == int
	Inner == bool
	Full Inner == Outer<int>::Inner<bool>
*/
```
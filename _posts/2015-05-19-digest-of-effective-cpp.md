---
layout: post
title: "Digest of <i>Effective C++</i>"
description: ""
category: C++
tags: [Cpp-101, Book]
---
{% include JB/setup %}

## 目录

- [Chapter 1. Accustoming Yourself to C++](#chapter-1-accustoming-yourself-to-c)
	- [Item 1: View C++ as a federation of languages.](#item-1-view-c-as-a-federation-of-languages)
	- Item 2: Prefer `const`s, `enum`s, and `inline`s to `#define`s.
	- [Item 3: Use `const` whenever possible.](#item-3-use-const-whenever-possible)
		- [Avoiding Duplication in const and Non-const Member Functions](#avoiding-duplication-in-const-and-non-const-member-functions)
	- [Item 4: Make sure that objects are initialized before they’re used.](#item-4-make-sure-that-objects-are-initialized-before-they-are-used)
		- [Static Initialization Order Fiasco](#static-initialization-order-fiasco)
- [Chapter 2: Constructors, Destructors, and Assignment Operators](#chapter-2-constructors-destructors-and-assignment-operators)
	- Item 5: Know what functions C++ silently writes and calls.
	- Item 6: Explicitly disallow the use of compiler-generated functions you do not want.
	- [Item 7: Declare destructors virtual in polymorphic base classes.](#item-7-declare-destructors-virtual-in-polymorphic-base-classes)
	- [Item 8: Prevent exceptions from leaving destructors.](#item-8-prevent-exceptions-from-leaving-destructors)
	- Item 9: Never call virtual functions during construction or destruction.
	- Item 10: Have assignment operators return a reference to `*this`.
	- Item 11: Handle assignment to self in `operator=`.
	- [Item 12: Copy all parts of an object.](#item-12-copy-all-parts-of-an-object)
- [Chapter 3: Resource Management](#chapter-3-resource-management)
	- Item 13: Use objects to manage resources.
	- Item 14: Think carefully about copying behavior in resource-managing classes.
	- Item 15: Provide access to raw resources in resource-managing classes.
	- Item 16: Use the same form in corresponding uses of new and delete.
	- [Item 17: Store `new`ed objects in smart pointers in standalone statements.](#item-17-store-newed-objects-in-smart-pointers-in-standalone-statements)
- [Chapter 4: Designs and Declarations](#chapter-4-designs-and-declarations)
	- Item 18: Make interfaces easy to use correctly and hard to use incorrectly.
	- Item 19: Treat class design as type design.
	- [Item 20: Prefer pass-by-reference-to-const to pass-by-value.](#item-20-prefer-pass-by-reference-to-const-to-pass-by-value)
	- Item 21: Don’t try to return a reference when you must return an object.
	- Item 22: Declare data members private.
	- [Item 23: Prefer non-member non-friend functions to member functions.](#item-23-prefer-non-member-non-friend-functions-to-member-functions)
	- [Item 24: Declare non-member functions when type conversions should apply to all parameters.](#item-24-declare-non-member-functions-when-type-conversions-should-apply-to-all-parameters)
	- [Item 25: Consider support for a non-throwing swap.](#item-25-consider-support-for-a-non-throwing-swap)
- [Chapter 5: Implementations](#chapter-5-implementations)
	- Item 26: Postpone variable definitions as long as possible.
	- Item 27: Minimize casting.
	- Item 28: Avoid returning “handles” (references, pointers or iterators) to object internals. (Use const at least.)
	- [Item 29: Strive for exception-safe code.](#item-29-strive-for-exception-safe-code)
	- Item 30: Understand the ins and outs of inlining.
	- [Item 31: Minimize compilation dependencies between files. (Use pImpl pattern and forward declarations.)](#item-31-minimize-compilation-dependencies-between-files)
		- [基本的 class 文件结构](#class-file-structure)
		- [forward declaration 是减少 compilation dependency 的有效手段](#forward-declaration-lower-compilation-dependency)
		- [使用 forward declaration 的条件](#requirement-of-forward-declaration)
		- [pImpl 是满足 forward declaration 条件的有效手段](#pimpl-makes-forward-declaration)
		- [pImpl 的结构](#pimpl-structure)
- [Chapter 6: Inheritance and Object-Oriented Design](#chapter-6-inheritance-and-object-oriented-design)
	- Item 32: Make sure public inheritance models “is-a.”
	- Item 33: Avoid hiding inherited names.
	- Item 34: Differentiate between inheritance of interface and inheritance of implementation.
	- Item 35: Consider alternatives to virtual functions.
	- Item 36: Never redefine an inherited non-virtual function.
	- [Item 37: Never redefine a function’s inherited default parameter value.](#item-37-never-redefine-a-functions-inherited-default-parameter-value)
	- Item 38: Model “has-a” or “is-implemented-in-terms-of” through composition.
	- Item 39: Use private inheritance judiciously.
	- Item 40: Use multiple inheritance judiciously.
- [Chapter 7: Templates and Generic Programming](#chapter-7-templates-and-generic-programming)
	- Item 41: Understand implicit interfaces and compile-time polymorphism.
	- Item 42: Understand the two meanings of typename.
	- [Item 43: Know how to access names in templatized base classes.](#item-43-know-how-to-access-names-in-templatized-base-classes)
	- [Item 44: Factor parameter-independent code out of templates.](#item-44-factor-parameter-independent-code-out-of-templates)
	- [Item 45: Use member function templates to accept “all compatible types.”](#item-45-use-member-function-templates-to-accept-all-compatible-types)
	- [Item 46: Define non-member functions inside templates when type conversions are desired. (template version of Item 24)](#item-46-define-non-member-functions-inside-templates-when-type-conversions-are-desired)
	- Item 47: Use traits classes for information about types.
	- [Item 48: Be aware of template metaprogramming.](#item-48-be-aware-of-template-metaprogramming)
- [Chapter 8: Customizing new and delete](#chapter-8-customizing-new-and-delete)
	- [Item 49: Understand the behavior of the new-handler.](#item-49-understand-the-behavior-of-the-new-handler)
	  - [Digress: new (std::nothrow) Xxx](#digress-new-stdnothrow-xxx)
	- Item 50: Understand when it makes sense to replace new and delete.
	- Item 51: Adhere to convention when writing new and delete.
	- [Item 52: Write placement delete if you write placement new.](#item-52-write-placement-delete-if-you-write-placement-new)
- Chapter 9: Miscellany
	- Item 53: Pay attention to compiler warnings.
	- Item 54: Familiarize yourself with the standard library, including TR1.
	- Item 55: Familiarize yourself with Boost.
	
-----

## <a name="chapter-1-accustoming-yourself-to-c"></a>Chapter 1. Accustoming Yourself to C++

### <a name="item-1-view-c-as-a-federation-of-languages"></a>Item 1: View C++ as a federation of languages.

To make sense of C++, you have to recognize its primary sublanguages. Fortunately, there are only four:

- C
- Object-Oriented C++
- Template C++
- The STL

这个观点很重要，因为后续你会发现有很多 feature 是不相通的，比如 Object-Oriented C++ 里的规律就不一定适用于 template，在使用的时候不要想当然，这是这条 Item 最重要的教义。

<!--
### Item 2: Prefer consts, enums, and inlines to #defines.
-->

### <a name="item-3-use-const-whenever-possible"></a>Item 3: Use const whenever possible.

Compilers enforce bitwise constness, but you should program using logical constness.

#### <a name="avoiding-duplication-in-const-and-non-const-member-functions"></a>Avoiding Duplication in const and Non-const Member Functions

When const and non-const member functions have essentially identical implementations, code duplication can be avoided by having the non-const version call the const version.

- 先用 `static_cast` 把 `*this` 转成 const，然后调用 const 方法，再把返回值用 `const_cast` 去掉 const，最后返回这个 non-const 值

### <a name="item-4-make-sure-that-objects-are-initialized-before-they-are-used"></a>Item 4: Make sure that objects are initialized before they’re used.

- 对 non-built-in type 的 member 而言：
	- 在 constructor 内 `this->id = id;` 是 assignment 并不是 initialization，是要调用 `operator=` 的
	- member initialization list `: id(id)` 是调用 member 的 copy-constructor，更有效率
- 对 built-in type 的 member 而言，这两种方式没有性能上的区别
- 虽然 member 会被默认初始化，但是可以显式地写一下，比如 `: id(), name() { ... }`
	- 这么做的一个好处是不依赖默认机制
	
#### <a name="static-initialization-order-fiasco"></a>Static Initialization Order Fiasco

- fiasco: [fiˈæskəʊ], a complete failure

问题的根源在于：你不能指望 static member 的 initialization 的一定会发生在你调用它之前。举个例子：

```cpp
/***** FileSystem.h *****/
class FileSystem { 
public:
	static string root;
	...
};

/***** FileSystem.cpp *****/
string FileSystem::root("/");

/***** Directory.h *****/
class Directory { ... };

/***** Directory.cpp *****/
Directory::Directory(string path) {
	// use FileSystem::root 
}
```

你在构造 `Directory` 的时候是无法保证 `FileSystem::root` 是已经初始化了的。一个解决方案就是：replacing a non-local static object with a local static objects returned by a function (这个 function 不一定要求是 static). 我们改造下上面的例子：

```cpp
/***** FileSystem.h *****/
class FileSystem { 
public:
	static string root();
	...
};

/***** FileSystem.cpp *****/
string FileSystem::root() {
	static string root("/");
	return root;
}

/***** Directory.h *****/
class Directory { ... };

/***** Directory.cpp *****/
Directory::Directory(string path) {
	// use FileSystem::root() 
}
```

这样就解决了 static initialization order fiasco 的问题。

-----

## <a name="chapter-2-constructors-destructors-and-assignment-operators"></a>Chapter 2: Constructors, Destructors, and Assignment Operators

<!--
### Item 5: Know what functions C++ silently writes and calls.

### Item 6: Explicitly disallow the use of compiler-generated functions you do not want.
-->

### <a name="item-7-declare-destructors-virtual-in-polymorphic-base-classes"></a>Item 7: Declare destructors virtual in polymorphic base classes.

string and all the STL containers have no virtual destructors, so don't ever extend these classes.

### <a name="item-8-prevent-exceptions-from-leaving-destructors"></a>Item 8: Prevent exceptions from leaving destructors. 

如果 destructor 中的操作会抛异常的话，只能有两种处理方法：

- `std::abort()` 终止程序
- swallow the exceptions

但是这其实是一个设计问题：If an operation may fail by throwing an exception and there may be a need to handle that exception, the exception has to come from some non-destructor function. 换言之，你应该把这个会抛异常的操作设计成用户接口，让用户自己去买单。

书上举的一个例子是：`~DBConn()` 里调用 `this->close()` 可能会抛异常。那我就把 `DBConn.close()` 设计成 API ，你用户自己去调用好了，异常问题你们自行解决。

<!--
### Item 9: Never call virtual functions during construction or destruction. 

### Item 10: Have assignment operators return a reference to `*this`. 

### Item 11: Handle assignment to self in `operator=`. 
-->

### <a name="item-12-copy-all-parts-of-an-object"></a>Item 12: Copy all parts of an object.

尤其要注意子类的 copy-constructor 和 `operator=` 要显式调用父类的版本。

-----
  
## <a name="chapter-3-resource-management"></a>Chapter 3: Resource Management 

<!--
### Item 13: Use objects to manage resources. 

### Item 14: Think carefully about copying behavior in resource-managing classes. 

### Item 15: Provide access to raw resources in resource-managing classes. 

### Item 16: Use the same form in corresponding uses of new and delete.
--> 

### <a name="item-17-store-newed-objects-in-smart-pointers-in-standalone-statements"></a>Item 17: Store `new`ed objects in smart pointers in standalone statements. 

尤其是在 evaluate function 参数时，可能你的 smart pointer 是一个大的 temporary，当你 new 了底层资源之后，由于 evaluate 的顺序不定，可能在 new 之后、构造 smart pointer 之前这段时间内去 evaluate 其他的参数了，如果这时候 exception 了，那就欲哭无泪了……

用例子来说明下：

```cpp
processWidget(std::tr1::shared_ptr<Widget>(new Widget), priority());

// a possible evaluation order:
	// 1. Execute “new Widget”.
	// 2. Call priority().	
	// 3. Call the tr1::shared_ptr constructor.
// memory leak if priority() throws an exception
```

改进的写法：

```cpp
std::tr1::shared_ptr<Widget> pw(new Widget);
processWidget(pw, priority()); 
```
 
-----

## <a name="chapter-4-designs-and-declarations"></a>Chapter 4: Designs and Declarations 

<!--
### Item 18: Make interfaces easy to use correctly and hard to use incorrectly. 

### Item 19: Treat class design as type design. 
-->

### <a name="item-20-prefer-pass-by-reference-to-const-to-pass-by-value"></a>Item 20: Prefer pass-by-reference-to-const to pass-by-value. 

The rule doesn’t apply to: 

- built-in types 
- STL iterator
- function object types

For them, pass-by-value is usually appropriate: 

- it’s often more efficient to pass built-in types by value than by reference.
- by convention, STL iterator and function object types are designed to be passed by value.

Even when small objects have inexpensive copy constructors, there can be performance issues. Some compilers treat built-in and user-defined types differently, even if they have the same underlying representation. For example, some compilers refuse to put objects consisting of only a `double` into a register, even though they happily place naked `double`s there on a regular basis. When that kind of thing happens, you can be better off passing such objects by reference, because compilers will certainly put pointers (the implementation of references) into registers.

<!--
### Item 21: Don’t try to return a reference when you must return an object. 

### Item 22: Declare data members private.
--> 

### <a name="item-23-prefer-non-member-non-friend-functions-to-member-functions"></a>Item 23: Prefer non-member non-friend functions to member functions. 

并不是说不要 member function，作者的意思是 "不要把 utility method (书上的用词是 convenience function) 设计为 class member"。我们 java 一般是用一个 util 类，C++ 就直接设计成一个 non-member non-friend function 就好了。

书上的例子：

```cpp
class WebBrowser {
public:
	...
	void clearCache();
	void clearHistory();
	void removeCookies();
	...
	void clearEverything(); // calls clearCache, clearHistory, and removeCookies
							// BETTER NOT a member function
};
```

`WebBrowser.clearEverything()` 不如写成：

```cpp
void clearBrowser(WebBrowser& wb) {
	wb.clearCache();
	wb.clearHistory();
	wb.removeCookies();
}
```

这么做有几个好处：

- encapsulation (作者认为 member function 越多，封装程度越低；书上有长篇论述)
- packaging flexibility (见下面例子)
- functional extensibility (见下面例子)

进一步来讲，C++ 惯用的结构应该是把 class 和 util 放到一个 namespace 里：

```cpp
namespace WebBrowserStuff {
	class WebBrowser { ... };
	void clearBrowser(WebBrowser& wb);
	...
}
```

如果你有多个 util，最好是分成不同的文件，但还是统一在一个 namespace 里：

```cpp
// header “webbrowser.h”
namespace WebBrowserStuff {
	class WebBrowser { ... };
	... // “core” related functionality
}

// header “webbrowserbookmarks.h”
namespace WebBrowserStuff {
	... // bookmark-related convenience functions
} 

// header “webbrowsercookies.h”
namespace WebBrowserStuff {
	... // cookie-related convenience functions
} 
```

### <a name="item-24-declare-non-member-functions-when-type-conversions-should-apply-to-all-parameters"></a>Item 24: Declare non-member functions when type conversions should apply to all parameters. 

我觉得这个 item 对 operator 更有说服力。

书上的例子：

```cpp
class Rational {
public:
	Rational(int numerator = 0, int denominator = 1); // ctor is deliberately not explicit;
	int numerator() const;		// accessor for numerator
	int denominator() const;	// accessor for denominator
	const Rational operator*(const Rational& rhs) const; // BETTER NOT a member function
private:
	...
};

Rational oneHalf(1, 2);
Rational result;

result = oneHalf * 2; // OK
result = 2 * oneHalf; // ERROR!
```

因为 `operator*` 是 member function，所以 lhs (left-hand side) 必须是 Rational 对象，所以 lhs 2 就无法做 conversion。写成 non-member function 就可以解决这个问题（不一定要是 friend，因为你有 getter/setter 可以用）：

```cpp
const Rational operator*(const Rational& lhs, const Rational& rhs) {
	return Rational(lhs.numerator() * rhs.numerator(), lhs.denominator() * rhs.denominator());
}
```

### <a name="item-25-consider-support-for-a-non-throwing-swap"></a>Item 25: Consider support for a non-throwing swap. 

First, if the default implementation of swap offers acceptable efficiency for your class or class template, you don’t need to do anything. Anybody trying to swap objects of your type will get the default version, and that will work fine.

Second, if the default implementation of swap isn’t efficient enough (which almost always means that your class or template is using some variation of the pimpl idiom) (pimpl: pointer to impl, 指 `Foo` 类包含一个 `FooImpl*` 这样的实现方式), do the following:

1. Offer a public swap member function that efficiently swaps the value of two objects of your type. This member function should never throw an exception.
2. Offer a non-member swap in the same namespace as your class or template. Have it call your swap member function.
3. If you’re writing a class (not a class template), specialize `std::swap` for your class. Have it also call your swap member function.

-----

## <a name="chapter-5-implementations"></a>Chapter 5: Implementations 

<!--
### Item 26: Postpone variable definitions as long as possible. 

### Item 27: Minimize casting. 

### Item 28: Avoid returning “handles” (references, pointers or iterators) to object internals. (Use const at least.) 
-->

### <a name="item-29-strive-for-exception-safe-code"></a>Item 29: Strive for exception-safe code. 

When an exception is thrown, exception-safe functions:

- Leak NO resources. (Use RAII to achieve.)
- Do NOT allow data structures to become corrupted. 
	- Functions offering the **basic guarantee** promise that if an exception is thrown, everything in the program remains in a valid state.
		- However, the exact state of the program may not be predictable.
	- Functions offering the **strong guarantee** promise that if an exception is thrown, the state of the program is unchanged.
		- After calling a function offering the strong guarantee, there are only two possible program states: 
			- as expected following successful execution of the function, 
			- or the state that existed at the time the function was called.
	- Functions offering the **nothrow guarantee** promise never to throw exceptions. 
		- All operations on built-in types (e.g., ints, pointers, etc.) are nothrow.
		- Functions with an empty exception specification do not guarantee nothrow.
	- Exception-safe code must offer one of the three guarantees above. If it doesn’t, it’s not exception-safe.
	
There is a general design strategy that typically leads to the strong guarantee, and it’s important to be familiar with it. The strategy is known as “copy and swap.” In principle, it’s very simple. Make a copy of the object you want to modify, then make all needed changes to the copy. If any of the modifying operations throws an exception, the original object remains unchanged. After all the changes have been successfully completed, swap the modified object with the original in a non-throwing operation.

<!--
### Item 30: Understand the ins and outs of inlining. 
-->

### <a name="item-31-minimize-compilation-dependencies-between-files"></a>Item 31: Minimize compilation dependencies between files. (Use pImpl pattern and forward declarations.) 

[31-1]: http://www.learncpp.com/cpp-tutorial/89-class-code-and-header-files/ (LearnCpp: 8.9 — Class code and header files)
[31-2]: http://www.gotw.ca/publications/mill04.htm (Pimpls - Beauty Marks You Can Depend On)
[31-3]: http://stackoverflow.com/a/553869 (When can I use a forward declaration?)
[31-4]: http://en.wikibooks.org/wiki/C%2B%2B_Programming/Idioms#Pointer_To_Implementation_.28pImpl.29 (C++ Programming/Idioms: 1.2 Pointer To Implementation (pImpl))
[31-5]: https://msdn.microsoft.com/en-us/library/hh438477.aspx (MSDN: Pimpl For Compile-Time Encapsulation (Modern C++))

#### <a name="class-file-structure"></a>基本的 class 文件结构

按 [LearnCpp: 8.9 — Class code and header files][31-1] 的示例，即使是一般的 class，我们也可以分成 .h 和 .cpp 文件：

- member，function declaration 和 inline function (比如 getter/setter) 写在 .h
- 其余的 function definition 写在 .cpp
- template 不在这里的讨论范围之内

#### <a name="forward-declaration-lower-compilation-dependency"></a>forward declaration 是减少 compilation dependency 的有效手段

何为 compilation dependency ？简单说，你 `#include` 进来的都是 compilation dependencies。比如你 `#include <string>`，那么你就依赖 string。如果 string 类发生了变化，我们在重编译时，不仅 string 类要重编译，所有 `#include <string>` 的类都要重编译，这是我们不想看到的。

要减少 compilation dependency，那就是要减少 `#include`。我们的基本原则就是：用 forward declaration 代替 `#include`。

那哪些类适合用 forward declaration 呢？简单说就是：如果 `Bar` 类改写的频率比较高，那么所有使用 `Bar` 类的类应该 forward declare `Bar`:

- 因为 standard library 是稳定的，所以一般不用 forward declaration 系统库的类
	- 有些系统库的类还比较复杂，比如 string 其实是一个 template 再 typedef，所以你写 `class string;` 还并不能做到 forward declaration
	- 对 iostream 倒是可以用 `#include <iosfwd>` 来代替 `#include <iostream>`（参 [Pimpls - Beauty Marks You Can Depend On][31-2]）
- 我们自己写的类，其潜在的修改频率比较高，所以对这些类的依赖可以用 forward declaration

#### <a name="requirement-of-forward-declaration"></a>使用 forward declaration 的条件

根据 [When can I use a forward declaration?][31-3] 的说法：

> Put yourself in the compiler's position: when you forward declare a type, all the compiler knows is that this type exists; it knows nothing about its size, members, or methods. This is why it's called an _incomplete_ type. Therefore, you cannot use the type to declare a member, or a base class, since the compiler would need to know the layout of the type.

假设我们在 class `Foo` 里写了一个 forward-declaration `class X;`，则：

- What you CAN do with the incomplete type `X`:
	- Declare a member of `X*` or `X&` in `Foo`
	- Declare functions which accept/return `X` in `Foo`
		- 注意是 declare 不是 define
	- Define functions which accept/return `X*` or `X&` but without using `X*`'s or `X&`'s members
- What you CANNOT do with the incomplete type `X`:
	- Use `X` as a base class
	- Declare a member of `X` in `Foo`
	- Define functions which accept/return `X` in `Foo`
	- Use its methods or fields, in fact trying to dereference a variable with incomplete type
	
#### <a name="pimpl-makes-forward-declaration"></a>pImpl 是满足 forward declaration 条件的有效手段

最显著的作用是：使用 pImpl 后，`Foo` 中没有 member of `X`。

The key to this separation is replacement of dependencies on definitions with dependencies on declarations.

而隐藏 function definition 来满足 forward declaration 的条件并不算是 pImpl 的功劳，因为你把 class 分成 .h 和 .cpp 一样可以做到这点。

#### <a name="pimpl-structure"></a>pImpl 的结构

以 `Foo` 和 `FooImpl` 为例，目前看到了有三种结构：

- (1) `FooImpl` 作为一个独立的 class（书上有写）
	- 一般要有 Foo.h、Foo.cpp、FooImpl.cpp 三个文件
- (2) 把 `Foo` 设计成 interface class，`class FooImpl : public Foo`，然后在 `Foo` 里提供一个 factory 方法返回 `FooImpl` 对象（书上有写）
- (3) 把 `FooImpl` 设计成 `Foo` 的内部类
	- `Foo::FooImpl` 直接写到 Foo.cpp 文件里

对结构 (1) 和 (3)，`Foo` 里可以使用 `FooImpl*` 或是用 `unique_ptr<FooImpl>`。

结合 [C++ Programming/Idioms: 1.2 Pointer To Implementation (pImpl)][31-4] 和 [MSDN: Pimpl For Compile-Time Encapsulation (Modern C++)][31-5] 以及书上的例子，我们举个大一点的例子：

```cpp
/***** Title.h *****/
#ifndef TITLE_H
#define TITLE_H

#include <string>

class Title {
private:
	std::string val;
public:
	Title(std::string val) : val(val) {
		
	} 
	const std::string& getVal() const {
		return val;
	}
};

#endif

/***** Content.h *****/
#ifndef CONTENT_H
#define CONTENT_H

#include <string>

class Content {
private:
	std::string val;
public:
	Content(std::string val) : val(val) {
		
	} 
	const std::string& getVal() const {
		return val;
	}
};

#endif
```

```cpp
/***** Book.h *****/
#ifndef BOOK_H
#define BOOK_H

#include <memory>

class Title;	// forward-declaration
class Content;	// forward-declaration
 
class Book { 
public:
	Book(Title t, Content c);
	~Book();	// this is necessary
	void print();
private:
	class BookImpl;
	std::unique_ptr<BookImpl> pimpl;
};

#endif
```

```cpp
/***** Book.cpp *****/
#include "Book.h"
#include "Title.h"
#include "Content.h"
#include <iostream>
using namespace std;

class Book::BookImpl {
private:
	Title t;
	Content c;
public:
	BookImpl(Title t, Content c) : t(t), c(c) {
		
	}
	void print();
};

void Book::BookImpl::print() {
	cout << "Title: " << t.getVal() << endl;
	cout << "Content: " << c.getVal() << endl;
}

Book::Book(Title t, Content c) : pimpl(new BookImpl(t, c)) {
	
}

Book::~Book() {
	
}

void Book::print() {
	pimpl->print();
}
```

```cpp
/***** main.cpp *****/
#include "Book.h"
#include "Title.h"
#include "Content.h"

int main() {
	Title t("Effecive C++");
	Content c("A lot...");
	Book b(t, c);
	
	b.print();
	
	// output:
	/*
		Title: Effecive C++
		Content: A lot...
	*/
}
```

注意 `Book::~Book()` 必须要手动写一个，因为 synthesized destructor 会要求 complete declaration of `BookImpl`（参 [std::unique_ptr with an incomplete type won't compile](http://stackoverflow.com/a/9954553)）。

-----

## <a name="chapter-6-inheritance-and-object-oriented-design"></a>Chapter 6: Inheritance and Object-Oriented Design

<!--
### Item 32: Make sure public inheritance models “is-a.” 

### Item 33: Avoid hiding inherited names. 

### Item 34: Differentiate between inheritance of interface and inheritance of implementation. 

### Item 35: Consider alternatives to virtual functions. 

### Item 36: Never redefine an inherited non-virtual function. 
-->

### <a name="item-37-never-redefine-a-functions-inherited-default-parameter-value"></a>Item 37: Never redefine a function’s inherited default parameter value. 

Virtual functions are dynamically bound, but default parameter values are statically bound.

```cpp
#include <iostream>
using namespace std;

class Shape {
public:
	enum ShapeColor { Red, Green, Blue };
	const char* shapeColorNames[3] = { "red", "green", "blue" };
	virtual void draw(ShapeColor color = Red) const = 0;
};

class Rectangle: public Shape {
public:
	virtual void draw(ShapeColor color = Green) const;
};

void Rectangle::draw(ShapeColor color /* = Green */) const {
	cout << "Draw Rectangle in " << shapeColorNames[color] << endl;
}

int main() {
	Shape* ps = new Rectangle();
	ps->draw();
	
	delete ps;
	
	Rectangle* pr = new Rectangle();
	pr->draw();
	
	delete pr;
	
	// output:
	/* 
		Draw Rectangle in red
		Draw Rectangle in green	
	*/
}
```

也就是说，default parameter value 没有多态机制，完全看调用者的类型：你是 `Shape*`，参数就是 `Shape::draw()` 的默认参数；你是 `Rectangle*`，参数就是 `Rectangle::draw()` 的默认参数；reference 同理。

<!--
### Item 38: Model “has-a” or “is-implemented-in-terms-of” through composition. 

### Item 39: Use private inheritance judiciously. 

### Item 40: Use multiple inheritance judiciously. 
-->

-----

## <a name="chapter-7-templates-and-generic-programming"></a>Chapter 7: Templates and Generic Programming 

<!--
### Item 41: Understand implicit interfaces and compile-time polymorphism. 

### Item 42: Understand the two meanings of typename. 
-->

### <a name="item-43-know-how-to-access-names-in-templatized-base-classes"></a>Item 43: Know how to access names in templatized base classes. 

直接上例子：

```cpp
/***** Base template class *****/
template<typename Company> 
class MsgSender {
private:
	Company c;
public:
	... // ctors, dtor, etc.
	
	void sendClear(const MsgInfo& info) {
		// parse info to a std::string msg;

		c.sendCleartext(msg);
	}
	void sendSecret(const MsgInfo& info) { 
		// calls c.sendEncrypted
	}
};

/***** Derived template class *****/
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
public:
	... // ctors, dtor, etc.
	
	void sendClearMsg(const MsgInfo& info) {
		// write some logs
		sendClear(info);	// call base class function;
							// this code will not compile!
	}
	...
};
```

C++ recognizes that base class templates may be specialized and that such specializations may not offer the same interface as the general template. As a result, it generally refuses to look in templatized base classes for inherited names. 

解决方法有三：In derived class templates, refer to names in base class templates 

- via a “this->” prefix, 
- via using declarations, 
- or via an explicit base class qualification.

```cpp
/***** Solution 1 *****/
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
public:
	... // ctors, dtor, etc.
	
	void sendClearMsg(const MsgInfo& info) {
		// write some logs
		this->sendClear(info); // okay, assumes that sendClear will be inherited
	}
	...
};

/***** Solution 2 *****/
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
public:
	... // ctors, dtor, etc.
	
	using MsgSender<Company>::sendClear; // tell compilers to assume that sendClear is in the base class
	
	void sendClearMsg(const MsgInfo& info) {
		// write some logs
		sendClear(info); // okay, assumes that sendClear will be inherited
	}
	...
};

/***** Solution 3 *****/
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
public:
	... // ctors, dtor, etc.
	
	void sendClearMsg(const MsgInfo& info) {
		// write some logs
		MsgSender<Company>::sendClear(info); // okay, assumes that sendClear will be inherited
	}
	...
};
```

### <a name="item-44-factor-parameter-independent-code-out-of-templates"></a>Item 44: Factor parameter-independent code out of templates. 

主要针对 template class 的 member function。

比如我有一个 template class `Foo<typename, size_t>`，然后有一个 member functions `Foo<>.bar(...)`。然后我发现 `bar(...)` 的逻辑和 `size_t` 参数无关，i.e. 不管是 `Foo<T, 5>.bar(...)` 还是 `Foo<T, 37>.bar(...)`，`bar(...)` 的逻辑都是一样的，那我们就不用对 `Foo<T, 5>` 和 `Foo<T, 37>` 都生成一份 `bar(...)` 的代码。

一个可能的方案是：做一个 `FooBase<typename>.bar(....)`，然后组合 `FooBase<typename>` 到 `Foo<typename, size_t>` 或是用 private inheritance。

如果进一步发现 `bar(...)` 的逻辑和 `typename` 参数也无关，那可以直接把它设计成一个 util function。不过参数列表可能会变得复杂，因为此时 `bar(...)` 不在 template class 内部，无法用 `this` 访问到各个 member，可能需要将需要访问的数据类型都标在参数列表里。 

### <a name="item-45-use-member-function-templates-to-accept-all-compatible-types"></a>Item 45: Use member function templates to accept “all compatible types.” 

出发点是想让 template 的 smart pointer 也支持多态：类似 `Base* pb = new Ext;`，我们也想有 `SmartPtr<Base> pt2 = SmartPtr<Ext>(new Ext);`。

实现方法是带 template 的 constructor：

```cpp
template<typename T>
class SmartPtr {
public:
	template<typename U>
	SmartPtr(const SmartPtr<U>& other) : heldPtr(other.get()) { 
		... 
	} 
	
	T* get() const { 
		return heldPtr; 
	}
	...
private: 
	T *heldPtr; 
};
```

我们还是把多态转移到了 `T*` 身上。

这个带 template 的 constructor 我们也称为 generalized copy constructor。同理还有 generalized `operator=`。

需要注意的是：如果仅仅定义了 generalized copy constructor，编译器还是会 synthesize 一个 默认构造器给你。generalized `operator=` 同理。

### <a name="item-46-define-non-member-functions-inside-templates-when-type-conversions-are-desired"></a>Item 46: Define non-member functions inside templates when type conversions are desired. (template version of Item 24)

我们把 [Item 24](#item-24-declare-non-member-functions-when-type-conversions-should-apply-to-all-parameters) 的例子改写成 template 版本：

```cpp
template<typename T>
class Rational {
public:
	Rational(const T& numerator = 0, const T& denominator = 1); 
	const T numerator() const; 
	const T denominator() const;  
	...  
};

template<typename T>
const Rational<T> operator*(const Rational<T>& lhs, const Rational<T>& rhs) { 
	...
}

Rational<int> oneHalf(1, 2);		// this example is from Item 24, except Rational is now a template
Rational<int> result = oneHalf * 2;	// ERROR. won’t compile
```

问题出在 `template<typename T> const Rational<T> operator*` 身上，原因就是因为它是一个 function template 而不是一个具体的 function。You might expect them to use `Rational<int>`’s non-explicit constructor to convert `2` into a `Rational<int>`, thus allowing them to deduce that `T` is `int`, but they don’t do that. They don’t, because implicit type conversion functions are never considered during template argument deduction. 但是如果是一个具体的 function，implicit type conversion 是会被调用的。

一个有点狡猾的 workaround 是：在 `Rational<T>` 内部声明一个 friend `operator*`:

```cpp
friend const Rational<T> 
operator*(const Rational<T>& lhs, const Rational<T>& rhs);
```

这样每次 `Rational<T>` 初始化了，就会声明一个具体的 `operator*`，而这个声明恰好又会被 `template<typename T> const Rational<T> operator*` 给定义出来，所以就成了一个具体的 function，从而就可以使用 implicit type conversion 了。（Item 24 并没有 template argument deduction 的问题，所以用不用 friend 无所谓。）

另外还有一个小地方要注意：Inside a class template, the name of the template can be used as shorthand for the template and its parameters, so inside `Rational<T>`, we can just write `Rational` instead of `Rational<T>`. That saves us only a few characters in this example, but when there are multiple parameters or longer parameter names, it can both save typing and make the resulting code clearer. 所以上面那个 friend `operator*` 的声明可以简写为：

```cpp
friend const Rational 
operator*(const Rational& lhs, const Rational& rhs);
```

<!--
### Item 47: Use traits classes for information about types. 
-->

### <a name="item-48-be-aware-of-template-metaprogramming"></a>Item 48: Be aware of template metaprogramming. 

Things to Remember: 

- Template metaprogramming can shift work from runtime to compile- time, thus enabling earlier error detection and higher runtime performance.
- TMP can be used to generate custom code based on combinations of policy choices, and it can also be used to avoid generating code inappropriate for particular types.

-----

## <a name="chapter-8-customizing-new-and-delete"></a>Chapter 8: Customizing new and delete 

### <a name="item-49-understand-the-behavior-of-the-new-handler"></a>Item 49: Understand the behavior of the new-handler. 

你可以 `set_new_handler` 和 `operator new` 设计成 class 的 member function，这样在 new 这个 class 的 object 时，行为可以自定义：

```cpp
class Widget {
public:
	static std::new_handler set_new_handler(std::new_handler p) throw();
	static void* operator new(std::size_t size) throw(std::bad_alloc);
private:
	static std::new_handler currentHandler;
};
```

具体设实现细节请参考书上。

经过一系列的演化（重构），我们可以把这些 class-specific 的 new 操作封装到一个 template 中，最终可以得到一个 `class Widget: public NewHandlerSupport<Widget>` 的结构，我们称其为 Curiously Recurring Template Pattern (CRTP)。

#### <a name="digress-new-stdnothrow-xxx"></a>Digress: new (std::nothrow) Xxx

[std::nothrow](http://www.cplusplus.com/reference/new/nothrow) 有云：

> In C++, the `operator new` function can be overloaded to take more than one parameter: The first parameter passed to the `operator new` function is always the size of the storage to be allocated, but additional arguments can be passed to this function by enclosing them in parentheses in the new-expression.

简单说就是：`new (x) int;` 等同于 `operator new(sizeof(int),x);`。而 `std::nothrow` 就是这里的一个 x，它本质上是个 constant，to indicate that `operator new` and `operator new[]` shall not throw an exception on failure, but return a null pointer instead.

凡是这种带 additional parameter 的 new 都可以称为 placement new，理解成 overloaded new 就好。

<!--
### Item 50: Understand when it makes sense to replace new and delete. 

### Item 51: Adhere to convention when writing new and delete. 
-->

### <a name="item-52-write-placement-delete-if-you-write-placement-new"></a>Item 52: Write placement delete if you write placement new. 

placement new 和 placement delete 的签名要配套，因为如果 placement new 在调用构造器时出异常，就必须调用配套的 placement delete。

Placement delete is called only if an exception arises from a constructor call that’s coupled to a call to a placement new. Applying delete to a pointer never yields a call to a placement version of delete.

C++ offers the following forms of `operator new` at global scope:

```cpp
void* operator new(std::size_t) throw(std::bad_alloc);			// normal new
void* operator new(std::size_t, void*) throw();					// placement new
void* operator new(std::size_t, const std::nothrow_t&) throw();	// nothrow new 
```

在 overload 的时候要注意屏蔽作用。

最后给个简单的例子：

```cpp
class StandardNewDeleteForms {
public:
	// normal new/delete
	static void* operator new(std::size_t size) throw(std::bad_alloc)
	{ return ::operator new(size); }
	static void operator delete(void *pMemory) throw()
	{ ::operator delete(pMemory); }
	
	// placement new/delete
	static void* operator new(std::size_t size, void *ptr) throw()
	{ return ::operator new(size, ptr); }
	static void operator delete(void *pMemory, void *ptr) throw()
	{ ::operator delete(pMemory, ptr); }

	// nothrow new/delete
	static void* operator new(std::size_t size, const std::nothrow_t& nt) throw()
	{ return ::operator new(size, nt); }
	static void operator delete(void *pMemory, const std::nothrow_t&) throw()
	{ ::operator delete(pMemory); }
};
```

<!--
## Chapter 9: Miscellany 

### Item 53: Pay attention to compiler warnings.
 
### Item 54: Familiarize yourself with the standard library, including TR1. 

### Item 55: Familiarize yourself with Boost. 
-->

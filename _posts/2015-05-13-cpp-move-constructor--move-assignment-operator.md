---
layout: post
title: "C++: move constructor & move assignment operator / lvalue & rvalue / reference qualifier"
description: ""
category: C++
tags: [C++11, copy-constructor]
---
{% include JB/setup %}

整理自 _C++ Primer, 5th Edition_

-----

ToC:

- [1. Rvalue References](#1-rvalue-references)
	- [1.1 Lvalues Persist; Rvalues Are Ephemeral](#11-lvalues-persist-rvalues-are-ephemeral)
	- [1.2 Variables Are Lvalues](#12-variables-are-lvalues)
	- [1.3 The Library move() Function](#13-the-library-move-function)
- [2. Move Constructor and Move Assignment](#2-move-constructor-and-move-assignment)
	- [2.1 Move Constructor 的 Exception 的问题](#21-move-constructor-的-exception-的问题)
	- [2.2 Move-Assignment Operator](#22-move-assignment-operator)
	- [2.3 A Moved-from Object Must Be Destructible](#23-a-moved-from-object-must-be-destructible)
	- [2.4 The Synthesized Move Operations](#24-the-synthesized-move-operations)
	- [2.5 Rvalues Are Moved, Lvalues Are Copied...](#25-rvalues-are-moved-lvalues-are-copied)
	- [2.6 ...But Rvalues Are Copied If There Is No Move Constructor](#26-but-rvalues-are-copied-if-there-is-no-move-constructor)
	- [2.7 Advice: Don’t Be Too Quick to Move](#27-advice-dont-be-too-quick-to-move)
	- [2.8 Defining a Derived Move Constructor](#28-defining-a-derived-move-constructor)
- [3. Rvalue References and Member Functions](#3-rvalue-references-and-member-functions)
	- [Reference Qualifier](#reference-qualifier)

-----

In some of these circumstances, an object is immediately destroyed after it is copied. In those cases, moving, rather than copying, the object can provide a significant performance boost.

- `vector` is a good example of this kind of superfluous ([su:ˈpɜ:fluəs], 多余的) copy. During reallocation, there is no need to copy—rather than move—the elements from the old memory to the new. 
- A second reason to move rather than copy occurs in classes such as the IO or `unique_ptr` classes. These classes have a resource (such as a pointer or an IO buffer) that may not be shared. Hence, objects of these types can’t be copied but can be moved.
- Actually, the library containers, `string`, and `shared_ptr` classes support move as well as copy. The IO and `unique_ptr` classes can be moved but not copied.

## 1. Rvalue References

To support move operations, the new standard introduced a new kind of reference, an **rvalue reference**. An **rvalue reference** is a reference that must be bound to an rvalue. An rvalue reference is obtained by using `&&` rather than `&`.

As we know, we cannot bind regular references—which we’ll refer to as **lvalue reference**s when we need to distinguish them from **rvalue reference**s—to expressions that require a conversion, to literals, or to expressions that return an rvalue. Rvalue references have the opposite binding properties: We can bind an rvalue reference to these kinds of expressions, but we cannot directly bind an rvalue reference to an lvalue: 

- Functions that return **lvalue reference**s, along with the assignment, subscript, dereference, and prefix increment/decrement operators, are all examples of expressions that return lvalues. 
	- We can bind an **lvalue reference** to the result of any of these expressions.
- Functions that return a nonreference type, along with the arithmetic, relational, bitwise, and postfix increment/decrement operators, all yield rvalues. 
	- We CANNOT bind an **lvalue reference** to these expressions, but we can bind either an **lvalue reference to const** or an **rvalue reference** to such expressions.

```cpp
int i = 7;					// 数字 7 本身是 rvalue

int &ri = i;				// OK.
int &&ri2 = i;				// ERROR. cannot bind an rvalue reference to an lvalue
int &ri3 = i * 42;			// ERROR. i * 42 is an rvalue
const int &ri4 = i * 42;	// OK. we can bind a reference to const to an rvalue
int &&ri4 = i * 42;			// OK. bind ri4 to the result of the multiplication
```

### 1.1 Lvalues Persist; Rvalues Are Ephemeral

- ephemeral: [ɪˈfemərəl], 短暂的

lvalues and rvalues differ from each other in an important manner: Lvalues have persistent state, whereas rvalues are either literals or temporary objects created in the course of evaluating expressions.

Because **rvalue reference**s can only be bound to temporaries, we know that

- The referred-to object is about to be destroyed
- There can be no other users of that object

### 1.2 Variables Are Lvalues

A variable is an lvalue; we cannot directly bind an **rvalue reference** to a variable even if that variable was defined as an **rvalue reference** type.

```cpp
int &&rr1 = 42;		// OK. literals are rvalues
int &&rr2 = rr1;	// ERROR. the expression rr1 is an lvalue!
```

### 1.3 The Library move() Function

Although we cannot directly bind an **rvalue reference** to an lvalue, we can explicitly cast an lvalue to its corresponding **rvalue reference** type by calling a new library function `move()`, which is defined in the `<utility>` header. 

```cpp
int &&rr1 = 42;		// OK. literals are rvalues
int &&rr2 = rr1;	// ERROR. the expression rr1 is an lvalue!
int &&rr3 = std::move(rr1); // OK
```

We can destroy a moved-from object (e.g. `rr1` above) and can assign a new value to it, but we cannot use the value of a moved-from object.

## 2. Move Constructor and Move Assignment

To enable move operations for our own types, we define a move constructor and a move-assignment operator.

The move constructor must ensure that the moved-from object is left in a state such that destroying that object will be harmless. In particular, once its resources are moved, the original object must no longer point to those moved resources—responsibility for those resources has been assumed by the newly created object.

Move constructor、move `operator=` 和 copy-constructor、`operator=` 的格式基本一致，唯一的区别是 move 操作的参数必须是 **Rvalue Reference**.

### 2.1 Move Constructor 的 Exception 的问题

这里以 `vector` reallocate 的场景为例。

Because a move operation executes by “stealing” resources, it ordinarily does not itself allocate any resources. As a result, move operations ordinarily will not throw any exceptions. One way inform the library is to specify `noexcept`, which was introduced by the new standard, on our move constructor. 

- `noecept` 应该就是 `throw()` 的意思，这里不展开。参 [Declaring a throw](/c++/2015/04/13/cpp-exception-handling#exception-specification)

为什么一定要声明不抛出异常呢？

- First, although move operations usually don’t throw exceptions, they are permitted to do so. 
- Second, the library containers provide guarantees as to what they do if an exception happens. E.g. if an exception happens when we call
`push_back`, the vector itself will be left unchanged
	- 以 `push_back` 触发 `vector` reallocation 的场景为例
	- 对 copy-constructor 而言，实现 "left unchanged on exception" 是很简单的，因为我旧 memory 上原有的元素没有动，copy 的时候抛异常了那我就把整个新 memory 抛弃掉好了
	- 对 move-constructor 而言，如果 move 的时候抛异常，已经 move 的元素可能已经被销毁掉了，这样可能新旧两块内存上各有一部分元素，就无法收拾了
	- If reallocation uses a move constructor and that constructor throws an exception after moving some but not all of the elements, there would be a problem. The moved-from elements in the old space would have been changed, and the unconstructed elements in the new space would not yet exist. In this case, vector would be unable to meet its requirement that the vector is left unchanged.
	- On the other hand, if vector uses the copy constructor and an exception happens, it can easily meet this requirement. In this case, while the elements are being constructed in the new memory, the old elements remain unchanged. If an exception happens, vector can free the space it allocated (but could not successfully construct) and return. The original vector elements still exist.
	- To avoid this potential problem, vector must use a copy constructor instead of a move constructor during reallocation _**unless**_ it knows that the element type’s move constructor cannot throw an exception.
	
### 2.2 Move-Assignment Operator

As with the move constructor, if our move-assignment operator won’t throw any exceptions, we should make it `noexcept`. Like a copy-assignment operator, a move-assignment operator must guard against self-assignment:

```cpp
StrVec &StrVec::operator=(StrVec &&rhs) noexcept {
	// direct test for self-assignment
	if (this != &rhs) {
		free(); // free existing elements
		elements = rhs.elements; // take over resources from rhs
		first_free = rhs.first_free;
		cap = rhs.cap;
		
		// leave rhs in a destructible state
		rhs.elements = rhs.first_free = rhs.cap = nullptr;
	}
	return *this;
}
```

### 2.3 A Moved-from Object Must Be Destructible

Moving from an object does not destroy that object: It is sometime after the move operation completes that the moved-from object will be destroyed. 

After a move operation, the “moved-from” object must remain a valid, destructible one but users may make no assumptions about its value.

### 2.4 The Synthesized Move Operations

If a class defines its own copy constructor, copy-assignment operator, or destructor, the move constructor and moveassignment operator are not synthesized.

The compiler will synthesize a move constructor or a move-assignment operator only if the class doesn’t define any of its own copy-control members and if every non-static data member of the class can be moved (i.e. can be moved constructed and move assigned). 

- The compiler can move members of built-in type. It can also move members of a class type if the member’s class has the corresponding move operation.

If the class defines either a move constructor and/or a move-assignment operator, then the synthesized copy constructor and copy-assignment operator for that class will be defined as `=delete`. 更多 `=delete` 规则参 [C++: The Rule of Three/Five](/c++/2015/05/13/cpp-the-rule-of-threefive)。

### 2.5 Rvalues Are Moved, Lvalues Are Copied...

When a class has both a move constructor and a copy constructor, the compiler uses ordinary function matching to determine which constructor to use:

```cpp
StrVec getVec(istream &); // returns an rvalue

StrVec v1, v2;
v1 = v2; 			// v2 is an lvalue; copy assignment
v2 = getVec(cin);	// getVec(cin) is an rvalue; move assignment
```

### 2.6 ...But Rvalues Are Copied If There Is No Move Constructor

If a class has no move constructor, function matching ensures that objects of that type are copied, even if we attempt to move them by calling `move`:

```cpp
class Foo {
public:
	Foo() = default;
	Foo(const Foo&); // copy constructor
	// other members, but Foo does not define a move constructor
};

Foo x;
Foo y(x);				// copy constructor; x is an lvalue
Foo z(std::move(x));	// copy constructor, because there is no move constructor
```

### 2.7 Advice: Don’t Be Too Quick to Move

Judiciously used inside class code, `move` can offer significant performance benefits. Casually used in ordinary user code (as opposed to class implementation code), moving an object is more likely to lead to mysterious and hard-to-find bugs than to any improvement in the performance of the application.

### 2.8 Defining a Derived Move Constructor

When a derived class defines a copy or move operation, that operation is responsible for copying or moving the entire object, including base-class members.

```cpp
class Base { /* ... */ };

class D: public Base {
public:
	/* 
		By default, the base class default constructor initializes the base part of an object to use the copy or move constructor, we must explicitly call that constructor in the constructor initializer list
	*/
	
	D(const D& d): Base(d)			// copy the base members
	/* initializers for members of D */ { /* ... */ }
	
	D(D&& d): Base(std::move(d))	// move the base members
	/* initializers for members of D */ { /* ... */ }
};
```

## 3. Rvalue References and Member Functions

For example, the library containers that define `push_back` provide two versions:

```cpp
void push_back(const X&);	// copy: binds to any kind of X
void push_back(X&&);		// move: binds only to modifiable rvalues of type X
```

Usually, we pass an **rvalue reference** when we want to “steal” from the argument. In order to do so, the argument must not be const.

示例实现如下：

```cpp
void StrVec::push_back(const string& s) {
	chk_n_alloc(); // ensure that there is room for another element
	// construct a copy of s in the element to which first_free points
	alloc.construct(first_free++, s);
}

void StrVec::push_back(string &&s) {
	chk_n_alloc(); // reallocates the StrVec if necessary
	alloc.construct(first_free++, std::move(s));
}

StrVec vec; // empty StrVec
string s = "foo";
vec.push_back(s);		// calls push_back(const string&)
vec.push_back("bar");	// calls push_back(string&&)
```

### Reference Qualifier

Ordinarily, we can call a member function on an object, regardless of whether that object is an lvalue or an rvalue. 

```cpp
string s1 = "a value", s2 = "another";
auto n = (s1 + s2).find('a'); 	// OK. (s1 + s2) generates a rvalue; it seems fine. 
s1 + s2 = "wow!";				// Also OK. but WTF!
```

Prior to the new standard, there was no way to prevent usage like `s1 + s2 = "wow!";`. In order to maintain backward compatability, the library classes continue to allow assignment to rvalues, However, we might want to prevent such usage in our own classes. In this case, we’d like to force the left-hand operand to be an lvalue. 更准确地说，是可以规定 member function 的调用者是 lvalue 或者是 rvalue；对 operator 而言，就是可以规定 left-hand operand 是 lvalue 或者是 rvalue。

下面这个例子来自 [What is “rvalue reference for *this”?](http://stackoverflow.com/a/8610728):

```cpp
#include <iostream>

struct test {
    void f() & { // & 表示调用者必须是 lvalue 
		std::cout << "called by an lvalue" << std::endl; 
	}
    void f() && { // && 表示调用者必须是 rvalue 
		std::cout << "called by an rvalue" << std::endl; 
	}
};

int main() {
    test t;
    t.f(); // t 是 lvalue
    test().f(); // test() 产生一个 temporary object，是 rvalue
}

// output:
/*
	called by an lvalue
	called by an rvalue
*/
```

我们称函数后的 & 和 && 为 **reference qualifier**。We place a **reference qualifier** after the parameter list. 如果有 const 的话，需要把 const 写在 **reference qualifier** 前面：

```cpp
class Foo {
public:
	Foo someMem() & const;		// ERROR. const qualifier must come first
	Foo anotherMem() const &;	// OK.
};
```

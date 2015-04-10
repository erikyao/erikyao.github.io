---
layout: post
title: "C++: Inheritance / virtual"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

## 1. Basic syntax

<pre class="prettyprint linenums">
class Base {
private:
	int i;
public:
	Base(int i) {
		this->i = i;
	}
	void setI(int i) {
		this->i = i;
	}
};

class Part {
private:
	int i;
public:
	Part(int i) {
		this->i = i;
	}
	void setI(int i) {
		this->i = i;
	}
};

class Ext : public Base { // public inheritance
private: 
	int i;
	Part p;
public: 
	void setI(int ii) {
		i = ii;
		p.setI(ii);
		Base::setI(ii); // java 里就是 super.setI(ii);
	}
	Ext(int ii) : Base(ii), p(ii) { // java 里就是 super(ii);
		this->i = ii;
	}
	Ext(const Ext& ext) : Base(ext), i(ext.i), p(ext.i) {
		// 如果自己写 copy-constructor 的话，需要显式调用 Base 的 copy-constructor
	}
	~Ext() {} // Calls ~Base() and ~Part() automatically
};
</pre>

You’ll notice that the base class is preceded by `public`. C++ defaults to `private` inheritance, which means that all of the public members of the base class would be `private` in the derived class. 
	
- In Java, the compiler won’t let you decrease the access of a member during inheritance.

Functions that don’t automatically inherit:

- constructors and destructors
- `operator=`
	- other operators are automatically inherited into a derived class

## 2. public inheritance vs. protected inheritance vs. private inheritance

[Difference between private, public, and protected inheritance](http://stackoverflow.com/a/1372858) 讲的很清楚：

<pre class="prettyprint linenums">
class A {
public:
    int x;
protected:
    int y;
private:
    int z;
};

class B : public A {
    // x is public
    // y is protected
    // z is not accessible from B
};

class C : protected A {
    // x is protected
    // y is protected
    // z is not accessible from C
};

class D : private A {
    // x is private
    // y is private
    // z is not accessible from D
};
</pre>

## 3. Private inheritance is a syntactic variant of composition

来自 [FAQ: How are “private inheritance” and “composition” similar?](http://isocpp.org/wiki/faq/private-inheritance#priv-inherit-like-compos):

<pre class="prettyprint linenums">
class Engine {
public:
	Engine(int numCylinders);
	void start();					// Starts this Engine
};

/***** composition *****/
class Car {
public:
	Car() : e_(8) { }				// Initializes this Car with 8 cylinders
	void start() { e_.start(); }	// Start this Car by starting its Engine
private:
	Engine e_;						// Car has-a Engine
};

/***** private inheritance *****/
class Car : private Engine {		// Car has-a Engine
public:
	Car() : Engine(8) { }			// Initializes this Car with 8 cylinders
	using Engine::start; 			// Start this Car by starting its Engine
									// 注意这种高级写法
};
</pre>

## 4. Private inheritance 之后重新限定 access modifier

首先复习一下 access modifier：

* **public** means the following definitions are available to everyone
* **private** means that no one can access those definitions except you, the creator of the type, inside member functions of that type
* **protected** acts just like **private**, with the exception that an inheriting class has access to **protected** members, but not **private** members

如果 `Ext` privately inherit `Base`，`Ext` 中 `Base` 的 member 会全部变 private，但是对 `Base` **原先不是 private 的** member，`Ext` 可以重新把它们设定为 public 或 protected。看例子：

<pre class="prettyprint linenums">
class Base {
private:
	int i;
protected: 
	int j;
public:
	int k;
    void f() {}
	void g() {}
};

class Ext : private Base {
public:
    Base::i; // ERROR. 'int Base::i' is private
    Base::j; // OK. WARNING. access declarations are deprecated in favour of using-declarations
    Base::k; // OK. WARNING. access declarations are deprecated in favour of using-declarations
    Base::f; // OK. WARNING. access declarations are deprecated in favour of using-declarations
	
	// 把 privately inherit 来的 j, k, f() 重新设置为 public
	
	// member 只用写 name，不用写 type
	// member function 只用写 name，不用写 returnType 和 argument list
};

class Ext2 : private Base {
protected:
    Base::i; // ERROR. 'int Base::i' is private
    Base::j; // OK. WARNING. access declarations are deprecated in favour of using-declarations
    Base::k; // OK. WARNING. access declarations are deprecated in favour of using-declarations
    Base::f; // OK. WARNING. access declarations are deprecated in favour of using-declarations
};
 
int main() {   
    Ext ext;
    
	ext.i; 		// ERROR. 'int Base::i' is private
    ext.j;		// OK
    ext.k;		// OK
	ext.f();	// OK
    ext.g(); 	// ERROR. 'void Base::g()' is inaccessible
    
    Ext2 ext2;
    
    ext2.i; 	// ERROR. 'int Base::i' is private
    ext2.j;		// ERROR. 'int Base::j' is protected
    ext2.k;		// ERROR. 'int Base::k' is inaccessible
	ext2.f();	// ERROR. 'int Base::f()' is inaccessible
    ext2.g(); 	// ERROR. 'void Base::g()' is inaccessible
}
</pre>

## 5. Upcasting

C++ 在 object、pointer、reference 三个层面上做 upcast 都是可以的：

<pre class="prettyprint linenums">
int main() {
	Ext ext(1);
	
	Base base = ext;	// OK
	Base* pbase = &ext;	// OK
	Base& rbase = ext;	// OK
}
</pre>

但是要注意，单纯的 upcast 无法做到多态，调用 function 时进行的是 **early binding** (binding performed before the program is run, by the
compiler and linker)，所以 `Base base = ext;` 之后，`base.foo()` 执行的仍然是父类的方法，不会跑去执行子类的方法。

- Connecting a function call to a function body is called binding.
- C compilers have only one kind of function call, and that’s early binding.

要实现 **late binding** (a.k.a dynamic binding or runtime binding)，i.e. 要实现多态，必须使用 `virtual` function

## 6. Virtual functions

Late binding occurs: 

- only with virtual functions, 
- and only when you’re using an address (i.e. pointer or reference) of the base class.

注意 virtual function 在父类中是可以有实现的，而且实现不需要写 `virtual` 关键字，只要声明的时候有就可以了。

如果需要做到 java interface 的效果，i.e. 父类中的 virtual function 只声明不实现，需要使用 **pure virtual function**，语法是：

<pre class="prettyprint linenums">
class Animal {
public:
	virtual int getNumberOfLegs() = 0; // pure virtual function
};

class Duck : public Animal {
public:
	int getNumberOfLegs() { return 2; } // overriding
};
</pre>

The redefinition of a virtual function in a derived class is usually called overriding.

### 6.1 How C++ implements late binding

Typical compiler1 create a single table (called the **VTABLE**) for each class that contains virtual functions. The compiler places the addresses of the virtual functions for that particular class in the **VTABLE**. In each class with virtual functions, it secretly places a pointer, called the _vpointer_ (abbreviated as **VPTR**), which points to the **VTABLE** for that object. When you make a virtual function call through a base-class pointer (that is, when you make a polymorphic call), the compiler quietly inserts code to fetch the **VPTR** and look up the function address in the **VTABLE**, thus calling the correct function and causing late binding to take place.

![](https://gm5g2q.bn1304.livefilestore.com/y2paz-4ObABSqWpBPQG934_9xPJdkNwNZU-9LsKaJS320bNvUiQl2YfFQtjAqhgwyW3y5RwVRLgqQ8dVcxzxnR2_hP13F4ZLtnD7VAAn1Nfsa1zrTl1pYATekRYGFjNp92KmLTFRPeBxC2nFy5frvk9-g/late%20binding.png?psid=1)

### 6.2 Abstract class

If you give a class at least one pure virtual function, you make it abstract. If anyone tries to make an object of an abstract class, the compiler prevents them.

When an abstract class is inherited, all pure virtual functions must be implemented, or the inherited class becomes abstract as well. 这和 java 是一致的。

### 6.3 Pure virtual function 也可以有实现，但是不能是 inline

你声明一个 pure virtual function，然后放到 class 外部再实现也是可以的。这样做就成了一个带原始实现的 interface。但父类仍然是 abstract 的，你无法初始化一个父类对象来调用这些 function；也就是说，父类提供 pure virtual function 的实现完全是为子类服务的，最常见的用法就是提供一些 default 行为，避免各个子类的实现中都有重复代码。

[pure virtual function with implementation](http://stackoverflow.com/a/2089238) 总结得不错：

> = 0 means derived classes must provide an implementation, not that the base class can not provide an implementation.  
> <br/>  
> In practice, when you mark a virtual function as pure (=0), there is very little point in providing a definition, because it will never be called unless someone explicitly does so via `Base::Function(...)` or if the `Base` class constructor calls the virtual function in question.
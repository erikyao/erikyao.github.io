---
layout: post
title: "C++ Inheritance"
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
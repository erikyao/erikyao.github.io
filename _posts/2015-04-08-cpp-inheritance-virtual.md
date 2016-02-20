---
layout: post
title: "C++: Inheritance / virtual"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

## 目录

- [1. Inheritance](#inheritance)
	- [1.1 Basic syntax](#syntax)
	- [1.2 public inheritance vs. protected inheritance vs. private inheritance](#public-protected-private-inheritance)
	- [1.3 Private inheritance is a syntactic variant of composition](#private-inheritance-vs-composition)
	- [1.4 Private inheritance 之后重新限定 access modifier](#publicizing)
	- [1.5 Upcasting](#upcasting)
	- [1.6 C++11: Inherited Constructors](#inherited-constructors)
- [2. Virtual functions](#virtual)
	- [2.1 How C++ implements late binding](#late-binding)
	- [2.2 Abstract class](#abstract-class)
	- [2.3 Pure virtual function 也可以有实现，但是不能是 inline](#implementing-pure-virtual)
	- [2.4 Virtual functions inside constructors & destructors](#virtual-inside-constructors-destructors)
	- [2.5 Virtual destructors](#virtual-destructors)
		- [Pure virtual destructors](#pure-virtual-destructors)
	- [2.6 Virtual Functions in a Derived Class](#virtual-in-derived)
	- [2.7 Calling Base's virtual function](#call-base)
	
[late_binding]: https://farm2.staticflickr.com/1511/23812247752_b64dc0ee81_o_d.png
	
-----

## <a name="inheritance"></a>1. Inheritance

### <a name="syntax"></a>1.1 Basic syntax

<pre class="prettyprint linenums">
class Base {
private:
	int i;
public:
	Base(int i) {
		this-&gt;i = i;
	}
	void setI(int i) {
		this-&gt;i = i;
	}
};

class Part {
private:
	int i;
public:
	Part(int i) {
		this-&gt;i = i;
	}
	void setI(int i) {
		this-&gt;i = i;
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
		this-&gt;i = ii;
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

## <a name="public-protected-private-inheritance"></a>1.2 public inheritance vs. protected inheritance vs. private inheritance

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

也正因为外部访问不到任何 member function，所以 `C` 和 `D` 也无法多态（或者换个角度考虑：就算可以多态，但是方法都访问不到也白搭）。

## <a name="private-inheritance-vs-composition"></a>1.3 Private inheritance is a syntactic variant of composition

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

## <a name="publicizing"></a>1.4 Private inheritance 之后重新限定 access modifier

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

这里用 `using Base::j;` 也可以起到同样的效果，而且从 warning 来看使用 `using` 更标准一些。

## <a name="upcasting"></a>1.5 Upcasting

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

## <a name="inherited-constructors"></a>1.6 C++11: Inherited Constructors

Under the new standard, a derived class can reuse the constructors defined by its direct base class by providing a `using` declaration:

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

class Base {
private:
    int i;
    int j;
public:
    Base(int i) {
        this-&gt;i = i;
    }
    Base(int i, int j) {
        this-&gt;i = i;
        this-&gt;j = j;
    }
    virtual std::ostream& dump(std::ostream& o) {
        return o &lt;&lt; "i=" &lt;&lt; i &lt;&lt; "; j=" &lt;&lt; j;
    }
};

class Ext : public Base {
public:
    using Base::Base;
};

int main() {
    Ext e1(5);
    e1.dump(cout);
    cout &lt;&lt; endl;

    Ext e2(39, 47);
    e2.dump(cout);
    cout &lt;&lt; endl;
}
</pre>

The compiler generates a derived constructor corresponding to each constructor in the base. That is, for each constructor in the base class, the compiler generates a constructor in the derived class that has the same parameter list.

These compiler-generated constructors have the form `derived(parms) : base(args) { }`，比如对上面的例子来说，相当于生成了：

<pre class="prettyprint linenums">
class Ext : public Base {
public:
    Ext(int i) : Base(i) {}
	Ext(int i, int j) : Base(i, j) {}
};
</pre> 

注意事项：

- Unlike `using` declarations for ordinary members, a constructor `using` declaration does not change the accessibility of the inherited constructor(s).
- A `using` declaration can’t specify `explicit` or `constexpr`. If a constructor in the base is `explicit` or `constexpr`, the inherited constructor has the same property.
- If a base-class constructor has default arguments, those arguments are not inherited. Instead, the derived class gets multiple inherited constructors in which each parameter with a default argument is successively omitted. For example, if the base has a constructor with two parameters, the second of which has a default, the derived class will obtain two constructors: one with both parameters (and no default argument) and a second constructor with a single parameter corresponding to the left-most, non-defaulted parameter in the base class.
- The default, copy, and move constructors are not inherited.
- An inherited constructor is not treated as a user-defined constructor. Therefore, a class that contains only inherited constructors will have a synthesized default constructor.

## <a name="virtual"></a>2. Virtual functions

Late binding occurs: 

- only with virtual functions, AND
- only when you’re using an address (i.e. pointer or reference) of the base class.
- 换言之，你只能通过 pointer 或者 reference 来调用 virtual function 才能实现多态。

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

### <a name="late-binding"></a>2.1 How C++ implements late binding

Typical compilers create a single table (called the **VTABLE**) for each class that contains virtual functions. The compiler places the addresses of the virtual functions for that particular class in the **VTABLE**. In each class with virtual functions, it secretly places a pointer, called the _vpointer_ (abbreviated as **VPTR**), which points to the **VTABLE** for that object. When you make a virtual function call through a base-class pointer (that is, when you make a polymorphic call), the compiler quietly inserts code to fetch the **VPTR** and look up the function address in the **VTABLE**, thus calling the correct function and causing late binding to take place.

![][late_binding]

### <a name="abstract-class"></a>2.2 Abstract class

If you give a class at least one pure virtual function, you make it abstract. If anyone tries to make an object of an abstract class, the compiler prevents them.

When an abstract class is inherited, all pure virtual functions must be implemented, or the inherited class becomes abstract as well. 这和 java 是一致的。

### <a name="implementing-pure-virtual"></a>2.3 Pure virtual function 也可以有实现，但是不能是 inline

你声明一个 pure virtual function，然后放到 class 外部再实现也是可以的。这样做就成了一个带原始实现的 interface。但父类仍然是 abstract 的，你无法初始化一个父类对象来调用这些 function；也就是说，父类提供 pure virtual function 的实现完全是为子类服务的，最常见的用法就是提供一些 default 行为，避免各个子类的实现中都有重复代码。

[pure virtual function with implementation](http://stackoverflow.com/a/2089238) 总结得不错：

> `= 0` means derived classes must provide an implementation, not that the base class can not provide an implementation.  
> <br/>
> In practice, when you mark a virtual function as pure (=0), there is very little point in providing a definition, because it will never be called unless someone explicitly does so via `Base::Function(...)` or if the `Base` class constructor calls the virtual function in question.

### <a name="virtual-inside-constructors-destructors"></a>2.4 Virtual functions inside constructors & destructors

If you call a virtual function inside a constructor or a destructor, only the local version of the function is used. That is, the virtual mechanism doesn’t work within the constructor or destructor.

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;
 
class Base {
public:
    virtual int f() const {
        cout &lt;&lt; "Base::f()" &lt;&lt; endl;
        return 1;
    }
    Base();
};

Base::Base() {
	f();
}
 
class Ext : public Base {
public:
    int f() const {
        cout &lt;&lt; "Ext::f()" &lt;&lt; endl;
        return 1;
    }
};

int main() {   
    Ext ext;
}

// output: Base::f()
</pre>

In addition, many compilers recognize that a virtual function call is being made inside a constructor, and perform early binding because they know that late-binding will produce a call only to the local function.

这和 java 的情况有点不同，参考 [warning: 在构造器中请谨慎使用被覆写方法](/java/2009/03/27/using-overridden-method-in-constructor-is-dangerous)。

### <a name="virtual-destructors"></a>2.5 Virtual destructors

You cannot use the `virtual` keyword with constructors, but destructors can and often must be virtual.

主要问题出现在 `Base* pb = new Ext; delete pb;` 这个么场景里。如果 destructor 不是 virtual 的话，那 `delete pb;` 其实是一个 upcasting（这里把 `delete` 当做一个 function 来看的话，`pb.delete();` 也是 upcasting；所以 `delete` 和 function 的情形是一致的），并不是多态，所以 `delete pb;` 并不会调用 `Ext` 的 destructor，而是 `Base` 的 destructor，这样就 `Ext` 对象就没有完全销毁，造成内存泄露。

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

class Base1 {
public:
    ~Base1() {
        cout &lt;&lt; "~Base1()\n";
    }
};

class Ext1 : public Base1 {
public:
    ~Ext1() {
        cout &lt;&lt; "~Ext1()\n";
    }
};

class Base2 {
public:
    virtual ~Base2() {
        cout &lt;&lt; "~Base2()\n";
    }
};

class Ext2 : public Base2 {
public:
    ~Ext2() {
        cout &lt;&lt; "~Ext2()\n";
    }
};

int main() {
    Base1* bp = new Ext1; 
    delete bp;
    Base2* b2p = new Ext2;
    delete b2p;
}

// output:
/* 
	~Base1()
	~Ext2()
	~Base2()
*/
</pre>

可参考：

- [When to use virtual destructors?](http://stackoverflow.com/a/461224)
- [FAQ: When should my destructor be virtual?](http://isocpp.org/wiki/faq/virtual-functions#virtual-dtors)

As a guideline, any time you have a virtual function in a class, you should immediately add a virtual destructor (even if it does nothing). i.e. 如果要用多态，保险起见父类请一定要把 destructor 设置成 virtual。

#### <a name="pure-virtual-destructors"></a>Pure virtual destructors

While pure virtual destructors are legal in Standard C++, there is an added constraint when using them: you must provide a function body for the pure virtual destructor.

However, when you inherit a class from one that contains a pure virtual destructor, you are not required to provide a definition of a pure virtual destructor in the derived class. Remember that the compiler automatically creates a destructor definition for every class if you don’t create one. That’s what’s happening here – the base class destructor is being quietly overridden.

What’s the difference between a regular virtual destructor and a pure virtual destructor? The only distinction occurs when you have a class that only has a single pure virtual function: the destructor. In this case, the only effect of the purity of the destructor is to prevent the instantiation of the base class. If there were any other pure virtual functions, whether the destructor is pure or not isn’t so important.

### <a name="virtual-in-derived"></a>2.6 Virtual Functions in a Derived Class

When a derived class overrides a virtual function, it may, but is not required to, repeat the `virtual` keyword. Once a function is declared as virtual, it remains virtual in all the derived classes.

### <a name="call-base"></a>2.7 Calling Base's virtual function

<pre class="prettyprint linenums">
#include &lt;iostream&gt;

class Base {
public:
    virtual void print() {
        std::cout &lt;&lt; "Base" &lt;&lt; std::endl;
    }
};

class Ext : public Base {
public:
    void print() {
    	std::cout &lt;&lt; "Ext first. Then ";
        Base::print();	// 1) call Base's version
    }
};

int main() {
	Base* pb = new Ext;
	
	pb-&gt;print();
	pb-&gt;Base::print();	// 2) call Base's version
	
	delete pb;
	
	Ext e;
	Base& rb = e;
	
	rb.print();
	rb.Base::print();	// 3) call Base's version
}
</pre>

不管是在子类实现里、pointer 多态还是 reference 多态，调用父类实现都是用父类名加上 scope operator `::` 限定。 

访问父类的 member 也是用这种方法。
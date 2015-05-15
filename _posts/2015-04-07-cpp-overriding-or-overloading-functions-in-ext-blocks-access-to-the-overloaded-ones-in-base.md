---
layout: post
title: "C++: 在子类中 override 或 overload 父类方法会屏蔽对 overloaded 方法的访问. This is different from Java!"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

先看 Java：

<pre class="prettyprint linenums">
public class Base {
	int f() {
		System.out.println("Base.f()");
		return 1;
	}
	
	int f(String s) {
		System.out.println("Base.f(): " + s);
		return 1;
	}
}

public class Ext extends Base {
	int f() {
		System.out.println("Ext.f()");
		return 1;
	}
	
	public static void main(String[] args) {
		Ext ext = new Ext();
		ext.f();		// OK. Ext.f()
		ext.f("Hello");	// OK. Base.f(): Hello
	}
}

public class Ext2 extends Base {
	void f() { // ERROR. the return type is incompatible with Base.f()
		System.out.println("Ext2.f()");
	}
}

public class Ext3 extends Base {
	int f(int i) {
		System.out.println("Ext3.f(): " + i);
		return 3;
	}
	
	public static void main(String[] args) {
		Ext3 ext3 = new Ext3();
		ext3.f();			// OK. Base.f()
		ext3.f(47);			// OK. Ext3.f(): 47
		ext3.f("Hello");	// OK. Base.f(): Hello
	}
}
</pre>

再来看下 C++：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

class Base {
public:
    int f() const {
        cout &lt;&lt; "Base::f()" &lt;&lt; endl;
        return 1;
    }
    int f(string s) const {
    	cout &lt;&lt; "Base::f(): " &lt;&lt; s &lt;&lt; endl;
        return 1;
    }
};

class Ext : public Base {
public:
    int f() const {
        cout &lt;&lt; "Ext::f()" &lt;&lt; endl;
        return 1;
    }
};

class Ext2 : public Base {
public:
    void f() const { // OK in C++
        cout &lt;&lt; "Ext2::f()" &lt;&lt; endl;
    }
};

class Ext3 : public Base {
public:
    int f(int i) const {
        cout &lt;&lt; "Ext3::f(): " &lt;&lt; i &lt;&lt; endl; 
        return 3;
    }
};

int main() {   
    Ext ext;
    ext.f(); 			// OK. Ext::f()
	ext.f("Hello"); 	// ERROR. no matching function
   
    Ext2 ext2;
	ext2.f(); 			// OK. Ext2::f()
	ext2.f("Hello"); 	// ERROR. no matching function
    
	Ext3 ext3;
	ext3.f(); 			// ERROR. no matching function
    ext3.f(47); 		// OK. Ext3::f(): 47
    ext3.f("Hello"); 	// ERROR. invalid conversion from 'const char*' to 'int'
}
</pre>

- `Ext` 覆写了 `int f()`，然后 `int f(string s)` 就访问不到了
- `Ext2` 不知道算是覆写还是重载了 `int f()`，然后 `int f(string s)` 就访问不到了
- `Ext3` 添加了一个重载方法 `int f(int i)`，然后 `int f()` 和 `int f(string s)` 都访问不到了
- java 问你的 functions 为什么这么水火不容……

It doesn’t necessarily mean you’re doing it wrong, it’s just that the ultimate goal of inheritance is to support polymorphism, and if you change the function signature or return type then you are actually changing the interface of the base class. If this is what you have intended to do then you are using inheritance primarily to reuse code, and not to maintain the common interface of the base class (which is an essential aspect of polymorphism). 

In general, when you use inheritance this way it means you’re taking a general-purpose class and specializing it for a particular need – which is usually, but not always, considered the realm of composition.

如果考虑到指针，C++ 这么干还是有点道理的。比如 `Ext::f(Foo* pfoo)` 和 `Base::f(void* pvoid)`，如果 `Ext::f(void* pvoid)` 也允许的话，看上去是有点危险……（但是你自己再覆写一个 `Ext::f(void* pvoid)` 也是可以的；大概 C++ 认为 "你自己写一个表示你是有意识的，我不阻止"）C++ 的哲学大概是：你定义了啥就是啥；这也相当于是一个强类型检查（`Ext::f(...)` 只能接受 `Foo*`）。

如果你需要像 java 那样在子类中存在多个重载方法，一个途径是每个方法都覆写；如果工作量很大的话，可以考虑使用 template。

-----

_~~~~~~~~~~ 2015-04-10 更新 ~~~~~~~~~~_

如果父类是 virtual function，情况会稍微有点不同：

- `Ext2` 这样不知道是覆写还是重载的写法像 java 一样，C++ 也不允许
- `Ext1` 和 `Ext3` 里的重载方法还是被屏蔽

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;
 
class Base {
public:
    virtual int f() const {
        cout &lt;&lt; "Base::f()" &lt;&lt; endl;
        return 1;
    }
    virtual int f(string s) const {
        cout &lt;&lt; "Base::f(): " &lt;&lt; s &lt;&lt; endl;
        return 1;
    }
};
 
class Ext : public Base {
public:
    int f() const {
        cout &lt;&lt; "Ext::f()" &lt;&lt; endl;
        return 1;
    }
};
 
class Ext2 : public Base {
public:
    void f() const { // ERROR. conflicting return type specified for 'virtual void Ext2::f() const'
        cout &lt;&lt; "Ext2::f()" &lt;&lt; endl;
    }
};
 
class Ext3 : public Base {
public:
    int f(int i) const {
        cout &lt;&lt; "Ext3::f(): " &lt;&lt; i &lt;&lt; endl; 
        return 3;
    }
};
 
int main() {   
    Ext ext;
    ext.f();            // OK. Ext::f()
    ext.f("Hello");     // ERROR. no matching function
    
    Ext3 ext3;
    ext3.f();           // ERROR. no matching function
    ext3.f(47);         // OK. Ext3::f(): 47
    ext3.f("Hello");    // ERROR. invalid conversion from 'const char*' to 'int'
}
</pre>

另外要注意：协变返回类型（variant return type）在 C++ 中也是允许的。

If you’re returning a pointer or a reference to a base class, then the overridden version of the function may return a pointer or reference to a class derived from what the base returns.

可参考 java 版本的 [关于覆写方法的 return type](/java/2009/03/27/return-type-of-overridden-method/)。

-----

_~~~~~~~~~~ 2015-05-15 更新；来自 C++ Primer, 5th Edition ~~~~~~~~~~_

真因为这个对 overloaded 方法的屏蔽作用，If a derived class wants to make all the overloaded versions available through its type, then it must override all of them or none of them.

It would be tedious in such cases to have to override every base-class version in order to override the ones that the class needs to specialize. 

To make things easier, a derived class can provide a `using` declaration for the overloaded member. A `using` declaration specifies only a name; it may not specify a parameter list. Thus, a `using` declaration for a base-class member function adds all the overloaded instances of that function to the scope of the derived class. Having brought all the names into its scope, the derived class needs to define only those functions that truly depend on its type.
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
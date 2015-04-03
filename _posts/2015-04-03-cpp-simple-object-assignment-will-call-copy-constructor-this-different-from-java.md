---
layout: post
title: "C++: Simple object assignment will call copy constructor. This different from Java!"
description: ""
category: C++
tags: [Cpp-101, copy-constructor]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

我这里说的 simple，意思是 assignment operator 没有重载，就是最原始最直接的 object assignment，比如 `T t2 = t1;` 这种。

我们先来看下 Java 的版本：

<pre class="prettyprint linenums">
public class T {
	private int i;
	
	public int getI() {
		return i;
	}

	public void setI(int i) {
		this.i = i;
	}

	public T(int i) {
		super();
		this.i = i;
	}
	
	public static void main(String[] args) {
		T t1 = new T(47);
		T t2 = t1;
		
		t2.setI(48);
		
		System.out.println(t1.getI());
		System.out.println(t2.getI());
		System.out.println(t1 == t2);
	}
}

// output:
/* 
	48
	48
	true
*/
</pre>

Java 里都是 reference，所以 `t2` 和 `t1` 指向了同一个对象，它们连地址都是相同的。

再来看下 C++ 的版本：

<pre class="prettyprint linenums">
#include <iostream>
using namespace std;

class T {
private:
	int i;
public:
	T(int i);
	T(const T&);
	~T();
	int getI() const {
		return i; 
	}
	void setI(int i) {
		this->i = i;
	}
};

T::T(int i) {
	this->i = i;
}

T::T(const T& t) : i(t.getI()) {
	cout &lt;&lt; "copy-constructor: &t==" &lt;&lt; &t &lt;&lt; endl;
	cout &lt;&lt; "copy-constructor: this==" &lt;&lt; this &lt;&lt; endl;
} 

T::~T() {
	cout &lt;&lt; "destructor: this==" &lt;&lt; this &lt;&lt; endl;
}

int main() {
	T t1(47);
	T t2 = t1;
	
	t2.setI(48);
	
	cout &lt;&lt; t1.getI() &lt;&lt; endl;
	cout &lt;&lt; t2.getI() &lt;&lt; endl;
}

// output:
/* 
	copy-constructor: &t==0x22fe30
	copy-constructor: this==0x22fe20
	47
	48
	destructor: this==0x22fe20
	destructor: this==0x22fe30
*/
</pre>

可见调用了 copy-constructor，`t1` 和 `t2` 是两个完全不同的对象。
---
layout: post
title: "C++: Simple object assignment means copying. This different from Java!"
description: ""
category: C++
tags: [Cpp-101, copy-constructor]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

有两点意思：

- `T t2 = t1;` 这样的 define 语句会调用 copy-constructor（生成一个新对象）
- `t2 = t1;` 这样的赋值语句执行的是 `operator=`
	- [Default assigment operator= in c++ is a shallow copy?](http://stackoverflow.com/questions/5096464/default-assigment-operator-in-c-is-a-shallow-copy) 的说法是：系统默认的 `operator=` 执行的是 copy 操作，which copies each member。但个 copy 并不像 copy-constructor 是生成一个新对象，理解为 override 似乎更合适
		- `t2 = t1;` 就是用 `t1` 的内容 override `t2` 的内容
	- 如果你重载了 `operator=` 就执行重载的逻辑

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
#include &lt;iostream&gt;
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
    
    cout &lt;&lt; "t1.i==" &lt;&lt; t1.getI() &lt;&lt; endl;
    cout &lt;&lt; "t2.i==" &lt;&lt; t2.getI() &lt;&lt; endl;
    
    T t3(53);
	t2 = t3; 
	
	cout &lt;&lt; "t1.i==" &lt;&lt; t1.getI() &lt;&lt; endl;
	cout &lt;&lt; "t2.i==" &lt;&lt; t2.getI() &lt;&lt; endl;
	cout &lt;&lt; "t3.i==" &lt;&lt; t3.getI() &lt;&lt; endl;
}

// output:
/* 
	copy-constructor: &t==0x22fe30
	copy-constructor: this==0x22fe20
	t1.i==47
	t2.i==48
	t1.i==47
	t2.i==53
	t3.i==53
	destructor: this==0x22fe10
	destructor: this==0x22fe20
	destructor: this==0x22fe30
*/
</pre>

可见 `T t2 = t1;` 调用了 copy-constructor，`t1` 和 `t2` 是两个完全不同的对象。而 `t2 = t3;` 是用 `t3` 的值完全覆盖了 `t2`；`t2` 和 `t3` 仍然是两个不同的对象。
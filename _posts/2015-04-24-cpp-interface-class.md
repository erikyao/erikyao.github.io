---
layout: post
title: "C++: Interface Class"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volumn 2_

-----

之前一直在想 C++ 如何做出 java interface 的效果……其实也挺简单的，你做一个 class，全部 virtual function，然后只写 declaration 不提供 definition 不就得了……

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
#include &lt;sstream&gt;
#include &lt;string&gt;
using namespace std;

class Printable {
public:
    virtual ~Printable() {}
    virtual void print(ostream&) const = 0;
};

class Stringable {
public:
    virtual ~Stringable() {}
    virtual string toString() const = 0;
};

class MyInt : public Printable, public Stringable {
    int x;
public:
    MyInt(int x) {
        this-&gt;x = x;
    }
	
    void print(ostream& os) const {
        os &lt;&lt; x;
    }
    
    string toString() const {
        ostringstream os;
        os &lt;&lt; x;
        return os.str();
    }
};

int main() {
    MyInt mi(7);
    
	mi.print(cout);
    cout &lt;&lt; mi.toString() &lt;&lt; endl;
}
</pre>

再结合 C++ 的 Multiple Inheritance，基本和 java 的 interface 没啥区别了。

- 真要说其实区别还是有的，比如 C++ 的 abstract class 不能做 container 的 type parameter，这个让我十分不习惯。
	- 用指针是可以的，也就是说 `vector<Printable>` 是不行的，`vector<Printable*>` 是可以的。
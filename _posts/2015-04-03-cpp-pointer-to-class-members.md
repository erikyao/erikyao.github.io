---
layout: post
title: "C++: pointer to class members"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

class Data {
private:
	int i;
public:
    int a, b, c;
    void print() const {
        cout &lt;&lt; "a = " &lt;&lt; a &lt;&lt; ", b = " &lt;&lt; b
             &lt;&lt; ", c = " &lt;&lt; c &lt;&lt; endl;
    }
};

int main() {
    Data d;
	Data *pd = &d;
	
    int Data::*pmInt = &Data::a;
    pd->*pmInt = 47;
    
	pmInt = &Data::b;
    d.*pmInt = 48;
    
	pmInt = &Data::c;
    pd->*pmInt = 49;
    
    pd->print();
	
	pmInt = &Data::i; // ERROR. 'int Data::i' is private
}

// output: a = 47, b = 48, c = 49
</pre>

* `int Data::*pmInt = &Data::a;` 定义一个 pointer 指向 `Data` class 内的一个 int member，并初始化为 member `a`;
	* 这句其实很像在 `Data` 外部凭空给 `Data` 加了一个 pointer member
	* `&Data::a` 这个奇葩的语法只能在这个场合用
	* Pointers to class members are quite limited: they can be assigned only to a specific location inside a class. You could not, for example, increment or compare them as you can with ordinary pointers.
* `int *pda = &(d.a);` 这样直接从外部取 member 的地址其实并不违法
	* 从这个角度来说，pointer to class member 的一个好处就是它被限定在了 class member 的范围内，不像普通指针那么野
* 注意 `d.*pmInt = 48;` 和 `pd->*pmInt = 49;` 这两种写法
* pointer to class member 无法指向 private member

pointer to class member 的语法还能扩展到 member function：

<pre class="prettyprint linenums">
class Simple2 {
public:
    int f(float) const {
        return 1;
    }
};


int main() {
    int (Simple2::*fp)(float) const;
    fp = &Simple2::f;

    int (Simple2::*fp2)(float) const = &Simple2::f;
    
    Simple2 s;
    Simple2 *ps = &s;
    
    (s.*fp)(1.0F);
    (ps->*fp2)(1.0F);
}
</pre>

* 说老实话，这段我看着十分难受……
* 普通的 function，其名称就是它的地址。但是在这里不行，`&Simple2::f` 里的 `&` 必须要写
* You can give the function identifier without an argument list, because overload resolution can be determined by the type of the pointer to member.
* 考虑到 member 多是 private，可能 pointer to class member function 的市场还稍微大些

书上还有个更复杂的例子，需要时可以看看。
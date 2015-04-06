---
layout: post
title: "C++: <i>new T</i> and <i>new T()</i> are different!"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

To hell with you, C++!

-----

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

class Tango {
public:
	int i;
};

class Papa {
public:
	int i;
	Papa() {
	
	}
};

int main() {
	Tango tango;
	Tango* ptango = new Tango;
	Tango* ptango2 = new Tango();
	
	cout &lt;&lt; tango.i &lt;&lt; endl;
	cout &lt;&lt; ptango->i &lt;&lt; endl;
	cout &lt;&lt; ptango2->i &lt;&lt; endl;
	
	Papa papa;
	Papa* ppapa = new Papa;
	Papa* ppapa2 = new Papa();
	
	cout &lt;&lt; papa.i &lt;&lt; endl;
	cout &lt;&lt; ppapa->i &lt;&lt; endl;
	cout &lt;&lt; ppapa2->i &lt;&lt; endl;
}

// output:
/*
	-1
	6324112
	0
	6317616
	6319120
	6055888
*/
</pre>

- 具体的讨论见 [Do the parentheses after the type name make a difference with new?](http://stackoverflow.com/questions/620137/do-the-parentheses-after-the-type-name-make-a-difference-with-new)
- `new T;` 和 `new T();` 都是调用的无参构造器，但是如果是系统自带的无参构造器，`new T();` 会做一个 zero initialization

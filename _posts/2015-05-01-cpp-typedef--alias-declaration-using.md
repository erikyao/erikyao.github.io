---
layout: post
title: "C++: typedef &amp; alias declaration (using)"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

整理自 _C++ Primer, 5th Edition_

-----

所谓 alias declaration 就是 `using X = Y;`，它和 `typedef Y X;` 是完全等价的：

<pre class="prettyprint linenums">
class SalesItem {

};

class SalesReport {
	
};

int main() {
	typedef SalesItem SI, *PSI;
	// equivalent to:
	// typedef SalesItem SI;
	// typedef SalesItem* PSI;
	
	using SR = SalesReport;
	using PSR = SalesReport*;
	
	SI si;
	PSI psi = new SI;
	PSI psi2 = new SalesItem;
	
	SR sr;
	PSR psr = new SR;
	PSR psr2 = new SalesReport;
	
	delete psi;
	delete psi2;
	delete psr;
	delete psr2;
}
</pre>

-----

_~~~~~~~~~~ 2015-05-16 补充；来自 C++ Primer, 5th Edition ~~~~~~~~~~_

Under C++11, we are able to define a type alias for a class template:

<pre class="prettyprint linenums">
template&lt;typename T&gt; using twin = pair&lt;T, T&gt;;
twin&lt;string&gt; authors; // authors is a pair&lt;string, string&gt;

template &lt;typename T&gt; using partNo = pair&lt;T, unsigned&gt;;
partNo&lt;string&gt; books; // books is a pair&lt;string, unsigned&gt;
</pre>

简单地说就是 `twin<T> == pair<T, T>` 和 `partNo<T> == pair<T, unsigned>`。注意这种语法。

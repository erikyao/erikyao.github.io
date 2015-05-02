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

---
layout: post
title: "C: Pointer Arithmetic"
description: ""
category: C
tags: [C-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

你一直在用这个特性但是可能一直没有注意到细节：在 pointer 的加减法中，1 个单位的量其实是 `sizeof(data unit)`。

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

int main(int argc, char* argv[]) {
	int i = 5;
	int *pi = &i;
	
	cout &lt;&lt; "pi == " &lt;&lt; pi &lt;&lt; endl; 
	cout &lt;&lt; "pi+1 == " &lt;&lt; pi + 1 &lt;&lt; endl; 
	cout &lt;&lt; "(++pi) == " &lt;&lt; (++pi) &lt;&lt; endl;
}

// output:
/* 
	pi == 0x22fe34
	pi+1 == 0x22fe38
	(++pi) == 0x22fe38
*/
</pre>

---
layout: post
title: "C: Macro Arguments (函数式 #define) / Stringizing Operator"
description: ""
category: C
tags: [C-101]
---
{% include JB/setup %}

整理自：

* [The C Preprocessor - 3.3 Macro Arguments](https://gcc.gnu.org/onlinedocs/cpp/Macro-Arguments.html)
* [MSDN: Stringizing Operator (#)](https://msdn.microsoft.com/en-us/library/7e3a913x.aspx)

-----

## 函数式 #define

Function-like macros can take arguments, just like true functions. To define a macro that uses arguments, you insert parameters between the pair of parentheses in the macro definition that make the macro function-like. 比如：

<pre class="prettyprint linenums">
#define min(X, Y)  ((X) < (Y) ? (X) : (Y))
</pre>

## Stringizing Operator

The stringizing operator (#) converts macro parameters to string literals without expanding the parameter definition. It is used only with macros that take arguments. 就是把 marco 的参数名称按 string 输出。

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

#define P(EX) cout &lt;&lt; #EX &lt;&lt; ": " &lt;&lt; EX &lt;&lt; endl;

int main(int argc, char* argv[]) {
	int i = 5;
	
	P(i);
}

// output:
/* 
	i: 5
*/
</pre>
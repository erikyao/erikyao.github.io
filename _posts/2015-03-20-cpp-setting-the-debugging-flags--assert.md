---
layout: post
title: "C++: Setting the debugging flags / assert"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

## Preprocessor debugging flags

<pre class="prettyprint linenums">
/* Probably in a header file */
#define DEBUG 

/////////////////////////

int main(int argc, char* argv[]) {
	int i = 5;
	
	#ifdef DEBUG // Check to see if flag is defined
		/* debugging code here */
		cout &lt;&lt; "Info: i=" &lt;&lt; i &lt;&lt; endl;
	#endif
	
	...
}
</pre>

Most C and C++ implementations will also let you `#define` and `#undef` flags from the compiler command line, so you can recompile code and insert debugging information with a single command (preferably via the makefile). 比我想象的要简单，我还以为每次都要去改 header……不过每次都要改 makefile 和我 java 每次都要改 config.xml 不是差不多么，还是一样的麻烦……

## Runtime debugging flags

In some situations it is more convenient to turn debugging flags on and off during program execution, especially by setting them when the program starts up using the command line. Large programs are tedious to recompile just to insert debugging code.

<pre class="prettyprint linenums">
// Debug flags aren't necessarily global:
bool debug = false;

int main(int argc, char* argv[]) {
	for(int i = 0; i < argc; i++)
		if(string(argv[i]) == "--debug=on")
			debug = true;

	if(debug) {
		// Debugging code here
		cout &lt;&lt; "Debugger is now on!" &lt;&lt; endl;
	}
	
	...
}
</pre>

这个参数检查的逻辑真是简单粗暴……还是我自己想得太复杂了？（我觉得怎么着都要切割下 `=` 吧）（应该是你太弱……

## The C assert() macro

When you use `assert()`, you give it an argument that is an expression you are “asserting to be true.” The preprocessor generates code that will test the assertion. If the assertion isn’t true, the program will stop after issuing an error message telling you what the assertion was and that it failed.

<pre class="prettyprint linenums">
#include &lt;cassert&gt;
using namespace std;

int main() {
	int i = 100;
	assert(i != 100); // Fails
}
</pre>

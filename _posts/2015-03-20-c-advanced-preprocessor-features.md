---
layout: post
title: "C: Advanced Preprocessor Features"
description: ""
category: C
tags: [C-101]
---
{% include JB/setup %}

整理自：

* _Thinking in C++_
* [The C Preprocessor - 3.3 Macro Arguments](https://gcc.gnu.org/onlinedocs/cpp/Macro-Arguments.html)
* [MSDN: Stringizing Operator (#)](https://msdn.microsoft.com/en-us/library/7e3a913x.aspx)
* [3.5 Concatenation](https://gcc.gnu.org/onlinedocs/cpp/Concatenation.html)

-----

## 函数式 #define

Function-like macros can take arguments, just like true functions. To define a macro that uses arguments, you insert parameters between the pair of parentheses in the macro definition that make the macro function-like. 比如：

```cpp
#define min(X, Y)  ((X) < (Y) ? (X) : (Y))
```

## Stringizing 

The stringizing operator (#) converts macro parameters to string literals without expanding the parameter definition. It is used only with macros that take arguments. 就是把 marco 的参数名称按 string 输出。

```cpp
#include <iostream>
using namespace std;

#define P(EX) cout << #EX << ": " << EX << endl;

int main(int argc, char* argv[]) {
	int i = 5;
	
	P(i);
}

// output:
/* 
	i: 5
*/
```

有一个用途就是 to get a trace that prints out the statements as they execute：

```cpp
#define TRACE(s) cerr << #s << endl, s

for(int i = 0; i < 100; i++)
	TRACE(f(i));

// 等价于	
for(int i = 0; i < 100; i++)
	cerr << "f(i)" << endl, f(i);
```

如果最后的 `endl, s` 如果写成 `endl; s`，那么 for 循环体就只有 cerr 那一句了

## String concatenation

在 #define 的内容中，If two adjacent character arrays have no punctuation between them, they are automatically concatenated. 比如下面两式的效果其实相同的，后者的 `#EX` 和 `": "` 自动合并了：

```cpp
#define P(EX) cout << #EX << ": " << EX << endl;
#define P(EX) cout << #EX ": " << EX << endl;
```

## Token pasting

Stringizing 和 String concatenation 生成的都是 string，代码里是要带 "" 的；Token pasting 不带 ""。而且 Token pasting 的写法是 `A##B`，类似于 string 的 `A+B` (不带引号)，相当于是个二元操作符。给个例子就好懂了：

```cpp
struct command {
	char *name;
	void (*function) (void);
};
 
struct command commands[] = {
	{ "quit", quit_command },
	{ "help", help_command },
	...
};

// 等价于

#define COMMAND(NAME)  { #NAME, NAME ## _command }
     
struct command commands[] = {
	COMMAND (quit),
	COMMAND (help),
	...
};
```

当 NAME=quit 时，`#NAME` 生成了一个字符串 `"quit"`，`NAME ## _command` 生成了一个 token `quit_command`
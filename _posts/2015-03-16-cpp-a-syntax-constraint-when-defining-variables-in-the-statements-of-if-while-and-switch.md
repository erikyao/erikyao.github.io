---
layout: post
title: "C++: A syntax constraint when defining variables in the statements of <i>if</i>, <i>while</i> and <i>switch</i>"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

You can also define variables inside the control expressions of `for` loops and `while` loops, inside the conditional of an `if` statement, and inside the selector statement of a `switch`.

`for (int i = 0; i < 10; ++i)` 这种是最常见的。其实 `if`, `while` 和 `switch` 的括号里都可以定义变量，举个 `switch` 的例子：

```cpp
switch(int i = cin.get()) {
	case 'A': cout << "Snap" << endl; break;
	case 'B': cout << "Crackle" << endl; break;
	case 'C': cout << "Pop" << endl; break;
	default: cout << "Not A, B or C!" << endl;
}
```

Although the example also shows variables defined within `while`, `if`, and `switch` statements, this kind of definition is much less common than those in `for` expressions, possibly because the syntax is so constrained. For example, you cannot have any parentheses. That is, you cannot say:

```cpp
while((char c = cin.get()) != 'q') { // ERROR
	...
}
```

震惊了！这样一句看起来人畜无害的语句竟然是非法的！就是因为这个原因我才要贴这篇 blog。

去掉括号也不行，结合律不占优势……

话说我不明白为啥不能这么写……


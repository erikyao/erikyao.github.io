---
layout: post
title: "C++: local scope"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

按 [Difference between local scope and function scope](http://stackoverflow.com/a/7933839) 的说法：

```cpp
void doSomething()
{				//				<-------|
	{			//	<---|				| 
				//		|				|
		int a;	// Local Scope	Function Scope
				//		|				|
	}			//	<---|				| 
}				//				<-------|
```

- Function Scope is between outer `{ }`.
- Local scope is between inner `{ }`.

_Thinking in C++_ 上有一个有点无耻的用法：

```cpp
int main() {
	{
		// experiment 1
	}	// at the end of local scope, variables in experiment 1 are all destructed
		// 留下一个全新的环境给 experiment 2
	
	// experiment 2
}
```

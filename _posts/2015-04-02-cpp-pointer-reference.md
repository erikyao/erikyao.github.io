---
layout: post
title: "C++: pointer reference"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

pointer 也可以有 reference，注意语法：

```cpp
#include <iostream>
using namespace std;

void increment(int*& i) { // i is a reference of int*
    i++;
}

int main() {
	int a = 5;
    int* i = &a;
	
    cout << "i = " << i << endl;
    increment(i);
    cout << "i = " << i << endl;
}

// output:
/*
	i = 0x22fe3c
	i = 0x22fe40
*/
```

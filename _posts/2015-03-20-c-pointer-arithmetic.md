---
category: C
description: ''
tags:
- pointer
title: 'C: Pointer Arithmetic'
---

整理自 _Thinking in C++_。

-----

你一直在用这个特性但是可能一直没有注意到细节：在 pointer 的加减法中，1 个单位的量其实是 `sizeof(data unit)`。

```cpp
#include <iostream>
using namespace std;

int main(int argc, char* argv[]) {
	int i = 5;
	int *pi = &i;
	
	cout << "pi == " << pi << endl; 
	cout << "pi+1 == " << pi + 1 << endl; 
	cout << "(++pi) == " << (++pi) << endl;
}

// output:
/* 
	pi == 0x22fe34
	pi+1 == 0x22fe38
	(++pi) == 0x22fe38
*/
```
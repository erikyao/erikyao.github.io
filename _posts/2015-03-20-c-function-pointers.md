---
category: C
description: ''
tags:
- pointer
title: 'C: function pointers'
---

整理自 _Thinking in C++_。

-----

## 起手式

To define a pointer to a function that has no arguments and no return value, you say:

```cpp
void (*funcPtr)();
```

括号还是必要的，否则就变成了 `void* funcPtr();`。

## 四十二式 Complicated declarations & definitions

```cpp
/* 1. */ void * (*(*fp1)(int))[10];

/* 2. */ float (*(*fp2)(int,int,float))(int);

/* 3. */ typedef double (*(*(*fp3)())[10])();
		 
		 fp3 a;

/* 4. */ int (*(*f4())[10])();
```

* `fp1` is a pointer to a function that takes an integer argument and returns a pointer to an array of 10 `void` pointers.
* `fp2` is a pointer to a function that takes three arguments (`int`, `int`, and `float`) and returns a pointer to a function that takes an integer argument and returns a `float`
* An `fp3` is a pointer to a function that takes no arguments and returns a pointer to an array of 10 pointers to functions that take no arguments and return `double`s. 
	* Then it says “`a` is one of these `fp3` types.”
* `f4` is a function that returns a pointer to an array of 10 pointers to functions that return integers.

我真的只是记录一下而已……我衷心希望这辈子都不会用到这些……

## Assigning a function pointer

其实和 array 名一样，function 名就是它自己的地址：

```cpp
void func() {
	cout << "func() called..." << endl;
}

int main() {
	void (*fp)(); 
	fp = func;
	
	void (*fp2)() = func; // 直接赋值也是可以的
	
	(*fp)();
	(*fp2)();
}
```

## Function Pointer Array

书上提到的 table-driven code，其实场景很简单：假如你有 10 个 state，对应 10 个 function，进入某个 state 就执行其对应的 function。首先一个 function pointer  array `void (*func_table[])() = { func0, func1, ..., func9 };` 走起（假设是 function 都是无参数 return void），书上的做法是用 `char c` 表示状态，然后 `(*func_table[c - 'a'])();` 就执行了对应的 function。你用 enum 也是可以的。

其实这里更深层的意思，我觉得应该是：有了 function pointer，你在自定义类型时可以很轻松地把单个的 variable 和某个 function 绑定起来~
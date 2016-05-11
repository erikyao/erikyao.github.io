---
layout: post
title: "C++: array in argument list"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自 _Thinking in C++_。

-----

For one thing, an array identifier is not an `lvalue`; you cannot assign to it. What's more, it’s just the starting address of the array. 没错，这个我还能玩出点花儿来：

```cpp
int a[3] = {1,2,3};
	
cout << a[1] << endl; // output: 2
cout << 1[a] << endl; // output: 2
cout << *(a+1) << endl; // output: 2
```

所以这里 `a` 的作用等同于一个 `int *`。所以函数声明 "我接收一个 int arrary" 和声明 "我接收一个 `int*`" 是同样的效果；把 int array 传给接收 `int*` 的函数是没问题的，反之亦然。但是要注意声明 "我接收一个 int arrary" 的写法：

```cpp
void func1(int a[], int size) { // 我接收一个 int arrary，同时加个 size
	for(int i = 0; i < size; i++)
		a[i] = i * i + i;
}

void func2(int* a, int size) { // 我接收一个 int*，同时加个 size
	for(int i = 0; i < size; i++)
		a[i] = i * i + i;
}
```

这里 `int size` 逻辑上是必须的。其实写成 `void func1(int a[5])` 是合法的，但是这个 `5`，函数无法 get 到。

这个形式和 main 函数的参数是一致的：

```cpp
int main(int argc, char* argv[]) { ... }
// OR
int main(int argc, char** argv) { ... }
```

书上是推荐用第一种，理由是 "更清楚地传达了 '这是个 array' 的意图"。

另外要注意 `cout` 应该是重载了对 `char*` 的输出：

```cpp
int i = 5;
int *pi = &i;
cout << pi << endl; // 输出地址值

char *pstr = "Hello";
cout << pstr << endl; // pstr 和 pi 一样都是指针，但是这里输出字符串
// 更具体来说，是输出到 '\0' 为止
// 如果你定义一个 char array 但是末尾不是 '\0'，cout 会越过你 char array 的范围去找 '\0'

// 所以输出 main 参数直接用下式就可以了：
cout << argv[i] << endl;
```

你理解成 `printf("%s", pstr);` 就好了。关于 C String 我不想多谈了，能扯好久的，以后用 `string` class 就不用考虑这些烦人的事情了。

_~~~~~~~~~~ 2015-05-02 补充 ~~~~~~~~~~_

根据 _C++ Primer, 5th Edition_，函数参数可以设置为 array 的 reference。而且设置为 reference 还有一个特点是：传参时会检查 array 的 size 是否一致，这是 array name（i.e. pointer）参数所不具备的：

```cpp
void func1(int a[5]) { 

}

void func2(int (&a)[5]) {
	
}

int main() {
	int foo[6] = { 0 };
	int bar[5] = { 0 };
	
	func1(foo); // OK
	func2(foo); // ERROR. invalid initialization of reference of type 'int (&)[5]' from expression of type 'int [6]'
	func2(bar); // OK
}
```

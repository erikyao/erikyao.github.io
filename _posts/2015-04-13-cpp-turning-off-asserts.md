---
layout: post
title: "C++: Turning off asserts"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volume 2_

-----

assert 的条件为 false 时直接 terminate 整个 program，它适用的场景是：as a debugging aid, used for catching cases that "can't happen", as opposed to normal error handling；同时也可以起到一个 comment 的作用。我个人感觉做粗糙原型的时候用比较合适，避免一上来就考虑复杂的 exception 处理流程。至于要不要把 assert 升级为 exception 可以放到后面的迭代再考虑。 

- Remember: assertions are intended to verify design decisions that will only fail because of faulty programmer logic. 
- The ideal is to solve all assertion violations during development. 
- Don’t use assertions for conditions that aren’t totally in your control (for example, conditions that depend on user input).

assert 的语法还是比较简单的：

```cpp
#include <cassert>

void substr(char *string, int length) {
   assert(string != NULL);     /* cannot be NULL */
   assert(*string != '\0');    /* cannot be empty */
   assert(length > 0);         /* must be positive */
}
```

另外 assert 可以作为 precondition checker (比如检查完参数再调用子函数)，也可以作为 postcondition checker (比如调用完子函数后再检查 object 状态)。具体的用法这里就不展开了。

如果写了 assert 代码但是想关闭 assert 功能（在发布代码时这是常见的做法；虽然这么做好不好存在争议），可以用通过编译器命令行来设置一个名为 NDEBUG 的 marco，比如：

```cpp
> g++ –DNDEBUG myfile.cpp 

// -D 表示 Defines constants or macros
// -D 不用接空格或者是等号什么的，直接接上 NDEBUG，所以成了 –DNDEBUG
```

To see how this works, note that a typical implementation of `assert()` looks something like this:

```cpp
#ifdef NDEBUG
	#define assert(cond) ((void)0)
#else
	void assertImpl(const char*, const char*, long);
	#define assert(cond) \
		((cond) ? (void)0 : assertImpl(xxx)) // xxx 部分编译器自己会补全，这里我们不考虑
#endif
```

`(void)0` 表示一个 empty statement，所以 assert 语句就失效了。

正因为 assert 可以被关掉，所以 assert 内部就不要做有 side-effect 的运算，比如 `assert(x++ > 0);`。

如果想要重新 turn assert on，除了 `#undef NDEBUG`，还要注意 re-include `<cassert>`。
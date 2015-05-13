---
layout: post
title: "C++ overloading `operator=`: shallow copy vs. deep copy / reference counting / copy on write"
description: ""
category: C++
tags: [Cpp-101, copy-constructor]
---
{% include JB/setup %}

整理自：_Thinking in C++_

-----

[Default assigment operator= in c++ is a shallow copy?](http://stackoverflow.com/questions/5096464/default-assigment-operator-in-c-is-a-shallow-copy) 有一个回答讲的非常清晰：

- Default `operator=` is a shallow copy.
- The actual difference between shallow copy and deep copy becomes visible when the class has pointers as member fields. In the absence of pointers, there is no difference.

对有 pointer member 的 class，我们自己在 overload `operator=` 就要注意 shallow copy 和 deep copy 的区别。

- Deep copy 自然是最万全的做法，copy 的时候把 pointer 指向的内容也复制一份，于是 `t1.ptr` 和 `t2.ptr` 就指向两块不同的内存（两块内存的内容一致），至于后续对这个内存块的 read、write、destruction 都由 `t1`、`t2` 自行维护，大家井水不犯河水
- 如果使用的是 shallow copy，需要注意：
	- 若 `t1.ptr` 和 `t2.ptr` 所指向的这同一块内存是 read-only，i.e. 无论是 `t1`、`t2` 还是 `tn` 都不会去写这块内存，那大家倒也相安无事，唯一需要注意的是 destruction。如果我 `t1` destruction 的时候顺带把这块内存也 destruction 了，那 `t2.ptr` 就成了 wild pointer。解决这个问题的办法就是 reference counting（引用计数）：
		- Copy-construction or assignment means attaching another pointer to an existing object and incrementing the reference count. 
		- Destruction means reducing the reference count and destroying the object if the reference count goes to zero.
		- 注意 reference count 应该设置在 `T.ptr` 所指向的那个对象中，我们记为类型 `P`。假设 `t1.ptr == &p`，然后 `t2` 来自 `t1`，这样上面两条就可以进一步写成：
			- Copy-construction or assignment of `t1` means attaching another pointer `t2.ptr` to the existing object `p` and incrementing the reference count in `p`. 
			- Destruction of `t2` means reducing the reference count in `p` and destroying the object `p` if the reference count goes to zero.
	- 若你使用了 shallow copy 还偏要对 `t1.ptr` 和 `t2.ptr` 所指向的这同一块内存做 write 操作，可以额外再用一个 copy-on-write 技术：
		- copy-on-write 就是 “等我要做写操作的时候再 deep copy”，某种程度上有点像 lazy initialization，都是比较 lazy，事到临头才开始操作
		- 假设是 `t2` 要发起写操作：
			- If the reference count in `p` is greater than one, `t2` must make a personal copy of `p` for `t2.ptr` before writing it. 我们假设这个 copy of `p` 的名字为 `papa`，`papa` 的 reference counting 为初始值 1
			- 同时 `p` 的 reference counting 减 1
		- 如果 `t1.ptr == &p` 然后 `t2.ptr == &papa`，此时再赋值 `t2 = t1;`，就需要把 `papa` 的 reference counting 减 1，`p` 的 reference counting 加 1。这个逻辑在 `operator=` 的实现中要写清楚. 
		
具体的例子见书上 P575。
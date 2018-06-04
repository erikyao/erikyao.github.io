---
layout: post
title: "C++11 Smart Pointer: <i>auto_ptr</i> is deprecated. Use <i>unique_ptr</i> instead. Here also come <i>shared_ptr</i> and <i>weak_ptr</i>."
description: ""
category: C++
tags: [C++11, pointer]
---
{% include JB/setup %}

我们在 [C++ Exception Handling / auto_ptr](/c++/2015/04/13/cpp-exception-handling#auto_ptr) 里介绍了 RAII wrapper for pointers--`auto_ptr`，然后 C++11 又 deprecated 了……对应的 replacement 是 unique_ptr。顺带还推出了 shared_ptr 和 weak_ptr，它们的特性是：

- `shared_ptr` allows multiple pointers to refer to the same object.
	- `shared_ptrs` automatically destroy their objects and free the associated memory when its reference count gets 0.
	- destroy 的时候一般是调用 delete，也可以自己提供一个 deleter 函数并用类似的逻辑来管理我们自定义的资源类，比如 `shared_ptr<connection> p(&conn, close_connection);`
- `unique_ptr` “owns” the object to which it points. Only one `unique_ptr` at a time can point to a given object.
	- The object to which a `unique_ptr` points is destroyed when the `unique_ptr` is destroyed.
- `weak_ptr` is a weak reference to an object managed by a `shared_ptr`.
	- Binding a `weak_ptr` to a `shared_ptr` does not change the reference count of that shared_ptr. Once the last `shared_ptr` pointing to the object goes away, the object itself will be deleted, even if there are `weak_ptr`s pointing to it—hence the name `weak_ptr`, which captures the idea that a `weak_ptr` shares its object “weakly.”
	- Because the object might no longer exist, we cannot use a `weak_ptr` to access its object directly. To access that object, we must call `lock()` function to check whether the object to which the `weak_ptr` points still exists. If so, `lock()` returns a `shared_ptr` to the shared object.
	- 参 [Understanding Weak References](/java/2014/06/04/digest-of-effective-java#weakReference)

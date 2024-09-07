---
category: C++
description: ''
tags:
- C++11
- pointer
title: 'C++11 Smart Pointer: <i>auto_ptr</i> is deprecated. Use other <i>smart pointers</i>.'
toc: true
toc_sticky: true
---

我们在 [C++ Exception Handling / auto_ptr](/c++/2015/04/13/cpp-exception-handling#auto_ptr) 里介绍了 RAII wrapper for pointers: `auto_ptr`，但是它在 C++11 又被 deprecated 了……对应的 replacement 是 `unique_ptr`。顺带还推出了 `shared_ptr` 和 `weak_ptr`。

![](https://live.staticflickr.com/65535/53976660985_7859f0e897_w_d.jpg)

(Diagram Credit: _Learn C++ By Example_ by Frances Buontempo)

# 1. Header

```cpp
#include <memory>
```

# 2. `unique_ptr` / `make_unique`

`unique_ptr`:

- A`unique_ptr` 100% **owns** the underlying object
- $\mathtt{copy}$ is disabled
- $\mathtt{move}$ is allowed
- Then underlying object is destroyed when its `unique_ptr` is destroyed (i.e. 强联动)

`unique_ptr` 的创建方式有很多，常见的有两种：

1. 从一个 vanilla pointer 构建
2. 用 `make_unique`

“从 vanilla pointer 构建” 这个方法有一个问题：你是可以用同一个 vanilla pointer 构建出两个 `unique_ptr` 的，第二个 `unique_ptr` 销毁时会导致 UB (undefined behavior)

```cpp
#include <memory>

using namespace std;

int val = 42;
int* pval = &val;

unique_ptr<int> up1(pval);  // OK. can be destroyed normally
unique_ptr<int> up2(pval);  // UB. when being destroyed, the underlying int is already destroyed
```

所以一般 recommend 用 `make_unique` (See [C++ Core Guidelines - R.23](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r23-use-make_unique-to-make-unique_ptrs)):

```cpp
auto up3 = make_unique<int>(42);  // OK. pointing to an integer of 42
auto up4 = make_unique<int>(42);  // OK. pointing to another integer of 42
```

`make_unique` 的语法一般是：

```cpp
make_unique<T>(arg1, arg2, ...);  // pointing to T(arg1, arg2, ...)
```

但 `make_unique` 本质是一个 variadic template，所以你可以 explicitly 指定 `arg1, arg2, ...` 的 type，只是一般没啥必要:

```cpp
make_unique<T, T_ARG1, T_ARG2, ...>(arg1, arg2, ...);  // pointing to T(arg1, arg2, ...)
```

# 3. `shared_ptr`/ `make_shared`

`shared_ptr`:

- Multiple `shared_ptr`s can own the same underlying object
- Just like reference counting, there is a **shared count** stored in [`control block`](https://devblogs.microsoft.com/oldnewthing/20230814-00/?p=108597)
- The underlying object is destroyed when all `shared_ptr`s are destroyed or go out of scope, i.e. when the shared count decreased to 0

`shared_ptr` 是可以 “从同一个 vanilla pointer 构建多个” 的，但仍然推荐用 `make_shared` (See [C++ Core Guidelines - R.22](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r22-use-make_shared-to-make-shared_ptrs))

```cpp
int val = 42;
int* pval = &val;

shared_ptr<int> sp1(pval);  // OK
shared_ptr<int> sp2(pval);  // OK

auto sp3 = make_shared<int>(42);  // pointing to an integer of 42
auto sp4 = shared_ptr<int>(sp3);  // OK. copy-construction from sp3
                                  // pointing to the same integer of 42, as sp3 is

sp4.use_count;  // == 2. 这个 field 即是 shared count
```

# 4. `_weak_ptr` / ~~`make_weak`~~

使用 `shared_ptr` 可能有 [cyclic dependency 的问题](https://stackoverflow.com/questions/22185896/what-is-the-cyclic-dependency-issue-with-shared-ptr)，简单说就是：`class A` 持有一个 `shared_ptr<B>`，同时 `class B` 持有一个 `shared_ptr<A>`。这个问题有多种解决方案，其中之一是把 `shared_ptr` 改成 `_weak_ptr`。(See [C++ Core Guidelines - R.24](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#r23-use-make_unique-to-make-unique_ptrs))

`_weak_ptr` 的创建，有：

- ⭕ 从另一个 `weak_ptr` $\mathtt{copy}$-construct
- ⭕ 从另一个 `weak_ptr` $\mathtt{move}$-construct
- ⭕ 从另一个 `shared_ptr` $\mathtt{copy}$-construct
- ❌ 从另一个 `shared_ptr` $\mathtt{move}$-construct
- ❌ 从另一个 `unique_ptr` $\mathtt{copy}$-construct
- ❌ 从另一个 `unique_ptr` $\mathtt{move}$-construct

最常见的创建方法就是 "从另一个 `shared_ptr` $\mathtt{copy}$-construct"，注意这种情况下，`weak_ptr` 不参与 `shared_ptr` 的 shared counting (可以参考 My blog [Understanding Weak References](/java/2014/06/04/digest-of-effective-java#weakReference))。正因为这个原因，`weak_ptr` 所指向的 object 可能是已经销毁的，所以 access 之前需要确认一下：

```cpp
auto sp = make_shared<int>(42);
weak_ptr<int> wp = sp;  // copy-construct

wp.use_count();  // == 1. 实际是 sp.use_count()
wp.expired();    // bool. whether the referenced object is already destroyed
wp.lock();       // returns `expired() ? shared_ptr<T>() : shared_ptr<T>(*this)`

if (shared_ptr<int> new_sp = gw.lock())  // N.B. new `shared_ptr` created here
    cout << "wp is not expired. value == " << *new_sp << endl;
else
    cout << "wp is expired."; << endl
```

另外不存在 `make_weak` 函数。

# 5. `Deleter`

`unique_ptr` 和 `shared_ptr` 都可以在创建时附带一个 `Deleter d`，比如：

```cpp
template< typename Y, typename Deleter >  
shared_ptr( Y* ptr, Deleter d );
```

要求是 `d(ptr)` 必须是 well-formed。我们一般会用 `Deleter` 去处理额外的、特殊的 "资源释放" 的任务。

你可以把 `Deleter` 实现成：

1. a struct/class with `void operator()(Y* ptr)`，或者
2. a `std::function`，或者
3. a lambda

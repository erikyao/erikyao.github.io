---
layout: post
title: "C++: <i>override</i>"
description: ""
category: C++
tags: [Cpp-101, C++11]
---
{% include JB/setup %}

基本就是 java `@Override` 的作用：

```cpp
struct B {
    virtual void f1(int) const;
    virtual void f2();
    void f3();
};

struct D1 : B {
    void f1(int) const override;	// OK. f1 matches f1 in the base
    void f2(int) override;			// ERROR. B has no f2(int) function
    void f3() override;				// ERROR. f3 not virtual
    void f4() override;				// ERROR. B doesn't have a function named f4
};
```

并没有说只能用于 function declaration，用在 definition 也是可以的。
---
category: C++
description: ''
tags: []
title: 'C++: type conversion operator'
---

整理自 _C++ Primer, 5th Edition_

-----

## 1. Conversion Operators

```cpp
class SmallInt {
public:
    SmallInt(int i = 0): val(i)
    {
        if (i < 0 || i > 255)
            throw std::out_of_range("Bad SmallInt value");
    }
    operator int() const { // conversion operator (to int)
        return val;
    }
private:
    std::size_t val;
};

SmallInt si;
si = 4; // implicitly converts 4 to SmallInt then calls SmallInt::operator=
si + 3; // implicitly converts si to int followed by integer addition
```

A conversion function must be a member function, may not specify a return type, and must have an empty parameter list. The function usually should be const.

## 2. explicit Conversion Operators

如果不限定 explicit 会怎样？书上给了一个奇葩例子：

```cpp
int i = 42;
cin << i; // this code would be legal if the conversion cin=>bool were not explicit!
```

首先这是 cin，理应用 `>>` 但是这里是 `<<`；但是如果 cin=>bool 的 conversion 不是 explicit 的话，这里 cin 首先会被转成 bool，然后会取 0/1 值，然后 `>>` 就变成了 shift 操作……

加了 explicit 后就 compiler 就不会进行 implicit conversion 了：

```cpp
class SmallInt {
    ...
    explicit operator int() const {
        return val;
    }
	...
};

SmallInt si = 3;			// OK. the SmallInt constructor is not explicit
si + 3;						// ERROR. implicit is conversion required, but operator int is explicit
static_cast<int>(si) + 3;	// OK. explicitly request the conversion
```

## 3. Contextual Conversion to bool

cin=>bool 的 conversion 在 C++11 下已经是 explicit，但是我们还是可以用 `if (cin)` 而不用写 `if ((bool)cin)`，这是为何？因为 `if` 是一个 bool context：在 bool context 内，explicit conversion operator to bool 也是被 implicit 调用的。

更多内容可参考 [Chris's C++ Thoughts: Contextually converted to bool](http://chris-sharpe.blogspot.hk/2013/07/contextually-converted-to-bool.html)。
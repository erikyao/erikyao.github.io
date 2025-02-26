---
title: "LLVM uses plain, unscoped enums (instead of scoped enum classes)"
description: ""
category: LLVM
tags: []
toc: false
toc_sticky: false
---

LLVM 的轻量级 RTTI 经常有这样的代码：

```cpp
class Animal {
public:
    enum AnimalKind { AK_Horse, AK_Sheep }

public:
    Animal(AnimalKind ak) : Kind(ak) {};
    AnimalKind getKind() const { return Kind; }

private:
    const AnimalKind Kind;
};
```

这个 `enum` 可以这么用：

```cpp
Animal::AnimalKind ak = Animal::AK_Horse;
```

- type name 用了 fully qualified name `Amimal::AnimalKind`
- 但 enumerator 用的是 partially qualified name `Animal::AK_Horse`
    - 你用 fully 的 `Amimal::AnimalKind::AK_Horse` 也是 ok 的，但 LLVM 选择不这么干

这里涉及到两个问题：

1. plain `enum` is unscoped
2. `enum class` and `enum struct` are scoped

Since C++11, `enum class` and `enum struct` are recommended (原因：plain `enum` 有隐式类型转换，即 under the hood 一个 plain `enum` 本质还是一个 `int` 之类的). 但 LLVM 的老代码主体还是 plain `enum`。

plain `enum` 具有 "unscoped" 的属性，即: 对 `enum <name>(optional) { <enumerator> = <constant-expression> , ... }` 有：

> Each `<enumerator>` becomes a named constant of the enumeration's type (that is, `<name>`), **visible in the enclosing scope**, and can be used whenever constants are required.

也有不严谨的说法叫 "the namespace of the `enum` is promoted".

更多内容请参考 [CppReference - Enumeration declaration](https://en.cppreference.com/w/cpp/language/enum)。
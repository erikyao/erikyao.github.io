---
title: "LLVM's RTTI Replacement"
description: ""
category: C++
tags: [RTTI, LLVM]
toc: false
toc_sticky: false
---

LLVM 禁止使用 C++ native RTTI，主要是嫌弃 native RTTI 的 performance，并不是说 LLVM 不需要 RTTI 这个 feature。我们可以说 LLVM 自己实现了一套新的 RTTI (以下称 LLVM-style RTTI)，它有:

- `llvm::isa<>`: something like Java `instanceof`
- `llvm::cast<>`: if it fails, it will abort the program. Use it only when you're super confident about the casting
    - `llvm::cast_if_present`: a variant of `llvm::cast<>`, but accepts `nullptr`
- `llvm::dyn_cast<>`: something like `dynamic_cast`
    - `llvm::dyn_cast_if_present`: a variant of `llvm::dyn_cast<>`, but accepts `nullptr`

我们通过 `llvm::isa<>` 来探查一下 LLVM-style RTTI 到底是怎么实现的，它的设计如下：

```cpp
class Animal {  // 基类
public:
    enum AnimalKind { AK_Horse, AK_Sheep }

public:
    Animal(AnimalKind ak) : kind(ak) {};
    AnimalKind getKind() const { return kind; }

private:
    const AnimalKind kind;
};

class Horse : public Animal {  // 子类 #1
public:
    Horse() : Animal(AK_Horse) {};
    static bool classof(const Animal *a) { return a->getKind() == AK_Horse; }
};

class Sheep : public Animal {  // 子类 #2
public:
    Sheep() : Animal(AK_Sheep) {}
    static bool classof(const Animal *a) { return a->getKind() == AK_Sheep; }
}

template <typename To, typename From>
bool isa(const From *from) {
    // `isa<To>(From *from)` checks if `from` is of class `To`
    // works like `from instanceof To`
    return To::classof(from);
}

auto animal_ptr = std::make_unique<Horse>();
isa<Horse>(animal_ptr);  // return true
isa<Sheep>(animal_ptr);  // return false
```

这个设计的优点：

- 使用了 class tags (i.e. `enum AnimalKind`) 来判断 `instaceof`，性能上比 traversal through inheritance hierarchy 要好
    - 这个性能上的优势在 inheritance hierarchy 很深的时候尤其明显，在例子中这个很浅的 hierarchy 中可能不显著

缺点也是有的：

- 严格的 protocol：
    - 所有的基类都要定义 class tags 全集
    - 每个子类都要有一个 class tag
    - 每个子类都要实现 `classof`
- `classof` 中 `a->getKind()` 这句只能 dynamic binding，performance 上算是一点 overhead
- 可读性欠佳：
    - `isa` 那个 template 还是有点绕
    - 名字也不如 `instanceof` 好懂

-----

参考：

1. Section 4.3.1 RTTI replacement and cast operators, [_Clang Compiler Frontend_ by Ivan Murashko](https://www.oreilly.com/library/view/clang-compiler-frontend/9781837630981/)
2. [How to set up LLVM-style RTTI for your class hierarchy](https://llvm.org/docs/HowToSetUpLLVMStyleRTTI.html)
---
title: "Linking the Dots #5: Storage Class Specifiers / Type Qualifiers in C"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Storage Class Specifiers

The $5$ storage class specifiers in modern $C$:

- `auto`: The default for block/local variables (rarely used explicitly).
- `register`: A hint to the compiler to store the variable in a CPU register for speed.
- `static`: Preserves the variable's value even after it goes out of scope and limits linkage to the current file.
- `extern`: Declares a variable or function that is defined in another file or elsewhere in the same file.
- `_Thread_local` (since $C11$): Specifies that a variable is local to a specific thread.

我们一般认为前面 $4$ 个 specifiers **是 exclusive 的**，比如你不能有 `extern static int x;`.

## `auto`

They are often called **automatic** variables because they automatically come into being when the scope is entered and automatically go away when the scope closes.

The `auto` storage class is the _**default**_ storage class for all block/local variables, so it is never necessary to declare something as an `auto`.

## `register`

The `register` storage class is used to define local variables that should be stored in a register instead of RAM (if possible). This means that the variable has a maximum size equal to the register size (usually one word) and can’t have the unary `&` operator applied to it (as it does not have a memory location).

However, there is no guarantee that the variable will be placed in a register or even that the access speed will increase. It is just a hint to the compiler. (向后兼容的产物 (笑))

- A `register` variable can be declared only within a block (you cannot have global or `static` register variables).
    - 至于为什么 `register` 不能是 global 的理由，我觉得这篇 [Why cant register variables be made global?](http://stackoverflow.com/questions/3486715/why-cant-register-variables-be-made-global) 并没有解释得很清楚，姑且一看
- You can use a `register` variable as a formal argument in a function (i.e., in the argument list).

## `static`

- `static` + file/global scope $\Rightarrow$ internal linkage
- `static` local variable inside a function $\Rightarrow$ the variable retains its state between calls to that function
    - we say the variable has "static duration"

## `extern`

See [Linking the Dots #2: Forward Declarations in C](/compiler/2026/01/16/linking-the-dots-2-forward-declarations).

我一向是反对并严重反对把 `extern` 看做是 storage class 的 (as like "this variable is stored somewhere else")。但一个合理的解释是：在 compiler 设计中，这几个 keywords 只是被放在一起构成 storage class 这么一个 set，方便 parser 处理，like:

```python
storage_class_speicifiers = {"auto", "register", "static", "extern", "_Thread_local"}  # fair enough
```

# Type Qualifiers

The $5$ type qualifiers in modern $C$:

- `const`: The value cannot be modified after initialization.
- `volatile`: Tells the compiler the value may change unexpectedly (e.g., hardware registers) and prevents optimization.
- `restrict` (since $C99$): Used with pointers to indicate that the pointer is the only way to access the object it points to.
- `_Atomic` (since $C11$): Ensures operations on the variable are atomic (thread-safe).
- `constexpr` (since $C23$): Similar to `const` but ensures the value is a true constant known at compile time.

type qualifiers **并不存在 exclusiveness 的关系**。

## `const`

`#define PI 3.14159` 对比 `const float pi = 3.14159` 的缺点有：

- No type checking is performed on the name `PI`.
- You can’t take the address of `PI` (so you can’t pass a pointer or a reference to `PI`).
- `PI` cannot be a constant of a user-defined type.
- The meaning of `PI` lasts from the point it is defined to the end of the file; the preprocessor doesn’t recognize scoping.

注意 C++ 中 `const` 对 linkage 有影响：

- In $C$, `const` 对 linkage 没有影响
- In C++, constant values _**default**_ to internal linkage

## `volatile`

`volatile` prevents the compiler from performing any optimizations based on the stability of that variable. That is to say, a `volatile` variable is **always** read whenever its value is required, even if it was just read the line before, for reasons possibly explained in [LL/SC, LA/SR, Memory Consistency, and Cache Coherence](https://listcomp.com/computer-system/2025/02/10/llsc-lasr-memory-consistency-and-cache-coherence).

> [!caution] Architecture-dependent
> 
> The precise meaning of `volatile` is inherently machine dependent and can be understood only by reading the compiler documentation. Programs that use `volatile` usually must be changed when they are moved to new machines or compilers.
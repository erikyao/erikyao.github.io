---
title: "Linking the Dots #4: Linkage in C"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Overview: The $3$ Types of C Linkage (Only $1$ Actually Links)

这里我们参考 [IBM: XL C/C++ for AIX - Program linkage](https://www.ibm.com/docs/en/xl-c-and-cpp-aix/16.1.0?topic=linkage-program), 但需要 tailor 一下去掉 C++ 的部分。

1. External linkage: identifiers can be referred to from any other translation units in the entire program
2. Internal linkage: identifiers can be referred to from all scopes in the current translation unit
3. No linkage: identifiers can be referred to only from the scope it is in

# What is a Translation Unit (TU)?

[wikipedia: Translation unit (programming)](https://en.wikipedia.org/wiki/Translation_unit_(programming)):

> a **translation unit** (or more casually a **compilation unit**) is the ultimate input to a C or C++ compiler from which an object file is generated.

[What is external linkage and internal linkage?](https://stackoverflow.com/questions/1358400/what-is-external-linkage-and-internal-linkage):

> a source file from your implementation plus all the headers you `#include`d in it.

# External Linkage

> In **global scope**, identifiers for the following kinds of entities declared without the `static` storage class specifier have external linkage:
>   
> - An object
> - A function

这里强调 file/global scope，与前文 [Linking the Dots #3: C Scopes > 与 linking/linkage 的关系](/2026/01/16/linking-the-dots-3-scopes#2-与-linkinglinkage-的关系) 是一致的。

> [!caution] "object" in $C$ context
> 
> variable, pointer, member of an array, member of a struct, memory allocated via `malloc` 这些都算是 $C$ 的 object, 它的严格定义是：
> 
> > An object is a region of data storage in the execution environment, the contents of which can represent values.
> 
> 在我们讨论 linkage 的范围内，这里这个 "an object" 其实就只有 variable 这么一种情况。有时候 document 写得太保守、太怕出错了，就会搞得很难理解。

# Internal Linkage

> The following kinds of identifiers have internal linkage:
> 
> - **Objects or Functions** explicitly declared with the `static` storage class specifier at **file/global scope**.
> - **Identifiers** that were previously declared with internal linkage (e.g., a second declaration of the same `static` variable).

> [!caution] WTF
> 
> internal linkage 的 variable 或者 function 并不要 linker 来 resolve; compiler 自己就能搞定，毕竟在一个 translation unit 内部。
> 
> Then why on earth did you decide to call it "linkage"?

# No Linkage

> The following kinds of identifiers have no linkage:
> 
> - **Local Objects:** ~~declared inside a block that is not explicitly marked with the `extern` keyword.~~
>     - This includes `auto` and `register` variables.
> - **Function Parameters** (which are local to that function body)
> - **Labels** used for `goto` targets are restricted to the function where they are defined.
> - **Type Definitions and Metadata:** this includes `typedef` names, `enum` enumerators, and `struct`/`union` declared within a local scope.

> [!caution] `extern` has NOTHING to do with linkage
> 
> 真的非常讨厌把 `extern` 纳入 linkage 的讨论。
> 
> 简单一点的话，可以认为 local object **defined, instead of declared,** inside a block have no linkage.
> 
> 你 `extern` 是 forward declaration, 这个 variable 的 linkage 要看它真正的定义。比如：
> 
> ```c
> void process_data(void) {
>     // 你这个 extern 和 answer 的实际 linkage 没有半毛钱关系
>     // 你只是在 **要求** answer 是 external linkage，否则 link 不上
>     extern int answer;  
>     // ... use answer ...
>     
>     int whatever = 3;  // internal linkage
> }
> ```

因为 type 是 no linkage，所以如果要 import 一个 type，一般的做法有两种：

1. 把 type 的 definition 放到 header `secondary.h` 中，然后 `main.c` 去 `#include "secondary.h"`，做成一个 translation unit, 让它实际变成 internal linkage
2. 或者用 [The “Pointer Trick” (PIMPL: Pointer to IMPLementation)](/compiler/2026/01/16/linking-the-dots-2-forward-declarations#the-pointer-trick-pimpl-pointer-to-implementation)

> You cannot use a name with no linkage to declare an entity with linkage. For example, you cannot use the name of a structure or enumeration or a `typedef` name referring to an entity with no linkage to declare an entity with linkage. 
> 
> The following example demonstrates this: 
> 
> - the compiler will not allow the declaration of `a1` with external linkage — structure `A` has no linkage. 
> - the compiler will not allow the declaration of `a2` with external linkage — the `typedef` name `myA` has no linkage because `A` has no linkage.
> 
> ```c
> int main() {
>     struct A { };
>     // extern A a1;  // compile error
>     
>     typedef A myA;
>     // extern myA a2;  // compile error
> }
> ```

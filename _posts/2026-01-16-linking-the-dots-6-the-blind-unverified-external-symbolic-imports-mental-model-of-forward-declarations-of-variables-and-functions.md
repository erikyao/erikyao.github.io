---
title: "Linking the Dots #6: The \"<i>blind, unverified, external symbolic imports</i>\" Mental Model of Forward Declarations of Variables and Functions"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

intuitively 可以把 forward declaration of variables and functions 理解成一种**基于信任的、盲目的、无验证的 external symbolic imports**, 而且具体的工作会交予两个参与者：

1. compiler (如果 definition 就在同一个 source file 里)
2. linker (如果 definition 在别的 source file 里)

# "blind, unverified"

我说它 **基于信任的、盲目的、无验证的** 是因为对比 Java 的 **strict compile-time validation** of imports, $C$ 对 imports 的处理非常宽松。

比如：

```c
// secondary.c
int answer = 42;
```

```c
// main.c
extern int my_answer;
```

- Compiler 说 OK，两个文件都能单独编译
- Linker 说 Error，`my_answer` 是 undefined

再比如：

```c
// secondary.c
int answer = 42;
```

```c
// main.c
extern float answer;
```

- Compiler 说 OK，两个文件都能单独编译
- Linker 说 OK，`answer` 能 resolve
    - **是的，linker 不会 check type**
- Runtime 说 Error，`answer` 类型不对

**而 Java 的 imports 是 `javac` 在 compile-time 来检查的，非常早就能发现错误**。

# "symbolic"

首先我们区分一下 identifier 和 symbol:

- identifier 是 language 层面的概念
- symbol 是 linker/object file 层面的概念
    - Every symbol has an entry in SYMTAB
    - It represents **a memory address** that other parts of the program might need to "jump to" or "read from."

然后在 $C$ 中，什么才算是 symbol (配享 SYMTAB)？

| **Case** | **Entity Type**      | **Linkage Type** | **Is it a Symbol?** | **Why?**                                                   |
| -------- | -------------------- | ---------------- | ------------------- | ---------------------------------------------------------- |
| 1        | **Global Function**  | External         | **Yes**             | Other files need to find its address to call it.           |
| 2        | **Global Variable**  | External         | **Yes**             | Other files need to find its address to access it.         |
| 3        | **Static Function**  | Internal         | **Yes**             | Restricted to one file, but still needs an address.        |
| 4        | **Static Variable**  | Internal         | **Yes**             | Restricted to one file, but still needs an address.        |
| 5        | **Local Variable**   | No               | **No**              | It lives on the "stack"; address not fixed.                |
| 6        | **Typedef / Struct** | No               | **No**              | No address since they are not even stored in object files. |

forward declaration of variables and functions 对应 case $1$ 和 case $2$，所以称 "external symbolic imports". 

> [!caution] 物理上没有严格要求是 `extern` variable or function 必须 defined 在 external source file
> 
> 在 [Linking the Dots #2: Forward Declarations in C > Forward Declaration 不一定要涉及 linking](/compiler/2026/01/16/linking-the-dots-2-forward-declarations#forward-declaration-不一定要涉及-linking) 里已经讨论过了。

我们顺便讨论下 Case $3$, $4$, $6$.

## Case $3$, $4$ $\Rightarrow$ `extern` 和 `static` 无法共存 $\Rightarrow$ Compile-time Error

我们在 [Linking the Dots #5: Storage Class Specifiers / Type Qualifiers in C](/compiler/2026/01/16/linking-the-dots-5-storage-class-specifiers-type-qualifiers-in-c) 中已经讲过：`extern` 和 `static` 有 exclusiveness 关系。这个意图就很矛盾：

1. `extern` 表示要 import 一个 external linkage 的 `answer` 
2. `static` 表示要 tentatively define 一个 internal linkage 的 `answer`

把它们连用会直接 compile-time error:

```c
// secondary.c
static int answer = 42;
```

```c
// main.c
extern static int answer;  // Compile-time error: 'static' cannot combine with previous 'extern' declaration specifier

int main() {
    return answer;
}
```

如果你在 `main.c` 中写 `static int answer;` 就直接变成了 tentative definition, 且不会有 linking 动作。

```c
// secondary.c
static int answer = 42;
```

```c
// main.c
static int answer;  

int main() {
    return answer;  // OK, but answer == 0, not linked to secondary.c
}
```

## Case $6$ $\Rightarrow$ Forward declarations of Types, OK, but not "symbolic"

具体的写法参考 [The "Pointer Trick" (PIMPL Pointer to IMPLementation)](/compiler/2026/01/16/linking-the-dots-2-forward-declarations#the-pointer-trick-pimpl-pointer-to-implementation).

但是这不算是 "symbolic imports", **因为 types (`struct`, `enum` etc.) 都不算是 symbol**. 那么问题来了，如果 types 不是 symbols、不存在 SYMTAB 里，那它存在哪里？答案是：**types 操作会被 compiler 直接分解成 memory 操作**，包括：

1. add padding between fields for alignment
2. replace `sizeof(type)` with a constant number (calculated based on the fields, padding, and alignment rules)
3. use memory offset for accessing fields

举个例子，假如你有 define `struct Point { int x; int y; };` 然后有：

```c
struct Point p; 

p.x = 5;
int size = sizeof(struct Point);
```

它会被直接 compile 成：

```c
&(p + 0) = 5;  // since member `x` is at offset 0 of `struct Point`
int size = 8;  // `sizeof` is gone, replaced with two integers' size
```

> [!caution] debug 时的 types 处理
> 
> If you compile with debug symbols (`-g`), the object file includes a separate debug section (like DWARF in Mach-O) that records type information just like symbols.
> 
> 因为你可能要动态查看 types 的 information，"compile 成 memory 操作" 无法满足你这个需求。

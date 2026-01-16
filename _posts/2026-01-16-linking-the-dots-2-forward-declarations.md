# Intro

In [Linking the Dots #1: An Example of Linking](/compiler/2026/01/16/linking-the-dots-1-an-example-of-linking), we have the following source code:

```c
// secondary.c

int get_answer() {
    return 42;
}

int another_answer = 100;
```

```c
// main.c

// Forward declaration of a function
extern int get_answer();

// `extern` is often considered redundant there,
//   because compiler assumes any function without a "body" `{}` is external,
//   i.e. function names have external linkage by default.
// int get_anwser();

// Forward declaration of a variable
// `extern` is necessary here
extern int another_answer;

// Without `extern`, it becomes a tenative definition.
//   More on that later.
// int another_answer;

int main() {
    return get_answer() + another_answer;
}
```

Note that the two declarations (of `int get_answer()` and `int another_answer`) are **forward declarations**. 

# Forward Declaration 不一定要涉及 linking

forward declaration 的作用就是 **to declare a name before its definition appears**, 所以你在同一个 source file 中也是能做 forward declaration 的，比如：

```c
// main.c

// Forward declaration of a function
extern int is_anwser_ok();

// Forward declaration of a variable
extern int third_answer;

int is_answer_ok() {
    return 1;
}

int third_answer = 999;
```

虽然我们这里用的 `extern` 会给我们一种 _"the definition is in an external file"_ 的感觉，但它的实际作用应该理解成 _"the definition is just elsewhere"_.

> [!info] 历史包袱
> 
> `extern` 这种直觉上的违和感实属历史包袱，因为一开始 (like from the B language) 它的确表示的是 *"the definition is in an external file"* (严格来说应该是 *"in an external translation unit"*) 的作用。后来用法演化了，C language 又要 backward compatibility，就搞成了现在这个样子。

# `#include` a header 只是一种工程上的 best practice, 仅此而已

从 [Intro](#intro) 可以看出，**我们的 `main.c` 不需要 `#include "secondary.c"`，linker 就能把这俩 modules 连接起来**。理论上，无论你有多少个 dependencies，你把它们在 `main.c` 中全部 forward declare 一遍也是可以的，linker 自会帮你打理：

```c
// main.c

extern int var_001;
...
...
extern int var_800;

extern int fun_001();
...
...
extern int fun_800();
```

这么写当然没问题，就是在工程中有点丑，所以我们可以把这些 forward declaration 全部写进一个 header：

```c
// dependencies.h
extern int var_001;
...
extern int var_800;

extern int fun_001();
...
extern int fun_800();
```

然后你的 `main.c` 就很清爽了：

```c
// main.c
#include "dependencies.h"
```

所以从某种程度上说：

- headers 是给 client scripts (比如 `main.c`) 使用的，它相当于是 _"Hi, client! I've promised these promises for you."_
- headers (mechanically) 并没有和 its implementation scripts 强绑定
    - 它们只有 logically 的绑定关系，且这个关系没有人去 enforce/check
- 综合起来就是：Headers are conceptually independent of implementations, but correctness relies on external discipline

# Forward Declaration of Variables

## 写法

- **必须**要写 `extern`.
- 最常见的是在 global scope 里 declare，但在 local scope 里 declare 也是可以的

```c
// Forward declaration of a variable
// `extern` is necessary here
extern int another_answer;

void dig(void) {
    extern int hidden_answer; 
    return hidden_answer;
}
```

## Digression: Re-declaration

下面这么写是 ok 的，属于 re-declaration，但不算是 forward declaration:

```c
int x = 42;   // definition at file scope

void f(void) {
    extern int x;   // re-declaration, refers to the same x
    x += 1;
}
```

有点类似 Python 的 `global` (但明显实现不了 Python 的 `nonlocal` 效果)。

## Digression: Tentative Definition (BTW it's a bad practice)

为什么 forward declaring a variable 一定要写 `extern`? 因为不写的话会变成 tentative definition:

```c
// File Scope
int answer;       // This is a Tentative Definition (int answer = 0;)
extern int anwer; // This is a Forward Declaration
```

- tentative definition 只能用于 variables/objects, 不能用于 functions/types
- tentative definition 只能用于 file scope (i.e. global variables)
    - block scope 内不存在 tentative definition
    - block scope 内所有类似 `int anser;` 的都算是 full definition 
- tentative definition 的作用是：
    - 如果只有一个 tentative definition, compiler 会把 `int answer;` 视为一个 full definition 并 initialize 为 0
    - 如果有多个 tentative definitions, compiler 会把它们视为一个 tentative definition
    - 如果有 tentative definition(s) 且有一个 real definition, compiler 不会报 "redefinition" error, 只会视为 assignment

tentative definition 还有个很奇特、很无聊的规矩：

- 你不能在同一个 source file 中，在 real definition 后面再接一个 tentative definition
    - 也不能有两个 real definitions (这是明显的 "redefinition" error)
- 但如果你的 tentative definition(s) 和对应的一个 real definition 是分散在不同的 dependencies 中，linker 会自动把 real definition 放最后

用代码表示：

```c
// File Scope
int x;      // Tentative
int x;      // Tentative
int x = 5;  // Real
int x;      // Tentative - ERROR! (already had real definition)
```

```c
// file1.c
int x;       // Tentative

// file2.c
int x = 42;  // Real

// main.c
#include <stdio.h>

extern int x;

int main() { 
    printf("X: %d\n", x); 
    return 0; 
}

// Compile (any order works)
// ᐅ gcc file2.c file1.c main.c -o main.out
// ᐅ gcc file1.c file2.c main.c -o main.out
```

> [!caution] linker 的运行是有它自己的 order 的，只是在 tentative definition 上有点特殊
> 
> - **Reading files**: Yes, happens in order
> - **Collecting symbols**: Yes, happens as files are read
> - **Resolving tentative vs real definitions**: No, happens after ALL files are read

> [!caution] 这些细节完全不用记，因为是 tentative definition 是彻彻底底的 bad practice
> 
> 我想不到现实中有任何的理由会用到 tentative definition.
> 
> 这里介绍 tentative definition 的唯一作用就是演示 "为什么 forward-declare a variable **必须**要写 `extern`".

> [!caution] 也不需要去纠结 tentative definition 到底要怎么翻译

# Forward Declaration of Functions

- 可以用 `extern`
- 但**一般不写** (我这里写是为了和 forward-declare variables 统一) 

# Digression: Forward Declaration of Types 

> [!caution] 这种情况使用 `extern` 是语法错误

When you forward declare a type (specifically a `struct` or `union`), you are creating what the $C$ standard calls an **Incomplete Type**:

```c
struct Node;  // Forward declaration of a struct
              // Now `struct Node` is an incomplete type.
```

When the compiler sees this line, it adds `struct Node` to its list of known types, but it marks it as "incomplete." It knows the _name_ exists, but it does not know the _size_ of the struct or what _members_ (fields) it contains.

## The "Pointer Trick" (PIMPL: Pointer to IMPLementation)

当我们 forward-declare 了 `struct Node;` 后，我们可以：

```c
struct Node *ptr;            // OK. Declared a pointer of the incomplete type

int func(struct Node *ptr);  // OK. Declared a function with such a pointer as a paramter

struct Node * create();    // OK. Declare a function with such a pointer as return type

struct ValueNode {         // OK. Define a struct with such a pointer as a member
    int value;
    struct Node *ptr;
};

typedef struct Node TN;    // OK.
```

This works because of how $C$ handles memory. To the compiler, **all pointers are the same size** (usually 4 bytes on 32-bit systems or 8 bytes on 64-bit systems), regardless of what they point to.

- If you declare `struct Node *ptr;`, the compiler thinks: _"I need to allocate 8 bytes for a pointer. I don't care what `Node` looks like inside because I'm just allocating space for the address, not the actual object."_
- If you declare `struct Node instance;`, the compiler thinks: _"I need to allocate space for the object itself. Since I haven't seen the definition yet, I don't know if it's 4 bytes or 100 bytes. I must throw an error."_

Rule of thumb is like:

| **Operation**               | **Allowed?** | **Why?**                                          |
| --------------------------- | ------------ | ------------------------------------------------- |
| **`sizeof(struct Node)`**   | ❌ **No**    | Compiler doesn't know the size yet.               |
| **`ptr->member`**           | ❌ **No**    | Compiler doesn't know where the member is.        |
| **`struct Node instance;`** | ❌ **No**    | Compiler doesn't know how much RAM to give it.    |
| **`ptr1 = ptr2;`**          | ✅ **Yes**   | Copying an address is just copying a number.      |
| **`void* v = ptr;`**        | ✅ **Yes**   | All pointers can be treated as generic addresses. |

## 对比

| **Feature**                | **Syntax Example** | **What the compiler learns**              | **What is missing?**                                                                                             |
| -------------------------- | ------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Type Forward Decl.**     | `struct Node;`     | "There is a type named Node."             | **The Layout.** The compiler doesn't know the size or fields. You cannot dereference it yet.                     |
| **Variable Forward Decl.** | `extern int x;`    | "There is an integer `x` somewhere else." | **The Location.** The compiler knows the size (int), but leaves the specific memory address to the Linker.       |
| **Function Prototype**     | `void foo(int);`   | "There is a function that takes an int."  | **The Body.** The compiler knows how to _call_ it (push int to stack), but doesn't have the code implementation. |

| **Goal**                              | **Correct Syntax**             | **Use extern?**                                    |
| ------------------------------------- | ------------------------------ | -------------------------------------------------- |
| **Forward Declare a Type**            | `struct MyStruct;`             | **No.** Just the name.                             |
| **Forward Declare a Global Variable** | `extern struct MyStruct *ptr;` | **Yes.** You are pointing to a specific address.   |
| **Forward Declare a Function**        | `extern int calculate(int x);` | **Optional.** (Functions are `extern` by default). |


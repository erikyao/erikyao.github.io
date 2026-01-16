---
title: "Linking the Dots #1: An Example of Linking"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Source Code

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

# Pre-linking Steps

Step 1 - Preprocessing (C $\Rightarrow$ C)

```bash
ᐅ gcc -E main.c -o main.i
ᐅ gcc -E secondary.c -o secondary.i
```

Step 2 - Compilation (C $\Rightarrow$ Assembly)

```bash
ᐅ gcc -S main.i -o main.s
ᐅ gcc -S secondary.i -o secondary.s

# ᐅ or 
#   ᐅ cc1 main.c -o main.s
#   ᐅ cc1 secondary.c -o secondary.s
```

> [!NOTE] `cc1` 包含了 preprocessing 步骤，所以可以直接处理 `.c`

Step 3 - Assembling (Assembly $\Rightarrow$ Relocatable Object/Binary)

```bash
ᐅ gcc -c main.s -o main.o
ᐅ gcc -c secondary.s -o secondary.o

# or 
#   ᐅ as main.s -o main.o
#   ᐅ as secondary.s -o secondary.o
```

Or directly C $\Rightarrow$ Relocatable Object/Binary:

```bash
ᐅ gcc -c main.c -o main.o
ᐅ gcc -c secondary.c -o secondary.o
```

# Linking

Relocatable Object/Binary $\Rightarrow$ Executable Object/Binary

## Static Linking

**Method 1:** use the object file `secondary.o` directly:

```bash
ᐅ gcc main.o secondary.o -o main_static.out
```

**Method 2:** create a _static library archive_ from `secondary.o`:

```bash
ᐅ ar rcs secondary.a secondary.o

# link like above
ᐅ gcc main.o secondary.a -o main_static.out
```

- `ar` is an archive tool, just like `zip` or `tar`
    - option `r`: replace/add files to archive
    - option `c`: create archive if it doesn't exist
    - option `s`: create an index (symbol table) for faster linking
- 注意 `.a` 并不是 Mach-O format, 它也不是 object file, 它单纯就是个能被 link 的压缩包格式

> [!NOTE] 如果你有很多个 dependencies，那么 _static library archive_ 无疑是工程上的 **best practice**.

## Dynamic Linking

**Method:** create a dynamic lib from `secondary.o`:

```bash
ᐅ gcc -dynamiclib secondary.o -o secondary.dylib
ᐅ gcc main.o secondary.dylib -o main_dynamic.out
```

> [!NOTE] `.dylib` on macOS is equivalent to `.so` on Linux.

> [!NOTE] `.dylib` 是 Mach-O format

> [!NOTE] `.dylib` 不是 object file, 因为 "object", "executable", "dynamic lib" 是三种平行的文件类型

## Digression: Search Pattern of `gcc -L -l`

我们也可以这么做 static linking:

```bash
ᐅ ar rcs libsecondary.a secondary.o
ᐅ gcc main.o -L. -lsecondary -o main_static.out
```

也可以这么做 dynamic linking:

```bash
ᐅ gcc -dynamiclib secondary.o -o libsecondary.dylib
ᐅ gcc main.o -L. -lsecondary -o main_dynamic.out
```

这里 `gcc -L -l` 有特定的 search pattern:

- `-L.` 指定 search directory 为 `.` (current folder)
- 它这个 search pattern 会默认你的 lib name 以 `lib` 开头，所以 `-lsecondary`  实际指定的是 `libsecondary` 这个 name
    - 所以我们在创建 dylib 时特意起了 `libsecondary` 这个名字
    - 这个 search pattern 主要是为了区分 user lib 和 system lib

此时就有一个问题：如果我们同时有 `libsecondary.a` 和 `libsecondary.dylib`, `-lsecondary` 如何确定是 static linking 还是 dynamic linking? 它其实有一个规则：

- 优先找 `libsecondary.dylib` 做 dynamic linking
- 没找到 `dylib` 就找 `libsecondary.a` 做 static linking
- 它不会去找 `libsecondary.o`

如果我们同时有 `libsecondary.a` 和 `libsecondary.dylib`, 我们可以用 option `-static` force 执行 static linking:

```bash
ᐅ gcc main.o -L. -static -lsecondary -o main_static.out
```

# Inspection

## Check for Dependencies

```bash
ᐅ otool -L main_static.out
main_static.out:
	/usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1336.61.1)
```

- `main_static.out` does NOT need `secondary.dylib` nor `secnondary.o` because it's already wrapped inside the binary

> [!info] `libSystem.B.dylib` plays **the same _role_** on macOS that `glibc.so` plays on Linux (as the **C standard library**)
>   
> 它俩实现上略有不同：`glibc.so` 是一个 monolith lib; `libSystem.B.dylib` 是一个 facade to multiple libs.

```bash
ᐅ otool -L main_dynamic.out
main_dynamic.out:
	secondary.dylib (compatibility version 0.0.0, current version 0.0.0)
	/usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1336.61.1)
```

- `main_dynamic.out` knows it needs the external `secondary.dylib`

## Check for Symbols

```bash
ᐅ nm main_static.out
0000000100000000 T __mh_execute_header
0000000100004000 D _another_answer       # linked variable
0000000100003f90 T _get_answer           # linked function
0000000100003f60 T _main
```

```bash
ᐅ nm main_dynamic.out
0000000100000000 T __mh_execute_header
                 U _another_answer      # undefined variable
                 U _get_answer          # undefined function
0000000100003f70 T _main
```

- `T`: the symbol is in `(__TEXT, __text)` 
- `D`: the symbol is in `(__DATA, __data)` (initialized data)
- `U`: the symbol is undefined
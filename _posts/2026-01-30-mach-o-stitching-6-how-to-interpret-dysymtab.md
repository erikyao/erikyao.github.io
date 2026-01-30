---
title: "Mach-O Stitching #6: How to Interpret Dysymtab"
description: ""
category: Compiler
tags: []
toc: false
toc_sticky: false
---

# Basic Structure of Dysymtab

我们在 [Mach-O Stitching #3: Load Commands > `LC_DYSYMTAB`](https://listcomp.com/compiler/2026/01/30/mach-o-stitching-3-load-commands#load-command-3-rightarrow-lc_dysymtab-rightarrow-%E6%8F%90%E4%BE%9B-dynamic-linking-metadata) 中已经详述。

# Experiment Code

```c
// secondary.c
int shared_int = 42;
int shared_float = 100.0;
void shared_func() {}
```

```c
// main.c
extern int shared_int; 
extern float shared_float;
void shared_func();

int main() { 
    shared_int = 43;
    shared_float = 101.0;
    shared_float = 102.0;
    shared_func(); 
    shared_func(); 
    shared_func(); 
    return 0; 
}
```

```bash
# ᐅ clang -O0 -c secondary.c -o secondary.o
ᐅ clang -O0 -c main.c -o main.o
# ᐅ clang -O0 main.o secondary.o -o main.out
```

这里是一个大的 static linking 的 experiment code，但演示 dysymtab 只用 `main.o` 就可以了。

# Experiment Result

查看 object file 的 symtab:

```bash
ᐅ objdump --syms main.o
main.o:     file format mach-o-x86-64

SYMBOL TABLE:
0000000000000000 g       0f SECT   01 0000 [.text] _main
0000000000000000 g       01 UND    00 0000 _shared_float
0000000000000000 g       01 UND    00 0000 _shared_func
0000000000000000 g       01 UND    00 0000 _shared_int
```

查看 object file 的 dysymtab:

```bash
ᐅ ᐅ otool -l main.o | grep -B 1 -A 19 "LC_DYSYMTAB"
Load command 3
            cmd LC_DYSYMTAB
        cmdsize 80
        
      ilocalsym 0  # starting from symtab[0]
      nlocalsym 0  # there is 0 localsym
     
     iextdefsym 0  # starting from symtab[0]
     nextdefsym 1  # there is 1 extdefsym 
                   # meaning symtab[0] == `_main` is external defined
      
      iundefsym 1  # starting from symtab[1]
      nundefsym 3  # there are 3 undefsyms 
                   # meaning symtab[1:4] == [`_shared_float`, `_shared_func`, `_shared_int`] are undefined
            ... ...
```

> [!NOTE] Symbol Grouping & Sorting
> 
> See [Mach-O Stitching #3: Load Commands > `LC_DYSYMTAB`](https://listcomp.com/compiler/2026/01/30/mach-o-stitching-3-load-commands#load-command-3-rightarrow-lc_dysymtab-rightarrow-%E6%8F%90%E4%BE%9B-dynamic-linking-metadata)

> [!NOTE] `extdef` means **external & defined**, not _externally defined_
> 
> - if `n_type & N_EXT == 1` $\Rightarrow$ symbol is external
> - if `n_type & N_TYPE == N_ABS or N_INDR or N_SECT` $\Rightarrow$ symbol is defined
> - if both of the above conditions are satisfied $\Rightarrow$ symbol is a `extdefsym`
> 
> See [Mach-O Stitching #5: How to Interpret Symtab > `n_type`](https://listcomp.com/compiler/2026/01/30/mach-o-stitching-5-how-to-interpret-symtab#n_type).

> [!NOTE] `_main` 与 `LC_MAIN`
> 
> `_main` 通常被视为 `extdef`, 目的是为了让 OS 或者 `dyld` 能够从文件外部“看到”并跳转到这个函数。如果你把 `main` 设为 `static` (虽然 C 标准不允许这样做)，linker 就找不到它，程序也就无法启动。
> 
> `LC_MAIN` 中指定的 offset 就是 `_main` 在 executable 中的起始位置。

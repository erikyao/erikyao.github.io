---
title: "Mach-O Stitching #8: Static Linking – Who Does What?"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# "Compiler Proper"

Throughout this series, **compiler** refers to the _compiler proper_: the component that translates C $\Rightarrow$ Assembly. Producing an executable is treated as a **separate static linking phase**, orchestrated by a **compiler driver**, such as `gcc` and `clang`.

In the `gcc` toolchain, `cc1` is the _compiler proper_; while in `clang`, it's `clang -cc1`

```txt
gcc hello.c
 ├─ cc1            # C front-end + optimizer + code generation
 ├─ as             # GNU assembler
 └─ ld             # GNU linker
 
clang hello.c
 ├─ clang -cc1     # front-end + LLVM IR + optimization + codegen
 ├─ as             # system assembler (or integrated assembler)
 └─ ld             # system linker (e.g., ld64 on macOS)
```

# Defining the Boundary: Precursor Jobs vs. Core Process of Static Linking

Static Linking 是一个组合动作，它由 Symbol Resolution 和 Relocation 这两大核心步骤组成。而这两步理论上都是由 Static Linker 完成的，**虽然 compiler 和 assembler 的 precursor jobs 是不可或缺的，但这些 precursor jobs 是不算在 static linking 的过程中的**。

**我始终觉得这里缺一个更大的概念或者名称来包含这些 precursor jobs 和 static linking**，不如我们称其 _Materialization of External Symbols_:

```txt
┌───────────────────────────────────────┐
│  Materialization of External Symbols  │
│     ┌────────────────────────────┐    │
│     │  Compiler's Precursor Job  │    │
│     └────────────────────────────┘    │
│                  \/                   │
│    ┌─────────────────────────────┐    │
│    │  Assembler's Precursor Job  │    │
│    └─────────────────────────────┘    │
│                  \/                   │
│  ┌─────────────────────────────────┐  │
│  │  Static Linker's Static Linking │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘
```

更具体一点的话：

```txt
    [ main.c ]
    +-------------------+
    |  High-level logic |
    +-------------------+
         |
         v
   (( COMPILER ))  <-- PERFORMER: Lexical/Syntax/Semantics Analysis + Codegen for C
         |             READS: C/C++ Code
         |             WRITES: Assembly with "Hints" (@GOT, etc.)
         v
    [ main.s ]
    +-----------+
    |  Assembly |
    +-----------+
         |
         v
   (( ASSEMBLER ))  <-- PERFORMER: Lexical/Syntax + Codegen for Assembly
         |              READS: Assembly & Directives
         |              WRITES: Machine code + Metadata
         v
    [ OBJECT.o ]  (The "Incomplete" Binary)
    +---------------------------------------------+
    | .text   :  Instructions with 0x00 holes     |
    | .symtab :  List of defined/undefined names  |
    | .reloc  :  The "Sticky Notes" for Linker    |
    +---------------------------------------------+
         |
         |  (Combined with other [ .o ] and [ .a ] files)
         v
(( STATIC LINKER ))  <-- PERFORMER: The "straightforward" Static Linking
         |
         |   PHASE 1: SYMBOL RESOLUTION
         |   - Scans all .symtab sections.
         |   - Matches "Undefined" names to "Global" addresses.
         |
         |   PHASE 2: RELOCATION
         |   - Scans all .reloc entries.
         |   - Patches the 0x00 holes in .text with real addresses.
         |
         v
    [ EXECUTABLE ]  (The "Complete" Binary)
    +---------------------------------------------+
    | .text   :  Final code with hardcoded jumps  |
    | .data   :  Variables in fixed locations     |
    +---------------------------------------------+
```

# Compiler 做了哪些工作

compiler 为 symbol materialization 做的 precursor job 基本上就是给 assembler 留一些 hint. 比如我们在 [`.s` assembly](https://listcomp.com/compiler/2026/01/30/mach-o-stitching-7-how-to-interpret-relocs-relocation-entries#%E6%96%B9%E6%B3%95%E4%B8%80%E7%9B%B4%E6%8E%A5%E7%BC%96%E8%AF%91-c-rightarrow-assembly-%E4%BB%A5%E4%B8%8B%E7%A7%B0-s-assembly) 里看到的是：

```nasm
movq _shared_int@GOTPCREL(%rip), %rax
```

> [!info] 注意这是 AT&T 汇编语法，与 Intel 语法略有不同

- `_shared_int` 是 symbol name
- `@GOTPCREL` 整体是 relocation modifier
    - 其中 `GOTPCREL` 是 relocation type
- `(%rip)` 是 base register

assembler 看到这一句自然就明白了这里需要一个 reloc.
 
# Assembler 做了哪些工作

除了 `_shared_int@GOTPCREL(%rip)` 这种明显的，assembler 自己还有其他的判断 external symbols 的方法。我们可能长久忽略的一个事情是：**assembler 本身就是一个 Assembly 的 parser**, 它对 symbol 的判断能力是毋庸置疑的。

> [!faq] 你可能要疑问：“external symbol 的识别” 工作为什么在 compiler 层面做了一遍之后，在 assembler 层面还要做一遍？
> 
> 这是 C 编译器的 stage-wise 或者说 stage-independent compilation 的设计。简单说就是相比这么点 overhead，我们更 value 这种设计的 "Separation of Concerns".

还是用同一句 instruction，对比一下有：

```nasm
movq	_shared_int@GOTPCREL(%rip), %rax  # `.s` assembly (by compiler)
movq	(%rip), %rax                      # `.o` assembly (by assembler)
```

这里 assembler 对 `_shared_int` 这个 external symbol 做了这么几件事情：

1. 把 `_shared_int@GOTPCREL` 的 $\operatorname{displacement}$ 置 $0$
2. 给 `_shared_int@GOTPCREL` 写了一条 reloc 供 static linker 参考

# Static Linker 做了哪些工作

具体的工作流参考 [Mach-O Stitching #7: How to Interpret Relocs (Relocation Entries)](https://listcomp.com/compiler/2026/01/30/mach-o-stitching-7-how-to-interpret-relocs-relocation-entries#%E7%BB%BC%E5%90%88%E5%88%86%E6%9E%90).

这里额外提一下 symbol resolution 和 relocation 的分界线，有点微妙：

1. Static linker received multiple object files.
2. Static linker scans all symbol tables. Like it sees the reference to `x` in `file_A.o` and finds the definition of `x` in `file_B.o`. **Symbol resolution for `x` is now complete**. 
3. Now that static linker knows exactly where `x` will be located in the final memory map, it goes back to `x`'s `reloc.address` and overwrites the zeros with the real address. **Relocation for `x` is now complete**.
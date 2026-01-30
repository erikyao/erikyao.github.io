---
title: "Mach-O Stitching #3: Load Commands"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Overview

Load commands are **instructions** to the dynamic linker and loader that tell the operating system **how to load and set up a program in memory** when it's executed.

Why do we need load commanders? When you run a program, the OS doesn't just dump the file into memory and start executing. It needs to know some information or metadata, which is provided by load commands.

Common load commands include:

| Load Commands       | Meaning                                                   |
| ------------------- | --------------------------------------------------------- |
| `LC_SEGMENT_64`     | "Map this segment at this address with these permissions" |
| `LC_LOAD_DYLIB`     | "I need this library to run" (e.g., `libc`)               |
| `LC_MAIN`           | "Start execution at this offset" (entry point)            |
| `LC_DYLD_INFO`      | "Here's binding/relocation info for dynamic linking"      |
| `LC_CODE_SIGNATURE` | "Verify my code signature here"                           |
| `LC_SYMTAB`         | "Symbol table is here"                                    |

The loading process is like:

1. Kernel reads Mach-O header
2. Kernel parses load commands
3. For each `LC_SEGMENT_64`, allocate memory, set permissions, copy data
4. For each `LC_LOAD_DYLIB`, recursively load dependencies
5. `dyld` performs symbol binding/relocation
6. Jump to entry point specified by `LC_MAIN`

# Example

```c
// vanilla.c

int a = 10;          // stored in __DATA segment

int main() {         // stored in __TEXT segment
    return a;
}
```

```bash
ᐅ clang -c vanilla.c -o vanilla.o
```

```bash
ᐅ otool -l vanilla.o  # Display the load commands
```

## Load Command #0 $\Rightarrow$ `LC_SEGMENT_64` $\Rightarrow$ 引导读取 segments/sections

```bash
Load command 0
      cmd LC_SEGMENT_64
  cmdsize 392
  segname                      # segment name is empty, so this is an unnamed segment
   vmaddr 0x0000000000000000   # Virtual Memory Address where this segment should be loaded
   vmsize 0x0000000000000078   # Virtual Memory Size to hold this segment
  fileoff 552                  # this segment's content starts at file (i.e. `vanilla.o`) offset 472 (in byte) 
 filesize 120                  # this segment's content is 112-byte long from `fileoff` in this file 
  maxprot 0x00000007           # 0x7 == Read (4) + Write (2) + Execute (1) permissions
 initprot 0x00000007           # ditto
   nsects 4                    # this unnamed segment has 4 sections
    flags 0x0

Section                        # section #1 is (__TEXT, __text)
  sectname __text              # contains executable code
   segname __TEXT
      addr 0x0000000000000000
      size 0x0000000000000013  # this section is 13-byte long
    offset 552
     align 2^4 (16)
    reloff 672
    nreloc 1
     flags 0x80000400
 reserved1 0
 reserved2 0

Section                        # section #2 is (__DATA, __data)
  sectname __data              # contains initialized global and static variables
   segname __DATA
      addr 0x0000000000000014
      size 0x0000000000000004
       ... ...
       
Section                        # section #3 is (__LD, __compact_unwind)
  sectname __compact_unwind    # contains unwinding information (in Apple's compact format)
   segname __LD
      addr 0x0000000000000018
      size 0x0000000000000020
       ... ...

Section                        # section #4 is (__TEXT, __eh_frame)
  sectname __eh_frame          # contains Exception Handling Frame
   segname __TEXT
      addr 0x0000000000000038
      size 0x0000000000000040
       ... ...
```

> [!NOTE] 注意这个 unnamed segment 起到的是一个 "list of `(segment, section)`" 的作用
> 
> 或者你理解成一个 meta-segment 也行

## Load Command 1 $\Rightarrow$ `LC_BUILD_VERSION` $\Rightarrow$ 引导 checking version compatibility

```bash
Load command 1
      cmd LC_BUILD_VERSION  # Build's Metadata
  cmdsize 24
 platform 1     # magic number, meaning macOS
    minos 13.0  # minimum OS version is macOS 13.0 (Ventura)
      sdk 14.2  # built with macOS 14.2 SDK (Sonoma)
   ntools 0
```

## Load Command 2 $\Rightarrow$ `LC_SYMTAB` $\Rightarrow$ 引导读取 symtab/strtab

```bash
Load command 2
     cmd LC_SYMTAB  # Symbol Table
 cmdsize 24
  symoff 688  # symbol table is at file (i.e. `vanilla.o`) offset 688 (in byte)
   nsyms 2    # there are 2 symbols
  stroff 720  # string table is at file (i.e. `vanilla.o`) offset 720 (in byte)
 strsize 16   # size of the string table is 16 bytes
```

> [!info] FYI
> 
> The 2 symbols are:
> 
> ```bash
> ᐅ nm vanilla.o
> 0000000000000014 D _a
> 0000000000000000 T _main
> ```
> 
> - `T`: the symbol is in `(__TEXT, __text)` 
> - `D`: the symbol is in `(__DATA, __data)`
> - `U`: the symbol is undefined

## Load Command 3 $\Rightarrow$ `LC_DYSYMTAB` $\Rightarrow$ 提供 dynamic linking metadata

```bash
```bash
Load command 3
            cmd LC_DYSYMTAB  # Dynamic Symbol Table
        cmdsize 80

                   ###########################################
                   # Partitions of the existing symbol table #
                   ###########################################
                   # P1: local symbols (non-dynamic)
      ilocalsym 0  # (next available) index (globally in the symtab) for locally defined symbols
      nlocalsym 0  # count of locally defined symbols
      
                   # P2: exported symbols (type 1 of dynamic symbols)
     iextdefsym 0  # (next available) index (globally in the symtab) for externally defined symbols
     nextdefsym 2  # count of externally defined symbols (==1, should be the exported `_main`)
     
                   # P3: imported symbols (type 2 of dynamic symbols)
      iundefsym 2  # (next available) index (globally in the symtab) for undefined symbols
      nundefsym 0  # count of undefined symbols

                   ################################
                   # Pointers to auxiliary tables #
                   ################################
         tocoff 0  # file offset for ToC (rarely used in modern Mach-O; was intended for organizing symbols in multi-module libraries)
           ntoc 0  # count of ToC entries

      modtaboff 0  # file offset for Module Table (rarely used in modern Mach-O; describes individual modules within a multi-module dylib)
        nmodtab 0  # count of Module Table entries
   
   extrefsymoff 0  # file offset for External Reference Table (describes how undefined symbols are used (lazy vs. non-lazy); contains flags indicating reference type)
    nextrefsyms 0  # count of External Reference Table entries
 
 indirectsymoff 0  # file offset for Indirect Symbol Table
  nindirectsyms 0  # count of Indirect Symbol Table entries
  
      extreloff 0  # file offset for External Relocation Entries
        nextrel 0  # count of External Relocation Entries
        
      locreloff 0  # file offser for Local Relocation Entries
        nlocrel 0  # count of Local Relocation Entries
```


> [!caution] `extdef` means **external & defined**, not _externally defined_
> 
> See [Mach-O Stitching #6: How to Interpret Dysymtab > Experiment Result](https://listcomp.com/compiler/2026/01/30/mach-o-stitching-6-how-to-interpret-dysymtab#experiment-result).

A **dynamic symbol** is a symbol (function or variable name) that is either:

- **Imported** (thus undefined locally) from an external shared library (`dylib`) that will be linked at runtime
    - **可以理解成 "current module's symbol debts"**, e.g. `printf`
- **Exported** from the current binary (thus defined locally) so other modules can use it
    - **可以理解成 "current module's symbol contribution"**, e.g. current module's global variables and functions (they are `extern` by default)

> [!caution] The name "dynamic symbol" is MISLEADING
> 
> dynamic symbol 并不意味着 dynamic linking: 它可能被 dynamic linker resolve, 也可能被 static linker resolve

> [!caution] The name "dynamic symbol table" is MISLEADING
> 
> 首先 there is NO such table as "dynamic symbol table".
> 其次 `LC_DYSYMTAB` 不仅仅包含了 dynamic symbol 的信息，它还有很多 auxiliary 的信息。

> [!NOTE] Why `iundefsym = 2` but `nundefsym = 0`?
> 
> Because `iundefsym = 2` means **"if there were any undefined symbols, they would start at index `2`"**. Note that symbol `_main` and `_a` have occupied indices `0` and `1` in our example.
> In short, `iundefsym` is just pointing to where the undefined symbols _would_ begin in the symbol table, and `nundefsym = 0` means there are actually **no undefined symbols** at that position.

> [!NOTE] Symbol grouping in symtab
> 
> 考虑到 `LC_DYSYMTAB` 这样的设计，我们可以推测出：symtab 中的 symbols 必须要按照 `localsym/extdefsym/undefsym` 这样做了 grouping.
> symbols 在物理上是不能散乱地排列的。

> [!info] symbols 在组内的 sorting
> 
> 对于 `extdefsym` 和 `undefsym`，Mach-O 还要求在组内按**symbol name 进行排序**。这意味着 `dyld` 可以使用 binary search 快速定位 symbol, 而不需要线性扫描。


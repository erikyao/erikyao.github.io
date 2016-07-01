---
layout: post
title: "Linking, Loading and Library"
description: ""
category: OS
tags: [Book]
---
{% include JB/setup %}

[northbridge_southbridge]: https://farm8.staticflickr.com/7239/27374870374_03bd8a9661_o_d.png
[software_hierarchy]: https://farm8.staticflickr.com/7716/27886596032_ec5a763b1a_o_d.png

## Part 1. 简介

### 1. 温故而知新

注意南桥北桥其实是 chip 而不是 bus，它们是 chipset 的成员，位于 motherboard 上：

![][northbridge_southbridge]

- northbridge: Intel 旧称 Memory Controller Hub (MCH)，现在普遍把 graphics card 也连过来，所以也 a.k.a. Graphics and Memory Controller Hub (GMCH)
    - northbridge 连接高速设备，比如 CPU、Memory、GPU，所以必然用的是高速 bus
    - 随着技术的发展，今天的高速 bus 可能明天就用到 southbridge 上了，会有更高速的 bus 用于 northbridge
- southbridge: Intel 旧称 I/O Controller Hub (ICH)
    - southbridge 连接低速设备，比如 USB, audio, serial, system BIOS, interrupt controller and IDE channels.
    - 相对于 northbridge，southbridge 肯定用的是低速 bus

Multi-core processor 其实是 multi-processors 的变体：

- 一个 multi-core processor 内部其实是多个精简版的 processors（至少是精简掉了 cache；故称为 core）拼在一起，共用一套 cache
- processor 内部的 cache 是非常贵的，multi-core processor 这么设计一来减少成本方便投入民用，二来其实民用也用不上标准的 multi-processors
- 相当于是把 processor 当做组件来设计了一个高级一点的 processor
- Multi-core processor 可以看做是 SMP (Symmetrical Multi-Processing) 的一种实现。symmetrical 指各个 processor 间是平等的关系（i.e. 不存在 master-slave 之类的关系）

软件：

- 系统软件
    - OS kernel, drivers, runtime libraries, other system tools
    - 开发工具（Development Tools）：compiler, debugger, assembler, development libraries
- 应用程序（Application）

![][software_hierarchy]

> Any problem in computer science can be solved by another layer of indirection. (In computer programming, _**indirection**_ is the ability to reference something using a name, reference, or container instead of the value itself.)

- Application 和 Development Tools 使用的都是 OS API
- OS API 的提供者是 runtime libraries
    - 比如 Linux 下的 glibc 提供 POSIX API
    - Win32 提供 32-bit Windows API
- runtime libraries 使用的是 OS 提供的 SCI (system call interface)，而 SCI 的实现方式一般是 software interrupt

硬件抽象：

- Unix 下硬件设备被抽象成文件
- Windows 下：
    - 图形硬件被抽象成 GDI (graphics device interface)
    - 多媒体设备被抽象成 DirectX 对象

Segmentation:

- 简单说就是根据 application 的需要划分 memory 供其使用
- 实际包含了 virtual memory 到 physical memory 的映射步骤
    - virtual memory 的目的主要是为了方便管理
    - 映射往往包含了其他信息，比如实际的 physical memory 的 start 和 offset，跨 segment 的 memory access 很容易被系统 detect 到并 refuse
    - 这个映射由 MMU (memory management unit) 来管理；MMU 一般都集成在 CPU 内部

Paging:

- Paging 给 virtual memory、physical memory 和 disk 提供了一个统一 size (一般是 4KB) 的 unit: page
    - 所以有 VP (virtual page)、PP (physical page) 和 DP (disk page)
- 这样允许只 load 一部分文件到 memory

## Part 2. 静态链接

### 2. 编译和链接

`gcc hello.c` 生成 `a.out` 的过程实际包含了 4 个步骤：

- Preprocessing
    - 命令：`gcc -E hello.c -o hello.i` 或者 `cpp hello.c > hello.i`
    - 输入：源文件 `hello.c` 外加 `stdio.h` 之类的头文件
    - 输出：`hello.i`
    - 操作：
        - 展开 `#define`
        - 执行 `#if` 之流
        - 将被 `#include` 的文件 copy 到该位置，注意这个过程是递归的，被 `#include` 的文件本身也可能 `#include` 其他的文件，这些文件也会被一并 copy
        - 删除注释
        - 添加 line number
        - 保留 `#progma` 编译器指令
- Compilation
    - 现在版本的 GCC 的 `cc1` 命令合并了 processing 和 compilation
        - `cc1 hello.c` 等同于 `gcc -S hello.c -o hello.s`
        - `gcc -S` 的实质就是去调用了 `cc1`
    - 输入：`hello.i`
    - 输出：`hello.s`
    - 操作：词法分析、语法分析、语义分析及优化后生成汇编代码
- Assembling
    - 命令：`as hello.s -o hello.o` 或者 `gcc -c hello.s -o hello.o`
    - 输入：`hello.s`
    - 输出：`hello.o`
    - 操作：将汇编代码转成机器指令
- Linking
    - 简化版的命令：`ld -static crt1.o crti.o crtbeginT.o hello.o -start-group -lgcc -lgcc_eh -lc-end-group crtend.o crtn.o`
    - What the hell are they?
    
对 static-typed language C/C++ 而言 (dynamic-typed languge 如 python、javascript)，模块（你可以简单理解成一个模块就是一个 .c 或者 .o 文件）间的通信有两种方式：

- 模块间的 function call
- 模块间的 variable access
    - 这两种方式可以统一描述为 “模块间的 symbol referencing”
    
Linking 的任务就是把模块间互相 referencing 的部分处理好，具体包括：

- Address and Storage Allocation
- Symbol Resolution
    - a.k.a. Symbol Binding, Naming Binding
- Relocation
    - 比如 `main.c` 调用 `func.c` 的一个函数 `foo()`，由于这两个 .c 文件是分开编译的，所以在编译 `main.c` 时，compiler 并不知道 `foo()` 的地址，所以 compiler 会把调用 `foo()` 的指令 pending，留给 linker 去确定 `foo()` 的地址

### 3. object 文件 (i.e. .o 文件) 里都有啥

- object 文件：
    - Windows: `.obj` vs Linux: `.o`
- executable 文件：
    - Windows: PE (Portable Executable) 格式，后缀比如 `.exe`
    - Linux: ELF (Executable Linkable Format) 格式，后缀比如 `.out`
- Dynamic Linking Library (DLL)
    - Windows: `.dll` vs Linux: `.so` (Shared Object)
- Static Linking Library 
    - Windows: `.lib` vs Linux: `.a` (Archive libraries)
    
Generally，object 文件和 executable 文件的内容、格式都很相似，一般是按 section 划分的：

- code section: 存放源代码编译后的机器指令 
    - 一般简写为 `.code` 或 `.text`
- data section: 存放 _**已经初始化的**_ static variables (that is, global variables and static local variables)
    - 一般简写为 `.data`
- BSS section (Block Starter by Symbol): 存放 _**未初始化的**_ static variables 
    - 一般简写为 `.bss`
    - 未初始化的全局 variable 和局部静态 variable 都默认为 0，但是没有必要放在 data section
    - > Peter van der Linden, a C programmer and author, says, "Some people like to remember it as 'Better Save Space.' Since the BSS segment only holds variables that don't have any value yet, it doesn't actually need to store the image of these variables. The size that BSS will require at runtime is recorded in the object file, but BSS (unlike the data segment) doesn't take up any actual space in the object file."
- `.rodata` section： 存只读数据
    - 比如 `const`
    - 有的编译器会把字符串常量放 `.rodata`，有的会放 `.data`
- ELF 文件的开头还有一个 header (一般简写为 `.symtab`)，包含如下信息
    - 文件是否可执行？
        - 如果可执行，还要记录入口地址
    - 是 static linking library 还是 DLL？
    - 目标硬件、目标 OS etc.
    - Section Table: 各个 section 在文件中的偏移位置 etc.

Why sectioning?

- 程序被装载后，code 和 data 可以被映射到不同的 virtual memory segment，code 可以设置为 read-only，防止被修改
- CPU 的 cache 一般都设计为指令 cache 和数据 cache 两部分，sectioning 有利于提高 CPU cache 命中
- 可以实现一个程序的多个副本共享指令，节省内存 
  
### 4. 静态链接

#### 4.1 空间与地址分配

问题：对于多个 object 文件，如何将他们的 sections 合并到输出文件？

##### 4.1.1 按序叠加

缺点：

- 如果有 100 个 object 文件，输出文件就会有 100 个 `.text`、`data` etc. sections
- 这样是很浪费空间的，因为一个 section 即使只有 1 bit，也要占据 1 page (4KB) 的 size

##### 4.1.2 合并相同类型的 section

目前常用的方式。实现一般采用 Two-pass Linking:

1. 扫描所有输入的 object 文件
    - 从 headers 收集所有 sections 的属性，合并
    - 从符号表中收集所有的符号定义和符号引用，生成一个全局符号表
1. Symbol Resolution + Relocation
  
#### 4.3 C++ 相关问题

##### 4.3.3 C++ 与 ABI

ABIs (Application Binary Interface) cover details such as:

- the sizes, layout, and alignment of data types
- the calling convention, which controls how functions' arguments are passed and return values retrieved; for example, 
    - whether all parameters are passed on the stack or some are passed in registers, 
    - which registers are used for which function parameters, and 
    - whether the first function parameter passed on the stack is pushed first or last onto the stack
- how an application should make system calls to the operating system and, if the ABI specifies direct system calls rather than procedure calls to system call stubs, the system call numbers
and in the case of a complete operating system ABI, the binary format of object files, program libraries and so on.

A complete ABI, such as the Intel Binary Compatibility Standard (iBCS), allows a program from one operating system supporting that ABI to run without modifications on any other such system, provided that necessary shared libraries are present, and similar prerequisites are fulfilled.

- 从这个角度来说，Java 字节码有遵循一套很好的 ABI

Other ABIs standardize details such as the C++ name mangling, exception propagation, and calling convention between compilers on the same platform, but do not require cross-platform compatibility.
  
#### 4.5 静态链接库

一个静态库可以简单地看做一组 object 文件的集合。

`glibc` 本身是由 C 语言开发的，编译后得到 `printf.o`、`scanf.o`、`fread.o`、`fwrite.o`、`data.o`、`time.o`、`malloc.o` 等 object 文件供开发者使用。为了方便管理，通常用 `ar` 压缩程序将这些 object 文件打包成 `libc.a` 这个静态库文件。

经常会有这样的情况：一个 object 文件里只包含一个函数。这么做是为了减少 `#include` 导入多余的内容造成空间的浪费。




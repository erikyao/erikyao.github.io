---
category: OS
description: ''
tags:
- Book
title: Linking, Loading and Library
toc: true
toc_sticky: true
---

[northbridge_southbridge]: https://farm8.staticflickr.com/7239/27374870374_03bd8a9661_o_d.png
[software_hierarchy]: https://farm8.staticflickr.com/7716/27886596032_ec5a763b1a_o_d.png
[VMA]: https://farm8.staticflickr.com/7340/27501582064_3637703587_z_d.jpg
[stack_frame]: https://farm8.staticflickr.com/7494/27522590674_7d738b9527_o_d.png
[cdecl_example]: https://farm8.staticflickr.com/7300/28103751046_170da00863_o_d.png
[fd]: https://farm8.staticflickr.com/7428/27858238310_160dce9cd6_o_d.jpg
[system_call_example]: https://farm8.staticflickr.com/7460/27859201890_5e02591a17_o_d.png

《程序员的自我修养——链接、装载与库》泛读

-----

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

#### 4.6 链接过程控制

OS 内核、BIOS (Basic Input Output System)，或者一些在没有 OS 的情况下运行的程序，比如　Boot Loader、PQMagic 或者嵌入式的程序会有一些特殊的链接要求，比如要指定输出文件的 section 的地址、section 名称、section 存放顺序等。

### 5. Windows PE/COFF

映象（image）：PE 文件在装载时直接映射到进程的虚拟空间中运行，它是进程的虚拟空间的映象（$f(x) = y$ is the image of argument $x$ under $f$）。所以 PE 可执行文件很多时候也叫做映象文件（image file）。

略

## Part 3. 装载与动态链接

### 6. 可执行文件的装载与进程

可自行文件只有被装载到内存后才能被 CPU 执行。早起的装载十分简陋，基本过程就是把程序从外部存储器读取到内存中的某个位置。随着 MMU 的诞生和多进程、虚拟内存的出现，装载变得复杂起来。

#### 6.1 进程虚拟地址空间

程序 vs 进程：

- 程序（或者狭义上讲，可自行文件）是一个静态的文件
- 进程是程序运行的一个动态过程，所以动态库也常被叫 runtime
- 若把程序比作菜谱，进程就是做菜的过程。把一道菜同时炒两份就是多进程。

进程都有自己独立的虚拟地址空间 (Virtual Address Space)。32-bit 系统的虚拟地址空间有 4GB。

- 默认情况下，Linux 是限定 1GB 提供给 OS，3GB 给 user process
    - 所以 `malloc` 申请的虚拟地址之和不能超过 3GB 
- Windows 默认是限定 2GB 提供给 OS，2GB 给 user process
    - 这个值可以在 `Boot.ini` 里修改
    
#### 6.2 装载的方式

Problem: 程序需要的内存大于物理内存。

- 方法一：加内存
- 方法二：程序运行时是有局部性原理的，所以可以讲最常用的部分放内存，不太常用的部分放磁盘。是所谓 _**动态装载**_。
    - In computer science, _**locality of reference**_, also known as the _**principle of locality**_, is a term for the phenomenon in which the same values, or related storage locations, are frequently accessed, depending on the memory access pattern.
    - 动态装载有两种方式：overlay 和 paging
    
overlay:

- 首先把程序所有的内存划段（做一个 layout）
- 假设 module A 和 module B 分别需要 512KB 和 256KB，但是 A 和 B 之间不会互相调用，我们可以只给它们 512KB 的空间，需要 A 的时候就装 A，需要 B 的时候就装 B，直接覆盖原有的内容，不用顾忌
- 这样 module 间就构成了一棵依赖树
    - 比如 A 和 B 之间不会互相调用，那么它们就不依赖彼此，所以也就不存在 ancestor 和 descendant 的关系
    - 如果 A 依赖 B，那么就有一个 $A \rightarrow B$ 的 edge
    - `main` 是 root
    - 任何一个 node 到 root 的路径都叫做 _**调用路径**_。当该 node 被调用时，整个调用路径都必须再内存中，以确保该 node 执行完后可以返回到上层 node，最终返回到 `main`
    - 禁止跨子树调用
    - （隐约觉得这里有很多算法可以考……）
    
paging: 

- 当装载新 page 进来时，需要替换掉旧的 page，此时可以有多种算法来决定替换哪个 page，比如：FIFO

#### 6.4 进程虚拟内存空间分布

Linux 中将虚拟空间中的一个段叫做 VMA (Virtual Memory Area)，Windows 中叫做 Virtual Section，概念上是一样的。

在装载时，程序中属性相近的 sections 会被合并成一个 loadable segment (当然最简单的情况就是一个 section 对应一个 segment)，然后每个 loadable segment 的都有自己的 VMA

- 这样做的一个好处是减少 page 的浪费
- 对同一个 ELF 文件，sectioning 就是 _**Linking View**_，segmentation 就是 _**Execution View**_

stack 和 heap 是两个特殊的 VMA，它们并没有映射到文件中的某个 segment，所以属于 Anonymous VMA。

一个进程基本有一下几种 VMA：

- CODE VMA：read-only、可执行；有映象文件
- DATA VMA：read-write、可执行；有映象文件
- Heap VMA：read-write、可执行；无映象文件、Anonymous、可向上扩展
    - `malloc()` 申请的是 heap
- Stack VMA：read-write、不可执行；无映象文件、Anonymous、可向下扩展

![][VMA]

##### 6.4.5 stack 初始化

进程刚开始启动时，需要知道一些信息比如环境变量（`PATH=/usr/bin` 这类的）和命令行参数（`argv`）。很常见的一个做法是 OS 在进程启动之前将这些信息保存到进程的 stack 中。进程启动之后，这些信息会被传给 `main()`

#### 6.5 Linux 内核装载 ELF 过程简介

当 bash 下输入命令执行某个 ELF 时：

- 首先 bash 会先 `fork()` 出一个新进程
- 新进程调用 `execve()` 执行 ELF，开始装载
    - `execve()` 在内核中的入口是 `sys_execve()`，位于 `kernel/Process.c`
    
### 7. 动态链接

静态链接的缺点：

- 浪费空间
    - 比如 `a.o` 和 `b.o` 都需要 `lib.o`，那么它们在磁盘中都要包含 `lib.o`；在同时运行 `a.o` 和 `b.o` 时，`lib.o` 在内存中也会有两份
- 更新起来很麻烦
    - 比如 `a.o` 依赖 `lib_1.o`、`lib_2.o`……`lib_n.o`，你更新其中一个 lib，整个 `a.o` 就需要重新链接
    
动态链接的基本思想：把链接这个过程推迟到运行时再进行。

- 还是假设 `a.o` 和 `b.o` 都依赖 `lib.so`
- 先装载 `a.o`，发现有依赖 `lib.so`，装载 `lib.so`（如果还有 further 的依赖就继续，直到所有的依赖都满足，i.e. 调用路径都在内存当中），此时再进行链接
- 如果此时再装载 `b.o`，我们可以先检查内存，发现已经有一个 `lib.so`，就不用再装载 `lib.so`，直接链接
    - 实际上 `lib.so` 的 DATA segment 还是会有两份，这样两个进程 `a.o` 和 `b.o` 对 `lib.so` 全局变量的修改就可以被隔离开
        - 多进程共享全局变量也是可以做到的，用到的技术叫 "共享数据段"
    - 同一进程的两个线程访问是同一个 DATA segment
        - 线程保有自己的全局变量副本也是可以的，用到的技术是 Thread Local Storage
- 缺点：每次装载都要链接，但是这个时间损失不算大，5% 以下，可以接受

[DLL hell](http://stackoverflow.com/a/1379312):

> It's when App A installs a Shared DLL vers 1.0, App B comes and updates the Shared DLL to vers 1.1 which should be compatible but there are slightly different behaviors, then App A stops working correctly and reinstalls vers 1.0 then App B stops working ... now imagine this with more than 2 apps let's say a dozen: DLL Hell.

#### 7.4 Lazy Binding

比动态链接更进一步：链接我还是正常做，但是只有当 function 第一次被用到时才进行 binding (Symbol Resolution, Relocation etc.)

- 加快程序启动速度，特别是对依赖大量函数引用的程序
- 在 `glibc` 中，负责在运行时查找 function 信息的函数是 `_dl_runtime_resolve()` 
- ELF 用的技术是 PLT (Procedure Linkage Table)

#### 7.7 Explicit Runtime Linking

让程序在运行时自行装载指定的模块，不需要时可以将其卸载。最常见的例子是 Web Server 程序。

### 8. Linux Shared Library 的组织

#### 8.1 Shared Library 版本

##### 8.1.2 版本命名

`libname.so.x.y.z`:

- `x`: major version number
    - 标志着库的重大升级，不同主版本号的库是不兼容的
- `y`: minor version number
    - 标志着库的增量升级，高版本向后兼容低版本
- `z`: release version number
    - 标志着库的 bug-fix、性能提升等，并不会修改接口
    
##### 8.1.3 SO-NAME

SO-NAME 的格式是 `libname.so.x`。Linux 系统会为每一个 Shared Library 创建一个名为 SO-NAME 的 symbol link (联系我本机的 python 2 和 python 3)

### 9. Windows 下的动态链接

略

## Part 4. 库与运行库

运行库即 [runtime library](https://en.wikipedia.org/wiki/Runtime_library):

> In computer programming, a runtime library is a set of low-level routines used by a compiler to invoke some of the behaviors of a runtime environment, by inserting calls to the runtime library into compiled executable binary.

比如 `glibc` 就是一个运行库

### 10. 内存

#### 10.1 程序的内存布局

32-bit 系统有 4GB 内存空间，除掉内核占用的部分（Kernel Space），剩下的都是 User Space。

一个应用程序的内存空间有以下默认的区域：

- Stack：用于维护函数调用的 context，离开了 stack 函数调用就没法实现。
    - stack 通常在程序所占内存的最高位地址分配
- Heap：供程序动态分配的内存区域，比如 `malloc()` 或者 `new`
    - 通常位于 stack 的下方（低地址方向），一般比 stack 大很多
- 可执行文件映象
- 保留区：受到保护而禁止访问的内存区域
- dynamic libraries 映射区：用于装载动态链接库

#### 10.2 Stack 与函数调用惯例

stack 保存函数调用所需要的信息，这些信息也常常被称作 _**stack frame**_ 或者 _**activity record**_，包括：

- 函数的返回地址和参数
- 临时变量：包括函数的非静态局部变量以及编译器自己生成的其他临时变量
- 上下文：包括在函数调用前后需要保持不变的寄存器

在 i386 中，一个函数的 stack frame 的地址范围保存在 ebp 和 esp 这两个寄存器中：

- ebp 始终指向栈顶
- esp 又被称为 frame pointer

![][stack_frame]

在 VC 下，常常看到一些没有初始化的变量或者内存区域的值是 "烫"，比如：

```c
int main()
{
    char p[12]
}
```

这是因为栈空间的每一个字节会被初始化未 `0xCC`，而 `0xCCCC` 的文本就是 "烫"。有的编译器会用 `0xCD`，这样会出现汉字 "屯"。

C 默认的 calling convention 是 `cdecl`，它规定：

- 参数按从右至左的顺序被压入 stack
- 参数出栈的操作（以保证参数调用前后 stack 不变）由函数调用方完成（另一个 option 是由函数本身完成）
    - 其实出栈时我们并不会拿这些参数的值来用，所以可以直接修栈指针跳过这部分内存即可
- Name mangling (修饰，for linking convenience) 的策略是：直接在原 name 前加一个下划线

![][cdecl_example]

`cdecl` 是非标准关键字，一种写法是 `int _cdecl foo(int n, int m)`；GCC 下你得写 `__attribute__((cdecl))`。此外还有一些 calling convention 比如 `stdcall`、`fastcall` 等。

#### 10.3 Heap 与内存管理

`malloc()` 的实现策略：

- 策略一：交给系统内核去做。每次申请或者释放，都去 call 系统调用
    - 缺点：系统调用的开销是很大的，频繁 call 系统调用会影响性能
- 策略二：运行库代管。运行库向 OS “批发” 一块空间（i.e. heap），然后向应用程序 “零售”。如果全部用完了再向 OS “进货”（call 系统调用，得到一个新的 heap）。
    - 同一块地址空间不能 “售出” 两次，所以这里需要一个 “heap 分配算法”
    
heap 分配算法：

- Free List
    - 空闲的内存块按链表的方式连接起来
    - 申请空间时，遍历链表找到合适的块（如果可用的块比申请的 size 要大，还需要 split）
    - 释放空间时，合并该块到链表中
- Bitmap
    - 将整个 heap 分成大量的 block，每个 block 大小相同（类似于 paging）
    - 每次申请都分配整数个 block 给用户，假设有 n 个 block
        - 第一个 block 我们标记为 head
        - 其余的 block 全部标记为 body
    - 这样我们可以用一个数组来记录所有的 block 的状态
        - 状态只可能是 H、B 或者 F (free)，所以用 2-bit 就够了
        - 把这个数组铺成二维的，就可以看成是一幅图
- Object Pool
    - 适用于 “每次申请的 size 是固定的几个值” 的场合
    - 将 heap 按这几个固定的值划分成 block，然后再采用 Free List 或是 Bitmap 都可以
    
### 11. 运行库

#### 11.1 入口函数和程序初始化

OS 在装载程序后，首先运行的并不是 `main()` 的第一行，而是其他的一些代码，这些代码负责全局变量初始化、传参 `argc` 和 `argv`、初始化 heap 和 stack、初始化 I/O 等等的工作，并最终调用 `main()`。`main()` 结束后，也有一些代码会运行，比如你可以用 `atexit(&foo)` 来指定 `main()` 结束后执行 `foo()`，此外，变量析构、heap 的销毁、关闭 I/O 这些活儿也被某些代码承包了。

执行这些 `main()` 前后的代码的函数称为 Entry function 或者 Entry Point，它往往是运行库的一部分。OS 在创建进程后，会调用这个 entry function。

- 若是 C++，entry function 还要负责全局 object 的 `new` 和销毁

按 “静态链接 vs 动态链接 glibc” 和 “glibc 用于可执行文件 vs 用于共享库”，我们可以组合出 4 种场景。“静态链接 glibc 用于可执行文件” 时，entry function 是 `_start` (这是 `ld` linker 指定的，however, customizable)

##### 11.1.3 运行库与 I/O

`fd`，Linux 叫 File Description，Windows 叫 Handle，其实是同一个概念。技术角度上，[`fd n` 其实表示的是 Process Table 的第 `n` 条 entry](http://stackoverflow.com/a/17741176)：

![][fd]

- `fd 0` 是 `stdin`
- `fd 1` 是 `stdout`
- `fd 2` 是 `stderr`

#### 11.2 C/C++ 运行库

运行库的标准，即是标准库，比如 `C89` 和 `C99`。

#### 11.3 运行库与多线程

##### 11.3.3 TLS (Thread Local Storage) 的实现

Windows 下，当我们用 `__declspec(thread)` 申明一个 TLS 变量时，编译器会把这个变量放到 PE 文件的 `.tls` section。当系统启动一个新 thread 时，它会从进程的 heap 中申请一块空间，然后把 `.tls` section 的内容复制到这块空间中。

对每一个 Windows thread，系统会为其建立一个 TEB (Thread Environment Block)，除了 thread 的堆栈地址、线程 ID 等信息外，TLS 数组也存放在 TEB，这样就保证 thread 可以访问到自己的 TLS 变量了。

#### 11.5 `fread` 的实现

略

### 12. 系统调用与 API

#### 12.1 系统调用介绍

##### 12.1.2 Linux 系统调用

x86 下，系统调用由 `0x80` 中断发起，`EAX` 寄存器表示系统调用的接口号，比如 `EAX = 1` 表示 “退出进程”，在 `/usr/include/unistd.h` 中定义为 `exit()` 函数，这个函数会调用一个内核函数 `sys_exit()`；`EAX = 2` 表示 “创建进程”，对应 `fork()` 和 `sys_fork()`；大抵就是这么一个规律。

- 运行库的部分工作就是 call 了系统调用，并在调用前后帮你做了很多后勤工作，这也算是一种 “屏蔽底层技术细节”
    - 比如 `read()` 系统调用读取的就是文件的原始数据，而运行库 `glibc` 的 `fread()` 就提供了 buffer、按行读取这些便利
- 而且运行库有 “标准库” 保障，算是 “跨平台” 的 “屏蔽底层技术细节”

#### 12.2 系统调用原理

[Understanding User and Kernel Mode](https://blog.codinghorror.com/understanding-user-and-kernel-mode/):

> In any modern operating system, the CPU is actually spending time in two very distinct modes:
>   
> 1. Kernel Mode  
> In Kernel mode, the executing code has complete and unrestricted access to the underlying hardware. It can execute any CPU instruction and reference any memory address. Kernel mode is generally reserved for the lowest-level, most trusted functions of the operating system. Crashes in kernel mode are catastrophic; they will halt the entire PC.
> 
> 2. User Mode  
> In User mode, the executing code has no ability to directly access hardware or reference memory. Code running in user mode must delegate to system APIs to access hardware or memory. Due to the protection afforded by this sort of isolation, crashes in user mode are always recoverable. Most of the code running on your computer will execute in user mode.
> 
> It's possible to enable display of Kernel time in Task Manager... The green line is total CPU time; the red line is Kernel time. The gap between the two is User time.

System call 都运行在 kernel mode，应用程序一般运行在 user mode。应用程序（通过运行库）调用 system call 时，OS 会通过中断从 user mode 切到 kernel mode

- Windows 中断号 `int 0x2e`，Linux 中断号 `int 0x80`
- OS 通过 Interrupt Vector Table 找到对应的 ISR (Interrupt Service Rountine)。切回 kernel mode 这个中断的 ISR 的工作就是去读取 `EAX` 寄存器，并调用相应的函数
    - `EAX` 是发出中断之前就写入了

![][system_call_example]

### 13. 运行库实现

大总结，大量代码，可以一窥实现逻辑。
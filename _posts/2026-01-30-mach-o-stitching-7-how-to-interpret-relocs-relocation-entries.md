---
title: "Mach O Stitching #7: How to Interpret Relocs (Relocation Entries)"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

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
ᐅ clang -O0 -c secondary.c -o secondary.o
ᐅ clang -O0 -c main.c -o main.o
ᐅ clang -O0 main.o secondary.o -o main.out
```

# Relocs 的物理位置

> [!caution] 一般称为 "relocation entries" 而不是 "relocation table"
> 
> 虽然当你说 "relocation table" 时，somehow 大家也能懂你说的是啥，但更常用的叫法是 "relocation entries".

in object files:

- ✅ relocs 存储在 section 外部，有点类似 symtab/strtab 的情况 (Mach-O 是如此；ELF 略有不同)
    - 每个 section 都有自己的 `reloff/nreloc` 字段
    - 但 `reloff` 不在 section 自己的范围内
- ❌ relocs 不存储在 `LC_DYLD_INFO` 或者 `LC_DYLD_INFO_ONLY`
- ❌ relocs 不存储在 dysymtab 的 `extreloff/nextrel` 或者 `locreloff/nlocrel` 字段规定的范围内

```txt
Mach-O Header
Load Commands
  - Segment commands
  - Section headers (with reloff/nreloc)

Section Data:
  __text section data
  __data section data
  __const section data
  ...

Relocation Entries:
  Relocations for __text
  Relocations for __data
  Relocations for __const
  ...

Symbol Table
String Table
```

in executables:

- dynamic linking 的 relocation 过程已经完成了，剩下一些 dynamic linking 要用的 relocation 信息已经不能称为 relocs 了
- 所以狭义来讲，executable 中没有 relocs
- 但广义上的 dynamic linking 的 relocation 信息还是有的，但也不是 relocs 的格式了

# 查看 Relocs

## Human-Readable Textual Representation 

直接用 `otool` 查看的话：

```bash
ᐅ otool -r main.o  # Display the relocation entries. 
main.o:

Relocation information (__TEXT,__text) 8 entries
address  pcrel length extern type    scattered symbolnum/value
00000053 1     2      1      2       0         2
0000004c 1     2      1      2       0         2
00000045 1     2      1      2       0         2
0000003a 1     2      0      1       0         2
00000032 1     2      1      3       0         1
00000027 1     2      0      1       0         2
0000001f 1     2      1      3       0         1
00000012 1     2      1      3       0         3

Relocation information (__LD,__compact_unwind) 1 entries
address  pcrel length extern type    scattered symbolnum/value
00000000 0     3      0      0       0         1
```

有点难读，给 `otool` 加上 `-v` option 再看看：

```bash
ᐅ otool -rv main.o
main.o:

Relocation information (__TEXT,__text) 8 entries
address  pcrel length extern type    scattered symbolnum/value
00000053 True  long   True   BRANCH  False     _shared_func
0000004c True  long   True   BRANCH  False     _shared_func
00000045 True  long   True   BRANCH  False     _shared_func
0000003a True  long   False  SIGNED  False     2 (__TEXT,__literal4)
00000032 True  long   True   GOT_LD  False     _shared_float
00000027 True  long   False  SIGNED  False     2 (__TEXT,__literal4)
0000001f True  long   True   GOT_LD  False     _shared_float
00000012 True  long   True   GOT_LD  False     _shared_int

Relocation information (__LD,__compact_unwind) 1 entries
address  pcrel length extern type    scattered symbolnum/value
00000000 False quad   False  UNSIGND False     1 (__TEXT,__text)
```

> [!NOTE] Float numbers like `101.0` are stored in `(__TEXT, __literal4)` section for optimization
> 
> `2 (__TEXT,__literal4)` 前面的 `2` 表示 offset $2$ in the section.
> 但 `43` 这样的 `int` 就不需要这么处理。原因是：`float` 的 size 太大，直接塞到 assembly instruction 里面会导致 instruction 本身的 size 太大；而 `int` 就不会有这个问题。
> 这算是个比较特殊的 reloc，我们这里就不深究了。我们这里专注于 symbols.

我们拿这条输出为例：

```bash
  address  pcrel length extern type    scattered symbolnum/value
  00000012 True  long   True   GOT_LD  False     _shared_int
# 00000012 1     2      1      3       0         3
```

它的意思是：

- `address` 指 section 内部的 offset，意思是 "在 section 的这个位置上有一个需要 relocation 的 symbol"
    - 注意这里 `00000012` 是 `0x12` 的意思
- `pcrel`is a flag indicating if the relocation is PC-relative
- `length` represents the size of the symbol to be relocated 
    - `0` = byte, `1` = word, `2` = long, `3` = quad
    - length 为 $i$ 则表示长度为 $2^i$ bytes
- `extern` is a flag indicating if the symbol is external
- `type`: see `<mach-o/x86_64/reloc.h>`，比如：
    - `X86_64_RELOC_UNSIGNED` $\Rightarrow$ 绝对地址模式
    - `X86_64_RELOC_GOT_LOAD` $\Rightarrow$ `movq symbol@GOTPCREL(%rip), %rax` 模式
    - `X86_64_RELOC_BRANCH` $\Rightarrow$ `call/jmp` 指令的分支目标
    - 等等
- `scattered` is a flag indicating if the relocation is scattered (rarely used)
    - 比方说当你的 section 非常大，你 `address` 即使溢出也表示不到一个合法的 section offset，此时就要用到 scattered relocation 技术
- `symbolnum/value`:
    - if `extern == True`, this is the symbol index
    - if `extern == False`, this is the section ordinal

## Binary Representation

我们这里以 `(__TEXT, __text)` section 的 relocs 为例 (注意其他的 section 也可能会有 relocs):

1. 用 `otool -l` 查看 section 的 `LC_SEGMENT_64` 中的 `reloff/nreloc` 字段
2. 用 `xxd -s` 定位到 object file 的 `reloff` 位置
3. 每条 reloc 的 size 是 8-byte

还是以这条 reloc 为例：

```bash
  address  pcrel length extern type    scattered symbolnum/value
  00000012 True  long   True   GOT_LD  False     _shared_int
# 00000012 1     2      1      3       0         3
```

它对应的 binary raw data 是：

```bash
# -d: use decimal addresses
# -e: use little endian
# 2000 is the `reloff` of `(__TEXT, __text)`
ᐅ xxd -s 2000 -d -e main.o
00002000: 00000053 2d000002 0000004c 2d000002
00002016: 00000045 2d000002 0000003a 15000002
00002032: 00000032 3d000001 00000027 15000002
00002048: 0000001f 3d000001 00000012 3d000003
                            #---------------#  <- reloc for `_shared_int` at 0x00000012
```

如果从 LSB (least significant bit) 开始，这 8-byte 可以拆分成这么一个结构：

```c
struct relocation_info {
    uint32_t r_symbolnum:24, // bit 0-23
             r_pcrel:1,      // bit 24
             r_length:2,     // bit 25-26
             r_extern:1,     // bit 27
             r_type:4;       // bit 28-31
    int32_t  r_address;      // bit 32-63 
};
```

于是有：

| Fields     | `r_address`  |        | `r_symbolnum` |
| ---------- | ------------ | ------ | ----------- |
| Hex. Values| `0x00000012` | `0x3d` | `0x000003`  |

而 `0x3d == 0b 0011 1101`，所以：

| Fields      | `r_symbolnum` | `r_extern` | `r_length` | `r_pcrel` |
| ----------- | ------------- | ---------- | ---------- | --------- |
| Bin. Values | `0011`        | `1`        | `10`       | `1`       |
| Dec. Values | `3`           | `1`        | `2`        | `1`       |

你会发现还差一个 `scattered` flag 在 binary raw data 中没有体现，这是因为这个 flag 可以用 `address` 推断：

- non-scattered relocation $\iff$ `MSB(r_address) == 0`  (`address` 的 most significant bit，也就是 reloc 的 bit $63$)
- scattered relocation $\iff$ `MSB(r_address) == 1`

这么算下来，reloc 的 binary raw data 与 `otool -r` 的输出是一致的。

# Digression: Matching C Statements to Assembly Instructions

Relocs 需要配合 assembly code 一起理解，所以这里我们要先搞清楚 "哪些 assembly instructions 对应了哪个 C Statement" 这个问题。

其实有很多办法，但下面这两个方法结合起来用会更方便理解。

## 方法一：直接编译 C $\Rightarrow$ Assembly (以下称 "`.s` assembly")

```bash
ᐅ clang -S -O0 main.c -fverbose-asm -o main.s
```

得到的 assembly 是：

```nasm
	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 13, 0
	.section	__TEXT,__literal4,4byte_literals
	.p2align	2, 0x0                          ## -- Begin function main
LCPI0_0:
	.long	0x42cc0000                      ## float 102
LCPI0_1:
	.long	0x42ca0000                      ## float 101
	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$16, %rsp
	movl	$0, -4(%rbp)
	movq	_shared_int@GOTPCREL(%rip), %rax
	movl	$43, (%rax)
	movq	_shared_float@GOTPCREL(%rip), %rax
	movss	LCPI0_1(%rip), %xmm0            ## xmm0 = [1.01E+2,0.0E+0,0.0E+0,0.0E+0]
	movss	%xmm0, (%rax)
	movq	_shared_float@GOTPCREL(%rip), %rax
	movss	LCPI0_0(%rip), %xmm0            ## xmm0 = [1.02E+2,0.0E+0,0.0E+0,0.0E+0]
	movss	%xmm0, (%rax)
	movb	$0, %al
	callq	_shared_func
	movb	$0, %al
	callq	_shared_func
	movb	$0, %al
	callq	_shared_func
	xorl	%eax, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
```

注意 register 的名称：

- `%rbp`: Register of Base Pointer (points to the base of current stack frame)
- `%rsp`: Register of Stack Pointer (points to the top of the stack; a.k.a. $SP$)
- `%rax`: Register of Accumulator (this is a general purpose register)
- `%rip`: Register of Instruction Pointer (points to the next instruction; a.k.a. program counter or $PC$)

注意 register 的逻辑：

- register name 是固定的，你可以理解成一个 constant pointer to a fixed address
- `(%rxx)` 表示 use the value stored in `%rxx` as an address

注意这几个 `move` 命令的区别：

- `movq`: Move a Quadword (8-byte)
- `movl`: Move a Longword (4-byte)
- `movess`: Move a Scalar Single-precision (4-byte)
- `movb`: Move a Byte (1-byte)

## 方法二：先编译 C $\Rightarrow$ Object，然后从 object 中反编译出 assembly (以下称 "`.o` assembly")

```bash
# -g: 编译时附带 debug 信息
ᐅ clang -g -O0 -c main.c -o main.o

# -S: 反汇编时显示源码 
ᐅ llvm-objdump -S main.o
```

得到的结果是：

```nasm
main.o:	file format mach-o 64-bit x86-64

Disassembly of section __TEXT,__text:

0000000000000000 <_main>:
; int main() {
       0: 55                           	pushq	%rbp
       1: 48 89 e5                     	movq	%rsp, %rbp
       4: 48 83 ec 10                  	subq	$0x10, %rsp
       8: c7 45 fc 00 00 00 00         	movl	$0x0, -0x4(%rbp)
;     shared_int = 43;
       f: 48 8b 05 00 00 00 00         	movq	(%rip), %rax            ## 0x16 <_main+0x16>
      16: c7 00 2b 00 00 00            	movl	$0x2b, (%rax)
;     shared_float = 101.0;
      1c: 48 8b 05 00 00 00 00         	movq	(%rip), %rax            ## 0x23 <_main+0x23>
      23: f3 0f 10 05 39 00 00 00      	movss	0x39(%rip), %xmm0       ## 0x64 <_main+0x64>
      2b: f3 0f 11 00                  	movss	%xmm0, (%rax)
;     shared_float = 102.0;
      2f: 48 8b 05 00 00 00 00         	movq	(%rip), %rax            ## 0x36 <_main+0x36>
      36: f3 0f 10 05 22 00 00 00      	movss	0x22(%rip), %xmm0       ## 0x60 <_main+0x60>
      3e: f3 0f 11 00                  	movss	%xmm0, (%rax)
;     shared_func();
      42: b0 00                        	movb	$0x0, %al
      44: e8 00 00 00 00               	callq	0x49 <_main+0x49>
;     shared_func();
      49: b0 00                        	movb	$0x0, %al
      4b: e8 00 00 00 00               	callq	0x50 <_main+0x50>
;     shared_func();
      50: b0 00                        	movb	$0x0, %al
      52: e8 00 00 00 00               	callq	0x57 <_main+0x57>
;     return 0;
      57: 31 c0                        	xorl	%eax, %eax
      59: 48 83 c4 10                  	addq	$0x10, %rsp
      5d: 5d                           	popq	%rbp
      5e: c3
```

# How a Reloc Guides Relocation

> [!caution] Relocs are a TODO list
> 
> 注意这个逻辑关系：
> 
> - relocs 是 assembler 生成的，它相当于是一个 TODO list
> - relocation 是 static-linker 执行的，它在执行的时候要参考 relocs
> 
> 所以我认为 relocs 叫 **Future** Relocation Entries 会更好理解

> [!caution] dynamic linking 也会有 "relocation" 操作，但执行逻辑与 static linker 不同，它也不需要 relocs 
> 
> dynamic linker 参考的是 rebasing 和 binding 信息，这些信息的格式与 relocs 不同

> [!NOTE] 用词
> 
> 现在一般的用法是：
> 
> - _relocation_ 专指 "static linker 的 relocation"
> - "dynamic linker 的 relocation" 用 _fixup_ 表示

## Let's find the relocation site first

我们还是以这条 reloc 为例：

```bash
address  pcrel length extern type    scattered symbolnum/value
00000012 True  long   True   GOT_LD  False     _shared_int
```

它针对的是这句 instruction:

```nasm
;     shared_int = 43;
       f: 48 8b 05 00 00 00 00         	movq	(%rip), %rax
  # addr: 0f 10 11 12 13 14 15
                   ##          <- reloc <address == 0x12>
                   #---------# <- reloc <length == long == 4-byte> 
  
      16: c7 00 2b 00 00 00            	movl	$0x2b, (%rax)
```

那么这条 reloc 的意思就是：**`0x0f` 这句 instruction 的后面 4 bytes (对应 symbol `_shared_int`) 需要 patch**.

## Assembly 小课堂

我们这一节的目的是拆解 `48 8b 05 00 00 00 00`.

首先完整的 x86 指令编码方案可以表示为：

```txt
┌────────┬────────┬────────┬─────┬──────────────┬───────────┐
│ Prefix │ Opcode │ ModR/M │ SIB │ Displacement │ Immediate │
└────────┴────────┴────────┴─────┴──────────────┴───────────┘
   可选      必需      可选    可选       可选           可选
```

下面我们讨论这些 fields 的意义。

### Prerequisite: Addressing Modes

```nasm
# Register Addressing (寄存器寻址)
    # 不访问内存，完全在 CPU 内部完成
movq %rbx, %rax  # 将 rbx 的值复制到 rax

# Immediate Addressing (立即数寻址)
    # 常用于给变量赋初值
    # 吐槽：这里根本没有 "寻址" 动作，你的 immediate 直接就在 instruction 内部，寻什么寻？
movq $100, %rax    # 将数值 100 放入 rax

# Register Indirect Addressing (寄存器间接寻址)
    # 类似于 C 语言中的 dereferencing
movq (%rbx), %rax  # 类似于 rax = *rbx

# Displacement Addressing (偏移量寻址)
    # 这是函数局部变量访问的标准方式
movl -8(%rbp), %eax  # 类似于 eax = *(%rbp - 8)
                     # %rbp 是 stack top

# SIB Addressing (比例索引寻址)
    # final_addr == base + index * scale + displacement
    # 吐槽：虽然名字 SIB 只包括了 Scale/Index/Base，但是 displacement 是存在的
    # 这是访问数组元素的标准方式
movl 8(%rbx, %rcx, 4), %eax  # 类似于 eax = *(%rbx + %rcx * 4 + 8) 

# RIP-Relative Addressing (RIP 相对寻址)
    # 访问全局变量的标准方式
movq _my_global_var(%rip), %rax  # 访问全局变量 _my_global_var，它的地址由 RIP 相对计算
```

> [!faq] 是否存在 "immediate indirect addressing"? 形如 `rax = *(100)` where `100` is an address
> 
> **否**。你大可以把 immediate 存入某个 register，然后再 register indirect addressing.

> [!faq] Register Indirect Addressing 和 Displacement Addressing 是 SIB Addressing 的特殊形式吗？
> 
> **逻辑上可以这么认为**。但是区分开来是因为它们的应用场景显著不同。

> [!faq] RIP-Relative Addressing 是 SIB Addressing 的特殊形式吗？
> 
> **逻辑上有相似之处，但底层编码差异很大**。原因是：
> 
> - `%rip` 在 CPU 架构中是非常特殊的寄存器，它由分支预测器和取指单元控制，并不像 `%rax`、`%rbx` 那样位于通用寄存器组 (GPRs) 中
> - 而 SIB 的设计初衷是使用 GPRs
> - 如果你硬要把 `%rip` 引入 SIB 计算电路中，需要额外的硬件连线，这会增加芯片设计的复杂度

> [!faq] SIB Addressing 如何读取数据元素？
> 
> 假设你有一个 `struct` 的 array，每个 `struct` 的 size 是 8-byte，然后要访问的 field `foo` 在 `struct` 内的 offset 是 4-byte，当前 index 是 `i`，那么 `array[i].foo` 就能编译成：`4(%rax, %rbx, 8)` where:
> 
> - `%rax == array` 即 array 的首地址
> - `%rbx == i`

### $\overline{\operatorname{ModR/M}}$ Field and the Second Operand

$\operatorname{ModR/M}$ 的 general form 是：

```txt
┌───────┬────────┬────────┐
│  Mod  │  Reg   │  R/M   │
└───────┴────────┴────────┘
   2-bit   3-bit    3-bit
```

- $\overline{\operatorname{Mod}}$ means "mode"
- $\overline{\operatorname{R/M}}$ means "register or memory", 但实际应用中也常用来表示某种 mode, 这算是一种 tech debt 了

把它放回 x86 指令编码方案中有：

```txt
┌────────┬────────┬────────┬─────┬──────────────┬───────────┐
│ Prefix │ Opcode │ ModR/M │ SIB │ Displacement │ Immediate │
└────────┴────────┴────────┴─────┴──────────────┴───────────┘
            ______/        \_______
           /                       \
          ┌───────┬────────┬────────┐
          │  Mod  │  Reg   │  R/M   │
          └───────┴────────┴────────┘
```

考虑 `op operand1 operand2` 这个 general form：

- `op` 自然是被 encode 到了 $\overline{\operatorname{Opcode}}$
- `operand1` 一定会被 encode 到 $\overline{\operatorname{Reg}}$
- 但是 `operand2` 就要靠 $\overline{\operatorname{Mod}}$ 和 $\overline{\operatorname{R/M}}$ 一起决定了

| $\overline{\operatorname{Mod}}$ | $\overline{\operatorname{R/M}}$ | Addressing     | Remark                                                                                              |
| ----------------------------| ----------------------------| -------------- | --------------------------------------------------------------------------------------------------- |
| `11`            | 此时必定为 register 编号              | `%reg`         |                                                                                                     |
| `01`            | 只要不是 `100`，则必定为 register 编号 | `disp8(%reg)`  | 默认 $\overline{\operatorname{SIB}}$ 为空，$\overline{\operatorname{R/M}}$ 后面的 1-byte 为 $\overline{\operatorname{Displacement}}$ |
| `10`            | 只要不是 `100`，则必定为 register 编号 | `disp32(%reg)` | 默认 $\\overline{operatorname{SIB}}$ 为空，$\overline{\operatorname{R/M}}$ 后面的 4-byte 为 $\overline{\operatorname{Displacement}}$ |
| `00`            | 只要不是 `100` 或者 `101`            | `(%reg)`       |                                                                                                     |
| `00`            | `101`                              | `disp32(%rip)` | RIP-Relative addressing                                                                             |
| `00/01/10`      | `100`                              | 对应的 SIB addressing     | 比如 `Mod == 10; R/M == 100` 就是 `disp32(%reg)` 的 SIB 形式                                 |

那么问题来了：是否存在编号为 `100` 的 register? 如果存在的话，假设它叫 `%reg`，我如何表示 `disp8(%reg)`?

首先**存在编号为 `100` 的 register**，但情况有点复杂。

在 macOS 常见的 Intel x86-64 架构中，operand size 对应着不同的数据类型：

| **operand size**   | **汇编后缀 (AT&T)** | **寄存器示例** | **C 语言对应类型**    |
| ---------- | ------------------- | -------------- | --------------------- |
| **8-bit**  | `b` (byte)          | `%al`, `%bl`   | `char`                |
| **16-bit** | `w` (word)          | `%ax`, `%bx`   | `short`               |
| **32-bit** | `l` (long)          | `%eax`, `%ebx` | `int`                 |
| **64-bit** | `q` (quadword)      | `%rax`, `%rbx` | `long long` 或指针 |

- 在 32 位世代，Intel 只分配 3-bit 通用寄存器编号，我们称为 `r0 ~ r7`
- 到了 64 位时代，register 变宽了，数量也变多了，有了 `r8 ~ r15`；但 Intel 不想推翻重来，于是就在原有指令前面塞一个 [[#$\overline{\operatorname{REX}}$ Prefix]]，**相当于是打了个补丁**
- 所以编号 `100` 的 register 可能是 `r4` (因为 `0b 100 == 4`)，也可能是 `r12` (`0b 100` 加 prefix 构成 `0b 1100 == 12`)

> [!info] 32-bit operand size 下，`r4` 即是 `%esp`

那现在假设我们要 `disp8(%esp)`，它就只能用 SIB 的形式来写，算是一种 hack：

- `Mod == 01`
- `R/M == 100`
- `SIB` 的 `Base == 100`
- 相当于写成 `disp8(base=100, index=0, scale=1)` 而不是 `disp8(reg=100)`

### $\overline{\operatorname{SIB}}$ Field

$\overline{\operatorname{SIB}}$ 的 general form 是：

```txt
┌───────┬─────────┬────────┐
│ Scale │  Index  │  Base  │
└───────┴─────────┴────────┘
   2-bit   3-bit     3-bit
```

- $\overline{\operatorname{Index}}$ 和 $\overline{\operatorname{Base}}$ 都是 register 编号
- $\overline{\operatorname{Scale}}$ 就 2-bit，取值 `00/01/10/11`，表示具体的 scale 值 `1/2/4/8`

> [!caution] assembly 中 SIB addressing 的 instruction 一定是写 "具体的 scale 值"，即一定是 `(base, index, scale = 1/2/4/8)` 形式
> 
> 只是这个 instruction 被 encode 成 binary 时，这个 "具体的 scale 值" 会被 encode 成 $\overline{\operatorname{Scale}}$ 的 2-bit

> [!faq] 如果 `scale > 8`，该怎么办？
> 
> 比如说我想实现 `(base, index, scale = 12)`，就只能曲线救国：
> 
> 1. 先把 `index * 12` 存入一个临时 register `temp`
> 2. 然后把 `(base, index, scale = 12)` 改写成 `(base, temp, scale = 1)`

放回 x86 指令编码方案中有：

```txt
                 ┌───────┬─────────┬────────┐
                 │ Scale │  Index  │  Base  │
                 └───────┴─────────┴────────┘
                  \                        /
                   ––––––––       –––––––––
                           \     /
┌────────┬────────┬────────┬─────┬──────────────┬───────────┐
│ Prefix │ Opcode │ ModR/M │ SIB │ Displacement │ Immediate │
└────────┴────────┴────────┴─────┴──────────────┴───────────┘
            ______/        \_______
           /                       \
          ┌───────┬────────┬────────┐
          │  Mod  │  Reg   │  R/M   │
          └───────┴────────┴────────┘
```

### $\overline{\operatorname{REX}}$ Prefix

我们回到指令的编码 `48 8b 05 00 00 00 00`.

`0x48 == 0b 0100 1000` is the REX (REgister eXtension; X86-64 specific) prefix (to the `Opcode`). 

> [!caution] 注意 `0x48` 这 8-bit 的一段的名称就叫 REX
> 
> 然后它本质上是个 prefix, 所以也总被称为 "REX prefix" (有点类似 "a Camry sedan" 这样的构词法)，并不是 "prefix to REX" 的意思。

> [!caution] 还有其他类型的 prefix，不止 REX 这一种

把这 8-bit 拆分一下有：

- `0100` 是 $\overline{\operatorname{REX}}$ 的固定标志位，即形如 `0100 XXXX` 的都是 REX prefix
- `1000` 是 4 个 flags, 从 MSB 到 LSB 分别是:
    - `W == 1` $\Rightarrow$ width flag 
        - `W == 0` 表示 32-bit operand size (默认)
        - `W == 1` 表示 64-bit operand size (扩展)
    - `R == 0` $\Rightarrow$ register flag, 用于强化 $\overline{\operatorname{ModR/M}} \rhd \overline{\operatorname{Reg}}$ 所表示的 register 范围
    - `X == 0`$\Rightarrow$ index flag, 用于强化 $\overline{\operatorname{SIB}} \rhd \overline{\operatorname{Index}}$ 所表示的 register 范围
    - `B == 0`$\Rightarrow$ base flag, 用于强化 $\overline{\operatorname{ModR/M}} \rhd \overline{\operatorname{R/M}}$、或者  $\overline{\operatorname{SIB}} \rhd \overline{\operatorname{Base}}$ 所表示的 register 范围
        - 以上 3 个 flags 的逻辑都是一致的
        - flag 为 `0` 表示你 3-bit 的 register 编号对应 `r0 ~ r7`
        - flag 为 `1` 表示你 3-bit 的 register 编号对应 `r8 ~ r15`

```txt  
                            REX.X     REX.B
                              |         |
                              *         *
                 ┌───────┬─────────┬────────┐
                 │ Scale │  Index  │  Base  │
                 └───────┴─────────┴────────┘
                  \                        /
                   ––––––––       –––––––––
                           \     /
┌────────┬────────┬────────┬─────┬──────────────┬───────────┐
│  REX   │ Opcode │ ModR/M │ SIB │ Displacement │ Immediate │
└────────┴────────┴────────┴─────┴──────────────┴───────────┘
    |       ______/        \_______
    |      /                       \
┌────────┐┌───────┬────────┬────────┐
│0100WRXB││  Mod  │  Reg   │  R/M   │
└────────┘└───────┴────────┴────────┘
                      *        *
                      |        |
                    REX.R    REX.B 
```

## 综合分析

`shared_int = 43;` 这一句的 assembly 的逻辑是：

```c
rax = &(shared_int);
*rax = 43;
```

实际的 `.o` assembly 是：

```nasm
;     shared_int = 43;
       f: 48 8b 05 00 00 00 00         	movq	(%rip), %rax   # rax = *(base=rip, displacement=0)
  # addr: 0f 10 11 12 13 14 15
                   ##          <- reloc <address == 0x12>
                   #---------# <- reloc <length == long == 4-byte> 
  
      16: c7 00 2b 00 00 00            	movl	$0x2b, (%rax)  # *rax = 43       
```

具体到这个 instruction 的成分：

```txt
# movq	(%rip), %rax
# 48 8b 05 00 00 00 00

0x48 == 0b 0100 1000  # REX.W == 1
0x8b                  # Opcode for MOV
                        # 因为 REX.W == 1, 所以具体是 MOVQ
0x05 == 0b 0000 0101  # Mod == 00
                      # Reg == 000, 对应 %rax
                      # R/M == 101, 对应 RIP-Relative addressing, 即 disp32(%rip) 
0x00 00 00 00         # Displacement == 0
```

所以 reloc 的逻辑是：

```c
// .o assembly logic
int d_shared_int = 0;  // displacement for shared_int
register rax = *(base=rip, displacement=d_shared_int);  // movq	(%rip), %rax
                                                        // rax is supposed to point to shared_int
*rax = 43;

// reloc logic
reloc.address = &d_shared_int;
reloc.type = "GOT_LD";
// ...
mark_for_alteration(address=reloc.address, type=reloc.type, ...);
```

注意这条 reloc 只是指定了 **去 GOT 中找一条 entry，它记录了 `shared_int` 的地址**，但是注意一个问题：**object file 中并没有 GOT**. 所以 **具体定位到那一条 GOT entry 是 static linker 的工作**，具体说来：

- static linker 扫描 object file，收集 relocs
- static linker 根据 relocs 生成 GOT (因为 static linker 知道 external variables 在哪儿)
- static linker 此时已经知道了 GOT 在 executable 中的物理位置了，它再回头算 `reloc.address` 与对应的 GOT entry 之间的 offset (注意还有 `%rip` 要参与运算)
- 这个算出来的 offset 就是 external variables 的 `displacement`

```txt
(__TEXT,__text) in object file        (__DATA, .data/.bss) in executable
+--------------------+                +--------------------------+
| Instruction:       |                | External _shared_int     |
| movq	(%rip), %rax |                | Address: 0x3000          |
+---------+----------+                | Value: 42               |
          |                           +--------------------------+
          | 1. Calculate RIP + Offset               ^
          v                                         |
(.got) in executable                                | 3. 最终跳转
+-------------------------+                         |
| [Entry for _shared_int] |                         |
| Content: 0x3000         | ------------------------+
+-------------------------+ 
      2. 链接器/加载器填入地址
```

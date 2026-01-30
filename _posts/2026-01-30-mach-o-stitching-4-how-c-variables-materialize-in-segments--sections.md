---
title: "Mach-O Stitching #4: How C Variables Materialize in Segments & Sections"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Code

```c
// test.c

int global_elink = 1;          // External Linkage  => (__DATA,__data)         
static int global_ilink = 3;   // Internal Linkage  => (__DATA,__data)
const int constant_val = 7;    // Read-only         => (__TEXT,__const) 

void func() {
    static int count = 15;     // Static Storage    => (__DATA,__data)
    int local_val = 31;        // Automatic Storage => Stack only, no symbol
    
    global_ilink += 0;  // global_ilink might be wiped as a dead symbol even when `clang -O0`
                        // this statement keeps it alive
}
```

```bash
ᐅ clang -O0 -c test.c -o test.o
```

# `__TEXT` Segment

```bash
ᐅ otool -tv test.o  # Display the contents of the (__TEXT,__text) section. 
                    # With the -v flag, this disassembles the text. 
                    # With the -V flag, it also symbolically disassembles the operands.
test.o:
(__TEXT,__text) section
_func:
0000000000000000	pushq	%rbp
0000000000000001	movq	%rsp, %rbp
0000000000000004	movl	$0x1f, -0x4(%rbp)  # int local_val = 31;
000000000000000b	movl	(%rip), %eax
0000000000000011	addl	$0x0, %eax
0000000000000014	movl	%eax, (%rip)
000000000000001a	popq	%rbp
000000000000001b	retq
```

```bash
ᐅ otool -v -s __TEXT __const test.o  # Display the contents of the (__TEXT,__const) section. 
test.o:
Contents of (__TEXT,__const) section
0000000000000018	07 00 00 00
                    #---# # const int constant_val = 7;
```

where `07 00 00 00` is little-endian `0x07` for `const int constant_val = 7;`.

# `__DATA` Segment

```bash
ᐅ otool -dv test.o
test.o:
(__DATA,__data) section
0000000000000010	01 00 00 00 0f 00 00 00 03 00 00 00
                    #---------#                         # int global_elink = 1;
                                #---------#             # static int count = 15;
                                            #---------# # static int global_ilink = 3;
```

where:

- `01 00 00 00` is little-endian `0x01` for `int global_ext = 1;`
- `03 00 00 00` is little-endian `0x03` for `static int global_ilink = 3;`
- `0f 00 00 00` is little-endian `0x0f` for local `static int count = 15;`

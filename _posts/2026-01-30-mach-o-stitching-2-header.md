---
title: "Mach-O Stitching #2: Header"
description: ""
category: Compiler
tags: []
toc: false
toc_sticky: false
---

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
ᐅ otool -h vanilla.o  # Display the Mach-O header
vanilla.o:
Mach header
      magic  cputype cpusubtype  caps    filetype ncmds sizeofcmds      flags
 0xfeedfacf 16777223          3  0x00           1     4        520 0x00002000
```

如果看不懂这些 magic number，可以加上 `-v` 让 `otool` 显示 symbolic values:

```bash
ᐅ otool -hv vanilla.o
vanilla.o:
Mach header
      magic  cputype cpusubtype  caps    filetype ncmds sizeofcmds      flags
MH_MAGIC_64   X86_64        ALL  0x00      OBJECT     4        520 SUBSECTIONS_VIA_SYMBOLS
```

Header fields explained:

- `magic` $\Rightarrow$ a magic number that identifies the Mach-O file format. E.g.:
    - `0xfeedface` $\Rightarrow$ big-endian 32-bit
    - `0xfeedfacf` $\Rightarrow$ big-endian 64-bit
    - `0xcafebabe` $\Rightarrow$ big-endian universal 
 - `cputype` $\Rightarrow$ identifies the CPU architecture family
    - `16777223 == 0x1000007` $\Rightarrow$  `CPU_TYPE_X86_64` (Intel/AMD 64-bit)
       - the high bit `0x1000000` indicates 64-bit capability
       - see `/usr/include/mach/machine.h` for the definitions
- `cpusubtype`$\Rightarrow$ specifies CPU variant within the architecture family
    - `3` $\Rightarrow$  `CPU_SUBTYPE_X86_64_ALL` (compatible with all x86_64 processors)
- `caps`$\Rightarrow$ CPU capability bits (rarely used, usually `0`)
- `filetype`
    - `1` $\Rightarrow$  `MH_OBJECT` (relocatable object file, like your `.o` file)
    - `2` $\Rightarrow$  `MH_EXECUTE` (executable)
    - `6` $\Rightarrow$  `MH_DYLIB` (dynamic library)
    - `8` $\Rightarrow$  `MH_BUNDLE` (loadable bundle)
- `ncmds` $\Rightarrow$ number of load commands (that describe segments, symbols, etc.) following the header
    - `4` commands in your case
- `sizeofcmds` $\Rightarrow$  total size in bytes of all load commands
    - `520` bytes in your case
- `flags` $\Rightarrow$ misc. flags
    - `0x2000` $\Rightarrow$  `MH_SUBSECTIONS_VIA_SYMBOLS`, which indicates the object file's sections can be divided at symbol boundaries for dead code stripping
---
title: "Mach-O Stitching #5: How to Interpret Symtab"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 1. `LC_SYMTAB` $\Rightarrow$ 指定 symtab/strtab 的位置

我们继续沿用这个代码：

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

可得 `LC_SYMTAB`:

```bash
Load command 2
     cmd LC_SYMTAB  # Symbol Table
 cmdsize 24
  symoff 688  # symbol table is at file (i.e. `vanilla.o`) offset 688 (in byte)
   nsyms 2    # there are 2 symbols
  stroff 720  # string table is at file (i.e. `vanilla.o`) offset 720 (in byte)
 strsize 16   # size of the string table is 16 bytes
```

# 2. `nlist_64` $\Rightarrow$ symtab 的 entry

如果我们 seek 到 file offset `688`，可以查看 symtab 的 binary contents:

```bash
ᐅ xxd -s 688 -l 48 -a -d -e vanilla.o  
# -s: start from <offset>
# -l: length to read
# -a: empty lines (like all '\0' values) are compactly represented by a '*'
# -d: use decimal addresses
# -e: use little-endian
00000688: 00000007 0000020f 00000014 00000000   # for symbol `_a`
00000704: 00000001 0000010f 00000000 00000000   # for symbol `_main`
00000720: 616d5f00 5f006e69 00000061 00000000   ._main._a.......
```

> [!caution] `xxd` with `-e` option shows little-endian
> 
> 比 big-endian 直观一点。
> endianness 记不住的话，有一个诀窍：我们日常的计数都是 little-endian (least significant byte (LSB) at the lowest memory address).

symtab 的 entry/record 的 size 是 16 bytes. 每个 entry/record conceptually 是一个 `struct nlist_64` object:

```c
// See https://llvm.org/doxygen/BinaryFormat_2MachO_8h_source.html#l01017
struct nlist_64 {
  uint32_t n_strx;   // char index into the string table
  uint16_t n_desc;   // additional info for non-`N_STAB`-typed symbols
  uint8_t  n_sect;   // number of the section that this symbol can be found in, or `NO_SECT` if the symbol is not to be found in any section.
  uint8_t  n_type;   // type flag
  uint64_t n_value;  // this value is different for each type of symbol, e.g.
                         // for the `N_SECT` symbol type, this is the address (offset from the start of the segment) of the symbol. 
                         // for `N_UNDF | N_EXT`, this is not used.
};
```

以 `_a` 这个 symbol 为例，binary contents 是这么划分的：

| `n_strx`   | `n_desc`  | `n_sect` | `n_type` | `n_value`           |
| ---------- | --------- | -------- | -------- | ------------------- |
| `00000007` | `0000`    | `02`     | `0f`     | `00000014 00000000` |
| $4$ bytes  | $2$ bytes | $1$ byte | $1$ byte | $8$ bytes           |

`objdump --syms` 的结果与 `nlist_64` 也是对应的：

```bash
ᐅ objdump --syms vanilla.o

vanilla.o:     file format mach-o-x86-64

SYMBOL TABLE:
0000000000000014 g       0f SECT   02 0000 [.data] _a
0000000000000000 g       0f SECT   01 0000 [.text] _main

# 0000000000000014 == n_value (big-endian)
#               0f == n_type  == 0b 0000 1111
#                     => g    == "global", i.e. EXTERNAL flag is set (from n_type)
#                     => SECT == symbol type is N_SECT (from n_type)
#               02 == n_sect
#             0000 == n_desc
#          [.data] == section that this symbol is associated
#               _a == name of this symbol
```

## `n_strx`

表示这个 symbol 对应的 string (i.e. 这个 symbol 的 name) 在 strtab 中的 index

> [!caution] 注意这个 index 是 index of characters，不是 index of strings
> 
> 比如 `n_strx == 2` 表示 symbol name 的起始的 char 是 `strtab[2]`，而不是表示 "the 2nd string".

## `n_type` 

是一个 byte value，我们会用以下 4 个 masks 去探测它的值：

$$
\operatorname{n\_type} = \underbrace{b_{7} \, b_{6} \, b_{5}}_{\operatorname{N\_STAB}} \;\; \underbrace{b_{4}}_{\operatorname{N\_PEXT}} \;\; \underbrace{b_{3} \, b_{2} \, b_{1}}_{\operatorname{N\_TYPE}} \;\; \underbrace{b_{0}}_{\operatorname{N\_EXT}}
$$

```c
N_EXT  = 0x01 = 0b 0000 0001  // 查看 `n_type` 的 bit 0
N_TYPE = 0x0e = 0b 0000 1110  // 查看 `n_type` 的 bit 1,2,3, these bits define the type of the symbol.
N_PEXT = 0x10 = 0b 0001 0000  // 查看 `n_type` 的 bit 4
N_STAB = 0xe0 = 0b 1110 0000  // 查看 `n_type` 的 bit 5,6,7

/*************************/
/***** EXTERNAL flag *****/
/*************************/
if n_type & N_EXT == 1:
    // This symbol is an EXTERNAL symbol,
    //   meaning this symbol is either defined outside this file, 
    //   or is defined in this file but can be referenced by other files.

/************************/
/***** SYMBOL TYPES *****/
/************************/
switch (n_type & N_TYPE):
    case N_UNDF == 0x0 == 0b 0000:
        // This symbol is UNDEFINED. 
        // Undefined symbols are symbols referenced in this module but defined in a different module.
        // The `n_sect` field is set to `NO_SECT`

    case N_ABS  == 0x2 == 0b 0010:
        // This symbol is ABSOLUTE (considered DEFINED). 
        // The linker does not change the value of an absolute symbol. 
        // The `n_sect` field is set to `NO_SECT`.
    
    case N_INDR == 0xa == 0b 1010:
        // This symbol is DEFINED to be the same as another symbol. 
        // The `n_value` field is an index into the string table specifying the name of the other symbol. 
        // When that symbol is linked, both this and the other symbol have the same defined type and value.
    
    case N_PBUD == 0xc == 0b 1100:
        // This symbol is considered UNDEFINED and the image is using a PRE-BOUND value for the symbol. 
        // The `n_sect` field is set to `NO_SECT`.

    case N_SECT == 0xe == 0b 1110:
        // This symbol is DEFINED in the section number given in `n_sect`

/*********************************/
/***** PRIVATE EXTERNAL flag *****/
/*********************************/
if n_type & N_PEXT == 1:
    // This symbol is marked as having limited global scope.
    // When the file is fed to the static linker, it clears the `N_EXT` bit for each symbol with the 
    //   `N_PEXT` bit set. (The `ld` option `-keep_private_externs` turns off this behavior.) 
    // With OS X GCC, you can use the `__private_extern__` function attribute to set this bit.

/***************************************************/
/***** SYMBOLIC-DEBUGGING TABLE (stab)-related *****/
/***************************************************/
if n_type & N_STAB != 0:
    // If any of these 3 bits are set, the symbol is a `stab` entry. 
    // In that case, the entire `n_type` field is interpreted as a `stab` value. 
    // See `/usr/include/mach-o/stab.h` for valid `stab` values.
```

## `n_sect`

An integer specifying the number of the section that this symbol can be found in, or `NO_SECT` if the symbol is not to be found in any section of this image. The sections are contiguously numbered across segments, starting from 1, according to the order they appear in the `LC_SEGMENT` load commands.

## `n_desc`

### Explanations

是一个 16-bit value，我们会用以下 3 类 bit masks 去探测它的值：

$$
\operatorname{n\_desc} = \underbrace{b_{15} \, b_{14} \, b_{13} \, b_{12} \, b_{11} \, b_{10} \, b_{9} \, b_{8}}_{\text{library ordinal}} \;\; \underbrace{b_{7} \, b_{6} \, b_{5} \, b_{4}}_{\text{attribute flags}} \;\; \underbrace{b_{3} \, b_{2} \, b_{1} \, b_{0}}_{\operatorname{REFERENCE\_TYPE}}
$$

```c
REFERENCE_TYPE = 0xF = 0b 0000 1111  // 查看 `n_desc` 的 bit 0,1,2,3
// 4 Attribute Flags
REFERENCED_DYNAMICALLY = 0x10 = 0b 0001 0000  // 查看 `n_desc` 的 bit 4
N_DESC_DISCARDED       = 0x20 = 0b 0010 0000  // 查看 `n_desc` 的 bit 5
N_WEAK_REF             = 0x40 = 0b 0100 0000  // 查看 `n_desc` 的 bit 6
N_WEAK_DEF             = 0x80 = 0b 1000 0000  // 查看 `n_desc` 的 bit 7

/***************************/
/***** REFERENCE TYPES *****/
/***************************/
switch (n_desc & REFERENCE_TYPE):
    /***** External References *****/
    case REFERENCE_FLAG_UNDEFINED_NON_LAZY         == 0x0 == 0b 0000:
        // This symbol is a reference to an EXTERNAL NON-LAZY (data) symbol 
        //   (like a global variable from another library).
    case REFERENCE_FLAG_UNDEFINED_LAZY             == 0x1 == 0b 0001:
        // This symbol is a reference to an EXTERNAL LAZY (that will be resolved on first use) symbol 
        //   (that is, to a function call).
    
    /***** Local Definitions *****/
    case REFERENCE_FLAG_DEFINED                    == 0x2 == 0b 0010:
        // This symbol is DEFINED in this module and PUBLICLY VISIBLE.
    case REFERENCE_FLAG_PRIVATE_DEFINED            == 0x3 == 0b 0011:
        // This symbol is DEFINED in this module and PRIVATELY VISIBLE 
        //   only to modules within this shared library.
    
    /***** Private Inter-Module References *****/
    case REFERENCE_FLAG_PRIVATE_UNDEFINED_NON_LAZY == 0x4 == 0b 0100:
        // This symbol is a reference to an NON-LAZY (data) symbol in another module in this file, 
        //   and is PRIVATELY VISIBLE only to modules within this shared library.
    case REFERENCE_FLAG_PRIVATE_UNDEFINED_LAZY     == 0x5 == 0b 0101:
        // This symbol is a reference to an LAZY (that will be resolved on first use) symbol 
        //   (that is, to a function call) in another module in this file, 
        //   and is PRIVATELY VISIBLE only to modules within this shared library.
        
/***************************/
/***** ATTRIBUTE FLAGS *****/
/***************************/
if n_desc & REFERENCED_DYNAMICALLY == 1:
    // This bit marks the symbols that runtime APIs like `dlsym()` might look up by name.
    // The `strip` tool preserves these symbols even during aggressive stripping.

if n_desc & N_DESC_DISCARDED == 1:
    // This bit is reserved for the dynamic linker's internal use at runtime.
    // Don't set this yourself.
    
if n_desc & N_WEAK_REF == 1:
    // This symbol is a weak reference. 
    // If the dynamic linker cannot find a definition for this symbol, it sets the address of this symbol 
    //   to `0` (i.e. `NULL`), instead of causing a link error. 
    // The static linker sets this symbol given the appropriate weak-linking flags.
    
if n_desc & N_WEAK_DEF == 1:
    // This symbol is a weak definition.
    // If the static linker or the dynamic linker finds another (non-weak) definition for this symbol, 
    //   the weak definition is ignored. 
    // Only symbols in a coalesced section (like C++ template instantiations or inline functions that might 
    //   appear in multiple object files) can be marked as a weak definition.
    
/***************************/
/***** LIBRARY ORDINAL *****/
/***************************/
/* 
  Only when two-level namespace binaries is enabled (when `MH_TWOLEVEL` flag is set in the Mach-O header), 
  `n_desc` 的 bit 8,9,10,11,12,13,14,15 构成一个 byte 表示 library ordinal (i.e. the position number or order 
  number of libraries)
  
    - library ordinal `== 0` 表示 "the current image itself"
    - library ordinal `1<=i<=254` 表示 "the $i^{th}$ dylib" (numbered according to the order of 
        `LC_LOAD_DYLIB` load commands in the binary)
    - library ordinal `== 255` 表示 "find this symbol in the executable that loaded me, not in a dylib I load"
 */
```

> [!NOTE] reference/definition distinction
> 
> The distinction exists at the **binary/linker level**, not the source language level (i.e. the distinction is not language-specific). Once any language compiles down to machine code in Mach-O format (on macOS/iOS), the symbol table must distinguish between:
> - Symbols this binary provides (definitions)
> - Symbols this binary needs from elsewhere (references)

### Library Ordinal `255` and Plugins Scenario

Normally, the dependency flow is:

```txt
    Executable program
        ↓ (loads and uses)
    Dynamic library
```

The executable depends on the library.

With plugins, the dependency flow is **reversed**:

```txt
    Executable program (host application)
        ↑ (plugin uses symbols from)
    Plugin (loaded at runtime)
```

The plugin depends on the executable that loaded it.

Imagine a photo editing app with a plugin architecture:

**PhotoApp (executable):**

```c
// Defines utility functions for plugins to use
void registerFilter(const char* name, FilterFunc func);
Image* getCurrentImage();
```

**BlurPlugin.bundle (plugin):**

```c
// Uses functions from PhotoApp
void initPlugin() {
    registerFilter("Gaussian Blur", applyBlur);  // Calls function from host app
    Image* img = getCurrentImage();              // Calls function from host app
}
```

When the `BlurPlugin` symbol table has symbols referencing `registerFilter` and `getCurrentImage`:

- These symbols are **undefined** in the plugin (references)
- Their library ordinal is **255**
- This tells the dynamic linker: "find this symbol in the executable that loaded me (i.e. my parent executable), not in a dylib"

This allows plugins to call back into the host application that loaded them.

## `n_value`

An $8$-byte integer that contains the value of the symbol. The format of this value is different for each type of symbol table entry (as specified by the `n_type` field). For the `N_SECT` symbol type, `n_value` is the address of the symbol. See the description of the `n_type` field for information on other possible values.

# 3. strtab $\Rightarrow$ 本质是个 string buffer

strtab 紧跟在 symtab 后面。由于我们这里有两个 symbols (`nsym == 2`)，然后每个 `nlist_64` 是 16-bytes，所以 strtab 的起始位置在 `688 + 16 * 2 == 720` offset.

strtab 的本质是一个 C-string 的 sequence. E.g.: 

```bash
ᐅ xxd vanilla.o | tail -n1  # check the binary content of vanilla.o
000002d0: 005f 6d61 696e 005f 6100 0000 0000 0000  ._main._a.......
```

> [!NOTE] `0x000002d0 == 720 == stroff`

| Offset     | Content   |
| ---------- | --------- |
| `000002d0` | `\0`      |
| `000002d1` | `_main\0` |
| `000002d7` | `_a\0`    |

> [!NOTE] strtab 第一个 entry almost always 是 `\0`
> 
> 这是个 convention so that (1) unnamed or anonymous symbols (which are rare) can have `n_strx == 0` and (2) invalid or deleted symbols can have `n_strx == 0` as a special marker

在我们的 `LC_SYMTAB` 例子中，`strsize == 16` 其实是因为有 padding for alignment，因为理论上来说，一个 `\0` 加上一个 `_main\0` 再加上一个 `_a\0` 只占了 10-byte 的空间，但为了 alignment，这个 strtab 会被 pad 成：

| Offset     | Content          | Size |
| ---------- | ---------------- | ---- |
| `000002d0` | `\0`             | 1    |
| `000002d1` | `_main\0`        | 6    |
| `000002d7` | `_a\0`           | 3    |
| `000002d8` | `\0\0\0\0\0\0\0` | 6    |

> [!NOTE] foreign keys to strtab
> 
> 可以把 `n_strx` 理解成 symtab 到 strtab 的一个 foreign key. 这个设计使得这两个 tables 都是 aligned, reading 的效率非常高

# 4. symtab/strtab 的物理位置

如果我们拿到 executable:

```bash
ᐅ clang vanilla.o -o vanilla.out
```

再去和 object file 对比会发现：

- symta/strtab 在 object file 中不属于任何的 segment/section, 它只是单纯地 appended 在 object file 的尾部
- symta/strtab 在 executable 中属于 `__LINKEDIT` segment

这个判断依据是：object file 中，`LC_SYMTAB` 的 `symoff` 和 `stroff` 和其他的 segment/section 没有重叠；而 executable 中的情况是：

```bash
Load command 3
      cmd LC_SEGMENT_64
  cmdsize 72
  segname __LINKEDIT
   vmaddr 0x0000000100008000
   vmsize 0x0000000000004000
  fileoff 32768
 filesize 208     # __LINKEDIT 的 range 是 [32768, 32976)
      ... ...
      
Load command 6
     cmd LC_SYMTAB
 cmdsize 24
  symoff 32896
   nsyms 3        # symtab 的 range 是 [32896, 32944), inside __LINKEDIT
  stroff 32944
 strsize 32       # strtab 的 range 是 [32944, 32976), inside __LINKEDIT
```

> [!note] `__LINKEDIT` segment typically contains **no sections**, unlike `__TEXT` and `__DATA`
> 
> It's just a blob of raw linking metadata that other load commands (like `LC_SYMTAB`, `LC_DYSYMTAB`, `LC_DYLD_INFO`) reference by providing offsets into it.
> 也真是这个原因，我们用 `otool` 没法查看 `__LINKEDIT`

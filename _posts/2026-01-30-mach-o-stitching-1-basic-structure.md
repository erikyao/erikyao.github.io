---
title: "Mach O Stitching #1: Basic Structure"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

参考 [OS X ABI Mach-O File Format Reference](https://github.com/aidansteele/osx-abi-macho-file-format-reference) (注意 PDF 版本才有图)

# 0. Mach-O File Types

| Type                    | Constant         | Fully Linked? | Description                                                              |
| ----------------------- | ---------------- | ------------- | ------------------------------------------------------------------------ |
| Object                  | `MH_OBJECT`      | ❌            | Compiler output (`.o` files) - intermediate files that need linking      |
| Executable              | `MH_EXECUTE`     | ✅            | Runnable program - standard application binary                           |
| Dynamic Library         | `MH_DYLIB`       | ✅            | Shared library (`.dylib` files) - code shared between programs           |
| Bundle                  | `MH_BUNDLE`      | ✅            | Loadable plugin (`.bundle`, `.plugin`) - dynamically loaded modules      |
| Core Dump               | `MH_CORE`        | N/A           | Crash dump - memory snapshot of crashed process                          |
| Dynamic Linker          | `MH_DYLINKER`    | ✅            | The `dyld` program itself - loads and links dynamic libraries at runtime |
| Preload                 | `MH_PRELOAD`     | ✅            | Fixed address executable - loads at predetermined memory location        |
| Kernel Extension        | `MH_KEXT_BUNDLE` | ❌            | Kernel module (`.kext`) - loadable kernel extension                      |
| Debug Symbols           | `MH_DSYM`        | N/A           | Debug info (`.dSYM` bundles) - debugging symbols for crash analysis      |
| Dylib Stub              | `MH_DYLIB_STUB`  | Partial       | Linking stub - contains only symbols, no actual code                     |
| Fixed VM Shared Library | `MH_FVMLIB`      | ✅            | Obsolete - old-style fixed virtual memory shared library                 |

Note that:

- **Fully Linked?**: Indicates whether the file has gone through the linker and contains a `__LINKEDIT` segment
    - **N/A**: These file types don't follow the standard linking model
- **Obsolete types** like `MH_FVMLIB` are rarely seen in modern systems

You can check the file type of any Mach-O file using:

```bash
ᐅ otool -hv <file>
```

The `filetype` field in the Mach header will show the type.

# 1. Basic Structure of a Mach-O File

> [!NOTE]  `ld` and `dyld` on MacOS
> - `ld` == **L**ink e**D**itor, the static linker 
> - `dyld` == **DY**namic **L**ink e**D**itor, the dynamic linker

A Mach-O file contains three major regions:

1. _header_:
    - identifies the file as a Mach-O file
    - indicates the target CPU architecture
    - etc.
2. _load commands_, which specify the layout and linkage characteristics of the file, e.g.:
    - the initial layout of the file in virtual memory
    - the location of the symbol table (used for dynamic linking)
    - the initial execution state of the main thread of the program
    - the names of shared libraries that contain definitions for the main executable’s imported symbols
    - etc.
3. _data_ (_segments/sections_)
    - Each _segment_ contains $0$ or more sections. 
    - Each _segment_ defines a region of virtual memory that the dynamic linker maps into the address space of the process.
    - The exact number and layout of _segments_ and _sections_ is specified by the _load commands_ and the file type.
    - 我们这里主要讨论这些 segments：
        - `__TEXT`: contains executable code and other read-only data (yes, code is read-only of course)
        - `__DATA`: contains writable data
        - `__LD`: staging data for the static linker
        - `__LINKEDIT`: in user-level fully linked Mach-O files, the **last segment** is the _link edit_ segment, which contains raw data used by the dynamic linker, such as symbol, string, and relocation table entries
    - 另外还有如下这些 segments：
        - `__PAGEZERO`: a 4GB (on 64-bit) region of virtual memory at address `0` with no protection rights assigned, which causes any accesses to `NULL` to crash.
            - designed as a null pointer protection mechanism
        - `__OBJC`: contains data used by the Objective-C language runtime support library

# 2. File Content Changes During Static Linking

Note that an (relocatable) object file is not fully linked while an executable (object) file is. During static linking (i.e. during the process of `main.o` $\Rightarrow$ `main.out`), the following structural transformation occur:

## 2.1 New Segments

- **`__PAGEZERO` Created**
- **`__LINKEDIT` Created**

## 2.2 Segment Consumption & Transformation

- **`__LD` Consumption**: The compiler-generated `(__LD, __compact_unwind)` section is consumed. The linker processes this metadata to synthesize the final, optimized `(__TEXT, __unwind_info)` section.
- **`__TEXT` Refinement**:
     - Relocations resolved (All internal references fixed up with actual addresses)
     - Addresses assigned (Sections get final virtual memory addresses, not just offsets)
     - Potentially merged (Multiple object files' sections would be concatenated)
        
## 2.3 Data & Dynamic Linking Setup

- **`__DATA` Refinement**
     - Relocations resolved (Pointer values fixed up)
     - Addresses assigned (Final virtual memory addresses)
     - Symbol pointers added (as placeholders for addresses that `dyld` will resolve at runtime) to `(__DATA, __got)` (Global Offset Table)

> [!info] `__DATA_CONST` segment and **RELRO**
> In modern Mach-O files, `__got` is moved to a specific segment called `__DATA_CONST`.
> This allows the dynamic linker to write to them during load time (binding) and then `mprotect` them to read-only for the rest of the execution (a security feature called **RELRO**, Relocation Read-Only).

## 2.4 Load Command Updates

- **Entry Point**: `LC_MAIN` is added to point the kernel to the address of the `main()` function.
- **Dynamic Loader Info**:
    - `LC_LOAD_DYLINKER`: Specifies the path to the dynamic linker (usually `/usr/lib/dyld`).
    - `LC_DYLD_INFO_ONLY`: Contains the compressed "rebase" and "bind" opcodes used by `dyld` at startup.
    - `LC_LOAD_DYLIB`: One command is added for every linked framework (e.g., `libSystem`).
- **Symbol Tables**: `LC_SYMTAB` is updated to remove local/temporary labels, and `LC_DYSYMTAB` is added to categorize symbols for the dynamic linker (local vs. defined external vs. undefined external).

# 3. Structure Diagram

一个 object file 的结构大致如下：

```txt
┌─────────────────────────────────────────────────────────────┐
│                  REGION 1 - MACH-O HEADER                   │
├─────────────────────────────────────────────────────────────┤
│  magic          : 0xFEEDFACF (64-bit)                       │
│  cputype        : CPU_TYPE_ARM64                            │
│  cpusubtype     : CPU_SUBTYPE_ARM64_ALL                     │
│  filetype       : MH_OBJECT                                 │
│  ncmds          : Number of load commands                   │
│  sizeofcmds     : Total size of load commands               │
│  flags          : MH_NOUNDEFS | MH_DYLDLINK | ...           │
├─────────────────────────────────────────────────────────────┤
│                  REGION 2 - LOAD COMMANDS                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ├─ LC_SEGMENT_64 (__TEXT)                                  │
│  │   ├─ vmaddr    : 0x100000000                             │
│  │   ├─ vmsize    : ...                                     │
│  │   └─ sections  : [__text, __stubs, __cstring, ...]       │
│  │                                                          │
│  ├─ LC_SEGMENT_64 (__DATA)                                  │
│  │   ├─ vmaddr    : ...                                     │
│  │   ├─ vmsize    : ...                                     │
│  │   └─ sections  : [__data, __bss, __common, ...]          │
│  │                                                          │
│  ├─ LC_SEGMENT_64 (__LD)                                    │
│  │   ├─ vmaddr    : ...                                     │
│  │   ├─ vmsize    : ...                                     │
│  │   └─ filesize  : ...                                     │
│  │                                                          │
│  ├─ LC_SYMTAB                                               │
│  │   ├─ symoff   : Symbol table offset                      │
│  │   ├─ nsyms    : Number of symbols                        │
│  │   ├─ stroff   : String table offset                      │
│  │   └─ strsize  : String table size                        │
│  │                                                          │
│  ├─ LC_UUID                                                 │
│  │   └─ uuid: [16 bytes]                                    │
│  │                                                          │
│  ├─ LC_FUNCTION_STARTS                                      │
│  │   └─ Function start addresses                            │
│  │                                                          │
│  ├─ LC_DATA_IN_CODE                                         │
│  │   └─ Data-in-code entries                                │
│  │                                                          │
│  └─ LC_CODE_SIGNATURE                                       │
│      └─ Code signature offset and size                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                       REGION 3 - DATA                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   __TEXT SEGMENT                      │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __text SECTION                   │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Executable machine code (your compiled code)    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __const SECTION                  │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Initialized constant variables                  │  │  │
│  │  │ (The compiler places all nonrelocatable data    │  │  │
│  │  │ declared `const` in this section.)              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __cstring SECTION                │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ C string literals                               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __literal4 SECTION               │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ 4-byte literal values (single-precision floats) │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __literal8 SECTION               │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ 8-byte literal values (double-precision floats) │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __stubs SECTION                  │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Symbol stubs                                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __eh_frame SECTION               │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Exception handling frame information            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   __DATA SEGMENT                      │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __data SECTION                   │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Initialized mutable variables                   │  │  │
│  │  │ (such as writable C strings and data arrays)    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __const SECTION                  │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Initialized relocatable constant variables      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __bss SECTION                    │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ uninitialized static variables                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __common SECTION                 │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Uninitialized imported symbol definitions       │  │  │
│  │  │   located in the global scope                   │  │  │
│  │  │   (i.e. outside of any function declaration)    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __dyld SECTION                   │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Placeholder section used by the dynamic linker  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                ____mod_init_func SECTION        │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Module initialization functions                 │  │  │
│  │  │ (e.g. C++ static constructors)                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                ____mod_term_func SECTION        │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Module termination functions                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   __LD SEGMENT                        │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __compact_unwind SECTION         │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Compact unwind information                      │  │  │
│  │  │ (for exception handling/stack unwinding)        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

如果它被 fully linked 成 executable, 那么会有如下的 load command 增量：

```text
┌─────────────────────────────────────────────────────────────┐
│                  REGION 2 - LOAD COMMANDS                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ├─ LC_SEGMENT_64 (__PAGEZERO)                              │
│  │   ├─ vmaddr    : 0x0                                     │
│  │   ├─ vmsize    : 0x100000000                             │
│  │   └─ filesize  : 0                                       │
│  │                                                          │
│  ├─ LC_SEGMENT_64 (__LINKEDIT)                              │
│  │   ├─ vmaddr    : ...                                     │
│  │   ├─ vmsize    : ...                                     │
│  │   └─ filesize  : ...                                     │
│  │                                                          │
│  ├─ LC_DYSYMTAB                                             │
│  │   └─ Dynamic linking metadata                            │
│  │                                                          │
│  ├─ LC_DYLD_INFO_ONLY                                       │
│  │   ├─ rebase_off                                          │
│  │   ├─ bind_off                                            │
│  │   ├─ weak_bind_off                                       │
│  │   ├─ lazy_bind_off                                       │
│  │   └─ export_off                                          │
│  │                                                          │
│  ├─ LC_LOAD_DYLINKER                                        │
│  │   └─ name: /usr/lib/dyld                                 │
│  │                                                          │
│  ├─ LC_LOAD_DYLIB                                           │
│  │   └─ name: /usr/lib/libSystem.B.dylib                    │
│  │                                                          │
│  └─ LC_MAIN                                                 │
│      └─ Entry point                                         │
└─────────────────────────────────────────────────────────────┘
```

且会有如下的 segment 增量：

```text
┌─────────────────────────────────────────────────────────────┐
│                       REGION 3 - DATA                       │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   __TEXT SEGMENT                      │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __unwind_info SECTION            │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Unwinding information for exception handling    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   __DATA SEGMENT                      │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                __got SECTION                    │  │  │
│  │  ├─────────────────────────────────────────────────┤  │  │
│  │  │ Global offset table                             │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 __LINKEDIT SEGMENT                    │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  ├─ Rebase Information                                │  │
│  │  │   └─ Addresses to adjust on load                   │  │
│  │  │                                                    │  │
│  │  ├─ Binding Information                               │  │
│  │  │   ├─ Regular bindings                              │  │
│  │  │   ├─ Weak bindings                                 │  │
│  │  │   └─ Lazy bindings                                 │  │
│  │  │                                                    │  │
│  │  ├─ Export Information                                │  │
│  │  │   └─ Exported symbols trie                         │  │
│  │  │                                                    │  │
│  │  ├─ Symbol Table (SYMTAB)                             │  │
│  │  │   ├─ nlist_64 entries                              │  │
│  │  │   └─ Symbol definitions and references             │  │
│  │  │                                                    │  │
│  │  ├─ String Table (STRTAB)                             │  │
│  │  │   └─ Null-terminated symbol name strings           │  │
│  │  │                                                    │  │
│  │  ├─ Indirect Symbol Table                             │  │
│  │  │   └─ Indices into symbol table                     │  │
│  │  │                                                    │  │
│  │  ├─ Relocation Entries (RELOCS)                       │  │
│  │  │   └─ Address fixup information                     │  │
│  │  │                                                    │  │
│  │  ├─ Function Starts                                   │  │
│  │  │   └─ Compressed function start addresses           │  │
│  │  │                                                    │  │
│  │  ├─ Data-in-Code                                      │  │
│  │  │   └─ Non-instruction data in __text                │  │
│  │  │                                                    │  │
│  │  └─ Code Signature                                    │  │
│  │      └─ Digital signature and entitlements            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```
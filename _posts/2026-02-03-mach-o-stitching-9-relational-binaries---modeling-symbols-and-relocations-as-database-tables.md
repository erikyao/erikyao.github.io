---
title: "Mach-O Stitching #9: Relational Binaries – Modeling Symbols and Relocations as Database Tables"
description: ""
category: Compiler
tags: []
toc: false
toc_sticky: false
mermaid: true
---

```mermaid
---
config:
  themeVariables:
    fontFamily: 'monospace'
    fontSize: '14px'
---

classDiagram
    class STRTAB {
        +Index  0 -> "\0"
        +Index  1 -> "_shared_int\0"
        +Index 13 -> "_shared_float\0"
        +Index 27 -> "_main\0"
        +Index 33 -> "_shared_func\0"
    }

    class SYMTAB {
        <<Master Table>>
        +Index 0 -> (n_strx=27, ..., n_sect=15, type="SECT", str="_main")
        +Index 1 -> (n_strx=13, ..., n_sect=1, type="UNDF", str="shared_float")
        +Index 2 -> (n_strx=33, ..., n_sect=1, type="UNDF", str="shared_func")
        +Index 3 -> (n_strx=1, ..., n_sect=1, type="UNDF", str="shared_int")
    }

    class DYSYMTAB {
        <<Index View>>
        +ilocalsym = 0
        +nlocalsym = 0
        +iextdefsym = 0
        +nextdefsym = 1
        +iundefsym = 1
        +nundefsym = 3
    }

    class RELOC_ENTRIES {
        <<Junction Table>>
        +address 0x00000053 -> (pcrel=True, ..., type="BRANCH", symbol_num=2, value="_shared_func")
        +address 0x0000004c -> (pcrel=True, ..., type="BRANCH", symbol_num=2, value="_shared_func")
        +address 0x00000045 -> (pcrel=True, ..., type="BRANCH", symbol_num=2, value="_shared_func")
        +address 0x00000032 -> (pcrel=True, ..., type="GOT_LD", symbol_num=1, value="_shared_float")
        +address 0x0000001f -> (pcrel=True, ..., type="GOT_LD", symbol_num=1, value="_shared_float")
        +address 0x00000012 -> (pcrel=True, ..., type="GOT_LD", symbol_num=3, value="_shared_int")
    }
    
    class ADDRESS_SPACE {
        <<Master Table>>
        +address 0x00000012 -> (machine_code=0x00000000, assembly="disp32<\%rip>")
        +address 0x0000001f -> (machine_code=0x00000000, assembly="disp32<\%rip>")
        +address 0x00000032 -> (machine_code=0x00000000, assembly="disp32<\%rip>")
        +address 0x00000045 -> (machine_code=0x00000000, assembly="disp32<\%rip>")
        +address 0x0000004c -> (machine_code=0x00000000, assembly="disp32<\%rip>")
        +address 0x00000053 -> (machine_code=0x00000000, assembly="disp32<\%rip>")
    }

    SYMTAB ..> STRTAB : "FK Lookup (n_strx)"
    SYMTAB <-- DYSYMTAB : "Slices / Filters"
    RELOC_ENTRIES ..> SYMTAB : "JOIN (symbol_num -> Index)"
    RELOC_ENTRIES ..> ADDRESS_SPACE : "JOIN (address -> address)" 
```

- **strtab** 本质是个 string buffer, 不是 table
- **symtab** 可以看做是个 table
    - 注意它内部的 grouping (by symbol type) 和 sorting (by symbol name; for fast binary searches)
- **dysymtab** (仅图中我们涉及的部分) 也不是个 table, 更像是 symtab 的一组 indices/pointers
- object file 本身可以看做是个 table, 以 address/offset 为 index, 以 address 上的 machine code/assembly instruction 为 value; 我们称这个 table 为 **address space**
- **relocs** 可以看做是 symtab 和 address space 的 *junction table*, 它记录的其实是 `(address, symbol, ...)` 的 *occurrences* 

这个 system design 还是很工整的。
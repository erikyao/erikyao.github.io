---
title: "Linking the Dots #3: C Scopes"
description: ""
category: 
tags: []
toc: true
toc_sticky: true
---

# 1. The $4$ Types of C Scopes

参考 [IBM: XL C/C++ for AIX - Scope](https://www.ibm.com/docs/en/xl-c-and-cpp-aix/16.1.0?topic=linkage-scope). 

1. function prototype
2. function
3. block/local
4. file/global

## 1.1 Function Prototype Scope

> In a function declaration or in any function declarator — except the declarator of a function definition — parameter names have _function prototype scope_. Function prototype scope terminates at the end of the nearest enclosing function declarator.

这个 "function declarator" 有点 tricky:

```c
void  func(int x)  ;  // this is a declaration
   // -----------     // this part is a declarator
   // --------------  // this part is a prototype (declarator + semicolon)
   
void  func(int x)  { return 0 }  // this is a definition
   // -----------                // this part is a declarator
```

但这个 scope 就是 parameter 在 function declaration 中的 scope，没有什么特别的。

## 1.2 Function Scope

这个名字有点挂羊头卖狗肉了：

> The **only** type of identifier with _function scope_ is a label name. A label is implicitly declared by its appearance in the program text and is visible throughout the function that declares it.

这个 scope 的特殊之处在于：

> A label can be used in a `goto` statement before the actual label is seen.

(1) 一般的 variable/function 是无法做到 be used before declaration or definition 的，(2) label 也没有 nested block 这种从属关系的限制，所以这个 scope 需要独立出来，makes sense.

## 1.3 Block/Local Scope

> A name has _local scope_ or _block scope_ if it is declared in a block. A name with local scope can be used in that block and in blocks enclosed within that block, but the name must be declared before it is used. When the block is exited, the names declared in the block are no longer available.
>   
> Parameter names for a function have the scope of the outermost block of that function. Also, if the function is declared and not defined, these parameter names have function prototype scope.
>   
> When one block is nested inside another, the variables from the outer block are usually visible in the nested block. However, if the declaration of a variable in a nested block has the same name as a variable that is declared in an enclosing block, the declaration in the nested block hides the variable that was declared in the enclosing block. The original declaration is restored when program control returns to the outer block. This is called _block visibility._
> 
> Name resolution in a local scope begins in the immediately enclosing scope in which the name is used and continues outward with each enclosing scope. The order in which scopes are searched during name resolution causes the phenomenon of information hiding. A declaration in an enclosing scope is hidden by a declaration of the same identifier in a nested scope.

很长的一段，但 almost instinctive.

## 1.4 File/Global Scope

> A name has _file scope_ if the identifier's declaration appears outside of any block. A name with file scope and internal linkage is visible from the point where it is declared to the end of the translation unit.

这典型的话就只说一半，我们下面详解。

# 2. 与 linking/linkage 的关系

在 $C$ 中，**visibility 大抵就是 lexical scope 这个意思** (Java 中就完全不是这么回事儿了)，那你都 lexical 了，那自然是 **visibility to compiler** 了。而 linkage 从这个角度来看，可以简单理解成 **visibility to linker**.

| **Rule**                   | **File Scope + Internal Linkage** | **File Scope + External Linkage** |
| -------------------------- | --------------------------------- | --------------------------------- |
| **Visible to Compiler?**   | Yes, after declaration            | Yes, after declaration            |
| **Can be "Shadowed"?**     | Yes (by local variables)          | Yes (by local variables)          |
| **Visible to Linker?**     | No                                | Yes                               |
| **Lives in Symbol Table?** | No (or marked "Local")            | Yes (marked "Global")             |

> [!NOTE] 很明显 file/global scope 是讨论 linkage 的前提
> 
> block/local scope 只可能是 no linkage.
---
title: "Packrat Parsing (designed for PEGs) at a Glance"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# References

要研究 Packrat Parsing 自然是要参考正主 Bryan Ford 的文章 [Packrat Parsing: Simple, Powerful, Lazy, Linear Time](https://bford.info/pub/lang/packrat-icfp02.pdf)，但这篇的一个难点是揉了很多 functional programming (in Haskell) 的 implementation details 进去，你不懂 Haskell 就很难理解其中的精妙，但如果你只是要掌握 idea 的话，是完全可以脱离 Haskell 去读这篇的。

后续我会用 Guido van Rossum 大人的 [PEG Parsing Series Overview](https://medium.com/@gvanrossum_83706/peg-parsing-series-de5d41b2ed60) 系列来上手。

# What is a Packrat Parser?

packrat 的意思是：(1) a bushy-tailed rodent of western North America that has well-developed cheek pouches and that hoards food and miscellaneous objects; (2) a person who collects or hoards especially unneeded items. 简单说就是 "囤积癖患者"。
{: .notice--info}

从大类上说，packrat parser 是一个针对 [PEG](/compiler/2025/03/14/peg-parsing-expression-grammars) 的 backtracking parser + memorization + lazy evaluation.

| Type                     |  Packrat Parser is a ...| 
|--------------------------|-------------------------| 
| Top-Down Parser          |  ✅                   | 
| Recursive Descent Parser |  ✅                   | 
| Predictive Parser        |  ❌                   | 
| Backtracking Parser      |  ✅                   | 

packrat parser 没有像 $LL(1)$ 或者 $LR(1)$ 那样用到 lookahead，所以它不是一个 predictive 的 parser. 

但很多材料写道：可以把 PEG 理解成有 unlimited lookaheads (假设你有 prioritized choice expression $e_1 / e_2$，如果最终我们选择了 $e_2$，那么 $e_1$ 被 parse 的部分就都是 lookaheads)。我个人觉得没有必要这么理解。
{: .notice--danger}

## Ingredient 1: Backtracking Parser

参考我自己的 [toy_peg_parser](https://github.com/erikyao/toy_peg_parser/blob/main/src/peg_parser.py).

## Ingredient 2: Memorization

原文用了这么一个示例 grammar (注意这里没有用 PEG 的 prioritized choice expression $e_1 / e_2$，就是个普通的 grammar):

```ebnf
Additive  -> Multitive '+' Additive | Multitive
Multitive -> Primary '*' Multitive | Primary
Primary   -> '(' Additive ')' | Decimal
Decimal   -> '0' | ... | '9'
```

考虑这个一个 input $w = 2 \ast (3+4)$，要求写一个 parser 直接 evaluate 这个 arithmetic expression 的值，不用返回 parse tree.

backtracking parser 的 performance 问题的一大症结就是：浪费算力，即 fail 的分支会被 discard，即使后续可能还会 revisit 这个分支。那最好的解决方案就是 memorization. 原文的阐述是：

> As pointed out by [Birman and Ullman](https://www.sciencedirect.com/science/article/pii/S0019995873908516), a backtracking top-down parser of the kind presented in Section 2.1 can be made to operate in linear time without the added complexity or constraints of prediction. The basic reason the backtracking parser can take super-linear time is because of redundant calls to the same parse function on the same input substring, and these redundant calls can be eliminated through memoization.

那具体怎么 memorize，原文的方案是：

> Each parse function in the example is dependent only on its single parameter, the input string. Whenever a parse function makes a recursive call to itself or to another parse function, it always supplies either the same input string it was given (e.g., for the call by `pAdditive` to `pMultitive`), or a _suffix_ of the original input string (e.g., for the recursive call by `pAdditive` to itself after matching a `+` operator). If the input string is of length $n$, then there are only $n + 1$ distinct suffixes that might be used in these recursive calls, counting the original input string itself and the empty string. Since there are only four parse functions, there are at most $4(n +1)$ distinct intermediate results that the parsing process might require.

写的有点绕，但其实意思很简单：

- 你有 $k$ 个 rules，于是 recursive-descent parser 自然就有对应的 $k$ 个 functions (比如 `pAdditive()` 负责 parse `Additive -> ...`)
- 你的 input `w` 的长度为 $n$，于是一共有 $n+1$ 个 substrings: `w[0:] = w`, `w[1:]`, `w[2:]`, ..., `w[n:] = ""`
- 把这 $n+1$ 个 substrings 输入给这 $k$ 个 functions，得到 $k(n+1)$ 个 pre-computed 的结果，可以组织成一个 table $T$

![](/assets/posts/2025-08-18-packrat-parsing-designed-for-pegs/matrix_of_parsing_results.jpg)

注意 $T$ 的计算过程：

- 按 rules 的粒度 (最外层 $\to$ 最内层) 把 functions 从上到下排列
- 按 `w` 的自然顺序构成 columns
- 从 $T$ 的右下角开始计算，从下往上，然后 column by column ($\text{C8} \to \text{C7} \to \dots \to \text{C1} $)
- 然后你的 entry function (比如 `pAdditive(w)`) 的结果就在 $T$ 的左上角

注意 result 的表示方法：

> For brevity, `Parsed` results are indicated as $(v,c)$, where $v$ is the semantic value and $c$ is the column number at which the associated remainder suffix begins.

比如 $T[\operatorname{pDecimal}, \text{C6}] = (4, \text{C7})$ 的意思就是：

- 计算 `pDecimal("4)")`
- 得到的结果是 `4`
- 但是 `)` 没法处理，只能留给别的 function 去处理

我们的 parser 一般会写成 class 形式并附带两个 fields `parser.input` 和 `parser.pos` (a pointer to `input` characters)，所以按 function $\times$ `pos` 去组织 $T$ 也是一样的。
{: .notice--info}

这张表 $T$ 事无巨细，把所有的情况都考虑到了，所以称为是 packrat.
{: .notice--info}

## Ingredient 3: Lazy Evaluation

我们在 memorization 的基础上还能再改进一点：我们没有必要把所有的 $k(n+1)$ 个结果一次性全 pre-compute 出来，可以用 lazy 的形式，轮到我计算的时候再去填表就好了。

> An obvious practical problem with the tabular right-to-left parsing algorithm above is that it computes many results that are never needed. An additional inconvenience is that we must carefully determine the order in which the results for a particular column are computed, so that parsing functions such as `pAdditive` and `pMultitive` that depend on other results from the same column will work correctly.
>   
> **Packrat parsing is essentially a lazy version of the tabular algorithm** that solves both of these problems. A packrat parser computes results only as they are needed, in the same order as the original recursive descent parser would. However, once a result is computed for the first time, it is stored for future use by subsequent calls.

# Do you notice something is off?

Memorization of a packrat parser is **input-specific**. 意味着：

- 只有 repeatly parsing the same input 时才会有 performance 优势
- 如果每次都 feed 不同的 input 给 packrat parser，你根本无法获得 performance 优势，而且 memorization 反而成了 overhead (除非你 cache it for possible future parsing on some same old input)

但问题是：repeatly parsing the same input 在 real world 中是 very rare 的情景。我找了半天就发现这么一个稍微靠谱点的：

> Hot reload/watch modes. E.g. Development servers that re-parse files on each save. In this case, the parser can benefit from memorization on those non-changed files. (But why don't you just re-access the intermediate ASTs if you can save them somewhere in the memory?)

另外需要额外注意的是，repeatly parsing the same input 基本上也不会是 **multi-pass** 会有的场景。**multi-pass** 是个很广泛的概念，比如下面两种都可以称为是 multi-pass:

1. The Two-Pass Assembler Model (still used today)
    - Motive: Assembly languages allow forward references (e.g., jumping to a label defined later in the code). The length of a machine instruction sometimes depends on whether the address being referenced is known or needs a placeholder.
    - Pass 1: The assembler parser reads the entire source file. It focuses only on collecting all labels and their corresponding memory addresses (to build a symbol table). It ignores the actual code generation complexity.
    - Pass 2: The assembler parser reads the identical source file again. This time, it uses the now-complete symbol table from Pass 1 to resolve all forward references and generate the final machine code, ensuring instructions are the correct length.
2. Compilers with Extreme Memory Constraints (no longer a problem today)
    - Pass 1: The compiler would run the parser to perform lexical and syntactic analysis, build a small, incomplete symbol table, and then write an intermediate file to disk (often a serialized, unoptimized representation or a basic list of tokens). Crucially, the parser couldn't complete the full analysis.
    - Pass 2: The compiler would then run the parser (or a similar component) again, either reading the original source file or reading the intermediate file from the first pass. This was done simply because the compiler couldn't keep the necessary data structure in memory to transition directly to the next phase.

所以 **multi-pass** 的设计无外乎两种情况：(1) 历史原因；(2) 你有特殊需求。你也很难在 **multi-pass** 的设计中找到 specifically 能让 packrat parser 发挥优势的情景。

所以 packrat parser 的功能主要在于 **theoretical** 的 linear performance. (比如给某些设计背书？)
---
title: "LL(0) vs. LL(1) Grammars: From Single-String to Flexible Repetition"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# $LL(0)$ grammars cannot repeat

比如这么一个 $LL(0)$ grammar:

```bnf
<PROGRAM> ::= <STATEMENT>
<STATEMENT> ::= 'return' <VALUE>
```

它只包含这么一个 sentence $w = \text{return } \langle \text{VALUE} \rangle$. 这样的 $LL(0)$ grammar $G$ 都有 $\vert L(G) \vert = 1$.

它也不可能有 repetition，因为 repetition 意味着有 recursion. (虽然我们 [eliminated left recursion](/compiler/2025/06/23/appetizer-3-before-parsing-eliminating-left-recursions)，但可能有其他形式的 recursion.) 如果某个 variable $A \in V$ 有 recursion，那么 $A$ 就必须有个 terminating production，否则 $A$ 就是 [non-generating](/compiler/2025/06/21/appetizer-1-before-parsing-cfg-simplification#0-overview) 的。

```bnf
<A> ::= ... <A> ... | 'blah'  /* 'blah' is the terminating production */
```

但这么一来又违反了 $LL(0)$ 的定义，所以 $LL(0)$ grammar 不可能有 repetition.

# $LL(1)$ grammars without repetition are just like $LL(0)$ with alternatives

如果我们限定一个 $LL(1)$ grammar $G$ 不能有 repetition，那么 $\vert L(G) \vert = k$ 也是一个固定值，取决与 alternatives 的多少。

比如这么一个 $LL(1)$ grammar:

```bnf
<PROGRAM> ::= <STATEMENT>
<STATEMENT> ::= 'return' <VALUE> | 'print' <VALUE>
```

它只包含两个 sentences: $w_1 = \text{return } \langle \text{VALUE} \rangle$ 和 $w_2 = \text{print } \langle \text{VALUE} \rangle$. 于是 $\vert L(G) \vert = 2$.

# $LL(1)$ grammars with recursion can handle real programming patterns (loops, sequences)

比如这么一个 $LL(1)$ grammar:

```bnf
<PROGRAM> ::= <STATEMENT>
<STATEMENT> ::= 'return' <VALUE> | 'print' <VALUE> | <STATEMENT>
```

它就可以有任意多个 `return` 或者 `print` statements，所以它的 $\vert L(G) \vert = \infty$. 

这也就是所谓的 "one-or-more" pattern. {: .notice--info}
---
title: "Input Ambiguity vs Grammar Ambiguity / Theory vs Practice"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

本文是对 Josh Haberman 的 [LL and LR in Context: Why Parsing Tools Are Hard](https://blog.reverberate.org/2013/09/ll-and-lr-in-context-why-parsing-tools.html) 的总结。

-----

# Input Ambiguity vs Grammar Ambiguity

input (string), grammar, language 这三个层面都可能有 ambiguity 这个性质。language 的 ambiguity 性质特指 inherently ambiguous, 参考 [Appetizer #2 Before Parsing](/compiler/2025/06/22/appetizer-2-before-parsing-cfg-disambiguation#21-definition), 这个性质在 compiler engineering 基本不会涉及：(1) 正常人都不会把 programming language 设计成 inherently ambiguous；(2) 设计成 inherently ambiguous 并不是一件简单的事
{: .notice--info}

grammar ambiguity 我们在 [Appetizer #2 Before Parsing](/compiler/2025/06/22/appetizer-2-before-parsing-cfg-disambiguation#21-definition) 中详细讨论了，但 Josh 提出的 input ambiguity 还是很有用处的。比如：

- 你 dangling ELSE 其实是 input ambiguity
- 如果我的 grammar 处理了 dangling ELSE 这个问题，它在 dangling ELSE 上就不是 ambiguous 的了
- 但我们人脑解读 dangling ELSE 仍然会觉得它是 ambiguous 的
    - Josh 的用词是 _conceptual ambiguity_

考虑到 **Theory:** Determining whether a CFG is ambiguous is an _undecidable_ problem. 我们这里就有两个问题：

1. 我如何判断一个 programming language 是 unambiguous 的？
2. 我确定我的 programming language 是 unambiguous 之后，或者我确定我的 parser 能处理 ambiguity之后，我如何发现 input ambiguity?

## Q1: Determining if a programming language is unambiguous

如果你有一个 programming language 你不确定它是否 ambiguous, 但是你想直接上手硬给它写一个 parser，那么你可以用 [General Parsing](/compiler/2025/08/18/general-parsing-gllglr-at-a-glance) 来处理潜在的 ambiguity 风险。
{: .notice--info}

Josh 的建议是用 LR parser construction 来 test:

> It turns out that simply trying to construct an LR parser for a grammar is very nearly the most powerful ambiguity test we know of for CFGs. We know it cannot be a perfect test, since we already stated that testing ambiguity is undecidable. If a grammar is not LR we don’t know whether it is ambiguous or not. But every grammar that we can construct an LR parser for is guaranteed to be unambiguous, and as a bonus, you also get an efficient linear-time parser for it.

## Q2: Finding imput ambiguity

即使你用了 [General Parsing](/compiler/2025/08/18/general-parsing-gllglr-at-a-glance) 来处理 ambiguous grammar，或者你有一个 unambiguous grammar (比如 PEG is unambiguous by definition), 你是无法有效侦测 input ambiguity 的。还是考虑 dangling ELSE 这个例子：

1. 假设你的 grammar 或者 parser 不怕 dangling ELSE 问题
2. 但只有当 dangling ELSE 这个问题被 report 之后，你可能才认识到有这么一个问题，只是你的 grammar 或者 parser 一直在帮你规避这个问题
    - Josh 的描述是："you are really flying blind about whether there are conceptual ambiguities"

Josh 的总结是：

> Some real-world ambiguities can’t be resolved at a grammar-level because they have semantic context-sensitivity. To parse these languages, there must be a way of embedding arbitrary logic into the parser to disambiguate.

# Theory vs Practice

以下都是 theory:

> This determinism is really the defining characteristic that gives LL/LR both their advantages and disadvantages. ... They are not only fast, they are **predictably** fast: they have worst-case $O(n)$ performance. Some approaches like NFAs (nondeterministic finite automata) or backtracking parsers have good performance in common cases but can degrade severely (evenexponentially) in degenerate cases[^1]. ... You might think the bad cases are uncommon, but anyone who wants to DoS-attack your service can find and exploit them.

> Besides being fast, you can know that an LL/LR grammar is unambiguous because anambiguous grammar won’t allow you to build a deterministic automaton.

[^1]: [Ken Thompson’s NFA Simulation Algorithm](/compiler/2025/04/02/ken-thompsons-nfa-simulation-algorithm)

现实情况是：

> I think it is safe to say that _pure_ LL and LR parsers have proven to be largely inadequate for real-world use cases. Many grammars that you’d naturally write for real-world use cases are not LL or LR, as we will see. The two most popular LL and LR-based parsing tools (ANTLR and Bison, respectively) both extend the pure LL and LR algorithms in various ways, adding features such as operator precedence, syntactic/semantic predicates, optional backtracking, and generalized parsing.

而且受 General Parsing 并发处理 ambiguity 或者 conflicting parsing paths 的启发：

> This also gives us a hint about how pure LL/LR algorithms can be extended with extra features. Any method we can think of for deciding which path is the "right" one is fair game! 
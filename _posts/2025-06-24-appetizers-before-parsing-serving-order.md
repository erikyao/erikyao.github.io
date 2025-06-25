---
title: "Appetizers Before Parsing: Serving Order"
description: ""
category: Compiler
tags: []
toc: false
toc_sticky: false
---

When preparing a Context-Free Grammar (CFG) for parsing, especially for top-down parsers like LL parsers, the following 4 CFG preprocessing procedures are better to be performed in this order:

1. [Simplification](https://listcomp.com/compiler/2025/06/21/appetizer-1-before-parsing-cfg-simplification)
2. [Disambiguation](https://listcomp.com/compiler/2025/06/22/appetizer-2-before-parsing-cfg-disambiguation)
3. [Eliminate left recursion](https://listcomp.com/compiler/2025/06/23/appetizer-3-before-parsing-eliminating-left-recursions)
4. [Left factoring](https://listcomp.com/compiler/2025/06/24/appetizer-4-before-parsing-left-factoring)

[Some may argue that procedure #3 and #4 can be done in reversed order](https://cs.stackexchange.com/questions/2696/left-recursion-and-left-factoring-which-one-goes-first).

If you're writing a bottom-up parser (e.g., LR parser), left recursion is not a problem, so you might skip procedure #3.

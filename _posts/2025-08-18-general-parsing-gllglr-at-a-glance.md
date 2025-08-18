---
title: "General Parsing (GLL/GLR) at a Glance"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

参考：[Practical GeneralTop-down Parsers, by Ali Afroozeh and Anastasia Izmaylova](https://ipa.win.tue.nl/?event=practical-general-top-down-parsers)

-----

所谓 General Parsing，就是指能 parse general CFLs，意味着：

- 我不需要像 $LL(k)$ 或者 $LR(k)$ 那样先针对 grammar 做一些预处理 (see [Appetizers Before Parsing: Serving Order](/compiler/2025/06/24/appetizers-before-parsing-serving-order))
- 我不怕 $LL(k)$ 或者 $LR(k)$ parsing 中可能出现的 conflicts
- 我对 grammar 的要求极低

![](https://live.staticflickr.com/65535/54728755867_a9bb76f5bd.jpg)

GP 处理 conflicts 以及 ambiguity 用的都是同一个招数：spawns parallel parsing processes on conflicts/ambiguous parse trees. 这样会导致 $O(n^3)$ 的复杂度，为了提升新能，GP 会使用 [Graph-Structured Stack (GSS)](https://en.wikipedia.org/wiki/Graph-structured_stack).

---
title: "Left recursion is not a problem for LR parsing"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

See discussion here: [Left recursion in LR(1) parsers](https://stackoverflow.com/questions/21461974/left-recursion-in-lr1-parsers). Note that [templatetypedef](https://stackoverflow.com/a/21465204) wrote:

> LR(1) parsers can handle some types of left recursion, though not all left-recursive grammars are LR(1).

It sounds true, but vacuous, since there exist left-recursive yet ambiguous grammars.

It's also obvious that left recursive DCFLs is a subset of $LR(k) \setminus LL(k)$ languages 
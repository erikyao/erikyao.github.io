---
layout: post
title: "R %any% operator"
description: ""
category: R
tags: []
---
{% include JB/setup %}

整理自 _R Cookbook_。

-----

R interprets any text between percent signs (%...%) as a binary operator. Several such operators have predefined meanings:

```r
## %% : Modulo operator, 相当于 Java 里的 %
5%%2 ## ==1

## %/% : Integer division
5%/%2 ## ==2

## %*% : Matrix multiplication

## %in% : Returns TRUE if the left operand occurs in its right operand; FALSE otherwise
```

You can also define new binary operators using the %...% notation, by assigning a two-argument function to it, e.g.

```r
'%+-%' <- function(x,margin) x + c(-1,+1)*margin

100 %+-% 5
[1] 95 105

'%+%' <- function(s1,s2) paste(s1,s2,sep="")

"Hello" %+% "World"
[1] "HelloWorld"
```

Notice that we quote the binary operator when defining it but not when using it.

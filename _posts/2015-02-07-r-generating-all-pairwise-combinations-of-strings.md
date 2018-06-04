---
layout: post
title: "R: Generating All Pairwise Combinations of Strings"
description: ""
category: R
tags: []
---
{% include JB/setup %}

来自 _R Cookbook_。

-----

You have two sets of strings, and you want to generate all combinations from those two sets (their Cartesian product).

	> locations <- c("NY", "LA", "CHI", "HOU")
	> treatments <- c("T1", "T2", "T3")
	> outer(locations, treatments, paste, sep="-")
	     [,1]     [,2]     [,3]    
	[1,] "NY-T1"  "NY-T2"  "NY-T3"
	[2,] "LA-T1"  "LA-T2"  "LA-T3"
	[3,] "CHI-T1" "CHI-T2" "CHI-T3"
	[4,] "HOU-T1" "HOU-T2" "HOU-T3"

The `outer` function is intended to form the outer product. However, it allows a third argument to replace simple multiplication with any function. In this recipe we replace multiplication with string concatenation (`paste`), and the result is all combinations of strings.

一般 `outer` 的用法是矩阵乘法，比如：

```r
> x1 = c(1,2,3)
> x2 = c(4,5,6)
> outer(x1, x2) ## 等价于 as.vector(x1) %\*% t(as.vector(x2))
	 [,1] [,2] [,3]
[1,]    4    5    6
[2,]    8   10   12
[3,]   12   15   18
```

The result of `outer` is a matrix.

自己乘自己也是可以的，比如：

```r
> outer(treatments, treatments, paste, sep="-")
	 [,1]    [,2]    [,3]   
[1,] "T1-T1" "T1-T2" "T1-T3"
[2,] "T2-T1" "T2-T2" "T2-T3"
[3,] "T3-T1" "T3-T2" "T3-T3"
```

如果我们认为 "Tx-Ty" 和 "Ty-Tx" 是等价的话，我们可以用 `lower.tri()` 或者 `upper.tri()` 来去重：

```r
> m <- outer(treatments, treatments, paste, sep="-")
> lower.tri(m) ## lower triangle
	  [,1]  [,2]  [,3]
[1,] FALSE FALSE FALSE
[2,]  TRUE FALSE FALSE
[3,]  TRUE  TRUE FALSE
> upper.tri(m) ## upper triangle
	  [,1]  [,2]  [,3]
[1,] FALSE  TRUE  TRUE
[2,] FALSE FALSE  TRUE
[3,] FALSE FALSE FALSE
> m[!lower.tri(m)]
[1] "T1-T1" "T1-T2" "T2-T2" "T1-T3" "T2-T3" "T3-T3"
```

-> ~~~~~~~~~~ 2015.11.09 P.S. Start ~~~~~~~~~~ <-

You can also use `expand.grid`, but it's kind of different, like

```r
> locations <- c("NY", "LA", "CHI", "HOU")
> treatments <- c("T1", "T2", "T3")
> expand.grid(locations, treatments)
   Var1 Var2
1    NY   T1
2    LA   T1
3   CHI   T1
4   HOU   T1
5    NY   T2
6    LA   T2
7   CHI   T2
8   HOU   T2
9    NY   T3
10   LA   T3
11  CHI   T3
12  HOU   T3
```

At the same time, `expand.grid` is a good way to add an all-zero column:

```r
> expand.grid(locations=locations, init=0)
  locations init
1        NY    0
2        LA    0
3       CHI    0
4       HOU    0
```

-> ~~~~~~~~~~ 2015.11.09 P.S. End ~~~~~~~~~~ <-

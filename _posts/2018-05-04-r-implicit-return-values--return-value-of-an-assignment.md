---
category: R
description: ''
tags: []
title: 'R: implicit return values / return value of an assignment'
---

The last expression evaluated in a function becomes the return value.

但是有一个情况比较特殊：**An assignment is (invisibly) evaluated to the value assigned**.

```r
> x <- 5  # No ouput
> y <- (x <- 5)
> y
[1] 5
```

所以如果 function 最后一句是一个 assignment，它会 invisibly return 最后这个值：

```r
> foo <- function() {
+     x <- 5
+     # invisible(x)
+ }
> foo()  # No output
> y <- foo()
> y
[1] 5
```
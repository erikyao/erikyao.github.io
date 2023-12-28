---
category: R
description: ''
tags:
- Book
title: 'R: Graphics Tricks'
---

总结自 _R Graphics Cookbook_

## 1. 用 factor 消除没有意义的 ticks

See Section 2.3.

```r
library(ggplot2)

qplot(mpg$cyl)
qplot(factor(mpg$cyl))
```

`qplot()` 用在离散性数据上默认是 bar chart。

- `qplot(mpg$cyl)` 会显示 cyl = 4、5、6、7、8 的 bar chart，而 cyl = 7 的 count 是 0。
- `qplot(factor(mpg$cyl))` 则只显示有 count 的 cyl，即 cyl = 4、5、6、8

## 2. 绘制自定义函数的图像

See Section 2.6

```r
# Plot a user-defined function
myfun <- function(xvar) {
    1/(1 + exp(-xvar + 10))
}

curve(myfun(x), from=0, to=20)
```

用 ggplot2:

```r
library(ggplot2)

# This sets the x range from 0 to 20
qplot(c(0,20), fun=myfun, stat="function", geom="line")
# This is equivalent to:
ggplot(data.frame(x=c(0, 20)), aes(x=x)) + stat_function(fun=myfun, geom="line")
```
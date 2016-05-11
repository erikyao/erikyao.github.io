---
layout: post
title: "R: Saving, Loading and Removing in-memory Data"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

## Saving R Data

比如你创建了几个变量，想留着下次再用，这时可以用 `save(..., file="[name].rda")`，前面省略号处是变量名列表，有几个就填几个，后面是文件名，一般都是用 "rda" 格式。比如：

```r
> df1 <- data.frame()
> df2 <- data.frame()
> save(df1, df2, file="temp.rda") ## save variables in temp.rda in workspace
```

## Loading R Data

等到下次你需要用这几个变量时：

```r
> temp = load("temp.rda")
> temp ## list of variable names
[1] "df1" "df2"
```

这时 df1 和 df2 就已经 load 进来了

## Removing R Data

首先，用 `ls()` 可以查看当前 R Console 内有哪些 variables：

```r
> ls()
[1] "df1"  "df2"  "temp"
```

然后可以用 `rm()` 来指定具体 remove 哪个 variable，比如：

```r
> rm("temp")
> temp
Error: object 'temp' not found
> ls()
[1] "df1" "df2"
```

`rm()` 还可以接收 list 参数一次删除多个 variables：

```r
> temp = load("temp.rda")
> ls()
[1] "df1"  "df2"  "temp"
> rm(list=temp) ## load 进来的 variables 全部 remove 掉
> ls()
[1] "temp" ## 但是这个 load 进来的 variables 的名称列表还保留着
```

与 `ls()` 连用还能将当前 R Console 的所有 variables 都删除：

```r
> rm(list = ls()) ## remove all variables
> ls()
character(0)
```

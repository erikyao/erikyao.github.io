---
layout: post
title: "R Data Types - Part 3: Missing Values, Data Frames & Names"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

参照 [R Programming slides on cousera (pdf)](https://d396qusza40orc.cloudfront.net/rprog/lecture_slides/DataTypes.pdf)，作总结。

---

## 1. Missing Types

Missing values are denoted by `NA` or `NaN` for undefined mathematical operations.

* `is.na(x)` is used to test if x is `NA`
* `is.nan(x)` is used to test for `NaN`
* `NA` values have a class also, so there are `integer NA`, `character NA`, etc.
* A `NaN` value is also `NA` but the _**converse is not true**_. i.e.
	* `is.NAN(NA) == FALSE`
	* `is.NA(NAN) == TRUE`

## 2. Data Frames

Data frames are used to store <font color="red">tabular</font> data (i.e. a table)  

* They are represented as a special type of list where every element of the list has to have the same length
* Each element of the list can be thought of as a column, and the length of each element of the list is the number of rows
	* 假设是一个 nrow by ncol 的 table，那么 Data Frame 就是个 list(ncol)，每个元素都是个 list(nrow) 的感觉
	* 就是将表纵向切成条状
* Unlike matrices, data frames can store different classes of objects in each column (just like lists); matrices must have every element be the same class
* `row.names (df)` return a vector of row names which has length the number of rows in the data frame, and contains neither missing nor duplicated values
* Data frames are usually created by calling `read.table()` or `read.csv()`
* Can be converted to a matrix by calling `data.matrix()`
* `nrow(df)` 返回行数，`ncol(df)` 返回列数

## 3. Names

不是每个 object 都会有名字，但是你可以任意给 object 的 name 赋值，比如：

	> x <- 1:3
	> names(x)
	NULL
	> names(x) <- c("a", "b", "c")
	> x
	a b c
	1 2 3
	
注意此时 x 并没有变成 Data Frame，你可以用 `str(x)` 来查看它的信息：

	> str(x)
	 Named int [1:3] 1 2 3
	 - attr(*, "names")= chr [1:3] "a" "b" "c"
	 
R 的 object 也不是能任意加属性的，比如你随便来一个 `foo(x) <- c("a", "b", "c")` 这是行不通的。  

list 在创建时可以直接指定 name：

	> x <- list(a = 1, b = 2, c = 3)
	
matrix 可以后期指定 dimname：

	> m <- matrix(1:4, nrow = 2, ncol = 2)
	> dimnames(m) <- list(c("a", "b"), c("c", "d"))
	> m
	c d
	a 1 3
	b 2 4
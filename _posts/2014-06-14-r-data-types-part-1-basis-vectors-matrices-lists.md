---
layout: post
title: "R Data Types - Part 1: Basis, Vectors, Matrices &amp; Lists"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

参照 [R Programming slides on cousera (pdf)](https://d396qusza40orc.cloudfront.net/rprog/lecture_slides/DataTypes.pdf)，作总结。

---

## 1. Data Type 基础

### 1.1 Atomic Classes 

R has 5 atomic classes

* character
* numeric (real numbers，实数，双精度 double)
	* `Inf` represents infinity; e.g. 1 / 0; 
	* `Inf` can be used in ordinary calculations; e.g. 1 / Inf == 0
	* `NaN` represents an undefined value (“not a number”); e.g. 0 / 0
* integer（整数）
	* 1 默认是 numeric
	* 1L 才是 integer（L 应该是指 long）
* complex（复数）
	* 比如 `2+4i`
* logical (boolean; TRUE & FALSE，可以简写成 T & F; 另外还有 `NA` 值)

### 1.2 Basic Objects

* The most basic object is a `vector`
	* A vector can only contain objects of the same class
* `list` is represented as a vector, but can contain objects of different classes
	* Technically, lists are vectors. 因为 `is.vector(list()) == TRUE`。但 `is.list(vector()) == FALSE` 

### 1.3 Attributes

R objects can have attributes：

* names, dimnames
* dimensions (e.g. matrices, arrays)
* class
* length
* other user-deﬁned attributes/metadata

Attributes of an object can be accessed using the attributes() function.

## 2. Vectors

### 2.1 Creating Vectors

* Empty vectors can be created with the vector() function.
* `x <- vector("numeric", length = 10)` 产生 10 个 0
	* 或者用 `x <- rep(0, times = 10)` 也可以
* `x <- 9:29` 产生 [9, 29] 的整数序列
	* 其实也可以产生实数序列，比如: `pi:10` 产生 `3.141593 4.141593 5.141593 6.141593 7.141593 8.141593 9.141593`
* `x <- c(xxx, yyy, zzz, ...)` 接收变长参数列表填到 vector

### 2.2 Vector Element Coercion

When different objects are mixed in a vector, coercion occurs so that every element in the vector is
of the same class. e.g. `y <- c(1.7, "a") ## class(y) 得到的是 character`  

Explicit Coercion 可以理解为强制类型转换，比如 `as.numeric(x)`、`as.logical(x)`、`as.character(x)`、`as.complex(x)`

### 2.3 Element Index

* `x[1:10]` 返回前 10 个 元素
* `x[!is.na(x)]` 返回所有不是 NA 的元素
* `x[x>0]` 返回所有大于 0 的元素
* `x[c(-2, -10)]` 或者 `x[-c(2, 10)]` gives us all elements of x EXCEPT for the 2nd and 10 elements
* `x["bar"]` 获取 name 为 bar 的元素

## 3. Matrices ['meɪtrɪsi:z] (matrix [ˈmeɪtrɪks])

Matrices are vectors with a dimension attribute.  

### 3.1 直接创建 matrix

`m <- matrix(nrow = 2, ncol = 3)` 产生一个 2 行 3 列的矩阵，初始值都是 NA。矩阵的记法是 "行" 在前 "列" 在后，所以 2 行 3 列记作 `2x3 矩阵`，英文叫 `2 by 3 matrix`。  

`dim(m)` 返回一个 `c(nrow, ncol)` 

Matrices are constructed column-wise, so entries scan be thought of starting in the “upper left” corner and running down the columns. 

	> m <- matrix(1:6, nrow = 2, ncol = 3) 
	> m
	[,1] [,2] [,3]
	[1,] 1 3 5
	[2,] 2 4 6 

### 3.2 间接创建 matrix

Matrices can also be created directly from vectors by adding a dimension attribute.
	
	> m <- 1:10 
	> m
	[1] 1 2 3 4 5 6 7 8 9 10 
	> dim(m) <- c(2, 5) ## 改成一个 2x5 矩阵
	> m
	[,1] [,2] [,3] [,4] [,5]
	[1,] 1 3 5 7 9
	[2,] 2 4 6 8 10

Matrices can be created by column-binding or row-binding with cbind() and rbind().  

	> x <- 1:3
	> y <- 10:12
	> cbind(x, y) ## 可以理解为 bind by column
		 x y 
	[1,] 1 10 
	[2,] 2 11 
	[3,] 3 12
	> rbind(x, y) ## 可以理解为 bind by row
	  [,1] [,2] [,3]
	x    1    2    3
	y   10   11   12

但是要注意一点：R will repeat the shorter column or row to make the matrix:

	> rbind(x=1:6, y=10:12)
	  [,1] [,2] [,3] [,4] [,5] [,6]
	x    1    2    3    4    5    6
	y   10   11   12   10   11   12

	> cbind(x=1:3, y=4:5)
		 x y
	[1,] 1 4
	[2,] 2 5
	[3,] 3 4

## 4. Lists

`x <- list(1, "a", TRUE, 1 + 4i)` 创建一个 list。注意：

* `x[[1]] == 1` ## 获取第一个元素
* `x[1] == list(1)` ## returns a list of the selected elements

在使用 column name 来 access 的时候也有同样的问题，比如我们定义 `x <- list(first=1, second=2)`，有

* `x[["first"]] == 1` ## 获取第一个元素
* `x["first"] == list(1)` ## returns a list of the selected elements
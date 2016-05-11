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
* `t(df)` returns the transpose of df. Also works for matrices.

~~~~~~~~~~ 以下根据 _R Cookbook_ 更新 ~~~~~~~~~~

A data frame is a tabular (rectangular) data structure, which means that it has rows and columns. It is _**not**_ implemented by a matrix, however. Rather, _**a data frame is a list**_:

* The elements of the list are vectors and/or factors.
* Those vectors and factors are the columns of the data frame.
* The vectors and factors must all have the same length; in other words, all columns must have the same height.
* The equal-height columns give a rectangular shape to the data frame.
* The columns must have names.

Because a data frame is both a list and a rectangular structure, R provides two different paradigms for accessing its contents:

* You can use list operators to extract columns from a data frame, such as `dfrm[i]`, `dfrm[[i]]`, or `dfrm$name`.
* You can use matrix-like notation, such as `dfrm[i,j]`, `dfrm[i,]`, or `dfrm[,j]`.

### 2.1 Combining Vectors into a Data Frame

比想象中的简单，来自 DataCamp:

```r
> # Definition of vectors
> name <- c("Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune")
> type <- c("Terrestrial planet", "Terrestrial planet", "Terrestrial planet", 
		  "Terrestrial planet", "Gas giant", "Gas giant", "Gas giant", "Gas giant")
> diameter <- c(0.382, 0.949, 1, 0.532, 11.209, 9.449, 4.007, 3.883)
> rotation <- c(58.64, -243.02, 1, 1.03, 0.41, 0.43, -0.72, 0.67)
> rings <- c(FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE)
> 
> # Create a data frame from the vectors
> planets_df <- data.frame(name, type, diameter, rotation, rings)
> planets_df
	name               type diameter rotation rings
1	Mercury Terrestrial planet    0.382    58.64 FALSE
2	Venus Terrestrial planet    0.949  -243.02 FALSE
3	Earth Terrestrial planet    1.000     1.00 FALSE
4	Mars Terrestrial planet    0.532     1.03 FALSE
5	Jupiter          Gas giant   11.209     0.41  TRUE
6	Saturn          Gas giant    9.449     0.43  TRUE
7	Uranus          Gas giant    4.007    -0.72  TRUE
8	Neptune          Gas giant    3.883     0.67  TRUE
```

### 2.2 Combining Row Data into a Data Frame

假设现在有多个 observation，每个 observation 都是一个单行的 data frame，现在想把这些单行的 data frame 合并成一个大的 data frame：

```r
> row1 = data.frame(v1 = 1, v2 = 2, r = 3)
> row2 = data.frame(v1 = 4, v2 = 5, r = 6)
> row3 = data.frame(v1 = 7, v2 = 8, r = 9)
> rows = list(row1, row2, row3)
> dfrm = do.call(rbind, rows)
> dfrm
  v1 v2 r
1  1  2 3
2  4  5 6
3  7  8 9
```

如果 `row1`, `row2`, `row3` 是 list 的话会稍微麻烦一点：

```r
> row1 = list(v1 = 1, v2 = 2, r = 3)
> row2 = list(v1 = 4, v2 = 5, r = 6)
> row3 = list(v1 = 7, v2 = 8, r = 9)
> rows = list(row1, row2, row3)
> dfrm = do.call(rbind, Map(as.data.frame, rows))
> dfrm
  v1 v2 r
1  1  2 3
2  4  5 6
3  7  8 9
```

这里区分下 `do.call` 和 `Map`:

* `do.call` 的基本用法可以理解为 `do.call(function, list<args>)`，但它和 apply 一族的逻辑不同，它其实就是把 `list<args>` 全部填充到 `function` 里了。这对不定长参数列表尤其有用，因为你不用一个个的去填参数，比如上面的 `rbind`，你要自己写就是 `rbind(rows[[1]], rows[[2]], rows[[3]])`，太麻烦，`do.call` 就方便多了，不管你参数有多少个，我负责帮你把参数都填进去
* `Map` 是 apply 一族的，它是 `mapply` 的变体。`Map(as.data.frame, rows)` 的逻辑就是对 `rows` 的每一个元素都执行 `as.data.frame`，返回一个 result list

### 2.3 Preallocating a Data Frame

Theoretically, you can build a data frame by appending new rows, one by one. That’s OK for small data frames, but building a large data frame in that way can be tortuous. The memory manager in R works poorly when one new row is repeatedly appended to a large data structure. Hence your R code will run very slowly. 我猜是 `rbind` 时 R 会保留 data.frame 的副本，然后重新做一个新的，再 dump 掉副本。

One solution is to preallocate the data frame—assuming you know the required number of rows. By preallocating the data frame once and for all, you sidestep problems with the memory manager.

```r
> N = 1000000
> dfrm = data.frame(dosage=numeric(N), lab=character(N), response=numeric(N))
```
	
预分配 factor 时需要指定 `levels`，比如：

```r
> N = 1000000
> dfrm = data.frame(dosage=numeric(N),
+ 	lab=factor(N, levels=c("NJ", "IL", "CA")),
+ 	response=numeric(N))
```
	
### 2.4 Using `with` function

For a data frame called `suburbs` that contains a column called `pop`, here is the naïve way to calculate the z-scores of `pop`:

```r
> z <- (suburbs$pop - mean(suburbs$pop)) / sd(suburbs$pop)
```
	
The `with` function lets you expose the columns of a data frame as distinct variables. It takes two arguments, a data frame and an expression to be evaluated:

```r
> z <- with(suburbs, (pop - mean(pop)) / sd(pop))
```
	
### 2.5 Using `attach` function

`attach` 本身并没啥难的，这里要说的是：`attach(X)` 会创建一个 `X` 副本，用来简写 `X$var` 的 `var` 其实就是副本的一个 column，对 `var` 的修改不会实施到 `X$var` 上，vise versa。我们来看个例子：

```r
> X = data.frame(var1=c(1,2,3), var2=c(4,5,6))
> attach(X)

> var1 = 0 ## `var1` 的修改并没有影响到 `X$var1`
> X
  var1 var2
1    1    4
2    2    5
3    3    6

> X$var2 = 0 ## `X$var2` 的修改并没有影响到 `var2`
> X
  var1 var2
1    1    0
2    2    0
3    3    0
> var2
[1] 4 5 6

> detach(X) ## detach 后再检查一下，确实是 `X$var1` 没变，`X$var2` 有变
> X
  var1 var2
1    1    0
2    2    0
3    3    0
```

## 3. Names

不是每个 object 都会有名字，但是你可以任意给 object 的 name 赋值，比如：

```r
> x <- 1:3
> names(x)
NULL
> names(x) <- c("a", "b", "c")
> x
a b c
1 2 3
```
	
注意此时 x 并没有变成 Data Frame，你可以用 `str(x)` 来查看它的信息：

```r
> str(x)
 Named int [1:3] 1 2 3
 - attr(*, "names")= chr [1:3] "a" "b" "c"
```
	 
R 的 object 也不是能任意加属性的，比如你随便来一个 `foo(x) <- c("a", "b", "c")` 这是行不通的。  

list 在创建时可以直接指定 name：

```r
> x <- list(a = 1, b = 2, c = 3)
```
	
matrix 可以后期指定 dimname：

```r
> m <- matrix(1:4, nrow = 2, ncol = 2)
> dimnames(m) <- list(c("a", "b"), c("c", "d"))
> m
  c d
a 1 3
b 2 4
```
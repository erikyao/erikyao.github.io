---
layout: post
title: "R functions used in practice"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

## 1. 字符串处理

### formatC: 格式化输出

比如 `formatC(id, width=3, flag="0")` 输出长度为 3 的 id，不够长的填 0（比如 id = 1，则输出 "001"）。

### paste: 字符串拼接

比如 `paste("Hello", "world", sep=",")` 输出 "Hello,world"。

-----

## 2. 调试和编译

### stop: 终止程序并显示错误信息

比如我定义一个 `divide <- function(a, b)`，里面写了句 `if (b = 0) stop("cannot divide by 0")`，然后调用 `divide(5, 0)`，会出一句：

	Error in divide(5, 0) : cannot divide by 0
	
### suppressWarnings: 去掉 warning

注意用法：比如你调用 `x <- foo(bar)` 时 foo 产生了 warning，想去掉 warning 就可以把 `foo(bar)` 整个放到 suppressWarnings 里，变成这样：`x <- suppressWarnings(foo(bar))`，有点像 `system.time()` 的用法。
	
-----

## 3. 集合与元素

### %in%: 类似于 collection.contains(obj) 操作

<pre class="prettyprint linenums">
if (! state %in% allStates) {
	stop("invalid state")
}
</pre>

### tail(x, n=1): 可以代替 x[length(x)]

当 x 名字变得很长时，`x[length(x)]` 看得就会很心烦；而且 tail 可以指定 n>1 输出倒数的多个元素。

-----

## 4. 排序与遍历

### unique: 排除重复元素

<pre class="prettyprint linenums">
&gt; x &lt;- c(1:5, 2:6)
&gt; unique(x)
[1] 1 2 3 4 5 6
</pre>

### sort: 排序

<pre class="prettyprint linenums">
&gt; x &lt;- c(1:5, 2:6)
&gt; sort(x)
 [1] 1 2 2 3 3 4 4 5 5 6
 
&gt; x &lt;- c("CA", "TX", "AZ")
&gt; sort(x)
 [1] "AZ" "CA" "TX"
</pre>

### order: 多维排序

比如 `order(csv$Rating, csv$Name)` 是先按 csv$Rating 升序排，对于 csv$Rating 相同的，再按 csv$Name 升序排列。  

注意 order 只是返回一个 vector of row indexes，要得到排序后的 table 需要组合使用 `csv[order(csv$Rating, csv$Name), ]`。

### which.min: 找到 min 值所在的 index 或者行号；同理有 which.max

<pre class="prettyprint linenums">
&gt; x &lt;- c(7:9, 4:6, 1:3)
&gt; x
[1] 7 8 9 4 5 6 1 2 3
&gt; which.min(x)
[1] 7
&gt; which.max(x)
[1] 3
</pre>

-----

## 5. 构造 data frame

### data.frame 的 names 属性

你不指定 names 的话，R 会自动给你分配一个：

<pre class="prettyprint linenums">
&gt; x &lt;- data.frame(c(1:3), c(4:6))
&gt; x
  c.1.3. c.4.6.
1      1      4
2      2      5
3      3      6
</pre>

如果没有指定 names 但是是用 var 来装填的，names 会直接用 var 的名称：

<pre class="prettyprint linenums">
&gt; m &lt;- c(1:3)
&gt; n &lt;- c(4:6)
&gt; x &lt;- data.frame(m, n)
&gt; x
  m n
1 1 4
2 2 5
3 3 6
</pre>

直接指定 names 的效果是这样的：

<pre class="prettyprint linenums">
&gt; x &lt;- data.frame(foo = m, bar = n)
&gt; x
  foo bar
1   1   4
2   2   5
3   3   6
</pre>

### data.frame(df$A, df$B, df$C): 提取 df 的 column 构成新的 Data Frame

R 和 java 有一点不同的是 R 的构造器真的很强大，所以不要陷入 java 的思维去找单独的 extract 方法，灵活运用构造器可以带来很多惊喜。

-----

## 6. subset

`data(airquality)` 之后（BTW，`data()` 可以查看所有内置的 dataset）：

<pre class="prettyprint linenums">
&gt; subset(airquality, Month == 8 & Temp &gt; 90)
## 等同于
&gt; airquality[airquality$Month == 8 & airquality$Temp &gt; 90, ]
</pre>

而且 [In R, why is `[` better than `subset`?](http://stackoverflow.com/questions/9860090/in-r-why-is-better-than-subset) 说 [] 确实是要比 subset 好，具体细看。  

注意下这个逻辑，虽然 `airquality$Month` 是 column，但是 `airquality$Month == 8` 得到是一个长度为 nrow 的、值为 TRUE/FALSE 的 vector，`airquality[]` 根据这个 vector 过滤出值为 TRUE 的 row，所以 `airquality$Month == 8` 要放在 `[row,]` 的位置上。

-----

## 7. NA 的处理

### na.omit: 去掉有 NA 的行

<pre class="prettyprint linenums">
&gt; DF &lt;- data.frame(x = c(1, 2, 3), y = c(0, 10, NA))
&gt; na.omit(DF)
  x  y
1 1  0
2 2 10
</pre>

但是要注意，`na.omit(DF)` 并没有改变 DF 的值，要想改变 DF 的值，需要重新赋值 `DF <- na.omit(DF)`。

### read.table 的 na.strings 参数

na.strings: a character vector of strings which are to be interpreted as NA values.   

比如有的 table 里是 "N/A" 或 "Not Available"，那么就可以设置成 `read.table(..., na.strings=c("N/A", "Not Available" ),...)`。  

### data.frame 的 stringsAsFactors 参数（read.table 也有）

默认是 TRUE，此时元素是字符串的列 `df$A` 会被当做 factor，`df$A[[1]]` 会被当成 factor 的一个元素，`str(df$A[[1]])` 会得到类似 `Factor w/ 4510 levels "ABBEVILLE AREA MEDICAL CENTER",..: 866` 这样的信息，表示 `str(df$A[[1]])` 是 4510 个 levels 中 level 为 866 的元素，而且 `return(df$A[[1]])` 也会打出 `4510 Levels: ABBEVILLE AREA MEDICAL CENTER ...` 这样的信息，略烦。如果不用 factor 相关的功能，可以把 stringsAsFactors 这一项设置为 FALSE。  

关闭之后，`str(df$A)` 得到的是类似 `chr [1:370] "PROVIDENCE MEMORIAL HOSPITAL" ...` 这样的信息，表示是一个 string vector；`str(df$A[[1]])` 得到的是 `chr "CYPRESS FAIRBANKS MEDICAL CENTER"`。  

注意 `read.table` 也有 stringsAsFactors，功能一样。你 `read.table` 后再 `data.frame` 或者 `subset` 抽取的话，得到的 factor 可能是 `read.table` 时就分配好的，可能出现 levels 大于 length(df) 的情况。
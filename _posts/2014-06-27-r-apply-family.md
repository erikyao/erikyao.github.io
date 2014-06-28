---
layout: post
title: "R apply family"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

## Table of Contents

The Apply Family: 

* [lapply: Apply a Function over a List or Vector](#lapply)
* [sapply: Simplify the Result of lapply](#sapply)
* [apply: Apply a Function over Array Margins](#apply)
* [tapply: Apply a Function over a Ragged Array](#tapply)
* [mapply: a Multivariate Version of Sapply](#mapply)

Utility:

* [split: Splits a Vector (or list) or Data Frame into Groups Determined by a Factor or List of Factors](#split)

-----

## <a name="lapply"></a>lapply: Apply a Function over a List or Vector

`lapply(X, func, ...)` 可以理解成：

<pre class="prettyprint linenums">
List&lt;T&gt; result = ...;

for (T xn : X) {
	result.add(func(xn, ...));
}

return result;
</pre>

If X is not a list, it will be coerced to a list using `as.list`.

<pre class="prettyprint linenums">
if (!is.vector(X) || is.object(X)) 
	X <- as.list(X)
</pre>

lapply always returns a list, regardless of the class of the input.

apply family 里常见 anonymous function，比如这个 `lapply(x, function(x) x[,1])` 就是取 `list<Matrix>` 中每个 matrix 的第一列。

## <a name="sapply"></a>sapply: Simplify the Result of lapply

The simplification rule is:

* If the result is a list where every element is length 1, then a vector is returned
* If the result is a list where every element is a vector of the same length (> 1), a matrix is returned.
* If it can’t figure things out, a list is returned

## <a name="apply"></a>apply: Apply Functions Over Array Margins

`apply(X, MARGIN, FUN, ...)`  

首先我们要搞清楚 R 的 array。在 R 中说 array 你不能直接联想到 `int[]`，因为 R 的 array 上来就是多维的，而且你最好理解为多维 matrix。单个的 matrix 可以看做是最简单的 array。下面这个 array 你可以理解成 4 个 matrix，想象成 4 页纸，每张纸上有一个 matrix；或者想象成 4 块玻璃板，每一块上有一个 matrix，4 块玻璃板拼成一个 matrix 立方体。  

<pre class="prettyprint linenums">
&gt;x &lt;- array(rep(1, 24), c(2, 3, 4))
&gt;x
, , 1

     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1

, , 2

     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1

, , 3

     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1

, , 4

     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1
</pre>

然后再是这个 "Array Margins"，这个名字起得很奇怪，从字面上很难理解，我们举两个例子说明下：

<pre class="prettyprint linenums">
&gt;x &lt;- matrix(rep(1, 6), nrow=2, ncol=3)
&gt;x
     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1
&gt;apply(x, 1, sum)
[1] 3 3
&gt;apply(x, 2, sum)
[1] 2 2 2
&gt;apply(x, c(1, 2), sum)
     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1
</pre>

对矩阵而言，`margin = 1` 就是 apply by row，`margin = 2` 就是 apply by column，`margin = c(1, 2)` 就是 apply by every single element.

<pre class="prettyprint linenums">
&gt;x &lt;- array(rep(1, 24), c(2, 3, 4))
&gt;x
, , 1

     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1

, , 2

     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1

, , 3

     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1

, , 4

     [,1] [,2] [,3]
[1,]    1    1    1
[2,]    1    1    1

&gt; apply(x, 1, sum)
[1] 12 12
&gt; apply(x, 2, sum)
[1] 8 8 8
&gt; apply(x, 3, sum)
[1] 6 6 6 6
&gt; apply(x, c(1, 2), sum)
     [,1] [,2] [,3]
[1,]    4    4    4
[2,]    4    4    4
&gt; apply(x, c(1, 3), sum)
     [,1] [,2] [,3] [,4]
[1,]    3    3    3    3
[2,]    3    3    3    3
&gt; apply(x, c(2, 3), sum)
     [,1] [,2] [,3] [,4]
[1,]    2    2    2    2
[2,]    2    2    2    2
[3,]    2    2    2    2
</pre>

立体的情况复杂一点，请发挥你的空间想象能力~  

For sums and means of matrix dimensions, we have some shortcuts.

* `rowSums` = `apply(x, 1, sum)`
* `rowMeans` = `apply(x, 1, mean)`
* `colSums` = `apply(x, 2, sum)`
* `colMeans` = `apply(x, 2, mean)`

The shortcut functions are much faster，因为有专门优化过.

## <a name="tapply"></a>tapply: Apply a Function over a Ragged Array

`function (X, INDEX, FUN = NULL, ..., simplify = TRUE)`  

* X: an atomic object, typically a vector.
* INDEX: list of one or more factors, each of same length as X. The elements are coerced to factors by `as.factor`.
* FUN: the function to be applied, or NULL. In the case of functions like +, %*%, etc., the function name must be backquoted or quoted. If FUN is NULL, tapply returns a vector which can be used to subscript the multi-way array tapply normally produces.
* simplify: If FALSE, tapply always returns an array of mode "list". If TRUE (the default), then if FUN always returns a scalar, tapply returns an array with the mode of the scalar.

又有新概念了…… "Ragged Array"。其实这个在 Java 里也有，也叫 "Jagged Array"，就是指子数组不整齐的多维数组，比如 `{ {1, 2}, {3, 4, 5} }` 这样的。R 里的 Ragged Array 也是这个意思，所以这里的 Array 又不是多维 matrix 的那个 Array（你们多想个名字出来会死啊！）  

然后我们的 tapply 并不是直接作用在 Ragged Array 上的，这个 Ragged Array 是由 X 和 INDEX 两个参数拼起来的。以最简单的情况，X 是 vector、INDEX 是 factor 举个例子：

<pre class="prettyprint linenums">
&gt;X &lt;- 1:9
&gt;INDEX &lt;- factor('a', 'a', 'a', 'a', 'b', 'b', 'b', 'c', 'c')
</pre>

这两个参数一拼就会形成：

* a: 1, 2, 3, 4
* b: 5, 6, 7
* c: 8, 9

这就是所谓的 Ragged Array。[manual](http://cran.r-project.org/doc/manuals/R-intro.html#The-function-tapply_0028_0029-and-ragged-arrays) 也有说：

> The combination of a vector and a labelling factor is an example of what is sometimes called a _ragged array_, since the <font color="red">subclass sizes are possibly irregular</font>. When the subclass sizes are all the same the indexing may be done implicitly and much more efficiently.

一个超级好的类比是 Histogram：

* a: ========
* b: ======
* c: ==

然后我们算下按 a、b、c 分类的 sum：

<pre class="prettyprint linenums">
&gt; tapply(X, INDEX, sum)
 a  b  c 
10 18 17 
</pre>

## <a name="split"></a>split: Splits a Vector (or list) or Data Frame into Groups Determined by a Factor or List of Factors

就是 tapply 拼 Ragged Array 的过程，举个例子：

<pre class="prettyprint linenums">
&gt;X &lt;- 1:30
&gt;INDEX &lt;- gl(3, 10) ## Generate Levels：10 个 1，10 个 2，10 个 3；levels = 1, 2, 3
&gt;split(X, INDEX)
$`1`
 [1]  1  2  3  4  5  6  7  8  9 10

$`2`
 [1] 11 12 13 14 15 16 17 18 19 20

$`3`
 [1] 21 22 23 24 25 26 27 28 29 30
</pre>

`tapply(X, INDEX, fun)` == `lapply(split(X, INDEX), fun)`

<pre class="prettyprint linenums">
&gt;lapply(split(X, INDEX), sum)
$`1`
[1] 55

$`2`
[1] 155

$`3`
[1] 255
</pre>

下面看一个按两个 factor 分组的例子：

<pre class="prettyprint linenums">
&gt;X &lt;- 1:10
&gt;INDEX_1 &lt;- as.factor(c(rep('a', 5), rep('b', 5)))
&gt;INDEX_2 &lt;- gl(5, 2)
&gt;INDEX_1
 [1] a a a a a b b b b b
Levels: a b
&gt;INDEX_2
 [1] 1 1 2 2 3 3 4 4 5 5
Levels: 1 2 3 4 5
&gt;str(split(X, INDEX_1))
List of 2
 $ a: int [1:5] 1 2 3 4 5
 $ b: int [1:5] 6 7 8 9 10
&gt;str(split(X, INDEX_2))
List of 5
 $ 1: int [1:2] 1 2
 $ 2: int [1:2] 3 4
 $ 3: int [1:2] 5 6
 $ 4: int [1:2] 7 8
 $ 5: int [1:2] 9 10
&gt;str(split(X, list(INDEX_1, INDEX_2)))
List of 10
 $ a.1: int [1:2] 1 2
 $ b.1: int(0) 
 $ a.2: int [1:2] 3 4
 $ b.2: int(0) 
 $ a.3: int 5
 $ b.3: int 6
 $ a.4: int(0) 
 $ b.4: int [1:2] 7 8
 $ a.5: int(0) 
</pre>

可见 `X$m.n` == `X$m` ∩ `X$n`。  

`drop = TRUE` 的作用是去掉空行：

<pre class="prettyprint linenums">
&gt; str(split(X, list(INDEX_1, INDEX_2), drop=TRUE))
List of 6
 $ a.1: int [1:2] 1 2
 $ a.2: int [1:2] 3 4
 $ a.3: int 5
 $ b.3: int 6
 $ b.4: int [1:2] 7 8
 $ b.5: int [1:2] 9 10
</pre>

## <a name="mapply"></a>mapply: a Multivariate Version of Sapply

mapply applies `FUN` to the first elements of each (…) argument, the second elements, the third elements, and so on.  举个例子：

<pre class="prettyprint linenums">
&gt;l1 &lt;- list(a = c(1:10), b = c(11:20))
&gt;l2 &lt;- list(c = c(21:30), d = c(31:40))
&gt;mapply(sum, l1$a, l1$b, l2$c, l2$d)
[1]  64  68  72  76  80  84  88  92  96 100
</pre>

注意，这里 mapply 并不是：

<pre class="prettyprint linenums">
sapply(l1$a, sum)
sapply(l1$b, sum)
sapply(l2$c, sum)
sapply(l2$d, sum)
</pre>

而是：

<pre class="prettyprint linenums">
for (int i = 1; i <= 10; ++i) {
	list.add(l1$a[i] + l1$b[i] + l2$c[i] +l2$d[i]);
}
return list;
</pre>

理解成 apply (over Array Margins) 才是正确的。 

-----

参考资料：[A brief introduction to “apply” in R](http://nsaunders.wordpress.com/2010/08/20/a-brief-introduction-to-apply-in-r/)
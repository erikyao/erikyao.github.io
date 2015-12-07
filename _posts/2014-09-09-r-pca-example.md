---
layout: post-mathjax
title: "R PCA Example"
description: ""
category: Machine-Learning
tags: [ML-101, R-101, PCA]
---
{% include JB/setup %}

## 0. More Math Definitions

If _X_ is a matrix with each variable in a column and each observation in a row then the `SVD` is a "matrix decomposition" that decomposes the original matrix into 3 separate matrices as

->\\( X = U\*D\*V\^T \\)<-
<!-- -->
->(Octave 里是 `[U, S, V] = svd(X)`，\\( X = U\*S\*V\^T \\)，只是记号不同而已)<-
	
where the columns of `U` are orthogonal ([ɔ:'θɒgənl], 正交的) (`U` a.k.a **left singular vectors**), the columns of `V` are orthogonal (`V` a.k.a **right singular vectors**) and `D` is a diagonal matrix (`D` a.k.a **singular values**).

* 注：如果向量 _x_ 和 _y_ 的点积为 0，i.e. \\( x*y\^T = 0 \\)，则称 _x_ 和 _y_ 正交。上面说 "columns of `U` are orthogonal" 意思是 "`U` 的 columns （转置后）是两两正交的"，用 Octave 的写法就是 `U(:,i)' * U(:,j) = 0`。
* 注2：`U` 的 column（转置后）还是个单位向量，i.e. `U(:,i)' * U(:,i) = 1`
* 注3：结合 注1 和 注2，有 `U' * U = U * U' = I`
* 注4：其实 `V` 就是 `U'`，i.e. `U * V = I`

## 1. 题外话: Impute Missing Data before PCA

比如可以使用 [Bioconductor 的 {impute} 包]()。安装方法：

<pre class="prettyprint linenums">
source("http://bioconductor.org/biocLite.R")
biocLite("impute")
</pre>

比如使用 knn 策略来 impute：

<pre class="prettyprint linenums">
matrix2 &lt;- impute.knn(matrix)$data
</pre>

Knn, or k-nearest-neighbors, is a policy that take the k (10 by default in the code above) rows closest to the row with `NA`, impute the `NA` with average of the k rows.

## 2. Face Example

Load the .rda file [face.rda](https://wxezkq.bn1304.livefilestore.com/y2m7lZfcWIPkhecZDvJSuTOZpP1c_v9nTMGJInjwBrmFvKSpyezQUp2AvJYU_XzuMa2-kx48lgK2iT57XdSHyDsPuU3k2dtt_SB5MTOlQGOflg/face.rda?download&psid=1).

<pre class="prettyprint linenums">
load("face.rda")
image(t(faceData)[, nrow(faceData):1]) ## t for transpose; 相当于 Octave 的 X'

## 这里转置再上下颠倒一下完全是因为这个图片本身就是歪的，并没有什么特殊用意
</pre>

## 3. Variance Explained

<pre class="prettyprint linenums">
udv &lt;- svd(scale(faceData))
plot(udv$d^2/sum(udv$d^2), pch = 19, xlab = "Singular vector", ylab = "Variance explained")
</pre>

![](https://wxdjqa.bn1304.livefilestore.com/y2pxpEhY_mNzY9sn0kSPw51SzzMKGtH9IOI1WuNQgCe6TflMATSN2T6AhqBo04pHmRsYbVxCcILsjGuX-O7TJcO4Xl337EqQWST8LnuU51Tb6A/variance%20explained.png?psid=1)

注意这里和 [Machine Learning: Dimensionality Reduction](http://erikyao.github.io/machine-learning/2014/09/06/machine-learning-dimensionality-reduction/) 那篇不同，这里是直接把 _X_ 拿来分解了，然后再计算的协方差。

## 4. Create Approximations

<pre class="prettyprint linenums">
udv &lt;- svd(scale(faceData)) ## Note that '%*%' is matrix multiplication
## scale 就是指 feature scaling/mean normalization (centering)，i.e. subtract the mean then divide by the standard deviation

## dim(faceData) = 32x32
## dim(udv$u) = 32x32
## str(udv$d) = 1x32, 因为是 diagonal 于是把 0 全都省了
## dim(udv$v) = 32x32

approx1 &lt;- (udv$u[, 1] * udv$d[1]) %*% t(udv$v[, 1]) ## 这里必须加一个括号，不然 'd %*% t(v)' 会先结合 
approx5 &lt;- udv$u[, 1:5] %*% diag(udv$d[1:5]) %*% t(udv$v[, 1:5]) ## 'diag' is used to make the diagonal matrix out of d
approx10 &lt;- udv$u[, 1:10] %*% diag(udv$d[1:10]) %*% t(udv$v[, 1:10])
</pre>

## 5. Plot Approximations

<pre class="prettyprint linenums">
par(mfrow = c(1, 4))
image(t(approx1)[, nrow(approx1):1], main = "(a)")
image(t(approx5)[, nrow(approx5):1], main = "(b)")
image(t(approx10)[, nrow(approx10):1], main = "(c)")
image(t(faceData)[, nrow(faceData):1], main = "(d)") ## Original data
</pre>

![](https://wxdjqa.bn1304.livefilestore.com/y2pbqczh5gd_g3R3_pqvG-XA_4RPWKVkQYXTjEZoFiPhyzAII5BdnuY9uinJOYwYaFsSeQgIazLGe3aE3pCNfj5bfaMnhdrGCqL9jmF4Bm4IFw/4%20faces.png?psid=1)

-> _~~~~~~~~~~ 2015-12-06 补充：开始 ~~~~~~~~~~*_ <-

以下参考 [Running PCA and SVD in R](http://genomicsclass.github.io/book/pages/pca_svd.html)。

<pre class="prettyprint linenums">
x <- t(e)
pc &lt;- prcomp(x)
names(pc)
## [1] "sdev"     "rotation" "center"   "scale"    "x"

## `pc$x[, 1]` is PC1;
## `pc$x[, 2]` is PC2;
## 依此类推

## pc$x[, 1] == udv$u[, 1];
## pc$x[, 2] == udv$u[, 2];
## 依此类推

## `pc$rotation` is the rotation matrix
## pc$rotation == udv$v

## `pc$sdev` 是 sample standard deviations
	## 更准确地说，`pc$sdev` 是 unbiased estimates of standard deviations，所以带了一个 (n-1) 的 correction
## pc$sdev^2 == sv$d^2/(ncol(e) - 1)
</pre>

-> _~~~~~~~~~~ 2015-12-06 补充：结束 ~~~~~~~~~~*_ <-
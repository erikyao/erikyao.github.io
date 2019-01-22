---
layout: post
title: "PCA: my interpretation"
description: ""
category: Math
tags: [Math-Algebra, PCA]
---
{% include JB/setup %}

$$
\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}

\newcommand{\irow}[1]{
  \begin{smallmatrix}(#1)\end{smallmatrix}
}
$$

合着按着我自己的思路才是最好理解的。PCA 的整个过程其实就是：**寻找一个基变换 (change of basis)，使得新坐标系内的 axes 的功效可以量化**。这个量化的意思是，如果新坐标系内有 x'-axis 和 y'-axis，我可以明确地写出 $\frac{\operatorname{effect}(\text{x'-axis})}{\operatorname{effect}(\text{y'-axis})} = \gamma$ 这么一个比值。那么这个量化是怎么做的呢？用的是原数据集沿该 axis 所保留的 corvariance matrix。

## 第一步：Centering

假设我有 $m$ 个点，每个都是 $n$ 维，所以 $X_{m \times n} = \begin{bmatrix} – (x^{(1)})^T – \newline – (x^{(2)})^T – \newline \dots \newline – (x^{(m)})^T – \end{bmatrix}$

给 $X$ 做一个 column-wise centering：

1. $\mu_j =  \frac{1}{m} \sum_{i=1}^m { x_j^{(i)} }$ (mean of each column)
2. $x_j^{(i)} = x_j^{(i)} - \mu_j$ (column 整体减去 mean of column)

做完 column-wise centering 之后，才能有 corvariance matrix $\Sigma(X) = \frac{1}{m} X X^{T}$ (因为 column 的 mean 等于 0，所以每个 column 的期望 $E[\cdot]$ 小项就不用考虑了)

## 第二步：假设一个 change of basis (实际并不需要执行这个 change of basis)

当前的 $n$ 个 bases 是 $\hat i = \begin{bmatrix} 1 \newline 0 \newline \vdots \newline 0 \end{bmatrix}, \hat j = \begin{bmatrix} 0 \newline 1 \newline \vdots \newline 0 \end{bmatrix}, \cdots, \hat z = \begin{bmatrix} 0 \newline 0 \newline \vdots \newline 1 \end{bmatrix}$ (必然都是 $n$ 维)。假设有 $B_{n \times n} = \begin{bmatrix} \vert & \vert & \vert & \vert \newline \hat i & \hat j & \vdots & \hat z \newline \vert & \vert & \vert & \vert \end{bmatrix}$

假设变换后的 $n$ 个 bases 是 $\hat{i'}, \hat{j'}, \dots, \hat{z'}$ 且有 $B_{n \times n}' = \begin{bmatrix} \vert & \vert & \vert & \vert \newline \hat{i'} & \hat{j'} & \vdots & \hat{z'} \newline \vert & \vert & \vert & \vert \end{bmatrix}$

题外话：如果对 $X$ 做基变换的话：假设变换后的坐标是 $X'$，那么 $X'B' = XB = X \Rightarrow X' = XB'^{-1}$

- 注意 $X$ 的 row 才是 coordinates，所以应该是 $XB$ 而不是 $BX$
- 另外有一点：基变换是 linear transformation，所以 $X'$ 的每个 column 的 mean 仍然为 0 (沿袭第一步 centering 的效果)，所以仍然有 $\Sigma(X') = \frac{1}{m} X' {X'}^{T}$

## 第三步：定量 Effect of axis

那我们现在研究：$X$ 在 $\hat{i'}$ 方向上的 corvariance 是多少？根据公式：

$$
\begin{align}
\mathrm{Cov}(X \hat{i'}, X \hat{i'}) &= \frac{1}{m} (X \hat{i'} - \mu_{X \hat{i'}})^T (X \hat{i'} - \mu_{X \hat{i'}}) \newline
                                     &= \frac{1}{m} (X \hat{i'})^T X \hat{i'} \newline
                                     &= \frac{1}{m} \hat{i'}^T X^T X \hat{i'}
\end{align}                                                               
$$

这就是我们要找的 effect of axis，令 $\operatorname{effect}(\hat{k'}) = \mathrm{Cov}(X \hat{k'}, X \hat{k'})$，所以对任意两个新的 bases $\hat{i'}$ 和 $\hat{j'}$，有：

$$
\frac{\operatorname{effect}(\hat{i'})}{\operatorname{effect}(\hat{j'})} = \frac{\hat{i'}^T X^T X \hat{i'}}{\hat{j'}^T X^T X \hat{j'}}
$$

## 第四步：通过 Eigen-decomposition 确定 change of basis

那为了让这个比值有意义，我们可能会想说：如果 $\hat{i'}$ 和 $\hat{j'}$ 是 $X^T X$ 的 eigenvectors 就好办了，那么：

$$
\begin{align}
\frac{\operatorname{effect}(\hat{i'})}{\operatorname{effect}(\hat{j'})} & = \frac{\hat{i'}^T (X^T X \hat{i'})}{\hat{j'}^T (X^T X \hat{j'}) } \newline
                                                                        & = \frac{\hat{i'}^T (\lambda_{\hat{i'}} \hat{i'})}{\hat{j'}^T (\lambda_{\hat{j'}} \hat{j'}) } \newline
                                                                        & = \frac {\lambda_{\hat{i'}}} {\lambda_{\hat{j'}}}
\end{align}   
$$

那么我们就直接这样做好了！

直接 eigen-decompose $X^T X$：

- 因为 $X^T X$ 必定 positive semi-definite，所以 eigenvalues 都是 non-negative
- 最大的 eigenvalue 对应的 eigenvector 的方向，$X$ 所保留的 corvariance 最大
- 第二大的 eigenvalue 对应的 eigenvector 的方向，$X$ 所保留的 corvariance 次之
    - 依此类推

注意很多教程写的是方法是去 SVD $\Sigma(X) = \frac{1}{m} X X^{T}$ 或是直接 SVD $X$ (因为一般情况下都是 $m > n$ 所以 $U_{m \times m}$ 应该也能包含 $n$ 个有效的 eigenvalues)，换汤不换药。
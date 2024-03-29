---
category: Machine-Learning
description: A Note from Ng
tags:
- PCA
title: 'Machine Learning: Dimensionality Reduction'
---

## 1. Motivation

Dimensionality Reduction helps in:

* Data Compression
* Visualization (because we can only plot 2D or 3D)

Principal Component Analysis (主成分分析), abbreviated as PCA, is the algorithm to implement Dimensionality Reduction。

## 2. PCA: Problem Formulation

### 2.1 Reduce from 2-dimension to 1-dimension

假设两个 features 分别是 $x_1$ 和 $x_2$，以它俩为 x-axis 和 y-axis，如果有一条直线，使所有 $n$ 个 $(x_1, x_2)$ 到它的投影点能够代替 $x_1$ 和 $x_2$，那么我们就把 2D 降成了 1D（直接把这条直线看做 x-axis，所有的投影点都在直线上，自然就不需要 y-axis）。  

那么如何判断 "投影点能够代替 $x_1$ 和 $x_2$" 呢？这个是通过计算替换前后的 variance 来确定的。如果替换后的 variance 没有太大损失，就可以认为是一个有效替换。那么问题就转化成 "寻找一个替换，使替换后的 variance 最大"。   

经过进一步推导（这里就不深入了），问题进一步转化为：Find a direction (a vector $u^{(1)} \in \mathbb{R}^2$) onto which to project the data so as to minimize the projection error.

### 2.2 Reduce from n-dimension to $k$-dimension

同理，Find $k$ vectors $u^{(1)}, u^{(2)}, ..., u^{(k)} \in \mathbb{R}^n$ onto which to project the data so as to minimize the projection error.

## 3. PCA: Algorithm

### 3.1 Data preprocessing

Given training set $x^{(1)}, \dots, x^{(m)}$, the preprocessing goes like mean normalization:

* calculate $\mu_j =  \frac{1}{m} \sum_{i=1}^m { x_j^{(i)} }$
* replace each $x_j^{(i)}$ with $x_j^{(i)} - \mu_j$

If there are different features on different scales (e.g. $x_1 = \text{size of house}$, $x_2 = \text{number of bedrooms}$), scale features to have comparable range of values.

### 3.2 PCA algorithm and implementation in Octave

Suppose we are reducing data from $n$-dimensions to $k$-dimensions

#### Step 1: Compute covariance matrix (协方差矩阵):

Non-vectorized formula is $\Sigma = \frac{1}{m} \sum_{i=1}^n {x^{(i)}*(x^{(i)})^T}$

$\because x^{(i)} = \begin{vmatrix} x^{(i)}_1 \newline x^{(i)}_2 \newline ... \newline x^{(i)}_n \end{vmatrix}$ ($\operatorname{size} = n \times 1$)

$\therefore \operatorname{size}(\Sigma) = (n \times 1) \ast (1 \times n) = n \times n$

又 $\because X = \begin{vmatrix} -- (x^{(1)})^T -- \newline -- (x^{(2)})^T -- \newline ...... \newline -- (x^{(m)})^T -- \end{vmatrix}$ ($\operatorname{size} = m \times n$)

$\therefore$ Vectorized formula is $\Sigma = \frac{1}{m} X^T X$

#### Step 2: Compute eigenvectors of covariance matrix

`[U, S, V] = svd(Σ)`, `svd` for Singular Value Decomposition (奇异值分解). `eig(Σ)` also works but less stable.  

Covariance matrix always satisfies a property called "symmetric positive semidefinite" (对称半正定矩阵), so `svd` == `eig`.  

The structure of `U` in `[U, S, V]` is:

$U = \begin{vmatrix}  \vert  &  \vert  &  &  \vert  \newline u^{(1)} & u^{(2)} & ... & u^{(n)} \newline  \vert  &  \vert  &  &  \vert  \end{vmatrix}$ ($\operatorname{size}=n \times n$)

$u^{(i)} = \begin{vmatrix} u^{(i)}_1 \newline u^{(i)}_2 \newline ... \newline u^{(i)}_n \end{vmatrix}$ ($\operatorname{size} = n \times 1$)

#### Step 3: Generate the $k$ dimensions

We want to reduce to $k$-dimensions, so pick up the first $k$ columns of U, i.e. $u^{(1)}, u^{(2)}, ..., u^{(k)}$ into $U_{reduce}$

$U_{reduce} = \begin{vmatrix}  \vert  &  \vert  &  &  \vert  \newline u^{(1)} & u^{(2)} & ... & u^{(k)} \newline  \vert  &  \vert  &  &  \vert  \end{vmatrix}$ ($\operatorname{size}=n \times k$)

In Octave, use `U_reduce = U(:, 1:k)`.  

The new dimension $z^{(i)} = (U_{reduce})^T*x^{(i)}$ ($\operatorname{size} = (k \times n) \ast (n \times 1) = k \times 1$)

Vectorized formula is $Z = X*U_{reduce}$ ($\operatorname{size} = (m \times n) \ast (n \times k) = m \times k$)

The structure of $Z$ is:

$Z = \begin{vmatrix} -- (z^{(1)})^T -- \newline -- (z^{(2)})^T -- \newline ...... \newline -- (z^{(m)})^T -- \end{vmatrix}$ ($\operatorname{size} = m \times k$)

$z^{(i)} = \begin{vmatrix} z^{(i)}_1 \newline z^{(i)}_2 \newline ... \newline z^{(i)}_k \end{vmatrix}$ ($\operatorname{size} = k \times 1$)

## 4. Reconstruction from Compressed Representation

这里说的 Reconstruction 是指 Reconstruct $X$ from $Z$，更具体说来就是通过 $Z$ 来算 $X$ 的近似值。  

算法是：$x_{approx}^{(i)} = U_{reduce} * z^{(i)}$ ($\operatorname{size} = (n \times k) \ast (k \times 1) = n \times 1$)

Vectorized formula is: $X_{approx} = Z*U_{reduce}^T$

## 5. Choosing the Number of Principal Components

I.e. how to choose $k$.  

### 5.1 Algorithm

Average squared projection error: $ASPE = \frac{1}{m} \sum_{i=1}^m { \lVert x^{(i)} - x^{(i)}_{approx} \rVert ^2 }$

Total variation in the data: $TV = \frac{1}{m} \sum_{i=1}^m { \lVert x^{(i)} \rVert^2 }$

Typically, choose $k$ to be smallest value that satisfy $\frac{ASPE}{TV} <= 0.01$, which means "99% of variance is retained"

在实现的时候还是只有是 $k = 1,2,\dots$ 一个个的试

### 5.2 Convenient calculation with SVD results

我们利用 `[U, S, V] = svd(Σ)` 的 $S$ 来方便我们的计算，$S$ 是一个 $n \times n$ 的 diagonal:

$$ 
	S = \begin{vmatrix}
	s_{11} &  &  & \newline
	 & s_{22} &  & \newline
	 &  & ... & \newline
	 &  &  & s_{nn}
	\end{vmatrix} 
$$

For a given $k$, $\frac{ASPE}{TV} = 1 - \frac{\sum_{i=1}^k {s_{ii}}} {\sum_{i=1}^n {s_{ii}}}$.（注意这里 $s_{ii}$ 是递减的，i.e. $s_{11}$ 占 variance 的比重最大，$s_{22}$ 次之，依次类推）

这样我们只用计算一次 `[U, S, V] = svd(Σ)`，然后尝试 $k = 1,2,\dots$ 使 $\frac{\sum_{i=1}^k {s_{ii}}}{\sum_{i=1}^n {s_{ii}}} >= 0.99$ 就可以了，而不是每次都用 $ASPE$ 和 $TV$ 的公式来算。

## 6. Advice for Applying PCA

### 6.1 Good use of PCA

Application of PCA:

* Compression
	* Reduce memory/disk needed to store data
	* Speed up learning algorithm
		* choose $k$ by xx% of variance retaining
* Visualization
	* choose $k=2$ or $k=3$

PCA can be used to speedup learning algorithm, most commonly the supervised learning.  

Suppose we have $(x^{(1)}, y^{(1)}), ..., (x^{(m)}, y^{(m)})$ and $n=10000$ (feature#). Extract inputs to make a unlabeled dataset $x^{(1)}, ..., x^{(m)} \in \mathbb{R}^{10000}$. If PCA applied, say we reduce to 1000 features, we would have $z^{(1)}, ..., z^{(m)} \in \mathbb{R}^{1000}$. Then we have a new training set $(z^{(1)}, y^{(1)}), ..., (z^{(m)}, y^{(m)})$, which is much cheaper computationally.  

### 6.2 Bad use of PCA

* To prevent overfitting
	* Use PCA to reduce the number of features, thus, fewer features, less likely to overfit.

This is bad use because PCA is not a good way to address overfitting. Use regularization instead.

### 6.3 Implementation tips

* Note 1: The mapping $x^{(i)} \rightarrow z^{(i)}$ should be **defined** by running PCA **only** on the training set. But this mapping can be **applied** as well to the examples $x_{cv}^{(i)}$ and $x_{test}^{(i)}$ in the cross validation and test sets.  
* Note 2: Before implemen1ng PCA, first try running whatever you want to do with the original/raw data $x^{(i)}$. Only if that does not do what you want, then implement PCA and consider using $z^{(i)}$.
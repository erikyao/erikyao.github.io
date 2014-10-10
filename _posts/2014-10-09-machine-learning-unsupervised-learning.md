---
layout: post-mathjax
title: "Machine Learning: Unsupervised Learning"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结自 Chapter 10, An Introduction to Statistical Learning.

-----

## 目录

### 0. [Overview](#Overview)

### 1. [The Challenge of Unsupervised Learning](#Challenge)

### 2. [Principal Components Analysis](#PCA)

- [2.1 What Are Principal Components?](#PC)
- [2.2 Another Interpretation of Principal Components](#PC-Cont)
- [2.3 More on PCA](#PCA-More)
	- [Scaling the Variables](#Scale-Var)
	- [Uniqueness of the Principal Components](#Uniqueness)
	- [The Proportion of Variance Explained](#Propo-Variance)
	- [Deciding How Many Principal Components to Use](#How-Many-PC)
- [2.4 Other Uses for Principal Components](#Other-PC)

### 3. [Clustering Methods](#Cluster)

- [3.1 K-Means Clustering](#K-Means)
- [3.2 Hierarchical Clustering](#HClust)
	- [Interpreting a Dendrogram](#Dendrogram)
	- [The Hierarchical Clustering Algorithm](#HClust-Algor)
	- [Choice of Dissimilarity Measure](#Dissimilarity-Measure)
- [3.3 Practical Issues in Clustering](#Practical-Clust)
	- [Small Decisions with Big Consequences](#Consequences)
	- [Validating the Clusters Obtained](#Validate-Clust)
	- [Other Considerations in Clustering](#Other-Clust)
	- [A Tempered Approach to Interpreting the Results of Clustering](#Tempered-Clust)

### 4. [Lab 1: Principal Components Analysis](#Lab-PCA)	

### 5. [Lab 2: Clustering](#Lab-Clust)

- [5.1 K-Means Clustering](#Lab-K-Means)
- [5.2 Hierarchical Clustering](#Lab-HClust)

### 6. [Lab 3: NCI60 Data Example](#Lab-NCI60)
	
- [6.1 PCA on the NCI60 Data](#Lab-PCA-NCI60)
- [6.2 Clustering the Observations of the NCI60 Data](#Lab-Clust-NCI60)

-----

## <a name="Overview"></a>0. Overview

In this chapter, we will focus on two particular types of unsupervised learning:

* principal components analysis: a tool used for data visualization or data pre-processing before supervised techniques are applied
* clustering: a broad class of methods for discovering unknown subgroups in data

## <a name="Challenge"></a>1. The Challenge of Unsupervised Learning

P374，没啥技术性的内容，只有这一句我稍微有一点在意：Unsupervised learning is often performed as part of an **exploratory data analysis**.

## <a name="PCA"></a>2. Principal Components Analysis

Principal component analysis (PCA) refers to the process by which principal components are computed, and the subsequent use of these components in understanding the data.

### <a name="PC"></a>2.1 What Are Principal Components?

The **1^st principal component** of a set of features \\( X\_1,X\_2,\cdots,X\_p \\) is the normalized linear combination of the features

$$
\begin{equation}
	Z\_1 = \phi\_{11} X\_1 + \phi\_{21} X\_2 + \cdots + \phi\_{p1} X\_p
	\tag{2.1}
\end{equation} 
$$

that has the largest variance. By _normalized_, we mean that \\( \sum\_{j=1}\^{p}{\phi\_{j1}\^2} = 1 \\). We refer to the elements \\( \phi\_{11}, \phi\_{21}, \cdots, \phi\_{p1} \\) as the **loadings** of the 1^st principal component.

我们把 \\( X \\) (assuming \\( X \\) is column-centered) 扩到 matrix 形式：

$$
\begin{aligned}
	X
	& = \begin{pmatrix} X\_1 & X\_2 & \cdots & X\_P \end{pmatrix} \\\\
	& = \begin{pmatrix} -- (x\^{(1)})\^T -- \\\\ -- (x\^{(2)})\^T -- \\\\ \cdots \\\\ -- (x\^{(n)})\^T -- \end{pmatrix} \\\\
	& = \begin{pmatrix}
			x\_{11} & x\_{12} & \cdots & x\_{1p} \\\\ 
			x\_{21} & x\_{22} & \cdots & x\_{2p} \\\\  
			\cdots & \cdots & \cdots & \cdots \\\\ 
			x\_{n1} & x\_{n2} & \cdots & x\_{np} \\\\  
		\end{pmatrix}
\end{aligned} 
$$

然后我们有 1^st loding vector \\( \phi\_1 = \begin{pmatrix} \phi\_{11} & \phi\_{21} & \cdots & \phi\_{p1} \end{pmatrix}\^T \\)，于是进一步有：

$$
\begin{aligned}
	z\_{i1} 
	& = x\_i \cdot \phi\_1 \\\\
	& = \phi\_{11} x\_{i1} + \phi\_{21} x\_{i2} + \cdots + \phi\_{p1} x\_{ip}
	\tag{2.2}
\end{aligned} 
$$

We refer to \\( z\_{i1} \\) as the **scores** of the 1^st principal component for the i^th observation.

optimization problem 的表述见 P376。

There is a nice geometric interpretation for the 1^st principal component. The loading vector \\( \phi\_1 = (\phi\_{11}, \phi\_{21}, \cdots, \phi\_{p1})\^T \\) defines a direction in feature space along which the data vary the most. If we project the \\( n \\) data points \\( x\_1, \cdots, x\_n \\) onto this direction, the projected values are the principal component scores \\( z\_{11}, \cdots, z\_{n1} \\) themselves.

The second principal component \\( Z_2 \\) is the linear combination of \\( X\_1,X\_2,\cdots,X\_p \\) that has maximal variance out of all linear combinations that are **uncorrelated** with \\( Z_1 \\).

It turns out that constraining \\( Z_2 \\) to be uncorrelated with \\( Z_1 \\) is equivalent to constraining the direction \\( \phi_2 \\) to be **orthogonal** (perpendicular) to the direction \\( \phi_1 \\).

P337 这个 `USArrests` 的例子值得仔细研究下。

* "The principal component score vectors have length \\( n = 50 \\)" 这句等于是告诉你有 50 个 observation
	* 根据描述，明显是 50 个州，每个州一行
* "and the principal component loading vectors have length \\( p = 4 \\)" 这句就是告诉你有 4 个 feature
	* 分别是：`Assault`、`Murder`、`Rape` 和 `UrbanPop`
	
biplot 的看法：

* axes on the top and right 是 loadings (loadings 的绝对值不大于 1，所以 axes 的 range 是个很好的提示)
* axes on the bottom and left 是 scores
* loading 是针对 feature 的，所以 feature 只用看 loading，不用看 score
	* 这里其实是把两个 PC 的 loading 杂糅在一起了
	* \\( \phi\_1 = (\phi\_{11}, \phi\_{21}, \phi\_{31}, \phi\_{41}) \\)
	* \\( \phi\_2 = (\phi\_{12}, \phi\_{22}, \phi\_{32}, \phi\_{42}) \\)
	* 4 个 loading vector 分别是 \\( (\phi\_{11}, \phi\_{12}) \\), \\( (\phi\_{21}, \phi\_{22}) \\), \\( (\phi\_{31}, \phi\_{32}) \\), \\( (\phi\_{41}, \phi\_{42}) \\)
	* `Assault`、`Murder`、`Rape` 的 1^st loading 都比较大，说明 1^st PC roughly corresponds to a measure of overall rates of serious crimes.
		* This also indicates that the crime-related variables are correlated with each other — states with high murder rates tend to have high assault and rape rates.
	* `UrbanPop` 的 2^nd loading 很大，说明 2^nd PC roughly corresponds to the level of urbanization of the state.
* score 是针对 observation 的，所以 observation 只用看 score，不用看 loading
	* 比如 Kentucky 的 1^st score 是 \\( Z\_{k1} \\)，2^nd score 是 \\( Z\_{k2} \\)，那么在 \\( (Z\_{k1}, Z\_{k2}) \\) 这个点上就会有一个 text 写着 "Kentucky"
	* 不要产生 "好像要对着 loading vector 做投影来计算什么值" 这样的错觉
	* 你仔细想一下，score 其实就是 PCA 之后的新 feature 的值，所以 score 的大小和 \\( X\_i \\) 的大小意义是一样的。
		* 比如 California 的 1^st score 和 2^nd score 都很大，联系 1^st PC 和 2^nd PC 的意义，说明 California has both a high crime rate and a high level of urbanization.
		* Indiana, close to 0 scores on both PCs, has approximately average levels of both crime and urbanization.
		* Vermont has both a low crime rate and a low level of urbanization.

### <a name="PC-Cont"></a>2.2 Another Interpretation of Principal Components

In the previous section, we describe the PC loading vectors as the directions in feature space along which the data vary the most (i.e. have the highest variance), and the PC scores as projections along these directions.

An alternative interpretation is: PCs provide low-dimensional linear surfaces that are closest to the observations.

The 1^st PC loading vector has a very special property: it is the line in \\( p \\)-dimensional space that is closest to the \\( n \\) observations (using average squared Euclidean distance as a measure of closeness). The appeal of this interpretation is clear: we seek a single dimension of the data that lies as close as possible to all of the data points, since such a line will likely provide a good summary of the data.

推广一下就有：The first 2 PCs of a data set span the plane that is closest to the \\( n \\) observations, in terms of average squared Euclidean distance. 进一步推广，The first 3 PCs of a data set span the three-dimensional hyperplane that is closest to the \\( n \\) observations, and so forth.

P380 提到了一个 \\( M \\)-dimensional approximation:

$$
\begin{equation}
	x\_{ij} \approx \sum\_{m=1}\^{M}{z\_{im} \phi\_{jm}}
	\tag{2.3}
	\label{eq2.3}
\end{equation} 
$$

如果有 \\( M = \min (n-1,p) \\)，那么可以肯定有

$$
\begin{equation}
	x\_{ij} = \sum\_{m=1}\^{M}{z\_{im} \phi\_{jm}}
	\tag{2.4}
\end{equation} 
$$

老实说这个我没有推导出来，建议结合 Ng 课的笔记 [Machine Learning: Dimensionality Reduction](http://erikyao.github.io/machine-learning/2014/09/06/machine-learning-dimensionality-reduction/) 再推导试试。可以肯定的是：

* loading vector 是 `[U, S, V] = svd(Σ)` 的 `U` 的 1 行
* score \\( z\_{i1} \\) 应该是 \\( z\^{(i)} \\) 的第一个元素

注意 Ng 的课是 "\\( m \\) observations, \\( n \\) features, \\( K \\) dimension PCA"，我们是 "\\( n \\) observations, \\( p \\) features, \\( M \\) dimension PCA"（好想死……）。

你把 \\( X\_{approx} \\) 的元素展开，应该能得到 \\( (\ref{eq2.3}) \\)。

### <a name="PCA-More"></a>2.3 More on PCA

#### <a name="Scale-Var"></a>Scaling the Variables

就是说不光要 feature centering，还要 scaling，主要的作用是统一 variance 的度量。

P381 对比了一下 scaled 和 unscaled 的两个结果。

P382 提到了一种可能不需要 scaling 的情况：the variables are measured in the same units.

#### <a name="Uniqueness"></a>Uniqueness of the Principal Components

a sign flip 对 loading vector 和 score vector 是没有什么影响的，符号相反的 vector 可以视为相同（唯一有影响的应该是对 PC 和 score 的 interpretation）。

#### <a name="Propo-Variance"></a>The Proportion of Variance Explained

P382-383

这个 Ng 的课上说的很清楚了，P383 有 \\( Var(PC) \\) 的计算公式，然后 \\( PVE = \frac{Var(PC)}{Var(X)} \\)。

#### <a name="How-Many-PC"></a>Deciding How Many Principal Components to Use

In general, a \\( n \times p \\) data matrix \\( X \\) has \\( \min(n − 1, p)\\) distinct PCs.

P384，讲得不错。

### <a name="Other-PC"></a>2.4 Other Uses for Principal Components

在实施其他的 method 之前，我们都可以用 PCA 来降维，有 make less noise 的功效。

## <a name="Cluster"></a>3. Clustering Methods

Clustering refers to a very broad set of techniques for finding homogeneous ([ˌhɒməˈdʒi:niəs]) **subgroups**, or **clusters**, in a data set. When we cluster the observations of a data set, we seek to partition them into distinct groups so that the observations within each group are quite similar to each other, while observations in different groups are quite different from each other. Of course, to make this concrete, we must define what it means for two or more observations to be _similar_ or _different_. Indeed, this is often a domain-specific consideration that must be made based on knowledge of the data being studied.

In this section we focus on perhaps the two best-known clustering approaches: 

* K-means clustering 
	* K 是事先预定的
* hierarchical clustering
	* we do not know in advance how many clusters we want
	* we end up with a tree-like visual representation of the observations, called a dendrogram (['dendrəgræm], 树状图)
	
有两种 cluster 的方向：

* cluster observations on the basis of the features in order to identify subgroups among the observations
* cluster features on the basis of the observations in order to discover subgroups among the features

我们讨论的是第一种。The converse can be performed by simply transposing the data matrix.

### <a name="K-Means"></a>3.1 K-Means Clustering

P386-390，Ng 的课上已经说得很清楚了，这里简单说下：

* 优化目标是 \\( \min \sum{(\text{within-cluster variation})} \\)
* 算法是 "不断 update centroid"
* 因为可能收敛到 local optimum，所以要随机初始化 centroid 跑多次
* \\( K \\) 值的选择也需要跑多次试验决定

### <a name="HClust"></a>3.2 Hierarchical Clustering

In this section, we describe bottom-up or agglomerative ([ə'glɒmərətɪv], tending to agglomerate, 聚集) clustering. This is the most common type of hierarchical clustering, and refers to the fact that a dendrogram (generally depicted as an upside-down tree) is built starting from the leaves and combining clusters up to the trunk.

#### <a name="Dendrogram"></a>Interpreting a Dendrogram

* Each **leaf** of the dendrogram represents one observations.
* As we move up the tree, some leaves begin to **fuse** into branches.
	* the earlier fusions is lower in the tree
	* the later fusion is nearer to the top of the tree
* For any two observations, we can look for the point in the tree where branches containing those two observations are first fused. The height of this fusion, as measured on the vertical axis, indicates how different the two observations are. 
	* Thus, observations that fuse at the very bottom of the tree are quite similar to each other
	* whereas observations that fuse close to the top of the tree will tend to be quite different.
	* We cannot draw conclusions about the similarity of two observations based on their proximity along the horizontal axis. 
	
P393 说得是：横着一刀下去，上半部分剩下几个 branch 就相当于是几个大 cluster，你在不同的高度切，得到的结果也不同。Therefore it highlights a very attractive aspect of hierarchical clustering: one single dendrogram can be used to obtain any number of clusters. 

However, often the choice of where to cut the dendrogram is not so clear.

#### <a name="HClust-Algor"></a>The Hierarchical Clustering Algorithm

* 先定一个指标：**dissimilarity** measure between each pair of observations. 
	* Most often, Euclidean distance is used
* 把 n 个 observation 看做 n 个 cluster，找出 dissimilarity 最小的做 fuse
* 得到的 (n-1) 个 cluster 重新计算 dissimilarity，继续找最小的做 fuse
* 重复这个过程 (n-1) 次即可

那么，一个包含多个 observation 的 cluster 与另一个只包含 1 个 observation 的 cluster 间的 dissimilarity 该怎么计算呢？这时需要引入 **linkage** 的概念，which defines the dissimilarity between two groups of observations。

linkage 有 4 常用的计算方法：

* Complete: Maximal intercluster dissimilarity. Compute all pairwise dissimilarities between the observations in cluster A and the observations in cluster B, and record the largest of these dissimilarities.
* Single: Minimal intercluster dissimilarity. Compute all pairwise dissimilarities between the observations in cluster A and the observations in cluster B, and record the smallest of these dissimilarities. Single linkage can result in extended, trailing clusters in which single observations are fused one-at-a-time.
* Average: Mean intercluster dissimilarity. Compute all pairwise dissimilarities between the observations in cluster A and the observations in cluster B, and record the average of these dissimilarities.
* Centroid: Dissimilarity between the centroid for cluster A (a mean vector of length p) and the centroid for cluster B. Centroid linkage can result in undesirable inversions.

<!-- -->

* Average, complete, and single linkage are most popular among statisticians.
	* Average and complete linkage are generally preferred over single linkage, as they tend to yield more balanced dendrograms.
* Centroid linkage is often used in genomics, but suffers from a major drawback in that an inversion can occur, whereby two clusters are fused at a height below (这个 below 不需要倒着看。如果把树倒过来，root 最低，leaves 最高，那这里 inversion 的意思就是 fusion 点比 leaves 还要高) either of the individual clusters in the dendrogram.

#### <a name="Dissimilarity-Measure"></a>Choice of Dissimilarity Measure

P396-399，阐述得很详细。

还有一类 dissimilarity measures 是 correlation-based distance, which considers two observations to be similar if their features are highly correlated, even though the observed values may be far apart in terms of Euclidean distance.

另外是否要做 scaling 也是值得考虑的问题，一般都是按 application 实际情况决定。具体的例子见 P398-399。

### <a name="Practical-Clust"></a>3.3 Practical Issues in Clustering

#### <a name="Consequences"></a>Small Decisions with Big Consequences

* Should the observations or features first be standardized in some way?
	* i.e. centered to have mean zero and scaled to have standard deviation one
* In the case of hierarchical clustering,
	- What dissimilarity measure should be used?
	- What type of linkage should be used?
	- Where should we cut the dendrogramin order to obtain clusters?
* In the case of K-means clustering, how many clusters should we look for in the data?

In practice, we try several different choices, and look for the one with the most useful or interpretable solution. With these methods, there is no single right answer—any solution that exposes some interesting aspects of the data should be considered.

#### <a name="Validate-Clust"></a>Validating the Clusters Obtained

There has been no consensus on a single best approach. P400

#### <a name="Other-Clust"></a>Other Considerations in Clustering

P400

#### <a name="Tempered-Clust"></a>A Tempered Approach to Interpreting the Results of Clustering

P401

These results should not be taken as the absolute truth about a data set. Rather, they should constitute a starting point for the development of a scientific hypothesis and further study, preferably on an independent data set.

## <a name="Lab-PCA"></a>4. Lab 1: Principal Components Analysis

In this lab, we perform PCA on the `USArrests` data set, which is part of the base R package. The rows of the data set contain the 50 states, in alphabetical order.

	> states = row.names(USArrests)
	> states
	
The columns of the data set contain the four variables.

	> names(USArrests)
	[1] "Murder" "Assault" "UrbanPop" "Rape"
	
We first briefly examine the data.

	> apply(USArrests, 2, mean) ## column-wise mean
	  Murder Assault UrbanPop   Rape
		7.79  170.76    65.54  21.23
	## vastly different means
	
	> apply(USArrests, 2, var) ## column-wise variance
	  Murder Assault UrbanPop  Rape
		19.0  6945.2 	209.5  87.7
	## vastly different variances
	
We now perform PCA using the prcomp() function.

	> pr.out = prcomp(USArrests, scale=TRUE)
	
By default, the `prcomp()` function centers the variables to have mean zero. By using the option `scale=TRUE`, we scale the variables to have standard deviation one. The output from `prcomp()` contains a number of useful quantities.

	> names(pr.out)
	[1] "sdev" "rotation" "center" "scale" "x"
	
The `center` and `scale` components correspond to the means and standard deviations of the variables that were used for scaling prior to implementing PCA.

	> pr.out$center
	  Murder Assault UrbanPop   Rape
	    7.79  170.76    65.54  21.23
	> pr.out$scale
	  Murder Assault UrbanPop   Rape
		4.36   83.34    14.47   9.37
		
The `rotation` matrix provides the PC loadings; each column of `pr.out$rotation` contains the corresponding PC loading vector. When we matrix-multiply the \\( X \\) matrix by `pr.out$rotation`, it gives us the coordinates of the data in the rotated coordinate system. These coordinates are the PC scores.

	> pr.out$rotation
				PC1    PC2    PC3    PC4
	Murder   -0.536  0.418 -0.341  0.649
	Assault  -0.583  0.188 -0.268 -0.743
	UrbanPop -0.278 -0.873 -0.378  0.134
	Rape 	 -0.543 -0.167  0.818  0.089
	
We see that there are 4 distinct PCs. This is to be expected because there are in general \\( \min(n − 1, p) \\) informative PCs in a data set with \\( n \\) observations and \\( p \\) variables.

Using the `prcomp()` function, we do not need to explicitly multiply the data by the PC loading vectors in order to obtain the PC score vectors. Rather the \\( 50 \times 4 \\) matrix `x` has as its columns the PC score vectors. That is, the k^th column is the k^th PC score vector.
	
	> dim(pr.out$x)
	[1] 50 4
	
We can plot the first 2 PC as follows:

	> biplot(pr.out, scale=0)
	
The `scale=0` argument to `biplot()` ensures that the arrows are scaled to represent the loadings; other values for `scale` give slightly different biplots with different interpretations.

Notice that this figure is a mirror image of Figure 10.1. Recall that the principal components are only unique up to a sign change, so we can reproduce Figure 10.1 by making a few small changes:

	> pr.out$rotation = -pr.out$rotation
	> pr.out$x = -pr.out$x
	> biplot(pr.out, scale=0)
	
The `prcomp()` function also outputs the standard deviation of each principal component.

	> pr.out$sdev
	[1] 1.575 0.995 0.597 0.416
	
The variance explained by each principal component is obtained by squaring these:

	> pr.var = pr.out$sdev^2
	> pr.var
	[1] 2.480 0.990 0.357 0.173
	
To compute the proportion of variance explained by each PC, we simply divide the variance explained by each PC by the total variance explained by all 4 PCs:

	> pve = pr.var/sum(pr.var)
	> pve
	[1] 0.6201 0.2474 0.0891 0.0434
	
We can plot the PVE explained by each component, as well as the cumulative PVE, as follows:

	> plot(pve, xlab="Principal Component", ylab="Proportion of Variance Explained", ylim=c(0,1), type=’b’)
	> plot(cumsum(pve), xlab="Principal Component", ylab="Cumulative Proportion of Variance Explained", ylim=c(0,1), type=’b’)
	
The result is shown in Figure 10.4 (i.e. scree plot). Note that the function `cumsum()` computes the cumulative sum of the elements of a numeric vector.

## <a name="Lab-Clust"></a>5. Lab 2: Clustering

### <a name="Lab-K-Means"></a>5.1 K-Means Clustering

The function `kmeans()` performs K-means clustering in R. We begin with a simple simulated example in which there truly are two clusters in the data: the first 25 observations have a mean shift relative to the next 25 observations.

	> set.seed(2)
	> x = matrix(rnorm(50*2), ncol=2)
	> x[1:25,1] = x[1:25,1]+3
	> x[1:25,2] = x[1:25,2]-4
	
We now perform K-means clustering with \\( K = 2 \\).

	> km.out = kmeans(x, 2, nstart=20) ## 随机初始化 centroid 20 次，应该就是跑 20 次的意思（然后取最优）
	> km.out
	
The cluster assignments of the 50 observations are contained in `km.out$cluster`.

	> km.out$cluster
	[1] 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 1 1 1 1
	[30] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
	
We can plot the data, with each observation colored according to its cluster assignment.

	> plot(x, col=(km.out$cluster+1), main="K-Means Clustering Results with K=2", xlab="", ylab="", pch=20, cex=2)
	
If a value of `nstart` greater than 1 is used, then K-means clustering will be performed using multiple random assignments in Step 1 of Algorithm 10.1, and the `kmeans()` function will report only the best results. Here we compare using `nstart=1` to `nstart=20`.

	> set.seed(3)
	> km.out = kmeans(x, 3, nstart=1)
	> km.out$tot.withinss
	[1] 104.3319
	> km.out = kmeans(x, 3, nstart=20)
	> km.out$tot.withinss
	[1] 97.9793
	
Note that `km.out$tot.withinss` is the total within-cluster sum of squares, which we seek to minimize (Equation 10.11). The individual within-cluster sum-of-squares are contained in the vector `km.out$withinss`. 

We _strongly_ recommend always running K-means clustering with a large value of `nstart`, such as 20 or 50, since otherwise an undesirable local optimum may be obtained.

When performing K-means clustering, in addition to using multiple initial cluster assignments, it is also important to set a random seed using the `set.seed()` function. This way, the initial cluster assignments in Step 1 can be replicated, and the K-means output will be fully reproducible.

### <a name="Lab-HClust"></a>5.2 Hierarchical Clustering

The `hclust()` function implements hierarchical clustering in R. In the following example we use the data from Section 10.5.1 to plot the hierarchical clustering dendrogram using complete, single, and average linkage clustering, with Euclidean distance as the dissimilarity measure. 

The `dist()` function is used to compute the inter-observation Euclidean distance matrix. 

	> hc.complete = hclust(dist(x), method="complete")
	> hc.average = hclust(dist(x), method="average")
	> hc.single = hclust(dist(x), method="single")
	
We can now plot the dendrograms obtained using the usual `plot()` function. The numbers at the bottom of the plot identify each observation.

	> par(mfrow=c(1,3))
	> plot(hc.complete, main="Complete Linkage", xlab="", sub="", cex=.9)
	> plot(hc.average, main="Average Linkage", xlab="", sub="", cex=.9)
	> plot(hc.single, main="Single Linkage", xlab="", sub="", cex=.9)
	
To determine the cluster labels for each observation associated with a given cut of the dendrogram, we can use the `cutree()` function:

	> cutree(hc.complete, 2) ## 这个 2 应该是参数 k，表示 the desired number of groups。后面再接一个参数才是 h，表示 heights where the tree should be cut
	[1] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 2 2 2
	[30] 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
	> cutree(hc.average, 2)
	[1] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 2 2 2
	[30] 2 2 2 1 2 2 2 2 2 2 2 2 2 2 1 2 1 2 2 2 2
	> cutree(hc.single, 2)
	[1] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 1 1 1 1 1 1 1 1
	[30] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
	
For this data, complete and average linkage generally separate the observations into their correct groups. However, single linkage identifies one point as belonging to its own cluster. A more sensible answer is obtained when 4 clusters are selected, although there are still 2 singletons.

	> cutree(hc.single, 4)
	[1] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 1 1 1 1 3 3 3 3
	[30] 3 3 3 3 3 3 3 3 3 3 3 3 4 3 3 3 3 3 3 3 3
	
To scale the variables before performing hierarchical clustering of the observations, we use the `scale()` function:

	> xsc = scale(x)
	> plot(hclust(dist(xsc), method="complete"), main="Hierarchical Clustering with Scaled Features")
	
Correlation-based distance can be computed using the `as.dist()` function, which converts an arbitrary square (正方形的) symmetric matrix into a form that the `hclust()` function recognizes as a distance matrix. However, this only makes sense for data with at least three features since the absolute correlation between any two observations with measurements on two features is always 1. Hence, we will cluster a three-dimensional data set.

	> x = matrix(rnorm(30*3), ncol=3)
	> dd = as.dist(1-cor(t(x))) ## cor(t(x)) 是 30x30，然后 1-cor(t(x)) 是 Octave 里 '1 .- X' 的效果
	> plot(hclust(dd, method="complete"), main="Complete Linkage with Correlation-Based Distance", xlab="", sub ="")

## <a name="Lab-NCI60"></a>6. Lab 3: NCI60 Data Example

We illustrate these techniques on the `NCI60` cancer cell line microarray data, which consists of 6,830 gene expression measurements (features) on 64 cancer cell lines (observation).

	> library(ISLR)
	> nci.labs = NCI60$labs ## 'lab' means 'label'; 64x1
	> nci.data = NCI60$data
	
Each cell line is labeled with a cancer type. We do not make use of the cancer types in performing PCA and clustering, as these are unsupervised techniques. But after performing PCA and clustering, we will check to see the extent to which these cancer types agree with the results of these unsupervised techniques.

We begin by examining the cancer types for the cell lines.

	> table(nci.labs)

### <a name="Lab-PCA-NCI60"></a>6.1 PCA on the NCI60 Dat

We first perform PCA on the data after scaling the variables (genes) to have standard deviation one, although one could reasonably argue that it is better not to scale the genes.

	> pr.out = prcomp(nci.data, scale=TRUE)
	
We now plot the first few principal component score vectors, in order to visualize the data. Before that, we first create a simple function that assigns a distinct color to each element of a numeric vector. The function will be used to assign a color to each of the 64 cell lines, based on the cancer type to which it corresponds, so that the cell lines corresponding to a given cancer type will be plotted in the same color.

	> Cols = function(vec) {
	+ 	cols = rainbow(length(unique(vec)))
	+ 	return(cols[as.numeric(as.factor(vec))])
	+ }
	
Note that the `rainbow()` function takes as its argument a positive integer, and returns a vector containing that number of distinct colors. We now can plot the principal component score vectors.

	> par(mfrow=c(1,2))
	> plot(pr.out$x[,1:2], col=Cols(nci.labs), pch=19, xlab="Z1", ylab="Z2")
	> plot(pr.out$x[,c(1,3)], col=Cols(nci.labs), pch=19, xlab="Z1", ylab="Z3")
	
On the whole, cell lines corresponding to a single cancer type do tend to have similar values on the first few principal component score vectors. This indicates that cell lines from the same cancer type tend to have pretty similar gene expression levels.

We can obtain a summary of the proportion of variance explained (PVE) of the first few principal components using the `summary()` method for a `prcomp` object.

	> summary(pr.out)
	
Using the `plot()` function, we can also plot the variance explained by the first few principal components.

	> plot(pr.out)
	
Or we can plot the scree plot manually by:

	> pve = 100*pr.out$sdev^2 / sum(pr.out$sdev^2)
	> par(mfrow=c(1,2))
	> plot(pve, type="o", ylab="PVE", xlab="Principal Component", col="blue")
	> plot(cumsum(pve), type="o", ylab="Cumulative PVE", xlab="Principal Component", col="brown3")
	
Note that the elements of `pve` can also be computed directly from `summary(pr.out)$importance[2,]`, and the elements of `cumsum(pve)` are given by `summary(pr.out)$importance[3,]`.

### <a name="Lab-Clust-NCI60"></a>6.2 Clustering the Observations of the NCI60 Data

To begin, we standardize the variables to have mean zero and standard deviation one. As mentioned earlier, this step is optional and should be performed only if we want each gene to be on the same scale.

	> sd.data = scale(nci.data)
	
We now perform hierarchical clustering of the observations using complete, single, and average linkage. Euclidean distance is used as the dissimilarity measure.

	> par(mfrow=c(1,3))
	> data.dist = dist(sd.data)
	> plot(hclust(data.dist), labels=nci.labs, main="Complete Linkage", xlab="", sub="", ylab="")
	> plot(hclust(data.dist, method="average"), labels=nci.labs, main="Average Linkage", xlab="", sub="", ylab="")
	> plot(hclust(data.dist, method="single"), labels=nci.labs, main="Single Linkage", xlab="", sub="", ylab="")
	
We see that the choice of linkage certainly does affect the results obtained. Typically, single linkage will tend to yield **trailing** clusters: very large clusters onto which individual observations attach one-by-one. On the other hand, complete and average linkage tend to yield more balanced, attractive clusters.

We can cut the dendrogram at the height that will yield a particular number of clusters, say four:

	> hc.out = hclust(dist(sd.data))
	> hc.out
	
	> hc.clusters = cutree(hc.out, 4)
	> table(hc.clusters, nci.labs)
	
We can plot the cut on the dendrogram that produces these four clusters:

	> par(mfrow =c(1,1))
	> plot(hc.out, labels=nci.labs)
	> abline(h=139, col="red")
	
The argument `h=139` plots a horizontal line at height 139 on the dendrogram; this is the height that results in four distinct clusters.

We claimed earlier in Section 10.3.2 that K-means clustering and hierarchical clustering with the dendrogram cut to obtain the same number of clusters can yield very different results. How do these `NCI60` hierarchical clustering results compare to what we get if we perform K-means clustering with \\( K = 4 \\)?

	> set.seed(2)
	> km.out = kmeans(sd.data, 4, nstart=20)
	> km.clusters = km.out$cluster
	> table(km.clusters, hc.clusters)
	
Rather than performing hierarchical clustering on the entire data matrix, we can simply perform hierarchical clustering on the first few principal component score vectors, as follows:

	> hc.out = hclust(dist(pr.out$x[,1:5]))
	> plot(hc.out, labels=nci.labs, main="Hier. Clust. on First Five Score Vectors")
	> table(cutree(hc.out,4), nci.labs)
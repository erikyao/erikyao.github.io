---
layout: post-mathjax
title: "ISL: Support Vector Machines"
description: ""
category: Machine-Learning
tags: [ML-101, SVM]
---
{% include JB/setup %}

总结自 Chapter 9, An Introduction to Statistical Learning.

-----

## 目录

### 0. [Overview](#Overview)

### 1. [Maximal Margin Classifier](#MMC)

- [1.1 What Is a Hyperplane?](#Hyperplane)
- [1.2 Classification Using a Separating Hyperplane](#Class-Hyperplane)
- [1.3 The Maximal Margin Classifier](#MMClassifier)
- [1.4 Construction of the Maximal Margin Classifier](#Construction-of-MMC)
- [1.5 The Non-separable Case](#The-Non-separable-Case) 

### 2. [Support Vector Classifiers](#SVC)

- [2.1 Overview of the Support Vector Classifier](#Overview-of-SVC)
- [2.2 Details of the Support Vector Classifier](#Details-of-SVC)

### 3. [Support Vector Machines](#SVM)

- [3.1 Classification with Non-linear Decision Boundaries](#Class-Non-linear-DB)
- [3.2 The Support Vector Machine](#The-SVM)
- [3.3 An Application to the Heart Disease Data](#Eg-HDD)

### 4. [SVMs with More than Two Classes](#SVM-for-Multi)

- [4.1 One-Versus-One Classification](#One-vs-One)
- [4.2 One-Versus-All Classification](#One-vs-All)

### 5. [Relationship to Logistic Regression](#Re-to-LogR)

### 6. [Lab: Support Vector Machines](#Lab)

- [6.1 Support Vector Classifier](#Lab-SVC)
- [6.2 Support Vector Machine](#Lab-SVM)
- [6.3 ROC Curves](#Lab-ROC)
- [6.4 SVM with Multiple Classes](#Lab-SVM-Multi)
- [6.5 Application to Gene Expression Data](#Lab-GED)

-----

## <a name="Overview"></a>0. Overview

首先，SVM 是用于 classification 的；然后，SVM 是 MMC (maximal margin classifier) 的扩展。

* MMC 有一个缺点是 unfortunately cannot be applied to most data sets, since it requires that the classes be separable by a linear boundary.
* 接着我们搞出了一个 SVC (support vector classifier), an extension of the MMC that can be applied in a broader range of cases.
* SVM is a further extension of SVC in order to accommodate non-linear class boundaries.

SVM are intended for the binary classification setting in which there are two classes. 对于 multi class 的情况要用 one-vs-all。

## <a name="MMC"></a>1. Maximal Margin Classifier

### <a name="Hyperplane"></a>1.1 What Is a Hyperplane?

In a $ p $-dimensional space, a **hyperplane** is a flat affine subspace of dimension $ p − 1$.

* affine: [ə'faɪn] indicates that the subspace need not pass through the origin
* 3 维空间的平面是 2 维的。hyperplane 只是把这种 1 维的差值关系扩展到多维空间而已。

The equation

$$
\begin{equation}
	\beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_p X_p = 0
	\tag{1.1}
	\label{eq1.1}
\end{equation} 
$$

defines a $ p $-dimensional hyperplane.

If a point $ X = (X_1, X_2, \cdots, X_p)^T $ in $ p $-dimensional space (i.e. $ X $ is a vector of length $ p $) satisfies ($ \ref{eq1.1} $), then $ X $ lies on the hyperplane. 如果代入 ($ \ref{eq1.1} $) 得到的是 > 0 或者 < 0，我们视为 $ X $ 在 hyperplane 的两侧。

### <a name="Class-Hyperplane"></a>1.2 Classification Using a Separating Hyperplane

separating 是指 hyperplane 把 space 切成两半的情形。

Now suppose that we have a $ n \times p $ data matrix $ X $ that consists of $ n $ training observations in $ p $-dimensional space,

$$
\begin{equation}
	x_1 = \begin{pmatrix} x_{11} \newline \cdots \newline x_{1p} \end{pmatrix}, \cdots, x_n = \begin{pmatrix} x_{n1} \newline \cdots \newline x_{np} \end{pmatrix}
\end{equation} 
$$

and that these observations fall into two classes — that is, $ y_1, \cdots, y_n \in \lbrace -1, 1 \rbrace $.

Suppose that it is possible to construct a hyperplane that separates the training observations perfectly according to their class labels. 

* 对 $ y_i = -1 $ 的 $ x_i $，代入 ($ \ref{eq1.1} $) 得到的都是 < 0
* 对 $ y_i = 1 $ 的 $ x_i $，代入 ($ \ref{eq1.1} $) 得到的都是 > 0

Equivalently, a separating hyperplane has the property that

$$
\begin{equation}
	y_i (\beta_0 + \beta_1 x_{i1} + \beta_2 x_{i2} + \cdots + \beta_p x_{ip}) > 0
	\tag{1.2}
\end{equation} 
$$

If a separating hyperplane exists, we can use it to construct a very natural classifier: a test observation is assigned a class depending on which side of the hyperplane it is located.

假设有一个 test point $ x^{\ast} $，我们代入 ($ \ref{eq1.1} $) 得到的值为 $f(x^{\ast})$. We can also make use of the magnitude of $f(x^{\ast})$. 

* If $ f(x^{\ast}) $ is far from 0, then this means that $ x^{\ast} $ lies far from the hyperplane, and so we can be confident about our class assignment for $ x^{\ast} $. 
* On the other hand, if $ f(x^{\ast}) $ is close to zero, then $ x^{\ast} $ is located near the hyperplane, and so we are less certain about the class assignment for $ x^{\ast} $.

Not surprisingly, a classifier that is based on a separating hyperplane leads to a linear decision boundary.

### <a name="MMClassifier"></a>1.3 The Maximal Margin Classifier

In general, if our data can be perfectly separated using a hyperplane, then there will in fact exist an infinite number of such hyperplanes. This is because a given separating hyperplane can usually be shifted a tiny bit up or down, or rotated, without coming into contact with any of the observations. In order to construct a classifier based upon a separating hyperplane, we must have a reasonable way to decide which one of the infinite possible separating hyperplanes to use.

A natural choice is the **maximal margin hyperplane** (a.k.a the **optimal separating hyperplane**). That is, we can compute the (perpendicular [ˌpɜ:pənˈdɪkjələ(r)]) distance from each training observation to a given separating hyperplane; the smallest such distance is the minimal distance from the observations to the hyperplane, and is known as the **margin**. The maximal margin hyperplane is the separating hyperplane for which the margin is largest — that is, it is the hyperplane that has the farthest minimum distance to the training observations.

基于 maximal margin hyperplane 的 classifier 就被称为 maximal margin classifier。Although MMC is often successful, it can also lead to overfitting when $ p $ is large.

对一个已经确定的 maximal margin hyperplane 而言，离它最近的点，i.e. 确定 margin 的点，我们称为 **support vectors**.

* they are vectors in $ p $-dimensional space
* they “support” the maximal margin hyperplane in the sense that if these points were moved slightly then the maximal margin hyperplane would move as well.

Interestingly, the maximal margin hyperplane depends directly on the support vectors, but not on the other observations: a movement to any of the other observations would not affect the separating hyperplane, provided that the observation’s movement does not cause it to cross the boundary set by the margin.

### <a name="Construction-of-MMC"></a>1.4 Construction of the Maximal Margin Classifier

P343。不难，解释得很清楚，一看就懂。公式太多我就不搬运了。

### <a name="The-Non-separable-Case"></a>1.5 The Non-separable Case

In this case, we can extend the concept of a separating hyperplane in order to develop a hyperplane that _almost_ separates the classes, using a so-called **soft margin**. The generalization of the maximal margin classifier to the non-separable case is known as the **support vector classifier**, discussed in the next chapter.

## <a name="SVC"></a>2. Support Vector Classifiers

### <a name="Overview-of-SVC"></a>2.1 Overview of the Support Vector Classifier

MMC 有两个缺点：

* MM Hyperplane 不一定存在
* 即使 MM Hyperplane 存在，它也存在着 sensitivity to individual observations
	* 变动、增添或是移除某个点，对 Hyperplane 的位置可能造成 dramatic change
		* 进一步导致 confidence 的变动
	* Moreover, the fact that the maximal margin hyperplane is extremely sensitive to a change in a single observation suggests that it may have overfit the training data.
	
基于此，我们提出改进的指导方针：

* Greater robustness to individual observations, and
* Better classification of _most_ of the training observations.

That is, it could be worthwhile to misclassify a few training observations in order to do a better job in classifying the remaining observations. 

The **support vector classifier**, sometimes called a **soft margin classifier**, does exactly this. Rather than seeking the largest possible margin, we instead allow some observations to be on the incorrect side of the margin (这里是把 margin 也看做是一个 hyperplane，有的点离 MM Hyperplane 更近，但是没有根据它来定 margin，也就说这些点在 margin 和 MM Hyperplane 的夹层内), or even the incorrect side of the hyperplane. (The margin is _soft_ because it can be violated by some of the training observations.)

### <a name="Details-of-SVC"></a>2.2 Details of the Support Vector Classifier

P346。在 P343 的公式基础上做了扩展。

简单说一下。需满足的条件变成了：

$$
\begin{align}
	y_i (\beta_0 + \beta_1 x_{i1} + \beta_2 x_{i2} + \cdots + \beta_p x_{ip}) \geq M(1- \epsilon_i) \newline
	\epsilon_i \geq 0, \, \sum_{i=1}^{n} \epsilon_i \leq C
\end{align} 
$$

* $ M $: the width of the margin
* $ \epsilon_i $: **slack (松弛的) variables**
	* If $ \epsilon_i = 0 $ then the i^th observation is on the correct side of the margin
	* If $ \epsilon_i > 0 $ then the i^th observation is on the wrong side of the margin, and we say that the i^th observation has **violated** the margin
	* If $ \epsilon_i > 1 $ then the i^th observation is on the wrong side of the hyperplane
* $ C $ bounds the sum of the $ \epsilon_i $’s, and so it determines the number and severity of the violations to the margin (and to the hyperplane) that we will tolerate. We can think of $ C $ as a budget for the amount that the margin can be violated by the $ n $ observations. 
	* If $ C = 0 $ then there is no budget for violations to the margin, and it must be the case that$ \epsilon_1 = \cdots = \epsilon_n = 0 $, in which case it simply amounts to the maximal margin hyperplane optimization problem.
	* For $ C > 0 $ no more than $ C $ observations can be on the wrong side of the hyperplane.
	* As the budget $ C $ increases, we become more tolerant of violations to the margin, and so the margin will widen.
		* This amounts to fitting the data less hard and obtaining a classifier that is potentially more biased but may have lower variance. (Underfitting)
	* As $ C $ decreases, we become less tolerant of violations to the margin and so the margin narrows.
		* This amounts to a classifier that is highly fit to the data, which may have low bias but high variance. (Overfitting)
	* In practice, $ C $ is treated as a tuning parameter that is generally chosen via CV. 
	
对 SVC 而言，Observations that lie directly on the margin, or on the wrong side of the margin for their class, are known as **support vectors**.

* If $ C $ is large, more support vectors.
* If $ C $ is small, less support vectors.

The fact that the support vector classifier’s decision rule is based only on a potentially small subset of the training observations (the support vectors) means that it is quite robust to the behavior of observations that are far away from the hyperplane. This property is distinct from some of the other classification methods that we have seen in preceding chapters, such as linear discriminant analysis.

## <a name="SVM"></a>3. Support Vector Machines

### <a name="Class-Non-linear-DB"></a>3.1 Classification with Non-linear Decision Boundaries

与 linear regression 面对 Non-linear Decision Boundaries 时采取的措施一样，SVC 也是把 quadratic、cubic、polynomial 什么的加进来来解决这个问题。具体见 P350

It is not hard to see that there are many possible ways to enlarge the feature space, and that unless we are careful, we could end up with a huge number of features. Then computations would become unmanageable. The SVM, which we present next, allows us to enlarge the feature space used by the SVC in a way that leads to efficient computations. 

### <a name="The-SVM"></a>3.2 The Support Vector Machine

The SVM is an extension of the SVC that results from enlarging the feature space in a specific way, using **kernels**.

When the SVC is combined with a non-linear kernel such as polynomial kernel, the resulting classifier is known as a SVM.

对算法的描述从 P351 持续到 P353，但还是言之不详。我觉得应该和 Ng 的课连起来看看。简单说介绍了三种 kernel:

* linear kernel
* polynomial kernel
* radial kernel

FIGURE 9.9. 值得一看，比较形象。

使用 kernel 的好处，相对与考虑所有的 polynomial SVC 而言，自然是 computationally less expensive，具体在 P353 的最后一段。

### <a name="Eg-HDD"></a>3.3 An Application to the Heart Disease Data

P354-355

## <a name="SVM-for-Multi"></a>4. SVMs with More than Two Classes

### <a name="One-vs-One"></a>4.1 One-Versus-One Classification

假设一共有 $ K $ 个 class，每次只选出两个 class 来建 SVM，这样一共就有 $ \binom{K}{2} $ 个 SVM。这时来一个 test point，我们把这 $ \binom{K}{2} $ 个 SVM 都跑一遍，统计 classification 结果，最多的那个 class 作为最终的 prediction。

### <a name="One-vs-All"></a>4.2 One-Versus-All Classification

每次选一个 class，其余的 $ K-1 $ 个 class 当做一个 class，这样来建一个 SVM。最终会建 $ K $ 个 SVM。这时来一个 test point $ x^* $，我们会计算出 $ K $ 个 $ f(x^*) $，选最大那一个作为最终的 class。

## <a name="Re-to-LogR"></a>5. Relationship to Logistic Regression

P356-358

这一节主要介绍了 SVC 的 minimize problem 的变形，以及 “Loss + Penalty” 的一般形式。FIGURE 9.12. 会让你回忆起 Ng 的课，它的学名叫 hinge loss。最后还提到了 support vector regression。

这一节是很好的总结，建议与 Ng 的课连起来看。

## <a name="Lab"></a>6. Lab: Support Vector Machines

有两个 lib 可以用：

* `e1071`
* `LiblineaR`, which is useful for very large linear problems.

### <a name="Lab-SVC"></a>6.1 Support Vector Classifier

The `e1071` library contains implementations for a number of statistical learning methods. In particular, the `svm()` function can be used to fit a SVC when the argument `kernel="linear"` is used. This function uses a slightly different formulation from (9.14) and (9.25) for the SVC. A `cost` argument allows us to specify the cost of a violation to the margin. 

* When the `cost` argument is small, then the margins will be wide and many support vectors will be on the margin or will violate the margin. 
* When the `cost` argument is large, then the margins will be narrow and there will be few support vectors on the margin or violating the margin.

Here we demonstrate the use of this function on a two-dimensional example so that we can plot the resulting decision boundary. We begin by generating the observations, which belong to two classes.

	> set.seed(1)
	> x = matrix(rnorm(20*2), ncol=2)
	> y = c(rep(-1,10), rep(1,10))
	> x[y==1,] = x[y==1,] + 1 ## 我们自己造的数据
	
We begin by checking whether the classes are linearly separable.

	> plot(x, col=(3-y)) ## col=2 是红色，col=4 是蓝色
	
They are not. Next, we fit the support vector classifier. Note that in order for the `svm()` function to perform classification (as opposed to SVM-based regression), we must encode the response as a factor variable. We now create a data frame with the response coded as a factor.

	> dat = data.frame(x=x, y=as.factor(y))
	> library(e1071)
	> svmfit = svm(y~., data=dat, kernel="linear", cost=10, scale=FALSE) ## no feature scaling
	> plot(svmfit, dat)
	
The decision boundary between the two classes is linear (because we used the argument `kernel="linear"`), though due to the way in which the plotting function is implemented in this library the decision boundary looks somewhat jagged in the plot. 

注意这里是按颜色区分的：

* 红色点属于 purple region
* 黑色的点属于 light blue region
* 只有一个红色的点位于 light blue region，这是唯一的一个误判

O 和 X 并不是表示 classification 的对错的：

* X 表示这个点是 support vector
* O 表示这个点不是 support vector

We see here that there are 7 support vectors. We can determine their identities as follows:

	> svmfit$index
	[1] 1 2 5 7 14 16 17
	
We can obtain some basic information about the support vector classifier fit using the `summary()` command:

	> summary(svmfit)
	
It tells us, for instance, that a linear kernel was used with `cost=10`, and that there were 7 support vectors, 4 in one class and 3 in the other.

What if we instead used a smaller value of the `cost` parameter?

	> svmfit = svm(y~., data=dat, kernel="linear", cost=0.1, scale=FALSE)
	> plot(svmfit, dat)
	> svmfit$index
	[1] 1 2 3 4 5 7 9 10 12 13 14 15 16 17 18 20
	
Now that a smaller value of the cost parameter is being used, we obtain a larger number of support vectors, because the margin is now wider. Unfortunately, the `svm()` function does not explicitly output the coefficients of the linear decision boundary obtained when the support vector classifier is fit, nor does it output the width of the margin.

The `e1071` library includes a built-in function, `tune()`, to perform cross-validation. By default, `tune()` performs 10-fold cross-validation on a set of models of interest. In order to use this function, we pass in relevant information about the set of models that are under consideration. The following command indicates that we want to compare SVMs with a linear kernel, using a range of values of the cost parameter.

	> set.seed(1)
	> tune.out = tune(svm, y~., data=dat, kernel="linear", ranges=list(cost=c(0.001,0.01,0.1,1,5,10,100)))
	
	> summary(tune.out)
	
We see that `cost=0.1` results in the lowest cross-validation error rate. The `tune()` function stores the best model obtained, which can be accessed as follows:

	> bestmod = tune.out$best.model
	> summary(bestmod)
	
To make predictions, we begin by generating a test data set.

	> xtest = matrix(rnorm(20*2), ncol=2)
	> ytest = sample(c(-1,1), 20, rep=TRUE)
	> xtest[ytest==1,] = xtest[ytest==1,] + 1
	> testdat = data.frame(x=xtest, y=as.factor(ytest))
	
	> ypred = predict(bestmod, testdat)
	> table(predict=ypred, truth=testdat$y)
			 truth
	predict  -1	 1
		 -1  11  1
		  1   0  8
	## 1 misclassification on test data  
	
What if we had instead used `cost=0.01`?

	> svmfit = svm(y~., data=dat, kernel="linear", cost=.01, scale=FALSE)
	> ypred = predict(svmfit, testdat)
	> table(predict=ypred, truth=testdat$y)
			 truth
	predict  -1  1
		 -1  11  2
		  1   0  7
	## however, 2 misclassification on test data
	
Now consider a situation in which the two classes are linearly separable.

	> x[y==1,] = x[y==1,]+0.5
	> plot(x, col=(y+5)/2, pch=19) ## col=3 是绿色，col=2 是红色
	
Now the observations are just barely linearly separable. We fit the SVC and plot the resulting hyperplane, using a very large value of `cost` so that no observations are misclassified. 

	> dat = data.frame(x=x, y=as.factor(y))
	> svmfit = svm(y~., data=dat, kernel="linear", cost=1e5)
	> summary(svmfit)
	> plot(svmfit, dat)
	
No training errors were made and only three support vectors were used. However, we can see from the figure that the margin is very narrow (because the observations that are not support vectors, indicated as circles, are very close to the decision boundary). It seems likely that this model will perform poorly on test data.

### <a name="Lab-SVM"></a>6.2 Support Vector Machine

In order to fit an SVMusing a non-linear kernel, we once again use the `svm()` function. However, now we use a different value of the parameter `kernel`.

* To fit an SVM with a polynomial kernel, we use `kernel="polynomial"` and also a `degree` argument to specify a degree for the polynomial kernel (this is $ d $ in (9.22))
* To fit an SVM with a radial kernel, we use `kernel="radial"` and also a `gamma` argument to specify a value of $ \gamma $ for the radial basis kernel (9.24). 

We first generate some data with a non-linear class boundary, as follows:

	> set.seed(1)
	> x = matrix(rnorm(200*2), ncol=2)
	> x[1:100,] = x[1:100,]+2
	> x[101:150,] = x[101:150,]-2
	> y = c(rep(1,150), rep(2,50))
	> dat = data.frame(x=x, y=as.factor(y))
	
Plotting the data makes it clear that the class boundary is indeed nonlinear:

	> plot(x, col=y)
	
	> train = sample(200,100)
	> svmfit = svm(y~., data=dat[train,], kernel="radial", gamma=1, cost=1)
	> plot(svmfit, dat[train,])
	
	> summary(svmfit)
	
We can see from the figure that there are a fair number of training errors in this SVM fit. If we increase the value of `cost`, we can reduce the number of training errors. However, this comes at the price of a more irregular decision boundary that seems to be at risk of overfitting the data.

	> svmfit = svm(y~., data=dat[train,], kernel="radial", gamma=1, cost=1e5)
	> plot(svmfit, dat[train,]) ## a quite weird shape
	
We can perform cross-validation using `tune()` to select the best choice of $ \gamma $ and `cost` for an SVM with a radial kernel:

	> set.seed(1)
	> tune.out = tune(svm, y~., data=dat[train,], kernel="radial", ranges=list(cost=c(0.1,1,10,100,1000), gamma=c(0.5,1,2,3,4)))
	> summary(tune.out)
	
Therefore, the best choice of parameters involves `cost=1` and `gamma=2`. We can view the test set predictions for this model by applying the `predict()` function to the data. Notice that to do this we subset the dataframe `dat` using `-train` as an index set.

	> table(true=dat[-train,"y"], pred=predict(tune.out$best.model, newx=dat[-train,]))
	
39% of test observations are misclassified by this SVM.

### <a name="Lab-ROC"></a>6.3 ROC Curves

The `ROCR` package can be used to produce ROC curves. We first write a short function to plot an ROC curve given a vector containing a numerical score for each observation, `pred`, and a vector containing the class label for each observation, `truth`.

	> library(ROCR)
	> rocplot = function(pred, truth, ...) {
	+ 	predob = prediction(pred, truth)
	+ 	perf = performance(predob, "tpr", "fpr")
	+ 	plot(perf, ...)
	+ }

SVMs and support vector classifiers output class labels for each observation. However, it is also possible to obtain fitted values for each observation, which are the numerical scores used to obtain the class labels (也就是 $ f(x^*) $，看是 > 0 还是 < 0 的那个值). In order to obtain the fitted values for a given SVM model fit, we use `decision.values=TRUE` when fitting `svm()`. Then the `predict()` function will output the fitted values.

	> svmfit.opt = svm(y~., data=dat[train,], kernel="radial", gamma=2, cost=1, decision.values=T)
	> fitted = attributes(predict(svmfit.opt, dat[train,], decision.values =TRUE))$decision.values
	
Now we can produce the ROC plot.

	> par(mfrow=c(1,2))
	> rocplot(fitted, dat[train,"y"], main="Training Data")
	
SVM appears to be producing accurate predictions. By increasing $ \gamma $ we can produce a more flexible fit and generate further improvements in accuracy.

	> svmfit.flex = svm(y~., data=dat[train,], kernel="radial", gamma=50, cost=1, decision.values=T)
	> fitted = attributes(predict(svmfit.flex, dat[train,], decision.values =T))$decision.values
	> rocplot(fitted, dat[train,"y"], add=T, col="red")
	
However, these ROC curves are all on the training data. We are really more interested in the level of prediction accuracy on the test data. When we compute the ROC curves on the test data, the model with γ = 2 appears to provide the most accurate results.

	> fitted = attributes(predict(svmfit.opt, dat[-train,], decision.values =T))$decision.values
	> rocplot(fitted, dat[-train,"y"], main="Test Data")
	> fitted = attributes(predict(svmfit.flex, dat[-train,], decision.values =T))$decision.values
	> rocplot(fitted, dat[-train,"y"], add=T, col ="red")
	
### <a name="Lab-SVM-Multi"></a>6.4 SVM with Multiple Classes

If the response is a factor containing more than two levels, then the `svm()` function will perform multi-class classification using the one-versus-one approach.

	> set.seed(1)
	> x = rbind(x, matrix(rnorm(50*2), ncol=2))
	> y = c(y, rep(0 ,50))
	> x[y==0,2] = x[y==0,2]+2
	> dat = data.frame(x=x, y=as.factor(y))
	> par(mfrow = c(1,1))
	> plot(x, col=(y+1))
	
	> svmfit = svm(y~., data=dat, kernel="radial", cost=10, gamma=1)
	> plot(svmfit, dat)
	
The `e1071` library can also be used to perform support vector regression, if the response vector that is passed in to `svm()` is numerical rather than a factor.

### <a name="Lab-GED"></a>6.5 Application to Gene Expression Data

We now examine the `Khan` data set, which consists of a number of tissue samples corresponding to four distinct types of small round blue cell tumors. For each tissue sample, gene expression measurements are available. The data set consists of training data, `xtrain` and `ytrain`, and testing data, `xtest` and `ytest`.

	> library(ISLR)
	> names(Khan)
	[1] "xtrain" "xtest" "ytrain" "ytest"
	
In this data set, there are a very large number of features relative to the number of observations. This suggests that we should use a linear kernel.

	> dat = data.frame(x=Khan$xtrain, y=as.factor(Khan$ytrain))
	> out = svm(y~., data=dat, kernel="linear", cost=10)
	> summary(out)
	> table(out$fitted, dat$y) ## check training error
	
	> dat.te = data.frame(x=Khan$xtest, y=as.factor(Khan$ytest))
	> pred.te = predict(out, newdata=dat.te)
	> table(pred.te, dat.te$y) ## check test error
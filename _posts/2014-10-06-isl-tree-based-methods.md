---
layout: post
title: "ISL: Tree Based Methods"
description: ""
category: Machine-Learning
tags: [ML-101, Bootstrap, Bagging, Boosting]
---
{% include JB/setup %}

总结自 Chapter 8, An Introduction to Statistical Learning.

-----

## 目录

### 0. [Overview](#Overview)

### 1. [The Basics of Decision Trees](#Dec-Tree)

- [1.1 Regression Trees](#Reg-Tree)
	- [Predicting Baseball Players’ Salaries Using Regression Trees](#Predict-with-Reg-Tree)
	- [Prediction via Stratification of the Feature Space](#Stratify-Feat-Space)
	- [Tree Pruning](#Tree-Pruning)
- [1.2 Classification Trees](#Class-Tree)
	- [Out-of-Bag Error Estimation](#OOG)
	- [Variable Importance Measures](#VIM)
- [1.3 Trees Versus Linear Models](#Tree-vs-Linear)
- [1.4 Advantages and Disadvantages of Trees](#Adv-Disadv-of-Tree)

### 2. [Bagging, Random Forests, Boosting](#BBB)

- [2.1 Bagging](#Bagging)
- [2.2 Random Forests](#Random-Forests)
- [2.3 Boosting](#Boosting)

### 3. [Lab: Decision Trees](#Lab)

- [3.1 Fitting Classification Trees](#Lab-Class-Tree)
- [3.2 Fitting Regression Trees](#Lab-Reg-Tree)
- [3.3 Bagging and Random Forests](#Lab-Bagging-RF)
- [3.4 Boosting](#Lab-Boosting)

-----

## <a name="Overview"></a>0. Overview

Tree-based methods for regression and classification involves **stratifying** or **segmenting** the predictor space into a number of simple regions.

* stratify: (transitive) To separate out into distinct layers or strata.
	* stratum: ([ˈstrætəm], pl. strata [ˈstrætə]). One of several parallel horizontal layers of material arranged one on top of another. 比如岩层，皮层。
* segment: (transitive) To separate into segments

In order to make a prediction for a given observation, we typically use the mean or the mode of the training observations in the region to which it belongs. 也就是看 test point 落在哪个 region，然后用这个 region 的 training points 的 response 的 mean 或者 mode 作为 test point 的 response。

Since the set of splitting rules used to segment the predictor space can be summarized in a tree, these types of approaches are known as **decision tree** methods.

Tree-based methods are simple and useful for interpretation. However, they typically are not competitive with the best supervised learning approaches, such as those seen in Chapters 6 and 7, in terms of prediction accuracy.

Hence in this chapter we also introduce bagging, random forests, and boosting, which combines a large number of trees and can result in dramatic improvements in prediction accuracy, at the expense of some loss in interpretation.

## <a name="Dec-Tree"></a>1. The Basics of Decision Trees

Decision trees can be applied to both regression and classification problems. 所以：

* 用于 regression 的 decision trees 我们简称为 regression trees
* 用于 classification 的 decision trees 我们简称为 classification trees

### <a name="Reg-Tree"></a>1.1 Regression Trees

#### <a name="Predict-with-Reg-Tree"></a>Predicting Baseball Players’ Salaries Using Regression Trees

P304-306，主要是通过例子介绍了些概念。

注意 FIGURE 8.2.，其实 tree 和 partition 两种表示法是相通的。partition 的结果就是分成了多个 region，放到 tree 里就叫 **terminal nodes** or **leaves** 了。此外还有：

* The points along the tree where the predictor space is split are referred to as **internal nodes**.
	* internal nodes 就是分叉点，有 condition 写在上面的那种
* The segments of the trees that connect the nodes is known as **branches**.

#### <a name="Stratify-Feat-Space"></a>Prediction via Stratification of the Feature Space

We now discuss the process of building a regression tree. Roughly speaking, there are two steps.

1. We divide the predictor space — that is, the set of possible values for $ X_1, X_2, \cdots, X_p $ — into $ J $ distinct and non-overlapping regions, $ R_1, R_2, \cdots, R_J $.
2. For every observation that falls into the region $ R_j $, we make the same prediction, which is simply the mean of the response values for the training observations in $ R_j $.

We now elaborate on Step 1 above. How do we construct the regions $ R_1, R_2, \cdots, R_J $? In theory, the regions could have any shape. However, we choose to divide the predictor space into high-dimensional rectangles, or **boxes**, for simplicity and for ease of interpretation of the resulting predictive model. The goal is to find boxes $ R_1, R_2, \cdots, R_J $ that minimize the RSS, given by

$$
\begin{equation}
	\sum_{j=1}^{J}{\sum_{i \in R_j}{(y_i - \hat{y}_{R_j})^2}}
	\tag{1.1}
\end{equation} 
$$

where $ \hat{y}_{R_j} $ is the mean response for the training observations within the j^th box.

Unfortunately, it is computationally infeasible to consider every possible partition of the feature space into J boxes. For this reason, we take a _top-down_, _greedy_ approach that is known as **recursive binary splitting**.

* The approach is _top-down_ because it begins at the top of the tree (at which point all observations belong to a single region) and then successively splits the predictor space; each split is indicated via two new branches further down on the tree.
* It is *greedy* because at each step of the tree-building process, the best split is made at that particular step, rather than looking ahead and picking a split that will lead to a better tree in some future step.

P307 详述了这一过程。

#### <a name="Tree-Pruning"></a>Tree Pruning

* prune: [pru:n] (transitive) To remove excess material from a tree or shrub (灌木).

P307 的 Stratification 有 overfitting 的问题。This is because the resulting tree might be too complex. A smaller tree with fewer regions might lead to lower variance and better interpretation at the cost of a little bias.

One possible alternative is to build the tree only so long as the decrease in the RSS due to each split exceeds some (high) threshold. This strategy will result in smaller trees, but is too short-sighted since a seemingly worthless split early on in the tree might be followed by a very good split.

Therefore, a better strategy is to grow a very large tree, and then **prune** it back in order to obtain a **subtree**. 首先肯定能想到是用 CV，但是 However, estimating the cross-validation error for every possible subtree would be too cumbersome.

所以我们改用 **cost complexity pruning**, a.k.a **weakest link pruning**. 具体的算法见 P309。简单说就是 pruning 也要 min 一个 loss function + penalty term，然后这个 penalty term 是 $ \alpha \lvert T \rvert $，其中 $ \lvert T \rvert $ 是 subtree 的 size，这样就约束了 subtree 的 size。这个 $ \alpha $ 和 $ \lambda $ 一样，也是要 CV 来调的，这些基本都是固定套路了。 

### <a name="Class-Tree"></a>1.2 Classification Trees

For a classification tree, we predict that each observation belongs to the _most commonly occurring class_ of training observations in the region to which it belongs.

In the classification setting, RSS cannot be used as a criterion for making the binary splits. A natural alternative to RSS is the classification error rate, simply the fraction of the training observations in that region that do not belong to the most common class:

$$
\begin{equation}
	E = 1 - \max_k(\hat{p}_{mk})
	\tag{1.2}
\end{equation} 
$$

Here $ \hat{p}_{mk} $ represents the proportion of training observations in the m^th region that are from the $k^{th}$ class. 换言之，$ \arg \max_k(\hat{p}_{mk}) $ 就是 $m^{th}$ region 的 most commonly occurring class.

However, it turns out that classification error rate is not sufficiently sensitive for tree-growing, and in practice two other measures are preferable.

One is the **Gini index**, a measure of total variance across the $ K $ classes, defined by

$$
\begin{equation}
	G = \sum_{k=1}^{K}{\hat{p}_{mk}(1 - \hat{p}_{mk})}
	\tag{1.3}
\end{equation} 
$$

It is not hard to see that the Gini index takes on a small value if all of the $ \hat{p}_{mk} $’s are close to 0 or 1. For this reason the Gini index is referred to as a measure of node **purity** — a small value indicates that a node contains predominantly observations from a single class.

An alternative to the Gini index is **cross-entropy**, given by

$$
\begin{equation}
	D = - \sum_{k=1}^{K}{\hat{p}_{mk}(\log \hat{p}_{mk})}
	\tag{1.4}
\end{equation} 
$$

Similarly, the cross-entropy will take on a value near 0 if the $ \hat{p}_{mk} $’s are all near 0 or near 1.

Any of these three approaches might be used when pruning the tree, but the classification error rate is preferable if prediction accuracy of the final pruned tree is the goal.

### <a name="Tree-vs-Linear"></a>1.3 Trees Versus Linear Models

P314-315

FIGURE 8.7. 非常能说明问题。

### <a name="Adv-Disadv-of-Tree"></a>1.4 Advantages and Disadvantages of Trees

P315

## <a name="BBB"></a>2. Bagging, Random Forests, Boosting

Bagging, random forests, and boosting use trees as building blocks to construct more powerful prediction models.

这里总结一下：

* [bootstrap](/machine-learning/2014/09/27/isl-resampling-methods#Bootstrap): 是一种 sampling method，而且具体是在 training data set 上的 sampling
* bagging: == bootstrap aggregation，是一种体系，等于 bootstrap sampling + ML alg
	* E.g. 如果 ML alg 是 decision trees 的话，就成了 bootstrap aggregated trees or bagged trees
	* Random Forests 是 bagged trees 的升级版
* boosting: 是一种 ensemble 的算法思想，同时实现了这种思想的算法也叫 boosting

### <a name="Bagging"></a>2.1 Bagging

Decision trees suffer from high variance. This means that if we split the training data into two parts at random, and fit a decision tree to both halves (这种做法其实就是 bootstrap 的思想), the results that we get could be quite different. In contrast, a procedure with low variance will yield similar results if applied repeatedly to distinct data sets.

**Bootstrap aggregation**, or **bagging**, is a general-purpose procedure for reducing the variance of a statistical learning method. It is particularly useful and frequently used in the context of decision trees.

A natural way to reduce the variance and hence increase the prediction accuracy of a statistical learning method is to take many training sets from the population, build a separate prediction model using each training set, and average the resulting predictions.

所谓的 **bootstrap aggregation**, or **bagging** 就是如此，简单说就是跑一个 bootstrap sampling，然后 average the responses to get the final response。

在 bagging trees 的时候，These trees are grown deep, and are not pruned.

如果是 classification 问题，那么可以 For a given test observation, we can record the class predicted by each of the B trees, and take a **majority vote**: the overall prediction is the most commonly occurring class among the $B$ predictions.

The number of trees $ B $ is not a critical parameter with bagging; using a very large value of $ B $ will not lead to overfitting. In practice we use a value of $ B $ sufficiently large that the error has settled down. Using $ B=100 $ is sufficient to achieve good performance in this example.

#### <a name="OOG"></a>Out-of-Bag Error Estimation

One can show that on average, each bagged tree makes use of around 2/3 of the observations (see Exercise 2 of Chapter 5). The remaining 1/3 of the observations not used to fit a given bagged tree are referred to as the out-of-bag (OOB) observations.

所以这剩下的 OOB observations 就可以拿来测 test error.

It can be shown that with $ B $ sufficiently large, OOB error is virtually equivalent to leave-one-out cross-validation error.

#### <a name="VIM"></a>Variable Importance Measures

As we have discussed, bagging typically results in improved accuracy over prediction using a single tree. Unfortunately, however, it can be difficult to interpret the resulting model. Recall that one of the advantages of decision trees is the attractive and easily interpreted diagram that results. However, when we bag a large number of trees, it is no longer possible to represent the resulting statistical learning procedure using a single tree, and it is no longer clear which variables are most important to the procedure. Thus, bagging improves prediction accuracy at the expense of interpretability.

Although the collection of bagged trees is much more difficult to interpret than a single tree, one can obtain an overall summary of the importance of each predictor using the RSS (for bagging regression trees) or the Gini index (for bagging classification trees). In the case of bagging regression trees, we can record the total amount that the RSS is decreased due to splits over a given predictor, averaged over all $B$ trees. A large value indicates an important predictor. Similarly, in the context of bagging classification trees, we can add up the total amount that the Gini index is decreased by splits over a given predictor, averaged over all $B$ trees.

### <a name="Random-Forests"></a>2.2 Random Forests

RF 是 bagging 的升级版。RF 的区别在于：在确定 split, i.e. internal nodes 的时候，我们不是像  bagging 那样全盘考察所有 $ p $ 个 predictors (i.e. features)，而是只考察一个 **random sample of $ m $ 个 predictors**。random 就 random 在这里。

如果 $ m = p $，那就成了 bagging；RF 一般取 $ m \approx \sqrt{p} $.

这么做的理由是：Suppose that there is one very strong predictor in the data set, along with a number of other moderately strong predictors. Then in the collection of bagged trees, most or all of the trees will use this strong predictor in the top split. Consequently, all of the bagged trees will look quite similar to each other. Hence the predictions from the bagged trees will be highly correlated. Unfortunately, averaging many highly correlated quantities does not lead to as large of a reduction in variance as averaging many uncorrelated quantities. In particular, this means that bagging will not lead to a substantial reduction in variance over a single tree in this setting.
 
我们也称 RF 的这个做法为 **decorrelating** the trees, thereby making the average of the resulting trees less variable and hence more reliable.

As with bagging, random forests will not overfit if we increase $ B $, so in practice we use a value of $ B $ sufficiently large for the error rate to have settled down.

### <a name="Boosting"></a>2.3 Boosting

boost: [bu:st]

* A push from behind or a push upward
* To push up
* To increase, raise
	* <<plans to boost production>> 
	* <<an extra holiday to boost morale>> 
* To promote
	* <<a campaign to boost the new fashions>>

算法简单说就是：

1. 先正常建一棵树（有一个限制是：splits 数 $ d $ 固定）
	* $ d $ 也被称为 depth
2. 把 residual 当做 response 再建一棵树（仍然是 $ d $ 个 split）
3. 将两棵树叠加
4. 重复 2 和 3 直至达成某条件

具体的算法和考量见 P321-324

===== 2016.08.16 补充 start =====

以下来自 [wikipedia: Boosting (machine learning)](https://en.wikipedia.org/wiki/Boosting_(machine_learning))

> Boosting is a machine learning ensemble meta-algorithm for primarily reducing bias, and also variance in supervised learning, and a family of machine learning algorithms which convert weak learners to strong ones... A weak learner is defined to be a classifier which is only slightly correlated with the true classification (it can label examples better than random guessing). In contrast, a strong learner is a classifier that is arbitrarily well-correlated with the true classification.  
> <!-- -->  
> When first introduced, the hypothesis boosting problem simply referred to the process of turning a weak learner into a strong learner. "Informally, [the hypothesis boosting] problem asks whether an efficient learning algorithm that outputs a hypothesis whose performance is only slightly better than random guessing [i.e. a weak learner] implies the existence of an efficient algorithm that outputs a hypothesis of arbitrary accuracy [i.e. a strong learner]." Algorithms that achieve hypothesis boosting quickly became simply known as "boosting".  
> <!-- -->  
> While boosting is not algorithmically constrained, most boosting algorithms consist of iteratively learning weak classifiers with respect to a distribution and adding them to a final strong classifier. When they are added, they are typically weighted in some way that is usually related to the weak learners' accuracy. After a weak learner is added, the data are re-weighted: examples that are misclassified gain weight and examples that are classified correctly lose weight (some boosting algorithms actually decrease the weight of repeatedly misclassified examples, e.g., `boost by majority` and `BrownBoost`). Thus, future weak learners focus more on the examples that previous weak learners misclassified.

插播一则 [wikipedia: Adaptive algorithm](https://en.wikipedia.org/wiki/Adaptive_algorithm):

> An adaptive algorithm is an algorithm that changes its behavior based on information available at the time it is run. This might be information about computational resources available, or the history of data recently received.  
> <!-- -->  
> For example, stable partition, using no additional memory is $O(n \log n)$ but given $O(n)$ memory, it can be $O(n)$ in time. As implemented by the C++ Standard Library, `stable_partition` is adaptive and so it acquires as much memory as it can get (up to what it would need at most) and applies the algorithm using that available memory. Another example is adaptive sort, whose behaviour changes upon the presortedness of its input.  
> <!-- -->  
> In machine learning and optimization, many algorithms are adaptive or have adaptive variants, which usually means that the algorithm parameters are automatically adjusted according to statistics about the optimization thus far (e.g. the rate of convergence). Examples include adaptive simulated annealing, adaptive coordinate descent, AdaBoost, and adaptive quadrature.  
> <!-- -->  
> In data compression, adaptive coding algorithms such as "adaptive Huffman coding" or "prediction by partial" matching can take a stream of data as input, and adapt their compression technique based on the symbols that they have already encountered.  
> <!-- -->  
> In signal processing, the Adaptive Transform Acoustic Coding (ATRAC) codec used in MiniDisc recorders is called "adaptive" because the window length (the size of an audio "chunk") can change according to the nature of the sound being compressed, to try and achieve the best-sounding compression strategy.

There are many boosting algorithms. The original ones, proposed by Robert Schapire (a recursive majority gate formulation) and Yoav Freund (boost by majority), were not adaptive and could not take full advantage of the weak learners. However, Schapire and Freund then developed AdaBoost, an adaptive boosting algorithm that won the prestigious Gödel Prize.

Only algorithms that are provable boosting algorithms in the probably approximately correct learning formulation can accurately be called boosting algorithms. Other algorithms that are similar in spirit to boosting algorithms are sometimes called "leveraging algorithms", although they are also sometimes incorrectly called boosting algorithms.

The main variation between many boosting algorithms is their method of weighting training data points and hypotheses. AdaBoost is very popular and perhaps the most significant historically as it was the first algorithm that could adapt to the weak learners. However, there are many more recent algorithms such as LPBoost, TotalBoost, BrownBoost, xgboost, MadaBoost, LogitBoost, and others. Many boosting algorithms fit into the AnyBoost framework, which shows that boosting performs gradient descent in function space using a convex cost function.

#### Boosting for binary categorization

We use AdaBoost for face detection as an example of binary categorization. The two categories are faces versus background. The general algorithm is as follows:

1. Form a large set of simple features
1. Initialize weights for training images
1. for T rounds
	- Normalize the weights
	- For available features from the set, train a classifier using a single feature and evaluate the training error
	- Choose the classifier with the lowest error
	- Update the weights of the training images: increase if classified wrongly by this classifier, decrease if correctly
1. Form the final strong classifier as the linear combination of the T classifiers (coefficient larger if training error is small)

After boosting, a classifier constructed from 200 features could yield a 95% detection rate under a $10^{-5}$ false positive rate.

===== 2016.08.16 补充 end =====

## <a name="Lab"></a>3. Lab: Decision Trees

### <a name="Lab-Class-Tree"></a>3.1 Fitting Classification Trees

```r
> library(tree)

> library(ISLR)
> attach(Carseats)

> High = ifelse(Sales<=8, "No", "Yes")
> Carseats = data.frame(Carseats,High)

> tree.carseats = tree(High~.-Sales, Carseats)
> summary(tree.carseats)
```
	
The `summary()` function lists the variables that are used as internal nodes in the tree, the number of terminal nodes, and the (training) error rate. 

We see that the training error rate is 9 %. For classification trees, the deviance reported in the output of `summary()` is given by

$$
\begin{equation}
	\text{deviance} = -2 \sum_{m}{\sum_{k}{n_{mk}(\log \hat{p}_{mk})}}
\end{equation} 
$$

where $ n_{mk} $ is the number of observations in the m^th terminal node that belong to the k^th class. A small deviance indicates a tree that provides a good fit to the (training) data.

The **residual mean deviance** reported is simply the $ \frac{\text{deviance}}{n− \lvert T_0 \rvert} $, where $ n $ is the number of observations and $ \lvert T_0 \rvert $ is the number of terminal nodes.

```r
> plot(tree.carseats)
> text(tree.carseats, pretty=0)
## text() is used to display the node labels
## pretty=0 instructs R to include the category names for any qualitative predictors, rather than simply displaying a letter for each category

> tree.carseats
```
	
To estimate the test error, the `predict()` function can be used. In the case of a classification tree, the argument `type="class"` instructs R to return the actual class prediction.

```r
> set.seed(2)
> train = sample(1:nrow(Carseats), 200)
> Carseats.test = Carseats[-train,]
> High.test = High[-train]

> tree.carseats = tree(High~.-Sales, Carseats, subset=train)
> tree.pred = predict(tree.carseats, Carseats.test, type="class")

> table(tree.pred, High.test)
		High.test
tree.pred	No	Yes
	No	86	27
	Yes	30	57
> (86+57)/200
[1] 0.715
```
	
Next, we consider whether pruning the tree might lead to improved results. The function `cv.tree()` performs cross-validation in order to determine the optimal level of tree complexity; cost complexity pruning is used in order to select a sequence of trees for consideration. We use the argument `FUN=prune.misclass` in order to indicate that we want the classification error rate to guide the cross-validation and pruning process, rather than the default for the `cv.tree()` function, which is deviance. The `cv.tree()` function reports the number of terminal nodes of each tree considered (size) as well as the corresponding error rate and the value of the cost-complexity parameter used (k, which corresponds to $ \alpha $).

```r
> set.seed(3)
> cv.carseats = cv.tree(tree.carseats, FUN=prune.misclass)
> names(cv.carseats)
[1] "size" "dev" "k" "method"
> cv.carseats
```
	
Note that, despite the name, `dev` corresponds to the cross-validation error rate in this instance. The tree with 9 terminal nodes results in the lowest cross-validation error rate, with 50 cross-validation errors. We plot the error rate as a function of both size and k.

```r
> par(mfrow=c(1,2))
> plot(cv.carseats$size, cv.carseats$dev, type="b")
> plot(cv.carseats$k, cv.carseats$dev, type="b")
```
	
We now apply the `prune.misclass()` function in order to prune the tree to obtain the 9-node tree.

```r
> prune.carseats = prune.misclass(tree.carseats, best=9)
> plot(prune.carseats)
> text(prune.carseats, pretty=0)
```
	
How well does this pruned tree perform on the test data set? Once again, we apply the `predict()` function.

```r
> tree.pred = predict(prune.carseats, Carseats.test, type="class")
> table(tree.pred, High.test)
		High.test
tree.pred	No	Yes
	No	94	24
	Yes	22	60
> (94+60) /200
[1] 0.77 ## a litte better than 0.715
```

### <a name="Lab-Reg-Tree"></a>3.2 Fitting Regression Trees

```r
> library(MASS)
> set.seed(1)

> train = sample(1:nrow(Boston), nrow(Boston)/2)

> tree.boston = tree(medv~., Boston, subset=train)
> summary(tree.boston)
```
	
In the context of a regression tree, the deviance is simply the sum of squared errors for the tree. We now plot the tree.

```r
> plot(tree.boston)
> text(tree.boston, pretty=0)
```
	
Now we use the `cv.tree()` function to see whether pruning the tree will improve performance.

```r
> cv.boston = cv.tree(tree.boston )
> plot(cv.boston$size, cv.boston$dev, type='b')
```
	
In this case, the most complex tree is selected by cross-validation. However, if we wish to prune the tree, we could do so as follows, using the `prune.tree()` function:

```r
> prune.boston = prune.tree(tree.boston, best=5)
> plot(prune.boston)
> text(prune.boston, pretty=0)
```
	
In keeping with the cross-validation results, we use the unpruned tree to make predictions on the test set.

```r
> yhat = predict(tree.boston, newdata=Boston[-train ,])
> boston.test = Boston[-train, "medv"]
> plot(yhat, boston.test)
> abline(0,1)
> mean((yhat-boston.test)^2)
[1] 25.05
```

### <a name="Lab-Bagging-RF"></a>3.3 Bagging and Random Forests

Recall that bagging is simply a special case of a random forest with m = p. Therefore, the randomForest() function can be used to perform both random forests and bagging. We perform bagging as follows:

```r
> library(randomForest)
> set.seed(1)

> bag.boston = randomForest(medv~., data=Boston, subset=train, mtry=13, importance=TRUE) ## Boston has 14 columns
> bag.boston

> yhat.bag = predict(bag.boston, newdata=Boston[-train,])
> plot(yhat.bag, boston.test)
> abline(0,1)
> mean((yhat.bag-boston.test)^2)
[1] 13.16
```
	
We could change the number of trees grown by randomForest() using the ntree argument:

```r
> bag.boston = randomForest(medv~., data=Boston, subset=train, mtry=13, ntree=25)
> yhat.bag = predict(bag.boston, newdata=Boston[-train,])
> mean((yhat.bag-boston.test)^2)
[1] 13.31
```
	
By default, `randomForest()` uses $ p/3 $ variables when building a random forest of regression trees, and $ \sqrt{p} $ variables when building a random forest of classification trees. Here we use `mtry=6`.

```r
> set.seed(1)
> rf.boston = randomForest(medv~., data=Boston, subset=train, mtry=6, importance=TRUE)
> yhat.rf = predict(rf.boston, newdata=Boston[-train ,])
> mean((yhat.rf-boston.test)^2)
[1] 11.31
```
	
Using the `importance()` function, we can view the importance of each variable.

```r
> importance(rf.boston)
	%IncMSE IncNodePurity
crim  12.384       1051.54
zn   2.103         50.31
......
```
	
Two measures of variable importance are reported. 

* The former is based upon the mean decrease of accuracy in predictions on the OOB samples when a given variable is excluded from the model. 
* The latter is a measure of the total decrease in node impurity that results from splits over that variable, averaged over all trees (this was plotted in Figure 8.9). In the case of regression trees, the node impurity is measured by the training RSS, and for classification trees by the deviance. 

Plots of these importance measures can be produced using the `varImpPlot()` function.

```r
> varImpPlot(rf.boston)
```
	
The results indicate that across all of the trees considered in the random forest, the wealth level of the community (`lstat`) and the house size (`rm`) are by far the two most important variables.

### <a name="Lab-Boosting"></a>3.4 Boosting

Here we use the `gbm` package, and within it the `gbm()` function, to fit boosted regression trees to the `Boston` data set. We run `gbm()` with the option `distribution="gaussian"` since this is a regression problem; if it were a binary classification problem, we would use `distribution="bernoulli"`. The argument `n.trees=5000` indicates that we want 5000 trees, and the option `interaction.depth=4` limits the depth of each tree.

```r
> library(gbm)
> set.seed(1)
> boost.boston = gbm(medv~., data=Boston[train,], distribution="gaussian", n.trees=5000, interaction.depth=4)
```

The `summary()` function produces a relative influence plot and also outputs the relative influence statistics.
	
```r
> summary (boost.boston )
	var rel.inf
1	lstat 45.96
2	rm 31.22
......
```
	
We see that `lstat` and `rm` are by far the most important variables. We can also produce **partial dependence plots** for these two variables. These plots illustrate the marginal effect of the selected variables on the response after **integrating** out the other variables. In this case, as we might expect, median house prices are increasing with `rm` and decreasing with `lstat`.

```r
> par(mfrow=c(1,2))
> plot(boost.boston, i="rm")
> plot(boost.boston, i="lstat")
```
	
We now use the boosted model to predict `medv` on the test set:

```r
> yhat.boost = predict(boost.boston, newdata=Boston[-train,], n.trees=5000)
> mean((yhat.boost-boston.test)^2)
[1] 11.8
```
	
If we want to, we can perform boosting with a different value of the shrinkage parameter $ \lambda $. The default value is 0.001. Here we take $ \lambda=0.2 $.

```r
> boost.boston = gbm(medv~., data=Boston[train,], distribution="gaussian", n.trees=5000, interaction.depth=4, shrinkage=0.2, verbose=F)
> yhat.boost = predict(boost.boston, newdata=Boston[-train,], n.trees =5000)
> mean((yhat.boost-boston.test)^2)
[1] 11.5
```
---
layout: post
title: "ISL: Classification"
description: ""
category: Machine-Learning
tags: [LDA]
---
{% include JB/setup %}

总结自 Chapter 4, An Introduction to Statistical Learning.

-----

ToC:

- [1. An Overview of Classification](#1-an-overview-of-classification)
- [2. Why Not Linear Regression?](#2-why-not-linear-regression)
- [3. Logistic Regression](#3-logistic-regression)
	- [3.1 The Logistic Model](#31-the-logistic-model)
	- [3.2 Estimating the Regression Coefficients](#32-estimating-the-regression-coefficients)
	- [3.3 Making Predictions](#33-making-predictions)
	- [3.4 Multiple Logistic Regression](#34-multiple-logistic-regression)
	- [3.5 Logistic Regression for >2 Response Classes](#35-logistic-regression-for-2-response-classes)
- [4. Linear Discriminant Analysis](#4-linear-discriminant-analysis)
	- [4.1 Using Bayes’ Theorem for Classification](#41-using-bayes-theorem-for-classification)
	- [4.2 Linear Discriminant Analysis for $p = 1$](#42-linear-discriminant-analysis-for-p--1)
	- [4.3 Linear Discriminant Analysis for $p > 1$](#43-linear-discriminant-analysis-for-p--1)
	- [4.4 Quadratic Discriminant Analysis](#44-quadratic-discriminant-analysis)
- [5. A Comparison of Classification Methods](#5-a-comparison-of-classification-methods)
- [6. Lab: Logistic Regression, LDA, QDA, and KNN](#6-lab-logistic-regression-lda-qda-and-knn)
	- [6.2 Logistic Regression](#62-logistic-regression)
	- [6.3 Linear Discriminant Analysis](#63-linear-discriminant-analysis)
	- [6.4 Quadratic Discriminant Analysis](#64-quadratic-discriminant-analysis)
	- [6.5 K-Nearest Neighbors](#65-k-nearest-neighbors)
	- [6.6 An Application to Caravan Insurance Data](#66-an-application-to-caravan-insurance-data)

-----

The process of predicting qualitative responses is known as **classification**. Predicting a qualitative response for an observation can also be referred to as **classifying** that observation. Classification techniques are also known as **classifiers**.

In this chapter we discuss three of the most widely-used classifiers:

* logistic regression
* linear discriminant analysis
* K-nearest neighbors

## 1. An Overview of Classification

P128

## 2. Why Not Linear Regression?

P129

The codings of response would produce fundamentally different linear models that would ultimately lead to different sets of predictions on test observations. And the difference of responses does not make any sense.

Curiously, it turns out that the classifications that we get if we use linear regression to predict a binary response will be the same as for the linear discriminant analysis (LDA) procedure.

## 3. Logistic Regression

Rather than modeling this response $ Y $ directly, logistic regression models the probability that $ Y $ belongs to a particular category.

### 3.1 The Logistic Model

注意下写法：$ Pr(Y=yes \vert X=x_i) $ 被简写成 $ p(x_i) $。比如对 $ x_1 = 233 $ 有 $ p(233) > 0.5 $，那么我们就把 $ x_1 = 233 $ 归为 $ y = yes $.

一般我们把 $ p(x_i) $ 写成 $ X $ 的函数，是 $ p(X) = f(X) $ 这样的形式，这个时候再带回 $ Pr(Y=yes \vert X=x_i) $ 就有点不好解释了，你自己明白就好。书上还有一种写法是 $ p(X) = Pr(Y=yes \vert X) $。

If we use a linear regression model to represent these probabilities as

$$
\begin{equation}
	p(X) = \beta_0 + \beta_1 X
	\tag{3.1}
\end{equation}
$$

the main problem we would have is that the probablity may fall out of range [0,1].

To avoid this problem, we must model $ p(X) $ using a function that gives outputs between 0 and 1 for all values of $ X $. Many functions meet this description. In logistic regression, we use the **logistic function**,

$$
\begin{equation}
	p(X) = \frac{e^{\beta_0 + \beta_1 X}}{1+e^{\beta_0 + \beta_1 X}}
	\tag{3.2}
	\label{eq3.2}
\end{equation}
$$

To fit the model $ (\ref{eq3.2}) $, we use a method called **maximum likelihood**, which we will discuss later.

After a bit of manipulation of $ (\ref{eq3.2}) $, we find that

$$
\begin{equation}
	\frac{p(X)}{1-p(X)} = e^{\beta_0 + \beta_1 X}
	\tag{3.3}
	\label{eq3.3}
\end{equation}
$$

The quantity $ p(X)/[1−p(X)] $ is called the **odds**, and can take on any value between 0 and $ \infty $.

* $ odds \to 0 $ means extremely low probablity
* $ odds \to \infty $ means extremely high probablity

By taking the logarithm of both sides of $ (\ref{eq3.3}) $, we arrive at

$$
\begin{equation}
	log \left ( \frac{p(X)}{1-p(X)} \right ) = \beta_0 + \beta_1 X
	\tag{3.4}
	\label{eq3.4}
\end{equation}
$$

The left-hand side is called the **log-odds** or **logit**. We see that the logistic regression model $ (\ref{eq3.2}) $ has a logit that is linear in X.

Therefore increasing $ X $ by one unit changes the log odds by $ \beta_1 $, or equivalently it multiplies the odds by $ e^{\beta_1} $.

* If $ \beta_1 $ is positive then increasing $ X $ will be associated with increasing $ p(X) $.
* If $ \beta_1 $ is negative then increasing $ X $ will be associated with decreasing
$ p(X) $.

### 3.2 Estimating the Regression Coefficients

Although we could use (non-linear) least squares to fit the model $ (\ref{eq3.4}) $, the more general method of **maximum likelihood** is preferred, since it has better statistical properties.

The basic intuition behind using maximum likelihood to fit a logistic regression model is as follows: we seek estimates for $ \beta_0 $ and $ \beta_1 $ such that the predicted probability $ \hat{p}(x_i) $, using $ (\ref{eq3.2}) $, corresponds as closely as possible to the $ y_i $. In other words, we try to find $ \hat{\beta}_0 $ and $ \hat{\beta}_1 $ such that plugging these estimates into the model for $ p(X) $, given in $ (\ref{eq3.2}) $, yields a number close to 1 for all $ x_i $ whose $ y_i = yes $, and a number close to 0 for all $ x_j $ whose $ y_j = no $.

This intuition can be formalized using a mathematical equation called a **likelihood function**:

$$
\begin{equation}
	\ell(\beta_0, \beta_1) = \prod_{i:y_i=1}{p(x_i)} \prod_{i':y_{i'}=0}{(1-p(x_{i'}))}
	\tag{3.5}
\end{equation}
$$

The estimates $ \hat{\beta}_0 $ and $ \hat{\beta}_1 $ are chosen to maximize this likelihood function.

Maximum likelihood is a very general approach that is used to fit many of the non-linear models. In the linear regression setting, the least squares approach is in fact a special case of maximum likelihood.

We use z-statistics to perform the hypothesis tests on the coefficients. Take $ \beta_1 $ as an example:

$$
\begin{equation}
	z = \frac{\hat{\beta}_1 - 0}{SE(\hat{\beta}_1)}
\end{equation}
$$

Then a large absolute value of the z-statistic and a vitual value 0 of p-value indicate evidence to reject the null hypothesis $ H_0 : \beta_1 = 0 $.

### 3.3 Making Predictions

P134

### 3.4 Multiple Logistic Regression

By analogy with the extension from simple to multiple linear regression, we can generalize $ (\ref{eq3.4}) $ as follows:

$$
\begin{equation}
	log \left ( \frac{p(X)}{1-p(X)} \right ) = \beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p
	\tag{3.6}
	\label{eq3.6}
\end{equation}
$$

Equation $ (\ref{eq3.6}) $ can be rewritten as

$$
\begin{equation}
	p(X) = \frac{e^{\beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p}}{1+e^{\beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p}}
	\tag{3.7}
	\label{eq3.7}
\end{equation}
$$

Still we use the maximum likelihood method to estimate $ \beta_0, \beta_1, \cdots, \beta_p  $.

As in the linear regression setting, the results obtained using one predictor may be quite different from those obtained using multiple predictors, especially when there is correlation among the predictors. In general, the phenomenon is known as **confounding**. 具体见 P136，例子和阐述都不错。

### 3.5 Logistic Regression for >2 Response Classes

The two-class logistic regression models discussed in the previous sections have multiple-class extensions, but in practice they tend not to be used all that often. One of the reasons is that the method we discuss in the next section, discriminant analysis, is popular for multiple-class classification. So we just stop here. Simply note that such an approach is possible and is available in R.

## 4. Linear Discriminant Analysis

Logistic Regression 是直接求的 $ Pr(Y=k \vert X=x) $ (model the conditional distribution of the response $ Y $, given the predictor(s) $ X $)，LDA 是先求 $ Pr(X=x \vert Y=k) $ 再用 Bayes' theorem 导成 $ Pr(Y=k \vert X=x) $。比 Logistic Regression 的优点是 stability.

### 4.1 Using Bayes’ Theorem for Classification

Suppose that we wish to classify an observation into one of $ K $ classes, where $ K \geq 2 $.

Let $ \pi_k $ represent the overall or **prior** probability that a randomly chosen observation comes from the $k^{\text{th}}$ class, i.e. $ \pi_k = Pr(Y=k) $.

Let $ f_k(X) \equiv Pr(X = x \vert Y = k) $ denote the **density function** of $ X $ for an observation that comes from the $k^{\text{th}}$ class. In other words, $ f_k(X) $ is relatively large if there is a high probability that an observation in the $k^{\text{th}}$ class has $ X \approx x $, and $ f_k(X) $ is small if it is very unlikely that an observation in the $k^{\text{th}}$ class has $ X \approx x $.

Then Bayes' theorem states that

$$
\begin{equation}
	Pr(Y=k \vert X=x) = \frac{\pi_k f_k(X)}{\sum_{l=1}^{K}{\pi_l f_l(X)}}
	\tag{4.1}
\end{equation}
$$

In accordance with our earlier notation, we will use the abbreviation $ p_k(X) = Pr(Y = k \vert X) $. We refer to $ p_k(X) $ as the **posterior** probability that an observation $ X = x $ belongs to the $k^{\text{th}}$ class. That is, it is the probability that the observation belongs to the $k^{\text{th}}$ class, given the predictor value for that observation.

In general, estimating $ \pi_k $ is easy if we have a random sample of $Y $s from the population: we simply compute the fraction of the training observations that belong to the $k^{\text{th}}$ class. However, estimating $ f_k(X) $ tends to be more challenging, unless we assume some simple forms for these densities. If we can find a way to estimate $ f_k(X) $, then we can develop a classifier that approximates the Bayes classifier. Such an approach is the topic of the following sections.

### 4.2 Linear Discriminant Analysis for $p = 1$

P139-142。这公式搬过来我手就要断了……

简单说就是为了 estimate $ f_k(X) $ 做了两点 assumption：

1. Assume that $ f_k(x) $ is normal or Gaussian
2. Let $ \sigma_k^2 $ be the variance parameter for the $k^{\text{th}}$ class. Then assume $ \sigma_1^2 = \cdots = \sigma_K^2 $

然后不停地套公式，用 estimate 代替 parameter……

### 4.3 Linear Discriminant Analysis for $p > 1$

We now extend the LDA classifier to the case of multiple predictors. To do this, we will assume that $ X = (X_1, X_2, \cdots, X_p) $ is drawn from a multivariate Gaussian (or multivariate normal) distribution, with a class-specific mean vector and a common covariance matrix.

The multivariate Gaussian distribution assumes that each individual predictor follows a one-dimensional normal distribution, with some correlation between each pair of predictors.

P142 起先是介绍了下啥是 multivariate Gaussian distribution，然后又是不停地套公式，用 estimate 代替 parameter……

P145 起又是 True Positive、Sensitivity 那一套，就不赘述了。

P145 结尾解释了 why may LDA have a low sensitivity sometimes：

> LDA is trying to approximate the Bayes classifier, which has the lowest total error rate out of all classifiers (if the Gaussian model is correct). That is, the Bayes classifier will yield the smallest possible total number of misclassified observations, irrespective of which class the errors come from. That is, some misclassifications will result from incorrectly assigning a customer who does not default to the default class, and others will result from incorrectly assigning a customer who defaults to the non-default class.

换句话说就是，LDA 只能尽量让 $ P(+ \vert D^c) + P(- \vert D) $ 最小，也就是让 $ P(- \vert D^c) + P(+ \vert D) $ 最大。而 $ P(- \vert D^c) + P(+ \vert D) $ 实际就是 $ Specificity + Sensitivity $。所以 low sensitivity 是完全可能的。

如果我们 lower threshold，比如从 $p \geq 0.5$ 降到 $p \geq 0.2$ 就归类。这样的后果是：

* $ + $ 的数量上升
* $ - $ 的数量下降
* $ P(+ \vert D) = Sensitivity $ 上升
* $ P(- \vert D^c) = Specificity $ 下降

所以这是一个 trade-off。How can we decide which threshold value is best? Such a decision must be based on _domain knowledge_.

The **ROC curve** is a popular graphic for simultaneously displaying the TP and FP rate for all possible thresholds. The name "ROC" is historic, and comes from communications theory. It is an acronym for _receiver operating characteristics_.

* FP (false positive) rate, i.e. 1 - Specificity, is x-axis of ROC
* TP (true positive) rate, i.e. Sensitivity, is y-axis of ROC
* 忘记概念的话请自觉查看 [Conditional Probability](/math/2014/09/08/conditional-probability)

The overall performance of a classifier, summarized over all possible thresholds, is given by the _area under the (ROC) curve_ (**AUC**).

### 4.4 Quadratic Discriminant Analysis

LDA assumes that the observations within each class are drawn from a multivariate Gaussian distribution with a class-specific mean vector and a covariance matrix that is common to all $ K $ classes.

Like LDA, the QDA classifier results from assuming that the observations from each class are drawn from a Gaussian distribution, and plugging estimates for the parameters into Bayes’ theorem in order to perform prediction.

However, unlike LDA, QDA assumes that each class has its own covariance matrix.

P149 小幅数学内容。

Roughly speaking, LDA tends to be a better bet than QDA if there are relatively few training observations and so reducing variance is crucial. In contrast, QDA is recommended if the training set is very large, so that the variance of the classifier is not a major concern, or if the assumption of a common covariance matrix for the $ K $ classes is clearly untenable.

## 5. A Comparison of Classification Methods

logistic regression vs LDA

* Both produce linear decision boundaries.
* The only difference between the two approaches lies in the fact that
	* logistic regression performs estimation using maximum likelihood
	* whereas LDA uses the estimated mean and variance from a normal distribution
* Since logistic regression and LDA differ only in their fitting procedures, one might expect the two approaches to give similar results. The performance fluctuates basically due to whether these Gaussian assumptions are met or not.

KNN:

* a completely non-parametric approach
* no assumptions are made about the shape of the decision boundary.
* We can expect this approach to dominate LDA and logistic regression when the decision boundary is highly non-linear.
* On the other hand, KNN does not tell us which predictors are important; we don't get a table of coefficients out of KNN.

QDA:

* QDA serves as a compromise between the non-parametric KNN method and the linear LDA and logistic regression approaches.
* Since QDA assumes a quadratic decision boundary, it can accurately model a wider range of problems than can the linear methods.
* Though not as flexible as KNN, QDA can perform better in the presence of a limited number of training observations because it does make some assumptions about the form of the decision boundary.

P153-154 设计了 6 个 Scenario 来测试这些方法的 performance。

* When the true decision boundaries are linear, then the LDA and logistic regression approaches will tend to perform well.
* When the boundaries are moderately non-linear, QDA may give better results.
* Finally, for much more complicated decision boundaries, a non-parametric approach such as KNN can be superior.
	* But the level of smoothness for a non-parametric approach must be chosen carefully.

最后还提到了加 transformation 越是可行的，但是 performance 需要重新测。If we added all possible quadratic terms and cross-products to LDA, the form of the model would be the same as the QDA model, although the parameter estimates would be different. This device allows us to move somewhere between an LDA and a QDA model.

## 6. Lab: Logistic Regression, LDA, QDA, and KNN

### 6.2 Logistic Regression

```r
> library(ISLR)
> names(Smarket)
[1] "Year" "Lag1" "Lag2" "Lag3" "Lag4"
[6] "Lag5" "Volume " "Today" " Direction "
> dim(Smarket)
[1] 1250 9
> summary(Smarket)
> cor(Smarket [,-9]) ## matrix of pairwise correlations, except the qualitative one
```

Next, we will fit a logistic regression model in order to predict `Direction` using `Lag1` through `Lag5` and `Volume`. The `glm()` function fits **generalized linear models**, a class of models that includes logistic regression. The syntax of the `glm()` function is similar to that of `lm()`, except that we must pass in the argument `family=binomial` in order to tell R to run a logistic regression rather than some other type of generalized linear model.

```r
> glm.fit = glm(Direction~Lag1+Lag2+Lag3+Lag4+Lag5+Volume, data=Smarket, family=binomial)
> summary(glm.fit)

> coef(glm.fit)
> summary(glm.fit)$coef
```

The `predict()` function can be used to predict the probability that the market will go up, given values of the predictors. The t`ype="response"` option tells R to output probabilities of the form $ P(Y = 1 \vert X) $, as opposed to other information such as the logit. If no data set is supplied to the `predict()` function, then the probabilities are computed for the training data that was used to fit the logistic regression model.

```r
> glm.probs = predict(glm.fit, type="response")
> glm.probs[1:10]
1	2	3	4	5	6	7	8	9	10
0.507	0.481	0.481	0.515	0.511	0.507	0.493	0.509	0.518	0.489
```

We know that these values correspond to the probability of the market going up, rather than down, because the `contrasts()` function indicates that R has created a dummy variable with a 1 for `Up`.

```r
> contrasts(Direction)
	Up
Down  0
Up    1
```

In order to make a prediction, we must convert these predicted probabilities into class labels, `Up` or `Down`.

```r
> glm.pred = rep("Down", 1250) ## n = 1250
> glm.pred[glm.probs>.5] = "Up"
```

Given these predictions, the `table()` function can be used to produce a confusion matrix.

```r
> table(glm.pred, Smarket$Direction)
		Direction
glm.pred 	Down  Up
Down		145 141
Up		457 507

> (507+145)/1250
[1] 0.5216
> mean(glm.pred == Smarket$Direction)
[1] 0.5216
```

-> ~~~~~~~~~~ 2015.11.09 P.S. Start ~~~~~~~~~~ <-

You can also use `confusionMatrix(prediction, reference)` function in `caret` package, e.g.

```r
> library("caret")
> lvs <- c("normal", "abnormal")
> truth <- factor(rep(lvs, times = c(86, 258)), levels = rev(lvs))
> pred <- factor(c(rep(lvs, times = c(54, 32)), rep(lvs, times = c(27, 231))), levels = rev(lvs))
> xtab <- table(pred, truth)
> confusionMatrix(xtab)
Confusion Matrix and Statistics

		truth
pred		abnormal	normal
abnormal	231	32
normal		27	54

	Accuracy : 0.8285
	......
> confusionMatrix(pred, truth) # ditto
```

See [confusionMatrix {caret}](http://www.inside-r.org/node/86995) for more.

-> ~~~~~~~~~~ 2015.11.09 P.S. End ~~~~~~~~~~ <-

P159 起就是在说做 training set 的事情，只用注意一个 `glm()` 的 `subset` 参数用法就可以了：

```r
> train = (Smarket$Year<2005)
> glm.fit = glm(Direction~Lag1+Lag2+Lag3+Lag4+Lag5+Volume, data=Smarket, family=binomial, subset=train)
```

### 6.3 Linear Discriminant Analysis

We fit a LDA model using the `lda()` function, which is part of the `MASS` library. Notice that the  syntax for the `lda()` function is identical to that of `lm()`.

```r
> library(MASS)
> lda.fit=lda(Direction~Lag1+Lag2, data=Smarket, subset=train)

> lda.fit
Call:
lda(Direction ~ Lag1 + Lag2, data = Smarket, subset = train)

Prior probabilities of groups :
 Down 	  Up
0.492  0.508

Group means :
	Lag1    Lag2
Down	0.0428  0.0339
Up	-0.0395 -0.0313

Coefficients of linear discriminants:
	LD1
Lag1 -0.642
Lag2 -0.514

> plot(lda.fit)
```

The LDA output indicates that $ \hat{\pi}_1 = 0.492 $ and $ \hat{\pi}_1 = 0.508 $; in other words, 49.2% of the training observations correspond to days during which the market went down.

It also provides the group means; these are the average of each predictor within each class, and are used by LDA as estimates of $ \mu_k $.

The _coefficients of linear discriminants_ output provides the linear combination of Lag1 and Lag2 that are used to form the LDA decision rule, i.e $ (-0.642*Lag1) + (-0.514*Lag2) $.

The `plot()` function produces plots of the **linear discriminants**, obtained by computing $ (-0.642 \times Lag1) + (-0.514 \times Lag2) $ for each of the training observations.

The `predict()` function returns a list with three elements.

* `class`, contains LDA’s predictions.
* `posterior`, is a matrix whose $k^{\text{th}}$ column contains the posterior probability that the corresponding observation belongs to the $k^{\text{th}}$ class, i.e the $ p_k(X) = Pr(Y = k \vert X = x) $.
* `x`, contains the linear discriminants.

<!-- -->

```r
> train = (Smarket$Year<2005)
> Smarket.2005 = Smarket[!train,]
> Direction.2005 = Smarket$Direction[!train]

> lda.pred = predict(lda.fit, Smarket.2005)
> names(lda.pred)
[1] "class" "posterior " "x"

> lda.class = lda.pred$class
> table(lda.class, Direction.2005)
		Direction.2005
lda.pred	Down  Up
Down		35  35
Up		76 106
> mean(lda.class == Direction.2005)
[1] 0.56

> sum(lda.pred$posterior[,1] >= .5)
[1] 70
> sum(lda.pred$posterior[,1] < .5)
[1] 182
```

Notice that the posterior probability output by the model corresponds to the probability of `down`. So you'd better take a peek before performing further tasks.

```r
> lda.pred$posterior[1:20 ,1]
> lda.class[1:20]
```

### 6.4 Quadratic Discriminant Analysis

QDA is implemented in R using the `qda()` function, which is also part of the `MASS` library. The syntax is identical to that of `lda()`.

```r
> qda.fit = qda(Direction~Lag1+Lag2, data=Smarket, subset=train)
```

The `predict()` function works in exactly the same fashion as for LDA.

```r
> qda.class = predict(qda.fit, Smarket.2005)$class
> table(qda.class, Direction.2005)
		Direction.2005
qda.class	Down  Up
Down		30  20
Up		81 121
> mean(qda.class == Direction.2005)
[1] 0.599
```

### 6.5 K-Nearest Neighbors

`knn()` function is part of the `class` library. Rather than a two-step approach in which we first fit the model and then we use the model to make predictions, `knn()` forms predictions using a single command. The function requires four inputs.

* A matrix of training $ X $
* A matrix of testing $ X $
* A vector of training $ Y $
* A value for $ K $, the number of nearest neighbors to be used by the classifier.

<!-- -->

```r
> library(class)
> train.X = cbind(Smarket$Lag1, Smarket$Lag2)[train,]
> test.X = cbind(Smarket$Lag1, Smarket$Lag2)[!train,]
> train.Direction = Smarket$Direction[train]
```

We set a random seed before we apply `knn()` because if several observations are tied as nearest neighbors, then R will randomly break the tie. Therefore, a seed must be set in order to ensure reproducibility of results.

```r
> set.seed(1)
> knn.pred = knn(train.X, test.X, train.Direction, k=1)
> table(knn.pred, Direction.2005)
		Direction.2005
knn.pred	Down Up
Down		43 58
Up		68 83
> (83+43)/252
[1] 0.5
```

The results using $ K = 1 $ are not very good, since only 50% of the observations are correctly predicted. We repeat the analysis using $ K = 2,3,\cdots $ for improvements.

### 6.6 An Application to Caravan Insurance Data

P165，一个具体的例子，业务分析值得一看。技术上需要注意的一个地方是: The `scale()` function standardize the data so that all  variables are given a mean of zero and a standard deviation of one.

```r
## exclude column 86 because that is the qualitative Purchase variable
> standardized.X = scale(Caravan[,-86])
> var(Caravan[,1])
[1] 165
> var(Caravan[,2])
[1] 0.165
> var(standardized.X[,1])
[1] 1
> var(standardized.X[,2])
[1] 1
```

Now every column of `standardized.X` has a standard deviation of one and a mean of zero.

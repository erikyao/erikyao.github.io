---
category: Machine-Learning
description: ''
tags:
- Bootstrap
title: 'ISL: Resampling Methods'
toc: true
toc_sticky: true
---

总结自 Chapter 5, An Introduction to Statistical Learning.

-----

## 0. Overview

Resampling methods involve:

* repeatedly drawing samples from a training set
* refitting a model of interest on each sample in order to obtain additional information about the fitted model

In this chapter, we discuss two of the most commonly
used resampling methods:

* cross-validation, which can be used for
	* **model assessment**, the process of evaluating a model’s performance
	* **model selection**, the process of selecting the proper level of flexibility for a model
* bootstrap, which is used most commonly to provide a measure of accuracy of a parameter estimate or of a given statistical learning method.

## 1. Cross-Validation

注意我们的目的是 estimate the test error rate，因为真实的 test error rate 是不可测量的。

### 1.1 The Validation Set Approach

The validation set approach involves randomly dividing the available set of observations into two parts, a **training set** and a **validation set** (a.k.a. hold-out set). 

* The model is fit on the training set.
* The fitted model is used to predict the responses for the observations in the validation set.
	* The resulting validation set error rate — typically assessed using MSE in the case of a quantitative response — provides an estimate of the test error rate.
	
The validation set approach is conceptually simple and is easy to implement. But it has two potential drawbacks:

* The validation estimate of the test error rate can be highly variable, depending on precisely which observations are included in the training set and which observations are included in the validation set.
* Only a subset of the observations — those that are included in the training set — are used to fit the model. Since statistical methods tend to perform worse when trained on fewer observations, this suggests that the validation set error rate may tend to **overestimate** the test error rate for the model fit on the entire data set.

Cross-validation is a refinement of the validation set approach that addresses these two issues.

简单来说：

- Validation Set Approach: 只有一次分割 Training / Validation 的操作
	- 所以也只有一个 estimate on validation set
- Cross Validation: 有多次分割 Training / Validation 的操作
	- 所以可以在多个 validation set 上 estimate 再求平均
- validation set == hold-out set

### 1.2 Leave-One-Out Cross-Validation

P178

简单说就是每次只留一个 $(x_i, y_i)$ 作为 validation set，其余的 $n-1$ 个作为 training set。比如第一次留 $(x_1, y_1)$，得到 $model_1$，计算得 $MSE_1$。如此 repeat $n$ 次。

The LOOCV estimate for the test MSE is the average of these $n$ test error estimates:

$$
\begin{equation}
	CV_{(n)} = \frac{1}{n} \sum_{i=1}^{n}{MSE_i} = \frac{1}{n} \sum_{i=1}^{n}{(y_i - \hat{y}_i)^2}
	\tag{1.1}
\end{equation} 
$$

LOOCV's advantages over the validation set approach:

* far less bias because of larger size of training set
	* Consequently, the LOOCV approach tends not to overestimate the test error rate as much as the validation set approach does
* when applied repeatedly 
	* due to randomness in the training/validation set splits, validation set approach may yields quite different results.
	* LOOCV's always yields the same results.
	
LOOCV can be very time consuming if $n$ is large, and if
each individual model is slow to fit. With least squares linear or polynomial regression, there is an amazing shortcut to compute $CV_{(n)}$ with only one model fit, as

$$
\begin{equation}
	CV_{(n)} = \frac{1}{n} \sum_{i=1}^{n}{\left ( \frac{y_i - \hat{y}_i}{1 - h_i} \right )^2 }
	\tag{1.2}
	\label{eq1.2}
\end{equation} 
$$

where $h_i$ is the [leverage-statistic](http://erikyao.github.io/machine-learning/2014/09/21/machine-learning-linear-regression-part-2#High-Leverage-Points). The leverage lies between $\frac{1}{n}$ and 1, and reflects the amount that an observation influences its own fit. Hence the residuals for high-leverage points are inflated (inflate = enlarge) in this formula.

### 1.3 k-Fold Cross-Validation

This approach involves randomly dividing the set of observations into $k$ groups, or folds, of approximately equal size. On the $i^{th}$ loop, keep the $i^{th}$ fold as a validation set, and the model is fit on the remaining $k-1$ folds. Repeat this procedure $k$ times.

The $k$-fold CV estimate is computed by averaging these values, 

$$
\begin{equation}
	CV_{(k)} = \frac{1}{k} \sum_{i=1}^{k}{MSE_i} = \frac{1}{k} \sum_{i=1}^{k}{(y_i - \hat{y}_i)^2}
	\tag{1.3}
\end{equation} 
$$

It is not hard to see that LOOCV is a special case of $k$-fold CV in which $k$ is set to equal $n$. In practice, one typically performs $k$-fold CV using $k = 5$ or $k = 10$.

The most obvious advantage over LOOCV is computational.

### 1.4 Bias-Variance Trade-Off for k-Fold Cross-Validation

On bias:

* LOOCV 的 training set 的比例最大，所以 LOOCV will give approximately unbiased estimates of the test error
* k-fold ($k < n$)的 bias 略高
* Validation Set Approach 自然是 bias 最高

On variance: It turns out that LOOCV has higher variance than does k-fold CV with $k < n$. Why? 

* When we perform LOOCV, we are in effect averaging the outputs of $n$ fitted models, each of which is trained on an almost identical set of observations; therefore, these outputs are highly (positively) correlated with each other. 
* In contrast, when we perform k-fold CV with $k < n$, we are averaging the outputs of $k$ fitted models that are somewhat less correlated with each other, since the overlap between the training sets in each model is smaller. 
*  Since the mean of many highly correlated quantities has higher variance, the test error estimate resulting from LOOCV tends to have higher variance than the one from $k$-fold CV.

$k = 5$ or $k = 10$ been shown empirically to yield test error rate estimates that suffer neither from excessively high bias nor from very high variance.

### 1.5 Cross-Validation on Classification Problems

Cross-validation works the same way on classification problems, except that rather than using MSE, we instead use the number of misclassified observations, i.e. error rate to quantify test error.

$$
\begin{equation}
	CV_{(n)} = \frac{1}{n} \sum_{i=1}^{n}{Err_i}
	\tag{1.4}
\end{equation} 
$$

P185-186 是一个借助 CV 来选择 Order of Polynomials 的例子，其实挺简单的，用 $k = 5$ or $k = 10$ 来 estimate 不同 order 的 Polynomial model 的 test error rate，选最小的 test error rate estimate 对应的 order 即可。

## 2. The Bootstrap

先解释下 bootstrap 这个词是啥意思吧，用了这么久的 jekyll bootstrap 也没认真查过……

首先 strap 是 a narrow and usually flat piece of a material that is used for fastening, holding together, or wrapping something。

然后 [bootstrap 的意思](https://en.wiktionary.org/wiki/strap) 有:

1. A strap sewn at the side or top rear of a boot to help in pulling the boot on.
	![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Dr_Martens%2C_black%2C_old.jpg/220px-Dr_Martens%2C_black%2C_old.jpg "The bootstrap can be seen at the top of the boot that is standing upright.")
2. A means of advancing oneself or accomplishing something without aid, as in "He used his business experience as a bootstrap to win voters".
3. (computing) The process by which the operating system of a computer is loaded into its memory
4. (computing) The process necessary to compile the tools that will be used to compile the rest of the system or program.
5. (statistics) Any method or instance of estimating properties of an estimator (such as its variance) by measuring those properties when sampling from an approximating distribution.

Clear now? Ok, let's get started!

P187

The bootstrap is a statistical tool to quantify the uncertainty associated with a given estimator or statistical learning method.

在实验时，我们常用的一种手段是：

1. 自己制定一个或者多个 parameter，比如 $\mu=0$
2. 按 parameter 来 generate samples
3. 在这些 sample 上做 estimate，看是否接近 parameter

但是 for real data we cannot generate new samples from the original population，这时就可以用 bootstrap 了。

The bootstrap approach allows us to emulate the process of obtaining new sample sets, so that we can estimate without generating additional samples.

P189 阐述了 bootstrap 的做法，其实挺简单：

1. 假设原 data set 有 $n$ 个 observation
2. Randomly select $n$ observations from the data set to produce a bootstrap data set. This sampling is performed **with replacement**, which means that the same observation can occur more than once in the bootstrap data set.
3. 假设生成了 $B$ 个 bootstrap data set，我们就在这 $B$ 个 bootstrap data set 上做 estimate

~~~~~ 2016.08.16 补充 start ~~~~~

其实我觉得 [wikipedia: Bootstrap aggregating](https://en.wikipedia.org/wiki/Bootstrap_aggregating) 的解释更清楚一点：

> Given a standard **training set** $D$ of size $n$, bagging generates $m$ new training sets $D_1,D_2,\dots,D_m$, each of size $n'$, by sampling from D uniformly and **with replacement**. By sampling with replacement, some observations may be repeated in each $D_i$. If $n'=n$, then for large $n$, the set $D_i$ is expected to have the fraction $1 - \frac{1}{e} \approx 63.2\%$ of the unique examples of $D$, the rest being duplicates. This kind of sample is known as a **bootstrap sample**. The $m$ models are fitted using the above $m$ bootstrap samples and combined by averaging the output (for regression) or voting (for classification).

~~~~~ 2016.08.16 补充 end ~~~~~

## 3. Lab: Cross-Validation and the Bootstrap

### 3.1 The Validation Set Approach

```r
> library(ISLR)
> set.seed(1)
> train = sample(392,196) ## 从 [1,392] 中选择 196 个整数

> lm.fit = lm(mpg~horsepower, data=Auto, subset=train)
> mean((Auto$mpg - predict(lm.fit, Auto))[-train]^2) ## MSE
```
	
### 3.2 Leave-One-Out Cross-Validation

The LOOCV estimate can be automatically computed for any generalized linear model using the `glm()` and `cv.glm()` functions together.

In previous lab, we used the `glm()` function to perform logistic regression by passing in the `family="binomial"` argument. If we don't pass this `family` argument, then it performs linear regression, just like the lm() function. Then the result can be passed to `cv.glm()` to perform the LOOCV estimate.

The `cv.glm()` function is part of the `boot` library.

```r
> library(boot)
> glm.fit = glm(mpg~horsepower, data=Auto)
> cv.err = cv.glm(Auto, glm.fit)
> cv.err$delta
1 1
24.23 24.23
```
	
这里注意下 `delta`。`cv.glm` 本身是为 $k$-fold 设计的，如果不传一个 $k$ 值的话，默认就是 LOOCV。`cv.glm` 其实计算了两个 MSE，都放在 `delta` 里传回来了：

* The first component is the raw cross-validation estimate of prediction error. 
* The second component is the adjusted cross-validation estimate. The adjustment is designed to compensate for the bias introduced by not using leave-one-out cross-validation. 

所以这个 adjusted cross-validation estimate 是仅当用 $k$-fold 时才有点意义，在用 LOOCV 时，这两个值是基本 identical 的。而且目前我们也只用第一个值就够了。

### 3.3 k-Fold Cross-Validation

```r
> set.seed(17)
> cv.error.10 = rep(0,10)
> for (i in 1:10) {
+ 	glm.fit=glm(mpg~poly(horsepower,i), data=Auto)
+ 	cv.error.10[i]=cv.glm(Auto, glm.fit, K=10)$delta [1]
+ }
> cv.error.10
[1] 24.21 19.19 19.31 19.34 18.88 19.02 18.90 19.71 18.95 19.50
```
	
In principle, the computation time for LOOCV for a least squares linear model should be faster than for $k$-fold CV, due to the availability of the formula $(\ref{eq1.2})$ for LOOCV; however, unfortunately the `cv.glm()` function does not make use of this formula.

### 3.4 The Bootstrap

#### 3.4.1 Estimating the Accuracy of a Statistic of Interest

Performing a bootstrap analysis in R entails only two steps.

* First, we must create a function that computes the statistic of interest.
* Second, we use the `boot()` function, which is part of the `boot` library, to perform the bootstrap.

We use the `Portfolio` data set in the `ISLR` package here.

we first create a function, `alpha.fn()`, which takes as input the $(X, Y)$ data as well as a vector indicating which observations should be used to estimate $\alpha$. The function then return the estimate for $\alpha$ based on the selected observations.

```r
> alpha.fn = function(data, index){
+ 	X=data$X[index]
+ 	Y=data$Y[index]
+ 	return ((var(Y)-cov(X,Y)) / (var(X)+var(Y)-2*cov(X,Y)))
+ }
```
	
在用 `boot()` 之前，我们可以自己先手动模拟一下：

```r
> set.seed(1)
> alpha.fn(Portfolio, sample(100,100,replace=T)) ## nrow(Portfolio) = 100
[1] 0.596
```
	
We can implement a bootstrap analysis by performing this command many times, recording all of the corresponding estimates for $\alpha$, and computing the resulting standard deviation. However, the `boot()` function automates this approach.

```r
> boot(Portfolio, alpha.fn, R=1000) # R = 1000 is the number of bootstrap replicates, i.e. the B number mentioned in Section 2

ORDINARY NONPARAMETRIC BOOTSTRAP

Call:
boot(data = Portfolio, statistic = alpha.fn, R = 1000)

Bootstrap Statistics :
original     bias  std . error
t1*   0.5758  -7.315e   -05 0.0886
```
	
#### 3.4.2 Estimating the Accuracy of a Linear Regression Model

P195 没啥新内容

P196 论述了 CV 没有依赖某些假设，所以得到 estimate 比那些依赖假设的公式其实要来的准。

注意下 `xxx.fn` 这个函数可以 return 多个值，比如 `return (coef(lm(mpg~horsepower, data=data, subset=index)))` 这样。我们知道 `coef()` 是 return 了 slope 和 intercept 两个值，这样 `boot()` 的结果里 Bootstrap Statistics 就有 `t1*`、`t2*` 两行，依此类推。
---
layout: post
title: "ISL: Linear Model Selection and Regularization - Part 2"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结自 Chapter 6, An Introduction to Statistical Learning.

-----

## 目录

### 3. [Dimension Reduction Methods](#DR)

- [3.1 Principal Components Regression](#PCR)
- [3.2 Partial Least Squares](#PLS)

### 4. [Considerations in High Dimensions](#HD-Considerations)

- [4.1 High-Dimensional Data](#HD-data)
- [4.2 What Goes Wrong in High Dimensions](#HD-wrong)
- [4.3 Regression in High Dimensions](#HD-regression)
- [4.4 Interpreting Results in High Dimensions](#HD-interpreting)

### 5. [Lab 1: Subset Selection Methods](#Lab1)

- [5.1 Best Subset Selection](#Lab-BSS)
- [5.2 Forward and Backward Stepwise Selection](#Lab-FBSS)
- [5.3 Choosing Among Models Using the Validation Set Approach and Cross-Validation](#Lab-CV)

### 6. [Lab 2: Ridge Regression and the Lasso](#Lab2)

- [6.1 Ridge Regression](#Lab-RR)
- [6.2 The Lasso](#Lab-Lasso)

### 7. [Lab 3: PCR and PLS Regression](#Lab3)

- [7.1 Principal Components Regression](#Lab-PCR)
- [7.2 Partial Least Squares](#Lab-PLS)

-----
	
## <a name="DR"></a>3. Dimension Reduction Methods

P229 有些铺垫用的变换，看看就好。

### <a name="PCR"></a>3.1 Principal Components Regression

P230-236
	
### <a name="PLS"></a>3.2 Partial Least Squares

PCA involves identifying linear combinations, or directions, that best represent the predictors $ X_1, \cdots, X_p$. These directions are identified in an unsupervised way, since 

* the response $ Y $ is not used to help determine the principal component directions
* or we can say the response $ Y $ does not supervise the identification of the principal components. 

PLS is a supervised alternative to partial least PCA. Roughly speaking, the PLS approach attempts to find directions that help explain both the response and the predictors.

具体的算法，老实说书上的内容我没看懂，书上貌似也不是很具体……这里我列一下参考资料，有空再研究，先把后续的 Lab 掌握了再说……

* [Partial Least Square Regression PLS-Regression ](http://www.utdallas.edu/~herve/Abdi-PLSR2007-pretty.pdf)

## <a name="HD-Considerations"></a>4. Considerations in High Dimensions

### <a name="HD-data"></a>4.1 High-Dimensional Data

Throughout most of the field's history, the bulk of scientific problems requiring the use of statistics have been low-dimensional. 

但是现在时代不同了。Data sets containing more features than observations are often referred to as high-dimensional.

### <a name="HD-wrong"></a>4.2 What Goes Wrong in High Dimensions

We examine least squares regression here, but the same concepts apply to logistic regression, linear discriminant analysis, and other classical statistical approaches.

The problem is simple: when $ p > n $ or $ p \approx n $, a simple least squares regression line is too flexible and hence overfits the data.

We saw a number of approaches for adjusting the training set RSS or $R^2$ in order to account for the number of variables used to fit a least squares model. Unfortunately, the $ C_p $, AIC, and BIC approaches are not appropriate in the high-dimensional setting, because estimating $ \hat{\sigma}^2 $ is problematic.

Clearly, alternative approaches that are better-suited to the high-dimensional setting are required.

### <a name="HD-regression"></a>4.3 Regression in High Dimensions

本章所讨论的 forward stepwise selection、ridge、lasso、PCA are particularly useful for performing regression in the high-dimensional setting.

In general, adding additional signal features that are truly associated with the response will improve the fitted model, in the sense of leading to a reduction in test set error. 

However, adding noise features that are not truly associated with the response will lead to a deterioration in the fitted model, and consequently an increased test set error. This is because noise features increase the dimensionality of the problem, exacerbating the risk of overfitting (since noise features may be assigned nonzero coefficients due to chance associations with the response on the training set) without any potential upside in terms of improved test set error.

### <a name="HD-interpreting"></a>4.4 Interpreting Results in High Dimensions

P243

## <a name="Lab1"></a>5. Lab 1: Subset Selection Methods

### <a name="Lab-BSS"></a>5.1 Best Subset Selection

```r
> library(ISLR)
> fix(Hitters)
> sum(is.na(Hitters$Salary))
[1] 59

> Hitters = na.omit(Hitters)
> dim(Hitters)
[1] 263 20
> sum(is.na(Hitters))
[1] 0
```
	
The `regsubsets()` function (part of the `leaps` library) performs best subset selection by identifying the best model that contains a given number of predictors, where "best" is quantified using RSS. The syntax is the same as for `lm()`. The `summary()` command outputs the best set of variables for each model size.

```r
> library(leaps)
> regfit.full = regsubsets(Salary~., Hitters)
> summary(regfit.full)
```
	
An asterisk indicates that a given variable is included in the corresponding model.

By default, `regsubsets()` only reports results up to the best eight-variable model. But the `nvmax` option can be used in order to return as many variables as are desired.

```r
> regfit.full = regsubsets(Salary~., data=Hitters, nvmax=19)
> reg.summary = summary(regfit.full)
```
	
The `summary()` function also returns R^2, RSS, adjusted R^2, $ C_p $, and BIC.

```r
> names(reg.summary)
[1] "which" "rsq" "rss" "adjr2" "cp" "bic"
[7] "outmat" "obj"
> reg.summary$rsq
 [1] 0.321 0.425 0.451 0.475 0.491 0.509 0.514 0.529 0.535
[10] 0.540 0.543 0.544 0.544 0.545 0.545 0.546 0.546 0.546
[19] 0.546
```
	
Plotting RSS, adjusted R^2, $ C_p $, and BIC for all of the models at once will help us decide which model to select. Note the `type="l"` option tells R to connect the plotted points with lines.

```r
> par(mfrow=c(2,2))
> plot(reg.summary$rss, xlab="Number of Variables", ylab="RSS", type="l")
> plot(reg.summary$adjr2, xlab ="Number of Variables", ylab="Adjusted RSq", type="l")
```
	
We will now plot a red dot to indicate the model with the largest adjusted R^2 statistic.

```r
> which.max(reg.summary$adjr2)
[1] 11
> points(11, reg.summary$adjr2[11], col="red", cex=2, pch=20)
```
	
And similarly for $ C_p $, and BIC, we can plot like this

```r
> plot(reg.summary$cp, xlab="Number of Variables", ylab="Cp", type=’l’)
> which.min(reg.summary$cp)
[1] 10
> points(10, reg.summary$cp[10], col="red", cex=2, pch=20)

> plot(reg.summary$bic, xlab="Number of Variables", ylab="BIC", type=’l’)
> which.min(reg.summary$bic)
[1] 6
> points (6, reg.summary$bic[6], col="red", cex=2, pch=20)
```
	
The `regsubsets()` function has a built-in `plot()` command which can be used to display the selected variables for the best model with a given number of predictors, ranked according to the BIC, $ C_p $, adjusted R^2, or AIC. To find out more about this function, type `?plot.regsubsets`.
	
```r
> plot(regfit.full, scale="r2")
> plot(regfit.full, scale="adjr2")
> plot(regfit.full, scale="Cp")
> plot(regfit.full, scale="bic")
```
	
The top row of each plot contains a black square for each variable selected according to the optimal model associated with that statistic. For instance, we see that several models share a BIC close to −150. However, the model with the lowest BIC is the 6-variable model. We can use the `coef()` function to see the coefficient estimates associated with this model.

```r
> coef(regfit.full, 6)
(Intercept)   AtBat   Hits  Walks   CRBI
91.512   -1.869  7.604  3.698  0.643
 DivisionW  PutOuts
  -122.952    0.264
```
	    
### <a name="Lab-FBSS"></a>5.2 Forward and Backward Stepwise Selection	  

```r
> regfit.fwd = regsubsets(Salary~., data=Hitters, nvmax=19, method="forward")
> summary(regfit.fwd)

> regfit.bwd = regsubsets(Salary~., data=Hitters, nvmax=19, method="backward")
> summary(regfit.bwd)
```

### <a name="Lab-CV"></a>5.3 Choosing Among Models Using the Validation Set Approach and Cross-Validation
	
```r
> set.seed(1)
> train = sample(c(TRUE,FALSE), nrow(Hitters), rep=TRUE)
> test = (!train)

> regfit.best = regsubsets(Salary~., data=Hitters[train,], nvmax=19)
```
	
We first make a **model matrix** from the test data.

```r
> test.mat = model.matrix(Salary~., data=Hitters[test,])
```
	
The `model.matrix()` function is used in many regression packages for building an “X” matrix from data.

Now we run a loop, and for each size `i`, we extract the coefficients from `regfit.best` for the best model of that size, multiply them into the appropriate columns of the test model matrix to form the predictions, and compute the test MSE.

```
> val.errors = rep(NA,19)
> for(i in 1:19){
+ 	coefi = coef(regfit.best, id=i)
+ 	pred = test.mat[,names(coefi)] %*% coefi
+ 	val.errors[i] = mean((Hitters$Salary[test] - pred)^2)
+ }
```
	
We find that the best model is the one that contains 10 variables.

```r
> which.min(val.errors)
[1] 10
> coef(regfit.best, 10)
```
	
This was a little tedious, partly because there is no `predict()` method for `regsubsets()`. We can wrap the code above into a function for further use.

Finally, we perform best subset selection on the full data set, and select the best 10-variable model. It is important that we make use of the full data set in order to obtain more accurate coefficient estimates.

```r
## 注意这里是先用 test data set 确定了 best model 是 10-variable，然后再次在 full data set 跑了一次，并直接定位到 10-variable 的 model
> regfit.best = regsubsets(Salary~., data=Hitters, nvmax=19)
> coef(regfit.best, 10)
```
	
We now try to choose among the models of different sizes using cross validation. k-fold in this case.

```r
> k=10
> set.seed(1)
> folds = sample(1:k, nrow(Hitters), replace=TRUE)
> cv.errors = matrix(NA, k, 19, dimnames=list(NULL, paste(1:19)))

> for(j in 1:k) {
+ 	best.fit = regsubsets(Salary~., data=Hitters[folds!=j,], nvmax=19)
+ 	for(i in 1:19) {
+ 		pred = predict(best.fit, Hitters[folds==j,], id=i)
+ 		cv.errors [j,i] = mean((Hitters$Salary[folds==j] - pred)^2)
+ 	}
+ }
```
	
This has given us a 10×19 matrix, of which the (i, j)^th element corresponds to the test MSE for the i^th cross-validation fold for the best j-variable model.

We use the `apply()` function to average over the columns of this matrix in order to obtain a vector for which the j^th element is the cross validation error for the j-variable model.

```r
> mean.cv.errors = apply(cv.errors, 2, mean)

> par(mfrow = c(1,1))
> plot(mean.cv.errors, type=’b’)
```
	
We see that cross-validation selects an 11-variable model. We now perform best subset selection on the full data set in order to obtain the 11-variable model.

```r
> reg.best = regsubsets(Salary~., data=Hitters, nvmax=19)
> coef(reg.best, 11)
```
	
## <a name="Lab2"></a>6. Lab 2: Ridge Regression and the Lasso

Function `glmnet()` in `glmnet` package can be used to fit ridge regression models, lasso models, and more.

The syntax is slightly different as we must pass in an `x` matrix as well as a `y` vector, and we do not use the `y ~ x` syntax. Before proceeding, ensure that the missing values have been removed from the data.

```r
> x = model.matrix(Salary~.,Hitters)[,-1]
> y = Hitters$Salary
```
	
The `model.matrix()` function is particularly useful for creating `x`; not only does it produce a matrix corresponding to the 19 predictors but it also automatically transforms any qualitative variables into dummy variables. The latter property is important because `glmnet()` can only take numerical, quantitative inputs.

### <a name="Lab-RR"></a>6.1 Ridge Regression

The `glmnet()` function has an `alpha` argument that determines what type of model is fit. If `alpha=0` then a ridge regression model is fit, and if `alpha=1` then a lasso model is fit. We first fit a ridge regression model.

```r
> library(glmnet)
> grid = 10^seq(10, -2, length=100)
> ridge.mod = glmnet(x, y, alpha=0, lambda=grid)

> dim(coef(ridge.mod))
[1] 20 100
## 20 = 19 predictor + 1 intercept
## 100 = length(lambda)
```
	
By default the `glmnet()` function performs ridge regression for an automatically selected range of $ \lambda $ values. However, here we have chosen to implement the function over a grid of values ranging from $ \lambda = 10^{10} $ to $ \lambda = 10^{-2}$, essentially covering the full range of scenarios from the null model containing only the intercept, to the least squares fit.

Note that by default, the `glmnet()` function standardizes the variables so that they are on the same scale. To turn off this default setting, use the argument `standardize=FALSE`.

We expect the coefficient estimates to be much smaller, in terms of $ \ell_2 $ norm, when a large value of $ \lambda $ is used, as compared to when a small value of $ \lambda $ is used. We compare the cases when $ \lambda = 11498 $ and $ \lambda = 705 $ below.

```r
> ridge.mod$lambda[50]
[1] 11498
> coef(ridge.mod)[,50]
> sqrt(sum(coef(ridge.mod)[-1,50]^2))
[1] 6.36

> ridge.mod$lambda[60]
[1] 705
> coef(ridge.mod)[,60]
> sqrt(sum(coef(ridge.mod)[-1 ,60]^2))
[1] 57.1
```
	
We can use the `predict()` function for a number of purposes. For instance, we can obtain the ridge regression coefficients for a new value of $ \lambda $, say 50:

```r
> predict(ridge.mod, s=50, type="coefficients")[1:20,]
```
	
We now split the samples into a training set and a test set in order to estimate the test error of ridge regression and the lasso.

```r
> set.seed(1)
> train=sample(1:nrow(x), nrow(x)/2)
> test=(-train)
```
	
Next we fit a ridge regression model on the training set, and evaluate its MSE on the test set, using $ \lambda = 4 $. Note that this time we get predictions by replacing `type="coefficients"` with the `newx` argument in `predict()`.

```r
> ridge.mod = glmnet(x[train,], y[train], alpha=0, lambda=grid, thresh=1e-12)
> ridge.pred = predict(ridge.mod, s=4, newx=x[test,])
> mean((ridge.pred - y[test])^2)
[1] 101037
```

We now check whether there is any benefit to performing ridge regression with $ \lambda = 4 $ instead of just performing least squares regression. Recall that least squares is simply ridge regression with $ \lambda = 0 $

```r
> ridge.pred = predict(ridge.mod, s=0, newx=x[test,], exact=T) ## to yield the exact least squares coefficients not the approximate ones
> mean((ridge.pred - y[test])^2)
[1] 114783

> lm(y~x, subset=train)
> predict(ridge.mod, s=0, exact=T, type="coefficients")[1:20,]
```
	
In general, if we want to fit a (unpenalized) least squares model, then we should use the `lm()` function, since that function provides more useful outputs, such as standard errors and p-values for the coefficients.
	
It would be better to use cross-validation to choose the tuning parameter $ \lambda $. We can do this using the built-in cross-validation function, `cv.glmnet()`. By default, the function performs 10-fold cross-validation, though this can be changed using the argument `nfolds`. Note that we set a random seed first so our results will be reproducible, since the choice of the cross-validation folds is random.

```r
> set.seed(1)
> cv.out = cv.glmnet(x[train,], y[train], alpha=0)
> plot(cv.out)
> bestlam = cv.out$lambda.min
> bestlam
[1] 212

> ridge.pred = predict(ridge.mod, s=bestlam, newx=x[test,])
> mean((ridge.pred - y[test])^2)
[1] 96016
```
	
Finally, we refit our ridge regression model on the full data set, using the value of $ \lambda $ chosen by cross-validation, and examine the coefficient estimates.
	
```r
> out = glmnet(x, y, alpha=0)
> predict(out, type="coefficients", s=bestlam)[1:20,]
```

### <a name="Lab-Lasso"></a>6.2 The Lasso

```r
> lasso.mod = glmnet(x[train,], y[train], alpha=1, lambda=grid)
> plot(lasso.mod)

> set.seed(1)
> cv.out = cv.glmnet(x[train,], y[train], alpha=1)
> plot(cv.out)
> bestlam = cv.out$lambda.min
> lasso.pred = predict(lasso.mod, s=bestlam, newx=x[test,])
> mean((lasso.pred - y[test])^2)
[1] 100743

> out = glmnet(x, y, alpha=1, lambda=grid)
> lasso.coef = predict(out, type="coefficients", s=bestlam)[1:20,]
> lasso.coef
```
	
Here we see that 12 of the 19 coefficient estimates are exactly zero.

## <a name="Lab3"></a>7. Lab 3: PCR and PLS Regression

### <a name="Lab-PCR"></a>7.1 Principal Components Regression

PCR can be performed using the `pcr()`  function, which is part of the `pls` library. Again, ensure that the missing values have been removed from the data.

```r
> library(pls)
> set.seed(2)
> pcr.fit = pcr(Salary~., data=Hitters, scale=TRUE, validation="CV")
```

* Setting `scale=TRUE` has the effect of standardizing each predictor, prior to generating the principal components.
* Setting `validation="CV"` causes `pcr()` to compute the 10-fold cross-validation error for each possible value of M, the number of principal components used.
	
<!-- -->

```r
> summary(pcr.fit)
```
	
Note that `pcr()` reports the RMSE (the CV score).

One can also plot the cross-validation scores using the `validationplot()` function. Using `val.type="MSEP"` will cause the cross-validation MSE to be plotted.

```r
> validationplot(pcr.fit, val.type="MSEP")
```
	
We see that the smallest cross-validation error occurs when $ M = 16 $ components are used.

We now perform PCR on the training data and evaluate its test set performance.

```r
> set.seed(1)
> pcr.fit = pcr(Salary~., data=Hitters, subset=train, scale=TRUE, validation="CV")
> validationplot(pcr.fit, val.type="MSEP")
```
	
Now we find that the lowest cross-validation error occurs when $ M = 7 $ component are used. We compute the test MSE as follows.

```r
> pcr.pred = predict(pcr.fit, x[test,], ncomp=7)
> mean((pcr.pred - y[test])^2)
[1] 96556
```
	
Finally, we fit PCR on the full data set, using $ M = 7 $, the number of components identified by cross-validation.
	
```r
> pcr.fit = pcr(y~x, scale=TRUE, ncomp=7)
> summary(pcr.fit)
```
	
### <a name="Lab-PLS"></a>7.2 Partial Least Squares

We implement PLS using the `plsr()` function, also in the `pls` library. The syntax is just like that of the `pcr()` function.

```r
> set.seed(1)
> pls.fit = plsr(Salary~., data=Hitters, subset=train, scale=TRUE, validation="CV")
> summary(pls.fit)

> validationplot(pls.fit, val.type="MSEP") 

## lowest cross-validation error occurs when M = 2

> pls.pred = predict(pls.fit, x[test,], ncomp=2)
> mean((pls.pred - y[test])^2)
[1] 101417

## perform PLS using the full data set, using M = 2
> pls.fit = plsr(Salary~., data=Hitters, scale=TRUE, ncomp=2)
> summary (pls.fit)
```
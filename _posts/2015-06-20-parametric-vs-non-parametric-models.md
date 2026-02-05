---
category: Math
description: ''
tags:
- Math-Statistics
title: Parametric vs. non-parametric models
---

在查 non-parametric tests 时，Wikipedia 上提到了 [Non-parametric models](https://en.wikipedia.org/wiki/Nonparametric_statistics#Non-parametric_models)，于是干脆就记录一下。参考 [Wikipedia: Parametric model](https://en.wikipedia.org/wiki/Parametric_model)。

-----

In statistics, a **parametric model** or **parametric family** or **finite-dimensional model** is a family of distributions that can be described using a **finite** number of parameters. These parameters are usually collected together to form a single $k$-dimensional parameter vector $\theta = (\theta_1, \theta_2, \cdots, \theta_k)$.

Parametric models are contrasted with the **semi-parametric**, **semi-nonparametric**, and **non-parametric** models, all of which consist of an infinite set of “parameters” for description. The distinction between these four classes is as follows:

- a model is “parametric” if all the parameters are in finite-dimensional parameter spaces;
- a model is “non-parametric” if all the parameters are in infinite-dimensional parameter spaces;
- a “semi-parametric” model contains finite-dimensional parameters of interest and infinite-dimensional nuisance ([ˈnju:sns], something annoying) parameters;
- a “semi-nonparametric” model contains finite-dimensional and infinite-dimensional unknown parameters of interest.

常见的 non-parametric model 比如：KNN, SVM, splines.
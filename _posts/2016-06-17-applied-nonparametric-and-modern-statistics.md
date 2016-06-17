---
layout: post
title: "Applied Nonparametric and Modern Statistics"
description: ""
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

Course site: [Applied Nonparametric and Modern Statistics](http://www.biostat.jhsph.edu/~ririzarr/Teaching/754/)

-----

## 1. Introduction

A common scenario in applied statistics is that one has an independent variable or outcome $Y$ and various dependent variable or covariates $X_1,\dots,X_p$. One usually observes these variables for various “subjects”.

Statisticians usually assume that $Y$ and the $X$’s are random variables. Then one can summarize a lot of questions by asking: what is $\mathrm{E}[Y \vert X_1, \dots, X_p]$? We usually call $f(X_1, \dots, X_p) = \mathrm{E}[Y \vert X_1, \dots, X_p]$ the _**regression function**_.

It should be noted that for some designed experiments it does not make sense to assume the $X$'s are random variables. In this case we usually assume we have “design points” $x_{1i}, \dots, x_{pi}, i=1,\dots,n$ and non-IID observations $Y_1, \dots, Y_n$ for each design point. In most cases, the theory for both these cases is very similar if not the same. These are called the _random design model_ and _fixed design model_ respectively.

How do we learn about $\mathrm{E}[Y \vert X_1, \dots, X_p]$?

- Linear Regression: $\mathrm{E}[Y \vert X_1, \dots, X_p] = \sum_{j=1}^{p} X_j \beta_j$
- Generalized Linear Model (GLM): $g(\mathrm{E}[Y \vert X_1, \dots, X_p]) = \sum_{j=1}^{p} X_j \beta_j$
	- $g$ is called a _**link function**_. We can also write $\mathrm{E}[Y \vert X_1, \dots, X_p] = g^{-1}(\sum_{j=1}^{p} X_j \beta_j)$
	- It is typical to assume the conditional distribution of $Y$ is part of an exponential family, e.g. binomial, Poisson, gamma, etc.
	- Many times the link function is chosen for mathematical convenience.
	
Linear Models Pros:

- Having the convenience that the parameters $\beta$ usually have direct interpretation with scientific meaning.
- Once an appropriate model is in place, the estimates have many desirable properties.

Linear Models Cons:

- These models are quite restrictive. Linearity and additivity are two very strong assumptions. This may have practical consequences. 
	- E.g., by assuming linearity one may never notice that a covariate has an effect that increases and then decreases. 
- By relaxing assumptions we loose some of the nice properties of estimates. There is an on going debate about <font color="red">specification vs. estimation</font>.
	
In this class we will:

- Start by introducing various smoothers useful for smoothing scatter plots $\lbrace (X_i, Y_i), i = 1,\dots, n\rbrace$ where both $X$ and $Y$ are continuous variables.
- Set down precise models and outline the proofs of asymptotic results.
- Introduce local regression (_**loess**_).
- Examine spline models and some of the theory behind splines.
- Some smoothers are more flexible than others. However <font color="red">with flexibility comes variance</font>. We will talk about the bias-variance trade-off and how one can <font color="red">use resampling methods to estimate bias and variance</font>.
- After explaining all these smoothers we will make a connection between them. We will also make connections to other statistical procedures.
- We will examine the case were one has many covariates. One can <font color="red">relax the linearity assumption</font>, assume additivity and use additive models. One can also forget the additivity assumption and use regression trees.
- After all this we will be ready to <font color="red">consider the case where is not necessarily continuous</font>. We will generalize to this case and look at _**Generalized Additive Models**_ and _**Local Likelihood**_.
- While examining all these subjects we will be considering various models for one data set. We will briefly discuss techniques that can be used to aid <font color="red">in the choice of such models</font>.
- Finally we will look at a brief introduction of times series analysis.

We will begin the class talking about the case were the regression function $f$ will depend on a single, real-valued predictor $X$ ranging over some possibly infinite interval of the real line, $I \subseteq \mathbb{R}$. Therefore, the (mean) dependence of $Y$ on $X$ is given by

$$
	f(x) = \mathrm{E}[Y \vert X], x \in I \subseteq \mathbb{R}
	\tag{1.1}
	\label{eq1.1}
$$

The data to support such investigations are typically a set of $n$ paired observations $(X_1, Y_1), \dots, (X_n,Y_n)$. These can be either a random sample of the joint distribution of $(X,Y)$ as is the case for _observational studies_, or fixed input values $\lbrace x_i \rbrace$, arising perhaps from a _designed experiment_.

So once we have the data what do we do?

If we are going to “model” $(\ref{eq1.1})$, we gain insight into the important features of the relationship between $Y$ and $X$ by entertaining various descriptions of or models for $f$. Through this exercise we might:

- identify the width and height of peaks
- explore the overall shape of $f$ in some neighborhood
- find areas of sharp increase or regions exhibiting little curvature.

<font color="red">The first three chapters of the class deal with this problem and these descriptions</font>. We will then move on to the case where we have many covariates, then cases where the expectation needs to be transformed, and various other generalization. 

## 2. Overview of various smoothers


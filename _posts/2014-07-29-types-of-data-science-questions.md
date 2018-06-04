---
layout: post
title: "Types of Data Science Questions"
description: ""
category: Machine-Learning
tags: []
---
{% include JB/setup %}

摘自 [Six Types Of Analyses Every Data Scientist Should Know](http://datascientistinsights.com/2013/01/29/six-types-of-analyses-every-data-scientist-should-know) 和 [Types of Questions](https://class.coursera.org/datascitoolbox-005/lecture/57)；两者内容基本相同。

-----

## 1. Types of Data Science Questions

In approximate order of difficulty:

* Descriptive
* Exploratory
* Inferential
* Predictive
* Causal
* Mechanistic

## 2. Descriptive Analysis

Goal: 

* Describe a set of data

Features:

* The first kind of data analysis performed
* Does not predict anything
* Commonly applied to census ([ˈsensəs], 人口普查) data
* The description (what is the data?) and interpretation (what does the data mean?) are different steps
* Descriptions usually can not be generalized without additional statistical modeling

## 3. Exploratory Analysis

Goal: 

* Find relationships you didn't know about

Features:

* Exploratory models are good for discovering new connections
* They are also useful for defining future studies
* Exploratory analyses are usually not the final say
* Exploratory analyses alone should not be used for generalizing/predicting
* _**Correlation**_ does not imply _**Causation**_ (e.g. 巧克力与诺贝尔奖)

## 4. Inferential Analysis

Goal: 

* Aims to test theories about the nature of the world in general (or some part of it) based on samples of “subjects” taken from the world (or some part of it). That is, use a relatively small sample of data to say something about a bigger population. e.g. 从若干个 country 的情况来预测全美的情况

Features:

* Inference is commonly the goal of statistical models
* Inference involves estimating both the quantity you care about and your uncertainty about your estimate
* Inference depends heavily on both the population and the sampling scheme

## 5. Predictive Analysis

Goal: 

* To analyze current and historical facts to make predictions about future events. In essence, to use the data on some objects to predict values for another object. e.g. 预测总统选举

Features:

* If X predicts Y it does not mean that X causes Y
* Accurate prediction depends heavily on measuring the right variables
* Although there are better and worse prediction models, more data and a simple model works really well
* Quote says, "Prediction is very hard, especially about the future."

## 6. Causal Analysis

Goal: 

* To find out what happens to one variable when you make another variable change.

Features:

* Usually randomized studies are required to identify causation
* There are approaches to inferring causation in non-randomized studies, but they are complicated and sensitive to assumptions
* Causal relationships are usually identified as average effects, but may not apply to every individual
* Causal models are usually the "gold standard" (that is considered ultimate or ideal) for data analysis

## 7. Mechanistic (机理) Analysis

Goal: 

* Understand the exact changes in variables that lead to changes in other variables for individual objects.

Features:

* Incredibly hard to infer, except in simple situations
* Usually modeled by a deterministic set of equations (physical/engineering science)
* Generally the random component of the data is measurement error
* If the equations are known but the parameters are not, they may be inferred with data analysis




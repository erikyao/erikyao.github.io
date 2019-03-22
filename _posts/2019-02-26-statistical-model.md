---
layout: post
title: "Terminology Recap: Mathematical Model / Probability Model / Statistical Model"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

## Mathematical Model

Mathematical model 是一个抽象概念：[Wikipedia: Mathematical model](https://en.wikipedia.org/wiki/Mathematical_model):

> A mathematical model is a description of a system using mathematical concepts and language.

- 那至于 [system 是什么](https://en.wikipedia.org/wiki/System)？这里就不展开了，也是个抽象的概念

Mathematical models are usually composed of **relationships** and **variables**. 

- Relationships can be described by operators, such as algebraic operators, functions, differential operators, etc. 
- Variables are abstractions of system parameters of interest, that can be quantified.

参照不同的标准，Mathematical model 可以分为以下几个大类：

- **Linear vs. nonlinear**
    - 判断标准是：operator 是否是 linear 的
- **Static vs. dynamic**
    - A dynamic model accounts for time-dependent changes in the state of the system。
        - 一般会用到 differential equations (微分方程) 或者 difference equations (差分方程)
            - 注：差分方程其实就是 递推关系 (recurrence relation)，类似 $a_{n+1} = f(a_n)$ 这种
    - A static (or steady-state) model calculates the system in equilibrium, and thus is time-invariant.
- **Explicit vs. implicit**
    - Explicit 指 "all of the input parameters of the overall model are known, and the output parameters can be calculated by a finite series of computations"
    - Implicit 指 "the output parameters are unknown, and the corresponding inputs must be solved for by an iterative procedure"
        - Newton's method 即是这类 iterative procedure 的一种
- **Discrete vs. continuous**
- **Deterministic vs. probabilistic (stochastic)**
    - A deterministic model is one in which every set of variable states is uniquely determined by parameters in the model and by sets of previous states of these variables; therefore, a deterministic model always performs the same way for a given set of initial conditions. 
    - In a stochastic model, randomness is present, and variable states are not described by unique values, but rather by probability distributions.
        - 下面所说的 probability model 和 statistical model 都属于 stochastic models 的大类
- **Deductive vs. inductive**
    - A deductive model is a logical structure based on a theory. 
    - An inductive model arises from empirical findings and generalization from them. 

## Probability Model

废话少说：A probability model is defined by a probability space $(\Omega, \mathcal{F}, \mathbb{P})$. Period.

- 注：$\Omega$ 是 sample space

## Statistical Model

先看描述性定义：[Wikipedia: Statistical model](https://en.wikipedia.org/wiki/Statistical_model)

> A statistical model is a mathematical model that embodies a set of statistical assumptions concerning the generation of sample data (and similar data from a larger population). A statistical model represents, often in considerably idealized form, the data-generating process.

**All statistical hypothesis tests and all statistical estimators are derived via statistical models. More generally, statistical models are part of the foundation of statistical inference.**

Informally, a statistical model can be thought of as a set of statistical assumptions with a certain property. Assumption 可以包括："distribution 的具体定义"，"是否有 independence" 等等

Formal 的定义如下：

A statistical model is defined by $(\Omega, \mathcal{P})$ where

- $\Omega$ is the sample space
- $\mathcal{P}$ is a set of distributions on $\Omega$.

一般情况下，$\mathcal{P}$ 是一个 family of distributions，比如 "不同参数的 Gaussian distribution"：$\mathcal{P} = \lbrace \mathbb{P}_{\mathcal{N}(\sigma, \mu^2)} \mid \sigma, \mu \in \mathbb{R}\rbrace$.

这种情况下我们可以把 $\mathcal{P}$ 简写成 $\mathcal{P} = \lbrace \mathbb{P}_{\theta} \mid \theta \in \Theta\rbrace$. 

如果 $\Theta \subseteq \mathbb{R}^k$，我们称 $k$ 为 **dimension of the model**:

- The model is said to be **parametric** if it has a finite dimension
- The model is said to be **nonparametric** if it has a infinite dimension

注：dimension 不是 statistical model 专有的，其他的涉及 parameter 的 mathematical model 应该都有这个概念。参考 [Parametric vs. non-parametric models](/math/2015/06/20/parametric-vs-non-parametric-models)


---
layout: post
title: "Terminology Recap: Least Squares"
description: ""
category: Machine-Learning
tags: []
---
{% include JB/setup %}

$$
\DeclareMathOperator*{\argmin}{argmin} 

\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}

\newcommand{\icolplus}[1]{
  \Bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \Bigr]
}

\newcommand{\irow}[1]{
  \begin{smallmatrix}(#1)\end{smallmatrix}
}
$$

## 1. Least Squares 和 Regression 的关系

### 1.1 Least Squares 解决 Overdetermined Systems

[Wikipedia: Least squares](https://en.wikipedia.org/wiki/Least_squares):

> The method of least squares is a standard approach in regression analysis to approximate the solution of overdetermined systems, i.e., sets of equations in which there are more equations than unknowns. "Least squares" means that the overall solution minimizes the sum of the squares of the residuals made in the results of every single equation.

几个要点：

- 所谓 overdetermined systems 就是 "方程数比未知数多的方程组"
    - 如果有一组未知数可以满足所有的方程，我们称这组未知数为方程组 (system of equations) 的解 (solution)
    - 注意 "方程数比未知数多" 并不能保证一定有解，比如 $\begin{cases}x = 0 \\\\ x = 1\end{cases}$
- 题外话：
    - 如果 "方程数比未知数少"，我们称方程组为 underdetermined system
    - 如果 "方程数 == 未知数个数"，我们称方程组为 exactly determined system
    - 如果方程组有解 (一个、多个或无限个均可)，我们称方程组是 consistent 的
    - "方程组是否是 consistent 的" 和 "方程组的 detemined 程度" 没有任何关系
- 正因为 Overdetermined Systems 可能没有解，所以我们需要 approximate 的 solution，Least Squares 这个技术就可以提供这么一种 approximate 的 solution

若 overdetermined 方程组的所有方程都是的线性的：

- 用线性代数描述：$A \mathbf{x} = \mathbf{b}$
    - coefficient $A_{n \times m}$
    - 未知数 $\mathbf{x}_{m \times 1}$
    - 方程组的 RHS $\mathbf{b}_{n \times 1}$
    - $n > m$

### 1.2 Curve Fitting 和 Regression 产生 Overdetermined Systems

- Curve Fitting: 给定一组 $(x\_i, y\_i)$ (或者你看成两个 vector $\mathbf{x}, \mathbf{y}$)，求一个曲线 best fit 所有点
- Regression 和 Curve Fitting 基本上是一回事：给定一组 example/label $(\mathbf{x}\_i, y\_i)$，求一个 **regression function** $f(\mathbf{x}) = y$ that best fit 所有 data
    - Regression 和 Curve Fitting 的区别在于：
        - Curve Fitting 直接用掉所有的点，它不需要做 prediction
        - Regression 需要做 prediction，所以要分 training/testing，进而会有 underfitting/overfitting、variance/bias 这些问题

假定 $\mathbf{x}_i \in \mathbb{R}^m$。当你有 $n > m$ 个点时，给定一个 regression function $f$，必然可以构成一个 Overdetermined System：

$$
\begin{cases}
    f(\mathbf{x}_1) = y_1 \\
    \cdots \\
    f(\mathbf{x}_n) = y_n
\end{cases}
$$

- 注意此时你的未知数不是 $\mathbf{x}$ ($\mathbf{x}$ 现在明明是已知)，而是每一分量上的系数，有 $\mathbb{R}^m$ 这 $m$ 个维度，就有 $m$ 个系数

假定 $f$ 是关于 $\mathbf{x}$ 的线性函数：

- 用线性代数描述：$\icolplus{\mathbf{x\_1} \newline \vdots \newline \mathbf{x}\_n} \mathbf{w} = \mathbf{y}$
    - $\mathbf{x_i} \in \mathbb{R}^m$
    - coefficient $\icolplus{\mathbf{x\_1} \newline \vdots \newline \mathbf{x}\_n}\_{n \times m}$
    - 未知数 $\mathbf{w}_{m \times 1}$
    - 方程组的 RHS $\mathbf{y}_{n \times 1}$
    - $n > m$

### 1.3 进而 Least Squares 可以解决 Regression

只要确定了 $f$ 的形式，比如你假设 $f$ 是关于 $\mathbf{x}$ 的线性函数，那么你就得到一个关于未知数 $\mathbf{w}$ 的 Overdetermined System。注意这个 Overdetermined System 不一定有解，那么此时我们就可以用 Least Squares 来 approximate 得到一组近似的 $\mathbf{w}$

## 2. Least Squares 的一般形式

很简单，假定 regression function $f$ 关于 $\mathbf{x}$ 的系数是 $\mathbf{w}$，令 **residual** $r\_i = y\_i - f(\mathbf{x\_i} , \mathbf{w})$，Least Squares 即是一个优化问题：

$$
\argmin_{\mathbf{w}} \sum_{i=1}^{n} r_i^2
$$

所以 least squares 完整形式是 least sum of squared residuals

恶心的部分：这个 $\sum_{i=1}^{n} r_i^2$ 又可以叫做：

- RSS: Residual Sum of Squares
- SSR: Sum of Squared Residuals
- SSE: Sum of Squared Errors

第一，你起这么多名字做甚？就一个名字不好么？第二，SSR 和 SSE 没啥问题，你个 RSS 根本就讲不通好吗？负分滚粗！

## 3. Linear Least Squares

当 $f$ 是关于 $\mathbf{x}$ 的线性函数时，上述优化问题变成 "求 $\mathbf{w}$ 可以获得 least sum of squares of linear residuals"

Linear Least Squares 又分为三种：

- Ordinary Least Squares (OLS)
- Weighted Least Squares (WLS)
- Generalized Least Squares (GLS)

### 3.1 Ordinary Least Squares (OLS)

- [Regression (statistics): What is the difference between Ordinary least square and generalized least squares?](https://www.quora.com/Regression-statistics-What-is-the-difference-between-Ordinary-least-square-and-generalized-least-squares)
- [How does OLS regression relate to generalised linear modelling](https://stats.stackexchange.com/questions/211585/how-does-ols-regression-relate-to-generalised-linear-modelling/211592)
- [OLS in Matrix Form](https://web.stanford.edu/~mrosenfe/soc_meth_proj3/matrix_OLS_NYU_notes.pdf)

注意：

- OLS 是可以给出解析解的：$\hat{\mathbf{w}}=(\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf {y}$，用 $\frac{\partial \sum_{i=1}^{n} r_i^2}{\partial \mathbf{w}} = 0$ 推导即可
- 但是这个计算可能会很 expensive，这时候一个 workaround 是 Gradient Descent:
    - [Why use gradient descent for linear regression, when a closed-form math solution is available?](https://stats.stackexchange.com/questions/278755/why-use-gradient-descent-for-linear-regression-when-a-closed-form-math-solution)
    - [Do we need gradient descent to find the coefficients of a linear regression model?](https://stats.stackexchange.com/questions/160179/do-we-need-gradient-descent-to-find-the-coefficients-of-a-linear-regression-mode)
- 我们并没有一开始就假设 $\mathbf{y} = \mathbf{X} \mathbf{w} + \mathbf{\epsilon}$ 然后 $\epsilon \sim \mathcal{N}$，而是从结果反推，把解析解带入后得到 $r_i$ 的表达式，然后发现 $r \sim \mathcal{N}$

OLS 是 MLE 的特殊形式：

- [Maximum likelihood estimators and least squares](http://people.math.gatech.edu/~ecroot/3225/maximum_likelihood.pdf)

## 4. Non-linear Least Squares

## 5. Shrinkage & Regularization (Ridge / Lasso / ElasticNet)

To Be Continued.
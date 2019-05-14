---
layout: post
title: "Terminology Recap: Least Squares (and MLE)"
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

## 1. Least Squares Approximation

首先要搞清楚的一点是 least squares 的全称其实是 Least Squares Approximation (我自己给它起个名字叫 LSA 好了)，所以它本质是一个 approximation。这一点很重要，因为就像 MLE，不管你记不记得住它具体长啥样，但你看名字就知道它是一个 estimation。

那 approximation 有很多大类，比如：

- Numerical approximation
    - A numerical method is a mathematical tool to solve numerical problems
        - 对这一大类算法的研究即是 numerical analysis
    - Numerical approximation is one such numerical method that approximates the solution of a numerical problem
        - 所以自然 numerical approximation 也是 numerical analysis 的研究范畴
- Function approximation (approximation of a target function by a usually simpler function of a well-define class)
    - 对这一大类算法的研究即是 functional analysis
- Diophantine approximation (approximation of real numbers by rational numbers)

那 LSA 属于 numerical approximation。

## 2. LSA approximate 的是 Overdetermined Systems 的解

[Wikipedia: Least squares](https://en.wikipedia.org/wiki/Least_squares):

> The method of least squares is a standard approach in regression analysis to approximate the solution of overdetermined systems, i.e., sets of equations in which there are more equations than unknowns. "Least squares" means that the overall solution minimizes the sum of the squares of the residuals made in the results of every single equation.

几个要点：

- 方程组 (system of equations, 我自己给它起个名字叫 SoE 好了) 这个概念应该可以不用解释了
    - 如果有一组未知数可以满足所有的方程，我们称这组未知数为方程组的解 (solution)
- 假设我们是一个 linear SoE，有 $n$ 个 variables, 那么每个 equation **determines** a hyperplane in $n$-dimensional space. 
    - The solution set is the intersection of these hyperplanes, and is a flat, which may have any dimension lower than $n$.
- 这么一来，determinedness 就好理解了：
    - 如果 $\\#(\text{equaltions}) > \\#(\text{variables})$，我们称 SoE 为 **overdetermined**
    - 如果 $\\#(\text{equaltions}) < \\#(\text{variables})$，我们称 SoE 为 **underdetermined**
    - 如果 $\\#(\text{equaltions}) = \\#(\text{variables})$，我们称 SoE 为 **exactly determined**
- 但是 overdeterminedness 并不能保证一定有解，比如 $\begin{cases}x = 0 \\\\ x = 1\end{cases}$
    - 正因为 overdetermined SoE 可能没有解，所以我们需要 approximate 的 solution，**LSA 就是干这个的**
- 题外话：
    - 如果 SoE 有 solution (一个、多个或无限个均可)，我们称 SoE 是 consistent 的
    - SoE 的 consistentency 与 determinedness 没有任何关系

若 overdetermined SoE 的所有 equations 都是 linear 的，我们可以用线性代数描述：

- SoE: $A \mathbf{x} = \mathbf{b}$
    - coefficients: $A_{n \times m}$ ($n > m$)
    - variables: $\mathbf{x}_{m \times 1}$
    - RHS $\mathbf{b}_{n \times 1}$

## 3. Regression 可以看成是一个 overdetermined SoE

- Regression：给定一组 $(\mathbf{x}\_i, y\_i)$，求一个 **regression function** $f(\mathbf{x}) = y$ that best fit 所有 data
- Regression 和 Curve Fitting 的区别在于：
    - Curve Fitting: 给定一组 $(x\_i, y\_i)$ (或者你看成两个 vector $\mathbf{x}, \mathbf{y}$)，求一个曲线 best fit 所有点
    - Curve Fitting 直接用掉所有的点，它不需要做 prediction
    - Regression 需要做 prediction，所以要分 training/testing，进而会有 underfitting/overfitting、variance/bias 这些问题

假定 $\mathbf{x}_i \in \mathbb{R}^m$。当你有 $n > m$ 个点时，给定一个 regression function $f$，必然可以构成一个 overdetermined SoE:

$$
\begin{cases}
    f(\mathbf{x}_1) = y_1 \\
    \cdots \\
    f(\mathbf{x}_n) = y_n
\end{cases}
$$

- 注意此时你的 variables 不是 $\mathbf{x}$，$\mathbf{x}$ 现在变成了实际的 coefficients，而原来的 coefficients 则是实际的 variables
- 有 $\mathbb{R}^m$ 这 $m$ 个维度，就有 $m$ 个 coefficients

假定 $f$ 是关于 $\mathbf{x}$ 的线性函数，我们可以用线性代数描述：

- SoE: $\icolplus{\mathbf{x\_1} \newline \vdots \newline \mathbf{x}\_n} \mathbf{w} = \mathbf{y}$
    - single coefficient: $\mathbf{x_i} \in \mathbb{R}^m$
    - coefficient matrix: $\icolplus{\mathbf{x\_1} \newline \vdots \newline \mathbf{x}\_n}\_{n \times m}$ ($n > m$)
    - variables: $\mathbf{w}_{m \times 1}$
    - RHS: $\mathbf{y}_{n \times 1}$

## 4. 进而 LSA 可以 approximate Regression 问题的解

只要假定了 $f$ 的形式，比如你假设 $f$ 是关于 $\mathbf{x}$ 的线性函数，那么你就得到一个关于未知数 $\mathbf{w}$ 的 overdetermined SoE。这个 overdetermined system 不一定有解，我们可以用 LSA 来 approximate 得到一组近似的解 $\mathbf{w}’$ (进而就得到一个近似的 $f'$)

### 4.1 LSA 求解 Regression 问题的一般形式

令 **residual** $r\_i = y\_i - f(\mathbf{x\_i} , \mathbf{w})$，LSA 即是一个优化问题：

$$
\argmin_{\mathbf{w}} \sum_{i=1}^{n} r_i^2
$$

- 所以 LSA 本质上是 least sum of squared residuals

恶心的部分：这个 $\sum_{i=1}^{n} r_i^2$ 又可以叫做：

- RSS: Residual Sum of Squares
- SSR: Sum of Squared Residuals
- SSE: Sum of Squared Errors

第一，你起这么多名字做甚？就一个名字不好么？第二，SSR 和 SSE 没啥问题，你个 RSS 根本就讲不通好吗？负分滚粗！

### 4.2 Linear LSA

当 $f$ 是关于 $\mathbf{x}$ 的线性函数时，上述优化问题变成 "求 $\mathbf{w}$ 可以获得 least sum of squares of linear residuals"

而 Linear LSA 又分为三种：

- Ordinary Least Squares (OLS)
- Weighted Least Squares (WLS)
- Generalized Least Squares (GLS)

#### 4.2.1 对 Linear Regression 而言，LSA 等价与 MLE，OLS 等价与 minimizing $\operatorname{MSE}$

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

OLS vs GLM in R code:

- [How does OLS regression relate to generalised linear modelling](https://stats.stackexchange.com/a/211592)


---
category: Machine-Learning
description: ''
tags:
- SVM
title: Soft Margin Intuition
---

起手式：

$$
\begin{align}
	& \underset{w, b}{\text{minimize}}
	& & \frac{1}{2} \left  \vert  w \right  \vert ^2 \newline
	& \text{subject to}
	& & y^{(i)}(w^T x^{(i)} + b) \geq 1, & i = 1, \cdots, n
	\tag{1}
	\label{eq1}
\end{align}
$$

考虑到 $ y^{(i)} = \pm 1$，所以 $ \left  \vert  w^T x^{(i)} + b \right  \vert  $ 代表了 $ x_i $ 的 functional distance。

简单一点考虑，我们的 margin 画在 $ x = 1 $ 和 $ x = -1 $，然后要求 $ y^{(i)}(w^T x^{(i)} + b) \geq 1 $ 就相当于 $ w^T x^{(i)} + b $ 不是在 $ (-\infty,-1] $ 就是在 $ [1, +\infty) $。

我们这里引入一个概念上的函数 $ dist(x) $ 来表示越 margin 的 distance，举几个例子：

* $ dist(x_i) = 1.2 $ 表示 $ x_i $ 在 margin 外 0.2
* $ dist(x_i) = 1.0 $ 表示 $ x_i $ 在 margin 上，i.e. $ x_i $ 是 support vector
* $ dist(x_i) = 0.8 $ 表示 $ x_i $ 在 margin 内 0.2
* $ dist(x_i) = 0 $ 表示 $ x_i $ 在 hyperplane 上
* $ dist(x_i) = -0.8 $ 表示 $ x_i $ 超过 hyperplane 0.8，i.e. 在对面 margin 内 0.2
* $ dist(x_i) = -1.0 $ 表示 $ x_i $ 超过 hyperplane 1.0，i.e. 在对面 margin 上
* $ dist(x_i) = -1.2 $ 表示 $ x_i $ 超过 hyperplane 1.2，i.e. 在对面 margin 外 0.2

这样我们引入的 slack variable $ \xi_i $ 就可以定义成：

$$
	\xi_i = \left \{ 
	\begin{matrix}
		& 0, & dist(x_i) \geq 1 \newline
		& 1 - dist(x_i), & dist(x_i) < 1
	\end{matrix} 
	\right.
	\tag{2}
	\label{eq2}
$$

$ \xi_i $ 可以理解成 "$ x_i $ 越过 margin 的量"：

* 如果你是老老实实在 margin 外，僭越量就是 0
* 超 margin 0.2，僭越量 0.2
* 在 hyperplane 上，僭越量 1.0
* 在对面 margin 上，僭越量 2.0
* 依此类推

我们只限定僭越总量，i.e. 限定 $ \sum_{i=1}^{m}{\xi_i} \leq C $，$ C $ 是常量。至于这个总量你怎么使用，那是你自己的事情，你可以一个 $ \xi_i $ 就全部用完，也可以每个分别用一点，甚至一点也不用也可以。

这样一来，我们的优化问题转成：

$$
\begin{align}
	& \underset{w, b}{\text{minimize}}
	& & \frac{1}{2} \left  \vert  w \right  \vert ^2 + C \sum_{i=1}^{m}{\xi_i} \newline
	& \text{subject to}
	& & y^{(i)}(w^T x^{(i)} + b) \geq 1 - \xi_i, & i = 1, \cdots, n \newline
	& & & \xi_i \geq 0, & i = 1, \cdots, n
	\tag{3}
	\label{eq3}
\end{align}
$$
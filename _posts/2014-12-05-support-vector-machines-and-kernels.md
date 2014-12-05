---
layout: post-mathjax
title: "Support Vector Machines and Kernels"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

之前一直没搞清楚，这里理一理思路。

总结自 [Support Vector Machines and Kernels for Computational Biology](http://www.ploscompbiol.org/article/info:doi/10.1371/journal.pcbi.1000173)、[CS229 Lecture note 3](http://cs229.stanford.edu/notes/cs229-notes3.pdf) 和 ESL。

-----

## 1. Intro

To start with, we will be considering a linear classifier for a binary classification problem with labels \\( y \in {-1,1} \\) and features \\( x \\). We will use parameters \\( w \\), \\( b \\) instead of \\( \theta \\), and write our classifier as 

$$
\begin{aligned}
	h(x) = g(w\^T x + b)
	\tag{1}
	\label{eq1}
\end{aligned}
$$ 

Here, \\( g(z) = 1 \\) if \\( z \geq 0 \\), and \\( g(z) = −1 \\) otherwise.

我们称

$$
\begin{aligned}
	f(x) = w\^T x + b
	\tag{2}
	\label{eq2}
\end{aligned}
$$

为 **discriminant function**。

\\( f(x) = 0 \\) 就构成了我们的 hyperplane，intuition 什么的我就不说了。

考虑到 margin 时，我们要注意一个问题，那就是 margin 的度量。按 [CS229 Lecture note 3](http://cs229.stanford.edu/notes/cs229-notes3.pdf) 的说法，实际我们有：

$$
\begin{aligned}
	\text{functional margin} = \text{geometric margin} \times \left \\| w \right \\|
	\tag{3}
	\label{eq3}
\end{aligned}
$$

这样其实有点不好记。另一种表达方式是：如果 \\( x\^{\*} \\) 是 support vector 的话，那么 \\( f(x\^{\*}) = w\^T x\^{\*} + b = \pm1 \\)（这个其实是 functional margin），此时 (geometric) margin 等于 \\( \frac{1}{\left \\| w \right \\|} \\)。

顺便说一下记号：

$$
\begin{aligned}
	w\^T x = \left \langle w,x \right \rangle = \left \\| w \right \\|\^2
\end{aligned}
$$

* \\( w\^T x = \left \langle w,x \right \rangle \\) 叫 inner product (内积) 或者 dot product
* \\( \left \\| w \right \\| \\) 称为 vector 的 norm (模)
* \\( \frac{w}{\left \\| w \right \\|} \\) 称为 unit-length vector (单位向量，模为 1)

## 2. The Non-Linear Case

There is a straightforward way of turning a linear classifier non-linear, or making it applicable to non-vectorial data. It consists of mapping our data to some vector space, which we will refer to as the feature space, using a function \\( \phi \\). The discriminant function then is

$$
\begin{aligned}
	f(x) = w\^T \phi(x) + b 
	\tag{4}
	\label{eq4}
\end{aligned}
$$

Note that \\( f(x) \\) is linear in the **feature space** defined by the mapping \\( \phi \\); but when viewed in the original **input space** then it is a nonlinear function of \\( x \\) if \\( \phi(x) \\) is a nonlinear function.

这个 mapping \\( \phi \\) 可能会很复杂（比如 \\( X = [x\_1, x\_2, x\_3] \\), \\( \phi(X) = [x\_1\^2, \cdots, x\_3\^2] \\)），这样计算 \\( f(x) \\) 就很不方便。

而 Kernel 号称： 

> Kernel methods avoid this complexity by avoiding the step of explicitly mapping the data to a high dimensional feature-space.

接下来我们就来看下 Kernel 是如何做到这一点的。

## 3. Lagrange duality 登场

我们先不考虑 \\( \phi \\)。

我们要求 maximum margin，就是求 \\( \max{\frac{1}{\left \\| w \right \\|}} \\)，也就是求 \\( \min{\left \\| w \right \\|} \\)。所以这个问题可以写成：

$$
\begin{aligned}
	& \underset{w, b}{\text{minimize}}
	& & \frac{1}{2} \left \\| w \right \\|\^2 \\\\
	& \text{subject to}
	& & y\^{(i)}(w\^T x\^{(i)} + b) \geq 1, & i = 1, \cdots, n
	\tag{5}
	\label{eq5}
\end{aligned}
$$

改写一下：

$$
\begin{aligned}
	& \underset{w, b}{\text{minimize}}
	& & \frac{1}{2} \left \\| w \right \\|\^2 \\\\
	& \text{subject to}
	& & - y\^{(i)}(w\^T x\^{(i)} + b) + 1 \leq 0, & i = 1, \cdots, n
	\tag{OPT}
	\label{eqopt}
\end{aligned}
$$

yes! \\( (\ref{eqopt}) \\) 出来啦！\\( g\_i(w) = - y\^{(i)}(w\^T x\^{(i)} + b) + 1 \\)，然后 \\( h\_i(w) \\) 不存在，所以标准的 Lagrangian \\( L(x, \alpha, \beta) \\) 中，\\( x \\) 要换成 \\( (w,b) \\)，\\( \beta \\) 不需要，于是变成了：

$$
\begin{aligned}
	L(w, b, \alpha) = \frac{1}{2} \left \\| w \right \\|\^2 - \sum\_{i=1}\^{m}{\alpha\_{i} [y\^{(i)}(w\^T x\^{(i)} + b) - 1]}
	\tag{6}
	\label{eq6}
\end{aligned}
$$

Let's find the dual form of the problem. To do so, we need to first minimize \\( L(w, b, \alpha) \\) with respect to \\( w \\) and \\( b \\) (for fixed \\( \alpha \\)), to get \\( \theta\_{D} \\), which we'll do by setting the derivatives of \\( L \\) with respect to \\( w \\) and \\( b \\) to zero. We have:

$$
\begin{aligned}
	\nabla\_{w}{L(w, b, \alpha)} &= w - \sum\_{i=1}\^{m}{\alpha\_i y\^{(i)} x\^{(i)}} = 0 \\\\
	w &= \sum\_{i=1}\^{m}{\alpha\_i y\^{(i)} x\^{(i)}}
\end{aligned}
$$

剩下的 dual problem，KTT 什么的我就不推了。把上式代入 discriminant function 有：

$$
\begin{aligned}
	f(x) & = w\^T x + b \\\\
	& = \left \( \sum\_{i=1}\^{m}{\alpha\_i y\^{(i)} x\^{(i)}} \right \)\^T x + b \\\\
	& = \sum\_{i=1}\^{m}{\alpha\_i y\^{(i)} \left \langle x\^{(i)},x \right \rangle } + b
	\tag{7}
	\label{eq7}
\end{aligned}
$$

Hence, if we've found the \\( \alpha\_i \\)'s, in order to make a prediction, we have to calculate a quantity that depends only on the inner product between \\( x \\) and the points in the training set. Moreover, we saw earlier that the \\( \alpha\_i \\)'s will all be 0 except for the support vectors. Thus, many of the terms in the sum above will be 0, and we really need to find only the inner products between \\( x \\) and the support vectors (of which there is often only a small number) in order calculate \\( (\ref{eq7}) \\) and make our prediction.

## 4. Kernels

现在我们再来考虑 \\( \phi \\)。类似地，当 \\( f(x) = w\^T \phi(x) + b \\) 时，我们按上面那一套可以得到：

$$
\begin{aligned}
	f(x) & = w\^T \phi(x) + b \\\\
	& = \sum\_{i=1}\^{m}{\alpha\_i y\^{(i)} \left \langle \phi(x\^{(i)}),\phi(x) \right \rangle} + b
	\tag{8}
	\label{eq8}
\end{aligned}
$$

这样我们就可以定义 kernel function 为：

$$
\begin{aligned}
	K(x, x') = \left \langle \phi(x),\phi(x') \right \rangle
	\tag{9}
	\label{eq9}
\end{aligned}
$$

除了上一节末尾说的计算方便之外，kernel 还有一个作用就是：我现在可以不用关心 \\( \phi \\) 具体是个什么函数，我只要把 \\( \left \langle \phi(x\^{(i)}),\phi(x) \right \rangle \\) 设计出来就可以了。类似于 "屏蔽底层技术细节"。

最后，我觉得 kernel 的命名应该是 "kernel of discriminant function" 的意思。
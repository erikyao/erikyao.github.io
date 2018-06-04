---
layout: post
title: "Structured Output Support Vector Machines"
description: ""
category: Machine-Learning
tags: [SVM]
---
{% include JB/setup %}

总结自 [Flexible discriminative learning with
structured output support vector machines](http://www.robots.ox.ac.uk/~vedaldi/assets/svm-struct-matlab/tutorial/ssvm-tutorial-handout.pdf)，非常好的一份 tutorial。

-----

## 1. Intro

Structured output SVMs Extends SVMs to handle arbitrary output spaces, particularly ones with non-trivial structure (e.g. space of poses, textual translations, sentences in a grammar, etc.).

这一篇的符号：

* $ w^T x $ 叫 **score**
* $ \hat{y}(x;w) $ 其实就是 $ h(x) $
* $ sign(x) $ 就是 $ g(x) $，用 $ sign $ 还标准些
* 没有使用 $ b $，直接 $ \hat{y}(x;w) = w^T x $
* $ \phi $ 称为 **feature map**
	* With a feature map, the nature of the input $ x $ is irrelevant (image, video, audio, ...).
* 优化问题里使用了 **hinge loss** $ L $
	* 0-1 classification 的情况下，$ L^{(i)}(w) = \max \lbrace 0, 1 - y^{(i)}(w^T x^{(i)}) \rbrace $
	* 如果是 Support Vector Regression（直接用 $ w^T x $ 来预测 $ y $ 的值），则 $ L^{(i)}(w) = \left  \vert  y^{(i)} - w^T x^{(i)} \right  \vert  $，因为是 1 阶的，也称 $ L^1 $ error
	* hinge loss is a convex function
* 然后它的优化问题是 minimize $ E(w) = \frac{\lambda}{2} \left  \vert  w \right  \vert ^2 + \frac{1}{n}\sum_{i=1}{n}{L^{(i)}(w)} $	

## 2. SSVM

之前有说过：In structured output learning, the discriminant function becomes a function $ f(x, y) $ of both inputs and labels, and can be thought of as measuring the compatibility of the input $ x $ with the output $ y $. 这里我们定义：

$$
\begin{align}
	f(x,y) = w^T \Psi(x,y)
	\tag{1}
	\label{eq1}
\end{align}
$$

$ \Psi $ 称为 **joint feature map**。

进而 SSVM 变成一个搜索问题：

$$
\begin{align}
	& \underset{y \in \mathcal{Y}}{\arg\max}
	& w^T \Psi(x,y)
	\tag{2}
	\label{eq2}
\end{align}
$$

是不是有点 maximum likelihood 的意味？不过这个式子没有概率上的意义。

等式右边求 $ \arg \max $ 的部分，我们称为 **Inference Problem**。The efficiency of using a structured SVM (after learning) depends on how quickly the inference problem can be solved.

Standard SVMs can be easily interpreted as a structured SVMs:

* output space: $ y \in \mathcal{Y} = \lbrace -1, 1 \rbrace $
* joint feature map: $ \Psi(x,y) = \frac{y}{2} x $
* inference: $ \hat{y}(x;w) = \underset{y \in \lbrace -1, 1 \rbrace}{\arg\max} \, \frac{y}{2} w^T x = sign(w^T x) $

## 3. The surrogate loss

类似 hinge loss，SSVM 也有一个 **loss function** $ \Delta $，优化问题于是写成 minimize $ E(w) = \frac{\lambda}{2} \left  \vert  w \right  \vert ^2 + \frac{1}{n}\sum_{i=1}{n}{\Delta(y^{(i)}, \hat{y}(x^{(i)};w))} $，但这是一个 non-convex 问题。一般的做法是找一个 **convex surrogate loss**（还是用 $ L(w) $ 表示）来逼近 $ \Delta(y, \hat{y}) $.

The key in the success of the structured SVMs is the existence of good surrogates. The aim is to make minimising $ L^{(i)}(w) $ have the same effect as minimising $ \Delta(y^{(i)}, \hat{y}(x^{(i)};w)) $, 具体的术语是要求 $ L^{(i)}(w) $ 是 $ \Delta(y^{(i)}, \hat{y}(x^{(i)};w)) $ 的 tight binding approximation。但是 tight 的要求比较严格，所以一般有个能用的 surrogate 就可以了。常用的 surrogate 有：

* Margin rescaling surrogate: $ L^{(i)}(w) = \underset{y \in \mathcal{Y}}{\sup} \, \Delta(y, \hat{y}) + [w^T \Psi(x^{(i)},y) - w^T \Psi(x^{(i)},y^{(i)})] $
	* $ \sup $ 表示 "最小上界"
* Slack rescaling surrogate: $ L^{(i)}(w) = \underset{y \in \mathcal{Y}}{\sup} \, \Delta(y, \hat{y}) [1 + w^T \Psi(x^{(i)},y) - w^T \Psi(x^{(i)},y^{(i)})] $

-----

后面还讲了 `Cutting plane algorithm`、`BMRM: cutting planes with a regulariser` 等内容以及 Matlab 的实现，这里就不展开了。
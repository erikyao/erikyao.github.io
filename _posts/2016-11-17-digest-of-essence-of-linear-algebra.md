---
layout: post
title: "Digest of Essence of Linear Algebra"
description: ""
category: Math
tags: [Math-Algebra]
---
{% include JB/setup %}

$$
\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}

\newcommand{\irow}[1]{
  \begin{smallmatrix}(#1)\end{smallmatrix}
}
$$

## Chapter 1 - Vectors, what even are they?

> The introduction of numbers as coordinates (by reference to the the particular division scheme of the open one-dimensional continuum) is an act of violence. ―Hermann Weyl

Mathematicians' perspective:

- A vector can be anything where there's a sensible notion of adding two vectors and multiplying a vector by a number.
    - I.e. 只要实现了 “可以两两相加” 和 “可以与一个数相乘” 的都可以叫 vector

如果要从 geometrics 的角度来理解的话，我们最好把每个 vector 都理解为：

- An arrow inside a coordinate system, with it's tail sitting at the origin (原点) (Sorry, Hermann Weyl)
    - 虽然理论上，vectors can freely sit anywhere in the space. 
- A vector $\vec v = \icol{a \newline b}$ gives instructions for how to get from its tail to its tip.
    - First walk along 1st axis for $a$ units;
    - then walk along 2nd axis for $b$ units.

### 1.1 Adding two vectors

假设有 $\vec v = \icol{a \newline b}$ 和 $\vec w = \icol{c \newline d}$，那么 vector 加法 $ \vec v + \vec w$ 可以理解为：

- First walk along 1st axis for $a$ units;
- then walk along 2nd axis for $b$ units;
- then walk along 1st axis for $c$ units;
- then walk along 2nd axis for $d$ units.
- 或者
    - First walk along 1st axis for $a+c$ units;
    - then walk along 2nd axis for $b+d$ units.
- 简单的实数加法也可以这么理解，比如 $2+5$：
    - First walk (along the only axis) for $2$ units;
    - then walk for $5$ units;
    - you would walk $7$ units in total.

### 1.2 Multiplying a vector by a number

- $2 \cdot \vec v$ means you stretch out $\vec v$ so that it's $2$ times as long as before.
    - First walk along 1st axis for $2a$ units;
    - then walk along 2nd axis for $2b$ units.
- $-2 \cdot \vec v$ means first flip $\vec v$ then stretch it out by factor of $2$.
- $\frac{1}{3} \cdot \vec v$ means you squish it down so that it's $\frac{1}{3}$ of the original length.

This process of 1) stretching or 2) squishing or 3) sometimes reversing the direction of a vector is called **_scaling_**. The number you used to scale the vector is called a **_scalar_**. (翻译为 “标量”. Never mind.) In fact, throughout linear algebra, one of main things that numbers do is to scale vectors.

## Chapter 2 - Linear combinations, span, and basis vectors

> Mathematics requires a small dose, not of genius, but of imaginative freedom which, in a larger dose, would be insanity. ―Angus K. Rodgers
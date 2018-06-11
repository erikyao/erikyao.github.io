---
layout: post
title: "Divergence / Gradient / Laplace Operator"
description: ""
category: Math
tags: [Math-Algebra]
---
{% include JB/setup %}

$$
\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}
$$

注意这里反复使用了 $\nabla$，但要注意的是，$\nabla$ 并不是一个有统一定义的 operator，它只是一个符号而已，在不同的高阶 operator 定义中有不同的解读和记法。具体可以参见 [Wikipedia: Del](https://en.wikipedia.org/wiki/Del)

-----

## Divergence

Quote from [Wikipedia: Divergence](https://en.wikipedia.org/wiki/Divergence):

Let $x$, $y$, $z$ be a system of Cartesian coordinates in 3-dimensional Euclidean space, and let $\mathbf{i}$, $\mathbf{j}$, $\mathbf{k}$ be the corresponding basis of unit vectors. The **divergence** of a continuously differentiable vector field $F = U \mathbf{i} + V \mathbf{j} + W \mathbf{k}$ is defined as the scalar-valued function:

$$
\operatorname {div} \mathbf {F} = \nabla \cdot \mathbf {F} = \left ( {\frac {\partial }{\partial x}}, {\frac {\partial }{\partial y}}, {\frac {\partial }{\partial z}} \right) \cdot (U,V,W) = {\frac {\partial U}{\partial x}} + {\frac {\partial V}{\partial y}} + { \frac {\partial W}{\partial z}}.
$$

注意：

1. 写法。$F = U \mathbf{i} + V \mathbf{j} + W \mathbf{k}$ 其实就是 $\vec F = \icol{U \newline V \newline W}$，它其实是一个 vector 
1. 这里 $\nabla \cdot \mathbf {F}$ 明显不是 dot product，但是计算方法类似，最后的结果是一个 scalar
1. Gradient 的写法 $\nabla f$ 不带这个 dot

## Divergence 的物理意义

Quote from [Erik Anson's answer on Quora](https://www.quora.com/What-is-the-physical-meaning-of-divergence-curl-and-gradient-of-a-vector-field/answer/Erik-Anson):

Imagine a fluid, with the vector field representing the velocity of the fluid at each point in space. Divergence measures the net flow of fluid **out of** (i.e., **diverging from**) a given point. If fluid is instead flowing **into** that point, the divergence will be negative. 

A point or region with positive divergence is often referred to as a "source" (of fluid, or whatever the field is describing), while a point or region with negative divergence is a "sink".

Quote from [Better Explained - Vector Calculus: Understanding Divergence](https://betterexplained.com/articles/divergence/):

The bigger the flux density (positive or negative), the stronger the flux source or sink. A div of zero means there’s no net flux change in side the region.

从这个角度来看，**divergence 更像是 gradient of vector fields**

## Laplace Operator

注意我们把 laplace operator 写作 $\nabla^2$ 其实是有原因的。其实你对 gradient field 求 divergence，就有：

$$
\begin{aligned}
\nabla \cdot \nabla f(x, y, z) &= \left ( {\frac {\partial }{\partial x}}, {\frac {\partial }{\partial y}}, {\frac {\partial }{\partial z}} \right) \cdot \left ( \frac{\partial f}{\partial x}(x,y,z), \frac{\partial f}{\partial y}(x,y,z), \frac{\partial f}{\partial z}(x,y,z) \right ) \newline
                               &= \frac {\partial^{2} f}{\partial x^{2}}(x,y,z) + \frac {\partial^{2} f}{\partial y^{2}}(x,y,z) + \frac {\partial^{2} f}{\partial z^{2}}(x,y,z) \newline
                               &= \nabla^2 f(x, y, z)
\end{aligned}
$$

which happens to be the $lap$ of $f(x, y, z)$.

I.e. $\operatorname{lap} f = \operatorname{div}(\operatorname{grad} f)$

注意 $\nabla \cdot \nabla$ 仍然不是 dot product，而且我们把这个结果写成 $\nabla^2$ 也是人为规定的，完全是为了简便记法，所以并不什么特别的 operator 叠加法则。
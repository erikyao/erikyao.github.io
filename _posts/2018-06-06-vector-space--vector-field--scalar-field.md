---
category: Math
description: ''
tags:
- Math-Algebra
title: Vector Space / Vector Field / Scalar Field / 
toc: true
toc_sticky: true
---

## Vector Space

见 [Vector Space](/math/2024/04/07/elementary-algebraic-structures#vector-space-rightarrow-v-boldsymbol-vec0-boldsymbolcdot-bar1_k)

$$
\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}
$$

## Vector Field

### 定义

首先注意 vector field 和 algebraic structures 中的 field 不相干，它纯纯就是个函数。

Quote from [Lecture 19: Vectorfields, Math S21a: Multivariable calculus by Oliver Knill, Harvard Summer School](http://www.math.harvard.edu/~knill/teaching/summer2011/handouts/53-vectorfield.pdf):

> A **vector field** in a 2D plane is a function, which maps each point $(x, y)$ to a vector $\vec F(x, y) = \langle P(x, y), Q(x, y) \rangle = \icol{P(x, y) \newline Q(x, y)}$. 
> 
> A **vector field** in a 3D space is a function, which maps each point $(x, y, z)$ to a vector $\vec F(x, y, z) = \langle P(x, y, z), Q(x, y, z), R(x, y, z) \rangle = \icol{P(x, y, z) \newline Q(x, y, z) \newline R(x, y, z)}$.

关于 $P,Q,R$ 的定义：
- 以 2D 的情况为例，假定 $x,y \in \mathbb{R}$，那么 $P: \mathbb{R} \times \mathbb{R} \to \mathbb{R}$
- 也就是说，输入一个 point $(x,y)$，$\vec F$ 会输出一个新的点 $(P(x, y), Q(x, y))$
  - 也可以理解成输出一个新的 vector $\icol{P(x, y) \newline Q(x, y)}$

注意 "point" 和 "vector" 的等价性，我们可以简单理解成：Given a vector space $S$, a vector field is a function $\vec{F}: S \to S$，可以解读成：
- $\vec{F}: \text{point} \to \text{point}$
- $\vec{F}: \text{point} \to \text{vector}$
- $\vec{F}: \text{vector} \to \text{vector}$
- $\vec{F}: \text{vector} \to \text{point}$

### 举例

似乎把 $\vec F$ 理解成 $\vec{F}: \text{point} \to \text{vector}$ 是最直观的，physics 中有很多应用。

我自己做了一个例子：想象 $x^2 + y^2 = 1$ 这个圆在顺时针转动（圆心不动），每个点都沿切线有一个速度，这个切线速度我们用一个单位向量表示（暂不考虑向量长度的物理意义）。考虑圆与 axes 的 4 个交点：

- $\vec F(1, 0) = \langle 0， -1 \rangle = \icol{0 \newline -1}$
- $\vec F(0, 1) = \langle 1， 0 \rangle = \icol{1 \newline 0}$
- $\vec F(-1, 0) = \langle 0， 1 \rangle = \icol{0 \newline 1}$
- $\vec F(0, -1) = \langle -1， 0 \rangle = \icol{-1 \newline 0}$

**我们把这 4 个向量分别移动到对应的 4 个交点上（起点重合）**，可以得到：

![](/assets/posts/2018-06-06-vector-space--vector-field--scalar-field/1.jpg)

这个 vector field 的定义可以归纳为 $\vec F(x, y) = \langle y, -x \rangle = \icol{y \newline -x}$。如果限定 $\vec F$ 的 domain 为 $\lbrace (x, y) \mid x^2 + y^2 = 1 \rbrace$，那么 $\vec F$ 的 image 就是圆上所有顺时针切线单位向量的集合。

如果不限定 domain，我们用 Wolfram 画一下：

```r
VectorPlot[{y, -x}, {x, -3, 3}, {y, -3, 3}]
```

![](/assets/posts/2018-06-06-vector-space--vector-field--scalar-field/2.jpg)

可见向量的长度其实是有实际意义的。不过很多 vector field 的示意图里，由于 magnitude 的问题，向量经常画成统一的长度，然后用颜色来表示向量的长度级别。

其实这个概念你联系物理应用就很好理解。磁场 (Magnetic Field)、洋流 (Ocean Current)、风向以及其他各种流体力学，比如风洞 (Wind Tunnel) 测试，都可以用 vector field 表示：

![](/assets/posts/2018-06-06-vector-space--vector-field--scalar-field/3.jpg)

![](/assets/posts/2018-06-06-vector-space--vector-field--scalar-field/4.jpg)

![](/assets/posts/2018-06-06-vector-space--vector-field--scalar-field/5.jpg)

![](/assets/posts/2018-06-06-vector-space--vector-field--scalar-field/6.jpg)

**所以 vector field 无非是用向量表示空间内每个点的 "运动趋势"**，只是 $\vec F(\dots)$ 这个向量需要移动到对应的点上。

- 从这个角度来看，linear transformation 与 vector field 的区别在于：$A \vec x$ 并没有移动到 $\vec x$ 的终点上，而是仍然以原点为起点。

### 升维或者降维的 vector field

我们前面说 vector field 可以简单理解成 function $\vec{F}: S \to S$，是假设了 $\vec{F}$ 没有改变维度，这也是 physics 中最常见的情况。

但升维或者降维的 vector field 也是存在的，i.e. $\vec{F}: S \to S'$ where $S$ 和 $S'$ 的维度不同

Scalar Field $\vec{F}: S \to \mathbb{R}$ 即是一种降维的 vector field：
- $S$ 是二维
- $\mathbb{R}$ 是一维

升维的 vector field 会有很神奇的拓扑变形效果，比如 [YouTube: Transformations, part 3 \| Multivariable calculus \| Khan Academy](https://www.youtube.com/watch?v=U2SQXHMqclc&list=PLSQl0a2vh4HC5feHa6Rc5c0wbRTx56nF7&index=14) 介绍的这个：

$$
\vec F(t, s) = \icol{3\cos(t) + \cos(t)\cos(s) \newline 3\sin(t) + \sin(t)\cos(s) \newline \sin(s)}
$$

限定 $0 \leq t \leq 2 \pi, 0 \leq s \leq 2 \pi$，可以从一个正方形变形成一个 donut。

### Continuous Vector Field

Quote from [Wikipedia: Vector field](https://en.wikipedia.org/wiki/Vector_field):

> If each component of $\vec F$ is continuous, then $\vec F$ is a **continuous vector field**, and more generally $\vec F$ is a **$C^k$ vector field** if each component of $\vec F$ is $k$ times continuously differentiable.

## Scalar Field

A **scalar field** in a space is a function mapping each point $(x, y, z, \dots)$ to a scalar.

典型的应用：heat map

注意要与曲线方程区别。比如 $y = x$ 是对角直线，和 field $F(x, y) = x - y$ 是不同的，后者是 heat map，只是对角线上的值为 0：

```r
DensityPlot[x-y,{x,-10000,10000},{y,-10000,10000}]
```

![](/assets/posts/2018-06-06-vector-space--vector-field--scalar-field/7.jpg)